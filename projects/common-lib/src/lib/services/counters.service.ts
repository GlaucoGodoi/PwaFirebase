import { EventEmitter, Injectable } from '@angular/core';
import { Counter } from '../data/counter';
import { BaseDataService } from './base-data.service';
import { ReadingService } from './reading.service';

@Injectable({
  providedIn: 'root'
})
export class CountersService extends BaseDataService<Counter> {

  private currentCounter!: Counter | null;
  public set selectedCounter(counter: Counter | null) {
    this.currentCounter = counter;    
    this.readingService.setCurrentCounter(counter);
  }
  public get selectedCounter(): Counter | null {
    return this.currentCounter;
  }

  public onSelectedCounterChanged: EventEmitter<Counter | null> = new EventEmitter<Counter | null>();

  constructor(
    private readingService: ReadingService
  ) {
    super();
    super.pathToData = 'counters';    
  }
}
