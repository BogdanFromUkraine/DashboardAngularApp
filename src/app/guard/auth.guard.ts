import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router); // Впроваджуємо роутер, щоб мати змогу перенаправляти користувача

  // 1. Перевіряємо, чи є в LocalStorage збережений нікнейм розробника
  const username = localStorage.getItem('github_username');

  if (username && username.trim() !== '') {
    // 2. Якщо нікнейм є — вишибала каже "Проходь!", повертаючи true
    return true;
  } else {
    // 3. Якщо порожньо — блокуємо вхід, показуємо попередження і редиректимо на налаштування
    alert('Помилка доступу! Спочатку введіть свій GitHub нікнейм у налаштуваннях.');
    router.navigate(['/settings']);
    return false;
  }
};
