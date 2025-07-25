using Microsoft.AspNetCore.Identity;
using ParkNews.Models;
using ParkNews.Interfaces;

namespace ParkNews.Data
{
    public static class SeedData
    {
        public static async Task Initialize(IServiceProvider serviceProvider)
        {
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();
            var unitOfWork = serviceProvider.GetRequiredService<IUnitOfWork>();

            // Seed Roles
            string[] roleNames = { "Admin", "Editor", "Reader" };
            string[] roleIds = { "1", "2", "3" };

            for (int i = 0; i < roleNames.Length; i++)
            {
                var roleExist = await roleManager.RoleExistsAsync(roleNames[i]);
                if (!roleExist)
                {
                    await roleManager.CreateAsync(new IdentityRole
                    {
                        Id = roleIds[i],
                        Name = roleNames[i],
                        NormalizedName = roleNames[i].ToUpper()
                    });
                }
            }

            // Seed Admin User
            var adminUser = await userManager.FindByEmailAsync("admin@parknews.com");
            if (adminUser == null)
            {
                adminUser = new ApplicationUser
                {
                    UserName = "admin@parknews.com",
                    Email = "admin@parknews.com",
                    EmailConfirmed = true,
                    PhoneNumberConfirmed = true,
                    FirstName = "Admin",
                    LastName = "User",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                var result = await userManager.CreateAsync(adminUser, "Admin@123456");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(adminUser, "Admin");
                }
            }
            else if (!await userManager.IsInRoleAsync(adminUser, "Admin"))
            {
                await userManager.AddToRoleAsync(adminUser, "Admin");
            }

            // Seed Editor User
            var editorUser = await userManager.FindByEmailAsync("editor@parknews.com");
            if (editorUser == null)
            {
                editorUser = new ApplicationUser
                {
                    UserName = "editor@parknews.com",
                    Email = "editor@parknews.com",
                    EmailConfirmed = true,
                    PhoneNumberConfirmed = true,
                    FirstName = "Editor",
                    LastName = "User",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                var result = await userManager.CreateAsync(editorUser, "Editor@123456");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(editorUser, "Editor");
                }
            }
            else if (!await userManager.IsInRoleAsync(editorUser, "Editor"))
            {
                await userManager.AddToRoleAsync(editorUser, "Editor");
            }

            // Seed Reader User
            var readerUser = await userManager.FindByEmailAsync("reader@parknews.com");
            if (readerUser == null)
            {
                readerUser = new ApplicationUser
                {
                    UserName = "reader@parknews.com",
                    Email = "reader@parknews.com",
                    EmailConfirmed = true,
                    PhoneNumberConfirmed = true,
                    FirstName = "Reader",
                    LastName = "User",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                var result = await userManager.CreateAsync(readerUser, "Reader@123456");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(readerUser, "Reader");
                }
            }
            else if (!await userManager.IsInRoleAsync(readerUser, "Reader"))
            {
                await userManager.AddToRoleAsync(readerUser, "Reader");
            }

            // Seed Categories
            if (!unitOfWork.Categories.GetQueryable().Any())
            {
                var categories = new List<Category>
                {
                    new Category { Name = "Thể thao", Slug = "the-thao", Description = "Tin tức thể thao trong nước và quốc tế" },
                    new Category { Name = "Công nghệ", Slug = "cong-nghe", Description = "Tin tức công nghệ mới nhất" },
                    new Category { Name = "Kinh tế", Slug = "kinh-te", Description = "Tin tức kinh tế và tài chính" },
                    new Category { Name = "Giải trí", Slug = "giai-tri", Description = "Tin tức giải trí và văn hóa" },
                    new Category { Name = "Sức khỏe", Slug = "suc-khoe", Description = "Tin tức sức khỏe và y tế" },
                    new Category { Name = "Giáo dục", Slug = "giao-duc", Description = "Tin tức giáo dục và đào tạo" },
                    new Category { Name = "Du lịch", Slug = "du-lich", Description = "Tin tức du lịch và khám phá" },
                    new Category { Name = "Xã hội", Slug = "xa-hoi", Description = "Tin tức xã hội và đời sống" }
                };

                foreach (var category in categories)
                {
                    await unitOfWork.Categories.AddAsync(category);
                }
                await unitOfWork.CompleteAsync();
            }

            // Seed Tags
            if (!unitOfWork.Tags.GetQueryable().Any())
            {
                var tags = new List<Tag>
                {
                    new Tag { Name = "Bóng đá", Slug = "bong-da" },
                    new Tag { Name = "Tennis", Slug = "tennis" },
                    new Tag { Name = "Công nghệ AI", Slug = "cong-nghe-ai" },
                    new Tag { Name = "Smartphone", Slug = "smartphone" },
                    new Tag { Name = "Crypto", Slug = "crypto" },
                    new Tag { Name = "Chứng khoán", Slug = "chung-khoan" },
                    new Tag { Name = "Phim ảnh", Slug = "phim-anh" },
                    new Tag { Name = "Âm nhạc", Slug = "am-nhac" },
                    new Tag { Name = "Y tế", Slug = "y-te" },
                    new Tag { Name = "Dinh dưỡng", Slug = "dinh-duong" },
                    new Tag { Name = "Đại học", Slug = "dai-hoc" },
                    new Tag { Name = "Du lịch Việt Nam", Slug = "du-lich-viet-nam" },
                    new Tag { Name = "Thời tiết", Slug = "thoi-tiet" },
                    new Tag { Name = "Giao thông", Slug = "giao-thong" }
                };

                foreach (var tag in tags)
                {
                    await unitOfWork.Tags.AddAsync(tag);
                }
                await unitOfWork.CompleteAsync();
            }

            // Seed Authors
            if (!unitOfWork.Authors.GetQueryable().Any())
            {
                var adminUserId = adminUser.Id;
                var editorUserId = editorUser.Id;
                var readerUserId = readerUser.Id;
                
                var authors = new List<Author>
                {
                    new Author { 
                        FullName = "Nguyễn Văn An", 
                        Email = "nguyenvanan@parknews.com", 
                        Bio = "Phóng viên thể thao với 10 năm kinh nghiệm",
                        AvatarUrl = "https://via.placeholder.com/150/FF6B6B/FFFFFF?text=NV",
                        UserId = adminUserId
                    },
                    new Author { 
                        FullName = "Trần Thị Bình", 
                        Email = "tranthibinh@parknews.com", 
                        Bio = "Chuyên gia công nghệ và AI",
                        AvatarUrl = "https://via.placeholder.com/150/4ECDC4/FFFFFF?text=TT",
                        UserId = editorUserId
                    },
                    new Author { 
                        FullName = "Lê Văn Cường", 
                        Email = "levancuong@parknews.com", 
                        Bio = "Phóng viên kinh tế và tài chính",
                        AvatarUrl = "https://via.placeholder.com/150/45B7D1/FFFFFF?text=LC",
                        UserId = readerUserId
                    },
                    new Author { 
                        FullName = "Phạm Thị Dung", 
                        Email = "phamthidung@parknews.com", 
                        Bio = "Phóng viên giải trí và văn hóa",
                        AvatarUrl = "https://via.placeholder.com/150/96CEB4/FFFFFF?text=PD",
                        UserId = adminUserId
                    },
                    new Author { 
                        FullName = "Hoàng Văn Em", 
                        Email = "hoangvanem@parknews.com", 
                        Bio = "Chuyên gia sức khỏe và y tế",
                        AvatarUrl = "https://via.placeholder.com/150/FFEAA7/FFFFFF?text=HE",
                        UserId = editorUserId
                    }
                };

                foreach (var author in authors)
                {
                    await unitOfWork.Authors.AddAsync(author);
                }
                await unitOfWork.CompleteAsync();
            }

            // Seed Sources
            if (!unitOfWork.Sources.GetQueryable().Any())
            {
                var sources = new List<Source>
                {
                    new Source { 
                        Name = "VnExpress", 
                        WebsiteUrl = "https://vnexpress.net",
                        LogoUrl = "https://via.placeholder.com/200x100/FF6B6B/FFFFFF?text=VnExpress"
                    },
                    new Source { 
                        Name = "Tuổi Trẻ", 
                        WebsiteUrl = "https://tuoitre.vn",
                        LogoUrl = "https://via.placeholder.com/200x100/4ECDC4/FFFFFF?text=TuoiTre"
                    },
                    new Source { 
                        Name = "Thanh Niên", 
                        WebsiteUrl = "https://thanhnien.vn",
                        LogoUrl = "https://via.placeholder.com/200x100/45B7D1/FFFFFF?text=ThanhNien"
                    },
                    new Source { 
                        Name = "Dân Trí", 
                        WebsiteUrl = "https://dantri.com.vn",
                        LogoUrl = "https://via.placeholder.com/200x100/96CEB4/FFFFFF?text=DanTri"
                    },
                    new Source { 
                        Name = "VietnamNet", 
                        WebsiteUrl = "https://vietnamnet.vn",
                        LogoUrl = "https://via.placeholder.com/200x100/FFEAA7/FFFFFF?text=VietnamNet"
                    }
                };

                foreach (var source in sources)
                {
                    await unitOfWork.Sources.AddAsync(source);
                }
                await unitOfWork.CompleteAsync();
            }

            // Seed Articles
            if (!unitOfWork.Articles.GetQueryable().Any())
            {
                var categories = unitOfWork.Categories.GetQueryable().ToList();
                var authors = unitOfWork.Authors.GetQueryable().ToList();
                var sources = unitOfWork.Sources.GetQueryable().ToList();

                var articles = new List<Article>
                {
                    new Article {
                        Title = "Việt Nam đánh bại Thái Lan 2-0 trong trận đấu quan trọng",
                        Slug = "viet-nam-danh-bai-thai-lan-2-0",
                        Summary = "Đội tuyển Việt Nam đã có chiến thắng quan trọng trước Thái Lan với tỷ số 2-0",
                        Content = "<p>Trong trận đấu diễn ra tối qua, đội tuyển Việt Nam đã thể hiện sự vượt trội về mặt kỹ thuật và chiến thuật...</p><p>Hai bàn thắng được ghi bởi Nguyễn Văn Quyết và Nguyễn Công Phượng...</p>",
                        PublishDate = DateTime.Now.AddDays(-5),
                        IsFeatured = true,
                        IsPublished = true,
                        CategoryId = categories.First(c => c.Name == "Thể thao").Id,
                        AuthorId = authors.First(a => a.FullName == "Nguyễn Văn An").Id,
                        SourceId = sources.First(s => s.Name == "VnExpress").Id,
                        FeaturedImageUrl = "https://via.placeholder.com/800x400/FF6B6B/FFFFFF?text=VietNam+vs+ThaiLan",
                        CreatedByUserId = adminUser.Id // Admin đăng bài này
                    },
                    new Article {
                        Title = "AI ChatGPT-5 sẽ ra mắt vào cuối năm 2024",
                        Slug = "ai-chatgpt-5-se-ra-mat-cuoi-nam-2024",
                        Summary = "OpenAI công bố kế hoạch ra mắt ChatGPT-5 với nhiều tính năng mới",
                        Content = "<p>OpenAI đã chính thức công bố kế hoạch ra mắt ChatGPT-5 vào cuối năm 2024...</p><p>Phiên bản mới sẽ có khả năng hiểu và xử lý thông tin tốt hơn nhiều so với ChatGPT-4...</p>",
                        PublishDate = DateTime.Now.AddDays(-3),
                        IsFeatured = true,
                        IsPublished = true,
                        CategoryId = categories.First(c => c.Name == "Công nghệ").Id,
                        AuthorId = authors.First(a => a.FullName == "Trần Thị Bình").Id,
                        SourceId = sources.First(s => s.Name == "Tuổi Trẻ").Id,
                        FeaturedImageUrl = "https://via.placeholder.com/800x400/4ECDC4/FFFFFF?text=ChatGPT-5",
                        CreatedByUserId = editorUser.Id // Editor đăng bài này
                    },
                    new Article {
                        Title = "Chứng khoán Việt Nam tăng mạnh sau thông tin tích cực",
                        Slug = "chung-khoan-viet-nam-tang-manh",
                        Summary = "Vn-Index tăng hơn 20 điểm trong phiên giao dịch hôm nay",
                        Content = "<p>Thị trường chứng khoán Việt Nam đã có phiên giao dịch tích cực với Vn-Index tăng 20.5 điểm...</p><p>Các cổ phiếu ngân hàng và bất động sản dẫn đầu đà tăng...</p>",
                        PublishDate = DateTime.Now.AddDays(-2),
                        IsFeatured = false,
                        IsPublished = true,
                        CategoryId = categories.First(c => c.Name == "Kinh tế").Id,
                        AuthorId = authors.First(a => a.FullName == "Lê Văn Cường").Id,
                        SourceId = sources.First(s => s.Name == "Thanh Niên").Id,
                        FeaturedImageUrl = "https://via.placeholder.com/800x400/45B7D1/FFFFFF?text=ChungKhoan",
                        CreatedByUserId = editorUser.Id // Editor đăng bài này
                    },
                    new Article {
                        Title = "Phim Việt Nam 'Bố già' đạt doanh thu kỷ lục",
                        Slug = "phim-viet-nam-bo-gia-dat-doanh-thu-ky-luc",
                        Summary = "Bộ phim 'Bố già' đã phá vỡ kỷ lục doanh thu phim Việt Nam",
                        Content = "<p>Bộ phim 'Bố già' của đạo diễn Trấn Thành đã đạt doanh thu hơn 400 tỷ đồng...</p><p>Phim nhận được nhiều đánh giá tích cực từ giới chuyên môn và khán giả...</p>",
                        PublishDate = DateTime.Now.AddDays(-1),
                        IsFeatured = true,
                        IsPublished = true,
                        CategoryId = categories.First(c => c.Name == "Giải trí").Id,
                        AuthorId = authors.First(a => a.FullName == "Phạm Thị Dung").Id,
                        SourceId = sources.First(s => s.Name == "Dân Trí").Id,
                        FeaturedImageUrl = "https://via.placeholder.com/800x400/96CEB4/FFFFFF?text=BoGia",
                        CreatedByUserId = adminUser.Id // Admin đăng bài này
                    },
                    new Article {
                        Title = "Cách phòng ngừa bệnh cúm mùa hiệu quả",
                        Slug = "cach-phong-ngua-benh-cum-mua-hieu-qua",
                        Summary = "Các chuyên gia y tế đưa ra lời khuyên về cách phòng ngừa bệnh cúm mùa",
                        Content = "<p>Bệnh cúm mùa đang có dấu hiệu gia tăng tại nhiều tỉnh thành...</p><p>Các chuyên gia khuyến cáo người dân nên tiêm vắc-xin cúm định kỳ...</p>",
                        PublishDate = DateTime.Now.AddDays(-4),
                        IsFeatured = false,
                        IsPublished = true,
                        CategoryId = categories.First(c => c.Name == "Sức khỏe").Id,
                        AuthorId = authors.First(a => a.FullName == "Hoàng Văn Em").Id,
                        SourceId = sources.First(s => s.Name == "VietnamNet").Id,
                        FeaturedImageUrl = "https://via.placeholder.com/800x400/FFEAA7/FFFFFF?text=BenhCum",
                        CreatedByUserId = editorUser.Id // Editor đăng bài này
                    }
                };

                foreach (var article in articles)
                {
                    await unitOfWork.Articles.AddAsync(article);
                }
                await unitOfWork.CompleteAsync();
            }

            // Seed ArticleTags
            if (!unitOfWork.ArticleTags.GetQueryable().Any())
            {
                var articles = unitOfWork.Articles.GetQueryable().ToList();
                var tags = unitOfWork.Tags.GetQueryable().ToList();

                var articleTags = new List<ArticleTag>
                {
                    // Article 1 - Thể thao
                    new ArticleTag { 
                        ArticleId = articles.First(a => a.Title.Contains("Việt Nam đánh bại")).Id,
                        TagId = tags.First(t => t.Name == "Bóng đá").Id
                    },
                    // Article 2 - Công nghệ
                    new ArticleTag { 
                        ArticleId = articles.First(a => a.Title.Contains("ChatGPT-5")).Id,
                        TagId = tags.First(t => t.Name == "Công nghệ AI").Id
                    },
                    // Article 3 - Kinh tế
                    new ArticleTag { 
                        ArticleId = articles.First(a => a.Title.Contains("Chứng khoán")).Id,
                        TagId = tags.First(t => t.Name == "Chứng khoán").Id
                    },
                    // Article 4 - Giải trí
                    new ArticleTag { 
                        ArticleId = articles.First(a => a.Title.Contains("Bố già")).Id,
                        TagId = tags.First(t => t.Name == "Phim ảnh").Id
                    },
                    // Article 5 - Sức khỏe
                    new ArticleTag { 
                        ArticleId = articles.First(a => a.Title.Contains("cúm mùa")).Id,
                        TagId = tags.First(t => t.Name == "Y tế").Id
                    }
                };

                foreach (var articleTag in articleTags)
                {
                    await unitOfWork.ArticleTags.AddAsync(articleTag);
                }
                await unitOfWork.CompleteAsync();
            }

            // Seed Comments
            if (!unitOfWork.Comments.GetQueryable().Any())
            {
                var articles = unitOfWork.Articles.GetQueryable().ToList();

                var comments = new List<Comment>
                {
                    new Comment {
                        Content = "Tuyệt vời! Đội tuyển Việt Nam đã chơi rất hay!",
                        UserName = "Nguyễn Văn A",
                        PostedAt = DateTime.Now.AddDays(-4),
                        IsApproved = true,
                        ArticleId = articles.First(a => a.Title.Contains("Việt Nam đánh bại")).Id
                    },
                    new Comment {
                        Content = "AI sẽ thay đổi thế giới trong tương lai gần",
                        UserName = "Trần Thị B",
                        PostedAt = DateTime.Now.AddDays(-2),
                        IsApproved = true,
                        ArticleId = articles.First(a => a.Title.Contains("ChatGPT-5")).Id
                    },
                    new Comment {
                        Content = "Thị trường chứng khoán đang có dấu hiệu tích cực",
                        UserName = "Lê Văn C",
                        PostedAt = DateTime.Now.AddDays(-1),
                        IsApproved = true,
                        ArticleId = articles.First(a => a.Title.Contains("Chứng khoán")).Id
                    },
                    new Comment {
                        Content = "Phim Bố già thật sự rất cảm động",
                        UserName = "Phạm Thị D",
                        PostedAt = DateTime.Now.AddHours(-12),
                        IsApproved = true,
                        ArticleId = articles.First(a => a.Title.Contains("Bố già")).Id
                    },
                    new Comment {
                        Content = "Cảm ơn bài viết hữu ích về phòng bệnh cúm",
                        UserName = "Hoàng Văn E",
                        PostedAt = DateTime.Now.AddHours(-6),
                        IsApproved = false,
                        ArticleId = articles.First(a => a.Title.Contains("cúm mùa")).Id
                    }
                };

                foreach (var comment in comments)
                {
                    await unitOfWork.Comments.AddAsync(comment);
                }
                await unitOfWork.CompleteAsync();
            }
        }
    }
}