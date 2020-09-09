import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Book } from 'src/app/books/models/book.model';
import { BookService } from 'src/app/books/book.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-moderator',
  templateUrl: './moderator.component.html',
  styleUrls: ['./moderator.component.css']
})
export class ModeratorComponent implements OnInit, OnDestroy {

  id:number;
  displayedColumnsForRequests: string[] = ['title', 'authors', 'genres', 'path', 'accept', 'refuse'];
  private booksNotAllowedSub: Subscription;
  bookRequests: Book[] = [];

  constructor(private route: ActivatedRoute, private bookService: BookService) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
    this.booksNotAllowedSub = this.bookService.getBooksNotAllowedListener()
      .subscribe(data => {
        this.bookRequests = data;
        this.bookRequests = this.niceOutput(this.bookRequests);
      });
    this.bookService.getBooksNotAllowed();
  }

  ngOnDestroy(): void {
    this.booksNotAllowedSub.unsubscribe();
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


  acceptRequest(id:number){
    this.bookService.acceptBookRequest(id);
  }

  refuseRequest(id:number){
    this.bookService.refuseBookRequest(id);
  }

}
