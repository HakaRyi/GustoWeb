using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Repository;
using Repository.Models;
using Service.DTO.Request;

namespace Service
{
    public class OrderDetailService
    {
        private readonly OrderDetailRepository _repository;
        private readonly OrderRepository _orderRepository;
        private readonly RestaurantMenuRepository _menuRepository;
        public OrderDetailService(OrderDetailRepository repository, OrderRepository orderRepository, RestaurantMenuRepository menuRepository)
        {
            _repository = repository;
            _orderRepository = orderRepository;
            _menuRepository = menuRepository;
        }
        public async Task<List<OrderDetail>> GetAllDetails()
        {
            try
            {
                return await _repository.GetAllOrderDetailAsync();
            }
            catch (Exception ex)
            {
            }
            return new List<OrderDetail>();
        }
        public async Task<OrderDetail> GetByIdAsync(short detailId)
        {
            try
            {
                return await _repository.GetOrderDetailAsync(detailId);
            }
            catch (Exception ex)
            {
            }
            return new OrderDetail();
        }
        public async Task<int> CreateAsync(OrderDetail detail)
        {
            try
            {
                return await _repository.CreateAsync(detail);
            }
            catch (Exception ex)
            {
            }
            return 0;
        }
        public async Task AddOrderDetailAsync(short orderId, int menuId)
        {
            var product = await _menuRepository.GetByIdAsync(menuId);
            var order = await _orderRepository.GetOrderAsync(orderId);
            if (order.Status != "Pending")
            {
                throw new InvalidOperationException("Cannot add order detail to an order that is not pending.");
            }
            var orderDetail = new OrderDetail
            {
                FoodId = short.Parse(menuId.ToString()),
                NumberOfFood = 1,
                FoodPrice = product.Price,
                OrderId = orderId
            };

            await _repository.CreateAsync(orderDetail);
            
        }

        public async Task UpdateOrderDetailQuantity(short detailId, UpdateQuantityRequest request)
        {
            var orderDetail = await _repository.GetOrderDetailAsync(detailId);
            if (orderDetail == null)
                throw new Exception("Order detail not found");
            var order = await _orderRepository.GetOrderAsync(orderDetail.OrderId);
            if (order == null)
                throw new Exception("Order not found");
            orderDetail.NumberOfFood = request.Quantity;
            await _repository.UpdateAsync(orderDetail);
            await _orderRepository.UpdateAsync(order);
        }

        public async Task<int> UpdateAsync(short detailId, short dinnerId)
        {
            try
            {
                var detail = await _repository.GetOrderDetailAsync(detailId);
                if(detail != null && detail.Order.Booking.DinerId == dinnerId)
                {
                    return await _repository.UpdateAsync(detail);
                }
                return 0;
            }
            catch (Exception ex)
            {
            }
            return 0;
        }
        public async Task<bool> DeleteAsync(short detailId, short dinnerId)
        {
            try
            {
                var detail = await _repository.GetOrderDetailAsync(detailId);
                if (detail != null && detail.Order.Booking.DinerId == dinnerId)
                {
                    return await _repository.DeleteAsync(detailId);
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
