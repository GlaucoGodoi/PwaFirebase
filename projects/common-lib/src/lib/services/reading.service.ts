import { Injectable } from '@angular/core';
import { GenericResponse } from '../dto/generic-response';
import { Reading } from '../data/reading';
import { CountersService } from './counters.service';

@Injectable({
  providedIn: 'root'
})
export class ReadingService {

  public selectedReading!: Reading

  constructor(
    private countersSvc: CountersService
  ) { }

  public get currentCounterName(): string | null {
    if (this.countersSvc.selectedCounter) {
      return this.countersSvc.selectedCounter.name;
    }
    return null;
  }

  public async save(reading: Reading): Promise<GenericResponse<void>> {
    return new Promise<GenericResponse<void>>((resolve, reject) => {
      setTimeout(() => {
        resolve({ success: true, message: 'Reading save' } as GenericResponse<void>)
      }, 2000);
    });
  }

}
