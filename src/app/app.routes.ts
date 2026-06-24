import { Routes } from '@angular/router';
import {GithubProfileComponent} from './components/github-profile/github-profile.component'
import {TaskBoardComponent} from './components/task-board/task-board.component';
import {BookmarkLinksComponent} from './components/bookmark-links/bookmark-links.component'


export const routes: Routes = [
  {path: '', redirectTo: 'profile', pathMatch: 'full' },
  {path: 'profile', component: GithubProfileComponent},
  {path: 'tasks', component: TaskBoardComponent},
  {path: 'links', component: BookmarkLinksComponent},


  {path: '**', redirectTo: 'profile'},
];
