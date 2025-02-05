import { Routes } from '@angular/router';
import { UserComponent, } from './components/user/user.component';
import { CreateUserComponent } from './components/create-user/create-user.component';

export const routes: Routes = [
  {
    path: 'User',  // Route to '/user'
    component: UserComponent,  // Attach the UserComponent
  },
  {
    path: 'newUser',
    component: CreateUserComponent,
  }
];
