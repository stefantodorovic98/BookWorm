import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../user.service';
import { Subscription } from 'rxjs';
import { User } from '../models/user.model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy {

  displayedColumnsForRequests: string[] = ['firstname', 'lastname', 'path', 'birthdate', 'city', 'country', 'accept', 'refuse'];
  displayedColumnsForPrivileges: string[] = ['firstname', 'lastname', 'path', 'birthdate', 'city', 'country', 'privilege', 'user', 'moderator'];
  private userRegisterRequestsSub: Subscription;
  private registredUsersSub: Subscription;
  registerRequests:User[] = [];
  registredUsers:User[] = [];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userRegisterRequestsSub = this.userService.getUserRegisterRequestsListener()
      .subscribe(data => {
        this.registerRequests = data;
      });
    this.userService.getUserRegisterRequests();
    this.registredUsersSub = this.userService.getRegistredUsersListener()
      .subscribe(data => {
        this.registredUsers = data;
        this.registredUsers = this.niceOutput(this.registredUsers);
      });
    this.userService.getRegistredUsers();
  }

  ngOnDestroy(): void {
    this.userRegisterRequestsSub.unsubscribe();
    this.registredUsersSub.unsubscribe();
  }

  niceOutput(users: User[]):User[]{
    for(let i=0;i<users.length;i++){
      if(users[i].privilege==="M") users[i].privilege="Moderator";
      else if(users[i].privilege==="U") users[i].privilege="Korisnik"
    }
    return users;
  }

  acceptRequest(id:number){
    this.userService.acceptRegisterRequest(id);
  }

  refuseRequest(id:number){
    this.userService.refuseRegisterRequest(id);
  }

  upgradeToModerator(id:number){
    this.userService.upgradeToModerator(id);
  }

  downgradeToUser(id:number){
    this.userService.downgradeToUser(id);
  }
}
