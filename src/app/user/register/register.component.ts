import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';

import {User} from "../user";
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";

@Component({
    templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {
    errorMessage: string;
    pageTitle = 'Register';

    users: User[] = [];

    constructor(private authService: AuthService,
                private router: Router) {
    }

    ngOnInit(): void {
        this.updateUsers();
    }

    register(registerForm: NgForm) {
        if (registerForm && registerForm.valid && !this.alreadyTaken(registerForm.form.value.userName)) {
            this.authService.createUser(registerForm.form.value.userName,
                registerForm.form.value.password).subscribe((data) => {
                    console.log(data)
            });
            this.updateUsers();
            this.router.navigate(['/login']);
        } else {
            this.errorMessage = 'Username already taken!!';
        }

    }

    updateUsers() {
        this.authService.getUsers().subscribe({
            next: users => {
                this.users = users;
            },
            error: err => this.errorMessage = err
        });
    }


    alreadyTaken(username: string): boolean {
        let user = this.users.find((user) => {
            return user.userName === username;
        });
        return !!user;
    }
}
