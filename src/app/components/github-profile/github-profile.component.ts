import { Component, OnInit, inject, signal } from '@angular/core'; // 👈 Додали OnDestroy
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GithubService } from '../../services/github.service';
import { Subject } from 'rxjs'; // 👈 Залишаємо для пошукового потоку
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators'; // 👈 Оператори пошуку
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-github-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './github-profile.component.html',
  styleUrl: './github-profile.component.css'
})
export class GithubProfileComponent implements OnInit { // 👈 Реалізуємо OnDestroy
  // 1. Інжектуємо наш сервіс для роботи з GitHub API
  private githubService = inject(GithubService);

  // 2. Створюємо сигнали для збереження базового стану
  profileData = signal<any>(null);      // Дані профілю (аватар, біо тощо)
  repositories = signal<any[]>([]);    // Масив перших 6 репозиторіїв
  isLoading = signal<boolean>(true);    // Стан завантаження сторінки

  // 🔍 3. Сигнали суто для РЕЗУЛЬТАТІВ ПОШУКУ
  searchTerms = new Subject<string>();
  isSearching = signal<boolean>(false);  // Спінер саме для пошуку

  // 🔥 УСЯ ЛОГІКА ПОШУКУ ЗГОРНУТА В ОДНЕ ОГОЛОШЕННЯ 🔥
  // Angular сам підпишеться, сам запише дані в Сигнал і сам відпишеться!
  searchResults = toSignal(
    this.searchTerms.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      tap(() => this.isSearching.set(true)), // Розумне увімкнення крутилки через потік
      switchMap((term: string) => {
        return this.githubService.searchRepositories(term).pipe(
          tap({
            next: () => this.isSearching.set(false),  // Розумне вимкнення крутилки
            error: () => this.isSearching.set(false)
          })
        );
      })
    ),
    {initialValue: []} // Захист від undefined для нашого HTML шаблону
  );

  ngOnInit(): void {
    // В ngOnInit залишилися ТІЛЬКИ стартові запити для профілю. Жодної каші з пошуком!
    this.githubService.getUserProfile().subscribe(data => this.profileData.set(data));
    this.githubService.getUserRepos().subscribe(repos => {
      this.repositories.set(repos);
      this.isLoading.set(false);
      // 📥 Метод, який хапає літери з HTML-інпуту і закидує в RxJS потік
    });
  }

  onSearchChange(term: string): void {
    this.searchTerms.next(term);
  }
}
