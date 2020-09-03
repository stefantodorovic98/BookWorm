import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterComponent } from './user/register/register.component';
import { LoginComponent } from './user/login/login.component';
import { ForgottenPasswordComponent } from './user/forgotten-password/forgotten-password.component';
import { BookListComponent } from './books/book-list/book-list.component';
import { BookAddComponent } from './books/book-add/book-add.component';
import { BookInfoComponent } from './books/book-info/book-info.component';

const routes: Routes = [
  {path:"", component:LoginComponent},
  {path:"login", component:LoginComponent},
  {path:"register", component:RegisterComponent},
  {path:"forgottenPassword", component: ForgottenPasswordComponent},
  {path:"bookList", component: BookListComponent},
  {path:"bookAdd", component: BookAddComponent},
  {path:"bookInfo/:id", component: BookInfoComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
