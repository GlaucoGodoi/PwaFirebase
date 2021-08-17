import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CountersService} from 'common-lib';

@Component({
  selector: 'cli-list-readings-page',
  template: `
   <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{countersSvc.selectedCounter?.name}}</mat-card-title>
          <mat-card-subtitle>These are the last readings for this counter</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <mat-list>
            <mat-list-item *ngFor="let read of countersSvc.selectedCounter?.readings">
              <div class="reading-row">
                <div class="mat-caption">{{read.readingDate| date:'yyyy/MM/dd - EEE'}}</div>
                <div>{{read.value}}</div>
              </div>
              <mat-divider [inset]="true"> </mat-divider>
            </mat-list-item>
          </mat-list>
          <h2 *ngIf="!(countersSvc.selectedCounter?.readings)">No readings yet.</h2>
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

  constructor(
    public countersSvc: CountersService
  ) { }

  ngOnInit(): void {
  }

}
