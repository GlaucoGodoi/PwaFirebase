import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, RemoteConfigService } from 'common-lib';
import { PwaService } from './services/pwa.service';

@Component({
  selector: 'app-root',
  template: `
    <div *ngIf="!(authSvc.isAuthenticated|async)">
      <mat-toolbar class="sticky-top curvy">
        <span>Counters</span>
      </mat-toolbar>
      <cli-login *ngIf="!authSvc.requiresRegistration"></cli-login>
      <router-outlet *ngIf="authSvc.requiresRegistration"></router-outlet>      
    </div>
    <router-outlet *ngIf="(authSvc.isAuthenticated|async)" ></router-outlet>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  constructor(
    public authSvc: AuthService,
    private pwaSvc: PwaService,
    private router: Router,
    private remoteSvc: RemoteConfigService
  ) {}

  async ngOnInit(): Promise<void> {
    this.router.navigate(['/']);
    this.pwaSvc.detectUpdates()

    await this.remoteSvc.init().then(() => {console.log('remote config init')});
  }

}
