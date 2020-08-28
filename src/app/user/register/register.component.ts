import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { passwordCheckValidator } from './password.validator';
import { ImageCheckValidator } from './image.validator';

import { UserService } from '../user.service';

import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  message: string = " ";

  siteKey: string;
  preview: string;

  extensions: string[] = [
    "jpg", "jpeg", "png"
  ];

  private userMessageSub : Subscription;

  //secret key 6LcIPr0ZAAAAAFF91uT5mkpzK05cLU75tIn7A28O
  constructor(private service: UserService) {
    this.siteKey = "6LcIPr0ZAAAAAAa3ZsA1UGQ2dOCJ0fHiQPb6R1uu";
   }

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      firstname: new FormControl(null, [Validators.required]),
      lastname:  new FormControl(null, [Validators.required]) ,
      username: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required, Validators.pattern("^(?=.*[A-Z])(?=.*\\d)(?=.*[_|\\W])[a-zA-Z].{6,}$")]),
      passwordConfirmation: new FormControl(null, [Validators.required, Validators.pattern("^(?=.*[A-Z])(?=.*\\d)(?=.*[_|\\W])[a-zA-Z].{6,}$")]),
      birthdate: new FormControl(null, [Validators.required]),
      city: new FormControl(null, [Validators.required]),
      country: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      captcha: new FormControl(null, [Validators.required]),
      image: new FormControl(null,[ImageCheckValidator(this.extensions)])
    }, {validators: passwordCheckValidator});
    this.userMessageSub = this.service.getUserMessageListener()
      .subscribe((message)=>{
        this.message = message;
      });
  }

  onRegister() {
    if(this.registerForm.invalid) return;

    this.service.registerUser(this.registerForm.value.firstname, this.registerForm.value.lastname,
      this.registerForm.value.username, this.registerForm.value.password, this.registerForm.value.birthdate,
      this.registerForm.value.city, this.registerForm.value.country, this.registerForm.value.email, this.registerForm.value.image);
  }

  onImagePicked(event: Event){
    const file = (event.target as HTMLInputElement).files[0];
    this.registerForm.patchValue({image: file});
    this.registerForm.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.preview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  @ViewChild("file", {static: false})
  input: ElementRef;

  onDefault(){
    this.input.nativeElement.value=null;
    this.registerForm.patchValue({image: null});
    this.registerForm.get('image').updateValueAndValidity();
    this.preview = null;
  }

}
