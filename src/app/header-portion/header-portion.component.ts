import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector :"app-header-portion",
  templateUrl: "./header-portion.component.html",
  styleUrls: ["./header-portion.component.css"]
})
export class HeaderPortionComponent implements OnInit, OnDestroy{
 constructor(private authService: AuthService){}

 private authSubs : Subscription;
 userAuthenticated = false;

  ngOnInit(){
    this.userAuthenticated = this.authService.getIsUserAuth();
    this.authSubs = this.authService.getAuthStatus().subscribe(isUserAuthed =>{
        this.userAuthenticated = isUserAuthed;
    });
  }
  onLogout(){
    this.authService.logout();
  }
  ngOnDestroy(){
    this.authSubs.unsubscribe();
  }



}
