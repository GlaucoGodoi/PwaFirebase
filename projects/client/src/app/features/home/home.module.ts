import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomepageComponent } from './homepage/homepage.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { UserCardComponent } from './user-card/user-card.component';



@NgModule({
  declarations: [HomepageComponent, UserCardComponent],
  imports: [
    CommonModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    RouterModule.forChild(
      [
        {
          path: '', component: HomepageComponent, children: [
            { path: 'account', loadChildren: () => import('../account/account.module').then(m => m.AccountModule) },
            { path: 'counters', loadChildren: () => import('../counter/counter.module').then(m => m.CounterModule) },
          ]
        },

      ]
    )
  ]
})
export class HomeModule { }
