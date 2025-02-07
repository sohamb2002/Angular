import { Routes } from '@angular/router';
import { UserComponent} from './components/user/user.component';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';
//import { CreatePostDialogueComponent } from './components/create-post-dialogue/create-post-dialogue.component';
import { PostComponent } from './components/post/post.component';
import { CreateEditComponent } from './components/create-edit/create-edit.component';

export const routes: Routes = [
  {
    path: 'User',  // Route to '/user'
    component: UserComponent,  // Attach the UserComponent
  },
  {
    path: 'newUser',
    component: CreateUserComponent,
  },
  { 
    path: 'editUser/:id', 
    component: EditUserComponent 
  },
 {
  path: 'Posts',
  component: PostComponent
 },
 {
  path: 'newPost',
  component: CreateEditComponent
 },
 {
  path: 'editPost/:id',
  component: CreateEditComponent
 }

  
];
