import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthModel } from './auth-user.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import {environment} from '../../environments/environment'

const BACKEND_URL= environment.apiUrl + "/user";

@Injectable({ providedIn:"root"})
export class AuthService{
  token: string;
  private authListner = new Subject<boolean>();
  constructor(private http: HttpClient, private router:Router){}
  private isUserAuth:boolean = false;
  sessionKeeper: any;
  private userId: string;

  createUser(email:string, password:string){
    const authData : AuthModel={email:email, password:password };
    this.http.post(BACKEND_URL + '/signup', authData).subscribe(
      response =>{
        this.router.navigate(['/']);
      }, error =>{
        this.authListner.next(false);
      });
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isUserAuth = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authListner.next(true);
    }
  }

  getActiveUserId(){
    return this.userId;
  }
  login(email:string, password:string){
    const authData : AuthModel={email:email, password:password };
    this.http.post<{token: string, expiresIn: number, userId: string}>(BACKEND_URL +'/login', authData).subscribe(
      response =>{
        const token = response.token;
        const expirationTimer = response.expiresIn;
        this.userId = response.userId;
        this.setAuthTimer(expirationTimer);
        this.token = token;
        if(token){
          this.isUserAuth = true;
          this.authListner.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expirationTimer * 1000);
          console.log(expirationDate);
          this.saveAuthData(token, expirationDate, this.userId);
          this.router.navigate(['/']);
        }
    }, error =>{
      this.authListner.next(false);
    });
  }
  getToken(){
    return this.token;
  }
  getAuthStatus(){
    return this.authListner.asObservable();
  }
  getIsUserAuth(){
    return this.isUserAuth;
  }
  logout(){
    this.isUserAuth = false;
    this.authListner.next(false);
    this.token = null;
    this.userId = null;
    this.removeAuthData();
    this.router.navigate(['/']);
    clearTimeout(this.sessionKeeper);
  }

  saveAuthData(token: string, expitationDate: Date, userId: string){
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expitationDate.toISOString());
    localStorage.setItem("userId", userId);
  }
  removeAuthData(){
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
  }

  private setAuthTimer(duration: number) {
    console.log("Setting timer: " + duration);
    this.sessionKeeper = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    }
  }
}
