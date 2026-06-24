import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GithubService } from '../../services/github.service';

@Component({
  selector: 'app-github-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './github-profile.component.html',
  styleUrl: './github-profile.component.css'
})
export class GithubProfileComponent implements OnInit {
  // 1. Інжектуємо наш сервіс для роботи з GitHub API
  private githubService = inject(GithubService);

  // 2. Створюємо сигнали для збереження стану
  profileData = signal<any>(null);      // Дані профілю (аватар, біо тощо)
  repositories = signal<any[]>([]);    // Масив репозиторіїв
  isLoading = signal<boolean>(true);    // Стан завантаження

  ngOnInit(): void {
    // 3. Підписуємося на потік даних профілю
    this.githubService.getUserProfile().subscribe({
      next: (data) => {
        this.profileData.set(data); // Записуємо результат у сигнал
      },
      error: (err) => console.error('Помилка завантаження профілю:', err)
    });

    // 4. Підписуємося на потік репозиторіїв
    this.githubService.getUserRepos().subscribe({
      next: (repos) => {
        this.repositories.set(repos); // Записуємо масив у сигнал
        this.isLoading.set(false);     // Вимикаємо індикатор завантаження
      },
      error: (err) => {
        console.error('Помилка завантаження репозиторіїв:', err);
        this.isLoading.set(false);
      }
    });
  }
}
