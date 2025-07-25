import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ArticleService } from '../../services/article.service';
import { CategoryService } from '../../services/category.service';
import { SourceService } from '../../services/source.service';
import { TagService } from '../../services/tag.service';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { QuillModule } from 'ngx-quill';
import { AuthorService } from '../../services/author.service';

@Component({
  selector: 'app-editor-article-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    QuillModule
  ],
  templateUrl: './editor-article-detail.component.html',
  styleUrl: './editor-article-detail.component.css'
})
export class EditorArticleDetailComponent implements OnInit {
  article: any = {
    Title: '',
    Content: '',
    Summary: '',
    FeaturedImageUrl: '',
    IsPublished: false,
    CategoryId: null,
    AuthorId: null,
    SourceId: null,
    Tags: []
  };
  
  categories: any[] = [];
  sources: any[] = [];
  tags: any[] = [];
  authors: any[] = [];
  filteredTags: any[] = [];
  newTag = '';
  
  articleId: number | null = null;
  isNew = true;
  loading = false;
  saving = false;
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private articleService: ArticleService,
    private categoryService: CategoryService,
    private sourceService: SourceService,
    private tagService: TagService,
    private authService: AuthService,
    private toastr: ToastrService,
    private authorService: AuthorService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    
    // Load necessary data
    this.loadCategories();
    this.loadSources();
    this.loadTags();
    this.loadAuthors();
    
    // Check if we're editing an existing article or creating a new one
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.articleId = +params['id'];
        this.isNew = false;
        this.loadArticle(this.articleId);
      } else {
        this.isNew = true;
        this.loading = false;
        this.article = {
          Title: '',
          Content: '',
          Summary: '',
          FeaturedImageUrl: '',
          IsPublished: false,
          CategoryId: null,
          AuthorId: null,
          SourceId: null,
          Tags: []
        };
      }
    });
  }

  loadArticle(id: number) {
    this.loading = true;
    this.articleService.getById(id).subscribe({
      next: (article: any) => {
        // Check if this article belongs to the current user
        if (article.Author && article.Author.Id !== this.currentUser.id) {
          this.toastr.error('Bạn không có quyền chỉnh sửa bài viết này', 'Lỗi');
          this.router.navigate(['/editor/articles']);
          return;
        }
        
        this.article = {
          ...article,
          Summary: article.Description || '',
          FeaturedImageUrl: article.ImageUrl || '',
          IsPublished: article.IsPublished || false,
          Tags: article.ArticleTags?.$values?.map((at: any) => at.Tag?.Name) || []
        };
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading article', err);
        this.toastr.error('Không thể tải bài viết', 'Lỗi');
        this.loading = false;
        this.router.navigate(['/editor/articles']);
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
      },
      error: (err) => {
        console.error('Error loading categories', err);
        this.toastr.error('Không thể tải danh sách danh mục', 'Lỗi');
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
      },
      error: (err) => {
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
      },
      error: (err) => {
        console.error('Error loading tags', err);
        this.toastr.error('Không thể tải danh sách thẻ', 'Lỗi');
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
      },
      error: (err) => {
        console.error('Error loading authors', err);
        this.toastr.error('Không thể tải danh sách tác giả', 'Lỗi');
      }
    });
  }

  onTagInput() {
    if (!this.newTag) {
      this.filteredTags = [];
      return;
    }
    
    const searchTerm = this.newTag.toLowerCase();
    this.filteredTags = this.tags
      .filter(tag => tag.Name.toLowerCase().includes(searchTerm))
      .filter(tag => !this.article.Tags.includes(tag.Name))
      .slice(0, 5);
  }

  selectTag(tagName: string) {
    this.newTag = '';
    this.addTag(tagName);
    this.filteredTags = [];
  }

  addTag(tagName?: string) {
    const tagToAdd = tagName || this.newTag;
    if (tagToAdd && !this.article.Tags.includes(tagToAdd)) {
      this.article.Tags.push(tagToAdd);
      this.newTag = '';
      this.filteredTags = [];
    }
  }

  removeTag(index: number) {
    this.article.Tags.splice(index, 1);
  }

  validateForm(): boolean {
    if (!this.article.Title?.trim()) {
      this.toastr.warning('Vui lòng nhập tiêu đề bài viết', 'Thiếu thông tin');
      return false;
    }

    if (!this.article.CategoryId) {
      this.toastr.warning('Vui lòng chọn danh mục', 'Thiếu thông tin');
      return false;
    }

    if (!this.article.Content?.trim()) {
      this.toastr.warning('Vui lòng nhập nội dung bài viết', 'Thiếu thông tin');
      return false;
    }

    return true;
  }

  saveArticle() {
    if (!this.validateForm()) {
      return;
    }

    this.saving = true;

    const articleData = {
      Title: this.article.Title.trim(),
      Content: this.article.Content.trim(),
      Description: this.article.Summary?.trim() || '',
      ImageUrl: this.article.FeaturedImageUrl?.trim() || '',
      IsPublished: this.article.IsPublished,
      IsFeatured: false, // Editor không thể đặt bài viết làm nổi bật
      CategoryId: this.article.CategoryId,
      AuthorId: this.article.AuthorId,
      SourceId: this.article.SourceId || null,
      Tags: this.article.Tags || []
    };

    console.log('Sending article data:', articleData);

    if (this.isNew) {
      this.articleService.create(articleData).subscribe({
        next: (response) => {
          this.toastr.success('Bài viết đã được tạo thành công', 'Thành công');
          this.saving = false;
          this.router.navigate(['/editor/articles']);
        },
        error: (err) => {
          console.error('Error creating article', err);
          this.toastr.error(err.error?.title || 'Không thể tạo bài viết', 'Lỗi');
          this.saving = false;
        }
      });
    } else {
      this.articleService.update(this.articleId!, articleData).subscribe({
        next: () => {
          this.toastr.success('Bài viết đã được cập nhật thành công', 'Thành công');
          this.saving = false;
          this.router.navigate(['/editor/articles']);
        },
        error: (err) => {
          console.error('Error updating article', err);
          this.toastr.error(err.error?.title || 'Không thể cập nhật bài viết', 'Lỗi');
          this.saving = false;
        }
      });
    }
  }

  cancel() {
    this.router.navigate(['/editor/articles']);
  }
} 