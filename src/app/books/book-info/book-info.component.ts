import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from '../models/book.model';
import { BookService } from '../book.service';
import { Subscription } from 'rxjs';
import { LoggedUser } from 'src/app/user/models/loggedUser.model';
import { UserService } from 'src/app/user/user.service';

@Component({
  selector: 'app-book-info',
  templateUrl: './book-info.component.html',
  styleUrls: ['./book-info.component.css']
})
export class BookInfoComponent implements OnInit, OnDestroy {

  book: Book;
  private bookSub: Subscription;
  loggedUser: LoggedUser;
  privilege: string = "";
  id:number;

  constructor(private bookService: BookService, private userService: UserService ,private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.loggedUser = this.userService.whoIsLogged();
    if(this.loggedUser) this.privilege = this.loggedUser.privilege;
    this.id = this.route.snapshot.params.id;
    this.bookSub = this.bookService.getBookListener()
      .subscribe((data) => {
        this.book = data;
        this.book = this.niceOutput(this.book);
      });
    this.bookService.getBook(this.id);
  }

  ngOnDestroy(): void {
    this.bookSub.unsubscribe();
  }

  niceOutput(book:Book):Book{
      let aniz:string[] = JSON.parse(book.authors);
      let a:string = "";
      for(let j=0;j<aniz.length;j++){
        if(j!=aniz.length-1) a+=aniz[j]+",";
        else a+=aniz[j];
      }
      book.authors = a;
      let gniz:string[] = JSON.parse(book.genres);
      let g:string = "";
      for(let k=0;k<gniz.length;k++){
        if(k!=gniz.length-1) g+=gniz[k]+",";
        else g+=gniz[k];
      }
      book.genres = g;
      return book;
  }

  configureBook(){
      this.router.navigate(['/bookConfigure', this.id]);
  }

}
