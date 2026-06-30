import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core'; // 👈 Додали OnDestroy
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GithubService } from '../../services/github.service';
import { Subject, Subscription } from 'rxjs'; // 👈 Залишаємо для пошукового потоку
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators'; // 👈 Оператори пошуку

@Component({
  selector: 'app-github-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './github-profile.component.html',
  styleUrl: './github-profile.component.css'
})
export class GithubProfileComponent implements OnInit, OnDestroy { // 👈 Реалізуємо OnDestroy
  // 1. Інжектуємо наш сервіс для роботи з GitHub API
  private githubService = inject(GithubService);

  // 2. Створюємо сигнали для збереження базового стану
  profileData = signal<any>(null);      // Дані профілю (аватар, біо тощо)
  repositories = signal<any[]>([]);    // Масив перших 6 репозиторіїв
  isLoading = signal<boolean>(true);    // Стан завантаження сторінки

  // 🔍 3. Сигнали суто для РЕЗУЛЬТАТІВ ПОШУКУ
  searchResults = signal<any[]>([]);    // Знайдені репозиторії через інпут
  isSearching = signal<boolean>(false);  // Спінер саме для пошуку

  // 🚰 4. Елементи RxJS труби для пошуку
  private searchTerms = new Subject<string>(); // Джерело літер з інпуту
  private searchSubscription!: Subscription;   // Сюди збережемо підписку, щоб скасувати її потім

  ngOnInit(): void {
    // --- БАЗОВА ЛОГІКА ЗАВАНТАЖЕННЯ СТОРІНКИ ---

    // Підписуємося на потік даних профілю
    this.githubService.getUserProfile().subscribe({
      next: (data) => {
        this.profileData.set(data); // Записуємо результат у сигнал
      },
      error: (err) => console.error('Помилка завантаження профілю:', err)
    });

    // Підписуємося на потік перших 6 репозиторіїв
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

    this.searchSubscription = this.searchTerms.pipe(
      // Чекаємо 400 мс після зупинки введення
      debounceTime(400),

      // Ігноруємо, якщо слово збігається з попереднім
      distinctUntilChanged(),

      // Скасовуємо старий HTTP запит, якщо юзер ввів щось нове, і запускаємо свіжий пошук
      switchMap((term: string) => {
        this.isSearching.set(true);
        return this.githubService.searchRepositories(term);
      })
    ).subscribe({
      next: (repos) => {
        this.searchResults.set(repos); // Записуємо знайдені через пошук репозиторії
        this.isSearching.set(false);   // Вимикаємо пошуковий спінер
      },
      error: (err) => {
        console.error('Помилка пошуку:', err);
        this.isSearching.set(false);
      }
    });
  }

  // 📥 Метод, який хапає літери з HTML-інпуту і закидує в RxJS потік
  onSearchChange(term: string): void {
    this.searchTerms.next(term);
  }

  // 🧼 Чистимо пам'ять при переході на іншу сторінку (захист від Memory Leaks)
  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }
}
