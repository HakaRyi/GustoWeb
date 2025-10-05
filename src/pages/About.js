import React, { useEffect, useRef } from "react";
import styles from "../styles/About.module.scss";
import member1 from "../assets/khang.jpg";
import member2 from "../assets/hau.jpg";
import member3 from "../assets/haidnag.jpg";
import member4 from "../assets/khang.jpg";
import member5 from "../assets/khang.jpg";
import member6 from "../assets/khang.jpg";
const About = () => {
  const sectionsRef = useRef([]);

  useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.fadeIn);
        } else {
          entry.target.classList.remove(styles.fadeIn); 
        }
      });
    },
    { threshold: 0.2 }
  );

  sectionsRef.current.forEach((section) => {
    if (section) observer.observe(section);
  });

  return () => {
    sectionsRef.current.forEach((section) => {
      if (section) observer.unobserve(section);
    });
  };
}, []);

  const members = [
    {
      name: "Hà Xuân Khang",
      role: "Quản lý dự án",
      img: member1,
    },
    {
      name: "Nguyễn Phạm Công Hậu",
      role: "Lập trình viên phát triển",
      img: member2,
    },
    {
      name: "Lê Hải Đăng",
      role: "Lập trình viên phát triển",
      img: member3 ,
    },
    {
      name: "Nguyễn Thị Hồng Vy",
      role: "Marketing",
      img: member4,
    },
    {
      name: "Lê Hoàng Tuyết Nhi",
      role: "Truyền thông",
      img: member5,
    },
    {
      name: "Thanh Đoàn",
      role: "Graphic Designer",
      img: member6,
    },
  ];

  return (
    <div className={styles.aboutPage_container}>
      <section
        className={`${styles.aboutPage_section} ${styles.aboutPage_intro}`}
        ref={(el) => (sectionsRef.current[0] = el)}
      >
        <div className={styles.aboutPage_content}>
          <h1>Về Chúng Tôi</h1>
          <p>
            GUSTO là dự án khởi nghiệp được phát triển bởi nhóm sinh viên trẻ
            đầy nhiệt huyết, với sứ mệnh mang đến nền tảng đặt món ăn hiện đại,
            tiện lợi và thông minh nhất. Chúng tôi tin rằng ẩm thực không chỉ là
            một nhu cầu, mà là trải nghiệm đáng được nâng niu và tối ưu hóa.
          </p>
        </div>
      </section>

      <section
        className={`${styles.aboutPage_section} ${styles.aboutPage_vision}`}
        ref={(el) => (sectionsRef.current[1] = el)}
      >
        <div className={styles.aboutPage_content}>
          <h2>Tầm Nhìn & Sứ Mệnh</h2>
          <p>
            Chúng tôi hướng đến việc trở thành nền tảng đặt món hàng đầu tại
            Việt Nam – nơi mọi khách hàng có thể dễ dàng đặt món trước, tiết
            kiệm thời gian và tận hưởng dịch vụ tốt nhất. Sứ mệnh của chúng tôi
            là kết nối giữa con người, công nghệ và trải nghiệm ẩm thực đẳng cấp.
          </p>
        </div>
      </section>
      <section
        className={`${styles.aboutPage_section} ${styles.aboutPage_scale}`}
        ref={(el) => (sectionsRef.current[2] = el)}
      >
        <div className={styles.aboutPage_content}>
          <h2>Quy Mô & Mục Tiêu</h2>
          <p>
            GUSTO hiện đang trong giai đoạn phát triển thử nghiệm nội bộ, với kế
            hoạch hợp tác cùng nhiều nhà hàng, quán cà phê tại các thành phố lớn
            như Hà Nội và TP. Hồ Chí Minh. Mục tiêu của chúng tôi là đạt 10.000+
            người dùng và 100+ đối tác ngay trong năm đầu tiên.
          </p>
        </div>
      </section>


      <section
        className={`${styles.aboutPage_section} ${styles.aboutPage_team}`}
        ref={(el) => (sectionsRef.current[3] = el)}
      >
        <div className={styles.aboutPage_content}>
          <h2>Đội Ngũ Phát Triển</h2>
          <p>
            Đội ngũ của chúng tôi gồm những con người trẻ trung, sáng tạo và
            chuyên nghiệp — cùng nhau hướng đến mục tiêu chung: xây dựng một sản
            phẩm thực sự khác biệt.
          </p>
          <div className={styles.teamGrid}>
            {members.map((m, i) => (
              <div key={i} className={styles.memberCard}>
                <img src={m.img} alt={m.name} className={styles.memberAvatar} />
                <h4>{m.name}</h4>
                <p>{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
