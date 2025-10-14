using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Repository.DBContext;
using Repository.Models;

namespace Repository
{
    public class OrderDetailRepository
    {
        private readonly GustoSystemContext context;
        public OrderDetailRepository(GustoSystemContext context)
        {
            this.context = context;
        }
        public async Task<List<OrderDetail>> GetAllOrderDetailAsync()
        {
            return await context.OrderDetails
                .Include(od => od.Food)
                .Include(od => od.Order)
                .ToListAsync();
        }
        public async Task<List<OrderDetail>> GetOrderDetailsByOrderIdAsync(short id)
        {
            return await context.OrderDetails
                .Where(od=>od.OrderId==id)
                .Include(od => od.Food)
                .Include(od => od.Order)
                .ToListAsync();
        }
        public async Task<OrderDetail> GetOrderDetailAsync(short id)
        {
            return await context.OrderDetails
                .Include(od => od.Food)
                .Include(od => od.Order)
                .FirstOrDefaultAsync(o => o.OrderDetailId == id);
        }
        public async Task<int> CreateAsync(OrderDetail order)
        {
            context.OrderDetails.Add(order);
            return await context.SaveChangesAsync();
        }
        public async Task<int> UpdateAsync(OrderDetail order)
        {
            context.OrderDetails.Update(order);
            return await context.SaveChangesAsync();
        }
        public async Task<bool> DeleteAsync(short id)
        {
            var order = await GetOrderDetailAsync(id);
            if (order != null)
            {
                context.OrderDetails.Remove(order);
                await context.SaveChangesAsync();
                return true;
            }
            return false;

        }
    }
}
