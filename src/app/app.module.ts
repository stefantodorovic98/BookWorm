import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from "@angular/material/core";
import { MatListModule } from "@angular/material/list";
import { MatSelectModule } from "@angular/material/select";
import { MatTableModule } from "@angular/material/table";
import { MatProgressBarModule } from "@angular/material/progress-bar";

import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './user/login/login.component';
import { RegisterComponent } from './user/register/register.component';
import { FooterComponent } from './footer/footer.component';

import { NgxCaptchaModule } from 'ngx-captcha';
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
import { StarRatingComponent } from './books/star-rating/star-rating.component';
import { CommentConfigureComponent } from './books/comment-configure/comment-configure.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    RegisterComponent,
    FooterComponent,
    ForgottenPasswordComponent,
    BookListComponent,
    BookAddComponent,
    BookInfoComponent,
    UserInfoComponent,
    UserConfigureComponent,
    ChangePasswordComponent,
    NewPasswordComponent,
    LogoutComponent,
    AdminComponent,
    BookConfigureComponent,
    ModeratorComponent,
    StarRatingComponent,
    CommentConfigureComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatDatepickerModule,
    MatIconModule,
    MatSelectModule,
    MatNativeDateModule,
    MatListModule,
    MatTableModule,
    MatProgressBarModule,
    NgxCaptchaModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
