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
    private sharingData: SharingDataService){}

  ngOnInit(): void {
    this.service.findAll().subscribe(users => this.users = users)
  }

  onRemoveUser(id: number):void{
      this.sharingData.IdUserEventEmitter.emit(id)
  }
  
  onUpdateUser(user:User):void{
    this.router.navigate(['/users/edit', user.id]);
  }
}
