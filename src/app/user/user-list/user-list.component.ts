import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LoggedUser } from '../models/loggedUser.model';
import { User } from '../models/user.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, OnDestroy {

  private allUsersSub: Subscription;
  users: User[] = [];
  displayedColumns: string[] = ['path', 'firstname', 'lastname', 'username', 'email', 'userInfo'];
  loggedUser: LoggedUser;

  findForm: FormGroup;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.findForm = new FormGroup({
      firstname: new FormControl(null),
      lastname: new FormControl(null),
      username: new FormControl(null),
      email: new FormControl(null)
    });
    this.loggedUser = this.userService.whoIsLogged();
    this.allUsersSub = this.userService.getAllUsersListener()
      .subscribe(data => {
        this.users = data;
      });
    this.userService.getUsers(this.loggedUser._id);
  }

  ngOnDestroy(): void {
    this.allUsersSub.unsubscribe();
  }

  find(){
    this.userService.find(this.loggedUser._id, this.findForm.value.firstname, this.findForm.value.lastname,
      this.findForm.value.username, this.findForm.value.email);
  }

}
