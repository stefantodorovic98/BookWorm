import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterComponent } from './user/register/register.component';
import { LoginComponent } from './user/login/login.component';
import { ForgottenPasswordComponent } from './user/forgotten-password/forgotten-password.component';
import { BookListComponent } from './books/book-list/book-list.component';
import { BookAddComponent } from './books/book-add/book-add.component';
import { BookInfoComponent } from './books/book-info/book-info.component';
import { UserInfoComponent } from './user/user-info/user-info.component';
import { UserConfigureComponent } from './user/user-configure/user-configure.component';
import { ChangePasswordComponent } from './user/change-password/change-password.component';
import { NewPasswordComponent } from './user/new-password/new-password.component';
import { LogoutComponent } from './user/logout/logout.component';
import { AdminComponent } from './user/admin/admin.component';
import { BookConfigureComponent } from './books/book-configure/book-configure.component';
import { ModeratorComponent } from './user/moderator/moderator.component';
import { CommentConfigureComponent } from './books/comment-configure/comment-configure.component';
import { UserListComponent } from './user/user-list/user-list.component';
import { NotificationComponent } from './user/notification/notification.component';

const routes: Routes = [
  {path:"", component:LoginComponent},
  {path:"login", component:LoginComponent},
  {path:"logout", component: LogoutComponent},
  {path:"register", component:RegisterComponent},
  {path:"forgottenPassword", component: ForgottenPasswordComponent},
  {path:"bookList", component: BookListComponent},
  {path:"bookAdd", component: BookAddComponent},
  {path:"bookInfo/:id", component: BookInfoComponent},
  {path:"userInfo/:id", component: UserInfoComponent},
  {path:"userConfigure/:id", component: UserConfigureComponent},
  {path:"changePassword/:id", component: ChangePasswordComponent},
  {path:"newPassword/:id", component: NewPasswordComponent},
  {path:"admin/:id", component: AdminComponent},
  {path:"bookConfigure/:id", component: BookConfigureComponent},
  {path:"moderator/:id", component: ModeratorComponent},
  {path:"commentConfigure/:id", component: CommentConfigureComponent},
  {path:"userList", component: UserListComponent},
  {path:"notifications/:id", component: NotificationComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
