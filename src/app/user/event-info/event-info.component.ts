import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ForumMessage } from '../models/forumMessage.model';
import { InviteEvent } from '../models/inviteEvent.model';
import { LoggedUser } from '../models/loggedUser.model';
import { UserEvent } from '../models/userEvent.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-event-info',
  templateUrl: './event-info.component.html',
  styleUrls: ['./event-info.component.css']
})
export class EventInfoComponent implements OnInit, OnDestroy {

  private eventSub: Subscription;
  event: UserEvent = null;
  id: number;
  loggedUser: LoggedUser = null;

  configureCondition: boolean = false;
  canIActivate: boolean = true;

  private invitationSub: Subscription;
  invitation: InviteEvent = null;

  private requestSub: Subscription;
  request: InviteEvent = null;

  forumForm: FormGroup;

  private forumMessagesSub: Subscription;
  forumMessages: ForumMessage[] = [];

  isActive: boolean = false;
  isOwner: boolean = false;
  isPublic: boolean = false;
  isPrivate: boolean = false;

  private notAcceptedInvitationSub: Subscription;
  notAccepted: InviteEvent = null;

  constructor(private userService: UserService,private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
    this.loggedUser = this.userService.whoIsLogged();
    this.eventSub = this.userService.getEventListener()
      .subscribe(data => {
        this.event = data;
        if(this.event.type === 'private') this.isPrivate = true;
        else this.isPublic = true;
        if(this.event.status === 'active') this.isActive = true;
        if(this.loggedUser){
          if(this.event.idUser === this.loggedUser._id) this.isOwner = true;
          this.invitationSub = this.userService.getInvitationListener()
              .subscribe(data => {
                  this.invitation = data;
                  if(!this.invitation){
                    this.requestSub = this.userService.getRequestListener()
                      .subscribe(data => {
                        this.request = data;
                        if(!this.request){
                          this.notAcceptedInvitationSub = this.userService.getNotAcceptedInvitationListener()
                            .subscribe(data => {
                              this.notAccepted = data;
                            })
                          this.userService.getNotAcceptedInvitation(this.loggedUser._id, this.id);
                        }
                      });
                    this.userService.getRequest(this.loggedUser._id, this.id);
                  }
              });
              this.userService.getInvitation(this.loggedUser._id, this.id);
        }
        let now: Date = new Date();
        let dateBegin: Date = new Date(this.event.dateBegin);
        let dateEnd: Date = null;
        if(this.event.dateEnd===null) dateEnd=null;
        else dateEnd = new Date(this.event.dateEnd);
        if(now.getTime()>=dateBegin.getTime()){
          if(dateEnd===null) this.canIActivate = true;
          else if(now.getTime()<=dateEnd.getTime()) this.canIActivate = true;
          else this.canIActivate = false;
        }else this.canIActivate = false;

        if(this.event.type==='private') this.event.type = "privatno";
        else this.event.type = "javno";
        if(this.event.status==='active') this.event.status = "aktivno";
        else this.event.status = "zatvoreno";
      });
    this.userService.getOneEvent(this.id);

    this.forumForm = new FormGroup({
      message: new FormControl("")
    });

    this.forumMessagesSub = this.userService.getForumMessagesListener()
      .subscribe(data => {
        this.forumMessages = data;
      });
    this.userService.getForumMessages(this.id)
  }

  ngOnDestroy(): void {
    this.eventSub.unsubscribe();
    if(this.invitationSub) this.invitationSub.unsubscribe();
    if(this.requestSub) this.requestSub.unsubscribe();
    if(this.notAcceptedInvitationSub) this.notAcceptedInvitationSub.unsubscribe();
  }

  closeEvent(){
    this.userService.closeEvent(this.event._id);
  }

  activeEvent(){
    this.userService.activeEvent(this.event._id);
  }

  addForumMessage(){
    this.userService.addForumMessage(this.loggedUser._id, this.loggedUser.username, this.event._id, this.forumForm.value.message);
  }

  requestInvite(){
    this.userService.requestInvite(this.event._id, this.event.idUser, this.loggedUser.username, this.loggedUser._id, this.event.title);
  }

}
