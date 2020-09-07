import { Component, OnInit, OnDestroy } from '@angular/core';

import { Book } from "../models/book.model";

import { BookService } from "../book.service";
import { Subscription } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { UserService } from 'src/app/user/user.service';
import { LoggedUser } from 'src/app/user/models/loggedUser.model';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit, OnDestroy {

  constructor(private bookService: BookService, private userService: UserService) { }

  public books: Book[] = [];
  private bookListSub: Subscription;
  displayedColumns: string[] = ['title', 'authors', 'genres', 'path', 'bookInfo'];
  genres: string[] = [];
  findForm: FormGroup;
  isLogged = false;

  ngOnInit(): void {
    this.findForm = new FormGroup({
      title: new FormControl(null),
      author: new FormControl(null),
      genres: new FormControl(null)
    });
    this.bookListSub = this.bookService.getBookListListener()
      .subscribe((data) => {
        this.books = data;
        this.books = this.niceOutput(this.books);
      });
    this.bookService.getBooks();
    let logUser: LoggedUser = this.userService.whoIsLogged();
    if(logUser) this.isLogged = true;
    else this.isLogged = false;
  }

  ngOnDestroy(): void {
    this.bookListSub.unsubscribe();
  }

  niceOutput(books:Book[]):Book[]{
    for(let i=0;i<books.length;i++){
      let aniz:string[] = JSON.parse(books[i].authors);
      let a:string = "";
      for(let j=0;j<aniz.length;j++){
        if(j!=aniz.length-1) a+=aniz[j]+",";
        else a+=aniz[j];
      }
      books[i].authors = a;
      let gniz:string[] = JSON.parse(books[i].genres);
      let g:string = "";
      for(let k=0;k<gniz.length;k++){
        if(k!=gniz.length-1) g+=gniz[k]+",";
        else g+=gniz[k];
      }
      books[i].genres = g;
    }
    return books;
  }

  changed(){
    this.genres = this.findForm.value.genres;
  }

  find(){
    this.bookService.find(this.findForm.value.title, this.findForm.value.author, this.genres);
  }
}
