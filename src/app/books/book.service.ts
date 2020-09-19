import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Book } from './models/book.model';
import { Find } from './models/find.model';
import { Router } from '@angular/router';

import { Genre } from './models/genre';
import { UserBook } from './models/userBook.model';
import { Comment } from './models/comment.model';
import { MarkAddUpdate } from './models/markAddUpdate.model';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor(private http:HttpClient, private router: Router) { }

  private bookListListener = new Subject<Book[]>();
  private bookListener = new Subject<Book>();
  private booksNotAllowedListener = new Subject<Book[]>();
  private bookConfigureListener = new Subject<string>();
  private addGenreListener = new Subject<string>();
  private getGenresListener = new Subject<Genre[]>();
  private deleteGenreListener = new Subject<string>();
  private userBookListener = new Subject<UserBook>();
  private userBookReqListener = new Subject<string>();
  private userCommentListener = new Subject<Comment>();
  private configureCommentListener = new Subject<string>();

  private getAllBooksUserReadListener = new Subject<{books: UserBook[], count: number}>();
  private getAllBooksUserCurrReadListener = new Subject<{books: UserBook[], count: number}>();
  private getAllBooksUserWaitListener = new Subject<{books: UserBook[], count: number}>();
  private getAllBooksUserReadNoPaginatorListener = new Subject<UserBook[]>();

  private getAllCommentsUserWroteListener = new Subject<Comment[]>();
  private getAllCommentsForBookListener = new Subject<Comment[]>();

  getBookListListener(){
    return this.bookListListener.asObservable();
  }

  getBookListener(){
    return this.bookListener.asObservable();
  }

  getBooksNotAllowedListener(){
    return this.booksNotAllowedListener.asObservable();
  }

  getBookConfigureListener(){
    return this.bookConfigureListener.asObservable();
  }

  getAddGenreListener(){
    return this.addGenreListener.asObservable();
  }

  getGetGenresListener(){
    return this.getGenresListener.asObservable();
  }

  getDeleteGenreListener(){
    return this.deleteGenreListener.asObservable();
  }

  getUserBookListener(){
    return this.userBookListener.asObservable();
  }

  getUserBookReqListener(){
    return this.userBookReqListener.asObservable();
  }

  getUserCommentListener(){
    return this.userCommentListener.asObservable();
  }

  getConfigureCommentListener(){
    return this.configureCommentListener.asObservable();
  }

  getGetAllBooksUserReadListener(){
    return this.getAllBooksUserReadListener.asObservable();
  }

  getGetAllBooksUserCurrReadListener(){
    return this.getAllBooksUserCurrReadListener.asObservable();
  }

  getGetAllBooksUserWaitListener(){
    return this.getAllBooksUserWaitListener.asObservable();
  }

  getGetAllBooksUserReadNoPaginatorListener(){
    return this.getAllBooksUserReadNoPaginatorListener.asObservable();
  }

  getGetAllCommentsUserWroteListener(){
    return this.getAllCommentsUserWroteListener.asObservable();
  }

  getGetAllCommentsForBookListener(){
    return this.getAllCommentsForBookListener.asObservable();
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
      bookData.append("issueDate", issueDate.toLocaleDateString());
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
         issueDate: issueDate, genres: JSON.stringify(genres), description: description,
         averageMark: 0, sumMark: 0, numMark: 0, allowed: allowed
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

  getBooksNotAllowed(){
    this.http.get<{message:string, data: Book[]}>('http://localhost:3000/api/books/getBooksNotAllowed')
    .subscribe((responseData) => {
      this.booksNotAllowedListener.next([...responseData.data]);
    });
  }

  acceptBookRequest(id:number){
    this.http.get<{message:string}>('http://localhost:3000/api/books/acceptBookRequest/'+id)
      .subscribe(responseData => {
        console.log(responseData.message);
        window.location.reload();
      });
  }

  refuseBookRequest(id:number){
    this.http.delete<{message:string}>('http://localhost:3000/api/books/refuseBookRequest/'+id)
    .subscribe(responseData => {
      console.log(responseData.message);
      window.location.reload();
    });
  }

  configureBook(id:number, title: string, image: File, preview: string, authors: string[],
     issueDate: Date, genres: string[], description: string, averageMark:number, allowed: string){
    if(image!=null){
        const bookData = new FormData();
        bookData.append("title", title);
        bookData.append("image", image, image.name);
        bookData.append("authors", JSON.stringify(authors));
        bookData.append("issueDate", issueDate.toLocaleDateString());
        bookData.append("genres", JSON.stringify(genres));
        bookData.append("description", description);
        this.http.put<{message:string}>('http://localhost:3000/api/books/updateBookNewImage/'+id, bookData)
          .subscribe((responseData) => {
            console.log(responseData.message);
            this.bookConfigureListener.next(responseData.message);
            this.router.navigate(['/bookInfo', id]);
          }, error => {
            this.bookConfigureListener.next(error.error.message);
          });
    } else if(image==null && preview!=null){
      const book: Book = {
        _id:id, imagePath:preview, title:title, authors: JSON.stringify(authors),
         issueDate: issueDate, genres: JSON.stringify(genres), description: description,
         averageMark: averageMark,  sumMark: 0, numMark: 0, allowed: allowed
      };
      this.http.put<{message:string}>('http://localhost:3000/api/books/updateBookOldImage/'+id, book)
        .subscribe((responseData) => {
          console.log(responseData.message);
          this.bookConfigureListener.next(responseData.message);
            this.router.navigate(['/bookInfo', id]);
        }, error => {
          this.bookConfigureListener.next(error.error.message);
        });

    } else if(image==null && preview==null){
      const book: Book = {
        _id:id, imagePath:null, title:title, authors: JSON.stringify(authors),
         issueDate: issueDate, genres: JSON.stringify(genres), description: description,
         averageMark: averageMark,  sumMark: 0, numMark: 0, allowed: allowed
      };
      this.http.put<{message:string}>('http://localhost:3000/api/books/updateBookDefaultImage/'+id, book)
        .subscribe((responseData) => {
          console.log(responseData.message);
          this.bookConfigureListener.next(responseData.message);
            this.router.navigate(['/bookInfo', id]);
        }, error => {
          this.bookConfigureListener.next(error.error.message);
        });
    }
  }

  addGenre(name: string){
    const data: Genre = {
      _id:null, name:name
    };
    this.http.post<{message:string}>('http://localhost:3000/api/books/addGenre', data)
      .subscribe((responseData) => {
        console.log(responseData.message);
        window.location.reload();
      }, error => {
        this.addGenreListener.next(error.error.message);
      });
  }

  getGenres(){
    this.http.get<{message:string, data: Genre[]}>('http://localhost:3000/api/books/getGenres')
    .subscribe((responseData) => {
      this.getGenresListener.next([...responseData.data]);
    });
  }

  deleteGenre(id: number, name: string){
    const data: Genre = {
      _id:id, name:name
    };
    this.http.post<{message:string}>('http://localhost:3000/api/books/deleteGenre', data)
      .subscribe((responseData) => {
        console.log(responseData.message);
        window.location.reload();
      }, error => {
        this.deleteGenreListener.next(error.error.message);
      });
  }

  getUserBook(idUser: number, idBook: number){
    let data: UserBook = {
      _id: null,idUser: idUser, idBook: idBook, title: "", authors: "", genres: "",
       read: "0", wait: "0", currRead: "0", currPage: 0, maxPage: 0, statusMessage: ""
    };
    this.http.post<{message:string, data: UserBook}>('http://localhost:3000/api/books/getUserBook', data)
    .subscribe((responseData) => {
      if(!responseData.data){
        this.userBookListener.next(null);
      }else{
        this.userBookListener.next({...responseData.data});
      }

    });
  }

  addBookRead(idUser: number, idBook: number, title: string, authors: string, genres: string,
     read: string, wait: string, currRead: string, currPage: number, maxPage: number, statusMessage: string){
    let data: UserBook = {
      _id: null, idUser: idUser, idBook: idBook, title: title, authors: authors, genres: genres,
       read: read, wait: wait, currRead: currRead, currPage: currPage, maxPage: maxPage, statusMessage: statusMessage
    };
    this.http.post<{message:string}>('http://localhost:3000/api/books/addBookData', data)
      .subscribe((responseData) => {
        console.log(responseData.message);
        window.location.reload();
      }, error => {
        this.userBookReqListener.next(error.error.message);
      });
  }

  addBookList(idUser: number, idBook: number, title: string, authors: string, genres: string,
     read: string, wait: string, currRead: string, currPage: number, maxPage: number, statusMessage: string){
    let data: UserBook = {
      _id: null,idUser: idUser, idBook: idBook, title: title, authors: authors, genres: genres,
       read: read, wait: wait, currRead: currRead, currPage: currPage, maxPage: maxPage, statusMessage: statusMessage
    };
    this.http.post<{message:string}>('http://localhost:3000/api/books/addBookData', data)
      .subscribe((responseData) => {
        console.log(responseData.message);
        window.location.reload();
      }, error => {
        this.userBookReqListener.next(error.error.message);
      });
  }

  addBookCurrReading(idUser: number, idBook: number, title: string, authors: string, genres: string,
     read: string, wait: string, currRead: string, currPage: number, maxPage: number, statusMessage: string){
      let data: UserBook = {
        _id: null,idUser: idUser, idBook: idBook, title: title, authors: authors, genres: genres,
         read: read, wait: wait, currRead: currRead, currPage: currPage, maxPage: maxPage, statusMessage: statusMessage
      };
      this.http.post<{message:string}>('http://localhost:3000/api/books/addBookData', data)
        .subscribe((responseData) => {
          console.log(responseData.message);
          window.location.reload();
        }, error => {
          this.userBookReqListener.next(error.error.message);
        });
    }

  updateCurrReading(idUser: number, idBook: number, currPage: number, maxPage: number){
    let data: UserBook = {
      _id: null,idUser: idUser, idBook: idBook, title: "", authors: "", genres: "",
       read: "", wait: "", currRead: "", currPage: currPage, maxPage: maxPage, statusMessage: ""
    };
    this.http.post<{message:string}>('http://localhost:3000/api/books/updateCurrReadData', data)
        .subscribe((responseData) => {
          console.log(responseData.message);
          window.location.reload();
        }, error => {
          this.userBookReqListener.next(error.error.message);
        });
  }

  removeBookFromWaitingList(idUser: number, idBook: number){
    let data: UserBook = {
      _id: null,idUser: idUser, idBook: idBook, title: "", authors: "", genres: "",
     read: "0", wait: "0", currRead: "0", currPage: 0, maxPage: 0, statusMessage: ""
    };
    this.http.post<{message:string}>('http://localhost:3000/api/books/removeBookFromWaitingList', data)
      .subscribe((responseData) => {
        console.log(responseData.message);
        window.location.reload();
      }, error => {
        this.userBookReqListener.next(error.error.message);
      });
  }

  addComment(idUser: number, username: string, idBook: number, title: string, authors: string, rating: number, comment: string){
    let data: Comment = {
      _id: null, idUser: idUser, username: username, idBook: idBook, title: title, authors: authors, rating: rating, comment: comment
    };
    this.http.post<{message:string}>('http://localhost:3000/api/books/addComment', data)
      .subscribe((responseData) => {
        console.log(responseData.message);
        window.location.reload();
    });
  }

  addMark(mark: MarkAddUpdate){
    this.http.post<{message:string}>('http://localhost:3000/api/books/addMark', mark)
      .subscribe((responseData) => {
        console.log(responseData.message);
        window.location.reload();
    });
  }

  getComment(idUser: number, idBook: number){
    let data: Comment = {
      _id: null, idUser: idUser, username: "", idBook: idBook, title: "", authors: "", rating: 0, comment: ""
    };
    this.http.post<{message:string, data: Comment}>('http://localhost:3000/api/books/getComment', data)
    .subscribe((responseData) => {
      if(!responseData.data){
        this.userCommentListener.next(null);
      }else{
        this.userCommentListener.next({...responseData.data});
      }
    });
  }

  getCommentById(id: number){
    this.http.get<{message:string, data: Comment}>('http://localhost:3000/api/books/getCommentById/'+id)
    .subscribe((responseData) => {
      if(!responseData.data){
        this.userCommentListener.next(null);
      }else{
        this.userCommentListener.next({...responseData.data});
      }
    });
  }

  configureComment(_id: number, rating: number, comment: string, idBook: number){
    let data: Comment = {
      _id: _id, idUser: 0, username: "", idBook: 0, title: "", authors: "", rating: rating, comment: comment
    };
    this.http.post<{message:string}>('http://localhost:3000/api/books/configureComment', data)
      .subscribe((responseData) => {
        this.router.navigate(['/bookInfo', idBook]);
    }, error => {
        this.configureCommentListener.next(error.error.message);
    });
  }

  configureMark(mark: MarkAddUpdate){
    this.http.post<{message:string}>('http://localhost:3000/api/books/configureMark', mark)
    .subscribe((responseData) => {
      console.log(responseData.message);
      window.location.reload();
    });
  }

  getAllBooksUserRead(id: number, booksPerPage: number, currentPage: number){
    const queryParams = `?pagesize=${booksPerPage}&currentpage=${currentPage}`;
    this.http.get<{message:string, data: UserBook[], count: number}>('http://localhost:3000/api/books/getAllBooksUserRead/' + id + queryParams)
    .subscribe((responseData) => {
      this.getAllBooksUserReadListener.next({books: responseData.data, count: responseData.count});
    });
  }

  getAllBooksUserCurrRead(id: number, booksPerPage: number, currentPage: number){
    const queryParams = `?pagesize=${booksPerPage}&currentpage=${currentPage}`;
    this.http.get<{message:string, data: UserBook[], count: number}>('http://localhost:3000/api/books/getAllBooksUserCurrRead/' + id + queryParams)
    .subscribe((responseData) => {
      this.getAllBooksUserCurrReadListener.next({books: responseData.data, count: responseData.count});
    });
  }

  getAllBooksUserWait(id: number, booksPerPage: number, currentPage: number){
    const queryParams = `?pagesize=${booksPerPage}&currentpage=${currentPage}`;
    this.http.get<{message:string, data: UserBook[], count: number}>('http://localhost:3000/api/books/getAllBooksUserWait/' + id + queryParams)
    .subscribe((responseData) => {
      this.getAllBooksUserWaitListener.next({books: responseData.data, count: responseData.count});
    });
  }

  getAllBooksUserReadNoPaginator(id: number){
    this.http.get<{message:string, data: UserBook[]}>('http://localhost:3000/api/books/getAllBooksUserReadNoPaginator/' + id)
    .subscribe((responseData) => {
      this.getAllBooksUserReadNoPaginatorListener.next([...responseData.data]);
    });
  }

  getAllCommentsUserWrote(id: number){
    this.http.get<{message:string, data: Comment[]}>('http://localhost:3000/api/books/getAllCommentsUserWrote/' + id)
    .subscribe((responseData) => {
      this.getAllCommentsUserWroteListener.next([...responseData.data])
    });
  }

  getAllCommentsForBook(id: number){
    this.http.get<{message:string, data: Comment[]}>('http://localhost:3000/api/books/getAllCommentsForBook/' + id)
    .subscribe((responseData) => {
      this.getAllCommentsForBookListener.next([...responseData.data])
    });
  }

}
