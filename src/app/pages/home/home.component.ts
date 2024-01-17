import {
  Component,
  computed,
  signal,
  effect,
  inject,
  Injector,
} from '@angular/core';

import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { Task } from './../../models/task.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  tasks = signal<Task[]>([]);

  filter = signal<'all' | 'pending' | 'completed'>('all');
  taskByFilter = computed(() => {
    const filter = this.filter();
    const tasks = this.tasks();

    if (filter === 'pending') {
      return tasks.filter((task) => !task.completed);
    }
    if (filter === 'completed') {
      return tasks.filter((task) => task.completed);
    }
    return tasks;
  });

  newTaskCtrl = new FormControl('Tarea', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.pattern(/^\S*$/),
      Validators.minLength(3),
    ],
  });

  injector = inject(Injector);

  ngOnInit() {
    const storage = localStorage.getItem('tasks');
    if (storage) {
      const tasks = JSON.parse(storage);
      this.tasks.set(tasks);
    }

    this.trackTasks();
  }

  trackTasks() {
    effect(
      () => {
        const tasks = this.tasks();
        localStorage.setItem('tasks', JSON.stringify(tasks));
      },
      { injector: this.injector }
    );
  }

  addNewTaskHandler() {
    if (this.newTaskCtrl.valid) {
      const value = this.newTaskCtrl.value.trim();
      if (value !== '') {
        this.addNewTask(value);
        this.newTaskCtrl.setValue('');
      }
    }
  }

  addNewTask(title: string) {
    const newTask = {
      id: Date.now(),
      title,
      completed: false,
    };

    this.tasks.update((tasks) => [...tasks, newTask]);
  }

  deleteTask(index: number) {
    this.tasks.update((tasks) =>
      tasks.filter((task, position) => position !== index)
    );
  }

  completeTask(index: number) {
    this.tasks.update((tasks) => {
      return tasks.map((task, position) => {
        if (position === index) {
          return {
            ...task,
            completed: !task.completed,
          };
        }
        return task;
      });
    });
  }

  updateTaskEditingMode(index: number) {
    this.tasks.update((prevSate) => {
      return prevSate.map((task, position) => {
        if (position === index) {
          return { ...task, editing: true };
        }
        return {
          ...task,
          editing: false,
        };
      });
    });
  }

  updateTaskText(index: number, event: Event) {
    const input = event.target as HTMLInputElement;

    this.tasks.update((prevSate) => {
      return prevSate.map((task, position) => {
        if (position === index) {
          return { ...task, title: input.value, editing: false };
        }
        return task;
      });
    });
  }

  changeFilter(filter: 'all' | 'pending' | 'completed') {
    this.filter.set(filter);
  }
}
