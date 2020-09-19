import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { User } from '../models/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from '../user.service';
import { BookService } from 'src/app/books/book.service';
import { UserBook } from 'src/app/books/models/userBook.model';
import { PageEvent } from '@angular/material/paginator';
import { Genre } from 'src/app/books/models/genre';
import { Comment } from '../../books/models/comment.model';
import { ApexChart, ApexNonAxisChartSeries, ApexResponsive, ChartComponent } from 'ng-apexcharts';
import { LoggedUser } from '../models/loggedUser.model';
import { Follow } from '../models/follow.model';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit, OnDestroy {
  pageSizeOptions = [1, 2, 5, 10];
  displayedColumnsForUserReadBooks: string[] = ['title', 'authors', 'genres'];
  totalReadBooks = 10;
  readBooksPerPage = 2;
  currentPageForReadBooks = 1;
  displayedColumnsForUserCurrReadBooks: string[] = ['title', 'authors', 'genres'];
  totalCurrReadBooks = 10;
  currReadBooksPerPage = 2;
  currentPageForCurrReadBooks = 1;
  displayedColumnsForUserWaitBooks: string[] = ['title', 'authors', 'genres', 'remove'];
  totalWaitBooks = 10;
  waitBooksPerPage = 2;
  currentPageForWaitBooks = 1;
  user: User;
  id: number;
  private userSub: Subscription;
  private getAllBooksUserReadSub: Subscription;
  private getAllBooksUserCurrReadSub: Subscription;
  private getAllBooksUserWaitSub: Subscription;
  private getAllBooksUserReadNoPaginatorSub: Subscription;
  private getAllCommentsUserWroteSub: Subscription;

  userReadBooks: UserBook[] = [];
  userCurrReadBooks: UserBook[] = [];
  userWaitBooks: UserBook[] = [];
  userReadBooksNoPaginator: UserBook[] = [];

  displayedColumnsForUserComments: string[] = ['title', 'authors', 'rating', 'comment'];
  userComments: Comment[] = [];

  private getGenresSub: Subscription;
  genres: Genre[] = [];

  pieSeries: ApexNonAxisChartSeries;
  pieChart: ApexChart;
  pieResponsive: ApexResponsive[];
  pieLabels: any;

  pieCondition: boolean = false;

  loggedUser: LoggedUser;
  configureCondition: boolean = false;

  private doIFollowSub: Subscription = null;
  followData: Follow = null;

  activeUser: string = "";

  constructor(private userService: UserService, private bookService: BookService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.userSub = this.userService.getUserListener()
      .subscribe((data) => {
        this.user = data;
        if(this.user.active==='1') this.activeUser = "Korisnik je trenutno aktivan";
        else this.activeUser = "Poslednji put prijavljen:" + this.user.logDate;
      });
    this.userService.getUser(this.id);

    this.loggedUser = this.userService.whoIsLogged();
    if(this.loggedUser){
      if(this.id === this.loggedUser._id) this.configureCondition = true;
      else{
        this.doIFollowSub = this.userService.getDoIFollowListener()
          .subscribe(data => {
            this.followData = data;
          });
        this.userService.doIFollow(this.loggedUser._id, this.id);
      }
    }
    this.getAllBooksUserReadSub = this.bookService.getGetAllBooksUserReadListener()
      .subscribe(data => {
        this.userReadBooks = data.books;
        this.totalReadBooks = data.count;
      });
    this.bookService.getAllBooksUserRead(this.id, this.readBooksPerPage, this.currentPageForReadBooks);

    this.getAllBooksUserCurrReadSub = this.bookService.getGetAllBooksUserCurrReadListener()
      .subscribe(data => {
        this.userCurrReadBooks = data.books;
        this.totalCurrReadBooks = data.count;
      });
    this.bookService.getAllBooksUserCurrRead(this.id, this.currReadBooksPerPage, this.currentPageForCurrReadBooks);

    this.getAllBooksUserWaitSub = this.bookService.getGetAllBooksUserWaitListener()
      .subscribe(data => {
        this.userWaitBooks = data.books;
        this.totalWaitBooks = data.count;
      });
    this.bookService.getAllBooksUserWait(this.id, this.waitBooksPerPage, this.currentPageForWaitBooks);

    this.getAllBooksUserReadNoPaginatorSub = this.bookService.getGetAllBooksUserReadNoPaginatorListener()
      .subscribe(data1 => {
          this.userReadBooksNoPaginator = data1;
          this.getGenresSub = this.bookService.getGetGenresListener()
          .subscribe(data2 => {
              this.genres = data2;
              let lab: string[] = [];
              let ser: number[] = [];
              if(this.genres && this.userReadBooksNoPaginator){
                for(let i=0;i<this.genres.length;i++){
                  let val = 0;
                  for(let j=0;j<this.userReadBooksNoPaginator.length;j++){
                    if(this.userReadBooksNoPaginator[j].genres.includes(this.genres[i].name)) val++;
                  }
                  lab.push(this.genres[i].name);
                  ser.push(val);
                }
                this.pieSeries = ser;
                this.pieLabels = lab;

                this.pieChart= {
                  width: 380,
                  type: "pie"
                };
                this.pieResponsive= [
                  {
                    breakpoint: 480,
                    options: {
                      chart: {
                        width: 200
                      },
                      legend: {
                        position: "bottom"
                      }
                    }
                  }
                ];
              }
              this.pieCondition = true;
          });
      this.bookService.getGenres();
    });
    this.bookService.getAllBooksUserReadNoPaginator(this.id);

    this.getAllCommentsUserWroteSub = this.bookService.getGetAllCommentsUserWroteListener()
      .subscribe(data => {
        this.userComments = data;
      });
    this.bookService.getAllCommentsUserWrote(this.id);
    })
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    this.getAllBooksUserReadSub.unsubscribe();
    this.getAllBooksUserCurrReadSub.unsubscribe();
    this.getAllBooksUserWaitSub.unsubscribe();
    this.getAllBooksUserReadNoPaginatorSub.unsubscribe();
    this.getGenresSub.unsubscribe();
    this.getAllCommentsUserWroteSub.unsubscribe();
    if(this.doIFollowSub) this.doIFollowSub.unsubscribe();
  }

  configureUser(){
    this.router.navigate(['/userConfigure', this.id]);
  }

  changePassword(){
    this.router.navigate(['/changePassword', this.id]);
  }

  removeBookFromList(idUser: number, idBook: number){
    this.bookService.removeBookFromWaitingList(idUser, idBook);
  }

  onChangedPageForReadBooks(pageData: PageEvent){
    this.currentPageForReadBooks = pageData.pageIndex + 1;
    this.readBooksPerPage = pageData.pageSize;
    this.bookService.getAllBooksUserRead(this.id, this.readBooksPerPage, this.currentPageForReadBooks);
  }

  onChangedPageForCurrReadBooks(pageData: PageEvent){
    this.currentPageForCurrReadBooks = pageData.pageIndex + 1;
    this.currReadBooksPerPage = pageData.pageSize;
    this.bookService.getAllBooksUserCurrRead(this.id, this.currReadBooksPerPage, this.currentPageForCurrReadBooks);
  }

  onChangedPageForWaitBooks(pageData: PageEvent){
    this.currentPageForWaitBooks = pageData.pageIndex + 1;
    this.waitBooksPerPage = pageData.pageSize;
    this.bookService.getAllBooksUserWait(this.id, this.waitBooksPerPage, this.currentPageForWaitBooks);
  }

  follow(){
    this.userService.followUser(this.loggedUser._id, this.loggedUser.username, this.id, this.user.username);
  }

  unfollow(){
    this.userService.unfollowUser(this.loggedUser._id, this.id);
  }


}
