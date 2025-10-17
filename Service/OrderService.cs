using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Org.BouncyCastle.Cms;
using Repository;
using Repository.Models;
using Service.DTO.Request;
using Service.DTO.Response;
using Service.DTOs.Request;

namespace Service
{
    public class OrderService
    {
        private readonly OrderRepository repository;
        private readonly OrderDetailRepository detailRepository;
        private readonly BookingRepository bookingRepository;
        
        public OrderService(OrderRepository repository, BookingRepository bookingRepository, OrderDetailRepository detailRepository)
        {
            this.repository = repository;
            this.bookingRepository = bookingRepository;
            this.detailRepository = detailRepository;
        }
        public async Task<List<Order>> GetAllMyOrder(short dinnerId)
        {
            try
            {
                return await repository.GetAllMyOrder(dinnerId);
            }
            catch (Exception ex)
            {
            }
            return new List<Order>();
        }
        public async Task<List<OrderResponse>> GetAllOrdersAsync()
        {
            var orders = await repository.GetAllOrderAsync();
            return orders.Select(o => new OrderResponse
            {
                OrderId = o.OrderId,
                BookingId = o.BookingId,
                PromotionId = o.PromotionId,
                Date = o.Date,
                DiscountAmount = o.DiscountAmount,
                FinalPrice = o.FinalPrice,
                Note = o.Note,
                NumOfPeople = o.NumOfPeople,
                PickTime = o.PickTime,
                Status = o.Status,
                TableId = o.TableId,
                TotalPrice = o.TotalPrice,
                OrderDetails = o.OrderDetails.Select(od => new OrderDetailResponse
                {
                    OrderDetailId = od.OrderDetailId,
                    Img = od.Food.FoodUrl,
                    Food = od.Food.Name,
                    NumberOfFood = od.NumberOfFood,
                    FoodPrice = od.FoodPrice
                }).ToList()
            }).ToList();
        }
        public async Task<List<Order>> GetAllAsync()
        {
            try
            {
                return await repository.GetAllOrderAsync2();
            }
            catch (Exception ex)
            {
            }
            return new List<Order>();
        }
        public async Task<Order> GetMyOrderPending(short dinner, short resId)
        {
            try
            {
                return await repository.GetOrderPending(dinner, resId);
            }
            catch (Exception ex)
            {
            }
            return new Order();
        }
        public async Task<Order> GetMyOrderPending2(short dinner)
        {
            try
            {
                return await repository.GetOrderPending2(dinner);
            }
            catch (Exception ex)
            {
            }
            return new Order();
        }
        public async Task<OrderResponse> GetOrderPending(short dinner)
        {
            var o = await repository.GetOrderPending2(dinner);
            if (o == null || o.Booking.DinerId != dinner)
            {
                return null;
            }
            return new OrderResponse
            {
                OrderId = o.OrderId,
                BookingId = o.BookingId,
                PromotionId = o.PromotionId,
                Date = o.Date,
                DiscountAmount = o.DiscountAmount,
                FinalPrice = o.FinalPrice,
                Note = o.Note,
                NumOfPeople = o.NumOfPeople,
                PickTime = o.PickTime,
                Status = o.Status,
                TableId = o.TableId,
                TotalPrice = o.TotalPrice,
                OrderDetails = o.OrderDetails.Select(od => new OrderDetailResponse
                {
                    OrderDetailId = od.OrderDetailId,
                    Img = od.Food.FoodUrl,
                    Food = od.Food.Name,
                    NumberOfFood = od.NumberOfFood,
                    FoodPrice = od.FoodPrice
                }).ToList()
            };

        }
        public async Task<Order> GetOrderAsync(short id)
        {
            try
            {
                return await repository.GetOrderAsync(id);
            }
            catch (Exception ex)
            {
            }
            return new Order();
        }
        //--------------CUD------------
        public async Task<int> CreateAsync(Order order)
        {
            try
            {
                return await repository.CreateAsync(order);
            }
            catch (Exception ex)
            {
            }
            return 0;
        }
        public async Task<OrderResponse> AddOrderAsync(int bookingId)
        {
            var booking = await bookingRepository.GetBookingAsync(bookingId);
            var existingOrder = await repository.GetOrderPending2(booking.DinerId);
            if (existingOrder != null)
            {
                throw new InvalidOperationException("You already have a pending order");
            }

            var order = new Order
            {
                BookingId = bookingId,
                Date = DateTime.Now,
                PromotionId = null,
                DiscountAmount = 0,
                FinalPrice = 0,
                PickTime = null,
                NumOfPeople = 0,
                TotalPrice = 0,
                Note = null,
                TableId = null,
                Status = "Pending",
              
            };

            await repository.CreateAsync(order);

            return new OrderResponse
            {
                OrderId = order.OrderId,
                Date = order.Date,
                PromotionId = order.PromotionId,
                DiscountAmount = order.DiscountAmount,
                FinalPrice = order.FinalPrice,
                PickTime = order.PickTime,
                NumOfPeople = order.NumOfPeople,
                TotalPrice = order.TotalPrice,
                Note = order.Note,
                TableId = order.TableId,
                Status = order.Status,
                OrderDetails = new List<OrderDetailResponse>()
            };
        }
        public async Task UpdateOrderAsync(short orderId, UpdateBookingRequest request,short dinnerId)
        {
            if (request.StartTime.HasValue && request.EndTime.HasValue && request.StartTime > request.EndTime)
            {
                throw new ArgumentException("StartTime cannot be later than EndTime");
            }
            if (request.NumberOfPeople.HasValue && request.NumberOfPeople <= 0)
            {
                throw new ArgumentException("NumberOfPeople must be greater than 0");
            }
            var order = await repository.GetOrderAsync(orderId);
            if (order == null)
            {
                throw new KeyNotFoundException($"Order with ID {orderId} not found");
            }
            if (order.Booking.DinerId != dinnerId)
            {
                throw new UnauthorizedAccessException("You do not have permission to update this order");
            }
            order.Note = request.Note;
            order.NumOfPeople = request.NumberOfPeople;
            order.Booking.StartTime = request.StartTime;
            order.Booking.EndTime = request.EndTime;
            order.Booking.TableId = request.TableId == 0 ? null : request.TableId;
            order.PromotionId = request.PromotionId == 0 ? null : request.PromotionId;
            order.DiscountAmount = request.DiscountAmount;
            order.FinalPrice = order.TotalPrice + (order.DiscountAmount ?? 0) + 3000;

            if(order.Booking.DinerId == dinnerId)
            {
                await repository.UpdateAsync(order);
            }
        }
        public async Task UpdateOrderStatusBooked(short orderId)
        {
            var order = await repository.GetOrderPending2(orderId);
            if (order == null)
            {
                throw new KeyNotFoundException($"Order with ID {orderId} not found.");
            }
            order.Status = "Booked";
            
            await repository.UpdateAsync(order);
        }
        public async Task<int> UpdateAsync(short id, short dinnerId)
        {
            try
            {
                var order = await repository.GetOrderAsync(id);
                if (order != null && order.Booking.DinerId == dinnerId)
                {
                    return await repository.UpdateAsync(order);
                }
                return 0;
            }
            catch (Exception ex) { }
            return 0;
        }
        public async Task<bool> DeleteAsync(short id, short dinnerId)
        {
            try
            {
                var order = await repository.GetOrderAsync(id);
                if (order != null && order.Booking.DinerId == dinnerId)
                {
                    return await repository.DeleteAsync(id);
                }
                
            }
            catch(Exception ex)
            {

            }
            return false ;
        }
    }
}
