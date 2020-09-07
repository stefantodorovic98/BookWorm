import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from '../user/user.service';
import { LoggedUser } from '../user/models/loggedUser.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  isUserLoggedSub: Subscription;
  loggedUser: LoggedUser = null;
  privilege: string = "";

  constructor(private service: UserService) { }

  ngOnInit(): void {
    this.loggedUser = this.service.whoIsLogged();
    if(this.loggedUser){
      this.privilege = this.loggedUser.privilege;
    }
    this.isUserLoggedSub = this.service.getIsUserLoggedListener()
      .subscribe(user => {
        this.loggedUser = user;
        if(this.loggedUser){
          this.privilege = this.loggedUser.privilege;
        }
      });
  }

  ngOnDestroy(): void {
    this.isUserLoggedSub.unsubscribe();
  }

}
