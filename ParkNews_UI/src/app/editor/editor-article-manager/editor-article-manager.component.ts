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
import { ZooToastService } from '../../shared/components/zoo-toast/zoo-toast.component';

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
  filteredArticles: any[] = [];
  loading = false;
  saving = false;
  showModal = false;
  showVisibilityModal = false;
  currentArticle: any = null;
  editData: any = {
    tags: []
  };
  searchText = '';
  newTag = '';
  currentUser: any = null;
  hasVisibilityPermission = false;
  showTagSuggestions = false;
  
  // Filters
  selectedCategory: number | null = null;
  selectedStatus: string | null = null;
  statusOptions = [
    { value: null, label: 'Tất cả trạng thái' },
    { value: 'true', label: 'Đã xuất bản' },
    { value: 'false', label: 'Chưa xuất bản' }
  ];
  
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
    public authService: AuthService,
    private toastr: ToastrService,
    private zooToast: ZooToastService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    console.log('Current user in editor article manager:', this.currentUser);
    
    // Kiểm tra quyền chuyển trạng thái bài viết
    this.hasVisibilityPermission = this.authService.hasRole('Editor') || this.authService.hasRole('Admin');
    this.loadArticles();
    this.loadCategories();
    this.loadAuthors();
    this.loadSources();
    this.loadTags();
  }

  loadArticles() {
    this.loading = true;
    
    // Lấy ID người dùng hiện tại
    const userId = this.currentUser.id;
    console.log('Loading articles for editor with userId:', userId);
    
    // Sử dụng API mới để lấy bài viết theo người dùng có vai trò editor
    this.articleService.getByEditor(userId).subscribe({
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
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading articles', err);
        this.zooToast.error('Không thể tải danh sách bài viết');
        this.loading = false;
      }
    });
  }

  // Đã không cần phương thức này nữa vì chúng ta đã có API chuyên biệt
  // loadAllArticlesAndFilter() {
  //   this.articleService.getAll().subscribe({
  //     next: (articles: any[]) => {
  //       if (this.currentUser && this.currentUser.id) {
  //         this.articles = articles.filter(article => 
  //           article.Author && article.Author.Id === this.currentUser.id
  //         );
  //         this.applyFilters();
  //       }
  //       this.loading = false;
  //     },
  //     error: (err: any) => {
  //       console.error('Error in fallback article loading', err);
  //       this.loading = false;
  //     }
  //   });
  // }

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
          
          // Chỉ lọc những bài viết được tạo bởi editor hiện tại
          // Không cần lọc theo Author.Id nữa vì API đã lọc sẵn
          this.articles = articlesData;
          
          this.applyFilters();
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

  applyFilters() {
    let filtered = [...this.articles];
    console.log('Applying filters to articles:', filtered);
    
    // Filter by category if selected
    if (this.selectedCategory !== null) {
      filtered = filtered.filter(article => 
        article.Category?.Id === this.selectedCategory
      );
      console.log('After category filter:', filtered);
    }
    
    // Filter by publish status if selected
    if (this.selectedStatus !== null) {
      const isPublished = this.selectedStatus === 'true';
      filtered = filtered.filter(article => article.IsPublished === isPublished);
      console.log('After status filter:', filtered);
    }
    
    this.filteredArticles = filtered;
    this.totalItems = this.filteredArticles.length;
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.currentPage = 1; // Reset to first page when filters change
    
    console.log('Final filtered articles:', this.filteredArticles);
  }

  onCategoryFilterChange() {
    this.applyFilters();
  }

  onStatusFilterChange() {
    this.applyFilters();
  }

  resetFilters() {
    this.selectedCategory = null;
    this.selectedStatus = null;
    this.applyFilters();
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    // Implement server-side pagination if needed
  }

  openModal(article?: any) {
    if (article) {
      // Không cần kiểm tra qua email của Author nữa
      // Kiểm tra nếu người tạo bài viết không phải là người dùng hiện tại và không phải admin
      if (!this.authService.isAdmin() && article.CreatedByUserId !== this.currentUser.id) {
        this.zooToast.warning('Bạn không có quyền chỉnh sửa bài viết này', 'Không được phép');
        return;
      }
      
      console.log('Opening modal with article:', article);
      this.editData = { 
        Id: article.Id,
        Title: article.Title,
        Content: article.Content,
        Summary: article.Summary,
        FeaturedImageUrl: article.FeaturedImageUrl,
        IsPublished: article.IsPublished,
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
        IsPublished: false,
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

  closeModal() {
    this.showModal = false;
  }

  // Mở modal xác nhận thay đổi trạng thái bài viết
  openVisibilityModal(article: any) {
    // Kiểm tra quyền chuyển trạng thái bài viết
    if (!this.hasVisibilityPermission) {
      this.zooToast.warning('Bạn không có quyền thay đổi trạng thái bài viết', 'Không được phép');
      return;
    }
    
    // Kiểm tra nếu người tạo bài viết không phải là người dùng hiện tại và không phải admin
    if (!this.authService.isAdmin() && article.CreatedByUserId !== this.currentUser.id) {
      this.zooToast.warning('Bạn không có quyền thay đổi trạng thái bài viết này', 'Không được phép');
      return;
    }
    
    this.currentArticle = article;
    this.showVisibilityModal = true;
  }

  // Thay đổi trạng thái xuất bản của bài viết
  toggleArticleVisibility() {
    if (!this.currentArticle) return;
    
    this.saving = true;
    const articleData = {
      Title: this.currentArticle.Title,
      Content: this.currentArticle.Content,
      Description: this.currentArticle.Summary || '',
      ImageUrl: this.currentArticle.FeaturedImageUrl || '',
      IsPublished: !this.currentArticle.IsPublished, // Toggle the publish status
      IsFeatured: this.currentArticle.IsFeatured || false, // Keep featured status the same
      CategoryId: this.currentArticle.Category?.Id,
      AuthorId: this.currentArticle.Author?.Id, // Sử dụng AuthorId của bài viết hiện tại
      SourceId: this.currentArticle.Source?.Id || null,
      Tags: this.currentArticle.ArticleTags?.$values?.map((at: any) => at.Tag?.Name) || []
    };

    console.log('Toggling visibility with data:', articleData);

    this.articleService.update(this.currentArticle.Id, articleData).subscribe({
      next: (updatedArticle) => {
        // Update the article's IsPublished status in the local array
        const articleIndex = this.articles.findIndex(a => a.Id === this.currentArticle.Id);
        if (articleIndex !== -1) {
          this.articles[articleIndex].IsPublished = !this.articles[articleIndex].IsPublished;
          this.currentArticle.IsPublished = !this.currentArticle.IsPublished;
        }
        
        this.saving = false;
        this.showVisibilityModal = false;
        const status = this.currentArticle.IsPublished ? 'đã xuất bản' : 'chưa xuất bản';
        this.zooToast.success(`Bài viết đã được đặt thành ${status}`, 'Thành công');
        // Re-apply filters to update the filtered list
        this.applyFilters();
      },
      error: (err: any) => {
        console.error('Error updating article visibility', err);
        this.zooToast.error(err.error?.title || 'Không thể cập nhật trạng thái bài viết', 'Lỗi');
        this.saving = false;
      }
    });
  }

  filterTags() {
    if (!this.newTag.trim()) {
      this.filteredTags = [];
      this.showTagSuggestions = false;
      return;
    }
    
    const searchTerm = this.newTag.toLowerCase().trim();
    this.filteredTags = this.tags
      .filter(tag => tag.Name.toLowerCase().includes(searchTerm))
      .filter(tag => !this.editData.tags.includes(tag.Name));
    
    this.showTagSuggestions = this.filteredTags.length > 0;
  }

  selectTag(tagName: string) {
    this.newTag = '';
    this.addTag(tagName);
    this.filteredTags = [];
    this.showTagSuggestions = false;
  }

  addTag(tagName?: string) {
    const tagToAdd = tagName || this.newTag.trim();
    if (tagToAdd && !this.editData.tags.includes(tagToAdd)) {
      this.editData.tags.push(tagToAdd);
      this.newTag = '';
      this.filteredTags = [];
      this.showTagSuggestions = false;
    }
  }

  removeTag(index: number) {
    this.editData.tags.splice(index, 1);
  }

  hideTagSuggestions() {
    setTimeout(() => {
      this.showTagSuggestions = false;
    }, 200);
  }

  validateForm(): boolean {
    if (!this.editData.Title?.trim()) {
      this.zooToast.warning('Vui lòng nhập tiêu đề bài viết', 'Thiếu thông tin');
      return false;
    }

    if (!this.editData.CategoryId) {
      this.zooToast.warning('Vui lòng chọn danh mục', 'Thiếu thông tin');
      return false;
    }

    if (!this.editData.Content?.trim()) {
      this.zooToast.warning('Vui lòng nhập nội dung bài viết', 'Thiếu thông tin');
      return false;
    }

    return true;
  }

  saveArticle(form: NgForm) {
    if (!this.validateForm()) {
      return;
    }

    this.saving = true;
    
    // Ensure tags is always an array
    const tags = this.editData.tags || [];
    
    // Sử dụng AuthorId từ form thay vì tự động lấy từ API
    if (this.editData.Id) {
      // For update
      const updateData = {
        Title: this.editData.Title.trim(),
        Content: this.editData.Content.trim(),
        Description: this.editData.Summary?.trim() || '',
        ImageUrl: this.editData.FeaturedImageUrl?.trim() || '',
        IsPublished: this.editData.IsPublished,
        IsFeatured: false, // Editor không thể đặt bài viết làm nổi bật
        CategoryId: this.editData.CategoryId,
        AuthorId: this.editData.AuthorId,
        SourceId: this.editData.SourceId || null,
        Tags: tags
      };
      
      console.log('Sending update data:', updateData);
      
      this.articleService.update(this.editData.Id, updateData).subscribe({
        next: () => {
          this.loadArticles();
          this.showModal = false;
          this.saving = false;
          this.zooToast.success('Bài viết đã được cập nhật thành công', 'Thành công');
        },
        error: (err: any) => {
          console.error('Error updating article', err);
          this.zooToast.error(err.error?.title || 'Không thể cập nhật bài viết', 'Lỗi');
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
        IsPublished: this.editData.IsPublished,
        IsFeatured: false, // Editor không thể đặt bài viết làm nổi bật
        CategoryId: this.editData.CategoryId,
        AuthorId: this.editData.AuthorId,
        SourceId: this.editData.SourceId || null,
        Tags: tags
      };
      
      console.log('Sending create data:', createData);
      
      this.articleService.create(createData).subscribe({
        next: () => {
          this.loadArticles();
          this.showModal = false;
          this.saving = false;
          this.zooToast.success('Bài viết đã được tạo thành công', 'Thành công');
        },
        error: (err: any) => {
          console.error('Error creating article', err);
          this.zooToast.error(err.error?.title || 'Không thể tạo bài viết mới', 'Lỗi');
          this.saving = false;
        }
      });
    }
  }

  // Không cho phép xóa bài viết nếu là editor
  deleteArticle(id: number) {
    // Lấy bài viết cần xóa
    const article = this.articles.find(a => a.Id === id);
    if (!article) {
      this.zooToast.error('Không tìm thấy bài viết');
      return;
    }
    
    // Kiểm tra quyền: Chỉ admin hoặc người tạo bài viết mới có quyền xóa
    if (!this.authService.isAdmin() && article.CreatedByUserId !== this.currentUser.id) {
      this.zooToast.warning('Bạn không có quyền xóa bài viết này', 'Không được phép');
      return;
    }
    
    // Sử dụng hộp thoại xác nhận tùy chỉnh thay vì confirm mặc định
    this.zooToast.confirm({
      title: 'Xác nhận xóa bài viết',
      message: `Bạn có chắc chắn muốn xóa bài viết "<strong>${article.Title}</strong>"?<br><br>Hành động này không thể hoàn tác và bài viết sẽ bị xóa vĩnh viễn.`,
      confirmText: 'Xóa',
      cancelText: 'Hủy',
      onConfirm: () => {
        this.loading = true;
        this.articleService.delete(id).subscribe({
          next: () => {
            this.loadArticles();
            this.zooToast.success('Bài viết đã được xóa thành công');
          },
          error: (err: any) => {
            console.error('Error deleting article', err);
            this.zooToast.error('Không thể xóa bài viết');
            this.loading = false;
          }
        });
      }
    });
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

  // Kiểm tra xem bài viết có phải của người dùng hiện tại không
  isCurrentUserArticle(article: any): boolean {
    return article.CreatedByUserId === this.currentUser.id;
  }
  
  // Kiểm tra xem bài viết có phải của admin không
  isAdminArticle(article: any): boolean {
    // Kiểm tra qua CreatedByUserId thay vì Author.Email
    const adminEmails = ['admin@parknews.com'];
    return adminEmails.includes(article.Author?.Email) || 
           (article.CreatedByUserId && article.CreatedByUserId !== this.currentUser.id && !this.isCurrentUserArticle(article));
  }
} 