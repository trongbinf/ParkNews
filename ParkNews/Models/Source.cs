using System.Text.Json.Serialization;

namespace ParkNews.Models
{
    public class Source
    {
        public int Id { get; set; }
        public string Name { get; set; }         // Tên nguồn báo, ví dụ: VnExpress, Tuổi Trẻ
        public string WebsiteUrl { get; set; }
        public string LogoUrl { get; set; }
        
        [JsonIgnore]
        public ICollection<Article> Articles { get; set; }
    }
}
