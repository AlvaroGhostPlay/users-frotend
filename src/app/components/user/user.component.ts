import { Component, OnInit, } from '@angular/core';
import { User } from '../../models/user';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import { UserService } from '../../services/user.service';
import { SharingDataService } from '../../services/sharing-data.service';
import {PaginatorComponent} from "../paginator/paginator.component";
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'user',
  standalone: true,
  imports: [RouterModule, PaginatorComponent],
  templateUrl: './user.component.html'
})
export class UserComponent implements OnInit {
  title: String = 'Lista de Usuarios:';
  pageUrl: String = '/users/page'
  users: User[] = [];
  paginator: any = {};

  constructor(
    private service: UserService,
    private router: Router,
    private sharingData: SharingDataService,
    private authService: AuthService,
    private route: ActivatedRoute,){
    this.users = [];
    if (this.router.getCurrentNavigation()?.extras.state){
      this.users = this.router.getCurrentNavigation()?.extras.state!['users'];
      this.paginator = this.router.getCurrentNavigation()?.extras.state!['paginator'];
    }
  }

  ngOnInit(): void {
    if (this.users == undefined || this.users == null || this.users.length ==0) {
      console.log('Consulta FindAll()')
      this.route.paramMap.subscribe(params => {
        const page = +(params.get('page') || '0');
        this.service.findAllPageable(page).subscribe(pageable => {
          this.users = pageable.content as User[];
          this.paginator = pageable;
          this.sharingData.PageUsersEventEmitter.emit({users: this.users, paginator: this.paginator});
        });
      });
      //this.service.findAll().subscribe(users => this.users = users)
    } else if (this.users.length == 0) {
      this.route.paramMap.subscribe(params => {
        const page = +(params.get('page') || '0');
        this.service.findAllPageable(page).subscribe(pageable => {
          this.users = pageable.content as User[]
          this.sharingData.PageUsersEventEmitter.emit({users: this.users, paginator: this.paginator});
        });
      });
      //this.service.findAll().subscribe(users => this.users = users)
    }
  }

  onRemoveUser(id: number):void{
      this.sharingData.IdUserEventEmitter.emit(id)
  }

  get admin(){
    return this.authService.isAdmin();
  }
}
