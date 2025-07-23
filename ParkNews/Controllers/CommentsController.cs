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
    public class CommentsController : ODataController
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public CommentsController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/Comments
        [HttpGet]
        [EnableQuery]
        public async Task<ActionResult<IEnumerable<Comment>>> GetComments()
        {
            return await _context.Comments
                .Include(c => c.Article)
                .ToListAsync();
        }

        // GET: api/Comments/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Comment>> GetComment(int id)
        {
            var comment = await _context.Comments
                .Include(c => c.Article)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (comment == null)
            {
                return NotFound();
            }

            return comment;
        }

        // POST: api/Comments
        [HttpPost]
        public async Task<ActionResult<Comment>> CreateComment(CommentDTO commentDto)
        {
            var comment = _mapper.Map<Comment>(commentDto);
            comment.PostedAt = DateTime.UtcNow;
            comment.IsApproved = false; // Default to false, admin can approve later

            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetComment), new { id = comment.Id }, comment);
        }

        // PUT: api/Comments/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateComment(int id, CommentDTO commentDto)
        {
            var comment = await _context.Comments.FindAsync(id);
            if (comment == null)
            {
                return NotFound();
            }

            _mapper.Map(commentDto, comment);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CommentExists(id))
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

        // DELETE: api/Comments/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteComment(int id)
        {
            var comment = await _context.Comments.FindAsync(id);
            if (comment == null)
            {
                return NotFound();
            }

            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/Comments/search?q=keyword
        [HttpGet("search")]
        [EnableQuery]
        public async Task<ActionResult<IEnumerable<Comment>>> SearchComments([FromQuery] string q)
        {
            if (string.IsNullOrEmpty(q))
            {
                return await GetComments();
            }

            return await _context.Comments
                .Include(c => c.Article)
                .Where(c => c.Content.Contains(q) || c.UserName.Contains(q))
                .ToListAsync();
        }

        // GET: api/Comments/article/{articleId}
        [HttpGet("article/{articleId}")]
        [EnableQuery]
        public async Task<ActionResult<IEnumerable<Comment>>> GetArticleComments(int articleId)
        {
            return await _context.Comments
                .Include(c => c.Article)
                .Where(c => c.ArticleId == articleId && c.IsApproved)
                .OrderByDescending(c => c.PostedAt)
                .ToListAsync();
        }

        // GET: api/Comments/approved
        [HttpGet("approved")]
        [EnableQuery]
        public async Task<ActionResult<IEnumerable<Comment>>> GetApprovedComments()
        {
            return await _context.Comments
                .Include(c => c.Article)
                .Where(c => c.IsApproved)
                .OrderByDescending(c => c.PostedAt)
                .ToListAsync();
        }

        // GET: api/Comments/pending
        [HttpGet("pending")]
        [EnableQuery]
        public async Task<ActionResult<IEnumerable<Comment>>> GetPendingComments()
        {
            return await _context.Comments
                .Include(c => c.Article)
                .Where(c => !c.IsApproved)
                .OrderByDescending(c => c.PostedAt)
                .ToListAsync();
        }

        // PUT: api/Comments/{id}/approve
        [HttpPut("{id}/approve")]
        public async Task<IActionResult> ApproveComment(int id)
        {
            var comment = await _context.Comments.FindAsync(id);
            if (comment == null)
            {
                return NotFound();
            }

            comment.IsApproved = true;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // PUT: api/Comments/{id}/reject
        [HttpPut("{id}/reject")]
        public async Task<IActionResult> RejectComment(int id)
        {
            var comment = await _context.Comments.FindAsync(id);
            if (comment == null)
            {
                return NotFound();
            }

            comment.IsApproved = false;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CommentExists(int id)
        {
            return _context.Comments.Any(e => e.Id == id);
        }
    }
} 