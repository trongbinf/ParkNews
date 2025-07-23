import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'zoo-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="zoo-input-wrapper">
      <label *ngIf="label" class="zoo-input-label">{{ label }}</label>
      <input
        *ngIf="type !== 'textarea'"
        [type]="type || 'text'"
        [placeholder]="placeholder || ''"
        [required]="required"
        [disabled]="disabled"
        [value]="value"
        (input)="onInput($event)"
        (blur)="onBlur()"
        (focus)="onFocus()"
        class="zoo-input"
        [ngClass]="{
          'zoo-input-error': hasError,
          'zoo-input-disabled': disabled
        }"
      />
      <textarea
        *ngIf="type === 'textarea'"
        [placeholder]="placeholder || ''"
        [required]="required"
        [disabled]="disabled"
        [value]="value"
        (input)="onInput($event)"
        (blur)="onBlur()"
        (focus)="onFocus()"
        class="zoo-input zoo-textarea"
        [ngClass]="{
          'zoo-input-error': hasError,
          'zoo-input-disabled': disabled
        }"
        rows="4"
      ></textarea>
      <div *ngIf="hasError && errorMessage" class="zoo-input-error-message">
        {{ errorMessage }}
      </div>
    </div>
  `,
  styles: [`
    .zoo-input-wrapper {
      margin-bottom: 16px;
    }
    
    .zoo-input-label {
      display: block;
      margin-bottom: 4px;
      font-weight: 500;
      color: #333;
    }
    
    .zoo-input {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #d9d9d9;
      border-radius: 6px;
      font-size: 14px;
      transition: all 0.3s;
      box-sizing: border-box;
    }
    
    .zoo-textarea {
      resize: vertical;
      min-height: 80px;
      font-family: inherit;
    }
    
    .zoo-input:focus {
      outline: none;
      border-color: #40a9ff;
      box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
    }
    
    .zoo-input-error {
      border-color: #ff4d4f;
    }
    
    .zoo-input-error:focus {
      border-color: #ff4d4f;
      box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.2);
    }
    
    .zoo-input-disabled {
      background-color: #f5f5f5;
      cursor: not-allowed;
    }
    
    .zoo-input-error-message {
      color: #ff4d4f;
      font-size: 12px;
      margin-top: 4px;
    }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ZooInputComponent),
      multi: true
    }
  ]
})
export class ZooInputComponent implements ControlValueAccessor {
  @Input() label?: string;
  @Input() placeholder?: string;
  @Input() type: 'text' | 'email' | 'password' | 'number' | 'textarea' = 'text';
  @Input() required = false;
  @Input() disabled = false;
  @Input() hasError = false;
  @Input() errorMessage?: string;

  value: string = '';
  private onChange = (value: string) => {};
  private onTouched = () => {};

  onInput(event: any) {
    this.value = event.target.value;
    this.onChange(this.value);
  }

  onBlur() {
    this.onTouched();
  }

  onFocus() {
    // Handle focus if needed
  }

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
} 