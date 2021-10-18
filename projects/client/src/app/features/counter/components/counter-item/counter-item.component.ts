import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Counter, CountersService, HelperService } from 'common-lib';

@Component({
  selector: 'cli-counter-item',
  template: `
    <div class="item-holder mat-elevation-z4">
      <div class="first-row">
        <div>{{counter.name}}</div>
        <div>{{counter.nextRead?.toDate()|date}}</div>
      </div>
      <div class="second-row mat-caption">
        <div>{{counter.lastValue}}</div>
        <div>{{counter.lastRead?.toDate()|date}}</div>
      </div>
      <div class="third-row actions-theme" *ngIf="localShowButtons">
        
        <a mat-icon-button color="warn" (click)="deleteCounter(counter)"><mat-icon>delete</mat-icon></a>
        <a mat-icon-button color="primary" [routerLink]="['readings']" (click)="selectCounter(counter)"><mat-icon>search</mat-icon></a>        
        <a mat-icon-button color="primary" [routerLink]="['editcounter']" (click)="selectCounter(counter)"><mat-icon>edit</mat-icon></a>
        <a mat-icon-button color="primary" [routerLink]="['/home/readings/editreading']" (click)="selectCounter(counter)"><mat-icon>playlist_add</mat-icon></a>
        
      </div>
    </div>
  `,
  styleUrls: ['./counter-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class CounterItemComponent {

  @Input()
  public counter!: Counter

  public localShowButtons!: boolean;
  @Input()
  public set showButtons(value: string) {
    this.localShowButtons = coerceBooleanProperty(value);
  }

  @Output() 
  public counterDeleted = new EventEmitter<void>();

  constructor(
    private counterSvc: CountersService,
    private helperSvc: HelperService
  ) { }

  public selectCounter(counter: Counter): void {
    this.counterSvc.selectedCounter = counter;
  }

  public async deleteCounter(counter: Counter): Promise<void> {

    const response = await this.counterSvc.deleteRecord(counter.id);
    if(response.success) {
      this.helperSvc.showSnackBar(`Counter ${counter.name} deleted`);
      this.counterDeleted.emit();
    } else{
      this.helperSvc.showSnackBar(`Counter ${counter.name} not deleted`);
    }

  }

}
