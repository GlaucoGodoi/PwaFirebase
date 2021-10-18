import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService, LocalUser, AuthService, HelperService, AlertData, AnalyticsService } from 'common-lib';
import { PushService } from '../../../services/push.service';


@Component({
  selector: 'cli-account-page',
  template: `
  <div class="container">
    <mat-card class="mat-elevation-z4">
      <mat-card-header>
        <mat-card-title>My account</mat-card-title>
        <mat-card-subtitle>Set the data related to your account</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
      
      <fieldset [formGroup]="localForm">

        <lib-text-input label="Username" hint="First and last name" minLen="3" maxLen="42" [formElement]="username" required="true"></lib-text-input>

        <lib-text-input label="e-Mail" hint="Your e-mail" required="true" [formElement]="email"></lib-text-input>

        <lib-text-area-input label="Photo URL" hint="Your picture" [formElement]="pictureUrl" maxLen="500" rows="3"></lib-text-area-input>
        
        <img id='userImg' [src]="pictureUrl.value || '../../../assets/images/UnknownUser.svg'" onerror="this.setAttribute('src', 'assets/images/UnknownUser.svg')">

        </fieldset>
      </mat-card-content>
      <mat-card-actions>
        <lib-save-cancel [isBusy]="isBusy" 
                          (onCancel)="handleCancel()" 
                          (onSave)="handleSave()" 
                          [allowSave]="localForm.valid && (authSvc.requiresRegistration || !localForm.pristine)" 
                          [allowCancel]="!authSvc.requiresRegistration"
                          ></lib-save-cancel>
      </mat-card-actions>
    </mat-card>
   </div>
  `,
  styleUrls: ['./account-page.component.scss']
})
export class AccountPageComponent implements OnInit {

  public localForm!: FormGroup;

  public isBusy: boolean = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private userSvc: UserService,    
    private helperSvc: HelperService,
    public  authSvc: AuthService,
    private pushSvc: PushService
  ) { }

  public ngOnInit(): void {
    this.localForm = this.fb.group({
      id: [''],
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(42)]],
      email: ['', [Validators.required, Validators.email]],
      pictureUrl: ['', [Validators.maxLength(500), Validators.pattern('^(https)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]$')]]
    })

    this.localForm.patchValue(this.userSvc.currentUser);

  }

  public handleCancel(): void {
    this.router.navigate(['/home']);
  }

  public async handleSave(): Promise<void> {
    this.isBusy = true;

    const result = await this.userSvc.setUserData(this.localForm.getRawValue() as LocalUser)
    if (result) {
      this.isBusy = false;
      this.authSvc.requiresRegistration = false;
      this.authSvc.isAuthenticated.next(true);
      this.router.navigate(['/home']);
      this.helperSvc.showSnackBar('Your account has been updated');
      setTimeout(async () => {
        await this.pushSvc.initPushNotification();
        await this.pushSvc.permitToNotify()
      }, 1000);
    } else {
      this.isBusy = false;
      this.helperSvc.displayDialog({
        title: 'Error',
        message: 'An error occurred while saving your data',
        isError: true,
      } as AlertData)
    }

    AnalyticsService.LogEvent('Account', ['Save', 'AccountPageComponent']);
   
  }

  public get username(): AbstractControl {
    return this.localForm.controls['username'];
  }

  public get email(): AbstractControl {
    return this.localForm.controls['email'];
  }

  public get pictureUrl(): AbstractControl {
    return this.localForm.controls['pictureUrl'];
  }

}

// window.handleMissingPicture = function() {
//   const elem = document.querySelector('img');
//   elem?.setAttribute('src', '../../../assets/images/UnknownUser.svg');
// }
