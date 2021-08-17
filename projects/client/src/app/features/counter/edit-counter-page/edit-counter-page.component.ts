import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountersService } from 'common-lib';

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
            
            <lib-date-input disabled="true" [formElement]="lastRead" label="Last read" hint="The last reading for this counter" usetime="true" usetenminutes="true"></lib-date-input>

            <lib-date-input [formElement]="nextRead" label="Next read" hint="The next reading for this counter" usetime="true" usetenminutes="true"></lib-date-input>
            
          </fieldset>

        </mat-card-content>
        <mat-card-actions>
          <lib-save-cancel (onCancel)="handleCancel()"></lib-save-cancel>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styleUrls: ['./edit-counter-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class EditCounterPageComponent implements OnInit {

  public localForm!: FormGroup;
  public action: string = 'Add';

  constructor(
    private countersSvc: CountersService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {

    this.localForm = this.fb.group({
      name: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
      lastRead: [''],
      lastValue: [''],
      nextRead: [null, [Validators.required]]
    });

    if (this.countersSvc.selectedCounter) {
      this.action = 'Edit';
      this.localForm.patchValue(this.countersSvc.selectedCounter);
    }

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

  public handleCancel(): void {
    if (this.countersSvc.selectedCounter) {
      this.localForm.patchValue(this.countersSvc.selectedCounter);
    }

    console.log(this.localForm.getRawValue());
    
  }

}
