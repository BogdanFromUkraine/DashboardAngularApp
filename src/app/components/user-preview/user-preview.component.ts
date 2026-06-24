import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-preview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="preview-card">
      <h4>Попередній перегляд</h4>
      <div class="user-info">
        <p><strong>Нікнейм:</strong> {{ githubUsername() || 'Не вказано' }}</p>
        <p><strong>Поточна роль:</strong> {{ devRole() }}</p>
      </div>
      <button (click)="onReset.emit()" class="btn-reset">Скинути налаштування</button>
    </div>
  `,
  styles: [`
    .preview-card {
      background-color: #1e1e2e;
      border: 1px dashed #b4befe;
      border-radius: 8px;
      padding: 15px;
      margin-top: 15px;
    }
    .preview-card h4 { margin-top: 0; color: #b4befe; }
    .user-info p { color: #cdd6f4; font-size: 14px; margin: 5px 0; }
    .btn-reset {
      background-color: #f38ba8;
      color: #11111b;
      border: none;
      padding: 5px 10px;
      border-radius: 4px;
      font-size: 12px;
      cursor: pointer;
      margin-top: 10px;
    }
    .btn-reset:hover { background-color: #eba0b2; }
  `]
})
export class UserPreviewComponent {
  // Вхідні дані від батька (Вниз)
  githubUsername = input<string>('');
  devRole = input<string>('Fullstack Developer');

  // Подія для батька (Вгору)
  onReset = output<void>();
}
