using AutoMapper;
using Google.Apis.Auth;
using Microsoft.AspNet.Identity;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Identity.Client;
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
using System.Numerics;
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
        private readonly DinerProfileRepository _dinerProfileRepository;
        private readonly RestaurantProfileRepository _restaurantProfileRepository;
        private readonly NotificationService _notificationService;

        private readonly IMapper _mapper;
        private readonly ILogger<AccountService> _logger;
        private readonly JwtSettings _jwtSettings;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IConfiguration configuration;

        public AccountService(AccountRepository repo, IMapper mapper, ILogger<AccountService> logger, JwtSettings jwtSettings, IHttpContextAccessor httpContextAccessor, RefreshTokenRepository refreshTokenRepository, RoleRepository roleRepository, DinerProfileRepository dinerProfileRepository, RestaurantProfileRepository restaurantProfileRepository, NotificationService notificationService, IConfiguration configuration)
        {
            _repo = repo;
            _mapper = mapper;
            _logger = logger;
            _jwtSettings = jwtSettings;
            _httpContextAccessor = httpContextAccessor;
            _refreshTokenRepository = refreshTokenRepository;
            _roleRepository = roleRepository;
            _dinerProfileRepository = dinerProfileRepository;
            _restaurantProfileRepository = restaurantProfileRepository;
            _notificationService = notificationService;

            this.configuration = configuration;
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
                account.Status = AccountStatus.ACTIVE.ToString();

                Role role = await _roleRepository.GetRoleById(request.RoleId);
                account.RoleId = request.RoleId;

                await _repo.CreateAccount(account);
                //Result:
                var res = _mapper.Map<AccountResponse>(account);

                //Profile for account
                Random random = new Random();
                int randomNumber = random.Next(1000, 10000); // Tạo số từ 1000 đến 9999

                DinerProfile dinerProfile = new DinerProfile();
                dinerProfile.AccountId = account.Id;
                dinerProfile.Email = request.Email;
                dinerProfile.FullName = request.UserName;
                
                await _dinerProfileRepository.AddAsync(dinerProfile);
                return res;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in CreateAccountAsync");
                throw;
            }
        }

        //CreateRes
        public async Task<AccountResponse> CreateAccountProfileAsync(SignUpRequest request)
        {
            try
            {
                var existedAccount = await _repo.GetAccountByUserName(request.UserName);
                if (existedAccount != null)
                {
                    throw new UsernameAlreadyExistsException();
                }
                //Init Account Model
                var account = new Account();
                account.UserName = request.UserName;

                var passwordHasher = new PasswordHasher<Account>();
                account.Password = passwordHasher.HashPassword(account, request.Password);
                account.CreateAt = DateTime.Now;
                account.Status = "active";

                Role role = await _roleRepository.GetRoleById(request.RoleId);
                account.RoleId = request.RoleId;

                await _repo.CreateAccount(account);
                //Result:
                var res = _mapper.Map<AccountResponse>(account);

                //Profile for account
                RestaurantProfile restaurant = new RestaurantProfile();
                restaurant.AccountId = account.Id;
                restaurant.Phone = null;

                restaurant.FullName = null;
                restaurant.TiktokUrl = null;
                restaurant.Description = null;
                restaurant.Email = null;
                restaurant.FacebookUrl = null;

                restaurant.OpenAt = null;
                restaurant.CloseAt = null;
                restaurant.Address = null;
                restaurant.AvatarUrl = null;
                await _restaurantProfileRepository.CreateAsync(restaurant);
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
                var existedAccount = await _repo.GetAccountById(id);
                if (existedAccount == null)
                {
                    throw new Exception("Account does not exist");
                }
                existedAccount.Status = AccountStatus.INACTIVE.ToString();
                await _repo.UpdateAccount(existedAccount);
                return true;
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
                if (result.RoleId != 1 && result != null)
                {
                    if (result.Password == request.Password)
                    {
                            
                       await GenerateTokens(result);
 
                    }
                    return true;
                }

                if (result != null)
                {
                    var passwordHasher = new PasswordHasher<Account>();

                    var verificationResult = passwordHasher.VerifyHashedPassword(result, result.Password, request.Password);

                    if (verificationResult == Microsoft.AspNetCore.Identity.PasswordVerificationResult.Success ||
                        verificationResult == Microsoft.AspNetCore.Identity.PasswordVerificationResult.SuccessRehashNeeded)
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
        public async Task<bool> GoogleLoginAsync(GoogleLoginRequestDto request)
        {
            try
            {
                var payload = await GoogleJsonWebSignature.ValidateAsync(request.IdToken); 
                if (payload == null || !payload.Audience.Equals(configuration["Google:ClientId"])) 
                { 
                    throw new InvalidCredentialsException("Invalid Google token"); 
                }
                string email = payload.Email; string name = payload.Name ?? email.Split('@')[0]; 
                _logger.LogInformation($"Google login for: {email}"); 
                var account = await _repo.GetAccountByEmail(email); 
                if (account == null) 
                { 
                    _logger.LogInformation($"Creating new account: {email}"); 
                    account = new Account 
                    { 
                        UserName = email, 
                        Password = "", RoleId = 1,
                        CreateAt = DateTime.Now, 
                        Status = AccountStatus.ACTIVE.ToString() 
                    }; 
                    await _repo.CreateAccount(account); 
                    var dinerProfile = new DinerProfile 
                    {
                        AccountId = account.Id,
                        Email = email, FullName = name,
                        AvatarUrl = payload.Picture 
                    }; 
                    await _dinerProfileRepository.AddAsync(dinerProfile); 
                } 
                else 
                {
                    _logger.LogInformation($"Existing account login: {email}");
                }
                // 5. GENERATE TOKENS
                if (account.Role == null)
                {
                    account = await _repo.GetAccountById(account.Id);
                }
                await GenerateTokens(account);
                
                _logger.LogInformation($"Google login SUCCESS: {email}"); 
                return true; 
            } 
            catch (Exception ex) 
            { 
                _logger.LogError(ex, "Google login FAILED"); 
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

        public async Task<bool> ChangPassword(ChangePasswordRequest request, short dinerId)
        {
            try
            {
                var account = await _repo.GetAccountById(dinerId);
                var passwordHasher = new PasswordHasher<Account>();
                var verificationResult = passwordHasher.VerifyHashedPassword(account, account.Password, request.currentPassword);

                if (verificationResult == Microsoft.AspNetCore.Identity.PasswordVerificationResult.Success ||
                    verificationResult == Microsoft.AspNetCore.Identity.PasswordVerificationResult.SuccessRehashNeeded)
                {
                    account.Password = passwordHasher.HashPassword(account, request.newPassword);
                    account.UpdateAt = DateTime.Now;
                    await _repo.UpdateAccount(account);
                    return true;
                }
                else
                {
                    throw new InvalidCredentialsException();
                }
                
            }
            catch (NotFoundException ex)
            {
                throw;
            }
            

        }

        public async Task<bool> ResetPassword(ResetPasswordRequest request)
        {
            try
            {
                var account = await _repo.GetAccountByUserName(request.Username);
                if(account != null)
                {
                    string newPassword = GenerateRandomPassword(8);
                    var passwordHasher = new PasswordHasher<Account>();
                    account.Password = passwordHasher.HashPassword(account, newPassword);
                    account.UpdateAt = DateTime.Now;
                    await _repo.UpdateAccount(account);

                    if(account.RoleId == 1)
                    {
                        var emailRequest = new SendEmailRequest
                        {
                            ReceiverName = account.UserName,
                            ReceiverMail = account.DinerProfile.Email,
                            Subject = "Gusto - Mật khẩu mới của bạn",
                            Messenger = $"Xin chào {account.UserName},\n\n" +
                                    $"Mật khẩu mới của bạn là: {newPassword}\n\n" +
                                    "Vui lòng đăng nhập và đổi lại mật khẩu ngay sau khi đăng nhập để bảo mật tài khoản.\n\n" +
                                    "Trân trọng,\nĐội ngũ Gusto"
                        };
                        await _notificationService.SendEmailAsync(emailRequest);
                    }else if(account.RoleId == 2)
                    {
                        var emailRequest = new SendEmailRequest
                        {
                            ReceiverName = account.UserName,
                            ReceiverMail = account.RestaurantProfile.Email,
                            Subject = "Gusto - Mật khẩu mới của bạn",
                            Messenger = $"Xin chào {account.UserName},\n\n" +
                                    $"Mật khẩu mới của bạn là: {newPassword}\n\n" +
                                    "Vui lòng đăng nhập và đổi lại mật khẩu ngay sau khi đăng nhập để bảo mật tài khoản.\n\n" +
                                    "Trân trọng,\nĐội ngũ Gusto"
                        };
                        await _notificationService.SendEmailAsync(emailRequest);
                    }



                    return true;
                }
                else
                {
                    throw new NotFoundException("Account not found");
                }  

            }
            catch (NotFoundException ex)
            {
                throw;
            }


        }
        private string GenerateRandomPassword(int length)
        {
            const string upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            const string lower = "abcdefghijklmnopqrstuvwxyz";
            const string digits = "0123456789";
            const string special = "!@#$%^&*()_+-=[]{}|;:,.<>?";

            var random = new Random();

            // Đảm bảo có đủ loại ký tự
            var passwordChars = new List<char>
            {
                upper[random.Next(upper.Length)],
                lower[random.Next(lower.Length)],
                digits[random.Next(digits.Length)],
                special[random.Next(special.Length)]
            };

            // Thêm ngẫu nhiên cho đủ độ dài
            string allChars = upper + lower + digits + special;
            for (int i = passwordChars.Count; i < length; i++)
            {
                passwordChars.Add(allChars[random.Next(allChars.Length)]);
            }

            // Trộn ngẫu nhiên
            return new string(passwordChars.OrderBy(x => random.Next()).ToArray());
        }
    }
    public enum AccountStatus { ACTIVE, INACTIVE }
}
