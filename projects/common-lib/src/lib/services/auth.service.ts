import { Injectable } from '@angular/core';
import { Credentials } from '../dto/credentials';
import { BehaviorSubject } from 'rxjs';
import { UserService } from './user.service';

import { getAuth, GoogleAuthProvider, signInWithPopup, UserCredential, signInWithEmailAndPassword, User, createUserWithEmailAndPassword } from 'firebase/auth';
import { LocalUser } from '../data/localUser';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public userName: BehaviorSubject<string | null> = new BehaviorSubject<string | null>('John Doe abcd efg');
  public userPicture: BehaviorSubject<string | null> = new BehaviorSubject<string | null>('../../../assets/images/UnknownUser.svg');
  public requiresRegistration: boolean = false;
  public get userId(): string | null {
    return this.currentUserId;
  };

  private auth = getAuth();
  private currentUserId!: string | null;

  constructor(
    private userSvc: UserService
  ) {
  }

  public async loginUsingGmailAndCheckRegistration(): Promise<boolean> {

    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    let result: UserCredential | null = null;

    try {
      result = await signInWithPopup(this.auth, provider);

    } catch (error) {
      console.log(error);
    }

    if (result && result.user) {
      const existingUser = await this.userSvc.getUserData(result.user.uid)

      this.setUserProperties(result.user, existingUser);
    }
    return this.requiresRegistration;
  }

  public async loginUsingCredentialsAndCheckRegistration(credentials: Credentials): Promise<boolean> {
    debugger;

    try {
      var result = await signInWithEmailAndPassword(this.auth, credentials.email, credentials.password)

      if (result && result.user) {
        const existingUser = await this.userSvc.getUserData(result.user.uid);
        this.setUserProperties(result.user, existingUser);
      }
      return this.requiresRegistration;

    } catch (error: any) {

      if ( error.code === 'auth/user-not-found') {
        console.log('It is a new user. Requires registration');
        await this.handleUserCreationWithCredentials(credentials);
      }

      return this.requiresRegistration;
    }


  }

  public async logout(): Promise<void> {

    await this.auth.signOut();
    this.currentUserId = null;
    this.userName.next('');
    this.userPicture.next('');
    this.isAuthenticated.next(false);
  }

  private async handleUserCreationWithCredentials(credentials: Credentials): Promise<void> {

    const response = await createUserWithEmailAndPassword(this.auth, credentials.email, credentials.password);

    this.setUserProperties(response.user,null);
    debugger;
    
  }

  private setUserProperties(user: User, existingUser: LocalUser | null): void {
    this.currentUserId = user.uid;
    this.userName.next(existingUser?.username || user.displayName);
    this.userPicture.next(existingUser?.pictureUrl || (user.photoURL || '../../../assets/images/UnknownUser.svg'));
    this.isAuthenticated.next(existingUser?.username ? true : false);
    this.requiresRegistration = existingUser?.username ? false : true;

    if (existingUser) {
      this.userSvc.currentUser = existingUser;
    } else {
      this.userSvc.currentUser = {
        id: user.uid,
        username: user.displayName,
        email: user.email,
        pictureUrl: user.photoURL
      } as LocalUser;
    }
  }

}