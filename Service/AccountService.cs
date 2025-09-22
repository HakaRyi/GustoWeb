using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Repository;
using Repository.Models;
using Service.DTO.Request;
using Service.DTO.Request.AccountRequest;
using Service.DTO.Response;
using Service.Settings;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Service
{
    public class AccountService
    {
        private readonly AccountRepository _repo;
        private readonly RefreshTokenRepository _refreshTokenRepository;

        private readonly IMapper _mapper;
        private readonly ILogger<AccountService> _logger;
        private readonly JwtSettings _jwtSettings;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AccountService(AccountRepository repo, IMapper mapper, ILogger<AccountService> logger, JwtSettings jwtSettings, IHttpContextAccessor httpContextAccessor, RefreshTokenRepository refreshTokenRepository)
        {
            _repo = repo;
            _mapper = mapper;
            _logger = logger;
            _jwtSettings = jwtSettings;
            _httpContextAccessor = httpContextAccessor;
            _refreshTokenRepository = refreshTokenRepository;
        }
        //CRUD Operations:
        //Create Account
        public async Task<AccountResponse> CreateAccountAsync(SignUpRequest request)
        {
            try
            {
                //Init Account Model
                var account = new Account();
                account.UserName = request.UserName;
                account.Password = request.Password;
                account.CreateAt = DateTime.Now;

                account.RoleId = request.RoleId;

                await _repo.CreateAccount(account);
                //Result:
                var res = _mapper.Map<AccountResponse>(account);
                return res;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in CreateAccountAsync");
                return new AccountResponse();
            }
        }

        //Get All Accounts
        public async Task<List<AccountResponse>> GetAllAccountsAsync()
        {
            var accounts = await _repo.GetAllAccounts();
            var res = _mapper.Map<List<AccountResponse>>(accounts);
            return res;
        }
        //Get Account By Id
        public async Task<AccountResponse> GetAccountByIdAsync(short id)
        {
            try
            {
                var account = await _repo.GetAccountById(id);
                var res = _mapper.Map<AccountResponse>(account);
                return res;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetAccountByIdAsync");
                return new AccountResponse();
            }
        }
        //Update Account
        public async Task<AccountResponse> UpdateAccountAsync(UpdateAccountRequest request)
        {
            try
            {
                //Init Account Model
                var account = await _repo.GetAccountById(request.Id);

                account.UserName = string.IsNullOrWhiteSpace(request.UserName)
                    ? account.UserName
                    : request.UserName;

                account.Password = string.IsNullOrWhiteSpace(request.Password)
                    ? account.Password
                    : request.Password;

                account.UpdateAt = DateTime.Now;
                if(request.RoleId != 0)
                {
                    account.RoleId = request.RoleId;
                }

                await _repo.UpdateAccount(account);
                //Result:
                var res = _mapper.Map<AccountResponse>(account);
                return res;
            }catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

        }
        //Delete Account
        public async Task<bool> DeleteAccountAsync(short id)
        {
            try
            {
                var result = await _repo.DeleteAccount(id);
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in DeleteAccountAsync");
                return false;
            }
        }

        //End of CRUD Operations
        //Functions:
        public async Task<bool> SignInAsync(SignInRequest request)
        {
            try
            {
                var result = await _repo.SignInAsync(request.UserName, request.Password);

                if(result != null)
                {
                    await GenerateTokens(result);
                }
                else
                {
                    throw new Exception("Account does not exist");
                }

                    return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in SignInAsync");
                return false;
            }
        }

        private async Task GenerateTokens(Account user)
        {
            var httpContext = _httpContextAccessor.HttpContext ?? throw new Exception("HttpContext is null");

            var claims = new[]
            {
            new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
            new Claim(ClaimTypes.Role, user.Role.Name)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.SecretKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var accessTokenExpiry = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpiryMinutes);

            var token = new JwtSecurityToken(
                issuer: _jwtSettings.Issuer,
                audience: _jwtSettings.Audience,
                claims: claims,
                expires: accessTokenExpiry,
                signingCredentials: creds);

            var accessToken = new JwtSecurityTokenHandler().WriteToken(token);

            // generate refresh token
            RefreshToken refreshToken = new RefreshToken();
            var refreshTokenExpiry = DateTime.UtcNow.AddDays(7);
            string ipAddress = httpContext.Request.Headers["X-Forwarded-For"].FirstOrDefault()
                           ?? httpContext.Connection.RemoteIpAddress?.ToString();
            string deviceInfo = httpContext.Request.Headers["User-Agent"].ToString();

            refreshToken.AccountId = user.Id;
            refreshToken.RefreshToken1 = Guid.NewGuid().ToString("N");
            refreshToken.IsAvailable = true;
            refreshToken.IssuedAt = DateTime.UtcNow;
            refreshToken.ExpiredAt = refreshTokenExpiry;
            refreshToken.DeviceInfo = deviceInfo;
            refreshToken.Ipaddress = ipAddress;
            try
            {
                await _refreshTokenRepository.CreateAsync(refreshToken);

                // Set Cookie

                    httpContext.Response.Cookies.Append("AccessToken", accessToken, new CookieOptions
                    {
                        HttpOnly = true,
                        Secure = true,
                        SameSite = SameSiteMode.None,
                        Expires = accessTokenExpiry,
                    });

                    httpContext.Response.Cookies.Append("RefreshToken", refreshToken.RefreshToken1, new CookieOptions
                    {
                        HttpOnly = true,
                        Secure = true,
                        SameSite = SameSiteMode.None,
                        Expires = refreshTokenExpiry
                    });
                
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Generate RefreshTokenError");
            }
           
        }

        public async Task RefreshAccessToken(string refreshToken)
        {
            var httpContext = _httpContextAccessor.HttpContext
        ?? throw new Exception("HttpContext is null");

            // 1. Lấy refresh token từ DB
            var storedToken = await _refreshTokenRepository.GetByTokenAsync(refreshToken);

            if (storedToken == null || !storedToken.IsAvailable.Value)
                throw new Exception("Invalid refresh token");

            if (storedToken.ExpiredAt < DateTime.UtcNow)
                throw new Exception("Refresh token expired");

            // 2. Lấy thông tin user từ refresh token
            var user = await _repo.GetAccountById(storedToken.AccountId);
            if (user == null)
                throw new Exception("User not found");

            // 3. Sinh access token mới
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
                new Claim(ClaimTypes.Role, user.Role.Name)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.SecretKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var accessTokenExpiry = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpiryMinutes);

            var token = new JwtSecurityToken(
                issuer: _jwtSettings.Issuer,
                audience: _jwtSettings.Audience,
                claims: claims,
                expires: accessTokenExpiry,
                signingCredentials: creds);

            var newAccessToken = new JwtSecurityTokenHandler().WriteToken(token);

            // 4. (Tuỳ chọn) tạo refresh token mới để chống replay attack
            storedToken.RefreshToken1 = Guid.NewGuid().ToString("N");
            storedToken.IssuedAt = DateTime.UtcNow;

            await _refreshTokenRepository.UpdateAsync(storedToken);

            // 5. Lưu vào cookie
            httpContext.Response.Cookies.Append("AccessToken", newAccessToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = accessTokenExpiry
            });

            httpContext.Response.Cookies.Append("RefreshToken", storedToken.RefreshToken1, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = storedToken.ExpiredAt
            });
        }

    }
}
