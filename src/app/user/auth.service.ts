import {Injectable} from '@angular/core';

import {User} from './user';
import {MessageService} from '../messages/message.service';
import {Observable, throwError} from "rxjs";
import {Product} from "../products/product";
import {catchError, tap} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    currentUser: User;
    redirectUrl: string;
    private usersUrl = 'api/users';

    get isLoggedIn(): boolean {
        return !!this.currentUser;
    }

    constructor(private messageService: MessageService,
                private http: HttpClient) {
    }

    login(userName: string, password: string): void {
        if (!userName || !password) {
            this.messageService.addMessage('Please enter your userName and password');
            return;
        }
        this.messageService.addMessage(`User: ${this.currentUser.userName} logged in`);
    }

    logout(): void {
        this.currentUser = null;
    }

    getUsers(): Observable<User[]> {
        return this.http.get<User[]>(this.usersUrl)
            .pipe(
                tap(users => {
                    console.log(JSON.stringify(users));
                }),
                catchError(this.handleError)
            );
    }

    createUser(username: string, psw: string): Observable<User> {
        return this.http.post<User>(this.usersUrl,
            {
              userName: username,
              password: psw,
              isAdmin: false,
            })
            .pipe(
                tap(data => console.log(JSON.stringify(data))),
                catchError(this.handleError)
            );
    }

    private handleError(err) {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        let errorMessage: string;
        if (err.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            errorMessage = `An error occurred: ${err.error.message}`;
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
        }
        console.error(err);
        return throwError(errorMessage);
    }

}


