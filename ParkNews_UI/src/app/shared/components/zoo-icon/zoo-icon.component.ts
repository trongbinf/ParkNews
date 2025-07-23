import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'zoo-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="zoo-icon" [ngClass]="'zoo-icon-' + type">
      {{ getIconText() }}
    </span>
  `,
  styles: [`
    .zoo-icon {
      display: inline-block;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      font-weight: normal;
      line-height: 1;
    }
    
    .zoo-icon-file-text::before {
      content: "📄";
    }
    
    .zoo-icon-folder::before {
      content: "📁";
    }
    
    .zoo-icon-user::before {
      content: "👤";
    }
    
    .zoo-icon-tag::before {
      content: "🏷️";
    }
  `]
})
export class ZooIconComponent {
  @Input() type = '';

  getIconText(): string {
    const iconMap: { [key: string]: string } = {
      'file-text': '📄',
      'folder': '📁',
      'user': '👤',
      'tag': '🏷️'
    };
    return iconMap[this.type] || '📄';
  }
} 