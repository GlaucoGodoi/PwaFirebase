import { Injectable } from '@angular/core';
import { Credentials } from '../dto/credentials';
import { BehaviorSubject } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public userName: BehaviorSubject<string> = new BehaviorSubject<string>('John Doe abcd efg hijk');
  public userPicture: BehaviorSubject<string> = new BehaviorSubject<string>('../../../assets/images/UnknownUser.svg');
  public get userId(): string{
    return this.currentUserId;
  }

  private currentUserId!: string;

  constructor(
    private userSvc: UserService
  ) { 

  }

  public async login(credentials: Credentials): Promise<void> {
    const userId = '';
    const currentUser = await this.userSvc.getUserData(userId);

    this.userName.next(currentUser.username);
    this.userPicture.next(currentUser.pictureUrl);

    this.isAuthenticated.next(true); 
  }

}
