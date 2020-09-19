import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Subscription } from 'rxjs';
import { Follow } from '../models/follow.model';
import { LoggedUser } from '../models/loggedUser.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-private-event-add',
  templateUrl: './private-event-add.component.html',
  styleUrls: ['./private-event-add.component.css']
})
export class PrivateEventAddComponent implements OnInit, OnDestroy {

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  fourthFormGroup: FormGroup;
  fifthFormGroup: FormGroup;

  loggedUser: LoggedUser = null;

  message: string = " ";

  private usersIFollowSub: Subscription;
  usersIFollow: Follow[] = [];
  invitedUsers: number[] = [];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.firstFormGroup = new FormGroup({
      title: new FormControl(null,[Validators.required])
    });
    this.secondFormGroup = new FormGroup({
      beginDate: new FormControl(null,[Validators.required])
    });
    this.thirdFormGroup = new FormGroup({
      endDate: new FormControl(null,[Validators.required])
    });
    this.fourthFormGroup = new FormGroup({
      description: new FormControl(null,[Validators.required])
    });
    this.fifthFormGroup = new FormGroup({
      invite: new FormControl(null,[Validators.required])
    });

    this.loggedUser = this.userService.whoIsLogged();
    if(this.loggedUser){
      this.usersIFollowSub = this.userService.getUsersIFollowListener()
      .subscribe(data => {
        this.usersIFollow = data;
      });
      this.userService.getAllUsersIFollow(this.loggedUser._id);
    }
  }

  ngOnDestroy(): void {
    if(this.usersIFollow){
      this.usersIFollowSub.unsubscribe();
    }
  }

  changeStart(event: MatCheckboxChange){
    if(event.checked){
      this.secondFormGroup.patchValue({
        beginDate: new Date()
      });
      this.secondFormGroup.get('beginDate').updateValueAndValidity();
    } else {
      this.secondFormGroup.patchValue({
        beginDate: null
      });
      this.secondFormGroup.get("beginDate").updateValueAndValidity();
    }
  }

  changeEnd(event: MatCheckboxChange){
    if(event.checked){
      this.thirdFormGroup.patchValue({
        endDate: null
      });
      this.resetMessage();
      this.thirdFormGroup.get('endDate').clearValidators();
      this.thirdFormGroup.get('endDate').updateValueAndValidity();

    } else {
      this.thirdFormGroup.get('endDate').setValidators([Validators.required]);
      this.thirdFormGroup.get('endDate').updateValueAndValidity();
    }
  }

  changeInvite(){
    this.invitedUsers = this.fifthFormGroup.value.invite;
  }

  resetMessage(){
    this.message = " ";
  }

  addEvent(){
    let beginDate: Date = this.secondFormGroup.value.beginDate;
    let endDate: Date = this.thirdFormGroup.value.endDate;
    if(endDate!==null && beginDate.getTime()>endDate.getTime()){
      this.message = "Ne moze datum pocetka da bude posle datuma kraja"
      return;
    }
    this.userService.addPrivateEvent(this.loggedUser._id, this.loggedUser.username, this.firstFormGroup.value.title,
      this.secondFormGroup.value.beginDate, this.thirdFormGroup.value.endDate, this.fourthFormGroup.value.description, this.invitedUsers);
  }



}
