import { Injectable } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { take } from 'rxjs/operators';
import { InstallPromptComponent } from 'common-lib';
import { timer } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PwaService {

  private promptEvent: any;
  private currentType!: 'ios' | 'android'

  constructor(
    private bottomSheet: MatBottomSheet,
    private platform: Platform
  ) {}

  public initPwaPrompt() {
    if (this.platform.ANDROID) {
      console.log('step2');
      window.addEventListener('beforeinstallprompt', (promptEvent: any) => {
        promptEvent.preventDefault();
        this.promptEvent = promptEvent;
        this.currentType = 'android';
      });
    }
    if (this.platform.IOS) {
      let trick: any;
      trick = window.navigator;

      const isInStandaloneMode = ('standalone' in window.navigator) && (trick['standalone']);
      if (!isInStandaloneMode) {
        this.currentType = 'ios';        
      }
    }
  }

  public showDialog() {    
    if (this.currentType && ( (this.currentType==='android' && this.promptEvent) || this.currentType==='ios')) {
      this.openPromptComponent(this.currentType);
    }
  }

  private openPromptComponent(mobileType: 'ios' | 'android') {
    timer(3000)
      .pipe(take(1))
      .subscribe(() => this.bottomSheet.open(InstallPromptComponent, { data: { mobileType, promptEvent: this.promptEvent } }));
  }

}
