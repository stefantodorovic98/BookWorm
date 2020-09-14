import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../models/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from '../user.service';
import { BookService } from 'src/app/books/book.service';
import { UserBook } from 'src/app/books/models/userBook.model';
import { PageEvent } from '@angular/material/paginator';
import { Genre } from 'src/app/books/models/genre';

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
  userReadBooks: UserBook[] = [];
  userCurrReadBooks: UserBook[] = [];
  userWaitBooks: UserBook[] = [];
  userReadBooksNoPaginator: UserBook[] = [];

  private getGenresSub: Subscription;
  genres: Genre[] = [];

  constructor(private userService: UserService, private bookService: BookService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
    this.userSub = this.userService.getUserListener()
      .subscribe((data) => {
        this.user = data;
      });
    this.userService.getUser(this.id);

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
      .subscribe(data => {
        this.userReadBooksNoPaginator = data;
      });
    this.bookService.getAllBooksUserReadNoPaginator(this.id);

    this.getGenresSub = this.bookService.getGetGenresListener()
      .subscribe(data => {
        this.genres = data;
      });
    this.bookService.getGenres();
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    this.getAllBooksUserReadSub.unsubscribe();
    this.getAllBooksUserCurrReadSub.unsubscribe();
    this.getAllBooksUserWaitSub.unsubscribe();
    this.getAllBooksUserReadNoPaginatorSub.unsubscribe();
    this.getGenresSub.unsubscribe();
  }

  configureUser(){
    console.log(this.genres)
    console.log(this.userReadBooksNoPaginator)
    //this.router.navigate(['/userConfigure', this.id]);
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
}
