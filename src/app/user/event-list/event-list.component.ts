import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoggedUser } from '../models/loggedUser.model';
import { UserEvent } from '../models/userEvent.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit, OnDestroy {

  eventsSub: Subscription;
  events: UserEvent[] = [];
  loggedUser: LoggedUser = null;

  updated: boolean = false;

  displayedColumns: string[] = ['title', 'author', 'status', 'type', 'dateBegin', 'dateEnd', 'description', 'eventInfo'];
  displayedColumnsForNotLogged: string[] = ['title', 'status', 'dateBegin'];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loggedUser = this.userService.whoIsLogged();
    this.eventsSub = this.userService.getEventsListener()
      .subscribe(data => {
        this.events = data;
        if(!this.updated){
          this.eventsUpdate(this.events);
        }
        if(!this.loggedUser){
          this.events = this.events.filter(data => {
            if(data.status==='active' && data.type==='public') return true;
            let dateBegin: Date = new Date(data.dateBegin);
            let dateEnd: Date = null;
            if(data.dateEnd!==null) dateEnd = new Date(data.dateEnd);
            let now = new Date();
            if(now.getTime()>=dateBegin.getTime() && data.type==='public'){
              if(dateEnd && now.getTime()<=dateEnd.getTime()) return true;
              else if(dateEnd && now.getTime()>dateEnd.getTime()) return false;
              else if(!dateEnd) return true;
            }else{
              if(data.status==='future' && data.type==='public') return true;
              else return false;
            }
          });
        }
        for(let i=0;i<this.events.length;i++){
            if(this.events[i].status==='active') this.events[i].status="aktivno";
            else this.events[i].status="zatvoreno";
            if(this.events[i].type==='private') this.events[i].type="privatno";
            else this.events[i].type="javno";
        }
      });
    this.userService.getAllEvents();
  }

  eventsUpdate(events: UserEvent[]){
    console.log("Azurirano")
    let now = new Date();
    for(let i=0;i<events.length;i++){
      let data = events[i];
      let dateBegin: Date = new Date(data.dateBegin);
      let dateEnd: Date = null;
      if(data.dateEnd!==null) dateEnd = new Date(data.dateEnd);
      if(data.status==='active'){
        if(now.getTime()<dateBegin.getTime()){
          this.userService.eventUpdate(data._id);
        }else if(dateEnd && now.getTime()>dateEnd.getTime()){
          this.userService.eventUpdate(data._id);
        }
      }
    }
    this.updated = true;
    this.userService.getAllEvents();
  }

  ngOnDestroy(): void {
    this.eventsSub.unsubscribe();
  }

}
