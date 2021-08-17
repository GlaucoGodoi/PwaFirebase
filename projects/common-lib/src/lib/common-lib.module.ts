import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { DateInputComponent } from './components/date-input/date-input.component';
import { SaveCancelComponent } from './components/save-cancel/save-cancel.component';
import { TextAreaInputComponent } from './components/text-area-input/text-area-input.component';
import { TextInputComponent } from './components/text-input/text-input.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatLuxonDateModule, MAT_LUXON_DATE_ADAPTER_OPTIONS, LuxonDateAdapter } from '@angular/material-luxon-adapter';
import { MatSelectModule } from '@angular/material/select';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';


@NgModule({
  declarations: [    
    SaveCancelComponent, TextInputComponent, TextAreaInputComponent, DateInputComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatProgressBarModule,
    MatInputModule, MatSelectModule,
    MatFormFieldModule, MatDatepickerModule, MatLuxonDateModule,
    ReactiveFormsModule
  ],
  exports: [
    SaveCancelComponent, TextInputComponent, TextAreaInputComponent, DateInputComponent
  ],
  providers: [
    {provide: DateAdapter, useClass: LuxonDateAdapter},
    {provide: MAT_DATE_LOCALE, useValue: 'pt-PT'},
    {provide: MAT_LUXON_DATE_ADAPTER_OPTIONS, useValue: {useUTC: 'false'}}
  ]
})
export class CommonLibModule { }
