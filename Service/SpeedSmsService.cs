using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System.Net;
using System.Net.Http.Headers;
using System.Text;
namespace Service
{
    public class SpeedSmsService
    {
        public const int TYPE_QC = 1;
        public const int TYPE_CSKH = 2;
        public const int TYPE_BRANDNAME = 3;
        public const int TYPE_BRANDNAME_NOTIFY = 4;
        public const int TYPE_GATEWAY = 5;

        private const string rootURL = "https://api.speedsms.vn/index.php";
        private readonly string accessToken;

        public SpeedSmsService(IConfiguration config)
        {
            accessToken = config["SpeedSMS:AccessToken"]; // lấy từ appsettings.json
        }

        public string GetUserInfo()
        {
            var url = rootURL + "/user/info";
            using (var client = new WebClient())
            {
                client.Credentials = new NetworkCredential(accessToken, "x");
                return client.DownloadString(url);
            }
        }

        public string SendSMS(string[] phones, string content, int type, string sender)
        {
            if (phones == null || phones.Length == 0)
                throw new ArgumentException("Phone list cannot be empty");
            if (string.IsNullOrWhiteSpace(content))
                throw new ArgumentException("Content cannot be empty");

            var payload = new
            {
                to = phones,
                content = content,
                type = type,
                sender = sender
            };

            var json = JsonConvert.SerializeObject(payload);

            using (var client = new WebClient())
            {
                client.Credentials = new NetworkCredential(accessToken, "x");
                client.Headers[HttpRequestHeader.ContentType] = "application/json";

                return client.UploadString(rootURL + "/sms/send", json);
            }
        }
    }
}
