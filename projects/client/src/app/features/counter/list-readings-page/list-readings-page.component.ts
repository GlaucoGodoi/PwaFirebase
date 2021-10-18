import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { orderBy, QueryConstraint } from '@firebase/firestore';
import { AnalyticsService, Reading, ReadingService} from 'common-lib';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'cli-list-readings-page',
  template: `
   <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{readingSvc.currentCounterName}}</mat-card-title>
          <mat-card-subtitle>These are the last readings for this counter</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <mat-list>
            <mat-list-item class="list-item-holder" *ngFor="let read of records|async">
              <div class="reading-row">
                <div class="mat-caption">{{read.readingDate.toDate() | date:'yyyy/MM/dd hh:mm - EEE'}}</div>
                <div>{{read.value}}</div>
                <div *ngIf="read.image" class="img-holder">
                  <img src="data:image/jpeg;base64,{{read.image}}" alt="">
                </div>
              </div>
              <mat-divider [inset]="true"> </mat-divider>
            </mat-list-item>
          </mat-list>
          <h2 *ngIf="!(records|async)">No readings yet.</h2>
        </mat-card-content>
        <mat-card-actions>
          <a mat-button [routerLink]="['/home/counters' ]">Back</a>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  
  styleUrls: ['./list-readings-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListReadingsPageComponent implements OnInit {

  public records = new BehaviorSubject<Reading[]|null>([]);

  constructor(
    public readingSvc: ReadingService,
  ) { }

  public async ngOnInit(): Promise<void> {
    const constraints =  new Array<QueryConstraint>();
    constraints.push(orderBy('readingDate', 'desc'));
    this.records.next(await this.readingSvc.getMultipleRecords(999, constraints));
    AnalyticsService.LogEvent('ListReadingsPageComponent', 'List');
  }

}
