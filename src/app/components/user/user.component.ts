import { Component, EventEmitter, OnInit, } from '@angular/core';
import { User } from '../../models/user';
import { Router, RouterModule } from '@angular/router';
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
    private sharingData: SharingDataService){
    if (this.router.getCurrentNavigation()?.extras.state){
      this.users = this.router.getCurrentNavigation()?.extras.state!['users'];
    }
  }

  ngOnInit(): void {
    console.log(this.users)
    if (this.users == undefined || this.users == null || this.users.length == 0){
      console.log('Consulta FindAll()')
      this.service.findAll().subscribe(users => this.users = users)
    }
  }

  onRemoveUser(id: number):void{
      this.sharingData.IdUserEventEmitter.emit(id)
  }

  onUpdateUser(user:User):void{
    this.router.navigate(['/users/edit', user.id]);
  }
}
