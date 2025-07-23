using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using ParkNews.Models;
using ParkNews.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace ParkNews.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthorController : ODataController
    {
        private readonly IUnitOfWork _unitOfWork;

        public AuthorController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        // GET: api/Author
        [HttpGet]
        [EnableQuery]
        public async Task<ActionResult<IEnumerable<Author>>> GetAuthors()
        {
            var authors = await _unitOfWork.Authors.GetQueryable().ToListAsync();
            return Ok(authors);
        }

        // GET: api/Author/5
        [HttpGet("{id}")]
        [EnableQuery]
        public async Task<ActionResult<Author>> GetAuthor(int id)
        {
            var author = await _unitOfWork.Authors.GetByIdAsync(id);

            if (author == null)
            {
                return NotFound();
            }

            return Ok(author);
        }

        // POST: api/Author
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Author>> CreateAuthor([FromBody] Author author)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _unitOfWork.Authors.AddAsync(author);
            await _unitOfWork.CompleteAsync();

            return CreatedAtAction(nameof(GetAuthor), new { id = author.Id }, author);
        }

        // PUT: api/Author/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateAuthor(int id, [FromBody] Author author)
        {
            if (id != author.Id)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingAuthor = await _unitOfWork.Authors.GetByIdAsync(id);
            if (existingAuthor == null)
            {
                return NotFound();
            }

            existingAuthor.FullName = author.FullName;
            existingAuthor.Email = author.Email;
            existingAuthor.Bio = author.Bio;
            existingAuthor.AvatarUrl = author.AvatarUrl;

            _unitOfWork.Authors.Update(existingAuthor);
            await _unitOfWork.CompleteAsync();

            return NoContent();
        }

        // DELETE: api/Author/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteAuthor(int id)
        {
            var author = await _unitOfWork.Authors.GetByIdAsync(id);
            if (author == null)
            {
                return NotFound();
            }

            // Check if author has articles
            var hasArticles = await _unitOfWork.Articles.GetQueryable()
                .AnyAsync(a => a.AuthorId == id);

            if (hasArticles)
            {
                return BadRequest(new { message = "Cannot delete author with existing articles" });
            }

            _unitOfWork.Authors.Remove(author);
            await _unitOfWork.CompleteAsync();

            return NoContent();
        }
    }
} 