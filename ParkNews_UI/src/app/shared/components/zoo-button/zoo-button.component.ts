import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'zoo-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      [class]="'zoo-button ' + (type || 'default')" 
      [type]="htmlType || 'button'"
      [disabled]="disabled || loading"
      (click)="onClick($event)">
      <span class="loading-spinner" *ngIf="loading"></span>
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    .zoo-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 8px 16px;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s;
      border: 1px solid transparent;
      outline: none;
      position: relative;
      min-width: 64px;
    }
    
    .zoo-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    .zoo-button.default {
      background-color: #f5f5f5;
      color: #333;
      border-color: #ddd;
    }
    
    .zoo-button.default:hover:not(:disabled) {
      background-color: #e8e8e8;
    }
    
    .zoo-button.primary {
      background-color: #4CAF50;
      color: white;
    }
    
    .zoo-button.primary:hover:not(:disabled) {
      background-color: #45a049;
    }
    
    .zoo-button.danger {
      background-color: #f44336;
      color: white;
    }
    
    .zoo-button.danger:hover:not(:disabled) {
      background-color: #d32f2f;
    }
    
    .zoo-button.info {
      background-color: #2196F3;
      color: white;
    }
    
    .zoo-button.info:hover:not(:disabled) {
      background-color: #0b7dda;
    }
    
    .loading-spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255,255,255,0.3);
      border-radius: 50%;
      border-top-color: #fff;
      animation: spin 1s linear infinite;
      margin-right: 8px;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class ZooButtonComponent {
  @Input() type: 'default' | 'primary' | 'danger' | 'info' = 'default';
  @Input() htmlType: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Input() loading = false;
  @Output() click = new EventEmitter<MouseEvent>();

  onClick(event: MouseEvent) {
    if (!this.disabled && !this.loading) {
      this.click.emit(event);
    }
  }
} 