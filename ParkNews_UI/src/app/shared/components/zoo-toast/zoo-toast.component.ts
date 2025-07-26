import { Component, Injectable, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';

export interface ToastConfig {
  message: string;
  title?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

export interface ConfirmDialogConfig {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class ZooToastService {
  private toastSubject = new Subject<ToastConfig>();
  private confirmSubject = new Subject<ConfirmDialogConfig>();
  
  public toast$ = this.toastSubject.asObservable();
  public confirm$ = this.confirmSubject.asObservable();

  success(message: string, title: string = 'Thành công', duration: number = 3000) {
    this.show({ message, title, type: 'success', duration });
  }

  error(message: string, title: string = 'Lỗi', duration: number = 3000) {
    this.show({ message, title, type: 'error', duration });
  }

  warning(message: string, title: string = 'Cảnh báo', duration: number = 3000) {
    this.show({ message, title, type: 'warning', duration });
  }

  info(message: string, title: string = 'Thông tin', duration: number = 3000) {
    this.show({ message, title, type: 'info', duration });
  }

  confirm(config: ConfirmDialogConfig) {
    this.confirmSubject.next({
      title: config.title,
      message: config.message,
      confirmText: config.confirmText || 'OK',
      cancelText: config.cancelText || 'Hủy',
      onConfirm: config.onConfirm,
      onCancel: config.onCancel || (() => {})
    });
  }

  private show(config: ToastConfig) {
    this.toastSubject.next(config);
  }
}

@Component({
  selector: 'zoo-toast',
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(100%)' }),
        animate('300ms ease-in', style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0, transform: 'translateX(100%)' }))
      ])
    ])
  ],
  template: `
    <div class="zoo-toast-container">
      <div 
        *ngFor="let toast of toasts" 
        class="zoo-toast" 
        [ngClass]="toast.type"
        [@fadeInOut]
      >
        <div class="zoo-toast-header">
          <strong class="zoo-toast-title">{{ toast.title }}</strong>
          <button class="zoo-toast-close" (click)="removeToast(toast)">×</button>
        </div>
        <div class="zoo-toast-body">
          {{ toast.message }}
        </div>
      </div>
    </div>

    <!-- Confirm Dialog -->
    <div class="zoo-confirm-overlay" *ngIf="showConfirm">
      <div class="zoo-confirm-dialog" [@fadeInOut]>
        <div class="zoo-confirm-header">
          <h4>{{ confirmConfig.title }}</h4>
          <button class="zoo-confirm-close" (click)="cancelConfirm()">×</button>
        </div>
        <div class="zoo-confirm-body">
          <p [innerHTML]="confirmConfig.message"></p>
        </div>
        <div class="zoo-confirm-footer">
          <button class="zoo-btn zoo-btn-secondary" (click)="cancelConfirm()">
            {{ confirmConfig.cancelText }}
          </button>
          <button class="zoo-btn zoo-btn-primary" (click)="confirmDialog()">
            {{ confirmConfig.confirmText }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .zoo-toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      max-width: 350px;
    }
    
    .zoo-toast {
      background-color: white;
      border-radius: 4px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      margin-bottom: 10px;
      overflow: hidden;
      pointer-events: auto;
      position: relative;
      transition: all 0.3s;
    }
    
    .zoo-toast-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 15px;
      border-bottom: 1px solid #eee;
    }
    
    .zoo-toast-title {
      font-weight: 600;
    }
    
    .zoo-toast-close {
      background: transparent;
      border: none;
      font-size: 20px;
      cursor: pointer;
      color: #999;
    }
    
    .zoo-toast-body {
      padding: 10px 15px;
    }
    
    .zoo-toast.success {
      border-left: 4px solid #4CAF50;
    }
    
    .zoo-toast.success .zoo-toast-title {
      color: #4CAF50;
    }
    
    .zoo-toast.error {
      border-left: 4px solid #f44336;
    }
    
    .zoo-toast.error .zoo-toast-title {
      color: #f44336;
    }
    
    .zoo-toast.warning {
      border-left: 4px solid #ff9800;
    }
    
    .zoo-toast.warning .zoo-toast-title {
      color: #ff9800;
    }
    
    .zoo-toast.info {
      border-left: 4px solid #2196F3;
    }
    
    .zoo-toast.info .zoo-toast-title {
      color: #2196F3;
    }

    /* Confirm Dialog Styles */
    .zoo-confirm-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
    }

    .zoo-confirm-dialog {
      background-color: white;
      border-radius: 4px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
      width: 90%;
      max-width: 500px;
      overflow: hidden;
    }

    .zoo-confirm-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 20px;
      border-bottom: 1px solid #eee;
    }

    .zoo-confirm-header h4 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
    }

    .zoo-confirm-close {
      background: transparent;
      border: none;
      font-size: 22px;
      cursor: pointer;
      color: #999;
    }

    .zoo-confirm-body {
      padding: 20px;
      white-space: pre-line;
    }

    .zoo-confirm-footer {
      padding: 15px 20px;
      border-top: 1px solid #eee;
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }

    .zoo-btn {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: background-color 0.2s;
    }

    .zoo-btn-primary {
      background-color: #2196F3;
      color: white;
    }

    .zoo-btn-primary:hover {
      background-color: #0d8aee;
    }

    .zoo-btn-secondary {
      background-color: #f5f5f5;
      color: #333;
    }

    .zoo-btn-secondary:hover {
      background-color: #e0e0e0;
    }
  `]
})
export class ZooToastComponent {
  toasts: (ToastConfig & { id: number })[] = [];
  showConfirm = false;
  confirmConfig: ConfirmDialogConfig = {
    title: '',
    message: '',
    confirmText: 'OK',
    cancelText: 'Hủy',
    onConfirm: () => {},
    onCancel: () => {}
  };
  
  private counter = 0;

  constructor(private toastService: ZooToastService) {
    this.toastService.toast$.subscribe(toast => {
      this.addToast(toast);
    });
    
    this.toastService.confirm$.subscribe(config => {
      this.showConfirmDialog(config);
    });
  }

  private addToast(toast: ToastConfig) {
    const id = this.counter++;
    this.toasts.push({ ...toast, id });

    // Auto remove after duration
    setTimeout(() => {
      this.removeToastById(id);
    }, toast.duration || 3000);
  }

  removeToast(toast: any) {
    this.removeToastById(toast.id);
  }

  private removeToastById(id: number) {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }
  
  private showConfirmDialog(config: ConfirmDialogConfig) {
    this.confirmConfig = config;
    this.showConfirm = true;
  }
  
  confirmDialog() {
    this.confirmConfig.onConfirm();
    this.showConfirm = false;
  }
  
  cancelConfirm() {
    if (this.confirmConfig.onCancel) {
      this.confirmConfig.onCancel();
    }
    this.showConfirm = false;
  }
} 