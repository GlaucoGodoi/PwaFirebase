import { Injectable } from '@angular/core';
import { LocalUser } from '../data/localUser';
import { getFirestore, doc, setDoc, getDoc, SetOptions, writeBatch, arrayUnion } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public currentUser!: LocalUser;

  private afs = getFirestore();

  constructor() { }

  public async getUserData(userId: string): Promise<LocalUser | null> {

    const docRef = doc(this.afs, 'customer', userId);
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
      return docSnapshot.data() as LocalUser;
    } else {
      return null;
    }
  }

  public async setUserData(userData: LocalUser): Promise<boolean> {
    const docRef = doc(this.afs, 'customer', userData.id);
    try {
      await setDoc(docRef, userData);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  public async setFcmTokens(userId: string, fcmTokens: {}, token: string): Promise<boolean> {

    const batch = writeBatch(this.afs);

    const docRef = doc(this.afs, 'customer', userId);
    const broadcastRef = doc(this.afs, 'broadcast','1');

    try {
      batch.set(docRef, { fcmTokens: fcmTokens }, { merge: true } as SetOptions);
      batch.set(broadcastRef, { fcmToken: arrayUnion(token) }, { merge: true } as SetOptions);
      await batch.commit();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
