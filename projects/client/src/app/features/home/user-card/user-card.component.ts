import { ChangeDetectionStrategy, Component} from '@angular/core';
import { AuthService } from 'common-lib';

@Component({
  selector: 'cli-user-card',
  template: `
    <div>
      <img src="{{(authSvc.userPicture|async)}}" alt="user image">
      <p>{{authSvc.userName|async}}</p>
    </div>
  `,
  styleUrls: ['./user-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserCardComponent{

  constructor(
    public authSvc: AuthService
  ) { }

}
