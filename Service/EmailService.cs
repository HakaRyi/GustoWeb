using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace Service
{
    public class EmailService
    {
        public EmailService() { }

        public async Task SendEmailAsync(string toEmail, string subject, string message)
        {
            // 👇 Email admin của bạn (phải trùng khớp với tài khoản tạo mật khẩu ứng dụng)
            var mail = "hau73310@gmail.com";

            // 👇 Mật khẩu ứng dụng MỚI NHẤT của bạn (viết liền, không dấu cách)
            var pw = "wxlojojyijyimfdh";

            var client = new SmtpClient("smtp.gmail.com", 587)
            {
                EnableSsl = true,
                // ⚠️ QUAN TRỌNG: Dòng này bắt buộc phải nằm TRƯỚC dòng Credentials
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential(mail, pw),
                DeliveryMethod = SmtpDeliveryMethod.Network,
                Timeout = 20000 // Tăng thời gian chờ lên 20s
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(mail, "Gusto Admin"),
                Subject = subject,
                Body = message,
                IsBodyHtml = true
            };

            mailMessage.To.Add(toEmail);

            try
            {
                await client.SendMailAsync(mailMessage);
            }
            catch (SmtpException ex)
            {
                // Ném lỗi ra để Controller bắt được
                throw new System.Exception($"SMTP Error: {ex.StatusCode} - {ex.Message}");
            }
        }
    }
}