import { Injectable } from '@angular/core';
import { LocalUser } from '../data/localUser';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public currentUser!: LocalUser;

  constructor() { } 

  public async getUserData(userId:string): Promise<LocalUser> {
    const ret = {
      id: '1',
      username: 'Abelardo Barbosa',
      email:'um.email@valido.sim',
      pictureUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7nebDZEK87u-AvX6RiCauyWSr-hc68hgXww&usqp=CAU'
    } as LocalUser;

    this.currentUser = ret;

    return ret;
  }

}
