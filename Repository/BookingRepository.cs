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
    public class BookingRepository
    {
        private readonly GustoSystemContext context;
        public BookingRepository(GustoSystemContext context)
        {
            this.context = context;
        }
        public async Task<List<Booking>> GetAllAsync()
        {
            return await context.Bookings
                .Include(b=>b.Restaurant)
                .Include(b=>b.Orders)
                .Include(b=>b.Diner)
                .Include(b => b.Table)
                .Include(b => b.Transaction)
                .ToListAsync();
        }
        public async Task<Booking> GetBookingAsync(int id)
        {
            return await context.Bookings
                .Include(b => b.Restaurant)
                .Include(b => b.Orders)
                .Include(b => b.Diner)
                .Include(b => b.Table)
                .Include(b => b.Transaction)
                .FirstOrDefaultAsync(b=>b.BookingId==id);
        }
        public async Task<Booking> GetBookingByMeAndResAsync(short dinerId, short resId)
        {
            return await context.Bookings
                .Include(b => b.Restaurant)
                .Include(b => b.Orders)
                .Include(b => b.Diner)
                .Include(b => b.Table)
                .Include(b => b.Transaction)
                .FirstOrDefaultAsync(b => b.DinerId == dinerId && b.RestaurantId == resId && b.Status == "Pending");
        }
        public async Task<List<Booking>> GetBookingsByTablesInRestaurant(short restaurantId, List<short> tableIds)
        {
            return await context.Bookings
                .Where(b => b.RestaurantId == restaurantId && tableIds.Contains(b.TableId.Value))
                .ToListAsync();
        }

        public async Task<List<Booking>> GetBookingsByDate(short restaurantId, DateTime date)
        {
            return await context.Bookings
                .Include(b => b.Restaurant)
                .Include(b => b.Orders)
                .Include(b => b.Diner)
                .Include(b => b.Table)
                .Include(b => b.Transaction)
                .Where(b => b.RestaurantId == restaurantId && b.StartTime.Value.Date == date.Date).ToListAsync();
        }
        public async Task<int> Create(Booking booking)
        {
            context.Bookings.Add(booking);
            return await context.SaveChangesAsync();
        }
        public async Task<Booking?> GetLatestBookingByDiner(short dinerId)
        {
            return await context.Bookings
                .Where(b => b.DinerId == dinerId)
                .OrderByDescending(b => b.BookingTime)
                .FirstOrDefaultAsync();
        }
        public async Task<Booking?> GetPendingBookingByDinerAndRestaurant(short dinerId, short restaurantId)
        {
            return await context.Bookings
                .Where(b => b.DinerId == dinerId && b.RestaurantId == restaurantId && b.Status == "Pending")
                .FirstOrDefaultAsync();
        }
        public async Task<int> Update(Booking booking)
        {
            context.Bookings.Update(booking);
            return await context.SaveChangesAsync();
        }
        public async Task<bool> Delete(short id)
        {
            var booking = await GetBookingAsync(id);
            if (booking !=null)
            {
                context.Bookings.Remove(booking);
                await context.SaveChangesAsync();
                return true;
            }
            return false;
        }

    }
}
