import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ArticleService } from '../../services/article.service';
import { CategoryService } from '../../services/category.service';
import { AuthorService } from '../../services/author.service';
import { ToastrService } from 'ngx-toastr';
import { QuillModule } from 'ngx-quill';

interface Author {
  Id: number;
  FullName: string;
  Email: string;
}

interface Category {
  Id: number;
  Name: string;
}

@Component({
  selector: 'app-article-manager',
  templateUrl: './article-manager.component.html',
  styleUrl: './article-manager.component.css',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    QuillModule
  ]
})
export class ArticleManagerComponent implements OnInit {
  @ViewChild('form') form!: NgForm;
  
  articles: any[] = [];
  categories: Category[] = [];
  authors: Author[] = [];
  loading = false;
  saving = false;
  showModal = false;
  editData: any = {
    tags: []
  };
  searchText = '';
  newTag = '';
  
  // Quill editor configuration
  quillConfig = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['clean'],
      ['link', 'image', 'video']
    ]
  };
  
  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages = 1;

  constructor(
    private articleService: ArticleService,
    private categoryService: CategoryService,
    private authorService: AuthorService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loadArticles();
    this.loadCategories();
    this.loadAuthors();
  }

  loadArticles() {
    this.loading = true;
    this.articleService.getAll().subscribe({
      next: (response: any) => {
        console.log('Original API response:', response);
        
        // Process the response to ensure it's an array
        let articlesData: any[] = [];
        
        if (response && response.$values) {
          // OData format
          articlesData = response.$values;
        } else if (Array.isArray(response)) {
          // Direct array format
          articlesData = response;
        } else {
          console.error('Unexpected API response format:', response);
          articlesData = [];
        }
        
        // Transform the data to match the template expectations
        this.articles = articlesData;
        console.log('Processed articles:', this.articles);
        
        this.totalItems = this.articles.length;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading articles', err);
        this.toastr.error('Không thể tải danh sách bài viết', 'Lỗi');
        this.loading = false;
      }
    });
  }

  loadCategories() {
    this.categoryService.getAll().subscribe({
      next: (response: any) => {
        if (response && response.$values) {
          this.categories = response.$values;
        } else if (Array.isArray(response)) {
          this.categories = response;
        } else {
          console.error('Unexpected API response format for categories:', response);
          this.categories = [];
        }
        console.log('Categories loaded:', this.categories);
      },
      error: (err) => {
        console.error('Error loading categories', err);
        this.toastr.error('Không thể tải danh sách danh mục', 'Lỗi');
      }
    });
  }

  loadAuthors() {
    this.authorService.getAll().subscribe({
      next: (response: any) => {
        if (response && response.$values) {
          this.authors = response.$values;
        } else if (Array.isArray(response)) {
          this.authors = response;
        } else {
          console.error('Unexpected API response format for authors:', response);
          this.authors = [];
        }
        console.log('Authors loaded:', this.authors);
      },
      error: (err) => {
        console.error('Error loading authors', err);
        this.toastr.error('Không thể tải danh sách tác giả', 'Lỗi');
      }
    });
  }

  search() {
    if (this.searchText) {
      this.loading = true;
      this.articleService.search(this.searchText).subscribe({
        next: (response: any) => {
          // Process the response to ensure it's an array
          let articlesData: any[] = [];
          
          if (response && response.$values) {
            // OData format
            articlesData = response.$values;
          } else if (Array.isArray(response)) {
            // Direct array format
            articlesData = response;
          } else {
            console.error('Unexpected API response format:', response);
            articlesData = [];
          }
          
          // Transform the data to match the template expectations
          this.articles = articlesData;
          
          this.totalItems = this.articles.length;
          this.totalPages = Math.ceil(this.totalItems / this.pageSize);
          this.loading = false;
        },
        error: (err) => {
          console.error('Error searching articles', err);
          this.toastr.error('Không thể tìm kiếm bài viết', 'Lỗi');
          this.loading = false;
        }
      });
    } else {
      this.loadArticles();
    }
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    // Implement server-side pagination if needed
  }

  openModal(article?: any) {
    if (article) {
      console.log('Opening modal with article:', article);
      this.editData = { 
        Id: article.Id,
        Title: article.Title,
        Content: article.Content,
        Summary: article.Summary,
        FeaturedImageUrl: article.FeaturedImageUrl,
        IsFeatured: article.IsFeatured,
        CategoryId: article.Category?.Id,
        AuthorId: article.Author?.Id,
        tags: article.ArticleTags?.$values?.map((at: any) => at.Tag?.Name) || [] 
      };
    } else {
      this.editData = { 
        Title: '',
        Content: '',
        Summary: '',
        FeaturedImageUrl: '',
        IsFeatured: false,
        CategoryId: null,
        AuthorId: null,
        tags: []
      };
    }
    this.showModal = true;
    
    // Reset form validation state
    if (this.form) {
      this.form.resetForm(this.editData);
    }
  }

  addTag() {
    if (this.newTag && !this.editData.tags.includes(this.newTag)) {
      this.editData.tags.push(this.newTag);
      this.newTag = '';
    }
  }

  removeTag(index: number) {
    this.editData.tags.splice(index, 1);
  }

  validateForm(): boolean {
    if (!this.editData.Title?.trim()) {
      this.toastr.warning('Vui lòng nhập tiêu đề bài viết', 'Thiếu thông tin');
      return false;
    }

    if (!this.editData.CategoryId) {
      this.toastr.warning('Vui lòng chọn danh mục', 'Thiếu thông tin');
      return false;
    }

    if (!this.editData.Content?.trim()) {
      this.toastr.warning('Vui lòng nhập nội dung bài viết', 'Thiếu thông tin');
      return false;
    }

    return true;
  }

  saveArticle(form: NgForm) {
    if (!form.valid || !this.validateForm()) {
      return;
    }
    
    this.saving = true;
    const articleData = {
      Title: this.editData.Title.trim(),
      Content: this.editData.Content.trim(),
      Description: this.editData.Summary?.trim(),
      ImageUrl: this.editData.FeaturedImageUrl?.trim(),
      IsPublished: this.editData.IsFeatured,
      CategoryId: this.editData.CategoryId,
      AuthorId: this.editData.AuthorId,
      Tags: this.editData.tags
    };

    if (this.editData.Id) {
      this.articleService.update(this.editData.Id, articleData).subscribe({
        next: () => {
          this.loadArticles();
          this.showModal = false;
          this.saving = false;
          this.toastr.success('Bài viết đã được cập nhật thành công', 'Thành công');
        },
        error: (err) => {
          console.error('Error updating article', err);
          this.toastr.error('Không thể cập nhật bài viết', 'Lỗi');
          this.saving = false;
        }
      });
    } else {
      this.articleService.create(articleData).subscribe({
        next: () => {
          this.loadArticles();
          this.showModal = false;
          this.saving = false;
          this.toastr.success('Bài viết đã được tạo thành công', 'Thành công');
        },
        error: (err) => {
          console.error('Error creating article', err);
          this.toastr.error('Không thể tạo bài viết mới', 'Lỗi');
          this.saving = false;
        }
      });
    }
  }

  deleteArticle(id: number) {
    if (confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      this.loading = true;
      this.articleService.delete(id).subscribe({
        next: () => {
          this.loadArticles();
          this.toastr.success('Bài viết đã được xóa thành công', 'Thành công');
        },
        error: (err) => {
          console.error('Error deleting article', err);
          this.toastr.error('Không thể xóa bài viết', 'Lỗi');
          this.loading = false;
        }
      });
    }
  }
}
