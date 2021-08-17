import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
  selector: 'cli-homepage',
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav #drawer class="sidenav" fixedInViewport
          [attr.role]="(isHandset$ | async) ? 'dialog' : 'navigation'"
          [mode]="(isHandset$ | async) ? 'over' : 'side'"
          [opened]="(isHandset$ | async) === false">
        <mat-toolbar class="user-toolbar">
          <cli-user-card></cli-user-card>
        </mat-toolbar>
        <mat-nav-list class="main-menu" (click)="hideMenu()">
          <a mat-list-item [routerLink]="[ '/home/account' ]" routerLinkActive="active-link">My account</a>
          <a mat-list-item [routerLink]="[ '/home/counters' ]" routerLinkActive="active-link">My counters</a>          
          <a mat-list-item href="#">About</a>
        </mat-nav-list>
        <div class="version-holder mat-caption">version: ???</div>
      </mat-sidenav>
      <mat-sidenav-content class="main-toolbar">
        <mat-toolbar color="primary" class="curvy">
          <button
            type="button"
            aria-label="Toggle sidenav"
            mat-icon-button
            (click)="drawer.toggle()"
            *ngIf="isHandset$ | async">
            <mat-icon aria-label="Side nav toggle icon">menu</mat-icon>
          </button>
          <span>Counter</span>
        </mat-toolbar>
        <!-- Add Content Here -->
        <router-outlet></router-outlet>
        
      </mat-sidenav-content>
    </mat-sidenav-container>
    
  `,
  styleUrls: ['./homepage.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomepageComponent {

  private shouldClose: boolean = false;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => {
        this.shouldClose = result.matches;
        return result.matches;
      }),
      shareReplay()
    );

  @ViewChild('drawer', { static: true }) drawer!: MatDrawer;

  constructor(
    private breakpointObserver: BreakpointObserver,
  ) {
  }

  public hideMenu(): void {
    if (this.shouldClose) {
      this.drawer.close();
    }
  }

}
