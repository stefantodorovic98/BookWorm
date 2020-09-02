import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { User } from './models/user.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  private userMessageListener = new Subject<string>();

  getUserMessageListener(){
    return this.userMessageListener.asObservable();
  }

  registerUser(firstname:string, lastname:string, username:string, password:string,
     birthdate:Date, city: string, country:string, email:string, image: File){
       if(image!=null){
        const userData = new FormData();
        userData.append("firstname", firstname);
        userData.append("lastname", lastname);
        userData.append("username", username);
        userData.append("password", password);
        userData.append("birthdate", birthdate.toDateString());
        userData.append("city", city);
        userData.append("country", country);
        userData.append("email", email);
        userData.append("image", image, image.name);
        this.http.post<{message:string}>('http://localhost:3000/api/user/signupImage', userData)
         .subscribe((responseData) => {
           this.userMessageListener.next(responseData.message);
         }, error => {
           this.userMessageListener.next(error.error.message);
         });
       }else if(image==null){
        const user: User = {
          _id:null, firstname:firstname, lastname:lastname, username:username, password:password,
          birthdate:birthdate, city:city, country:country, email:email, imagePath:null
        };
        this.http.post<{message:string}>('http://localhost:3000/api/user/signupNoImage', user)
          .subscribe((responseData) => {
            this.userMessageListener.next(responseData.message);
          }, error => {
            this.userMessageListener.next(error.error.message);
          });
       }
     }
}
