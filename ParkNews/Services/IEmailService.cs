namespace ParkNews.Services
{
    public interface IEmailService
    {
        Task SendEmailAsync(string to, string subject, string body, bool isHtml = false);
        Task SendPasswordResetEmailAsync(string to, string resetLink);
        Task SendRegistrationEmailAsync(string to, string confirmLink);
    }
}
