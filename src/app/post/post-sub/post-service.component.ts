import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { PostsService } from '../post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import { mimeType } from './mime-type.validator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: "app-post-service",
  templateUrl: "./post-service.component.html",
  styleUrls: ["./post-service.component.css"]
})

export class PostServiceComponent implements OnInit, OnDestroy{
  enteredTitle = '';
  enteredContent = '';
  private mode = 'create';
  private postId:string;
  post: Post;
  isloading:boolean = false;
  form: FormGroup;
  imagePreview: string;
  private isAuthSub:Subscription;

constructor(public postsService: PostsService, public routes: ActivatedRoute,
  private authService: AuthService){}

  ngOnInit(){
    this.isAuthSub = this.authService.getAuthStatus().
    subscribe(isAuthenticated =>{
        this.isloading = false;
    });
    this.form = new FormGroup({
      title: new FormControl(null,
        {validators: [Validators.required, Validators.minLength(3)]}),
      content: new FormControl(null,
          {validators: [Validators.required, Validators.minLength(5)]}),
      image: new FormControl(null,
          {validators: [Validators.required], asyncValidators: [mimeType]})
    });
    this.routes.paramMap.subscribe((paramMap: ParamMap) =>{
      if(paramMap.has('postId')){
        this.mode='edit';
        this.postId = paramMap.get('postId');
        this.isloading = true;
        this.postsService.getSinglePost(this.postId).subscribe(postData =>{
          this.isloading = false;
          this.post = {id: postData._id,
             title: postData.title,
              content: postData.content,
              imagePath: postData.imagePath,
              creator: postData.creator};
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath
          });
        });
      }else{
        this.mode='create';
        this.postId = null;
      }
    });
  }

  onImagePicked(event: Event){
    const file= (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    const reader =  new FileReader();
    reader.onload = () =>{
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSavePost(){
    if(this.form.invalid){
        return;
    }
    this.isloading = true;
    if(this.mode === 'create'){
      this.postsService.addPost(this.form.value.title, this.form.value.content, this.form.value.image);
      this.form.reset();
    }else{
      this.postsService.updatePost(this.postId, this.form.value.title, this.form.value.content, this.form.value.image);
      this.form.reset();
    }
  }
  ngOnDestroy(){
      this.isAuthSub.unsubscribe();
  }
}
