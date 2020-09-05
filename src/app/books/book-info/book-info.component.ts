import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Book } from '../models/book.model';
import { BookService } from '../book.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-book-info',
  templateUrl: './book-info.component.html',
  styleUrls: ['./book-info.component.css']
})
export class BookInfoComponent implements OnInit, OnDestroy {

  book: Book;
  private bookSub: Subscription;

  constructor(private service: BookService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    let id = this.route.snapshot.params.id;
    this.bookSub = this.service.getBookListener()
      .subscribe((data) => {
        this.book = data;
        this.book = this.niceOutput(this.book);
      });
    this.service.getBook(id);
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

}
