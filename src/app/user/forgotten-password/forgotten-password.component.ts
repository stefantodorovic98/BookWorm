import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm, FormGroup, Validators, FormControl } from '@angular/forms';
import { UserService } from '../user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-forgotten-password',
  templateUrl: './forgotten-password.component.html',
  styleUrls: ['./forgotten-password.component.css']
})
export class ForgottenPasswordComponent implements OnInit, OnDestroy {

  resetPasswordForm: FormGroup;
  message: string = " ";
  resetPasswordSub: Subscription;

  constructor(private service: UserService) { }

  ngOnInit(): void {
    this.resetPasswordForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
    });
    this.resetPasswordSub = this.service.getResetPasswordListener()
      .subscribe(response => {
        this.message = response;
      });
  }

  ngOnDestroy(): void {
    this.resetPasswordSub.unsubscribe();
  }


  onResetPassword(){
    this.message=" ";
    if(this.resetPasswordForm.invalid) return;
    this.service.resetPassword(this.resetPasswordForm.value.email)
  }

}
