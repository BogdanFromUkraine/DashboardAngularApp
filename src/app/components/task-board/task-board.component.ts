import { Component, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // 👈 Потрібен для роботи з формами (двостороннє зв'язування)
import {Task} from '../../models/task.model';


@Component({
  selector: 'app-task-board',
  standalone: true,
  imports: [CommonModule, FormsModule], // 👈 Обов'язково імпортуємо FormsModule
  templateUrl: './task-board.component.html',
  styleUrl: './task-board.component.css'
})
export class TaskBoardComponent implements OnInit {

  // 2. Головний сигнал-масив, який зберігає всі наші таски
  tasks = signal<Task[]>([]);

  // Поля форми для створення нової таски (зв'яжемо їх з HTML через [(ngModel)])
  newTitle = '';
  newDescription = '';

  constructor() {
    // 3. Магія автоматичного збереження (Effect)
    // Ефект автоматично спрацьовує ТОДІ, коли змінюються дані всередині сигналу this.tasks()
    effect(() => {
      localStorage.setItem('dev_dashboard_tasks', JSON.stringify(this.tasks()));
    });
  }

  ngOnInit(): void {
    // 4. При завантаженні дістаємо збережені таски з LocalStorage (браузерна міні-БД)
    const saved = localStorage.getItem('dev_dashboard_tasks');
    if (saved) {
      this.tasks.set(JSON.parse(saved));
    }
  }

  // 5. Метод для додавання нового завдання
  addTask(): void {
    if (!this.newTitle.trim()) return; // Перевірка на порожній заголовок

    const newTask: Task = {
      id: Date.now().toString(), // Проста генерація унікального ID через мілісекунди
      title: this.newTitle,
      description: this.newDescription,
      status: 'todo' // Усі нові таски автоматично потрапляють у "To Do"
    };

    // Оновлюємо сигнал-масив. Іммутабельність: створюємо новий масив [...старий, нова_таска]
    this.tasks.update(oldTasks => [...oldTasks, newTask]);

    // Очищаємо поля форми
    this.newTitle = '';
    this.newDescription = '';
  }

  // 6. Метод для зміни статусу (рух таски по колонках вперед)
  updateStatus(taskId: string, nextStatus: 'todo' | 'in-progress' | 'done'): void {
    this.tasks.update(oldTasks =>
      oldTasks.map(t => t.id === taskId ? { ...t, status: nextStatus } : t)
    );
  }

  // 7. Метод для видалення завдання
  deleteTask(taskId: string): void {
    this.tasks.update(oldTasks => oldTasks.filter(t => t.id !== taskId));
  }
}
