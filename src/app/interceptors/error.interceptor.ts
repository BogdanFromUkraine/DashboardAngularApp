import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  // 🪵 1. Логуємо вихідний запит (аналог Серілога на бекенді)
  console.log(`[🚀 HTTP Request] Надіслано запит на URL: ${req.url}`);

  // 🔄 2. Пропускаємо запит далі по конвеєру за допомогою next(req)
  return next(req).pipe(
    // 🛡️ 3. Врізаємося в потік відповіді й ловимо помилки, якщо вони виникнуть
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Сталася невідома помилка мережі 😢';

      if (error.error instanceof ErrorEvent) {
        // Помилка на стороні клієнта (наприклад, зник інтернет у браузері)
        errorMessage = `Помилка клієнта: ${error.error.message}`;
      } else {
        // Помилка прилетіла від сервера (GitHub повернув нам bad status code)
        switch (error.status) {
          case 401:
            errorMessage = '🚨 Помилка авторизації! Перевірте свій токен.';
            break;
          case 403:
            errorMessage = '🚫 Доступ обмежено! Можливо, ви вичерпали ліміти запитів GitHub API.';
            break;
          case 404:
            errorMessage = '🔍 Користувача або репозиторій не знайдено на GitHub.';
            break;
          case 500:
            errorMessage = '💥 Помилка на сервері GitHub. Спробуйте пізніше.';
            break;
          default:
            errorMessage = `Помилка сервера (Код: ${error.status}): ${error.message}`;
        }
      }

      // 📺 Замість того, щоб писати логіку в кожному компоненті, виводимо алерт тут глобально!
      alert(errorMessage);

      // Прокидаємо помилку далі, якщо компоненту все ж потрібно про неї знати
      return throwError(() => error);
    })
  );
};
