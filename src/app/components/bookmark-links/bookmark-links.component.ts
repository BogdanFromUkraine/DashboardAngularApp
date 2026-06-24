import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GithubService } from '../../services/github.service';
import { UserPreviewComponent } from '../user-preview/user-preview.component'; // Імпортуємо дочірній TS клас

@Component({
  selector: 'app-bookmark-links',
  standalone: true,
  imports: [CommonModule, FormsModule, UserPreviewComponent], // Реєструємо його тут
  templateUrl: './bookmark-links.component.html',
  styleUrl: './bookmark-links.component.css'
})
export class BookmarkLinksComponent {
  private githubService = inject(GithubService);

  // Стан форми на базі локальних сигналів
  inputUsername = signal<string>(this.githubService.username());
  currentRole = signal<string>('.NET & Angular Developer');

  // Зберігаємо налаштування в глобальний сервіс
  saveSettings(): void {
    if (!this.inputUsername().trim()) return;

    this.githubService.username.set(this.inputUsername());
    alert('Налаштування успішно збережено!');
  }

  // Метод відпрацьовує, коли дитина каже "onReset"
  resetUsername(): void {
    this.inputUsername.set('BohdanBoyko');
    this.githubService.username.set('BohdanBoyko');
  }
}
