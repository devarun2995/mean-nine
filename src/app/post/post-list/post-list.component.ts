import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../post.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy{
  // posts=[{title:'First', content: 'Content of first post.'},
  // {title:'Second', content: 'Content of second post.'},
  // {title:'Third', content: 'Content of Third post.'}];
  posts: Post[] =[];
  private postSub:Subscription;
  totalCount = 0;
  pageSize = 10;
  pageSizeOptions = [1, 2, 5, 10];
  currentPage = 1;
  isloading: boolean = false;
  isAuthed: boolean = false;
  private isAuthSub: Subscription;
  activeUserId: string;

  constructor(public postsService: PostsService, private authService: AuthService){
  }

  ngOnInit(){
    this.isloading = true;
    this.activeUserId = this.authService.getActiveUserId();
    this.postsService.getPost(this.pageSize, this.currentPage);
    this.postSub = this.postsService.getObervablePost()
    .subscribe((postData:{ posts:Post[], postCount: number}) => {
      this.isloading = false;
      this.totalCount = postData.postCount;
      this.posts = postData.posts;
    });
    this.isAuthed = this.authService.getIsUserAuth();
    this.isAuthSub = this.authService.getAuthStatus().
    subscribe(isAuthenticated =>{
      this.isAuthed = isAuthenticated;
      this.activeUserId = this.authService.getActiveUserId();
    });
  }

  onChangedPage(pageData: PageEvent){
    this.isloading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.pageSize = pageData.pageSize;
    this.postsService.getPost(this.pageSize, this.currentPage);
  }
  onDelete(paramId: string){
    this.postsService.deletePost(paramId).subscribe(() =>{
      this.postsService.getPost(this.pageSize, this.currentPage);
    }, ()=>{
      this.isloading = false;
    });
  }
  ngOnDestroy(){
    this.postSub.unsubscribe();
    this.isAuthSub.unsubscribe();
  }
}
