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
    public class CategoryController : ODataController
    {
        private readonly IUnitOfWork _unitOfWork;

        public CategoryController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        // GET: api/Category
        [HttpGet]
        [EnableQuery]
        public async Task<ActionResult<IEnumerable<Category>>> GetCategories()
        {
            var categories = await _unitOfWork.Categories.GetQueryable().ToListAsync();
            return Ok(categories);
        }

        // GET: api/Category/5
        [HttpGet("{id}")]
        [EnableQuery]
        public async Task<ActionResult<Category>> GetCategory(int id)
        {
            var category = await _unitOfWork.Categories.GetByIdAsync(id);

            if (category == null)
            {
                return NotFound();
            }

            return Ok(category);
        }

        // POST: api/Category
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Category>> CreateCategory([FromBody] Category category)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Generate slug if not provided
            if (string.IsNullOrWhiteSpace(category.Slug))
            {
                category.Slug = GenerateSlug(category.Name);
            }

            await _unitOfWork.Categories.AddAsync(category);
            await _unitOfWork.CompleteAsync();

            return CreatedAtAction(nameof(GetCategory), new { id = category.Id }, category);
        }

        // PUT: api/Category/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateCategory(int id, [FromBody] Category category)
        {
            if (id != category.Id)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingCategory = await _unitOfWork.Categories.GetByIdAsync(id);
            if (existingCategory == null)
            {
                return NotFound();
            }

            existingCategory.Name = category.Name;
            existingCategory.Description = category.Description;
            
            // Update slug if name has changed
            if (existingCategory.Name != category.Name)
            {
                existingCategory.Slug = GenerateSlug(category.Name);
            }
            else if (!string.IsNullOrWhiteSpace(category.Slug))
            {
                existingCategory.Slug = category.Slug;
            }

            _unitOfWork.Categories.Update(existingCategory);
            await _unitOfWork.CompleteAsync();

            return NoContent();
        }

        // DELETE: api/Category/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var category = await _unitOfWork.Categories.GetByIdAsync(id);
            if (category == null)
            {
                return NotFound();
            }

            // Check if category has articles
            var hasArticles = await _unitOfWork.Articles.GetQueryable()
                .AnyAsync(a => a.CategoryId == id);

            if (hasArticles)
            {
                return BadRequest(new { message = "Cannot delete category with existing articles" });
            }

            _unitOfWork.Categories.Remove(category);
            await _unitOfWork.CompleteAsync();

            return NoContent();
        }

        // Helper method to generate slug
        private string GenerateSlug(string name)
        {
            string slug = name.ToLower()
                .Replace(" ", "-")
                .Replace("_", "-")
                .Replace(".", "-")
                .Replace(":", "-")
                .Replace(",", "-")
                .Replace(";", "-")
                .Replace("!", "")
                .Replace("?", "")
                .Replace("(", "")
                .Replace(")", "")
                .Replace("[", "")
                .Replace("]", "")
                .Replace("\"", "")
                .Replace("'", "")
                .Replace("&", "and");
            
            // Replace Vietnamese characters
            slug = slug.Replace("à", "a").Replace("á", "a").Replace("ả", "a").Replace("ã", "a").Replace("ạ", "a")
                .Replace("ă", "a").Replace("ắ", "a").Replace("ằ", "a").Replace("ẳ", "a").Replace("ẵ", "a").Replace("ặ", "a")
                .Replace("â", "a").Replace("ấ", "a").Replace("ầ", "a").Replace("ẩ", "a").Replace("ẫ", "a").Replace("ậ", "a")
                .Replace("đ", "d")
                .Replace("è", "e").Replace("é", "e").Replace("ẻ", "e").Replace("ẽ", "e").Replace("ẹ", "e")
                .Replace("ê", "e").Replace("ế", "e").Replace("ề", "e").Replace("ể", "e").Replace("ễ", "e").Replace("ệ", "e")
                .Replace("ì", "i").Replace("í", "i").Replace("ỉ", "i").Replace("ĩ", "i").Replace("ị", "i")
                .Replace("ò", "o").Replace("ó", "o").Replace("ỏ", "o").Replace("õ", "o").Replace("ọ", "o")
                .Replace("ô", "o").Replace("ố", "o").Replace("ồ", "o").Replace("ổ", "o").Replace("ỗ", "o").Replace("ộ", "o")
                .Replace("ơ", "o").Replace("ớ", "o").Replace("ờ", "o").Replace("ở", "o").Replace("ỡ", "o").Replace("ợ", "o")
                .Replace("ù", "u").Replace("ú", "u").Replace("ủ", "u").Replace("ũ", "u").Replace("ụ", "u")
                .Replace("ư", "u").Replace("ứ", "u").Replace("ừ", "u").Replace("ử", "u").Replace("ữ", "u").Replace("ự", "u")
                .Replace("ỳ", "y").Replace("ý", "y").Replace("ỷ", "y").Replace("ỹ", "y").Replace("ỵ", "y");
            
            // Remove consecutive hyphens
            while (slug.Contains("--"))
            {
                slug = slug.Replace("--", "-");
            }
            
            // Trim hyphens from start and end
            slug = slug.Trim('-');
            
            return slug;
        }
    }
} 