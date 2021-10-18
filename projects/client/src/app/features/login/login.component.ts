import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertData, AnalyticsService, AuthService, Credentials, HelperService, RemoteConfigService } from 'common-lib';
import { PushService } from '../../services/push.service';
import { PwaService } from '../../services/pwa.service';


@Component({
  selector: 'cli-login',
  template: `
    <div class="container">
      <form>        
        <mat-card class="mat-elevation-z4">
          <mat-card-header>
            <mat-card-title>Login</mat-card-title>
            <mat-card-subtitle>Choose your preferred login form.</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
          <div>
            <cli-credentials-form (onCredentialsCaptured)="loginUsingCredentials($event)" 
            [isEnabled]="remoteSvc.allowMailLogin" 
            [isHidden]="remoteSvc.hideMailLogin"
            ></cli-credentials-form>                        
          </div>
          <p>Or you can use your google account</p>
          <div class="action-login">
            <button type="button" (click)="loginUsingGmail()" color="warn" mat-raised-button>Google</button>
          </div>
          </mat-card-content>
        </mat-card>
      </form>
    </div>
  `,
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private router: Router,
    private authSvc: AuthService,
    private pwaSvc: PwaService,
    private pushSvc: PushService,
    private helperSvc: HelperService,
    public remoteSvc: RemoteConfigService
  ) { }

  public async ngOnInit(): Promise<void> {

    AnalyticsService.LogEvent('Login', 'Login page opened');
  }

  public async loginUsingCredentials(credentials: Credentials): Promise<void> {

    try {
      const result = await this.authSvc.loginUsingCredentialsAndCheckRegistration(credentials);
      if(result){
        this.router.navigate(['/register']);        
      } else {
        this.router.navigate(['/home']);
        this.handlePwaAndNotification();
        AnalyticsService.LogEvent('Login', 'Successful login using credentials');
      }
    } catch (error: any) {

      if (error && error.code === 'auth/user-not-found') {
        this.router.navigate(['/register']);
      }

    }

  }

  public async loginUsingGmail(): Promise<void> {

    try {
      const result = await this.authSvc.loginUsingGmailAndCheckRegistration();
      if (result) {
        this.router.navigate(['/register']);
      } else {
        this.router.navigate(['/home']);
        this.handlePwaAndNotification();
        AnalyticsService.LogEvent('Login', 'Successful login using gmail');
      }
    } catch (error) {
      console.log(error);
      await this.helperSvc.displayDialog({
        title: 'Error',
        message: 'There was an error during the authentication. Please try again later',
        isError: true
      } as AlertData);
    }
  }

  private handlePwaAndNotification(): void{
    this.pwaSvc.showDialog();
    setTimeout(async () => {
      await this.pushSvc.initPushNotification();
      await this.pushSvc.permitToNotify()
    }, 1000);
  }

}
