import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { passwordCheckValidator } from './password.validator';
import { UserService } from '../user.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit, OnDestroy {

  changePasswordForm: FormGroup;
  message: string;
  id: number;
  changePasswordSub: Subscription;

  constructor(private service: UserService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.changePasswordForm = new FormGroup({
      oldPassword: new FormControl(null, [Validators.required, Validators.pattern("^(?=.*[A-Z])(?=.*\\d)(?=.*[_|\\W])[a-zA-Z].{6,}$")]),
      newPassword: new FormControl(null, [Validators.required, Validators.pattern("^(?=.*[A-Z])(?=.*\\d)(?=.*[_|\\W])[a-zA-Z].{6,}$")]),
      newPasswordConfirmation: new FormControl(null, [Validators.required, Validators.pattern("^(?=.*[A-Z])(?=.*\\d)(?=.*[_|\\W])[a-zA-Z].{6,}$")])
    }, {validators: passwordCheckValidator});
    this.id = this.route.snapshot.params.id;
    this.changePasswordSub = this.service.getChangePasswordListener()
      .subscribe(data => {
        this.message = data;
      });
  }

  ngOnDestroy(): void {
    this.changePasswordSub.unsubscribe();
  }

  changePassword(){
    if(this.changePasswordForm.invalid) return;
    this.service.changePassword(this.id, this.changePasswordForm.value.oldPassword, this.changePasswordForm.value.newPassword);
  }

}
