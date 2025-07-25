using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using ParkNews.Models;
using ParkNews.Models.DTOs;
using ParkNews.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;

namespace ParkNews.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ArticleController : ODataController
    {
        private readonly IUnitOfWork _unitOfWork;

        public ArticleController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        // GET: api/Article
        [HttpGet]
        [EnableQuery]
        public async Task<ActionResult<IEnumerable<Article>>> GetArticles()
        {
            var articles = await _unitOfWork.Articles.GetQueryable()
                .Include(a => a.Author)
                .Include(a => a.Category)
                .Include(a => a.Source)
                .Include(a => a.ArticleTags)
                    .ThenInclude(at => at.Tag)
                .ToListAsync();
            
            // Create a response that includes the navigation properties
            var response = articles.Select(a => new
            {
                a.Id,
                a.Title,
                a.Slug,
                a.Summary,
                a.Content,
                a.PublishDate,
                a.IsFeatured,
                a.IsPublished,
                a.FeaturedImageUrl,
                a.CreatedByUserId,
                Category = a.Category != null ? new { a.Category.Id, a.Category.Name } : null,
                Author = a.Author != null ? new { a.Author.Id, a.Author.FullName, a.Author.Email } : null,
                Source = a.Source != null ? new { a.Source.Id, a.Source.Name } : null,
                ArticleTags = a.ArticleTags.Select(at => new { 
                    at.ArticleId, 
                    at.TagId, 
                    Tag = new { at.Tag.Id, at.Tag.Name }
                }).ToList()
            }).ToList();
            
            return Ok(response);
        }

        // GET: api/Article/featured
        [HttpGet("featured")]
        public async Task<ActionResult<IEnumerable<Article>>> GetFeaturedArticles([FromQuery] int count = 5)
        {
            var featuredArticles = await _unitOfWork.Articles.GetQueryable()
                .Include(a => a.Author)
                .Include(a => a.Category)
                .Include(a => a.Source)
                .Include(a => a.ArticleTags)
                    .ThenInclude(at => at.Tag)
                .Where(a => a.IsFeatured)
                .OrderByDescending(a => a.PublishDate)
                .Take(count)
                .ToListAsync();
            
            // Create a response that includes the navigation properties
            var response = featuredArticles.Select(a => new
            {
                a.Id,
                a.Title,
                a.Slug,
                a.Summary,
                a.Content,
                a.PublishDate,
                a.IsFeatured,
                a.IsPublished,
                a.FeaturedImageUrl,
                a.CreatedByUserId,
                Category = a.Category != null ? new { a.Category.Id, a.Category.Name } : null,
                Author = a.Author != null ? new { a.Author.Id, a.Author.FullName, a.Author.Email } : null,
                Source = a.Source != null ? new { a.Source.Id, a.Source.Name } : null,
                ArticleTags = a.ArticleTags.Select(at => new { 
                    at.ArticleId, 
                    at.TagId, 
                    Tag = new { at.Tag.Id, at.Tag.Name }
                }).ToList()
            }).ToList();
            
            return Ok(response);
        }

        // GET: api/Article/latest
        [HttpGet("latest")]
        public async Task<ActionResult<IEnumerable<Article>>> GetLatestArticles([FromQuery] int count = 8)
        {
            var latestArticles = await _unitOfWork.Articles.GetQueryable()
                .Include(a => a.Author)
                .Include(a => a.Category)
                .Include(a => a.Source)
                .Include(a => a.ArticleTags)
                    .ThenInclude(at => at.Tag)
                .OrderByDescending(a => a.PublishDate)
                .Take(count)
                .ToListAsync();
            
            // Create a response that includes the navigation properties
            var response = latestArticles.Select(a => new
            {
                a.Id,
                a.Title,
                a.Slug,
                a.Summary,
                a.Content,
                a.PublishDate,
                a.IsFeatured,
                a.IsPublished,
                a.FeaturedImageUrl,
                a.CreatedByUserId,
                Category = a.Category != null ? new { a.Category.Id, a.Category.Name } : null,
                Author = a.Author != null ? new { a.Author.Id, a.Author.FullName, a.Author.Email } : null,
                Source = a.Source != null ? new { a.Source.Id, a.Source.Name } : null,
                ArticleTags = a.ArticleTags.Select(at => new { 
                    at.ArticleId, 
                    at.TagId, 
                    Tag = new { at.Tag.Id, at.Tag.Name }
                }).ToList()
            }).ToList();
            
            return Ok(response);
        }

        // GET: api/Article/trending
        [HttpGet("trending")]
        public async Task<ActionResult<IEnumerable<Article>>> GetTrendingArticles([FromQuery] int count = 4)
        {
            // You might have a ViewCount or some other metric to determine trending
            // For now, we'll just use featured articles as a substitute
            var trendingArticles = await _unitOfWork.Articles.GetQueryable()
                .Include(a => a.Author)
                .Include(a => a.Category)
                .Include(a => a.Source)
                .Include(a => a.ArticleTags)
                    .ThenInclude(at => at.Tag)
                // In a real scenario, you might order by ViewCount or similar metric
                .OrderByDescending(a => a.PublishDate)
                .Take(count)
                .ToListAsync();
            
            // Create a response that includes the navigation properties
            var response = trendingArticles.Select(a => new
            {
                a.Id,
                a.Title,
                a.Slug,
                a.Summary,
                a.Content,
                a.PublishDate,
                a.IsFeatured,
                a.IsPublished,
                a.FeaturedImageUrl,
                a.CreatedByUserId,
                Category = a.Category != null ? new { a.Category.Id, a.Category.Name } : null,
                Author = a.Author != null ? new { a.Author.Id, a.Author.FullName, a.Author.Email } : null,
                Source = a.Source != null ? new { a.Source.Id, a.Source.Name } : null,
                ArticleTags = a.ArticleTags.Select(at => new { 
                    at.ArticleId, 
                    at.TagId, 
                    Tag = new { at.Tag.Id, at.Tag.Name }
                }).ToList()
            }).ToList();
            
            return Ok(response);
        }

        // GET: api/Article/category/{categoryId}
        [HttpGet("category/{categoryId}")]
        public async Task<ActionResult<IEnumerable<Article>>> GetArticlesByCategory(int categoryId)
        {
            var articles = await _unitOfWork.Articles.GetQueryable()
                .Include(a => a.Author)
                .Include(a => a.Category)
                .Include(a => a.Source)
                .Include(a => a.ArticleTags)
                    .ThenInclude(at => at.Tag)
                .Where(a => a.CategoryId == categoryId)
                .OrderByDescending(a => a.PublishDate)
                .ToListAsync();
            
            // Create a response that includes the navigation properties
            var response = articles.Select(a => new
            {
                a.Id,
                a.Title,
                a.Slug,
                a.Summary,
                a.Content,
                a.PublishDate,
                a.IsFeatured,
                a.IsPublished,
                a.FeaturedImageUrl,
                a.CreatedByUserId,
                Category = a.Category != null ? new { a.Category.Id, a.Category.Name } : null,
                Author = a.Author != null ? new { a.Author.Id, a.Author.FullName, a.Author.Email } : null,
                Source = a.Source != null ? new { a.Source.Id, a.Source.Name } : null,
                ArticleTags = a.ArticleTags.Select(at => new { 
                    at.ArticleId, 
                    at.TagId, 
                    Tag = new { at.Tag.Id, at.Tag.Name }
                }).ToList()
            }).ToList();
            
            return Ok(response);
        }

        // GET: api/Article/5
        [HttpGet("{id}")]
        [EnableQuery]
        public async Task<ActionResult<Article>> GetArticle(int id)
        {
            var article = await _unitOfWork.Articles.GetQueryable()
                .Include(a => a.Author)
                .Include(a => a.Category)
                .Include(a => a.Source)
                .Include(a => a.ArticleTags)
                    .ThenInclude(at => at.Tag)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (article == null)
            {
                return NotFound();
            }

            // Create a response that includes the navigation properties
            var response = new
            {
                article.Id,
                article.Title,
                article.Slug,
                article.Summary,
                article.Content,
                article.PublishDate,
                article.IsFeatured,
                article.IsPublished,
                article.FeaturedImageUrl,
                article.CreatedByUserId,
                Category = article.Category != null ? new { article.Category.Id, article.Category.Name } : null,
                Author = article.Author != null ? new { article.Author.Id, article.Author.FullName, article.Author.Email } : null,
                Source = article.Source != null ? new { article.Source.Id, article.Source.Name } : null,
                ArticleTags = article.ArticleTags.Select(at => new { 
                    at.ArticleId, 
                    at.TagId, 
                    Tag = new { at.Tag.Id, at.Tag.Name }
                }).ToList()
            };
            
            return Ok(response);
        }

        // GET: api/Article/search?q=keyword
        [HttpGet("search")]
        [EnableQuery]
        public async Task<ActionResult<IEnumerable<Article>>> SearchArticles([FromQuery] string q)
        {
            if (string.IsNullOrEmpty(q))
            {
                return await GetArticles();
            }

            var articles = await _unitOfWork.Articles.GetQueryable()
                .Include(a => a.Author)
                .Include(a => a.Category)
                .Include(a => a.Source)
                .Include(a => a.ArticleTags)
                    .ThenInclude(at => at.Tag)
                .Where(a => a.Title.Contains(q) || a.Summary.Contains(q) || a.Content.Contains(q))
                .ToListAsync();

            // Create a response that includes the navigation properties
            var response = articles.Select(a => new
            {
                a.Id,
                a.Title,
                a.Slug,
                a.Summary,
                a.Content,
                a.PublishDate,
                a.IsFeatured,
                a.IsPublished,
                a.FeaturedImageUrl,
                a.CreatedByUserId,
                Category = a.Category != null ? new { a.Category.Id, a.Category.Name } : null,
                Author = a.Author != null ? new { a.Author.Id, a.Author.FullName, a.Author.Email } : null,
                Source = a.Source != null ? new { a.Source.Id, a.Source.Name } : null,
                ArticleTags = a.ArticleTags.Select(at => new { 
                    at.ArticleId, 
                    at.TagId, 
                    Tag = new { at.Tag.Id, at.Tag.Name }
                }).ToList()
            }).ToList();
            
            return Ok(response);
        }

        // GET: api/Article/byauthor/{authorId}
        [HttpGet("byauthor/{authorId}")]
        [EnableQuery]
        public async Task<ActionResult<IEnumerable<Article>>> GetArticlesByAuthor(int authorId)
        {
            var articles = await _unitOfWork.Articles.GetQueryable()
                .Include(a => a.Author)
                .Include(a => a.Category)
                .Include(a => a.Source)
                .Include(a => a.ArticleTags)
                    .ThenInclude(at => at.Tag)
                .Where(a => a.AuthorId == authorId)
                .OrderByDescending(a => a.PublishDate)
                .ToListAsync();
            
            // Create a response that includes the navigation properties
            var response = articles.Select(a => new
            {
                a.Id,
                a.Title,
                a.Slug,
                a.Summary,
                a.Content,
                a.PublishDate,
                a.IsFeatured,
                a.IsPublished,
                a.FeaturedImageUrl,
                a.CreatedByUserId,
                Category = a.Category != null ? new { a.Category.Id, a.Category.Name } : null,
                Author = a.Author != null ? new { a.Author.Id, a.Author.FullName, a.Author.Email } : null,
                Source = a.Source != null ? new { a.Source.Id, a.Source.Name } : null,
                ArticleTags = a.ArticleTags.Select(at => new { 
                    at.ArticleId, 
                    at.TagId, 
                    Tag = new { at.Tag.Id, at.Tag.Name }
                }).ToList()
            }).ToList();
            
            return Ok(response);
        }

        // GET: api/Article/byuser/{userId}
        [HttpGet("byuser/{userId}")]
        [EnableQuery]
        public async Task<ActionResult<IEnumerable<Article>>> GetArticlesByUser(string userId)
        {
            // Lấy tất cả bài viết có tác giả với UserId = userId
            var articles = await _unitOfWork.Articles.GetQueryable()
                .Include(a => a.Author)
                .Include(a => a.Category)
                .Include(a => a.Source)
                .Include(a => a.ArticleTags)
                    .ThenInclude(at => at.Tag)
                .Where(a => a.Author.UserId == userId)
                .OrderByDescending(a => a.PublishDate)
                .ToListAsync();
            
            // Create a response that includes the navigation properties
            var response = articles.Select(a => new
            {
                a.Id,
                a.Title,
                a.Slug,
                a.Summary,
                a.Content,
                a.PublishDate,
                a.IsFeatured,
                a.IsPublished,
                a.FeaturedImageUrl,
                a.CreatedByUserId,
                Category = a.Category != null ? new { a.Category.Id, a.Category.Name } : null,
                Author = a.Author != null ? new { a.Author.Id, a.Author.FullName, a.Author.Email } : null,
                Source = a.Source != null ? new { a.Source.Id, a.Source.Name } : null,
                ArticleTags = a.ArticleTags.Select(at => new { 
                    at.ArticleId, 
                    at.TagId, 
                    Tag = new { at.Tag.Id, at.Tag.Name }
                }).ToList()
            }).ToList();
            
            return Ok(response);
        }

        // GET: api/Article/byeditor/{userId}
        [HttpGet("byeditor/{userId}")]
        [EnableQuery]
        [Authorize(Roles = "Admin,Editor")]
        public async Task<ActionResult<IEnumerable<Article>>> GetArticlesByEditor(string userId)
        {
            // Kiểm tra xem người dùng có tồn tại không
            var user = await _unitOfWork.Context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound("Không tìm thấy người dùng");
            }

            // Lấy tất cả bài viết được tạo bởi editor có userId này
            // Sử dụng bảng EditorArticles để theo dõi mối quan hệ giữa Editor và Article
            var articles = await _unitOfWork.Articles.GetQueryable()
                .Include(a => a.Author)
                .Include(a => a.Category)
                .Include(a => a.Source)
                .Include(a => a.ArticleTags)
                    .ThenInclude(at => at.Tag)
                .Where(a => a.CreatedByUserId == userId) // Sử dụng trường CreatedByUserId thay vì liên kết qua Author
                .OrderByDescending(a => a.PublishDate)
                .ToListAsync();
            
            // Create a response that includes the navigation properties
            var response = articles.Select(a => new
            {
                a.Id,
                a.Title,
                a.Slug,
                a.Summary,
                a.Content,
                a.PublishDate,
                a.IsFeatured,
                a.IsPublished,
                a.FeaturedImageUrl,
                a.CreatedByUserId,
                Category = a.Category != null ? new { a.Category.Id, a.Category.Name } : null,
                Author = a.Author != null ? new { a.Author.Id, a.Author.FullName, a.Author.Email } : null,
                Source = a.Source != null ? new { a.Source.Id, a.Source.Name } : null,
                ArticleTags = a.ArticleTags.Select(at => new { 
                    at.ArticleId, 
                    at.TagId, 
                    Tag = new { at.Tag.Id, at.Tag.Name }
                }).ToList()
            }).ToList();
            
            return Ok(response);
        }

        // POST: api/Article
        [HttpPost]
        [Authorize(Roles = "Admin,Editor")]
        public async Task<ActionResult<Article>> CreateArticle([FromBody] CreateArticleDTO articleDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Lấy thông tin người dùng hiện tại từ token
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("Không thể xác định người dùng hiện tại");
            }

            var article = new Article
            {
                Title = articleDto.Title,
                Content = articleDto.Content,
                Summary = articleDto.Description,
                FeaturedImageUrl = articleDto.ImageUrl,
                IsFeatured = articleDto.IsFeatured,
                IsPublished = articleDto.IsPublished,
                CategoryId = articleDto.CategoryId,
                AuthorId = articleDto.AuthorId,
                SourceId = articleDto.SourceId,
                PublishDate = DateTime.UtcNow,
                Slug = GenerateSlug(articleDto.Title),
                CreatedByUserId = userId // Lưu ID của editor đã tạo bài viết
            };

            await _unitOfWork.Articles.AddAsync(article);
            await _unitOfWork.CompleteAsync();

            // Handle tags if provided
            if (articleDto.Tags != null && articleDto.Tags.Any())
            {
                foreach (var tagName in articleDto.Tags)
                {
                    var tag = await _unitOfWork.Tags.GetQueryable()
                        .FirstOrDefaultAsync(t => t.Name == tagName);
                    
                    if (tag == null)
                    {
                        tag = new Tag { Name = tagName, Slug = GenerateSlug(tagName) };
                        await _unitOfWork.Tags.AddAsync(tag);
                        await _unitOfWork.CompleteAsync();
                    }

                    var articleTag = new ArticleTag
                    {
                        ArticleId = article.Id,
                        TagId = tag.Id
                    };

                    await _unitOfWork.ArticleTags.AddAsync(articleTag);
                }

                await _unitOfWork.CompleteAsync();
            }

            return CreatedAtAction(nameof(GetArticle), new { id = article.Id }, article);
        }

        // PUT: api/Article/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Editor")]
        public async Task<IActionResult> UpdateArticle(int id, [FromBody] UpdateArticleDTO articleDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var article = await _unitOfWork.Articles.GetByIdAsync(id);
            if (article == null)
            {
                return NotFound();
            }

            // Kiểm tra quyền: Editor chỉ được cập nhật bài viết do họ tạo
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("Không thể xác định người dùng hiện tại");
            }

            // Nếu là Editor và không phải người tạo bài viết, không cho phép cập nhật
            if (!User.IsInRole("Admin") && article.CreatedByUserId != userId)
            {
                return Forbid("Bạn không có quyền cập nhật bài viết này");
            }

            article.Title = articleDto.Title;
            article.Content = articleDto.Content;
            article.Summary = articleDto.Description;
            article.FeaturedImageUrl = articleDto.ImageUrl;
            article.IsFeatured = articleDto.IsFeatured;
            article.IsPublished = articleDto.IsPublished;
            article.CategoryId = articleDto.CategoryId;
            article.AuthorId = articleDto.AuthorId;
            article.SourceId = articleDto.SourceId;
            article.Slug = GenerateSlug(articleDto.Title);

            _unitOfWork.Articles.Update(article);
            await _unitOfWork.CompleteAsync();

            // Update tags if provided
            if (articleDto.Tags != null)
            {
                // Remove existing article tags
                var existingArticleTags = await _unitOfWork.ArticleTags.GetQueryable()
                    .Where(at => at.ArticleId == id)
                    .ToListAsync();
                
                foreach (var articleTag in existingArticleTags)
                {
                    _unitOfWork.ArticleTags.Remove(articleTag);
                }
                
                await _unitOfWork.CompleteAsync();

                // Add new tags
                foreach (var tagName in articleDto.Tags)
                {
                    var tag = await _unitOfWork.Tags.GetQueryable()
                        .FirstOrDefaultAsync(t => t.Name == tagName);
                    
                    if (tag == null)
                    {
                        tag = new Tag { Name = tagName, Slug = GenerateSlug(tagName) };
                        await _unitOfWork.Tags.AddAsync(tag);
                        await _unitOfWork.CompleteAsync();
                    }

                    var articleTag = new ArticleTag
                    {
                        ArticleId = article.Id,
                        TagId = tag.Id
                    };

                    await _unitOfWork.ArticleTags.AddAsync(articleTag);
                }

                await _unitOfWork.CompleteAsync();
            }

            return NoContent();
        }

        // DELETE: api/Article/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,Editor")]
        public async Task<IActionResult> DeleteArticle(int id)
        {
            var article = await _unitOfWork.Articles.GetByIdAsync(id);
            if (article == null)
            {
                return NotFound();
            }

            // Kiểm tra quyền: Editor chỉ được xóa bài viết do họ tạo
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("Không thể xác định người dùng hiện tại");
            }

            // Nếu là Editor và không phải người tạo bài viết, không cho phép xóa
            if (!User.IsInRole("Admin") && article.CreatedByUserId != userId)
            {
                return Forbid("Bạn không có quyền xóa bài viết này");
            }

            // Remove article tags first
            var articleTags = await _unitOfWork.ArticleTags.GetQueryable()
                .Where(at => at.ArticleId == id)
                .ToListAsync();
            
            foreach (var articleTag in articleTags)
            {
                _unitOfWork.ArticleTags.Remove(articleTag);
            }
            
            await _unitOfWork.CompleteAsync();

            // Remove article comments
            var comments = await _unitOfWork.Comments.GetQueryable()
                .Where(c => c.ArticleId == id)
                .ToListAsync();
            
            foreach (var comment in comments)
            {
                _unitOfWork.Comments.Remove(comment);
            }
            
            await _unitOfWork.CompleteAsync();

            // Remove article
            _unitOfWork.Articles.Remove(article);
            await _unitOfWork.CompleteAsync();

            return NoContent();
        }

        // Helper method to generate slug
        private string GenerateSlug(string title)
        {
            string slug = title.ToLower()
                .Replace(" ", "-")
                .Replace("_", "-")
                .Replace(".", "-")
                .Replace(":", "-")
                .Replace(",", "-")
                .Replace(";", "-")
                .Replace("!", "")
                .Replace("?", "")
                .Replace("(", "")
                .Replace(")", "")
                .Replace("[", "")
                .Replace("]", "")
                .Replace("\"", "")
                .Replace("'", "")
                .Replace("&", "and");
            
            // Replace Vietnamese characters
            slug = slug.Replace("à", "a").Replace("á", "a").Replace("ả", "a").Replace("ã", "a").Replace("ạ", "a")
                .Replace("ă", "a").Replace("ắ", "a").Replace("ằ", "a").Replace("ẳ", "a").Replace("ẵ", "a").Replace("ặ", "a")
                .Replace("â", "a").Replace("ấ", "a").Replace("ầ", "a").Replace("ẩ", "a").Replace("ẫ", "a").Replace("ậ", "a")
                .Replace("đ", "d")
                .Replace("è", "e").Replace("é", "e").Replace("ẻ", "e").Replace("ẽ", "e").Replace("ẹ", "e")
                .Replace("ê", "e").Replace("ế", "e").Replace("ề", "e").Replace("ể", "e").Replace("ễ", "e").Replace("ệ", "e")
                .Replace("ì", "i").Replace("í", "i").Replace("ỉ", "i").Replace("ĩ", "i").Replace("ị", "i")
                .Replace("ò", "o").Replace("ó", "o").Replace("ỏ", "o").Replace("õ", "o").Replace("ọ", "o")
                .Replace("ô", "o").Replace("ố", "o").Replace("ồ", "o").Replace("ổ", "o").Replace("ỗ", "o").Replace("ộ", "o")
                .Replace("ơ", "o").Replace("ớ", "o").Replace("ờ", "o").Replace("ở", "o").Replace("ỡ", "o").Replace("ợ", "o")
                .Replace("ù", "u").Replace("ú", "u").Replace("ủ", "u").Replace("ũ", "u").Replace("ụ", "u")
                .Replace("ư", "u").Replace("ứ", "u").Replace("ừ", "u").Replace("ử", "u").Replace("ữ", "u").Replace("ự", "u")
                .Replace("ỳ", "y").Replace("ý", "y").Replace("ỷ", "y").Replace("ỹ", "y").Replace("ỵ", "y");
            
            // Remove consecutive hyphens
            while (slug.Contains("--"))
            {
                slug = slug.Replace("--", "-");
            }
            
            // Trim hyphens from start and end
            slug = slug.Trim('-');
            
            return slug;
        }
    }
} 