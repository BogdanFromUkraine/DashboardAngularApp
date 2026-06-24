import { Routes } from '@angular/router';
import {GithubProfileComponent} from './components/github-profile/github-profile.component'


export const routes: Routes = [
  {path: '', redirectTo: 'profile', pathMatch: 'full' },
  {path: 'profile', component: GithubProfileComponent},


  {path: '**', redirectTo: 'profile'},
];
