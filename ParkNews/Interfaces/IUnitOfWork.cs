﻿using System;
using System.Threading.Tasks;
using ParkNews.Data;
using ParkNews.Models;

namespace ParkNews.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        ApplicationDbContext Context { get; }
        IGenericRepository<Article> Articles { get; }
        IGenericRepository<Category> Categories { get; }
        IGenericRepository<Tag> Tags { get; }
        IGenericRepository<Comment> Comments { get; }
        IGenericRepository<Author> Authors { get; }
        IGenericRepository<Source> Sources { get; }
        IGenericRepository<ArticleTag> ArticleTags { get; }
        Task<int> CompleteAsync();
    }
}
