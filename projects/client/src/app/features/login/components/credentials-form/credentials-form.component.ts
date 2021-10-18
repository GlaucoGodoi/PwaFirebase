import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Credentials } from 'common-lib';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'cli-credentials-form',
  template: `
      <form [formGroup]="localForm" [hidden]="(isHidden|async)" >        
            <mat-label  [ngClass]="{disabled: !(isEnabled|async)}" >You can use your e-mail and password.</mat-label>
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
              <button [disabled]="!(isEnabled|async)"  type="button" (click)="loginUsingCredentials()" mat-raised-button color="primary">Login</button>
            </div>                        
          </div>
      </form>
  `,
  styleUrls: ['./credentials-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CredentialsFormComponent implements OnInit, OnDestroy {

  public localForm!: FormGroup;

  @Output()
  public onCredentialsCaptured: EventEmitter<Credentials> = new EventEmitter<Credentials>();

  
  @Input()
  public isEnabled: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  @Input()
  public isHidden: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private subs = new Array<Subscription>();

  constructor(
    private formBuilder: FormBuilder,
  ) { }

  public ngOnInit(): void {
    this.localForm = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', Validators.required]
    })

    this.subs.push(this.isEnabled.subscribe(isEnabled => {
      if(isEnabled){
        this.localForm.enable();
      } else {
        this.localForm.disable();
      }
    }));
  }

  public ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  public loginUsingCredentials(): void {

    const credentials: Credentials = this.localForm.value;

    this.onCredentialsCaptured.emit(credentials);
  }

  public get email(): AbstractControl | null {
    return this.localForm.get('email');
  }

  public get password(): AbstractControl | null {
    return this.localForm.get('password');
  }

}
