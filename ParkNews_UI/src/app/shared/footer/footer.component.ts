import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="park-footer">
      <div class="footer-top">
        <div class="container">
          <div class="footer-content">
            <div class="footer-section about-section">
              <h3>Về Park News</h3>
              <p>Park News là nền tảng tin tức hiện đại, cung cấp những thông tin mới nhất và đáng tin cậy nhất từ khắp nơi trên thế giới.</p>
              <div class="footer-logo">
                <h2>PARK NEWS</h2>
                <p>YOUR DAILY NEWS SOURCE</p>
              </div>
            </div>
            
            <div class="footer-section quick-links">
              <h3>Liên kết nhanh</h3>
              <ul class="footer-links">
                <li><a routerLink="/">Trang chủ</a></li>
                <li><a routerLink="/news">Tin tức</a></li>
                <li><a routerLink="/sports">Thể thao</a></li>
                <li><a routerLink="/business">Kinh tế</a></li>
                <li><a routerLink="/entertainment">Giải trí</a></li>
                <li><a routerLink="/contact">Liên hệ</a></li>
              </ul>
            </div>
            
            <div class="footer-section contact-section">
              <h3>Liên hệ</h3>
              <ul class="contact-info">
                <li>
                  <i class="fas fa-map-marker-alt"></i>
                  <span>123 Đường Tin Tức, Quận Báo Chí, Hà Nội</span>
                </li>
                <li>
                  <i class="fas fa-phone"></i>
                  <a href="tel:0968736913">0968 736 913</a>
                </li>
                <li>
                  <i class="fas fa-envelope"></i>
                  <a href="mailto:parknews@gmail.com">parknews&#64;gmail.com</a>
                </li>
              </ul>
            </div>
            
            <div class="footer-section subscribe-section">
              <h3>Đăng ký nhận tin</h3>
              <p>Nhận thông báo về tin tức mới nhất và các bài viết nổi bật.</p>
              <div class="subscribe-form">
                <input type="email" placeholder="Email của bạn">
                <button type="submit">Đăng ký</button>
              </div>
              <div class="social-links">
                <a href="#" class="social-link"><i class="fab fa-facebook-f"></i></a>
                <a href="#" class="social-link"><i class="fab fa-twitter"></i></a>
                <a href="#" class="social-link"><i class="fab fa-instagram"></i></a>
                <a href="#" class="social-link"><i class="fab fa-youtube"></i></a>
                <a href="#" class="social-link"><i class="fab fa-linkedin-in"></i></a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <div class="container">
          <div class="footer-bottom-content">
            <p>&copy; 2025 Park News. Tất cả quyền được bảo lưu.</p>
            <div class="footer-bottom-links">
              <a href="#">Điều khoản sử dụng</a>
              <span class="divider">|</span>
              <a href="#">Chính sách bảo mật</a>
              <span class="divider">|</span>
              <a href="#">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    /* General Styles */
    :host {
      display: block;
      width: 100%;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }
    
    /* Footer Top Styles */
    .park-footer {
      background-color: #222;
      color: #ccc;
      font-size: 14px;
      line-height: 1.6;
    }
    
    .footer-top {
      padding: 60px 0 40px;
      border-bottom: 1px solid #333;
    }
    
    .footer-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 40px;
    }
    
    .footer-section h3 {
      color: #fff;
      font-size: 18px;
      margin-bottom: 20px;
      position: relative;
      padding-bottom: 10px;
    }
    
    .footer-section h3::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 50px;
      height: 2px;
      background-color: #4CAF50;
    }
    
    /* About Section */
    .about-section p {
      margin-bottom: 20px;
    }
    
    .footer-logo {
      margin-top: 20px;
    }
    
    .footer-logo h2 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
      color: #fff;
    }
    
    .footer-logo p {
      margin: 0;
      font-size: 10px;
      color: #4CAF50;
      letter-spacing: 1px;
    }
    
    /* Quick Links */
    .footer-links {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    .footer-links li {
      margin-bottom: 10px;
    }
    
    .footer-links a {
      color: #ccc;
      text-decoration: none;
      transition: color 0.3s ease;
      display: inline-block;
      position: relative;
      padding-left: 15px;
    }
    
    .footer-links a::before {
      content: '›';
      position: absolute;
      left: 0;
      color: #4CAF50;
    }
    
    .footer-links a:hover {
      color: #4CAF50;
      transform: translateX(5px);
    }
    
    /* Contact Section */
    .contact-info {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    .contact-info li {
      display: flex;
      align-items: flex-start;
      margin-bottom: 15px;
    }
    
    .contact-info i {
      color: #4CAF50;
      margin-right: 10px;
      margin-top: 5px;
    }
    
    .contact-info a {
      color: #ccc;
      text-decoration: none;
      transition: color 0.3s ease;
    }
    
    .contact-info a:hover {
      color: #4CAF50;
    }
    
    /* Subscribe Section */
    .subscribe-form {
      display: flex;
      margin-bottom: 20px;
    }
    
    .subscribe-form input {
      flex: 1;
      padding: 12px 15px;
      border: none;
      border-radius: 4px 0 0 4px;
      background: #333;
      color: #fff;
      outline: none;
    }
    
    .subscribe-form button {
      background: #4CAF50;
      border: none;
      color: white;
      padding: 0 15px;
      border-radius: 0 4px 4px 0;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }
    
    .subscribe-form button:hover {
      background: #45a049;
    }
    
    .social-links {
      display: flex;
      gap: 10px;
      margin-top: 20px;
    }
    
    .social-link {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      background-color: #333;
      color: #fff;
      border-radius: 50%;
      text-decoration: none;
      transition: all 0.3s ease;
    }
    
    .social-link:hover {
      background-color: #4CAF50;
      transform: translateY(-3px);
    }
    
    /* Footer Bottom Styles */
    .footer-bottom {
      padding: 20px 0;
      background-color: #1a1a1a;
    }
    
    .footer-bottom-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .footer-bottom p {
      margin: 0;
    }
    
    .footer-bottom-links {
      display: flex;
      align-items: center;
    }
    
    .footer-bottom-links a {
      color: #ccc;
      text-decoration: none;
      transition: color 0.3s ease;
    }
    
    .footer-bottom-links a:hover {
      color: #4CAF50;
    }
    
    .divider {
      margin: 0 10px;
      color: #444;
    }
    
    /* Responsive Styles */
    @media (max-width: 992px) {
      .footer-content {
        gap: 30px;
      }
    }
    
    @media (max-width: 768px) {
      .footer-bottom-content {
        flex-direction: column;
        gap: 15px;
        text-align: center;
      }
      
      .footer-section h3::after {
        left: 50%;
        transform: translateX(-50%);
      }
      
      .footer-section {
        text-align: center;
      }
      
      .contact-info li {
        justify-content: center;
      }
      
      .social-links {
        justify-content: center;
      }
      
      .footer-links a::before {
        display: none;
      }
      
      .footer-links a {
        padding-left: 0;
      }
    }
    
    @media (max-width: 576px) {
      .footer-top {
        padding: 40px 0 20px;
      }
      
      .subscribe-form {
        flex-direction: column;
      }
      
      .subscribe-form input {
        border-radius: 4px;
        margin-bottom: 10px;
      }
      
      .subscribe-form button {
        border-radius: 4px;
        padding: 10px;
      }
    }
  `]
})
export class FooterComponent {} 