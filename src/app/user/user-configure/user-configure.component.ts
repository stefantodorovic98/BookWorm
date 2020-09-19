import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { UserService } from '../user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../models/user.model';
import { IfStmt } from '@angular/compiler';

@Component({
  selector: 'app-user-configure',
  templateUrl: './user-configure.component.html',
  styleUrls: ['./user-configure.component.css']
})
export class UserConfigureComponent implements OnInit, OnDestroy {

  configureForm : FormGroup;
  id: number;
  message: string = " ";
  userConfigureSub: Subscription;
  userSub: Subscription;
  user: User = null;

  constructor(private service: UserService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.configureForm = new FormGroup({
      firstname: new FormControl(null, [Validators.required]),
      lastname:  new FormControl(null, [Validators.required]),
      birthdate: new FormControl(null, [Validators.required]),
      city: new FormControl(null, [Validators.required]),
      country: new FormControl(null, [Validators.required])
    });
    this.id = this.route.snapshot.params.id;
    this.userSub = this.service.getUserListener()
      .subscribe((data) => {
        let date: string = ""+data.birthdate;
        let arr = date.split('.');
        this.user = data;
        this.configureForm.setValue({
          firstname: data.firstname,
          lastname: data.lastname,
          birthdate: new Date(+arr[2],+arr[1]-1,+arr[0]),
          city: data.city,
          country: data.country
        });
      });
    this.service.getUser(this.id);

    this.userConfigureSub = this.service.getUserConfigureListener()
      .subscribe(data => {
        this.message = data;
      });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    this.userConfigureSub.unsubscribe();
  }

  onUserConfigure(){
    if(this.configureForm.invalid) return;
    this.service.configureUser(this.id, this.configureForm.value.firstname, this.configureForm.value.lastname,
      this.configureForm.value.birthdate, this.configureForm.value.city, this.configureForm.value.country);
  }

}
