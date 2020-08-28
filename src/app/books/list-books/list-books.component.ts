import { Component, OnInit } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { User } from './user.model'
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-list-books',
  templateUrl: './list-books.component.html',
  styleUrls: ['./list-books.component.css']
})
export class ListBooksComponent implements OnInit {

  constructor(private http: HttpClient) { }

  users: User[] = [];
  public user: User;
  message:string;

  ngOnInit(): void {
    this.http.get<{message: string, users: User[]}>('http://localhost:3000/api/user/get')
    .subscribe((postData) => {
      this.users = postData.users;
    });

  }

  dodaj(loginForm: NgForm){
    alert("cao")
    this.user = {
      _id: null,
      ime: loginForm.value.ime as string,
      prezime : loginForm.value.prezime as string
    }
    this.http.post<{message:string}>('http://localhost:3000/api/user/add',this.user)
    .subscribe((postData)=>{
      this.message=postData.message;
    });
  }

}
