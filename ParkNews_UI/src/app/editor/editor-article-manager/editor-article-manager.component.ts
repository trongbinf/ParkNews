import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ArticleService } from '../../services/article.service';
import { CategoryService } from '../../services/category.service';
import { AuthorService } from '../../services/author.service';
import { SourceService } from '../../services/source.service';
import { TagService } from '../../services/tag.service';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'app-editor-article-manager',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    QuillModule
  ],
  templateUrl: './editor-article-manager.component.html',
  styleUrl: './editor-article-manager.component.css'
})
export class EditorArticleManagerComponent implements OnInit {
  @ViewChild('form') form!: NgForm;
  
  articles: any[] = [];
  categories: any[] = [];
  authors: any[] = [];
  sources: any[] = [];
  tags: any[] = [];
  filteredTags: any[] = [];
  loading = false;
  saving = false;
  showModal = false;
  editData: any = {
    tags: []
  };
  searchText = '';
  newTag = '';
  currentUser: any = null;
  
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
    private sourceService: SourceService,
    private tagService: TagService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.loadArticles();
    this.loadCategories();
    this.loadAuthors();
    this.loadSources();
    this.loadTags();
  }

  loadArticles() {
    this.loading = true;
    
    // Only load articles by the current user
    this.articleService.getByAuthor(this.currentUser.id).subscribe({
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
      error: (err: any) => {
        console.error('Error loading articles', err);
        this.toastr.error('Không thể tải danh sách bài viết', 'Lỗi');
        this.loading = false;
        
        // Fallback to filtering all articles client-side if the API endpoint fails
        this.loadAllArticlesAndFilter();
      }
    });
  }

  // Fallback method if the byAuthor endpoint doesn't exist
  loadAllArticlesAndFilter() {
    this.articleService.getAll().subscribe({
      next: (articles: any[]) => {
        if (this.currentUser && this.currentUser.id) {
          this.articles = articles.filter(article => 
            article.Author && article.Author.Id === this.currentUser.id
          );
          this.totalItems = this.articles.length;
          this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        }
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error in fallback article loading', err);
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
      error: (err: any) => {
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
      error: (err: any) => {
        console.error('Error loading authors', err);
        this.toastr.error('Không thể tải danh sách tác giả', 'Lỗi');
      }
    });
  }

  loadSources() {
    this.sourceService.getAll().subscribe({
      next: (response: any) => {
        if (response && response.$values) {
          this.sources = response.$values;
        } else if (Array.isArray(response)) {
          this.sources = response;
        } else {
          console.error('Unexpected API response format for sources:', response);
          this.sources = [];
        }
        console.log('Sources loaded:', this.sources);
      },
      error: (err: any) => {
        console.error('Error loading sources', err);
        this.toastr.error('Không thể tải danh sách nguồn', 'Lỗi');
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
      error: (err: any) => {
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
          
          // Filter to only show articles by the current user
          this.articles = articlesData.filter(article => 
            article.Author && article.Author.Id === this.currentUser.id
          );
          
          this.totalItems = this.articles.length;
          this.totalPages = Math.ceil(this.totalItems / this.pageSize);
          this.loading = false;
        },
        error: (err: any) => {
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
        SourceId: article.Source?.Id,
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
        SourceId: null,
        tags: []
      };
    }
    this.showModal = true;
    
    // Reset form validation state
    if (this.form) {
      this.form.resetForm(this.editData);
    }
  }

  onTagInput() {
    if (!this.newTag) {
      this.filteredTags = [];
      return;
    }
    
    const searchTerm = this.newTag.toLowerCase();
    this.filteredTags = this.tags
      .filter(tag => tag.Name.toLowerCase().includes(searchTerm))
      .filter(tag => !this.editData.tags.includes(tag.Name))
      .slice(0, 5);
  }

  selectTag(tagName: string) {
    this.newTag = '';
    this.addTag(tagName);
    this.filteredTags = [];
  }

  addTag(tagName?: string) {
    const tagToAdd = tagName || this.newTag;
    if (tagToAdd && !this.editData.tags.includes(tagToAdd)) {
      this.editData.tags.push(tagToAdd);
      this.newTag = '';
      this.filteredTags = [];
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
    
    // Ensure tags is always an array
    const tags = this.editData.tags || [];
    
    // Always set the current user as the author
    const authorId = this.currentUser.id;
    
    if (this.editData.Id) {
      // For update
      const updateData = {
        Title: this.editData.Title.trim(),
        Content: this.editData.Content.trim(),
        Description: this.editData.Summary?.trim() || '',
        ImageUrl: this.editData.FeaturedImageUrl?.trim() || '',
        IsPublished: this.editData.IsFeatured,
        CategoryId: this.editData.CategoryId,
        AuthorId: authorId,
        SourceId: this.editData.SourceId,
        Tags: tags
      };
      
      this.articleService.update(this.editData.Id, updateData).subscribe({
        next: () => {
          this.loadArticles();
          this.showModal = false;
          this.saving = false;
          this.toastr.success('Bài viết đã được cập nhật thành công', 'Thành công');
        },
        error: (err: any) => {
          console.error('Error updating article', err);
          this.toastr.error('Không thể cập nhật bài viết', 'Lỗi');
          this.saving = false;
        }
      });
    } else {
      // For create
      const createData = {
        Title: this.editData.Title.trim(),
        Content: this.editData.Content.trim(),
        Description: this.editData.Summary?.trim() || '',
        ImageUrl: this.editData.FeaturedImageUrl?.trim() || '',
        IsPublished: this.editData.IsFeatured,
        CategoryId: this.editData.CategoryId,
        AuthorId: authorId,
        SourceId: this.editData.SourceId,
        Tags: tags
      };
      
      this.articleService.create(createData).subscribe({
        next: () => {
          this.loadArticles();
          this.showModal = false;
          this.saving = false;
          this.toastr.success('Bài viết đã được tạo thành công', 'Thành công');
        },
        error: (err: any) => {
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
        error: (err: any) => {
          console.error('Error deleting article', err);
          this.toastr.error('Không thể xóa bài viết', 'Lỗi');
          this.loading = false;
        }
      });
    }
  }

  getAuthorName(authorId: number): string {
    const author = this.authors.find(a => a.Id === authorId);
    return author ? author.FullName : 'Không có';
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find(c => c.Id === categoryId);
    return category ? category.Name : 'Không có';
  }

  getSourceName(sourceId: number): string {
    const source = this.sources.find(s => s.Id === sourceId);
    return source ? source.Name : 'Không có';
  }
} 