import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Book } from './models/book.model';
import { Find } from './models/find.model';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor(private http:HttpClient) { }

  private bookListListener = new Subject<Book[]>();
  private bookListener = new Subject<Book>();

  getBookListListener(){
    return this.bookListListener.asObservable();
  }

  getBookListener(){
    return this.bookListener.asObservable();
  }

  getBooks(){
    this.http.get<{message:string, data: Book[]}>('http://localhost:3000/api/books/getBooks')
    .subscribe((responseData) => {
      this.bookListListener.next([...responseData.data]);
    });
  }

  addBook(title:string, image: File, authors: string[], issueDate: Date, genres: string[], description: string, allowed: string){
    if(image!=null){
      const bookData = new FormData();
      bookData.append("title", title);
      bookData.append("image", image, image.name);
      bookData.append("authors", JSON.stringify(authors));
      bookData.append("issueDate", issueDate.toDateString());
      bookData.append("genres", JSON.stringify(genres));
      bookData.append("description", description);
      bookData.append("allowed", allowed);
      this.http.post<{message:string}>('http://localhost:3000/api/books/addBookImage', bookData)
        .subscribe((responseData) => {
          console.log(responseData.message);
          window.location.reload();
        });
    }else if(image==null){
      const book: Book = {
        _id:null, imagePath:null, title:title, authors: JSON.stringify(authors),
         issueDate: issueDate.toDateString(), genres: JSON.stringify(genres), description: description,
         averageMark: null, allowed: allowed
      };
      this.http.post<{message:string}>('http://localhost:3000/api/books/addBookNoImage', book)
        .subscribe((responseData) => {
          console.log(responseData.message);
          window.location.reload();
        });
    }

  }

  find(title:string, author:string, genres:string[]){
    const obj:Find = {
      title: title, author: author, genres: genres
    };
    this.http.post<{message:string, data: Book[]}>('http://localhost:3000/api/books/findBooks',obj)
    .subscribe((responseData) => {
      this.bookListListener.next([...responseData.data]);
    });
  }

  getBook(id:number){
    this.http.get<{message:string, data: Book}>('http://localhost:3000/api/books/getBook/'+id)
    .subscribe((responseData) => {
      this.bookListener.next({...responseData.data});
    });
  }

}
