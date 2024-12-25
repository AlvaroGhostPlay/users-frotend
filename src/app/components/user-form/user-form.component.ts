import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { User } from '../../models/user';
import { SharingDataService } from '../../services/sharing-data.service';
import { ActivatedRoute,  } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'user-form',
  standalone: true,
  imports: [FormsModule,],
  templateUrl: './user-form.component.html'
})
export class UserFormComponent implements OnInit {

  user: User;
  errors: any = [];

  constructor(
    private route: ActivatedRoute,
    private sharingData: SharingDataService,
    private service:UserService ){
      this.user = new User();

  }
  ngOnInit(): void {
    this.user = new User();
    this.sharingData.ErrorFormEventEmitter.subscribe(erros => this.errors = erros);
    console.log(this.errors)
    this.sharingData.SelectUserEventEmitter.subscribe(user => this.user = user); // modo con Angular
    this.route.paramMap.subscribe(params => {
      const id:number = +(params.get('id') || '0'); //covertir a string a numero con el +

      if(id > 0){
        //this.sharingData.FindUserByIdEventEmitter.emit(id); // moco con Angular
        this.service.findById(id).subscribe(user => this.user = user); //modeo backend
      }
    });
  }

  onSubmit(userForm: NgForm): void{
    //if(userForm.valid){
      this.sharingData.NewUserEventEmitter.emit(this.user);
   //}
    //userForm.reset();
    //userForm.resetForm();
  }

  onClear(userForm: NgForm): void{
    this.user = new User();
    userForm.reset();
    userForm.resetForm();
  }
}
