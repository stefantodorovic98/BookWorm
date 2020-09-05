import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from '../user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  message: string=" ";
  private userLoginSub: Subscription;

  constructor(private service: UserService) { }

  ngOnInit(): void {
    this.userLoginSub = this.service.getUserLoginListener()
      .subscribe((message) => {
        this.message = message;
      });
  }

  ngOnDestroy(): void {
    this.userLoginSub.unsubscribe();
  }


  onLogin(loginForm: NgForm) {
    if(loginForm.invalid) {
      return;
    }
    this.service.loginUser(loginForm.value.username, loginForm.value.password);
  }

}
