import { Component } from '@angular/core';
import { AuthService } from 'common-lib';

@Component({
  selector: 'app-root',
  template: `
    <div *ngIf="!(authSvc.isAuthenticated|async)">
      <mat-toolbar class="sticky-top curvy">
        <span>Counters</span>
      </mat-toolbar>
      <cli-login></cli-login>
    </div>
    <router-outlet *ngIf="(authSvc.isAuthenticated|async)" ></router-outlet>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  constructor(
    public authSvc: AuthService

  ) {}

}
