import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { User } from './models/user.model';
import { Auth } from './models/auth.model';
import { Find } from './models/find.model';
import { Follow } from './models/follow.model';
import { Notification } from './models/notification.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoggedUser } from './models/loggedUser.model';
import { ConfiguredUser } from './models/configuredUser.model';
import { ChangedPassword } from './models/changedPassword.model';
import { StringMap } from '@angular/compiler/src/compiler_facade_interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private router: Router) { }

  private userRegisterListener = new Subject<string>();
  private userLoginListener = new Subject<string>();
  private userListener = new Subject<User>();
  private userConfigureListener = new Subject<string>();
  private changePasswordListener = new Subject<string>();
  private resetPasswordListener = new Subject<string>();
  private newPasswordListener = new Subject<string>();
  private isUserLoggedListener = new Subject<LoggedUser>();
  private userRegisterRequestsListener = new Subject<User[]>();
  private registredUsersListener = new Subject<User[]>();

  private allUsersListener = new Subject<User[]>();

  private doIFollowListener = new Subject<Follow>();

  private usersMeFollowListener = new Subject<Follow[]>();

  private notificationsListener = new Subject<Notification[]>();

  getUserRegisterListener(){
    return this.userRegisterListener.asObservable();
  }

  getUserLoginListener(){
    return this.userLoginListener.asObservable();
  }

  getUserListener(){
    return this.userListener.asObservable();
  }

  getUserConfigureListener(){
    return this.userConfigureListener.asObservable();
  }

  getChangePasswordListener(){
    return this.changePasswordListener.asObservable();
  }

  getResetPasswordListener(){
    return this.resetPasswordListener.asObservable();
  }

  getNewPasswordListener(){
    return this.newPasswordListener.asObservable();
  }

  getIsUserLoggedListener(){
    return this.isUserLoggedListener.asObservable();
  }

  getUserRegisterRequestsListener(){
    return this.userRegisterRequestsListener.asObservable();
  }

  getRegistredUsersListener(){
    return this.registredUsersListener.asObservable();
  }

  getAllUsersListener(){
    return this.allUsersListener.asObservable();
  }

  getDoIFollowListener(){
    return this.doIFollowListener.asObservable();
  }

  getUsersMeFollowListener(){
    return this.usersMeFollowListener.asObservable();
  }

  getNotificationsListener(){
    return this.notificationsListener.asObservable();
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
           this.userRegisterListener.next(responseData.message);
           this.router.navigate(['/']);
         }, error => {
           this.userRegisterListener.next(error.error.message);
         });
       }else if(image==null){
        const user: User = {
          _id:null, firstname:firstname, lastname:lastname, username:username, password:password,
          birthdate:birthdate, city:city, country:country, email:email, imagePath:null, privilege: null,
          allowed: null
        };
        this.http.post<{message:string}>('http://localhost:3000/api/user/signupNoImage', user)
          .subscribe((responseData) => {
            this.userRegisterListener.next(responseData.message);
            this.router.navigate(['/']);
          }, error => {
            this.userRegisterListener.next(error.error.message);
          });
       }
     }

  loginUser(username: string, password: string){
    let auth : Auth = {
      username: username, password: password
    };
    this.http.post<{message:string, _id:number, username: string, privilege: string}>('http://localhost:3000/api/user/login', auth)
      .subscribe((response) => {
        let loggedUser: LoggedUser = {
          _id:response._id, username: response.username, privilege:response.privilege
        }
        localStorage.setItem("logged",JSON.stringify(loggedUser));
        this.userLoginListener.next(response.message);
        this.isUserLoggedListener.next(loggedUser);
        this.getNotReadNotifications(loggedUser._id);
        this.router.navigate(['/userInfo',response._id]);
      }, error => {
        this.userLoginListener.next(error.error.message);
      });
  }

  logoutUser(){
    localStorage.removeItem("logged");
    this.isUserLoggedListener.next(null);
    this.router.navigate(['/']);
  }

  //Za automatsko logovanje, isUserLoggedListener je za header
  isUserLogged(){
    let loggedUser: LoggedUser = JSON.parse(localStorage.getItem("logged"));
    if(loggedUser){
      this.isUserLoggedListener.next(loggedUser);
      this.router.navigate(['/userInfo', loggedUser._id]);
    }
  }

  whoIsLogged():LoggedUser{
    let user: LoggedUser = JSON.parse(localStorage.getItem("logged"));
    return user;
  }

  getUser(id:number){
    this.http.get<{message:string, data: User}>('http://localhost:3000/api/user/getUser/'+id)
      .subscribe((responseData) => {
        this.userListener.next({...responseData.data});
      });
  }

  configureUser(id: number, firstname: string, lastname:string, birthDate: Date, city: string, country: string){
    let configuredUser : ConfiguredUser = {
      firstname: firstname, lastname: lastname, birthdate: birthDate, city: city, country: country
    }
    this.http.put<{message:string}>('http://localhost:3000/api/user/updateUser/'+id, configuredUser)
    .subscribe(response => {
      this.userConfigureListener.next(response.message);
      this.router.navigate(['/userInfo', id]);
    }, error => {
      this.userConfigureListener.next(error.error.message);
    });
  }

  changePassword(id: number, oldPassword: string, newPassword: string){
    if(oldPassword===newPassword){
      this.changePasswordListener.next("Nova lozinka je ista kao stara!");
    }else {
      let temp:ChangedPassword = {
        oldPassword: oldPassword, newPassword:newPassword
      };
      this.http.put<{message:string}>('http://localhost:3000/api/user/changePassword/'+id, temp)
        .subscribe(response => {
          localStorage.removeItem("logged");
          this.changePasswordListener.next(response.message);
          this.isUserLoggedListener.next(null);
          this.router.navigate(['/']);
        }, error => {
          this.changePasswordListener.next(error.error.message);
        });
    }
  }

  resetPassword(email: string){
    this.http.get<{message:string, id:number }>('http://localhost:3000/api/user/resetPassword/' + email)
      .subscribe(response => {
        this.resetPasswordListener.next(response.message);
      }, error => {
        this.resetPasswordListener.next(error.error.message);
      });
  }

  sendNewPassword(id:number, password: string){
    let auth : Auth = {
      username: null, password: password
    };
    this.http.put<{message:string, _id:number, username: string, privilege:string}>('http://localhost:3000/api/user/newPassword/'+id,auth)
    .subscribe((response) => {
      let loggedUser: LoggedUser = {
        _id:response._id, username: response.username, privilege:response.privilege
      }
      localStorage.setItem("logged",JSON.stringify(loggedUser));
      this.newPasswordListener.next(response.message);
      this.isUserLoggedListener.next(loggedUser);
      this.getNotReadNotifications(loggedUser._id);
      this.router.navigate(['/userInfo',response._id]);
    }, error => {
      this.newPasswordListener.next(error.error.message);
    });
  }

  getUserRegisterRequests(){
    this.http.get<{message:string, data:User[]}>('http://localhost:3000/api/user/getUserRegisterRequests')
      .subscribe((responseData) => {
        console.log(responseData.message);
        this.userRegisterRequestsListener.next([...responseData.data]);
      });
  }

  acceptRegisterRequest(id:number){
    this.http.get<{message:string}>('http://localhost:3000/api/user/acceptRegisterRequest/'+id)
      .subscribe(responseData => {
        console.log(responseData.message);
        window.location.reload();
      });
  }

  refuseRegisterRequest(id:number){
    this.http.delete<{message:string}>('http://localhost:3000/api/user/refuseRegisterRequest/'+id)
    .subscribe(responseData => {
      console.log(responseData.message);
      window.location.reload();
    });
  }

  getRegistredUsers(){
    this.http.get<{message:string, data:User[]}>('http://localhost:3000/api/user/getRegistredUsers')
      .subscribe(responseData => {
        console.log(responseData.message);
        this.registredUsersListener.next([...responseData.data]);
      });
  }

  upgradeToModerator(id:number){
    this.http.get<{message:string}>('http://localhost:3000/api/user/upgradeToModerator/'+id)
      .subscribe(responseData => {
        console.log(responseData.message);
        window.location.reload();
      });
  }

  downgradeToUser(id:number){
    this.http.get<{message:string}>('http://localhost:3000/api/user/downgradeToUser/'+id)
      .subscribe(responseData => {
        console.log(responseData.message);
        window.location.reload();
      });
  }

  getUsers(id:number){
    this.http.get<{message:string, data: User[]}>('http://localhost:3000/api/user/getUsers/'+id)
      .subscribe((responseData) => {
        this.allUsersListener.next([...responseData.data]);
      });
  }

  find(id: number, firstname: string, lastname: string, username: string, email: string){
    const data: Find = {
      id: id, firstname: firstname, lastname: lastname, username: username, email: email
    };
    this.http.post<{message:string, data: User[]}>('http://localhost:3000/api/user/findUsers',data)
    .subscribe((responseData) => {
      this.allUsersListener.next([...responseData.data]);
    });
  }

  followUser(idUser: number, whomFollows: number){
    const data: Follow = {
      _id:null, idUser: idUser, whomFollows: whomFollows
    };
    this.http.post<{message:string}>('http://localhost:3000/api/user/followUser', data)
    .subscribe((responseData) => {
      console.log(responseData.message)
      window.location.reload();
    }, error => {
      console.log(error.error.message)
    });
  }

  unfollowUser(idUser: number, whomFollows: number){
    const data: Follow = {
      _id:null, idUser: idUser, whomFollows: whomFollows
    };
    this.http.post<{message:string}>('http://localhost:3000/api/user/unfollowUser', data)
    .subscribe((responseData) => {
      console.log(responseData.message)
      window.location.reload();
    }, error => {
      console.log(error.error.message)
    });
  }

  doIFollow(idUser: number, whomFollows: number){
    const data: Follow = {
      _id:null, idUser: idUser, whomFollows: whomFollows
    };
    this.http.post<{message:string, data: Follow}>('http://localhost:3000/api/user/doIFollow', data)
    .subscribe((responseData) => {
      if(responseData.data){
        this.doIFollowListener.next({...responseData.data});
      }else{
        this.doIFollowListener.next(null);
      }
    }, error => {
      console.log(error.error.message)
    });
  }

  getAllUsersIFollow(id: number){
    this.http.get<{message:string, data: Follow[]}>('http://localhost:3000/api/user/getAllUsersIFollow/'+id)
      .subscribe((responseData) => {
        console.log(responseData);
      });
  }

  getAllUsersMeFollow(id: number){
    this.http.get<{message:string, data: Follow[]}>('http://localhost:3000/api/user/getAllUsersMeFollow/'+id)
      .subscribe((responseData) => {
        this.usersMeFollowListener.next([...responseData.data]);
      });
  }

  notifyFollower(idUser: number, idBook: number, username: string, title: string){
    let text: string = "Korisnik " + username + " je komentarisao knjigu " + title;
    const data: Notification = {
      _id:null, idUser: idUser, idBook: idBook, text: text, read: "0"
    };
    this.http.post<{message:string}>('http://localhost:3000/api/user/notifyFollower', data)
    .subscribe((responseData) => {
      console.log("Obavesten");
    }, error => {
      console.log(error.error.message)
    });
  }

  getNotReadNotifications(id: number) {
    this.http.get<{message:string, data: Notification[]}>('http://localhost:3000/api/user/getNotReadNotifications/'+id)
      .subscribe((responseData) => {
        this.notificationsListener.next([...responseData.data]);
      });
  }

  getAllNotifications(id: number) {
    this.http.get<{message:string, data: Notification[]}>('http://localhost:3000/api/user/getAllNotifications/'+id)
      .subscribe((responseData) => {
        this.notificationsListener.next([...responseData.data]);
      });
  }

  markReadNotification(id: number) {
    this.http.get<{message:StringMap}>('http://localhost:3000/api/user/markReadNotification/'+id)
      .subscribe((responseData) => {
        console.log(responseData.message);
        window.location.reload();
      });
  }

}
