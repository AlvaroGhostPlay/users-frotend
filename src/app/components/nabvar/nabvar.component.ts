import { Component, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { User } from '../../models/user';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'nabvar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './nabvar.component.html'
})
export class NabvarComponent {

  constructor(private authService: AuthService,
    private router: Router,
  ){}

  @Input() users: User [] = [];
  @Input() paginator = {};

  get login(){
    return this.authService.user;
  }

  get admin(){
    return this.authService.isAdmin();
  }

  handlerLogout(){
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
