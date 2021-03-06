import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertData, AnalyticsService, GenericResponse, HelperService, InputTypeEnum, Reading, ReadingService } from 'common-lib';
import { Location } from '@angular/common'
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { WebcamImage } from 'ngx-webcam';
import { BehaviorSubject } from 'rxjs';
import { Timestamp } from '@firebase/firestore';

@Component({
  selector: 'cli-edit-reading-page',
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{action}} reading</mat-card-title>
          <mat-card-subtitle>Set the data reading for <strong>{{counterName}}</strong></mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
        <fieldset [formGroup]="localForm">
          
          <div class="camera-button">
            <button color="primary" (click)="handleCamera()" mat-raised-button>Capture value with camera</button>
          </div>

          <img style="width: 100%;" [src]="imageAsUrl|async"/>

          <lib-text-input [formElement]="value" [inputType]="type" hint="The value that will be added to historic data" label="New value" required="true"></lib-text-input>            
          <lib-date-input placeholder="Reading date" formControlName="readingDate" title="Reading date" usetime="true" usetenminutes="true"  ></lib-date-input>

        </fieldset>
        </mat-card-content>
        <mat-card-actions>
          <lib-save-cancel (onCancel)="handleCancel()" (onSave)="handleSave()" [isBusy]="isBusy" [allowSave]="!localForm.pristine && localForm.valid"></lib-save-cancel>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styleUrls: ['./edit-reading-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditReadingPageComponent implements OnInit {

  public action: string = 'Add';
  public counterName!: string | null;
  public localForm!: FormGroup;
  public type = InputTypeEnum.NUMBER;
  public isBusy = false;
  public imageAsUrl: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(
    private readingSvc: ReadingService,
    private router: Router,
    private location: Location,
    private helperSvc: HelperService,
    private fb: FormBuilder,
    //private cd: ChangeDetectorRef,
  ) { }

  public async ngOnInit(): Promise<void> {
    
    this.localForm = this.fb.group({
      readingDate: [Timestamp.fromDate(new Date()), [Validators.required]],
      value: [null, [Validators.required]]
    });

    this.counterName = this.readingSvc.currentCounterName;
    if (this.counterName === null) {
      await this.helperSvc.displayDialog(
        {
          title: 'Reading',
          subtitle: 'Setting reading data',
          message: 'Please select a counter first',
          isError: true
        } as AlertData
      );

      this.location.back();
    }


    if (this.readingSvc.selectedReading) {
      this.action = 'Edit';
    }

    AnalyticsService.LogEvent('Reading-Edit', 'Enter');
  }


  public get value(): AbstractControl {
    return this.localForm.controls['value'];
  }

  public handleCancel(): void {
    this.location.back();
  }

  public async handleSave(): Promise<void> {
    this.isBusy = true;
    const response = await this.readingSvc.saveReadingAndUpdateCounter(this.localForm.getRawValue() as Reading,this.imageAsUrl.value);
    this.isBusy = false;
    //this.cd.markForCheck();

    if (response.success) {
      this.helperSvc.showSnackBar(response.message);
      this.location.back();
    }

    AnalyticsService.LogEvent('Reading-Edit', 'Save');
  }

  public async handleCamera(): Promise<void> {

    const response = await this.helperSvc.displayCamera();
    if(response.success && response.data) {
      this.imageAsUrl.next(response.data.imageAsDataUrl);
    }
    console.log(response);
    
  }

}
