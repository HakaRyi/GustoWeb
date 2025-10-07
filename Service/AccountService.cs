using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Repository;
using Repository.ModelExtensions;
using Repository.Models;
using Service.DTO.Request;
using Service.DTO.Request.AccountRequest;
using Service.DTO.Response;
using Service.Exceptions;
using Service.Settings;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Service
{
    public class AccountService
    {
        private readonly AccountRepository _repo;
        private readonly RefreshTokenRepository _refreshTokenRepository;
        private readonly RoleRepository _roleRepository;

        private readonly IMapper _mapper;
        private readonly ILogger<AccountService> _logger;
        private readonly JwtSettings _jwtSettings;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AccountService(AccountRepository repo, IMapper mapper, ILogger<AccountService> logger, JwtSettings jwtSettings, IHttpContextAccessor httpContextAccessor, RefreshTokenRepository refreshTokenRepository, RoleRepository roleRepository)
        {
            _repo = repo;
            _mapper = mapper;
            _logger = logger;
            _jwtSettings = jwtSettings;
            _httpContextAccessor = httpContextAccessor;
            _refreshTokenRepository = refreshTokenRepository;
            _roleRepository = roleRepository;
        }
        //CRUD Operations:
        //Create Account
        public async Task<AccountResponse> CreateAccountAsync(SignUpRequest request)
        {
            try
            {
                var existedAccount = await _repo.GetAccountByUserName(request.UserName);
                if(existedAccount != null)
                {
                    throw new UsernameAlreadyExistsException();
                }
                //Init Account Model
                var account = new Account();
                account.UserName = request.UserName;

                var passwordHasher = new PasswordHasher<Account>();
                account.Password = passwordHasher.HashPassword(account, request.Password);
                account.CreateAt = DateTime.Now;

                Role role = await _roleRepository.GetRoleById(request.RoleId);
                account.RoleId = request.RoleId;

                await _repo.CreateAccount(account);
                //Result:
                var res = _mapper.Map<AccountResponse>(account);
                return res;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in CreateAccountAsync");
                throw;
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
                var existedAccount = await _repo.GetAccountByUserName(request.UserName);
                if (existedAccount != null)
                {
                    throw new Exception("Username already exists");
                }
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

                var result = await _repo.GetAccountByUserName(request.UserName);


                if(result != null)
                {
                    var passwordHasher = new PasswordHasher<Account>();

                    var verificationResult = passwordHasher.VerifyHashedPassword(result, result.Password, request.Password);

                    if (verificationResult == PasswordVerificationResult.Success ||
                        verificationResult == PasswordVerificationResult.SuccessRehashNeeded)
                    {
                        await GenerateTokens(result);
                    }
                    else
                    {
                        throw new InvalidCredentialsException();
                    }
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
                throw;
            }
        }

        private async Task GenerateTokens(Account user)
        {
            var httpContext = _httpContextAccessor.HttpContext ?? throw new Exception("HttpContext is null");

            var claims = new[]
            {
            new Claim("AccountID", user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Role, user.Role.Name)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.SecretKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var accessTokenExpiry = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpiryInMinutes);

            var token = new JwtSecurityToken(
                issuer: _jwtSettings.Issuer,
                audience: _jwtSettings.Audience,
                claims: claims,
                expires: accessTokenExpiry,
                signingCredentials: creds);

            var accessToken = new JwtSecurityTokenHandler().WriteToken(token);

            httpContext.Response.Cookies.Append("AccessToken", accessToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = accessTokenExpiry,
            });


            _logger.LogInformation("Set-Cookie headers after append: {SetCookie}", httpContext.Response.Headers["Set-Cookie"].ToArray());

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
                new Claim("AccountID", user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Role, user.Role.Name)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.SecretKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var accessTokenExpiry = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpiryInMinutes);

            var token = new JwtSecurityToken(
                issuer: _jwtSettings.Issuer,
                audience: _jwtSettings.Audience,
                claims: claims,
                expires: accessTokenExpiry,
                signingCredentials: creds);

            var newAccessToken = new JwtSecurityTokenHandler().WriteToken(token);

            storedToken.RefreshToken1 = Guid.NewGuid().ToString("N");
            storedToken.IssuedAt = DateTime.UtcNow;

            await _refreshTokenRepository.UpdateAsync(storedToken);

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

        public async Task<bool> SignOutAsync()
        {
            try
            {
                var httpContext = _httpContextAccessor.HttpContext
                    ?? throw new Exception("HttpContext is null");

                // 1. Lấy refresh token từ cookie
                string refreshToken = httpContext.Request.Cookies["RefreshToken"];

                if (!string.IsNullOrEmpty(refreshToken))
                {
                    // thu hồi token trong DB (đánh dấu không còn khả dụng)
                    var stored = await _refreshTokenRepository.GetByTokenAsync(refreshToken);
                    if (stored != null)
                    {
                        stored.IsAvailable = false;
                        stored.ExpiredAt = DateTime.UtcNow;
                        await _refreshTokenRepository.UpdateAsync(stored);
                    }
                }
                // 2. Xóa cookie trên response
                var cookieOptions = new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    Expires = DateTime.UtcNow.AddDays(-1) // đặt ngày hết hạn trong quá khứ để xóa
                };

                httpContext.Response.Cookies.Delete("AccessToken", cookieOptions);
                httpContext.Response.Cookies.Delete("RefreshToken", cookieOptions);

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in SignOutAsync");
                return false;
            }
        }

        public async Task<List<Account>> SearchAccount(string username, int roleId, string profileName)
        {
            try
            {
                var accounts = await _repo.SearchAsync(username, roleId, profileName);
                return accounts;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in SearchAccount");
                return new List<Account>();
            }
        }

        public async Task<PaginationResult<List<Account>>> SearchAccountWithPaging(AccountSearchRequest searchRequest)
        {
            try
            {
                var result = await _repo.SearchWithPagingAsync(searchRequest.UserName, searchRequest.RoleId.Value, searchRequest.ProfileName, searchRequest.currentPage.Value, searchRequest.pageSize.Value);
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in SearchAccountWithPaging");
                return new PaginationResult<List<Account>>();
            }
        }

        public async Task<bool> isPhoneExistAsync(string phone)
        {
            try
            {
                return await _repo.isPhoneExist(phone);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in isPhoneExistAsync");
                return false;
            }
        }
    }
}
