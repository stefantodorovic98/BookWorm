import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.css']
})
export class NewPasswordComponent implements OnInit, OnDestroy {

  newPasswordForm: FormGroup;
  message: string;
  id: number;
  newPasswordSub: Subscription;

  constructor(private service: UserService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.newPasswordForm = new FormGroup({
      newPassword: new FormControl(null, [Validators.required, Validators.pattern("^(?=.*[A-Z])(?=.*\\d)(?=.*[_|\\W])[a-zA-Z].{6,}$")]),
      newPasswordConfirmation: new FormControl(null, [Validators.required, Validators.pattern("^(?=.*[A-Z])(?=.*\\d)(?=.*[_|\\W])[a-zA-Z].{6,}$")]),
    });
    this.id = this.route.snapshot.params.id;
    this.newPasswordSub = this.service.getNewPasswordListener()
      .subscribe(response => {
        this.message = response;
      });
  }

  ngOnDestroy(): void {
    this.newPasswordSub.unsubscribe();
  }

  sendNewPassword(){
    if(this.newPasswordForm.invalid) return;
    this.service.sendNewPassword(this.id, this.newPasswordForm.value.newPassword);
  }

}
