using AutoMapper;
using ParkNews.Data;
using ParkNews.Interfaces;
using ParkNews.Models;

namespace ParkNews.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private IGenericRepository<Article>? _articles;
        private IGenericRepository<Category>? _categories;
        private IGenericRepository<Tag>? _tags;
        private IGenericRepository<Comment>? _comments;
        private IGenericRepository<Author>? _authors;
        private IGenericRepository<Source>? _sources;
        private IGenericRepository<ArticleTag>? _articleTags;

        public UnitOfWork(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public IGenericRepository<Article> Articles => _articles ??= new GenericRepository<Article>(_context);
        public IGenericRepository<Category> Categories => _categories ??= new GenericRepository<Category>(_context);
        public IGenericRepository<Tag> Tags => _tags ??= new GenericRepository<Tag>(_context);
        public IGenericRepository<Comment> Comments => _comments ??= new GenericRepository<Comment>(_context);
        public IGenericRepository<Author> Authors => _authors ??= new GenericRepository<Author>(_context);
        public IGenericRepository<Source> Sources => _sources ??= new GenericRepository<Source>(_context);
        public IGenericRepository<ArticleTag> ArticleTags => _articleTags ??= new GenericRepository<ArticleTag>(_context);

        public async Task<int> CompleteAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
