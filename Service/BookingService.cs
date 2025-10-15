using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Org.BouncyCastle.Cms;
using Repository;
using Repository.Models;

namespace Service
{
    public class BookingService
    {
        private readonly BookingRepository repo;
        private readonly OrderService orderService;
        public BookingService(BookingRepository repo, OrderService orderService)
        {
            this.repo = repo;
            this.orderService = orderService;
        }
        public async Task<List<Booking>> GetBookings()
        {
            try
            {
                return await repo.GetAllAsync();
            }
            catch (Exception ex)
            {
            }
            return new List<Booking>();
        }
        public async Task<Booking> GetBooking(int id)
        {
            try
            {
                return await repo.GetBookingAsync(id);
            }
            catch (Exception ex)
            {
            }
            return new Booking();
        }
        public async Task<Booking> GetBookingByMeAndResAsync(short dinerId,short resId)
        {
            try
            {
                return await repo.GetBookingByMeAndResAsync(dinerId,resId);
            }
            catch (Exception ex)
            {
            }
            return new Booking();
        }
        public async Task<Booking?> GetPendingBookingByDinerAndRestaurant(short dinerId, short restaurantId)
        {
            try
            {
                return await repo.GetPendingBookingByDinerAndRestaurant(dinerId, restaurantId);
            }
            catch (Exception ex)
            {

            }
            return new Booking();
        }
        public async Task<Booking?> GetLatestBookingByDiner(short dinerId)
        {
            try
            {
                return await repo.GetLatestBookingByDiner(dinerId);
            }
            catch (Exception ex)
            {

            }
            return new Booking();
        }
        public async Task<int> Create(short dinerId, short restaurantId)
        {
            try
            {
                var existingBooking = await repo.GetPendingBookingByDinerAndRestaurant(dinerId, restaurantId);
                if (existingBooking != null)
                {
                    //neu da ton tai booking pending va nha hang do thi se ko tao moi
                    return -1;
                }
                var booking = new Booking()
                {
                    DinerId = dinerId,
                    BookingTime = DateTime.Now,
                    CreatedAt = DateTime.Now,
                    Status = "Pending",
                    RestaurantId = restaurantId, 
                };              
                var result = await repo.Create(booking); 
                if (result <= 0)
                {
                    return 0;
                }
                var newBooking = await repo.GetLatestBookingByDiner(dinerId);

                if (newBooking == null)
                    return 0;

                var order = new Order
                {
                    BookingId = newBooking.BookingId,
                    Date = DateTime.Now,
                    Status = "Pending",
                    TotalPrice = 0,
                    FinalPrice = 0,
                    DiscountAmount = 0
                };
                await orderService.CreateAsync(order);
                return 1;
            }
            catch (Exception ex)
            {
            }
            return 0;
        }
        public async Task<int> Update(short bookingId, short dinnerId)
        {
            try
            {
                var booking = await GetBooking(bookingId);

                if (booking.DinerId==dinnerId && booking !=null)
                {
                    booking.BookingTime = DateTime.Now;
                    return await repo.Update(booking);
                }
                return 0;

            }
            catch (Exception ex)
            {
            }
            return 0;
        }
        public async Task<bool> Delete(short bookingId, short dinnerId)
        {
            try
            {
                var booking = await GetBooking(bookingId);

                if (booking.DinerId == dinnerId && booking != null)
                {
                    return await repo.Delete(bookingId);
                }
                return false;

            }
            catch (Exception ex)
            {
            }
            return false;
        }

    }
}
