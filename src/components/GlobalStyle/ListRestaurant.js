import React, { useEffect, useState } from "react";
import CardRestaurant from "./CardRestaurant";

const ListRestaurant = ({ filter }) => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      // Ví dụ gọi API thật:
      // const res = await fetch(`/api/restaurants?filter=${filter}`);
      // const data = await res.json();

      // Mock data để demo
      const data = [
        {
          id: 1,
          name: "Cơm Tấm Sà Bì Chưởng",
          rating: 5,
          address: "133/11B Hòa Hưng, Q10, HCM",
          time: "7AM - 9PM",
          isOpen: true,
          isNew: true,
          image: "https://i.imgur.com/qjfsJYZ.jpeg"
        },
        {
          id: 2,
          name: "Bún Đậu A Chảnh",
          rating: 4,
          address: "55 Nguyễn Tri Phương, Q5, HCM",
          time: "9AM - 10PM",
          isOpen: false,
          isNew: false,
          image: "https://i.imgur.com/GpXShmR.jpeg"
        },
      ];

      setRestaurants(data);
    };
    fetchRestaurants();
  }, [filter]);

  return (
    <div className="restList_container">
      {restaurants.map((r) => (
        <CardRestaurant key={r.id} restaurant={r} />
      ))}
    </div>
  );
};

export default ListRestaurant;
