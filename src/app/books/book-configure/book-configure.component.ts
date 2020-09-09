import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BookService } from '../book.service';
import { ImageCheckValidator } from './image.validator';
import { Subscription } from 'rxjs';
import { Book } from '../models/book.model';

@Component({
  selector: 'app-book-configure',
  templateUrl: './book-configure.component.html',
  styleUrls: ['./book-configure.component.css']
})
export class BookConfigureComponent implements OnInit, OnDestroy {

  id: number;
  bookConfigureForm: FormGroup;
  preview: string;
  authors: string[] = [];
  genres: string[] = [];
  uslov: boolean = false;
  book: Book;
  message: string = " ";
  private bookSub: Subscription;
  private bookConfigureSub: Subscription;
  private getGenresSub: Subscription;
  genresFront: string[] = [];

  extensions: string[] = [
    "jpg", "jpeg", "png"
  ];

  constructor(private route: ActivatedRoute, private bookService: BookService) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
    this.bookConfigureForm = new FormGroup({
      title: new FormControl(null,[Validators.required]),
      image: new FormControl(null,[ImageCheckValidator(this.extensions)]),
      author: new FormControl(null),
      issueDate:new FormControl(null,[Validators.required]),
      genres: new FormControl(null,[Validators.required]),
      description: new FormControl(null,[Validators.required])
    });
    this.bookSub = this.bookService.getBookListener()
      .subscribe((data) => {
        this.book = data;
        this.authors = JSON.parse(data.authors);
        this.genres = JSON.parse(data.genres);
        this.preview = data.imagePath;
        this.bookConfigureForm.setValue({
          title: data.title,
          image: null,
          author:null,
          issueDate: new Date(data.issueDate),
          genres: this.genres,
          description: data.description
        });
      });
    this.bookService.getBook(this.id);

    this.bookConfigureSub = this.bookService.getBookConfigureListener()
    .subscribe(data => {
      this.message = data;
    });

    this.getGenresSub = this.bookService.getGetGenresListener()
      .subscribe(data => {
        this.genresFront = [];
        for(let i=0;i<data.length;i++){
          this.genresFront.push(data[i].name);
        }
      });
    this.bookService.getGenres();
  }

  ngOnDestroy(): void {
    this.bookSub.unsubscribe();
    this.bookConfigureSub.unsubscribe();
    this.getGenresSub.unsubscribe();
  }

  onBookConfigure(){
    this.uslov=false;
    if(this.authors.length<=0){
      this.uslov=true;
      return;
    }
    if(this.bookConfigureForm.invalid){
      return;
    }
    this.bookService.configureBook(this.id, this.bookConfigureForm.value.title, this.bookConfigureForm.value.image, this.preview,
      this.authors, this.bookConfigureForm.value.issueDate,this.genres, this.bookConfigureForm.value.description,
      this.book.averageMark, this.book.allowed);
  }

  onImagePicked(event: Event){
    const file = (event.target as HTMLInputElement).files[0];
    this.bookConfigureForm.patchValue({image: file});
    this.bookConfigureForm.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.preview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  @ViewChild("file", {static: false})
  input: ElementRef;

  onDefault(){
    this.input.nativeElement.value=null;
    this.bookConfigureForm.patchValue({image: null});
    this.bookConfigureForm.get('image').updateValueAndValidity();
    this.preview = null;
  }

  addAuthor(author: string){
    this.authors.push(author);
  }

  deleteAuthor(author: string){
    this.authors = this.authors.filter(element => element.toLowerCase()!==author.toLowerCase());
  }

  getAuthors():string[]{
    return this.authors;
  }

  changed(){
    this.genres = this.bookConfigureForm.value.genres;
  }

}
