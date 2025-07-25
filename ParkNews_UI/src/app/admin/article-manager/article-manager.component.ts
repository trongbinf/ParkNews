import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ArticleService } from '../../services/article.service';
import { CategoryService } from '../../services/category.service';
import { AuthorService } from '../../services/author.service';
import { ToastrService } from 'ngx-toastr';
import { QuillModule } from 'ngx-quill';
import { TagService } from '../../services/tag.service';

interface Author {
  Id: number;
  FullName: string;
  Email: string;
}

interface Category {
  Id: number;
  Name: string;
}

interface Tag {
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
  articles: any[] = [];
  filteredArticles: any[] = [];
  categories: Category[] = [];
  authors: Author[] = [];
  tags: Tag[] = [];
  loading = false;
  saving = false;
  showApprovalModal = false;
  showModal = false;
  currentArticle: any = null;
  searchText = '';
  editData: any = {
    Title: '',
    Content: '',
    Description: '',
    ImageUrl: '',
    IsPublished: true,
    IsFeatured: false,
    CategoryId: null,
    AuthorId: null,
    Tags: []
  };
  
  // Filters
  selectedCategory: number | null = null;
  selectedStatus: string | null = null;
  selectedPublishStatus: string | null = null;
  statusOptions = [
    { value: null, label: 'Tất cả trạng thái' },
    { value: 'true', label: 'Nổi bật' },
    { value: 'false', label: 'Không nổi bật' }
  ];
  publishOptions = [
    { value: null, label: 'Tất cả' },
    { value: 'true', label: 'Đã xuất bản' },
    { value: 'false', label: 'Chưa xuất bản' }
  ];
  
  // For tag input
  newTag = '';
  
  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages = 1;

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

