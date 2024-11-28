import {ChangeDetectorRef, Component, OnInit,} from '@angular/core';
import {User} from '../models/user';
import {UserService} from '../services/user.service';
import Swal from 'sweetalert2';
import {ActivatedRoute, Router, RouterOutlet} from '@angular/router';
import {NabvarComponent} from './nabvar/nabvar.component';
import {SharingDataService} from '../services/sharing-data.service';

@Component({
  selector: 'user-app',
  standalone: true,
  imports: [RouterOutlet, NabvarComponent],
  templateUrl: './user-app.component.html',
  styleUrls: ['./user-app.component.css']
})
export class UserAppComponent implements OnInit {

  users: User[] = [];

  constructor(
    private router: Router,
    private service: UserService,
    private sharingData: SharingDataService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {
  }



  ngOnInit(): void {
    //this.service.findAll().subscribe(users => this.users = users);
    //this.route.paramMap.subscribe(params => {
     // const page = +(params.get('page') || '0');
      //this.service.findAllPageable(page).subscribe(pageable => this.users = pageable.content as User[]);
    //});
    //this.service.findAll().subscribe(users => this.users = users)
    this.addUser();
    this.removeUser();
    this.findUserById()
    this.pageUserEvent()
  }

  pageUserEvent(){
    this.sharingData.PageUsersEventEmitter.subscribe(users => this.users = users);
  }

  findUserById() {
    this.sharingData.FindUserByIdEventEmitter.subscribe(id => {
      const user = this.users.find(user => user.id === id);
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
      if (user.id ===0){
       this.service.create(user).subscribe( {
         next: userNew =>{
           this.users = [...this.users, {...userNew}];
           this.router.navigate(['/users']), {state: {state: this.users}};
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
              this.router.navigate(['/users']), {state: {state: this.users}};
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
              this.router.navigate(['/users'], {state: {users: this.users}})
            });
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
