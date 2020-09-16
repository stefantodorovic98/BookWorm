import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
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
  notificationsSub: Subscription;
  displayedColumns: string[] = ['text', 'link', 'read'];

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
  }

  ngOnDestroy(): void {
    this.notificationsSub.unsubscribe();
  }

  findAll(){
    if(this.takeRead){
      this.userService.getAllNotifications(this.id);
    }
  }

  change(event: MatCheckboxChange){
    this.takeRead = event.checked;
  }

  markRead(id: number){
    this.userService.markReadNotification(id);
  }

}
