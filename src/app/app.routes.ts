import { Routes } from '@angular/router';
import {GithubProfileComponent} from './components/github-profile/github-profile.component'
import {TaskBoardComponent} from './components/task-board/task-board.component';
import {BookmarkLinksComponent} from './components/bookmark-links/bookmark-links.component'
import {authGuard} from './guard/auth.guard';


export const routes: Routes = [
  {path: '', redirectTo: 'profile', pathMatch: 'full' },
  {path: 'profile', component: GithubProfileComponent},
  {path: 'tasks', component: TaskBoardComponent, canActivate: [authGuard]},
  {path: 'links', component: BookmarkLinksComponent},


  {path: '**', redirectTo: 'profile'},
];
