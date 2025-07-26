import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ArticleService, Article } from '../../services/article.service';
import { TagService, Tag } from '../../services/tag.service';
import { HttpClientModule } from '@angular/common/http';
import { catchError, finalize, of, switchMap } from 'rxjs';
import { ZooToastService } from '../../shared/components/zoo-toast/zoo-toast.component';

@Component({
  selector: 'app-tag',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.css'
})
export class TagComponent implements OnInit {
  articles: Article[] = [];
  relatedTags: Tag[] = [];
  currentTag: Tag | null = null;
  isLoading: boolean = true;
  error: string | null = null;
  
  constructor(
    private articleService: ArticleService,
    private tagService: TagService,
    private route: ActivatedRoute,
    private zooToast: ZooToastService
  ) {}

  ngOnInit(): void {
    console.log('TagComponent initialized');
    this.route.paramMap.pipe(
      switchMap(params => {
        this.isLoading = true;
        const tagId = params.get('id');
        const tagSlug = params.get('slug');
        console.log('Route params:', params, 'tagId:', tagId, 'tagSlug:', tagSlug);
        
        if (tagSlug) {
          // Nếu có slug, ưu tiên sử dụng slug
          console.log('Loading tag by slug:', tagSlug);
          return this.loadTagBySlug(tagSlug);
        } else if (tagId) {
          // Kiểm tra xem tagId có phải là số hay không
          if (!isNaN(Number(tagId))) {
            // Nếu là số, lấy tag theo ID
            const id = parseInt(tagId, 10);
            console.log('Loading tag by ID:', id);
            return this.loadTagById(id);
          } else {
            // Nếu không phải số, coi như là slug và lấy tất cả tag để tìm
            console.log('Loading tag by ID as slug:', tagId);
            return this.loadTagBySlug(tagId);
          }
        } else {
          // If no tag ID, show an error
          console.error('No tag ID or slug provided');
          this.error = 'Không tìm thấy thẻ';
          this.isLoading = false;
          return of([]);
        }
      })
    ).subscribe(articles => {
      console.log('Received articles:', articles);
      this.articles = articles.filter(article => article.IsPublished);
      this.loadRelatedTags();
    });
  }
  
  loadTagById(id: number) {
    return this.tagService.getById(id).pipe(
      switchMap(tag => {
        this.currentTag = tag;
        console.log('Found tag:', tag);
        return this.articleService.getByTag(id).pipe(
          catchError(error => {
            console.error('Error loading articles by tag ID:', error);
            this.error = 'Không thể tải bài viết. Vui lòng thử lại sau.';
            return of([]);
          })
        );
      }),
      catchError(error => {
        console.error('Error loading tag by ID:', error);
        this.error = 'Không thể tải thẻ. Vui lòng thử lại sau.';
        this.zooToast.error('Không thể tải thẻ. Vui lòng thử lại sau.');
        return of([]);
      }),
      finalize(() => {
        this.isLoading = false;
      })
    );
  }
  
  loadTagBySlug(slug: string) {
    return this.tagService.getAll().pipe(
      switchMap(tags => {
        const foundTag = tags.find(tag => tag.Slug === slug);
        
        if (foundTag) {
          this.currentTag = foundTag;
          return this.articleService.getByTag(foundTag.Id!).pipe(
            catchError(error => {
              console.error('Error loading articles by tag slug:', error);
              this.error = 'Không thể tải bài viết. Vui lòng thử lại sau.';
              return of([]);
            })
          );
        } else {
          this.error = 'Không tìm thấy thẻ';
          return of([]);
        }
      }),
      catchError(error => {
        console.error('Error loading tags for slug search:', error);
        this.error = 'Không thể tải thẻ. Vui lòng thử lại sau.';
        return of([]);
      }),
      finalize(() => {
        this.isLoading = false;
      })
    );
  }
  
  loadRelatedTags(): void {
    if (!this.currentTag) return;
    
    this.tagService.getAll().pipe(
      catchError(error => {
        console.error('Error loading related tags:', error);
        return of([]);
      })
    ).subscribe(tags => {
      // Filter out the current tag and limit to 10 related tags
      this.relatedTags = tags
        .filter(tag => tag.Id !== this.currentTag?.Id)
        .slice(0, 10);
    });
  }

  getExcerpt(content: string, maxLength: number = 150): string {
    if (!content) return '';
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  }

  getFormattedDate(dateString: string): string {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  }
} 