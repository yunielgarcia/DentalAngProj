import {Component, OnInit} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';
import {User} from "./user";

@Component({
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit{
  errorMessage: string;
  pageTitle = 'Log In';
  usersFromDb: User[] = [];
  currentUser:User = null;

  constructor(private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
    this.updateUsers();
  }

  login(loginForm: NgForm) {
    let userName = loginForm.form.value.userName;
    let password = loginForm.form.value.password;

    if (loginForm && loginForm.valid && this.findUser(userName, password)) {

      this.authService.currentUser = this.currentUser;

      this.authService.login(userName, password);

      // Navigate to the Product List page after log in.
      if (this.authService.redirectUrl) {
        this.router.navigateByUrl(this.authService.redirectUrl);
      } else {
        this.router.navigate(['/products']);
      }
    } else {
      this.errorMessage = 'Please check user name and password.';
    }
  }

  updateUsers() {
    this.authService.getUsers().subscribe({
      next: users => {
        this.usersFromDb = users;
      },
      error: err => this.errorMessage = err
    });
  }

  private findUser(username: string, psw: string): boolean {
    this.currentUser = this.usersFromDb.find((user) => {
      return user.userName === username && user.password === psw;
    });
    return !!this.currentUser ;
  }
}
