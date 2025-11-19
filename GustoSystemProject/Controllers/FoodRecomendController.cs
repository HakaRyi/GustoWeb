using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace GustoSystemProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FoodRecomendController : ControllerBase
    {
        private HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        public FoodRecomendController(IHttpClientFactory httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient.CreateClient();
            _configuration = configuration;
        }

        [HttpPost]
        public async Task<IActionResult> Recommend([FromBody] FoodRequest request)
        {
            var apiKey = _configuration["Gemini:ApiKey"];
            string systemPrompt = "";

            // Chuẩn bị Prompt
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "prompts", "system_food.txt");
            try
            {
                if (System.IO.File.Exists(filePath))
                {
                    systemPrompt = await System.IO.File.ReadAllTextAsync(filePath);
                }
                else
                {
                    systemPrompt = "Bạn là một chuyên gia ẩm thực, hãy tư vấn món ăn ngắn gọn.";
                }
            }
            catch (Exception ex)
            {
                systemPrompt = "Bạn là một chuyên gia ẩm thực.";
            }

            var userPrompt = $"Weather: {request.Weather}\nMood: {request.Mood}\nContext: {request.Context}\nPreferences: {request.Preferences}";
            var fullPrompt = systemPrompt + "\n" + userPrompt;
            var body = new
            {
                contents = new[]
                {
                    new
                    {
                        parts = new[]
                        {
                            new { text = fullPrompt }
                        }
                    }
                }
            };

            var json = JsonSerializer.Serialize(body);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            var url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key={apiKey}";

            var response = await _httpClient.PostAsync(url, content);
            var resultString = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(resultString);
            try
            {
                var text = doc.RootElement
                    .GetProperty("candidates")[0]
                    .GetProperty("content")
                    .GetProperty("parts")[0]
                    .GetProperty("text")
                    .GetString();

                text = text.Replace("```json", "").Replace("```", "").Trim();
                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                var recommendationResult = JsonSerializer.Deserialize<AIRecommendationResponse>(text, options);
                return Ok(recommendationResult);
            }
            catch
            {
                return BadRequest("Lỗi khi gọi Gemini: " + resultString);
            }
        }
        public class FoodRequest
        {
            public string Weather { get; set; }
            public string Mood { get; set; }
            public string Preferences { get; set; }
            public string Context { get; set; }
        }

        public class AIRecommendationResponse
        {
            public string Status { get; set; }
            public List<DishRecommendation> Recommendations { get; set; }
        }

        public class DishRecommendation
        {
            public string Dish { get; set; }
            public string Category { get; set; }
            public string Reason { get; set; }
            public string Suitable_for { get; set; }
        }
    }
}
