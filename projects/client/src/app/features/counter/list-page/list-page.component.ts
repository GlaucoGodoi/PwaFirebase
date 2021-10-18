import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { orderBy, QueryConstraint, where } from '@firebase/firestore';
import { CountersService, Counter, AnalyticsService, AuthService } from 'common-lib';

@Component({
  selector: 'cli-list-page',
  template: `
    <div class="container">
    
    <mat-card>
      <mat-card-header>
        <mat-card-title>Counters</mat-card-title>
        <mat-card-subtitle>These are the current counters in the app</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
      
      <mat-list class="list-holder">
        <mat-list-item *ngFor="let counter of counters; trackBy:trackByMethod">
          <cli-counter-item [counter]="counter" showButtons="true" (counterDeleted)="handleCounterDeleted()"></cli-counter-item>
        </mat-list-item>
      </mat-list>
      
      <h2 *ngIf="counters?.length===0">No counters yet.</h2>

      </mat-card-content>
      <mat-card-actions class="actions">                
        <a mat-button [routerLink]="[ '/home']">Back</a>
        <button mat-mini-fab (click)="addNewHandler()"><mat-icon>add</mat-icon></button>
      </mat-card-actions>
    </mat-card>

    </div>
  `,
  styleUrls: ['./list-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListPageComponent implements OnInit {

  public counters!: Counter[] | null;

  constructor(
    private countersSvc: CountersService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private authSvc: AuthService
  ) { }

  public async ngOnInit(): Promise<void> {
    await this.loadData();
    AnalyticsService.LogEvent('ListPageComponent', 'List');
  }

  public addNewHandler(): void {
    this.countersSvc.selectedCounter = null;
    this.router.navigate(['/home/counters/editcounter']);
  }

  public trackByMethod(index: number, item: Counter): string {
    return item.name;
  }

  public async handleCounterDeleted(): Promise<void> {
    await this.loadData();
  }


  private async loadData(): Promise<void> {
    const tempOrderby = orderBy('nextRead', 'desc');
    const tempWhere = where('ownerId', '==', this.authSvc.userId);
    const args = Array<QueryConstraint>();
    args.push(tempOrderby);
    args.push(tempWhere);
    this.counters = await this.countersSvc.getMultipleRecords(10, args);
    this.cd.detectChanges();
  }

}
