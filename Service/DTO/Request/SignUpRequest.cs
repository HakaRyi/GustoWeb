using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.DTO.Request
{
    public class SignUpRequest
    {
        [Required(ErrorMessage = "Username is Require")]
        [Length(3, 50, ErrorMessage = "Username must be 3 - 50 characters")]
        public string UserName { get; set; }
        [Required(ErrorMessage = "Username is Require")]
        [Length(3, 50, ErrorMessage = "Username must be 3 - 50 characters")]
        [RegularExpression(@"^(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,}$",
        ErrorMessage = "Password must be at least 8 characters and contain at least one number and one special character")]
        public string Password { get; set; }
        [Required(ErrorMessage = "Username is Require")]
        [Compare("Password", ErrorMessage = "Confirm Password must match Password")]
        public string ConfirmPassword { get; set; }
        [Required(ErrorMessage = "Role is Require")]
        public int RoleId { get; set; }
        public string Phone { get; set; }
    }
}
