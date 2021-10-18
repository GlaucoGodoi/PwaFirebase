import { Injectable } from '@angular/core';
import { AlertData, AlertResponseEnum, HelperService, UserService } from 'common-lib';
import { SwPush } from '@angular/service-worker';
import { getMessaging, isSupported, getToken, Messaging, onMessage, GetTokenOptions,  } from 'firebase/messaging';


@Injectable({
  providedIn: 'root'
})
export class PushService {

  private displayToken!: string;
  private msgSvc!: Messaging;
  private readonly vapId = 'BITJp0jYxGtdg1_A2m3qvaagvz9gouuKFPWJjPw1i6AZyB5VaJWccZji15BgPuRPZpZnVg65mSVg4K8nEOrEVoA';
                            
  constructor(
    private helperSvc: HelperService,
    private push: SwPush,
    private userSvc: UserService
  ) { }

  public async initPushNotification(): Promise<void> {

    if (await isSupported()) {

      this.push.messages.subscribe(msg => {
        console.log('push message', msg);        
      });

      //Hook to handle clicks on the notifications
      this.push.notificationClicks.subscribe(click => console.log('notification click', click));

      this.msgSvc = getMessaging();

      onMessage(this.msgSvc, msg => {

        console.log('message received', msg);

        if (msg.notification) {
          this.helperSvc.displayDialog({
            title: msg.notification.title,
            message: msg.notification.body
          } as AlertData);
        }
      });
    }

  }

  public async permitToNotify(): Promise<void> {

    if(Notification.permission === 'granted'){
      return;
    }

    const response = await this.helperSvc.displayDialog({
      title: 'Permit Notification',
      message: 'Do you want to permit notifications?',
      showYesNo: true
    } as AlertData);

    if (response === AlertResponseEnum.YES) {
      if (await isSupported()) {
        Notification.requestPermission()
          .then((permission) => {
            if (permission !== 'denied') {
              this.displayToken = 'Notification permission granted.';
            }

            getToken(this.msgSvc, {
              vapidKey: this.vapId,
              //serviceWorkerRegistration: navigator.serviceWorker.getRegistration()
            } as GetTokenOptions).then(token => {
              this.displayToken = token;

              const existingTokens = this.userSvc.currentUser.fcmTokens || {};              
              if(!existingTokens[token]) {
                const newTokens = {... existingTokens, [token]: true};
                this.userSvc.setFcmTokens(this.userSvc.currentUser.id,newTokens, token );
              }

              
              console.log('Token: ', token);
            })
          })
          .catch(err => {
            console.log('Unable to get permission to notify.', err);
          });
      } else {
        console.log('using alternative notification service');
        window.localStorage.setItem('notificationPermission', 'true');
      }
    }
  }
}
