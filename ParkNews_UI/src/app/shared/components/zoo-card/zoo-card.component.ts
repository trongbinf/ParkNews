import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'zoo-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="zoo-card"
      [ngClass]="{
        'zoo-card-hoverable': hoverable
      }"
      (click)="onClick.emit($event)">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .zoo-card {
      background: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      border: 1px solid #f0f0f0;
      transition: all 0.3s;
    }
    
    .zoo-card-hoverable {
      cursor: pointer;
    }
    
    .zoo-card-hoverable:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transform: translateY(-2px);
    }
  `]
})
export class ZooCardComponent {
  @Input() hoverable = false;
  @Output() onClick = new EventEmitter<any>();
} 