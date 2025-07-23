using AutoMapper;
using ParkNews.Models;
using ParkNews.Models.DTOs;

namespace ParkNews.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
           
            CreateMap<Article, ArticleDTO>()
                .ForMember(dest => dest.AuthorName, opt => opt.MapFrom(src => src.Author.FullName))
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.Name))
                .ForMember(dest => dest.Tags, opt => opt.MapFrom(src => src.ArticleTags.Select(at => at.Tag.Name)));

            CreateMap<CreateArticleDTO, Article>();
            CreateMap<UpdateArticleDTO, Article>();

           
            CreateMap<Category, CategoryDTO>()
                .ForMember(dest => dest.ParentName, opt => opt.MapFrom(src => src.ParentCategory.Name))
                .ForMember(dest => dest.Children, opt => opt.MapFrom(src => src.SubCategories));

            CreateMap<CreateCategoryDTO, Category>()
                .ForMember(dest => dest.ParentCategoryId, opt => opt.MapFrom(src => src.ParentId));
            CreateMap<UpdateCategoryDTO, Category>()
                .ForMember(dest => dest.ParentCategoryId, opt => opt.MapFrom(src => src.ParentId));

           
            CreateMap<Tag, TagDTO>();
            CreateMap<CreateTagDTO, Tag>();
            CreateMap<UpdateTagDTO, Tag>();

          
            CreateMap<Comment, CommentDTO>();
            CreateMap<CreateCommentDTO, Comment>();
            CreateMap<UpdateCommentDTO, Comment>();

            
            CreateMap<Author, AuthorDTO>();
            CreateMap<CreateAuthorDTO, Author>();
            CreateMap<UpdateAuthorDTO, Author>();
        }
    }
}