import { Component, Input, Output, EventEmitter, ContentChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'zoo-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <form 
      #form="ngForm"
      (ngSubmit)="onSubmit.emit(form)"
      class="zoo-form"
      [ngClass]="{
        'zoo-form-horizontal': layout === 'horizontal',
        'zoo-form-vertical': layout === 'vertical'
      }">
      <ng-content></ng-content>
    </form>
  `,
  styles: [`
    .zoo-form {
      width: 100%;
    }
    
    .zoo-form-horizontal {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 16px;
    }
    
    .zoo-form-vertical {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .zoo-form-vertical > * {
      width: 100%;
    }
  `],
  exportAs: 'ngForm'
})
export class ZooFormComponent {
  @Input() layout: 'horizontal' | 'vertical' = 'vertical';
  @Output() onSubmit = new EventEmitter<any>();
} 