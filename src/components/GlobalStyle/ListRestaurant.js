import React, { useEffect, useState } from "react";
import CardRestaurant from "./CardRestaurant";
import styles from "../../styles/ListRestaurant.module.scss";

const ListRestaurant = ({ filters, search }) => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      // Mock data để demo
      let data = [
        {
          id: 1,
          name: "Cơm Tấm Sà Bì Chưởng",
          rating: 5,
          address: "133/11B Hòa Hưng, Q10, HCM",
          time: "7AM - 9PM",
          isOpen: true,
          isNew: true,
          image: "https://icolor.vn/wp-content/uploads/2021/06/sa-bi-chuong.jpg"
        },
        {
          id: 2,
          name: "Bún Đậu A Chảnh",
          rating: 5,
          address: "55 Nguyễn Tri Phương, Q5, HCM",
          time: "9AM - 10PM",
          isOpen: false,
          isNew: true,
          image: "https://hotel84.com/hotel84-images/news/img1/bun-dau-a-chanh.jpg"
        },
        {
          id: 3,
          name: "Phở Bắc Hà Nội",
          rating: 4,
          address: "123 Lê Lợi, Q1, HCM",
          time: "6AM - 11PM",
          isOpen: true,
          isNew: true,
          image: "https://cdn.tgdd.vn/Files/2021/01/08/1318796/tong-hop-5-quan-pho-bac-ngon-chuan-vi-ha-noi-o-sai-gon-202101081435309504.png"
        },
        {
          id: 4,
          name: "Bánh Xèo Miền Tây",
          rating: 3,
          address: "78 Nguyễn Huệ, Q1, HCM",
          time: "10AM - 8PM",
          isOpen: false,
          isNew: false,
          image: "https://file.hstatic.net/200000721249/file/banh_xeo_mien_tay__1__d8135c53e6a84a6dbbd80431a1d587fe.jpg"
        },
        {
          id: 5,
          name: "Lẩu Nấm Tự Nhiên",
          rating: 5,
          address: "45 Trần Phú, Q7, HCM",
          time: "11AM - 10PM",
          isOpen: true,
          isNew: true,
          image: "https://bizweb.dktcdn.net/100/527/060/files/lau-nam-thien-nhien-2.jpg?v=1730183241683"
        },
      ];

      // Áp dụng filter và search (logic đơn giản, có thể mở rộng)
      if (search) {
        data = data.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()));
      }
      if (filters.includes("New")) {
        data = data.filter((r) => r.isNew);
      }
      if (filters.includes("Opened")) {
        data = data.filter((r) => r.isOpen);
      }
      if (filters.includes("Closed")) {
        data = data.filter((r) => !r.isOpen);
      }
      // Thêm logic cho "Highest rated" và "Near your house" nếu cần

      setRestaurants(data);
    };
    fetchRestaurants();
  }, [filters, search]);

  return (
    <div className={styles.restList_container}>
      {restaurants.map((r) => (
        <CardRestaurant key={r.id} restaurant={r} />
      ))}
    </div>
  );
};

export default ListRestaurant;