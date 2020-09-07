import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ImageCheckValidator } from './image.validator';
import { BookService } from '../book.service';
import { UserService } from 'src/app/user/user.service';
import { LoggedUser } from 'src/app/user/models/loggedUser.model';


@Component({
  selector: 'app-book-add',
  templateUrl: './book-add.component.html',
  styleUrls: ['./book-add.component.css']
})
export class BookAddComponent implements OnInit {

  bookAddForm: FormGroup;
  preview: string;
  authors: string[] = [];
  genres: string[] = [];
  uslov: boolean = false;

  extensions: string[] = [
    "jpg", "jpeg", "png"
  ];

  constructor(private bookService: BookService, private userService: UserService) { }

  ngOnInit(): void {
    this.bookAddForm = new FormGroup({
      title: new FormControl(null,[Validators.required]),
      image: new FormControl(null,[ImageCheckValidator(this.extensions)]),
      author: new FormControl(null),
      issueDate:new FormControl(null,[Validators.required]),
      genres: new FormControl(null,[Validators.required]),
      description: new FormControl(null,[Validators.required])
    });
  }

  onBookAdd(){
    this.uslov=false;
    if(this.authors.length<=0){
      this.uslov=true;
      return;
    }
    if(this.bookAddForm.invalid){
      return;
    }
    let allowed :string = "0";
    let loggedUser: LoggedUser = this.userService.whoIsLogged();
    if(loggedUser.privilege === "A" || loggedUser.privilege === "M") allowed = "1";
    this.bookService.addBook(this.bookAddForm.value.title, this.bookAddForm.value.image, this.authors,
       this.bookAddForm.value.issueDate,this.genres, this.bookAddForm.value.description, allowed);
  }

  onImagePicked(event: Event){
    const file = (event.target as HTMLInputElement).files[0];
    this.bookAddForm.patchValue({image: file});
    this.bookAddForm.get('image').updateValueAndValidity();
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
    this.bookAddForm.patchValue({image: null});
    this.bookAddForm.get('image').updateValueAndValidity();
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
      this.genres = this.bookAddForm.value.genres;
  }

}
