import { Injectable } from "@angular/core";
import { fetchAndActivate, getBoolean, getRemoteConfig, RemoteConfig, ensureInitialized } from "@firebase/remote-config";
import { doc, getFirestore, onSnapshot } from "firebase/firestore";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class RemoteConfigService {

    private remoteConfig!: RemoteConfig;

    public allowMailLogin: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public hideMailLogin: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

    public async init(): Promise<void> {
        
        this.remoteConfig = getRemoteConfig();

        this.remoteConfig.settings = {
            fetchTimeoutMillis: 60000,
            minimumFetchIntervalMillis: 60000 // 0.6 minutes 360000 // 6 minutes 3600000 // 6 hours
        };

        this.remoteConfig.defaultConfig = {
            'allowMailLogin': false,
            'hideMailLogin': false
        }

        await ensureInitialized(this.remoteConfig);

        await fetchAndActivate(this.remoteConfig);

        console.log('Remote config fetched and activated', getBoolean(this.remoteConfig, 'allowMailLogin'));
        this.allowMailLogin.next(getBoolean(this.remoteConfig, 'allowMailLogin'));
        this.hideMailLogin.next(getBoolean(this.remoteConfig, 'hideMailLogin'));


        this.listenChanges();

    }

    public async listenChanges(): Promise<void> {
        const fs = getFirestore();

        const configRef = doc(fs,'config','1');
        onSnapshot(configRef, async (snapshot) => {
            console.log('Remote config changed', snapshot.data());
            
            await fetchAndActivate(this.remoteConfig);
            this.allowMailLogin.next(getBoolean(this.remoteConfig, 'allowMailLogin'));
            this.hideMailLogin.next(getBoolean(this.remoteConfig, 'hideMailLogin'));
        });
    }

}