using System.Text.Json.Serialization;

namespace ParkNews.Models
{
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; }           
        public string Slug { get; set; }           
        public string Description { get; set; }
        public int? ParentCategoryId { get; set; }  
        
        [JsonIgnore]
        public Category ParentCategory { get; set; }
        
        [JsonIgnore]
        public ICollection<Category> SubCategories { get; set; }

        [JsonIgnore]
        public ICollection<Article> Articles { get; set; }
    }
}
