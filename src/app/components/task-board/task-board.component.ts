import { Component, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // 👈 Потрібен для роботи з формами (двостороннє зв'язування)
import {Task} from '../../models/task.model';
import {HighlightStatusDirective} from '../../directives/highlight-status.directive';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-task-board',
  standalone: true,
  imports: [CommonModule, FormsModule, HighlightStatusDirective, DragDropModule], // 👈 Обов'язково імпортуємо FormsModule
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

  // Метод, який спрацьовує, коли користувач відпускає перетягнуту таску
  drop(event: CdkDragDrop<Task[]>): void {
    // Якщо картку кинули в ту саму колонку, де вона й була
    if (event.previousContainer === event.container) {
      // Angular CDK має вбудовану утиліту для зміни індексів в масиві
      // Але оскільки у нас СИГНАЛ, нам треба оновити його через .update()
      this.tasks.update(oldTasks => {
        const updated = [...oldTasks];
        // Ця функція з CDK міняє елементи місцями всередині масиву
        moveItemInArray(updated, event.previousIndex, event.currentIndex);
        return updated;
      });
    } else {
      // Якщо картку перетягнули в ІНШУ колонку
      const draggedTask = event.item.data as Task;
      // Визначаємо, в яку колонку (з яким статусом) її кинули
      const targetStatus = event.container.id as 'todo' | 'in-progress' | 'done';

      // Оновлюємо статус таски в нашому сигналі
      this.tasks.update(oldTasks =>
        oldTasks.map(t => t.id === draggedTask.id ? { ...t, status: targetStatus } : t)
      );
    }
  }
}
