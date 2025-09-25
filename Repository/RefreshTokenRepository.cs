using Microsoft.EntityFrameworkCore;
using Repository.DBContext;
using Repository.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository
{
    public class RefreshTokenRepository
    {
        private readonly GustoSystemContext _context;

        public RefreshTokenRepository(GustoSystemContext context)
        {
            _context = context;
        }

        //CRUD Operations:
        public async Task<RefreshToken> CreateAsync(RefreshToken token)
        {
            var res = await _context.AddAsync(token);
            await _context.SaveChangesAsync();
            return res.Entity;
        }

        public async Task<RefreshToken> GetByTokenAsync(string refreshToken)
        {
            return await _context.RefreshTokens
                .FirstOrDefaultAsync(t => t.RefreshToken1 == refreshToken);
        }

        public async Task UpdateAsync(RefreshToken token)
        {
            _context.Update(token);
            await _context.SaveChangesAsync();
        }
    }
}
