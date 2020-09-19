import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from '../models/book.model';
import { BookService } from '../book.service';
import { Subscription, empty } from 'rxjs';
import { LoggedUser } from 'src/app/user/models/loggedUser.model';
import { UserService } from 'src/app/user/user.service';
import { UserBook } from '../models/userBook.model';
import { Comment } from '../models/comment.model';
import { MarkAddUpdate } from '../models/markAddUpdate.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Follow } from 'src/app/user/models/follow.model';

@Component({
  selector: 'app-book-info',
  templateUrl: './book-info.component.html',
  styleUrls: ['./book-info.component.css']
})
export class BookInfoComponent implements OnInit, OnDestroy {

  book: Book;
  userBook: UserBook = null;
  private bookSub: Subscription = null;
  private userBookSub: Subscription = null;
  private userBookReqSub: Subscription = null;
  private userCommentSub: Subscription = null;

  loggedUser: LoggedUser = null;
  privilege: string = "";
  id:number;
  message: string = " ";

  currPage: number = 0;
  maxPage: number = 100;
  counter: number = 0;

  readActive: boolean = false;
  waitActive: boolean = false;
  currReadActive: boolean = false;
  finishReading: boolean = false;

  conditionForCommentPages: boolean = false;
  //conditionForCommentOldComment: boolean = false;

  currReadingForm: FormGroup;
  commentForm: FormGroup;

  comment: Comment = null;
  commentMessage: string = " ";

  displayedColumnsForUserComments: string[] = ['author', 'rating', 'comment'];
  private getAllCommentsForBookSub: Subscription = null;
  comments: Comment[] = [];

  private usersMeFollowSub: Subscription = null;
  usersMeFollow: Follow[] = [];

  constructor(private bookService: BookService, private userService: UserService ,private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.currReadingForm = new FormGroup({
      currPage: new FormControl(this.currPage),
      maxPage:  new FormControl(this.maxPage)
    });

    this.loggedUser = this.userService.whoIsLogged();
    if(this.loggedUser) this.privilege = this.loggedUser.privilege;
    this.id = this.route.snapshot.params.id;
    this.bookSub = this.bookService.getBookListener()
      .subscribe((data) => {
        this.book = data;
        this.book.averageMark = +this.book.averageMark.toFixed(2);
        this.book = this.niceOutput(this.book);
        if(this.loggedUser){
          this.userBookSub = this.bookService.getUserBookListener()
          .subscribe(data => {
            this.userBook = data;
            if(data){
              if(data.read==='1') this.readActive = true;
              else if(data.wait==='1') this.waitActive = true;
              else if(data.currRead==='1') this.currReadActive = true;
              this.currPage = data.currPage; this.maxPage = data.maxPage;
              this.counter = this.currPage/this.maxPage*100;
              this.currReadingForm.patchValue({
                currPage: this.currPage, maxPage: this.maxPage
              });
              if(this.currPage===this.maxPage) this.finishReading = true;
              this.userCommentSub = this.bookService.getUserCommentListener()
                .subscribe(comment => {
                  this.comment = comment;
                  if(comment){
                    this.configureRating=comment.rating;
                  }
                });
              this.bookService.getComment(this.loggedUser._id, this.id);
              if(this.currPage/this.maxPage>=0.5) this.conditionForCommentPages=true;
            }

          });
          this.bookService.getUserBook(this.loggedUser._id, this.id);
        }
      });
    this.bookService.getBook(this.id);

    this.userBookReqSub = this.bookService.getUserBookReqListener()
      .subscribe(data => {
        this.message = data;
      })

    this.commentForm = new FormGroup({
      comment: new FormControl("")
    });

    this.getAllCommentsForBookSub = this.bookService.getGetAllCommentsForBookListener()
      .subscribe(data => {
        this.comments = data;
      });
    this.bookService.getAllCommentsForBook(this.id);

    if(this.loggedUser){
      this.usersMeFollowSub = this.userService.getUsersMeFollowListener()
        .subscribe(data => {
          this.usersMeFollow = data;
        });
      this.userService.getAllUsersMeFollow(this.loggedUser._id)
    }
  }

  ngOnDestroy(): void {
    this.bookSub.unsubscribe();
    if(this.userBookSub){
      this.userBookSub.unsubscribe();
    }
    this.userBookReqSub.unsubscribe();
    if(this.userCommentSub){
      this.userCommentSub.unsubscribe();
    }
    this.getAllCommentsForBookSub.unsubscribe();
    if(this.usersMeFollowSub){
      this.usersMeFollowSub.unsubscribe();
    }
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

  addReadBook(){
    if(this.loggedUser){
      this.bookService.addBookRead(this.loggedUser._id, this.id, this.book.title, this.book.authors, this.book.genres,
         "1", "0", "0", this.currPage, this.maxPage, "Knjiga je procitana");
    }
  }

  addBookToList(){
    if(this.loggedUser){
      this.bookService.addBookList(this.loggedUser._id, this.id, this.book.title, this.book.authors, this.book.genres,
         "0", "1", "0", this.currPage, this.maxPage, "Knjiga je dodata u listu");
    }
  }

  removeBookFromList(){
    if(this.loggedUser && this.userBook){
      this.bookService.removeBookFromWaitingList(this.loggedUser._id, this.id);
      this.userBook = null;
    }
  }

  addBookCurrReading(){
    if(this.loggedUser){
      this.bookService.addBookCurrReading(this.loggedUser._id, this.id, this.book.title, this.book.authors, this.book.genres,
          "0", "0", "1", this.currPage, this.maxPage, "Knjiga se cita trenutno");
    }
  }

  updateValues(){
    if(this.currReadingForm.value.currPage > this.currReadingForm.value.maxPage) {
      window.location.reload();
    }else{
      this.currPage = this.currReadingForm.value.currPage;
      this.maxPage = this.currReadingForm.value.maxPage;
      this.bookService.updateCurrReading(this.loggedUser._id, this.id, this.currPage, this.maxPage);
    }
  }

  title = "star-angular";
  stars = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  rating = 0;
  hoverState = 0;

  configureRating: number=0;

  enter(i) {
    this.hoverState = i;
  }

  leave() {
    this.hoverState = 0;
  }

  updateRating(i) {
    this.rating = i;
  }

  addComment(){
    this.commentMessage=" ";
    let arr: string[] = this.commentForm.value.comment.split(/\s+/g);
    if(arr.length<=1000){
      if(this.rating!=0) {
        this.bookService.addComment(this.loggedUser._id, this.loggedUser.username, this.id, this.book.title, this.book.authors,
       this.rating, this.commentForm.value.comment);
       if(this.usersMeFollow.length>0){
         for(let i=0;i<this.usersMeFollow.length;i++){
           this.userService.notifyFollower(this.usersMeFollow[i].idUser, this.book._id, this.loggedUser.username, this.book.title);
         }
       }
        let mark: MarkAddUpdate = {
          idBook: this.id, oldMark: 0, newMark: this.rating
        };
        this.bookService.addMark(mark);
      }else{
        this.commentMessage="Morate oceniti."
      }
    }else {
      this.commentMessage="Komentar je duzi od 1000 reci koliko je dozvoljeno."
    }
  }

  configureComment(){
    this.router.navigate(['/commentConfigure', this.comment._id]);
  }

}
