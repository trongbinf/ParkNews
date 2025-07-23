using System.Text.Json.Serialization;

namespace ParkNews.Models
{
    public class Tag
    {
        public int Id { get; set; }
        public string Name { get; set; }       // Tên tag, ví dụ: Bóng đá, Công nghệ
        public string Slug { get; set; }
        
        [JsonIgnore]
        public ICollection<ArticleTag> ArticleTags { get; set; }
    }
}
