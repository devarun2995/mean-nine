import { NgModule } from '@angular/core';
import { PostServiceComponent } from './post-sub/post-service.component';
import { PostListComponent } from './post-list/post-list.component';
import { AngularMaterialModule } from '../angular-material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations:[
    PostListComponent,
    PostServiceComponent
  ],
  imports:[
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    AngularMaterialModule
  ]
})
export class PostsModule{}
