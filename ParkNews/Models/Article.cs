using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ParkNews.Models
{
    public class Article
    {
        public int Id { get; set; }

        public string Title { get; set; }           // Tiêu đề bài
        public string Slug { get; set; }            // URL thân thiện
        public string Summary { get; set; }         // Tóm tắt ngắn

        // Nội dung chính (HTML) – có thể chèn <img src="...">
        public string Content { get; set; }

        public DateTime PublishDate { get; set; }
        public bool IsFeatured { get; set; }
        public bool IsPublished { get; set; } = true;  // Trạng thái xuất bản
        
        // ID của người dùng đã tạo bài viết (Editor)
        public string CreatedByUserId { get; set; }

        // ------------ Khóa ngoại -------------
        [ForeignKey(nameof(Category))]
        public int CategoryId { get; set; }
        
        [JsonIgnore]
        public Category Category { get; set; }

        [ForeignKey(nameof(Author))]
        public int? AuthorId { get; set; }
        
        [JsonIgnore]
        public Author Author { get; set; }

        [ForeignKey(nameof(Source))]
        public int? SourceId { get; set; }
        
        [JsonIgnore]
        public Source Source { get; set; }

        // Ảnh đại diện (thumbnail)
        public string FeaturedImageUrl { get; set; }

        // ------------ Navigation properties ------------
        // Bộ sưu tập bình luận của bài viết
        [JsonIgnore]
        public ICollection<Comment> Comments { get; set; }

        // Bộ sưu tập liên kết Article ↔ Tag (nhiều-nhiều)
        [JsonIgnore]
        public ICollection<ArticleTag> ArticleTags { get; set; }
    }
}
