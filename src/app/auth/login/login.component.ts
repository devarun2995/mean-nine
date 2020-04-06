import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForOfContext } from '@angular/common';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector :"login",
  templateUrl: './login.component.html',
  styleUrls: ["./login.component.css"]
})

export class LoginComponent implements OnInit, OnDestroy{
  isloading: boolean = false;
  authSub = new Subscription;

  constructor(private authService: AuthService){
  }

  ngOnInit(){
     this.authSub = this.authService.getAuthStatus().subscribe(authStatus =>{
        this.isloading = false;
      });
  }
  onLogin(loginForm: NgForm){
    this.isloading = true;
    this.authService.login(loginForm.value.email, loginForm.value.password);
  }
  ngOnDestroy(){
    this.authSub.unsubscribe();
}
}
