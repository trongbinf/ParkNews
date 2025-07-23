using System.Text.Json.Serialization;

namespace ParkNews.Models
{
    public class ArticleTag
    {
        public int ArticleId { get; set; }
        
        [JsonIgnore]
        public Article Article { get; set; }

        public int TagId { get; set; }
        
        [JsonIgnore]
        public Tag Tag { get; set; }
    }
}
