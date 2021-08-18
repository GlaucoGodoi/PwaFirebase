import { Injectable } from '@angular/core';
import { GenericResponse } from '../dto/generic-response';
import { Counter } from '../data/counter';
import { Reading } from '../data/reading';

@Injectable({
  providedIn: 'root'
})
export class CountersService {

  private currentCounter!: Counter | null;
  public set selectedCounter(counter: Counter | null) {
    this.currentCounter = counter;
  }
  public get selectedCounter(): Counter | null {
    return this.currentCounter;
  }

  constructor() { }

  public async getAllCounters(): Promise<Counter[]> {
    const readings = new Array<Reading>();
    readings.push({ readingDate: new Date(), value: 10000 } as Reading);
    readings.push({ readingDate: new Date(new Date().setDate(new Date().getDate() - 5)), value: 10000 } as Reading);
    readings.push({ readingDate: new Date(new Date().setDate(new Date().getDate() - 10)), value: 10000 } as Reading);
    readings.push({ readingDate: new Date(new Date().setDate(new Date().getDate() - 10)), value: 10000 } as Reading);
    readings.push({ readingDate: new Date(new Date().setDate(new Date().getDate() - 10)), value: 10000 } as Reading);
    readings.push({ readingDate: new Date(new Date().setDate(new Date().getDate() - 10)), value: 10000 } as Reading);
    readings.push({ readingDate: new Date(new Date().setDate(new Date().getDate() - 10)), value: 10000 } as Reading);
    readings.push({ readingDate: new Date(new Date().setDate(new Date().getDate() - 10)), value: 10000 } as Reading);
    readings.push({ readingDate: new Date(new Date().setDate(new Date().getDate() - 10)), value: 10000 } as Reading);
    readings.push({ readingDate: new Date(new Date().setDate(new Date().getDate() - 10)), value: 10000 } as Reading);
    readings.push({ readingDate: new Date(new Date().setDate(new Date().getDate() - 10)), value: 10000 } as Reading);
    readings.push({ readingDate: new Date(new Date().setDate(new Date().getDate() - 10)), value: 10000 } as Reading);
    readings.push({ readingDate: new Date(new Date().setDate(new Date().getDate() - 10)), value: 10000 } as Reading);
    readings.push({ readingDate: new Date(new Date().setDate(new Date().getDate() - 10)), value: 10000 } as Reading);
    readings.push({ readingDate: new Date(new Date().setDate(new Date().getDate() - 10)), value: 10000 } as Reading);
    readings.push({ readingDate: new Date(new Date().setDate(new Date().getDate() - 10)), value: 10000 } as Reading);
    const ret = [
      { name: 'EDP/Eletricidade', lastRead: new Date(), lastValue: 12598, nextRead: (new Date(new Date().setDate(new Date().getDate() + 5))), readings: readings } as Counter,
      { name: 'EDP/Gás', lastRead: new Date(), lastValue: 43598, nextRead: new Date() } as Counter,
      { name: 'SIMAR', lastRead: new Date(), lastValue: 14598, nextRead: new Date() } as Counter,
      { name: 'EDP/Eletricidade', lastRead: new Date(), lastValue: 12598, nextRead: (new Date(new Date().setDate(new Date().getDate() + 5))) } as Counter,
      { name: 'EDP/Gás', lastRead: new Date(), lastValue: 43598, nextRead: new Date() } as Counter,
      { name: 'SIMAR', lastRead: new Date(), lastValue: 14598, nextRead: new Date() } as Counter
    ];
    //ret.length = 0;
    return ret;
  }

  public async save(counter: Counter): Promise<GenericResponse<void>> {
    return new Promise<GenericResponse<void>>((resolve, reject) => {
      setTimeout(() => {        
        resolve( {
          success: true,
          message: 'Saved'
        } as GenericResponse<void>);
      }, 2000);
    });
  }
}
