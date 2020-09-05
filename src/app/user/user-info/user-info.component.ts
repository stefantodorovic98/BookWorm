import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../models/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit, OnDestroy {

  user: User;
  id: number;
  private userSub: Subscription;

  constructor(private service: UserService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
    this.userSub = this.service.getUserListener()
      .subscribe((data) => {
        this.user = data;
      });
    this.service.getUser(this.id);
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  configureUser(){
    this.router.navigate(['/userConfigure', this.id]);
  }

  changePassword(){
    this.router.navigate(['/changePassword', this.id]);
  }
}
