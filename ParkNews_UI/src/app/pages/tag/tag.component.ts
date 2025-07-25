import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ArticleService, Article } from '../../services/article.service';
import { TagService, Tag } from '../../services/tag.service';
import { HttpClientModule } from '@angular/common/http';
import { catchError, finalize, of, switchMap } from 'rxjs';

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
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        this.isLoading = true;
        const tagId = params.get('id');
        
        if (tagId) {
          // If we have a tag ID, load articles for that tag
          const id = parseInt(tagId, 10);
          return this.tagService.getById(id).pipe(
            switchMap(tag => {
              this.currentTag = tag;
              return this.articleService.getByTag(id).pipe(
                catchError(error => {
                  console.error('Error loading articles by tag:', error);
                  this.error = 'Không thể tải bài viết. Vui lòng thử lại sau.';
                  return of([]);
                })
              );
            }),
            catchError(error => {
              console.error('Error loading tag:', error);
              this.error = 'Không thể tải thẻ. Vui lòng thử lại sau.';
              return of([]);
            }),
            finalize(() => {
              this.isLoading = false;
            })
          );
        } else {
          // If no tag ID, show an error
          this.error = 'Không tìm thấy thẻ';
          this.isLoading = false;
          return of([]);
        }
      })
    ).subscribe(articles => {
      this.articles = articles;
      this.loadRelatedTags();
    });
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