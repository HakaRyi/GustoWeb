using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;
using Repository.DBContext;
using Repository.Models;

namespace Repository
{
    public class OrderRepository
    {
        private readonly GustoSystemContext context;
        public OrderRepository(GustoSystemContext context)
        {
            this.context = context;
        }
        public async Task<List<Order>> GetAllOrderAsync()
        {
            return await context.Orders
                .Include(o=>o.OrderDetails)
                .Include(o=>o.Booking)
                .Include(o=>o.FoodReviews)
                .Include(o => o.Promotion)
                .Include(o=>o.Table)
                .ToListAsync();
        }
        public async Task<List<Order>> GetAllOrderAsync2()
        {
            return await context.Orders
                .Include(o => o.OrderDetails)

                .ToListAsync();
        }
        public async Task<Order> GetOrderPending(short dinnerId)
        {
            return await context.Orders
                .Include(o => o.OrderDetails).ThenInclude(o=>o.Tastes)
                .Include(o => o.OrderDetails).ThenInclude(o => o.Optionals)
                .FirstOrDefaultAsync(o => o.Booking.DinerId == dinnerId && o.Status == "Pending");
        }
        public async Task<List<Order>> GetAllMyOrder(short dinnerId)
        {
            return await context.Orders
                .Where(o=>o.Booking.DinerId==dinnerId  && o.Status != "Pending")
                .Include(o => o.OrderDetails)
                .ToListAsync();
        }
        public async Task<Order> GetOrderAsync(short id)
        {
            return await context.Orders
                .Include(o => o.OrderDetails)
                .Include(o => o.Booking)
                .Include(o => o.FoodReviews)
                .Include(o => o.Promotion)
                .Include(o => o.Table)
                .AsTracking()
                .FirstOrDefaultAsync(o=>o.OrderId==id);
        }
        public async Task<int> CreateAsync(Order order)
        {
            context.Orders.Add(order);
            return await context.SaveChangesAsync();
        }
        public async Task<int> UpdateAsync(Order order)
        {
            context.Orders.Update(order);
            return await context.SaveChangesAsync();
        }
        public async Task<bool> DeleteAsync(short id)
        {
            var order = await GetOrderAsync(id);
            if (order != null)
            {
                context.Orders.Remove(order);
                await context.SaveChangesAsync();
                return true;
            }
            return false;
                
        }
    }
}
