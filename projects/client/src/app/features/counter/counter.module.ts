import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListPageComponent } from './list-page/list-page.component';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { CommonLibModule } from 'common-lib';
import { CounterItemComponent } from './components/counter-item/counter-item.component';
import { MatIconModule } from '@angular/material/icon';
import { ListReadingsPageComponent } from './list-readings-page/list-readings-page.component';
import { EditCounterPageComponent } from './edit-counter-page/edit-counter-page.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ListPageComponent,
    CounterItemComponent,
    ListReadingsPageComponent,
    EditCounterPageComponent
  ],
  imports: [
    CommonModule,
    MatCardModule, MatButtonModule, MatListModule, MatIconModule,
    CommonLibModule,
    ReactiveFormsModule,
    RouterModule.forChild([      
      { path: 'editcounter', component: EditCounterPageComponent },
      { path: 'readings', component: ListReadingsPageComponent },
      { path: '', component: ListPageComponent },
    ])    
  ]
})
export class CounterModule { }
