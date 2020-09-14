import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { BookService } from '../book.service';
import { Comment } from '../models/comment.model';
import { MarkAddUpdate } from '../models/markAddUpdate.model';

@Component({
  selector: 'app-comment-configure',
  templateUrl: './comment-configure.component.html',
  styleUrls: ['./comment-configure.component.css']
})
export class CommentConfigureComponent implements OnInit, OnDestroy {

  commentConfigureForm: FormGroup;
  private userCommentSub: Subscription = null;
  private configureCommentSub: Subscription;
  id: number;
  comment: Comment;
  message: string = " ";
  commentMessage: string = " ";
  oldRating: number;

  constructor(private route: ActivatedRoute, private bookService: BookService) { }

  ngOnInit(): void {
    this.commentConfigureForm = new FormGroup({
      comment: new FormControl(null)
    });
    this.id = this.route.snapshot.params.id;
    this.userCommentSub = this.bookService.getUserCommentListener()
      .subscribe(data => {
        this.comment = data;
        this.rating = this.comment.rating;
        this.oldRating = this.comment.rating;
        this.commentConfigureForm.patchValue({
          comment: this.comment.comment
        });
      });
    this.configureCommentSub = this.bookService.getConfigureCommentListener()
      .subscribe(data =>{
        this.message = data;
      });
    this.bookService.getCommentById(this.id);
  }

  ngOnDestroy(): void {
    this.userCommentSub.unsubscribe();
    this.configureCommentSub.unsubscribe();
  }

  title = "star-angular";
  stars = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  rating = 0;
  hoverState = 0;

  enter(i) {
    this.hoverState = i;
  }

  leave() {
    this.hoverState = 0;
  }

  updateRating(i) {
    this.rating = i;
  }

  onCommentConfigure(){
    alert(this.oldRating + " " + this.rating)
    this.commentMessage=" ";
    let arr: string[] = this.commentConfigureForm.value.comment.split(/\s+/g);
    if(arr.length<=1000){
      if(this.rating!=0) {
        this.bookService.configureComment(this.id, this.rating, this.commentConfigureForm.value.comment, this.comment.idBook);
        let mark: MarkAddUpdate = {
          idBook: this.comment.idBook, oldMark: this.oldRating, newMark: this.rating
        };
        this.bookService.configureMark(mark);
      }else{
        this.commentMessage="Morate oceniti."
      }
    }else {
      this.commentMessage="Komentar je duzi od 1000 reci koliko je dozvoljeno."
    }


  }

}
