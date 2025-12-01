using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Org.BouncyCastle.Cms;
using Repository;
using Repository.Models;
using Service.DTO.Request;

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

        public async Task<List<Booking>> GetBookingsByRes(short id)
        {
            try
            {
                return await repo.GetAllByResAsync(id);
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
                return await repo.GetBookingByIdAsync(id);
            }
            catch (Exception ex)
            {
            }
            return new Booking();
        }
        public async Task<Booking> GetBookingByMeAndResAsync(short dinerId, short resId)
        {
            try
            {
                return await repo.GetBookingByMeAndResAsync(dinerId, resId);
            }
            catch (Exception ex)
            {
            }
            return new Booking();
        }

        public async Task<List<Booking>> GetBookingsByDate(short restaurantId, DateTime date)
        {
            try
            {
                return await repo.GetBookingsByDate(restaurantId, date);
            }
            catch (Exception ex)
            {

            }
            return new List<Booking>();
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

        public async Task<List<Booking>> GetUnDoneBookings(short restaurantId)
        {
            try
            {
                List<string> statuses = new() { "booked", "available" };
                return await repo.GetBookingsByStatus(statuses,restaurantId);
            }
            catch (Exception ex)
            {
                throw ex;
            }
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
                    Timestamp = DateTime.Now
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
        public async Task<int> Create2(CreateBookingRequest request)
        {
            try
            {
                var existingBooking = await repo.GetPendingBookingByDinerAndRestaurant(request.DinerId, request.RestaurantId);
                if (existingBooking != null)
                {
                    //neu da ton tai booking pending va nha hang do thi se ko tao moi
                    return -1;
                }
                var booking = new Booking()
                {
                    DinerId = request.DinerId,
                    BookingTime = DateTime.Now,
                    CreatedAt = DateTime.Now,
                    Status = "Pending",
                    RestaurantId = request.RestaurantId,
                    Timestamp = DateTime.Now
                };
                var result = await repo.Create(booking);
                if (result <= 0)
                {
                    return 0;
                }
                var newBooking = await repo.GetLatestBookingByDiner(request.DinerId);

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
                var booking = await repo.GetBookingAsync(bookingId);

                if (booking.DinerId == dinnerId && booking != null)
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

        public async Task<int> UpdateStatus(int bookingId, string status)
        {
            try
            {
                var booking = await repo.GetBookingAsync(bookingId);

                booking.Status = status.ToLower().ToString();
                return await repo.Update(booking);

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

        public async Task<List<Booking>> GetByTableInRestaurant(short restaurantId, List<short> tableId)
        {
            try
            {
                return await repo.GetBookingsByTablesInRestaurant(restaurantId, tableId);
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }

        //Admin
        public async Task<List<Booking>> GetAllBookingsForAdmin()
        {
            return await repo.GetAllForAdminAsync();
        }

        public async Task<bool> AdminCancelBooking(int bookingId)
        {
            var booking = await repo.GetBookingAsync(bookingId);
            if (booking == null) return false;

            booking.Status = "Cancelled"; 
            await repo.Update(booking);
            return true;
        }

        public async Task<bool> AdminUpdateBookingAsync(int bookingId, AdminUpdateBookingRequest request)
        {
            var booking = await repo.GetBookingAsync(bookingId);
            if (booking == null) return false;

            booking.BookingTime = request.BookingTime;
            booking.Status = request.Status;
            booking.TableId = request.TableId;

            await repo.Update(booking);
            return true;
        }
    }
}