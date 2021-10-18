import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AnalyticsService, AuthService, Counter, CountersService } from 'common-lib';

@Component({
  selector: 'cli-edit-counter-page',
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{action}} counter</mat-card-title>
          <mat-card-subtitle>subtitle</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
        
          <fieldset [formGroup]="localForm">          
            <lib-text-input [formElement]="name" hint="Counter's name" label="Counter name" maxLen="25" minLen="3" required="true"></lib-text-input>            
            <lib-date-input formControlName="nextRead" label="Next read" placeholder="Next reading" hint="The next reading for this counter" usetime="true" usetenminutes="false" required="true"></lib-date-input>
            <lib-text-input [formElement]="frequency" label="Reading frequency" hint="Reading frequency in days" required="true"></lib-text-input>
            <lib-date-input formControlName="lastRead" label="Last read" placeholder="Last reading" hint="The last reading for this counter" usetime="true" usetenminutes="true" readonly="true"></lib-date-input>
            <lib-text-input [formElement]="lastValue" label="Last value" hint="The last value read"></lib-text-input>
          </fieldset>

        </mat-card-content>
        <mat-card-actions>
          <lib-save-cancel [isBusy]="isBusy" [allowSave]="localForm.valid && !localForm.pristine" (onCancel)="handleCancel()" (onSave)="handleSave()"></lib-save-cancel>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styleUrls: ['./edit-counter-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditCounterPageComponent implements OnInit {

  public localForm!: FormGroup;
  public action: string = 'Add';
  public isBusy: boolean = false;

  constructor(
    private countersSvc: CountersService,
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private authSvc: AuthService
  ) { }

  ngOnInit(): void {

    this.localForm = this.fb.group({
      ownerId: [this.authSvc.userId],
      id: [null],
      name: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
      lastValue: { value: null, disabled: true },
      nextRead: [null, [Validators.required]],
      lastRead: { value: null, disabled: true },
      frequency: [1, [Validators.required, Validators.min(1), Validators.max(60)]]
    });

    if (this.countersSvc.selectedCounter) {
      this.action = 'Edit';
      this.localForm.patchValue(this.countersSvc.selectedCounter);
    }

  }

  public async handleSave(): Promise<void> {
    this.isBusy = true;
    const tempRecord = this.localForm.getRawValue() as Counter
    tempRecord.frequency = Number(tempRecord.frequency);
    const response = await this.countersSvc.saveRecord(tempRecord, tempRecord.id);
    this.isBusy = false;


    if (response.success) {
      this.snackBar.open('Counter saved', 'OK', { duration: 3000 } as MatSnackBarConfig);
      setTimeout(() => {
        this.router.navigate(['/home/counters']);
      }, 700);
    }
    AnalyticsService.LogEvent('Counter', 'Saved');
  }

  public handleCancel(): void {
    this.router.navigate(['/home/counters']);
  }

  public get name(): AbstractControl {
    return this.localForm.controls['name'];
  }

  public get lastRead(): AbstractControl {
    return this.localForm.controls['lastRead'];
  }

  public get nextRead(): AbstractControl {
    return this.localForm.controls['nextRead'];
  }

  public get lastValue(): AbstractControl {
    return this.localForm.controls['lastValue'];
  }

  public get frequency(): AbstractControl {
    return this.localForm.controls['frequency'];
  }


}
