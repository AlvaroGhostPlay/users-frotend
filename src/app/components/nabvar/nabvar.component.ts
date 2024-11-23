import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { User } from '../../models/user';

@Component({
  selector: 'nabvar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './nabvar.component.html'
})
export class NabvarComponent {
  @Input() users: User [] = [];
}
