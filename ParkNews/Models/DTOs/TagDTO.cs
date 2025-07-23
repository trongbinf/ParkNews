namespace ParkNews.Models.DTOs
{
    public class TagDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Slug { get; set; }
    }

    public class CreateTagDTO
    {
        public string Name { get; set; }
        public string Description { get; set; }
    }

    public class UpdateTagDTO
    {
        public string Name { get; set; }
        public string Description { get; set; }
    }
}