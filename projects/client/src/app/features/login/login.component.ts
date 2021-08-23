import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {  AuthService, Credentials } from 'common-lib';
import { PwaService } from '../../services/pwa.service';

@Component({
  selector: 'cli-login',
  template: `
    <div class="container">
      <form [formGroup]="localForm">        
        <mat-card class="mat-elevation-z4">
          <mat-card-header>
            <mat-card-title>Login</mat-card-title>
            <mat-card-subtitle>Provide your credentials to enter the application.</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
          <div>
            <mat-form-field appearance="fill">
              <mat-label>Your e-mail</mat-label>
              <input formControlName="email" required type="email" matInput>
              <mat-hint align="start" *ngIf="email?.invalid && email?.touched"  style="color: red;">A valid e-mail is required.</mat-hint>
            </mat-form-field>
            <br><br>
            <mat-form-field appearance="fill">
              <mat-label>Password</mat-label>
              <input formControlName="password" required type="password" matInput>
              <mat-hint align="start">Minimum length is 5 characters.</mat-hint>
            </mat-form-field>
            <div class="actions-theme action-login">
              <button type="button" (click)="loginUsingCredentials()" mat-raised-button color="primary">Login</button>
            </div>
                        
          </div>
          <p>Or you can use your google account</p>
          <div class="action-login">
            <button type="button" (click)="loginUsingGmail()" color="warn" mat-raised-button>Google</button>
          </div>
          </mat-card-content>
          <!-- <mat-card-actions>
            <button type="button" color="primary" mat-button>Ok</button>
          </mat-card-actions> -->
        </mat-card>
      </form>
    </div>
  `,
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public localForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authSvc: AuthService,
    private pwaSvc: PwaService
  ) { }

  public async ngOnInit(): Promise<void> {

    this.localForm = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', Validators.required]
    })    
  }

  public async loginUsingCredentials(): Promise<void> {
    await this.authSvc.login(this.localForm.getRawValue() as Credentials);
    this.router.navigate(['/home']);
    this.pwaSvc.showDialog();
  }

  public async loginUsingGmail(): Promise<void> {
    this.pwaSvc.showDialog();
  }

  public get email():  AbstractControl | null {
    return this.localForm.get('email');
  }

  public get password(): AbstractControl | null {
    return this.localForm.get('password');
  }

}
