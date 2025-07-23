using MailKit.Security;
using MailKit.Net.Smtp;
using MimeKit;

namespace ParkNews.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendEmailAsync(string to, string subject, string body, bool isHtml = false)
        {
            try
            {
                var email = new MimeMessage();
                var settings = _configuration.GetSection("EmailSettings");

                email.From.Add(new MailboxAddress(settings["FromName"] ?? "ParkNews", settings["FromEmail"] ?? "noreply@ParkNews.com"));
                email.To.Add(MailboxAddress.Parse(to));
                email.Subject = subject;

                var builder = new BodyBuilder();
                if (isHtml)
                    builder.HtmlBody = body;
                else
                    builder.TextBody = body;

                email.Body = builder.ToMessageBody();

                using var smtp = new SmtpClient();
                await smtp.ConnectAsync(
                    settings["SmtpServer"] ?? "smtp.gmail.com",
                    int.Parse(settings["Port"] ?? "587"),
                    SecureSocketOptions.StartTls
                );

                await smtp.AuthenticateAsync(settings["Username"] ?? "", settings["Password"] ?? "");
                await smtp.SendAsync(email);
                await smtp.DisconnectAsync(true);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[EmailService] Error sending email: {ex.Message}\n{ex.StackTrace}");
                throw; // vẫn ném lỗi ra ngoài để biết khi test
            }
        }

        public async Task SendPasswordResetEmailAsync(string to, string resetLink)
        {
            var subject = "Đặt lại mật khẩu - ParkNews";
            var body = $@"
                <h2>Yêu cầu đặt lại mật khẩu</h2>
                <p>Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng nhấp vào liên kết bên dưới để đặt lại mật khẩu của bạn:</p>
                <p><a href='{resetLink}'>Đặt lại mật khẩu</a></p>
                <p>Nếu bạn không yêu cầu điều này, vui lòng bỏ qua email này.</p>
                <p>Liên kết này sẽ hết hạn sau 5 phút.</p>";

            await SendEmailAsync(to, subject, body, true);
        }

        public async Task SendRegistrationEmailAsync(string to, string confirmLink)
        {
            var subject = "Xác nhận đăng ký tài khoản - ParkNews";
            var body = $@"
                <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;'>
                    <h2 style='color: #333; text-align: center;'>Chào mừng đến với ParkNews Shop!</h2>
                    <p>Xin chào,</p>
                    <p>Cảm ơn bạn đã đăng ký tài khoản tại ParkNews Shop.</p>
                    <p>Vui lòng nhấp vào nút bên dưới để xác nhận địa chỉ email của bạn:</p>
                    <div style='text-align: center; margin: 30px 0;'>
                        <a href='{confirmLink}' style='background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;'>Xác nhận email</a>
                    </div>
                    <p>Sau khi xác nhận, bạn có thể đăng nhập và sử dụng đầy đủ các tính năng của ParkNews Shop.</p>
                    <hr style='border: 1px solid #eee; margin: 20px 0;'>
                    <p style='color: #666; font-size: 12px;'>Email này được gửi tự động, vui lòng không trả lời.</p>
                </div>";

            await SendEmailAsync(to, subject, body, true);
        }
    }
}
