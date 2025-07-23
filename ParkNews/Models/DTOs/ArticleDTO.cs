using System;
using System.Collections.Generic;

namespace ParkNews.Models.DTOs
{
    public class ArticleDTO
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public string Description { get; set; }
        public string ImageUrl { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public bool IsPublished { get; set; }
        public int ViewCount { get; set; }
        public string AuthorId { get; set; }
        public string AuthorName { get; set; }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; }
        public List<string> Tags { get; set; }
    }

    public class CreateArticleDTO
    {
        public string Title { get; set; }
        public string Content { get; set; }
        public string Description { get; set; }
        public string ImageUrl { get; set; }
        public bool IsPublished { get; set; }
        public int CategoryId { get; set; }
        public List<string> Tags { get; set; }
    }

    public class UpdateArticleDTO
    {
        public string Title { get; set; }
        public string Content { get; set; }
        public string Description { get; set; }
        public string ImageUrl { get; set; }
        public bool IsPublished { get; set; }
        public int CategoryId { get; set; }
        public List<string> Tags { get; set; }
    }
}