import { Component, OnInit, } from '@angular/core';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import Swal from 'sweetalert2';
import { Router, RouterOutlet } from '@angular/router';
import { NabvarComponent } from './nabvar/nabvar.component';
import { SharingDataService } from '../services/sharing-data.service';

@Component({
  selector: 'user-app',
  standalone: true,
  imports: [RouterOutlet,  NabvarComponent],
  templateUrl: './user-app.component.html',
  styleUrls: ['./user-app.component.css']
})
export class UserAppComponent implements OnInit{



  users: User[]= [];

  constructor(
    private router: Router,
    private service:UserService,
    private sharingData: SharingDataService
  ){}

  ngOnInit(): void {
    this.service.findAll().subscribe(users => this.users = users); 
    this.addUser();
    this.removeUser();
    this.findUserById()
    }

  findUserById(){
    this.sharingData.FindUserByIdEventEmitter.subscribe(id => {
      const user = this.users.find(user => user.id == id);
      this.sharingData.SelectUserEventEmitter.emit(user);
    })
  }

  addUser(){
    this.sharingData.NewUserEventEmitter.subscribe(user => {
      if(user.id > 0){
        this.users = this.users.map(u => (u.id == user.id)? {... user}: u)
      }else{
        this.users = [... this.users, {... user, id: new Date().getTime()}];
      }
      this.router.navigate(['/users'], {state: {users: this.users}})
      Swal.fire({
        title: "Guardado",
        text: "Usuarios Guardado con éxito!",
        icon: "success"
      });
    })
    
  }

  removeUser():void{
    this.sharingData.IdUserEventEmitter.subscribe(id => {
      Swal.fire({
        title: "Seguro que quiere eliminar?",
        text: "Cuidado el usuario será eliminado del sistema!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si"
      }).then((result) => {
        if (result.isConfirmed) {
          this.users = this.users.filter(user => user.id != id);
          this.router.navigate(['users/create'], {skipLocationChange: true}).then(()=> {
            this.router.navigate(['/users'], {state: {users: this.users}})
          });
          Swal.fire({
            title: "Eliminado!",
            text: "El usuarios ha sifo eliminado con éxito!",
            icon: "success"
          });
        }
      });
    })
  }
}