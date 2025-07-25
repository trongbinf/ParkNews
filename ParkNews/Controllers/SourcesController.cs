using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using Microsoft.EntityFrameworkCore;
using ParkNews.Data;
using ParkNews.Models;
using AutoMapper;

namespace ParkNews.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SourcesController : ODataController
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public SourcesController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/Sources
        [HttpGet]
        [EnableQuery]
        public async Task<ActionResult<IEnumerable<Source>>> GetSources()
        {
            return await _context.Sources
                .Include(s => s.Articles)
                .ToListAsync();
        }

        // GET: api/Sources/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Source>> GetSource(int id)
        {
            var source = await _context.Sources
                .Include(s => s.Articles)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (source == null)
            {
                return NotFound();
            }

            return source;
        }

        // POST: api/Sources
        [HttpPost]
        public async Task<ActionResult<Source>> CreateSource(Source source)
        {
            _context.Sources.Add(source);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetSource), new { id = source.Id }, source);
        }

        // PUT: api/Sources/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSource(int id, Source source)
        {
            if (id != source.Id)
            {
                return BadRequest();
            }

            _context.Entry(source).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SourceExists(id))
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

        // PUT: api/Sources/update-basic/5
        [HttpPut("update-basic/{id}")]
        public async Task<IActionResult> UpdateBasicSourceInfo(int id, [FromBody] SourceUpdateDTO model)
        {
            if (model == null)
            {
                return BadRequest("Invalid data");
            }

            var source = await _context.Sources.FindAsync(id);
            if (source == null)
            {
                return NotFound("Source not found");
            }

            // Update basic source information
            source.Name = model.Name;
            source.WebsiteUrl = model.WebsiteUrl;
            source.LogoUrl = model.LogoUrl;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SourceExists(id))
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

        // DELETE: api/Sources/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSource(int id)
        {
            var source = await _context.Sources.FindAsync(id);
            if (source == null)
            {
                return NotFound();
            }

            _context.Sources.Remove(source);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/Sources/search?q=keyword
        [HttpGet("search")]
        [EnableQuery]
        public async Task<ActionResult<IEnumerable<Source>>> SearchSources([FromQuery] string q)
        {
            if (string.IsNullOrEmpty(q))
            {
                return await GetSources();
            }

            return await _context.Sources
                .Include(s => s.Articles)
                .Where(s => s.Name.Contains(q) || s.WebsiteUrl.Contains(q))
                .ToListAsync();
        }

        // GET: api/Sources/{id}/articles
        [HttpGet("{id}/articles")]
        [EnableQuery]
        public async Task<ActionResult<IEnumerable<Article>>> GetSourceArticles(int id)
        {
            return await _context.Articles
                .Include(a => a.Category)
                .Include(a => a.Author)
                .Include(a => a.Source)
                .Include(a => a.ArticleTags)
                    .ThenInclude(at => at.Tag)
                .Where(a => a.SourceId == id)
                .OrderByDescending(a => a.PublishDate)
                .ToListAsync();
        }

        // GET: api/Sources/popular
        [HttpGet("popular")]
        [EnableQuery]
        public async Task<ActionResult<IEnumerable<Source>>> GetPopularSources()
        {
            return await _context.Sources
                .Include(s => s.Articles)
                .OrderByDescending(s => s.Articles.Count)
                .Take(10)
                .ToListAsync();
        }

        private bool SourceExists(int id)
        {
            return _context.Sources.Any(e => e.Id == id);
        }
    }

    public class SourceUpdateDTO
    {
        public string Name { get; set; }
        public string WebsiteUrl { get; set; }
        public string LogoUrl { get; set; }
    }
} 