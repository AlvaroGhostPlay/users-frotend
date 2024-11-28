import { Component, OnInit, } from '@angular/core';
import { User } from '../../models/user';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import { UserService } from '../../services/user.service';
import { SharingDataService } from '../../services/sharing-data.service';

@Component({
  selector: 'user',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './user.component.html'
})
export class UserComponent implements OnInit {
  title: String = 'Lista de Usuarios:';
  users: User[] = [];

  constructor(
    private service: UserService,
    private router: Router,
    private sharingData: SharingDataService,
    private  route: ActivatedRoute){
    this.users = [];
    if (this.router.getCurrentNavigation()?.extras.state){
      this.users = this.router.getCurrentNavigation()?.extras.state!['users'];
    }
  }

  ngOnInit(): void {
    if (this.users == undefined || this.users == null || this.users.length ==0) {
      console.log('Consulta FindAll()')
      this.route.paramMap.subscribe(params => {
        const page = +(params.get('page') || '0');
        this.service.findAllPageable(page).subscribe(pageable => {
          this.users = pageable.content as User[]
          this.sharingData.PageUsersEventEmitter.emit(this.users);
        });
      });
      //this.service.findAll().subscribe(users => this.users = users)
    } else if (this.users.length == 0) {
      console.log('Consulta FindAll()')
      this.route.paramMap.subscribe(params => {
        const page = +(params.get('page') || '0');
        this.service.findAllPageable(page).subscribe(pageable => {
          this.users = pageable.content as User[]
          this.sharingData.PageUsersEventEmitter.emit(this.users);
        });
      });
      //this.service.findAll().subscribe(users => this.users = users)
    }
  }

  onRemoveUser(id: number):void{
      this.sharingData.IdUserEventEmitter.emit(id)
  }
}
