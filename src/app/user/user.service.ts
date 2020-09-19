import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { User } from './models/user.model';
import { Auth } from './models/auth.model';
import { Find } from './models/find.model';
import { Follow } from './models/follow.model';
import { Notification } from './models/notification.model';
import { UserEvent } from './models/userEvent.model';
import { InviteEvent } from './models/inviteEvent.model';
import { ForumMessage } from './models/forumMessage.model';
import { UserTime } from './models/UserTime.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoggedUser } from './models/loggedUser.model';
import { ConfiguredUser } from './models/configuredUser.model';
import { ChangedPassword } from './models/changedPassword.model';

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
  private usersIFollowListener = new Subject<Follow[]>();

  private notificationsListener = new Subject<Notification[]>();

  private eventsListener = new Subject<UserEvent[]>();
  private eventListener = new Subject<UserEvent>();

  private invitationsListener = new Subject<InviteEvent[]>();
  private invitationListener = new Subject<InviteEvent>();
  private requestsListener = new Subject<InviteEvent[]>();
  private requestListener = new Subject<InviteEvent>();
  private notAcceptedInvitationListener = new Subject<InviteEvent>();

  private forumMessagesListener = new Subject<ForumMessage[]>();

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

  getUsersIFollowListener(){
    return this.usersIFollowListener.asObservable();
  }

  getNotificationsListener(){
    return this.notificationsListener.asObservable();
  }

  getEventsListener(){
    return this.eventsListener.asObservable();
  }

  getEventListener(){
    return this.eventListener.asObservable();
  }

  getInvitationsListener(){
    return this.invitationsListener.asObservable();
  }

  getInvitationListener(){
    return this.invitationListener.asObservable();
  }

  getForumMessagesListener(){
    return this.forumMessagesListener.asObservable();
  }

  getRequestListener(){
    return this.requestListener.asObservable();
  }

  getRequestsListener(){
    return this.requestsListener.asObservable();
  }

  getNotAcceptedInvitationListener(){
    return this.notAcceptedInvitationListener.asObservable();
  }

  registerUser(firstname:string, lastname:string, username:string, password:string,
     birthdate:Date, city: string, country:string, email:string, image: File){
      if(image!=null){
        const userData = new FormData();
        userData.append("firstname", firstname);
        userData.append("lastname", lastname);
        userData.append("username", username);
        userData.append("password", password);
        userData.append("birthdate", birthdate.toLocaleDateString());
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
          allowed: null, active: null, logDate: null
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
        let logDate: Date = new Date();
        this.updateUserTime(loggedUser._id, "1", logDate.toLocaleString());
        localStorage.setItem("logged",JSON.stringify(loggedUser));
        this.userLoginListener.next(response.message);
        this.isUserLoggedListener.next(loggedUser);
        this.getNotReadNotifications(loggedUser._id);
        this.getAllInvitations(loggedUser._id);
        this.getAllRequests(loggedUser._id);
        this.router.navigate(['/userInfo',response._id]);
      }, error => {
        this.userLoginListener.next(error.error.message);
      });
  }

  updateUserTime(idUser: number, active: string, logDate: string){
    let time: UserTime = {
      idUser:idUser, active: active, logDate: logDate
    }
    this.http.put<{message:string}>('http://localhost:3000/api/user/updateUserTime', time)
    .subscribe(response => {
      console.log(response.message)
    }, error => {
      console.log(error.error.message)
    });
  }

  updateUserTimeLogout(idUser: number, active: string){
    let time: UserTime = {
      idUser:idUser, active: active, logDate: ""
    }
    this.http.put<{message:string}>('http://localhost:3000/api/user/updateUserTimeLogout', time)
    .subscribe(response => {
      console.log(response.message)
    }, error => {
      console.log(error.error.message)
    });
  }

  logoutUser(){
    let loggedUser: LoggedUser = JSON.parse(localStorage.getItem("logged"));
    this.updateUserTimeLogout(loggedUser._id, "0");
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
          let loggedUser: LoggedUser = JSON.parse(localStorage.getItem("logged"));
          this.updateUserTimeLogout(loggedUser._id, "0");
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
      let logDate: Date = new Date();
      this.updateUserTime(loggedUser._id, "1", logDate.toDateString());
      localStorage.setItem("logged",JSON.stringify(loggedUser));
      this.newPasswordListener.next(response.message);
      this.isUserLoggedListener.next(loggedUser);
      this.getNotReadNotifications(loggedUser._id);
      this.getAllInvitations(loggedUser._id);
      this.getAllRequests(loggedUser._id);
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

  followUser(idUser: number, username: string, whomFollows: number, whomUsername: string){
    const data: Follow = {
      _id:null, idUser: idUser, username: username, whomFollows: whomFollows, whomUsername: whomUsername
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
      _id:null, idUser: idUser, username: "", whomFollows: whomFollows, whomUsername: ""
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
      _id:null, idUser: idUser, username: "", whomFollows: whomFollows, whomUsername: ""
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
        this.usersIFollowListener.next([...responseData.data]);
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
    this.http.get<{message:string}>('http://localhost:3000/api/user/markReadNotification/'+id)
      .subscribe((responseData) => {
        console.log(responseData.message);
        window.location.reload();
      });
  }

  addPrivateEvent(idUser: number, username: string, title: string, dateBegin: Date, dateEnd: Date,
     description: string, invitedUsers: number[]){
      let nowDate: Date = new Date();
      let status: string = "closed";
      if(nowDate.getTime()>=dateBegin.getTime()){
        if(dateEnd===null) status="active";
        else if(nowDate.getTime()<=dateEnd.getTime()) status="active";
        else status="closed";
      }else if (nowDate.getTime()<dateBegin.getTime()) status="future";
      const data: UserEvent = {
        _id:null, idUser: idUser, username: username, title: title, dateBegin: dateBegin, dateEnd: dateEnd,
        description: description, type: "private", status: status
      };
      this.http.post<{message:string, id: number}>('http://localhost:3000/api/user/addEvent', data)
      .subscribe((responseData) => {
        console.log(responseData.message + " " + responseData.id)
        for(let i=0; i<invitedUsers.length; i++){
          this.userInvite(responseData.id, idUser, username, invitedUsers[i], title)
        }
        window.location.reload();
      }, error => {
        console.log(error.error.message)
      });
    }

  addPublicEvent(idUser: number, username: string, title: string, dateBegin: Date, dateEnd: Date, description: string){
      let nowDate: Date = new Date();
      let status: string = "closed";
      if(nowDate.getTime()>=dateBegin.getTime()){
        if(dateEnd===null) status="active";
        else if(nowDate.getTime()<=dateEnd.getTime()) status="active";
        else status="closed";
      }else if (nowDate.getTime()<dateBegin.getTime()) status="future";
      const data: UserEvent = {
        _id:null, idUser: idUser, username: username, title: title, dateBegin: dateBegin, dateEnd: dateEnd,
        description: description, type: "public", status: status
      };
      this.http.post<{message:string, id: number}>('http://localhost:3000/api/user/addEvent', data)
      .subscribe((responseData) => {
        window.location.reload();
      }, error => {
        console.log(error.error.message)
      });
  }

  eventUpdate(id: number){
    this.http.get<{message:string}>('http://localhost:3000/api/user/updateEvent/'+id)
      .subscribe((responseData) => {
        console.log(responseData.message)
      });
  }

  getAllEvents(){
    this.http.get<{message:string, data: any[]}>('http://localhost:3000/api/user/getAllEvents')
      .subscribe((responseData) => {
        for(let i=0;i<responseData.data.length;i++){
          if(responseData.data[i].dateEnd==="0") responseData.data[i].dateEnd=null;
        }
        console.log(responseData)
        this.eventsListener.next([...responseData.data])
      });
  }

  getOneEvent(id: number){
    this.http.get<{message:string, data: any}>('http://localhost:3000/api/user/getOneEvent/'+id)
      .subscribe((responseData) => {
        if(responseData.data.dateEnd==="0") responseData.data.dateEnd = null;
        this.eventListener.next(responseData.data);
      });
  }

  closeEvent(id: number){
    this.http.get<{message:string}>('http://localhost:3000/api/user/closeEvent/'+id)
      .subscribe((responseData) => {
        console.log(responseData.message)
        window.location.reload();
      });
  }

  activeEvent(id: number){
    this.http.get<{message:string}>('http://localhost:3000/api/user/activeEvent/'+id)
      .subscribe((responseData) => {
        console.log(responseData.message)
        window.location.reload();
      });
  }

  userInvite(idEvent: number, idHost: number, username: string, idGuest: number, title: string){
    let text: string = "Korisnik " + username + " Vas poziva na desavanje " + title;
    const data: InviteEvent = {
      _id: null, idEvent: idEvent, idHost: idHost, idGuest: idGuest, text: text, hostInvitation:"1", userRequest:"0", status:"0"
    };
    this.http.post<{message:string}>('http://localhost:3000/api/user/inviteUserToEvent', data)
    .subscribe((responseData) => {
      console.log(responseData.message)
    }, error => {
      console.log(error.error.message)
    });
  }

  requestInvite(idEvent: number, idHost: number, username: string, idGuest: number, title: string){
    let text: string = "Korisnik " + username + " zahteva prisustvo desavanju " + title;
    const data: InviteEvent = {
      _id: null, idEvent: idEvent, idHost: idHost, idGuest: idGuest, text: text, hostInvitation:"0", userRequest:"1", status:"0"
    };
    this.http.post<{message:string}>('http://localhost:3000/api/user/requestInvite', data)
    .subscribe((responseData) => {
      console.log(responseData.message)
      window.location.reload();
    }, error => {
      console.log(error.error.message)
    });
  }

  getRequest(idGuest: number, idEvent: number){
    const data: InviteEvent = {
      _id: null, idEvent: idEvent, idHost: null, idGuest: idGuest, text: "", hostInvitation:"", userRequest:"", status:""
    };
    this.http.post<{message:string, data: InviteEvent}>('http://localhost:3000/api/user/getRequest', data)
    .subscribe((responseData) => {
      if(responseData.data){
        this.requestListener.next({...responseData.data});
      }else{
        this.requestListener.next(null);
      }
    }, error => {
      console.log(error.error.message)
    });
  }

  getAllRequests(id: number){
    this.http.get<{message:string, data: InviteEvent[]}>('http://localhost:3000/api/user/getAllRequests/'+id)
      .subscribe((responseData) => {
        console.log(responseData)
        this.requestsListener.next([...responseData.data])
      });
  }


  getAllInvitations(id: number){
    this.http.get<{message:string, data: InviteEvent[]}>('http://localhost:3000/api/user/getAllInvitations/'+id)
      .subscribe((responseData) => {
        console.log(responseData)
        this.invitationsListener.next([...responseData.data])
      });
  }

  getInvitation(idGuest: number, idEvent: number){
    const data: InviteEvent = {
      _id: null, idEvent: idEvent, idHost: null, idGuest: idGuest, text: "", hostInvitation:"", userRequest:"", status:""
    };
    this.http.post<{message:string, data: InviteEvent}>('http://localhost:3000/api/user/getInvitation', data)
    .subscribe((responseData) => {
      if(responseData.data){
        this.invitationListener.next({...responseData.data});
      }else{
        this.invitationListener.next(null);
      }
    }, error => {
      console.log(error.error.message)
    });
  }

  getNotAcceptedInvitation(idGuest: number, idEvent: number){
    const data: InviteEvent = {
      _id: null, idEvent: idEvent, idHost: null, idGuest: idGuest, text: "", hostInvitation:"", userRequest:"", status:""
    };
    this.http.post<{message:string, data: InviteEvent}>('http://localhost:3000/api/user/getNotAcceptedInvitation', data)
    .subscribe((responseData) => {
      if(responseData.data){
        this.notAcceptedInvitationListener.next({...responseData.data});
      }else{
        this.notAcceptedInvitationListener.next(null);
      }
    }, error => {
      console.log(error.error.message)
    });
  }

  acceptInvitation(id: number){
    this.http.get<{message:string}>('http://localhost:3000/api/user/acceptInvitation/'+id)
      .subscribe((responseData) => {
        console.log(responseData.message)
        window.location.reload();
      });
  }

  refuseInvitation(id:number){
    this.http.delete<{message:string}>('http://localhost:3000/api/user/refuseInvitation/'+id)
    .subscribe(responseData => {
      console.log(responseData.message);
      window.location.reload();
    });
  }

  addForumMessage(idUser: number, username: string, idEvent: number, message: string){
    const data : ForumMessage = {
      _id: null, idUser: idUser, username: username, idEvent: idEvent, message: message
    }
    this.http.post<{message:string}>('http://localhost:3000/api/user/addForumMessage', data)
    .subscribe((responseData) => {
      console.log(responseData.message)
      window.location.reload();
    }, error => {
      console.log(error.error.message)
    });
  }

  getForumMessages(id: number){
    this.http.get<{message:string, data: ForumMessage[]}>('http://localhost:3000/api/user/getForumMessages/'+id)
      .subscribe((responseData) => {
        console.log(responseData.data)
        this.forumMessagesListener.next([...responseData.data])
      });
  }

}
