using System.Text.Json.Serialization;

namespace ParkNews.Models
{
    public class Comment
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public string UserName { get; set; }   // Nếu user đăng nhập thì liên kết UserId
        public DateTime PostedAt { get; set; }
        public bool IsApproved { get; set; }   // Duyệt bình luận

        public int ArticleId { get; set; }
        
        [JsonIgnore]
        public Article Article { get; set; }
    }
}
