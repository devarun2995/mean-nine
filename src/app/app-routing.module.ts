import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostListComponent } from './post/post-list/post-list.component';
import { PostServiceComponent } from './post/post-sub/post-service.component';
import { AuthGuard } from './auth/auth.guard';


const routes: Routes = [
  {path :'', component: PostListComponent},
  {path: 'create', component: PostServiceComponent, canActivate:[AuthGuard]},
  {path: 'edit/:postId', component: PostServiceComponent, canActivate:[AuthGuard]},
  {path: 'auth', loadChildren: () => import('./auth/auth.module').then( m => m.Authmodule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
