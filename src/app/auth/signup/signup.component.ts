import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector :"signup",
  templateUrl: './signup.component.html',
  styleUrls: ["./signup.component.css"]
})

export class SignupComponent implements OnInit, OnDestroy{
  isloading: boolean = false;
  authSub = new Subscription;

  constructor(private authService: AuthService){
  }

  ngOnInit(){
     this.authSub = this.authService.getAuthStatus().subscribe(authStatus =>{
        this.isloading = false;
      });
  }

  onSignup(signupForm: NgForm){
    this.isloading = true;
    if(signupForm.invalid){
      return;
    }
    this.authService.createUser(signupForm.value.email, signupForm.value.password);  }

  ngOnDestroy(){
      this.authSub.unsubscribe();
  }
}
