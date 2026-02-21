import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LostItemsComponent } from './components/lost-items/lost-items.component';
import { FoundItemsComponent } from './components/found-items/found-items.component';
import { PostItemComponent } from './components/post-item/post-item.component';
import { ItemDetailsComponent } from './components/item-details/item-details.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'lost', component: LostItemsComponent },
  { path: 'found', component: FoundItemsComponent },
  { path: 'post', component: PostItemComponent },
  { path: 'item/:id', component: ItemDetailsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: '**', redirectTo: '' }
];
