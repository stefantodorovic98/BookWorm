import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from '../user/user.service';
import { LoggedUser } from '../user/models/loggedUser.model';
import { Router } from '@angular/router';
import { Notification } from '../user/models/notification.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  isUserLoggedSub: Subscription;
  loggedUser: LoggedUser = null;
  privilege: string = "";

  notifications: Notification[] = [];
  notificationsNumber: number = 0;
  notificationsSub: Subscription = null;

  constructor(private bookService: UserService, private router: Router, private userService: UserService) { }

  ngOnInit(): void {
    this.loggedUser = this.bookService.whoIsLogged();
    if(this.loggedUser){
      this.privilege = this.loggedUser.privilege;
      if(!this.notificationsSub){
        this.notificationsSub = this.userService.getNotificationsListener()
          .subscribe(data => {
            this.notifications = data;
            this.notificationsNumber = this.notifications.length;
          });
        this.userService.getNotReadNotifications(this.loggedUser._id);
      }
    }
    this.isUserLoggedSub = this.bookService.getIsUserLoggedListener()
      .subscribe(user => {
        this.loggedUser = user;
        if(this.loggedUser){
          this.privilege = this.loggedUser.privilege;
          if(!this.notificationsSub){
            this.notificationsSub = this.userService.getNotificationsListener()
              .subscribe(data => {
                this.notifications = data;
                this.notificationsNumber = this.notifications.length;
              });
            this.userService.getNotReadNotifications(this.loggedUser._id);
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.isUserLoggedSub.unsubscribe();
    if(this.notificationsSub) this.notificationsSub.unsubscribe();
  }

}
