using System;

namespace ParkNews.Models.DTOs
{
    public class CommentDTO
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string UserId { get; set; }
        public string UserName { get; set; }
        public int ArticleId { get; set; }
        public string ArticleTitle { get; set; }
    }

    public class CreateCommentDTO
    {
        public string Content { get; set; }
        public int ArticleId { get; set; }
    }

    public class UpdateCommentDTO
    {
        public string Content { get; set; }
    }
}