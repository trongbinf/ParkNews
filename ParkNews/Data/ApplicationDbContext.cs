using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ParkNews.Models;

namespace ParkNews.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Article> Articles { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<ArticleTag> ArticleTags { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Source> Sources { get; set; }
        public DbSet<Author> Authors { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Configure relationships
            builder.Entity<Article>()
                .HasOne(a => a.Category)
                .WithMany(c => c.Articles)
                .HasForeignKey(a => a.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Article>()
                .HasOne(a => a.Author)
                .WithMany(au => au.Articles)
                .HasForeignKey(a => a.AuthorId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Article>()
                .HasOne(a => a.Source)
                .WithMany(s => s.Articles)
                .HasForeignKey(a => a.SourceId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure ArticleTag composite key
            builder.Entity<ArticleTag>()
                .HasKey(at => new { at.ArticleId, at.TagId });

            builder.Entity<ArticleTag>()
                .HasOne(at => at.Article)
                .WithMany(a => a.ArticleTags)
                .HasForeignKey(at => at.ArticleId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<ArticleTag>()
                .HasOne(at => at.Tag)
                .WithMany(t => t.ArticleTags)
                .HasForeignKey(at => at.TagId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure Comment relationship
            builder.Entity<Comment>()
                .HasOne(c => c.Article)
                .WithMany(a => a.Comments)
                .HasForeignKey(c => c.ArticleId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure Category self-referencing relationship
            builder.Entity<Category>()
                .HasOne(c => c.ParentCategory)
                .WithMany(c => c.SubCategories)
                .HasForeignKey(c => c.ParentCategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure required fields
            builder.Entity<Article>()
                .Property(a => a.Title)
                .IsRequired()
                .HasMaxLength(500);

            builder.Entity<Article>()
                .Property(a => a.Slug)
                .IsRequired()
                .HasMaxLength(500);

            builder.Entity<Article>()
                .Property(a => a.Summary)
                .IsRequired()
                .HasMaxLength(1000);

            builder.Entity<Article>()
                .Property(a => a.Content)
                .IsRequired();

            builder.Entity<Category>()
                .Property(c => c.Name)
                .IsRequired()
                .HasMaxLength(100);

            builder.Entity<Category>()
                .Property(c => c.Slug)
                .IsRequired()
                .HasMaxLength(100);

            builder.Entity<Tag>()
                .Property(t => t.Name)
                .IsRequired()
                .HasMaxLength(100);

            builder.Entity<Tag>()
                .Property(t => t.Slug)
                .IsRequired()
                .HasMaxLength(100);

            builder.Entity<Author>()
                .Property(a => a.FullName)
                .IsRequired()
                .HasMaxLength(200);

            builder.Entity<Author>()
                .Property(a => a.Email)
                .IsRequired()
                .HasMaxLength(200);

            builder.Entity<Source>()
                .Property(s => s.Name)
                .IsRequired()
                .HasMaxLength(200);

            builder.Entity<Source>()
                .Property(s => s.WebsiteUrl)
                .IsRequired()
                .HasMaxLength(500);

            builder.Entity<Comment>()
                .Property(c => c.Content)
                .IsRequired()
                .HasMaxLength(2000);

            builder.Entity<Comment>()
                .Property(c => c.UserName)
                .IsRequired()
                .HasMaxLength(100);

            // Seed Roles - Updated to match SeedData
            builder.Entity<IdentityRole>().HasData(
                new IdentityRole
                {
                    Id = "1",
                    Name = "Admin",
                    NormalizedName = "ADMIN"
                },
                new IdentityRole
                {
                    Id = "2",
                    Name = "Editor",
                    NormalizedName = "EDITOR"
                },
                new IdentityRole
                {
                    Id = "3",
                    Name = "Reader",
                    NormalizedName = "READER"
                }
            );

            // Seed Categories - Updated to match SeedData
            builder.Entity<Category>().HasData(
                new Category { Id = 1, Name = "Thể thao", Slug = "the-thao", Description = "Tin tức thể thao trong nước và quốc tế" },
                new Category { Id = 2, Name = "Công nghệ", Slug = "cong-nghe", Description = "Tin tức công nghệ mới nhất" },
                new Category { Id = 3, Name = "Kinh tế", Slug = "kinh-te", Description = "Tin tức kinh tế và tài chính" },
                new Category { Id = 4, Name = "Giải trí", Slug = "giai-tri", Description = "Tin tức giải trí và văn hóa" },
                new Category { Id = 5, Name = "Sức khỏe", Slug = "suc-khoe", Description = "Tin tức sức khỏe và y tế" },
                new Category { Id = 6, Name = "Giáo dục", Slug = "giao-duc", Description = "Tin tức giáo dục và đào tạo" },
                new Category { Id = 7, Name = "Du lịch", Slug = "du-lich", Description = "Tin tức du lịch và khám phá" },
                new Category { Id = 8, Name = "Xã hội", Slug = "xa-hoi", Description = "Tin tức xã hội và đời sống" }
            );
        }
    }
}
