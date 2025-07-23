import { Directive, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Directive()
export abstract class BaseManagerComponent<T = any> implements OnInit {
  items: T[] = [];
  editData: any = {};
  loading = false;
  saving = false;
  showModal = false;
  showDeleteModal = false;
  deleteItemId: number | string | null = null;
  
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages = 1;
  
  searchQuery = '';

  constructor(protected toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadItems();
  }

  abstract loadItems(): void;

  search(): void {
    if (!this.searchQuery.trim()) {
      this.loadItems();
      return;
    }
    this.performSearch(this.searchQuery);
  }

  protected abstract performSearch(query: string): void;

  openModal(item?: any): void {
    if (item) {
      this.editData = { ...item };
    } else {
      this.resetEditData();
    }
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.resetEditData();
  }

  saveItem(): void {
    if (!this.validateForm()) {
      return;
    }

    this.saving = true;
    if (this.editData.Id) {
      this.updateItem();
    } else {
      this.createItem();
    }
  }

  protected abstract createItem(): void;
  protected abstract updateItem(): void;

  confirmDelete(id: number | string): void {
    this.deleteItemId = id;
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.deleteItemId = null;
  }

  deleteItem(): void {
    if (!this.deleteItemId) return;
    
    this.saving = true;
    this.performDelete(this.deleteItemId);
  }

  protected abstract performDelete(id: number | string): void;

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }

  calculateTotalPages(): void {
    this.totalItems = this.items.length;
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages || 1;
    }
  }

  protected resetEditData(): void {
    this.editData = {};
  }

  protected validateForm(): boolean {
    return true;
  }
} 