import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
@Component({
  selector: 'app-labs',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './labs.component.html',
  styleUrl: './labs.component.css',
})
export class LabsComponent {
  Welcome = 'Bienvenido a mi Aplicación';
  tasks = signal([
    'Instalar Angular CLI',
    'Crear Proyecto',
    'Crear Componentes',
    'Crear Servicio',
  ]);
  name = signal('Kevin');
  age = 26;
  isDisabled = true;
  urlImg =
    'https://images-ng.pixai.art/images/orig/376126cc-05d8-4c28-9b84-695983667732';
  person = signal({
    name: 'Carlos',
    age: 18,
    avatar:
      'https://images-ng.pixai.art/images/orig/376126cc-05d8-4c28-9b84-695983667732',
  });

  colorControl = new FormControl();
  widthCtrl = new FormControl(50, {
    nonNullable: true,
  });
  nameCtrl = new FormControl('nombre', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(4)],
  });

  constructor() {
    this.colorControl.valueChanges.subscribe((value) => {
      console.log(value);
    });
  }

  clickHandler() {
    alert('Hola cara de cola');
  }

  changeHandler(event: Event) {
    const input = event.target as HTMLInputElement;
    const newValue = input.value;

    this.name.set(newValue);
  }

  keyDownHandler(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    console.log(input.value);
  }

  changeAge(event: Event) {
    const input = event.target as HTMLInputElement;
    const newValue = input.value;

    this.person.update((prevState) => {
      return { ...prevState, age: parseInt(newValue) };
    });
  }

  changeName(event: Event) {
    const input = event.target as HTMLInputElement;
    const newValue = input.value;

    this.person.update((prevState) => {
      return { ...prevState, name: newValue };
    });
  }
}
