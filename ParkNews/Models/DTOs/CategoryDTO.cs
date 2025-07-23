using System.Collections.Generic;

namespace ParkNews.Models.DTOs
{
    public class CategoryDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Slug { get; set; }
        public int? ParentId { get; set; }
        public string ParentName { get; set; }
        public List<CategoryDTO> Children { get; set; }
    }

    public class CreateCategoryDTO
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public int? ParentId { get; set; }
    }

    public class UpdateCategoryDTO
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public int? ParentId { get; set; }
    }
}