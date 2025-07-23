import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'zoo-table-column',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-content></ng-content>
  `,
  styles: [`
    :host {
      display: contents;
    }
  `]
})
export class ZooTableColumnComponent {
  @Input() prop?: string;
  @Input() label = '';
} 