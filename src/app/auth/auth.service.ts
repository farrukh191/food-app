import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';
import { User } from './user.model';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new BehaviorSubject<User | null>(null);
  private tokenExpirationTimer: any;
  baseUrl: string = 'https://identitytoolkit.googleapis.com/v1/accounts';
  signIn: string = 'signInWithPassword';
  signUp: string = 'signUp';
  webApi: string = 'AIzaSyCrFdE8grNAJ74WEbsRB7QbROmyjHj2hK8';

  constructor(private http: HttpClient, private router: Router) {}

  signup(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        `${this.baseUrl}:${this.signUp}?key=${this.webApi}`,
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        tap((resData) => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }

  login(email: string, password: string) {
    return this.http.post(`${this.baseUrl}:${this.signIn}?key=${this.webApi}`, {
      email: email,
      password: password,
      returnSecureToken: true,
    });
  }

  handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);

    this.user.next(user);
    // this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }
  logout() {
    // debugger
    this.user.next(null);
    this.router.navigate(['/']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }
  autoLogin() {
    // debugger
    const ddata: string | any | null = localStorage.getItem('userData');
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(ddata);

    // this.loadUser(userData);
    if (!userData) {
      return;
    }
    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );
    if (loadedUser.token) {
      this.checkTokenValid(loadedUser, userData);
    } else {
      this.router.navigate(['/']);
    }
  }

  checkTokenValid(loadedUser: User, userData: any) {
    this.user.next(loadedUser);
    const expirationDuration =
      new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
    //   this.autoLogout(expirationDuration);
    this.router.navigate(['/dashboard']);
  }
}
