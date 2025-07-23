using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using Microsoft.EntityFrameworkCore;
using ParkNews.Data;
using ParkNews.Models;
using ParkNews.Models.DTOs;
using AutoMapper;

namespace ParkNews.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TagsController : ODataController
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public TagsController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/Tags
        [HttpGet]
        [EnableQuery]
        public async Task<ActionResult<IEnumerable<Tag>>> GetTags()
        {
            return await _context.Tags
                .Include(t => t.ArticleTags)
                    .ThenInclude(at => at.Article)
                .ToListAsync();
        }

        // GET: api/Tags/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Tag>> GetTag(int id)
        {
            var tag = await _context.Tags
                .Include(t => t.ArticleTags)
                    .ThenInclude(at => at.Article)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (tag == null)
            {
                return NotFound();
            }

            return tag;
        }

        // POST: api/Tags
        [HttpPost]
        public async Task<ActionResult<Tag>> CreateTag(TagDTO tagDto)
        {
            var tag = _mapper.Map<Tag>(tagDto);
            tag.Slug = GenerateSlug(tagDto.Name);

            _context.Tags.Add(tag);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTag), new { id = tag.Id }, tag);
        }

        // PUT: api/Tags/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTag(int id, TagDTO tagDto)
        {
            var tag = await _context.Tags.FindAsync(id);
            if (tag == null)
            {
                return NotFound();
            }

            _mapper.Map(tagDto, tag);
            tag.Slug = GenerateSlug(tagDto.Name);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TagExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Tags/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTag(int id)
        {
            var tag = await _context.Tags.FindAsync(id);
            if (tag == null)
            {
                return NotFound();
            }

            _context.Tags.Remove(tag);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/Tags/search?q=keyword
        [HttpGet("search")]
        [EnableQuery]
        public async Task<ActionResult<IEnumerable<Tag>>> SearchTags([FromQuery] string q)
        {
            if (string.IsNullOrEmpty(q))
            {
                return await GetTags();
            }

            return await _context.Tags
                .Include(t => t.ArticleTags)
                    .ThenInclude(at => at.Article)
                .Where(t => t.Name.Contains(q))
                .ToListAsync();
        }

        // GET: api/Tags/{id}/articles
        [HttpGet("{id}/articles")]
        [EnableQuery]
        public async Task<ActionResult<IEnumerable<Article>>> GetTagArticles(int id)
        {
            return await _context.Articles
                .Include(a => a.Category)
                .Include(a => a.Author)
                .Include(a => a.Source)
                .Include(a => a.ArticleTags)
                    .ThenInclude(at => at.Tag)
                .Where(a => a.ArticleTags.Any(at => at.TagId == id))
                .OrderByDescending(a => a.PublishDate)
                .ToListAsync();
        }

        // GET: api/Tags/popular
        [HttpGet("popular")]
        [EnableQuery]
        public async Task<ActionResult<IEnumerable<Tag>>> GetPopularTags()
        {
            return await _context.Tags
                .Include(t => t.ArticleTags)
                .OrderByDescending(t => t.ArticleTags.Count)
                .Take(20)
                .ToListAsync();
        }

        private bool TagExists(int id)
        {
            return _context.Tags.Any(e => e.Id == id);
        }

        private string GenerateSlug(string name)
        {
            return name.ToLower()
                .Replace(" ", "-")
                .Replace("đ", "d")
                .Replace("Đ", "d")
                .Replace("á", "a").Replace("à", "a").Replace("ả", "a").Replace("ã", "a").Replace("ạ", "a")
                .Replace("ă", "a").Replace("ắ", "a").Replace("ằ", "a").Replace("ẳ", "a").Replace("ẵ", "a").Replace("ặ", "a")
                .Replace("â", "a").Replace("ấ", "a").Replace("ầ", "a").Replace("ẩ", "a").Replace("ẫ", "a").Replace("ậ", "a")
                .Replace("é", "e").Replace("è", "e").Replace("ẻ", "e").Replace("ẽ", "e").Replace("ẹ", "e")
                .Replace("ê", "e").Replace("ế", "e").Replace("ề", "e").Replace("ể", "e").Replace("ễ", "e").Replace("ệ", "e")
                .Replace("í", "i").Replace("ì", "i").Replace("ỉ", "i").Replace("ĩ", "i").Replace("ị", "i")
                .Replace("ó", "o").Replace("ò", "o").Replace("ỏ", "o").Replace("õ", "o").Replace("ọ", "o")
                .Replace("ô", "o").Replace("ố", "o").Replace("ồ", "o").Replace("ổ", "o").Replace("ỗ", "o").Replace("ộ", "o")
                .Replace("ơ", "o").Replace("ớ", "o").Replace("ờ", "o").Replace("ở", "o").Replace("ỡ", "o").Replace("ợ", "o")
                .Replace("ú", "u").Replace("ù", "u").Replace("ủ", "u").Replace("ũ", "u").Replace("ụ", "u")
                .Replace("ư", "u").Replace("ứ", "u").Replace("ừ", "u").Replace("ử", "u").Replace("ữ", "u").Replace("ự", "u")
                .Replace("ý", "y").Replace("ỳ", "y").Replace("ỷ", "y").Replace("ỹ", "y").Replace("ỵ", "y");
        }
    }
} 