import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditReadingPageComponent } from './edit-reading-page/edit-reading-page.component';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonLibModule } from 'common-lib';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    EditReadingPageComponent
  ],
  imports: [
    CommonModule,
    MatCardModule, MatButtonModule,
    CommonLibModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: 'editreading', component: EditReadingPageComponent }
    ])
  ]
})
export class ReadingModule { }
