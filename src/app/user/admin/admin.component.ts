import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../user.service';
import { Subscription } from 'rxjs';
import { User } from '../models/user.model';
import { Book } from 'src/app/books/models/book.model';
import { BookService } from 'src/app/books/book.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Genre } from 'src/app/books/models/genre';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy {

  displayedColumnsForRequests: string[] = ['firstname', 'lastname', 'path', 'birthdate', 'city', 'country', 'accept', 'refuse'];
  displayedColumnsForPrivileges: string[] = ['firstname', 'lastname', 'path', 'birthdate', 'city', 'country', 'privilege', 'user', 'moderator'];
  displayedColumnsForBooks: string[] = ['title', 'authors', 'genres', 'path', 'accept', 'refuse'];
  displayedColumnsForGenres: string[] = ['name', 'delete'];
  private userRegisterRequestsSub: Subscription;
  private registredUsersSub: Subscription;
  private booksNotAllowedSub: Subscription;
  private addGenreSub: Subscription;
  private getGenresSub: Subscription;
  private deleteGenreSub: Subscription;
  registerRequests:User[] = [];
  registredUsers:User[] = [];
  genres: Genre[] = [];
  books: Book[] = [];
  messageAddGenre: string = " ";
  messageDeleteGenre: string = " ";

  genreAddForm: FormGroup;

  constructor(private userService: UserService, private bookService: BookService) { }

  ngOnInit(): void {
    this.userRegisterRequestsSub = this.userService.getUserRegisterRequestsListener()
      .subscribe(data => {
        this.registerRequests = data;
      });
    this.userService.getUserRegisterRequests();
    this.registredUsersSub = this.userService.getRegistredUsersListener()
      .subscribe(data => {
        this.registredUsers = data;
        this.registredUsers = this.niceOutputUsers(this.registredUsers);
      });
    this.userService.getRegistredUsers();
    this.booksNotAllowedSub = this.bookService.getBooksNotAllowedListener()
      .subscribe(data => {
        this.books= data;
        this.books = this.niceOutputBooks(this.books);
      });
    this.bookService.getBooksNotAllowed();
    //
    this.genreAddForm = new FormGroup({
      genre: new FormControl(null,[Validators.required])
    });

    this.addGenreSub = this.bookService.getAddGenreListener()
      .subscribe(data => {
        this.messageAddGenre = data;
      });

    this.getGenresSub = this.bookService.getGetGenresListener()
      .subscribe(data => {
        this.genres = data;
      });
    this.bookService.getGenres();

    this.deleteGenreSub = this.bookService.getDeleteGenreListener()
      .subscribe(data => {
        this.messageDeleteGenre = data;
      })
  }

  ngOnDestroy(): void {
    this.userRegisterRequestsSub.unsubscribe();
    this.registredUsersSub.unsubscribe();
    this.booksNotAllowedSub.unsubscribe();
    this.addGenreSub.unsubscribe();
    this.getGenresSub.unsubscribe();
    this.deleteGenreSub.unsubscribe();
  }

  niceOutputBooks(books:Book[]):Book[]{
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

  niceOutputUsers(users: User[]):User[]{
    for(let i=0;i<users.length;i++){
      if(users[i].privilege==="M") users[i].privilege="Moderator";
      else if(users[i].privilege==="U") users[i].privilege="Korisnik"
    }
    return users;
  }

  acceptUserRequest(id:number){
    this.userService.acceptRegisterRequest(id);
  }

  refuseUserRequest(id:number){
    this.userService.refuseRegisterRequest(id);
  }

  upgradeToModerator(id:number){
    this.userService.upgradeToModerator(id);
  }

  downgradeToUser(id:number){
    this.userService.downgradeToUser(id);
  }

  acceptBookRequest(id:number){
    this.bookService.acceptBookRequest(id);
  }

  refuseBookRequest(id:number){
    this.bookService.refuseBookRequest(id);
  }

  onGenreAdd(){
    this.bookService.addGenre(this.genreAddForm.value.genre)
  }

  onGenreDelete(id: number, name: string){
    this.bookService.deleteGenre(id, name);
  }
}
