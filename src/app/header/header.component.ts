import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from '../user/user.service';
import { LoggedUser } from '../user/models/loggedUser.model';
import { Router } from '@angular/router';
import { Notification } from '../user/models/notification.model';
import { InviteEvent } from '../user/models/inviteEvent.model';

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

  invitations: InviteEvent[] = [];
  invitationsNumber: number = 0;
  invitationsSub: Subscription = null;

  requests: InviteEvent[] = [];
  requestsNumber: number = 0;
  requestsSub: Subscription = null;


  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.loggedUser = this.userService.whoIsLogged();
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
      if(!this.invitationsSub){
        this.invitationsSub = this.userService.getInvitationsListener()
          .subscribe(data => {
            this.invitations = data;
            this.invitationsNumber = this.invitations.length;
          });
        this.userService.getAllInvitations(this.loggedUser._id);
      }
      if(!this.requestsSub){
        this.requestsSub = this.userService.getRequestsListener()
          .subscribe(data => {
            this.requests = data;
            this.requestsNumber = this.requests.length;
          });
        this.userService.getAllRequests(this.loggedUser._id);
      }
    }
    this.isUserLoggedSub = this.userService.getIsUserLoggedListener()
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
          if(!this.invitationsSub){
            this.invitationsSub = this.userService.getInvitationsListener()
              .subscribe(data => {
                this.invitations = data;
                this.invitationsNumber = this.invitations.length;
              });
            this.userService.getAllInvitations(this.loggedUser._id);
          }
          if(!this.requestsSub){
            this.requestsSub = this.userService.getRequestsListener()
              .subscribe(data => {
                this.requests = data;
                this.requestsNumber = this.requests.length;
              });
            this.userService.getAllRequests(this.loggedUser._id);
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.isUserLoggedSub.unsubscribe();
    if(this.notificationsSub) this.notificationsSub.unsubscribe();
    if(this.invitationsSub) this.invitationsSub.unsubscribe();
    if(this.requestsSub) this.requestsSub.unsubscribe();
  }

}
