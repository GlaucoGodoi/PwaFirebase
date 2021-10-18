import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule, SwRegistrationOptions } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { LoginComponent } from './features/login/login.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { PwaService } from './services/pwa.service';
import { CommonLibModule, RemoteConfigService } from 'common-lib';

import { initializeApp } from 'firebase/app';
import { browserPopupRedirectResolver, browserSessionPersistence, connectAuthEmulator, initializeAuth } from 'firebase/auth';
import { connectFirestoreEmulator, FirestoreSettings, initializeFirestore, enableIndexedDbPersistence, CACHE_SIZE_UNLIMITED } from 'firebase/firestore';
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';
import { initializeAnalytics } from 'firebase/analytics';
import { CredentialsFormComponent } from './features/login/components/credentials-form/credentials-form.component';

const initializer = (pwaService: PwaService) => () => pwaService.initPwaPrompt();
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CredentialsFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register(/*'ngsw-worker.js'*/'combined-sw.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    } as SwRegistrationOptions),
    ReactiveFormsModule,
    MatCardModule, MatButtonModule, MatToolbarModule, MatFormFieldModule, MatInputModule,
    MatBottomSheetModule,
    CommonLibModule
  ],
  providers: [
    { provide: APP_INITIALIZER, useFactory: initializer, deps: [PwaService], multi: true }
  ],
  bootstrap: [AppComponent]
})

export class AppModule {

  constructor(
    remoteSvc: RemoteConfigService
  ) {
    const app = initializeApp(environment.firebaseConfig);

    const auth = initializeAuth(app, { 
      persistence: browserSessionPersistence, 
      popupRedirectResolver: browserPopupRedirectResolver });

    const db = initializeFirestore(app, {cacheSizeBytes:CACHE_SIZE_UNLIMITED } as FirestoreSettings);

    initializeAnalytics(app);
          
    if (environment.useEmulators) {
      console.log('Using emulators');
      connectAuthEmulator(auth, "http://localhost:9099");
      connectFirestoreEmulator(db, 'localhost', 8080);
      const functions = getFunctions(app, 'europe-west1');
      connectFunctionsEmulator(functions, "localhost", 5001);
    } else {
      enableIndexedDbPersistence(db);
    }
  }
}
