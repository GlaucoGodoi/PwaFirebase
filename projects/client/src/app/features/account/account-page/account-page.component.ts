import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'common-lib';

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
        
        <img [src]="pictureUrl.value" >

        </fieldset>
      </mat-card-content>
      <mat-card-actions>
        <lib-save-cancel (onCancel)="handleCancel()" (onSave)="handleSave()" [allowSave]="localForm.valid && !localForm.pristine" ></lib-save-cancel>
      </mat-card-actions>
    </mat-card>
   </div>
  `,
  styleUrls: ['./account-page.component.scss']
})
export class AccountPageComponent implements OnInit {

  public localForm!: FormGroup;

  private isBusy: boolean = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private userSvc: UserService  
  ) { }

  public ngOnInit(): void {
    this.localForm = this.fb.group({
      id: [''],
      username: ['',[Validators.required, Validators.minLength(3), Validators.maxLength(42)]],
      email: ['', [Validators.required, Validators.email]],
      pictureUrl: ['', [Validators.required, Validators.maxLength(500), Validators.pattern('^(https)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]$')]]
    })

    this.localForm.patchValue(this.userSvc.currentUser);

  }

  public handleCancel(): void {            
    this.router.navigate(['/home']);
  }

  public handleSave(): void {
    this.isBusy = true;

    setTimeout(() => {
      this.isBusy=false;
    }, 2000);
  }

  public get username(): AbstractControl {    
    return this.localForm.controls['username'] ;
  }

  public get email(): AbstractControl { 
    return this.localForm.controls['email'];
  }

  public get pictureUrl(): AbstractControl {
    return this.localForm.controls['pictureUrl'];
  }

}
