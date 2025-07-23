import { Component, Input, ContentChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'zoo-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="zoo-table-container">
      <div *ngIf="loading" class="zoo-table-loading">
        <div class="zoo-spinner"></div>
        <span>Đang tải...</span>
      </div>
      
      <table *ngIf="!loading" class="zoo-table">
        <thead>
          <tr>
            <th *ngFor="let column of columns" class="zoo-table-header">
              {{ column.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let row of data; let i = index" class="zoo-table-row">
            <td *ngFor="let column of columns" class="zoo-table-cell">
              <ng-container *ngIf="column.prop; else customContent">
                {{ row[column.prop] }}
              </ng-container>
              <ng-template #customContent>
                <ng-content></ng-content>
              </ng-template>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div *ngIf="!loading && (!data || data.length === 0)" class="zoo-table-empty">
        Không có dữ liệu
      </div>
    </div>
  `,
  styles: [`
    .zoo-table-container {
      width: 100%;
      overflow-x: auto;
    }
    
    .zoo-table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    .zoo-table-header {
      background: #fafafa;
      padding: 12px 16px;
      text-align: left;
      font-weight: 500;
      color: #333;
      border-bottom: 1px solid #f0f0f0;
    }
    
    .zoo-table-row {
      border-bottom: 1px solid #f0f0f0;
    }
    
    .zoo-table-row:hover {
      background: #f5f5f5;
    }
    
    .zoo-table-cell {
      padding: 12px 16px;
      color: #333;
    }
    
    .zoo-table-loading {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px;
      color: #666;
    }
    
    .zoo-spinner {
      width: 20px;
      height: 20px;
      border: 2px solid #f3f3f3;
      border-top: 2px solid #1890ff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-right: 8px;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .zoo-table-empty {
      text-align: center;
      padding: 40px;
      color: #999;
    }
  `]
})
export class ZooTableComponent {
  @Input() data: any[] = [];
  @Input() loading = false;
  @ContentChildren('column') columns: QueryList<any> = new QueryList();
} 