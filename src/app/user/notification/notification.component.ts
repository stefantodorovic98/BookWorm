import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { InviteEvent } from '../models/inviteEvent.model';
import { Notification } from '../models/notification.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit, OnDestroy {

  id: number;
  notifications: Notification[] = [];
  invitations: InviteEvent[] = [];
  requests: InviteEvent[] = [];
  notificationsSub: Subscription;
  invitationsSub: Subscription;
  requestsSub: Subscription;
  displayedColumns: string[] = ['text', 'link', 'read'];
  displayedColumnsForEvent: string[] = ['text', 'accept', 'refuse'];
  displayedColumnsForRequests: string[] = ['text', 'accept', 'refuse'];

  takeRead: boolean = false;

  notificationForm: FormGroup;

  constructor(private userService: UserService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.notificationForm = new FormGroup({
      read: new FormControl(null)
    });
    this.id = this.route.snapshot.params.id;
    this.notificationsSub = this.userService.getNotificationsListener()
      .subscribe(data => {
        this.notifications = data;
      });
    this.userService.getNotReadNotifications(this.id);

    this.invitationsSub = this.userService.getInvitationsListener()
      .subscribe(data => {
        this.invitations = data;
      });
    this.userService.getAllInvitations(this.id);

    this.requestsSub = this.userService.getRequestsListener()
      .subscribe(data => {
        this.requests = data;
      });
    this.userService.getAllRequests(this.id);
  }

  ngOnDestroy(): void {
    this.notificationsSub.unsubscribe();
    this.invitationsSub.unsubscribe();
    this.requestsSub.unsubscribe();
  }

  findAll(){
    if(this.takeRead){
      this.userService.getAllNotifications(this.id);
    } else {
      this.userService.getNotReadNotifications(this.id);
    }
  }

  change(event: MatCheckboxChange){
    this.takeRead = event.checked;
  }

  markRead(id: number){
    this.userService.markReadNotification(id);
  }

  acceptInvitation(id: number){
    this.userService.acceptInvitation(id);
  }

  refuseInvitation(id: number){
    this.userService.refuseInvitation(id);
  }

}
