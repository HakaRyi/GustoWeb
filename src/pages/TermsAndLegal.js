import React from 'react';
import styles from '../styles/TermsPage.module.scss';

const TermsPage = () => {
  return (
    <div className={styles.terms_container}>
      <div className={styles.terms_header}>
        <h1>Điều khoản & Pháp lý của Gusto</h1>
        <p>Cập nhật lần cuối: 06/10/2025</p>
      </div>

      <div className={styles.terms_content}>
        <section>
          <h2>1. Giới thiệu</h2>
          <p>
            Chào mừng bạn đến với <strong>Gusto</strong> – nền tảng đánh giá và đặt trước món ăn trực tuyến.
            Việc bạn truy cập hoặc sử dụng dịch vụ của chúng tôi đồng nghĩa với việc bạn đã đọc, hiểu và đồng ý với các điều khoản và điều kiện được quy định dưới đây.
          </p>
        </section>

        <section>
          <h2>2. Phạm vi áp dụng</h2>
          <p>
            Các điều khoản này áp dụng cho toàn bộ người dùng truy cập vào nền tảng Gusto, bao gồm nhưng không giới hạn ở khách hàng, nhà hàng đối tác, đầu bếp và nhân viên quản lý hệ thống.
          </p>
        </section>

        <section>
          <h2>3. Tài khoản người dùng</h2>
          <p>
            Khi đăng ký tài khoản, bạn cam kết cung cấp thông tin chính xác, đầy đủ và được cập nhật thường xuyên. 
            Mọi hoạt động phát sinh dưới tài khoản của bạn đều do bạn chịu trách nhiệm. 
            Việc chia sẻ thông tin đăng nhập hoặc sử dụng tài khoản của người khác bị nghiêm cấm.
          </p>
        </section>

        <section>
          <h2>4. Quyền và nghĩa vụ của người dùng</h2>
          <ul>
            <li>Không sử dụng nền tảng để phát tán thông tin sai lệch, bôi nhọ, hoặc vi phạm pháp luật.</li>
            <li>Tôn trọng các đánh giá và phản hồi của người dùng khác.</li>
            <li>Không can thiệp vào hệ thống, gây rối hoặc phá hoại hoạt động của nền tảng Gusto.</li>
          </ul>
        </section>

        <section>
          <h2>5. Quyền và nghĩa vụ của Gusto</h2>
          <p>
            Gusto có quyền thay đổi, tạm ngưng hoặc ngừng cung cấp dịch vụ bất kỳ lúc nào vì lý do bảo trì, nâng cấp hoặc theo yêu cầu pháp luật.  
            Gusto cam kết bảo vệ dữ liệu cá nhân của người dùng theo quy định của pháp luật hiện hành.
          </p>
        </section>

        <section>
          <h2>6. Quy định về đánh giá và phản hồi</h2>
          <p>
            Người dùng có quyền đăng tải đánh giá, nhận xét về món ăn và dịch vụ. Tuy nhiên, nội dung đánh giá không được:
          </p>
          <ul>
            <li>Chứa ngôn từ thô tục, kích động, hoặc mang tính xúc phạm.</li>
            <li>Vi phạm bản quyền, quyền riêng tư hoặc quyền nhân thân của bên thứ ba.</li>
            <li>Chứa thông tin sai sự thật hoặc quảng cáo trá hình.</li>
          </ul>
        </section>

        <section>
          <h2>7. Đặt trước và thanh toán</h2>
          <p>
            Khi thực hiện đặt món ăn hoặc đặt bàn, người dùng có trách nhiệm kiểm tra thông tin trước khi xác nhận. 
            Gusto không chịu trách nhiệm cho các sai sót phát sinh do người dùng nhập sai dữ liệu.
            Mọi giao dịch thanh toán đều được bảo mật và tuân thủ tiêu chuẩn an toàn thanh toán điện tử.
          </p>
        </section>

        <section>
          <h2>8. Chính sách bảo mật</h2>
          <p>
            Gusto cam kết không chia sẻ thông tin cá nhân của người dùng cho bên thứ ba, trừ khi được sự đồng ý của bạn hoặc theo yêu cầu của cơ quan pháp luật.
          </p>
        </section>

        <section>
          <h2>9. Trách nhiệm pháp lý</h2>
          <p>
            Gusto không chịu trách nhiệm cho thiệt hại gián tiếp, đặc biệt hoặc hậu quả phát sinh từ việc sử dụng hoặc không thể sử dụng nền tảng.
            Tuy nhiên, chúng tôi sẽ nỗ lực tối đa để hỗ trợ và giải quyết các vấn đề một cách nhanh chóng, công bằng.
          </p>
        </section>

        <section>
          <h2>10. Thay đổi điều khoản</h2>
          <p>
            Gusto có quyền cập nhật hoặc sửa đổi các điều khoản này bất kỳ lúc nào. 
            Các thay đổi sẽ được công bố công khai trên website và có hiệu lực kể từ ngày đăng tải.
          </p>
        </section>

        <section>
          <h2>11. Liên hệ</h2>
          <p>
            Nếu bạn có bất kỳ câu hỏi hoặc khiếu nại nào liên quan đến Điều khoản & Pháp lý, vui lòng liên hệ qua email:
            <a href="mailto:support@gusto.vn"> support@gusto.vn</a>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsPage;
