using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Exceptions
{
    public class UsernameAlreadyExistsException : Exception
    {
        public UsernameAlreadyExistsException(string message = "Username already exists")
            : base(message) { }
    }

    // Sai thông tin đăng nhập
    public class InvalidCredentialsException : Exception
    {
        public InvalidCredentialsException(string message = "Invalid username or password")
            : base(message) { }
    }

    // Không tìm thấy resource
    public class NotFoundException : Exception
    {
        public NotFoundException(string message = "Resource not found")
            : base(message) { }
    }

    // Truy cập bị từ chối
    public class ForbiddenException : Exception
    {
        public ForbiddenException(string message = "Access forbidden")
            : base(message) { }
    }
}
