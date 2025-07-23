using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ParkNews.Models.DTOs;
using ParkNews.Models;
using ParkNews.Models.DTOs.AuthDTO; // Add this if AuthDTO is a namespace inside DTOs
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;
using ParkNews.Services; // Add this if IEmailService is in the Services namespace

namespace ParkNews.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;
        private readonly RoleManager<IdentityRole> _roleManager;

        public AuthController(
            UserManager<ApplicationUser> userManager, 
            SignInManager<ApplicationUser> signInManager, 
            IConfiguration configuration, 
            IEmailService emailService,
            RoleManager<IdentityRole> roleManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
            _emailService = emailService;
            _roleManager = roleManager;
        }

        // POST: api/Auth/Login
        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest loginModel)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(loginModel.Email) || string.IsNullOrWhiteSpace(loginModel.Password))
                    return BadRequest(new { message = "Email and password are required." });

                // Find user by email only
                var user = await _userManager.FindByEmailAsync(loginModel.Email);

                if (user == null || !await _userManager.CheckPasswordAsync(user, loginModel.Password))
                    return Unauthorized(new { message = "Invalid credentials" });

                // Get user roles
                var userRoles = await _userManager.GetRolesAsync(user);

                // Generate JWT token
                var token = GenerateJwtToken(user, userRoles);
                
                // Create user info object for response
                var userInfo = new
                {
                    id = user.Id,
                    email = user.Email,
                    userName = user.UserName,
                    firstName = user.FirstName,
                    lastName = user.LastName,
                    roles = userRoles.ToArray() // Convert to array to ensure proper serialization
                };

                return Ok(new { token, user = userInfo });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"An error occurred: {ex.Message}" });
            }
        }

        // POST: api/Auth/Register
        [HttpPost("Register")]
        public async Task<IActionResult> Register([FromBody] ParkNews.Models.DTOs.AuthDTO.RegisterRequest model)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(model.Email) || string.IsNullOrWhiteSpace(model.Password))
                    return BadRequest(new { message = "Email and password are required." });
                
                // Check if user with this email already exists
                var existingUser = await _userManager.FindByEmailAsync(model.Email);
                if (existingUser != null)
                    return BadRequest(new { message = "Email already registered" });
                
                // Use email as username if username is not provided
                var userName = string.IsNullOrWhiteSpace(model.UserName) ? model.Email : model.UserName;
                
                var user = new ApplicationUser
                {
                    UserName = userName,
                    Email = model.Email,
                    FirstName = model.FirstName ?? string.Empty,
                    LastName = model.LastName ?? string.Empty,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                var result = await _userManager.CreateAsync(user, model.Password);
                if (!result.Succeeded)
                    return BadRequest(new { message = "Registration failed", errors = result.Errors });
                
                // Ensure Reader role exists
                if (!await _roleManager.RoleExistsAsync("Reader"))
                {
                    await _roleManager.CreateAsync(new IdentityRole("Reader"));
                }
                
                // Assign default Reader role
                await _userManager.AddToRoleAsync(user, "Reader");
                
                return Ok(new { message = "Registration successful" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"An error occurred: {ex.Message}" });
            }
        }

        // POST: api/Auth/ForgotPassword
        [HttpPost("ForgotPassword")]
        public async Task<IActionResult> ForgotPassword([FromBody] ParkNews.Models.DTOs.AuthDTO.ForgotPasswordRequest model)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(model.Email))
                    return BadRequest(new { message = "Email is required." });
                var user = await _userManager.FindByEmailAsync(model.Email);
                if (user == null)
                    return NotFound(new { message = "User not found" });
                var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                var resetLink = $"{Request.Scheme}://{Request.Host}/reset-password?email={user.Email}&token={System.Net.WebUtility.UrlEncode(token)}";
                var subject = "ParkNews Password Reset";
                var body = $"Click the link below to reset your password:<br/><a href='{resetLink}'>{resetLink}</a>";
                await _emailService.SendEmailAsync(user.Email ?? string.Empty, subject, body);
                return Ok(new { message = "Password reset email sent." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"An error occurred: {ex.Message}" });
            }
        }

        // POST: api/Auth/ResetPassword
        [HttpPost("ResetPassword")]
        public async Task<IActionResult> ResetPassword([FromBody] ParkNews.Models.DTOs.AuthDTO.ResetPasswordRequest model)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(model.Email) || string.IsNullOrWhiteSpace(model.Token) || string.IsNullOrWhiteSpace(model.NewPassword))
                    return BadRequest(new { message = "Email, token, and new password are required." });
                var user = await _userManager.FindByEmailAsync(model.Email);
                if (user == null)
                    return NotFound(new { message = "User not found" });
                var result = await _userManager.ResetPasswordAsync(user, model.Token, model.NewPassword);
                if (!result.Succeeded)
                    return BadRequest(new { message = "Password reset failed", errors = result.Errors });
                return Ok(new { message = "Password reset successful" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"An error occurred: {ex.Message}" });
            }
        }

        // POST: api/Auth/CreateAdminUser
        [HttpPost("CreateAdminUser")]
        public async Task<IActionResult> CreateAdminUser([FromBody] ParkNews.Models.DTOs.AuthDTO.RegisterRequest model)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(model.Email) || string.IsNullOrWhiteSpace(model.Password))
                    return BadRequest(new { message = "Email and password are required." });

                // Check if Admin role exists, if not create it
                if (!await _roleManager.RoleExistsAsync("Admin"))
                {
                    await _roleManager.CreateAsync(new IdentityRole("Admin"));
                }

                // Check if User role exists, if not create it
                if (!await _roleManager.RoleExistsAsync("User"))
                {
                    await _roleManager.CreateAsync(new IdentityRole("User"));
                }

                // Check if user with this email already exists
                var existingUser = await _userManager.FindByEmailAsync(model.Email);
                if (existingUser != null)
                {
                    // If user exists but not admin, make them admin
                    if (!await _userManager.IsInRoleAsync(existingUser, "Admin"))
                    {
                        await _userManager.AddToRoleAsync(existingUser, "Admin");
                        return Ok(new { message = "User promoted to Admin role" });
                    }
                    return BadRequest(new { message = "Email already registered as Admin" });
                }

                // Create new admin user
                var userName = string.IsNullOrWhiteSpace(model.UserName) ? model.Email : model.UserName;
                var user = new ApplicationUser
                {
                    UserName = userName,
                    Email = model.Email,
                    FirstName = model.FirstName ?? "Admin",
                    LastName = model.LastName ?? "User",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                var result = await _userManager.CreateAsync(user, model.Password);
                if (!result.Succeeded)
                    return BadRequest(new { message = "Admin creation failed", errors = result.Errors });

                // Assign Admin role
                await _userManager.AddToRoleAsync(user, "Admin");

                return Ok(new { message = "Admin user created successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"An error occurred: {ex.Message}" });
            }
        }

        private string GenerateJwtToken(ApplicationUser user, IList<string> roles)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var secretKey = jwtSettings["SecretKey"] ?? string.Empty;
            var issuer = jwtSettings["Issuer"] ?? string.Empty;
            var audience = jwtSettings["Audience"] ?? string.Empty;
            
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id ?? string.Empty),
                new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName ?? string.Empty),
                new Claim(JwtRegisteredClaimNames.Email, user.Email ?? string.Empty),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };
            
            // Add roles to claims
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }
            
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: creds
            );
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
