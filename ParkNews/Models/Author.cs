using System.Text.Json.Serialization;

namespace ParkNews.Models
{
    public class Author
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Bio { get; set; }
        public string AvatarUrl { get; set; }
        public string UserId { get; set; } // ID của ApplicationUser
        
        [JsonIgnore]
        public ICollection<Article> Articles { get; set; }
    }
}
