namespace ParkNews.Models.DTOs
{
    public class AuthorDTO
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Bio { get; set; }
        public string AvatarUrl { get; set; }
    }

    public class CreateAuthorDTO
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Bio { get; set; }
        public string AvatarUrl { get; set; }
    }

    public class UpdateAuthorDTO
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Bio { get; set; }
        public string AvatarUrl { get; set; }
    }
}