  constructor(
    private articleService: ArticleService,
    private categoryService: CategoryService,
    private authorService: AuthorService,
    private tagService: TagService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loadArticles();
    this.loadCategories();
    this.loadAuthors();
    this.loadTags();
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
        
        this.applyFilters();
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

  loadTags() {
    this.tagService.getAll().subscribe({
      next: (response: any) => {
        if (response && response.$values) {
          this.tags = response.$values;
        } else if (Array.isArray(response)) {
          this.tags = response;
        } else {
          console.error('Unexpected API response format for tags:', response);
          this.tags = [];
        }
        console.log('Tags loaded:', this.tags);
      },
      error: (err) => {
        console.error('Error loading tags', err);
        this.toastr.error('Không thể tải danh sách thẻ', 'Lỗi');
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
          
          this.applyFilters();
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

  applyFilters() {
    let filtered = [...this.articles];
    
    // Filter by category if selected
    if (this.selectedCategory !== null) {
      filtered = filtered.filter(article => 
        article.Category?.Id === this.selectedCategory
      );
    }
    
    // Filter by featured status if selected
    if (this.selectedStatus !== null) {
      const isFeatured = this.selectedStatus === 'true';
      filtered = filtered.filter(article => article.IsFeatured === isFeatured);
    }
    
    // Filter by publish status if selected
    if (this.selectedPublishStatus !== null) {
      const isPublished = this.selectedPublishStatus === 'true';
      filtered = filtered.filter(article => article.IsPublished === isPublished);
    }
    
    this.filteredArticles = filtered;
    this.totalItems = this.filteredArticles.length;
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.currentPage = 1; // Reset to first page when filters change
    this.loading = false;
  }

  onCategoryFilterChange() {
    this.applyFilters();
  }

  onStatusFilterChange() {
    this.applyFilters();
  }
  
  onPublishStatusFilterChange() {
    this.applyFilters();
  }

  resetFilters() {
    this.selectedCategory = null;
    this.selectedStatus = null;
    this.selectedPublishStatus = null;
    this.applyFilters();
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    // Implement server-side pagination if needed
  }

  openApprovalModal(article: any) {
    this.currentArticle = article;
    this.showApprovalModal = true;
  }

  toggleArticleVisibility(article: any) {
    this.saving = true;
    const articleData = {
      Title: article.Title,
      Content: article.Content,
      Description: article.Summary || '',
      ImageUrl: article.FeaturedImageUrl || '',
      IsFeatured: !article.IsFeatured, // Toggle the featured status
      IsPublished: article.IsPublished, // Keep publish status the same
      CategoryId: article.Category?.Id,
      AuthorId: article.Author?.Id,
      Tags: article.ArticleTags?.$values?.map((at: any) => at.Tag?.Name) || []
    };

    this.articleService.update(article.Id, articleData).subscribe({
      next: () => {
        // Update the article's IsFeatured status in the local array
        article.IsFeatured = !article.IsFeatured;
        this.saving = false;
        this.showApprovalModal = false;
        const status = article.IsFeatured ? 'nổi bật' : 'không nổi bật';
        this.toastr.success(`Bài viết đã được đặt thành ${status}`, 'Thành công');
        // Re-apply filters to update the filtered list
        this.applyFilters();
      },
      error: (err) => {
        console.error('Error updating article visibility', err);
        this.toastr.error('Không thể cập nhật trạng thái bài viết', 'Lỗi');
        this.saving = false;
      }
    });
  }
  
  toggleArticlePublishStatus(article: any) {
    this.saving = true;
    const articleData = {
      Title: article.Title,
      Content: article.Content,
      Description: article.Summary || '',
      ImageUrl: article.FeaturedImageUrl || '',
      IsFeatured: article.IsFeatured, // Keep featured status the same
      IsPublished: !article.IsPublished, // Toggle the publish status
      CategoryId: article.Category?.Id,
      AuthorId: article.Author?.Id,
      Tags: article.ArticleTags?.$values?.map((at: any) => at.Tag?.Name) || []
    };

    this.articleService.update(article.Id, articleData).subscribe({
      next: () => {
        // Update the article's IsPublished status in the local array
        article.IsPublished = !article.IsPublished;
        this.saving = false;
        const status = article.IsPublished ? 'đã xuất bản' : 'chưa xuất bản';
        this.toastr.success(`Bài viết đã được đặt thành ${status}`, 'Thành công');
        // Re-apply filters to update the filtered list
        this.applyFilters();
      },
      error: (err) => {
        console.error('Error updating article publish status', err);
        this.toastr.error('Không thể cập nhật trạng thái xuất bản bài viết', 'Lỗi');
        this.saving = false;
      }
    });
  }

  saveArticleApproval() {
    if (!this.currentArticle) return;
    
    this.toggleArticleVisibility(this.currentArticle);
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

  // Methods for adding/editing articles
  openModal(article?: any) {
    if (article) {
      // Edit existing article
      this.editData = {
        Id: article.Id,
        Title: article.Title,
        Content: article.Content,
        Description: article.Summary || '',
        ImageUrl: article.FeaturedImageUrl || '',
        IsPublished: article.IsPublished,
        IsFeatured: article.IsFeatured,
        CategoryId: article.Category?.Id,
        AuthorId: article.Author?.Id,
        Tags: article.ArticleTags?.$values?.map((at: any) => at.Tag?.Name) || []
      };
    } else {
      // Create new article
      this.editData = {
        Title: '',
        Content: '',
        Description: '',
        ImageUrl: '',
        IsPublished: true,
        IsFeatured: false,
        CategoryId: null,
        AuthorId: null,
        Tags: []
      };
    }
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  addTag() {
    if (this.newTag.trim() && !this.editData.Tags.includes(this.newTag.trim())) {
      this.editData.Tags.push(this.newTag.trim());
      this.newTag = '';
    }
  }

  removeTag(tag: string) {
    this.editData.Tags = this.editData.Tags.filter((t: string) => t !== tag);
  }

  saveArticle(form: NgForm) {
    if (form.invalid) {
      this.toastr.error('Vui lòng điền đầy đủ thông tin bắt buộc', 'Lỗi');
      return;
    }

    this.saving = true;
    
    if (this.editData.Id) {
      // Update existing article
      this.articleService.update(this.editData.Id, this.editData).subscribe({
        next: () => {
          this.toastr.success('Bài viết đã được cập nhật thành công', 'Thành công');
          this.loadArticles();
          this.closeModal();
          this.saving = false;
        },
        error: (err) => {
          console.error('Error updating article', err);
          this.toastr.error('Không thể cập nhật bài viết', 'Lỗi');
          this.saving = false;
        }
      });
    } else {
      // Create new article
      this.articleService.create(this.editData).subscribe({
        next: () => {
          this.toastr.success('Bài viết đã được tạo thành công', 'Thành công');
          this.loadArticles();
          this.closeModal();
          this.saving = false;
        },
        error: (err) => {
          console.error('Error creating article', err);
          this.toastr.error('Không thể tạo bài viết', 'Lỗi');
          this.saving = false;
        }
      });
    }
  }
}
