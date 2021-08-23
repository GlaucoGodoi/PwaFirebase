import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { AlertDialogComponent } from './components/alert-dialog/alert-dialog.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { HelperService } from '../lib/services/helper.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CameraInputComponent } from './components/camera-input/camera-input.component';
import { WebcamModule } from 'ngx-webcam';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { InstallPromptComponent } from './components/install-prompt/install-prompt.component';

@NgModule({
  declarations: [    
    SaveCancelComponent, TextInputComponent, TextAreaInputComponent, DateInputComponent, 
    AlertDialogComponent, CameraInputComponent, InstallPromptComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatProgressBarModule,
    MatInputModule, MatSelectModule, MatDialogModule, MatCardModule, MatToolbarModule,
    MatFormFieldModule, MatDatepickerModule, MatLuxonDateModule, MatSnackBarModule,
    MatIconModule,
    WebcamModule,
    ReactiveFormsModule
  ],
  exports: [
    SaveCancelComponent, TextInputComponent, TextAreaInputComponent, DateInputComponent,
    AlertDialogComponent, InstallPromptComponent
  ],
  entryComponents: [
    AlertDialogComponent, InstallPromptComponent
  ],
  providers: [
    {provide: DateAdapter, useClass: LuxonDateAdapter},
    {provide: MAT_DATE_LOCALE, useValue: 'pt-PT'},
    {provide: MAT_LUXON_DATE_ADAPTER_OPTIONS, useValue: {useUTC: 'false'}},
    HelperService
  ]
})
export class CommonLibModule { }
