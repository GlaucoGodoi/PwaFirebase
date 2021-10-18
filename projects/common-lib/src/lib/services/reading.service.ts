import { Injectable } from '@angular/core';
import { Reading } from '../data/reading';
import { BaseDataService } from './base-data.service';
import { Counter } from '../data/counter';
import { GenericResponse } from '../dto/generic-response';
import { Timestamp } from '@firebase/firestore';
import {getFunctions, httpsCallable, HttpsCallableOptions} from 'firebase/functions';
import { ImageToResize } from '../dto/image-to-resize';
@Injectable({
  providedIn: 'root'
})
export class ReadingService extends BaseDataService<Reading> {

  public selectedReading!: Reading | null;
  public currentCounterName!: string | null;
  private currentPath: string = '';

  private counterId!: string;
  private counterFrequency!: number;

  constructor(
  ) {
    super();
  }

  public setCurrentCounter(counter: Counter | null) {
    if (counter) {

      this.currentCounterName = counter.name || null;
      this.counterId = counter.id;
      this.currentPath = counter ? `counters/${counter.id}/reading` : '';
      this.counterFrequency = counter.frequency || 7;
      super.pathToData = this.currentPath;

    } else {

      this.currentCounterName = null;
      super.pathToData = '';

    }

  }

  public async saveReadingAndUpdateCounter(reading: Reading, image: string): Promise<GenericResponse<null>> {

    const nextReading = new Date();
    nextReading.setDate(nextReading.getDate() + this.counterFrequency);

    const nextRead = Timestamp.fromDate(nextReading);
    const batch = super.getABatch();

    const readingId = super.saveToABatch<Reading>(batch, this.currentPath, reading);
    super.saveToABatch<{ id: string, lastRead: Timestamp, lastValue: number, nextRead: Timestamp }>(batch, 
      'counters', 
      { id: this.counterId, lastRead: reading.readingDate, lastValue: reading.value, nextRead: nextRead},this.counterId);

    const ret = {} as GenericResponse<null>;

    try {
      await batch.commit();

      ret.success = true;
      ret.message = 'Reading saved';

      await this.handleImage(`${this.currentPath}/${readingId}`, image);


    } catch (error) {

      console.log(error);
      ret.success = false;
      ret.message = 'There was an error. Please try again later.';

    }

    return ret;

  }

  private async handleImage(readingPath: string, image: string): Promise<GenericResponse<null>> {
    const ret = {} as GenericResponse<null>;

    if(!image) {
      ret.success = false;
      ret.message = 'No image provided';
      return ret;
    }

    const functions = getFunctions(undefined,'europe-west1');

    const sendImageToServer = httpsCallable<ImageToResize,{success:boolean}>(functions, 'HandleImages');

    const response = await sendImageToServer({readingPath, image});
  
    console.log(response);
    ret.success = response.data.success;
    return ret;

  }

}
