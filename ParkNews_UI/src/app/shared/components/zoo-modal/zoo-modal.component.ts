import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'zoo-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="visible" class="zoo-modal-overlay" (click)="onOverlayClick($event)">
      <div class="zoo-modal" (click)="$event.stopPropagation()">
        <div class="zoo-modal-header">
          <h3 class="zoo-modal-title">{{ title }}</h3>
          <button class="zoo-modal-close" (click)="onClose()">&times;</button>
        </div>
        <div class="zoo-modal-body">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .zoo-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    
    .zoo-modal {
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      max-width: 500px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
    }
    
    .zoo-modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      border-bottom: 1px solid #f0f0f0;
    }
    
    .zoo-modal-title {
      margin: 0;
      font-size: 16px;
      font-weight: 500;
      color: #333;
    }
    
    .zoo-modal-close {
      background: none;
      border: none;
      font-size: 20px;
      cursor: pointer;
      color: #999;
      padding: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .zoo-modal-close:hover {
      color: #333;
    }
    
    .zoo-modal-body {
      padding: 24px;
    }
  `]
})
export class ZooModalComponent {
  @Input() visible = false;
  @Input() title = '';
  @Output() close = new EventEmitter<void>();
  @Output() visibleChange = new EventEmitter<boolean>();

  onClose() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.close.emit();
  }

  onOverlayClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
} 