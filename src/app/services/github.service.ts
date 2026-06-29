import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  // Використовуємо ін'єкцію залежностей через inject() замість конструктора — це сучасний стандарт Angular
  private http = inject(HttpClient);
  private baseUrl = 'https://api.github.com/users';

  // Стан імені користувача через Signal
  username = signal<string>('BogdanFromUkraine');

  // Метод для отримання загальних даних профілю (аватар, біо, кількість репо)
  getUserProfile(): Observable<any> {
    return this.http.get(`${this.baseUrl}/${this.username()}`)
      .pipe(map((user: any) => {
        return {
          login: user.login,
          avatarUrl: user.avatar_url, // Перейменовуємо на зручний camelCase
          name: user.name || 'Анонімний розробник', // Робимо дефолтне значення
          bio: user.bio ? `🚀 ${user.bio}` : 'Опис профілю відсутній.', // Модифікуємо рядок
          publicRepos: user.public_repos,
          followers: user.followers
        }
      }));
  }

  // Метод для отримання останніх 6 репозиторіїв, відсортованих за оновленням
  getUserRepos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${this.username()}/repos?sort=updated&per_page=6`);
  }
}
