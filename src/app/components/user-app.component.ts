import {ChangeDetectorRef, Component, OnInit,} from '@angular/core';
import {User} from '../models/user';
import {UserService} from '../services/user.service';
import Swal from 'sweetalert2';
import {ActivatedRoute, Router, RouterOutlet} from '@angular/router';
import {NabvarComponent} from './nabvar/nabvar.component';
import {SharingDataService} from '../services/sharing-data.service';
import { AuthService } from '../services/auth.service';
import e from 'cors';

@Component({
  selector: 'user-app',
  standalone: true,
  imports: [RouterOutlet, NabvarComponent],
  templateUrl: './user-app.component.html',
  styleUrls: ['./user-app.component.css']
})
export class UserAppComponent implements OnInit {

  users: User[] = [];
  paginator: any = {};

  constructor(
    private router: Router,
    private service: UserService,
    private sharingData: SharingDataService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
  ) {
  }

  ngOnInit(): void {
    this.addUser();
    this.removeUser();
    this.findUserById()
    this.pageUserEvent()
    this.handlerLogin();
  }

  handlerLogin(){
    this.sharingData.HandlerLoginEventEmiter.subscribe(({username, password}) =>{
      console.log(username + ' ' + password);
      this.authService.loginUser({username, password}).subscribe({
        next: response =>{
          const token = response.token;
          console.log(token);
          const payload = this.authService.getPayLoad(token);

          const user= {username: payload.username};
          const login = {
            user,
            isAuth: true,
            isAdmin: payload.isAdmin
          };

          this.authService.token = token; // estos son los setter
          this.authService.user = login; // erste tambien y aqui se guarda en la sesion
          this.router.navigate(['/users/page/0']);
        },
        error: error => {
          if(error.status == 401){
            Swal.fire('Error en el Login', error.error.message, 'error');
          } else{
            throw error;
          }
        }
      })
    })

  }

  pageUserEvent(){
    this.sharingData.PageUsersEventEmitter.subscribe(pageable => {
      this.users = pageable.users;
      this.paginator = pageable.paginator;
    });
  }

  findUserById() {
    this.sharingData.FindUserByIdEventEmitter.subscribe(id => {
      console.log(id)
      const user = this.users.find(user => {
        user.id === id;
        console.log(user.id)
      } );

      if (user) {
        user.username = user.username ? user.username.trim() : '';
        user.password = user.password ? user.password.trim() : '';
        user.email = user.email ? user.email.trim() : '';
        user.name = user.name ? user.name.trim() : '';
        user.lastname = user.lastname ? user.lastname.trim() : '';
      this.sharingData.SelectUserEventEmitter.emit(user);
      }
    });
  }

  addUser(){
    this.sharingData.NewUserEventEmitter.subscribe(user =>{
        console.log(user.id)
      if (user.id ===0){
       this.service.create(user).subscribe( {
         next: userNew =>{
           console.log(userNew.id);
           this.users = [...this.users, {...userNew}];
           this.router.navigate(['/users']), {state: {users: this.users, paginator: this.paginator}};
           Swal.fire({
             title: "Guardado",
             text: "Usuario creado con éxito!",
             icon: "success"
           });
         },
         error: (err) => {
           if (err.status == 400){
             this.sharingData.ErrorFormEventEmitter.emit(err.error);
           }
         }
       });
      } else{
        this.service.update(user).subscribe(
          {
            next: (userUpdate) => {
              this.users = this.users.map(u => u.id == userUpdate.id ? {...userUpdate} : u);
              this.sharingData.SelectUserEventEmitter.emit(userUpdate);
              this.cdr.detectChanges();
              this.router.navigate(['/users']), {state: {users: this.users, paginator: this.paginator}};
              Swal.fire({
                title: "Guardado",
                text: "Usuario Editado con éxito!",
                icon: "success"
              });
            },
            error: (err) =>{
              if (err.status == 400){
              this.sharingData.ErrorFormEventEmitter.emit(err.error);
              }
              //console.log(err.error)
            }
          });
      }
    });
  }

  removeUser(): void {
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

          this.service.delete(id).subscribe(() => {
            this.users = this.users.filter(user => user.id != id);
            this.router.navigate(['/users/create'], {skipLocationChange: true}).then(() => {
              //this.router.navigate(['/users'])
              this.router.navigate(['/users'], {state: {users: this.users, paginator: this.paginator}})
            });
          });

          Swal.fire({
            title: "Eliminado!",
            text: "El usuarios ha sido eliminado con éxito!",
            icon: "success"
          });
        }
      });
    })
  }
}
