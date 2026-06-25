import { Directive, ElementRef, HostListener, Renderer2, input } from '@angular/core';

@Directive({
  selector: '[appHighlightStatus]',
  standalone: true
})
export class HighlightStatusDirective {
  // 1. Приймаємо статус таски ззовні
  taskStatus = input.required<string>({ alias: 'appHighlightStatus' });

  // 2. Впроваджуємо інструменти для роботи з HTML-елементом
  constructor(
    private el: ElementRef,      // Посилання на поточний HTML-тег
    private renderer: Renderer2  // Безпечний інструмент для зміни стилів
  ) {}

  // 3. Слухаємо подію "наведення мишки"
  @HostListener('mouseenter')
  onMouseEnter() {
    const color = this.getStatusColor(this.taskStatus());
    this.setShadow(color);
  }

  // 4. Слухаємо подію "мишка пішла геть"
  @HostListener('mouseleave')
  onMouseLeave() {
    this.setShadow('transparent'); // Прибираємо підсвічування
  }

  // Допоміжний метод для вибору кольору
  private getStatusColor(status: string): string {
    switch (status) {
      case 'todo': return '#b4befe';        // Лавандовий
      case 'in-progress': return '#f9e2af'; // Жовтий
      case 'done': return '#a6e3a1';        // Зелений
      default: return '#45475a';            // Сірий дефолтний
    }
  }

  // Метод, який безпосередньо міняє CSS стилі елемента
  private setShadow(color: string) {
    const styleValue = color === 'transparent'
      ? 'none'
      : `0 0 12px 2px ${color}, inset 0 0 0 1px ${color}`;

    this.renderer.setStyle(this.el.nativeElement, 'boxShadow', styleValue);
    this.renderer.setStyle(this.el.nativeElement, 'transition', 'box-shadow 0.3s ease');
  }
}
