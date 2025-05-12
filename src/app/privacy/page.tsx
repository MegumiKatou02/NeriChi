'use client'

import React, { useState } from 'react'
import MainLayout from '../components/layout/MainLayout'

const enContent = {
  title: 'Privacy Policy',
  lastUpdated: 'Last updated:',
  sections: [
    {
      title: '1. Introduction',
      content: [
        'NeriChi ("we", "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, store, and protect your information when you use the NeriChi website and related services.',
        'By using our services, you agree to the collection and use of information in accordance with this policy. We will not use or share your information with anyone except as described in this Privacy Policy.',
      ],
    },
    {
      title: '2. Information We Collect',
      content: [
        '<strong>Personal Information:</strong> When you register for an account, we collect your name, email address, and password. If you choose to sign in with a Google account, we may also collect the name, email address, and profile image associated with that account.',
        '<strong>Usage Data:</strong> We collect information about how you interact with our website, including the pages you visit, time of access, songs you view and save.',
        '<strong>Device Data:</strong> We may collect information about the device you use to access our services, including device type, operating system, web browser, and IP address.',
      ],
    },
    {
      title: '3. How We Use Information',
      content: [
        'We use the information we collect to:',
        '<ul class="list-disc pl-5 mb-4 space-y-2"><li>Provide, maintain, and improve our services</li><li>Process and manage your account</li><li>Send technical notices, updates, and support messages</li><li>Ensure security and detect fraudulent activity</li><li>Understand how users interact with our services to improve experience</li><li>Provide personalized content based on your preferences</li></ul>',
      ],
    },
    {
      title: '4. Information Sharing',
      content: [
        'We do not sell, trade, or transfer your personal information to third parties. This does not include trusted third parties who assist us in operating our website, conducting our business, or serving you, as long as those parties agree to keep this information confidential.',
        "We may release your information when we believe release is necessary to comply with the law, enforce our site policies, or protect our or others' rights, property, or safety.",
      ],
    },
    {
      title: '5. Data Security',
      content: [
        'We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. Personal data you provide is stored on secure servers and can only be accessed by a limited number of persons who have special access rights.',
        'While we strive to protect your personal information, no method of transmission over the Internet or method of electronic storage is 100% secure. Therefore, we cannot guarantee absolute security.',
      ],
    },
    {
      title: '6. Cookies and Tracking Technologies',
      content: [
        'We use cookies and similar tracking technologies to track activity on our website and store certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier.',
        'You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our service.',
      ],
    },
    {
      title: '7. Your Rights and Choices',
      content: [
        'You can access, modify, or delete your personal information at any time by accessing your account. If you wish to delete your account entirely, please contact us through our contact page.',
        'You may also opt out of receiving emails from us by clicking the unsubscribe link in any email we send.',
      ],
    },
    {
      title: '8. Changes to This Policy',
      content: [
        'We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top of this page.',
        'You should review this page periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.',
      ],
    },
    {
      title: '9. Contact Us',
      content: [
        'If you have any questions about this Privacy Policy, please contact us:',
        '<ul class="list-disc pl-5 mb-4 space-y-2"><li>Email: support@nerichi.com</li><li>Through our contact page: <a href="/contact" class="text-primary hover:underline">Contact</a></li></ul>',
      ],
    },
  ],
}

const viContent = {
  title: 'Chính sách bảo mật',
  lastUpdated: 'Cập nhật lần cuối:',
  sections: [
    {
      title: '1. Giới thiệu',
      content: [
        'NeriChi ("chúng tôi", "của chúng tôi") cam kết bảo vệ quyền riêng tư của bạn. Chính sách bảo mật này giải thích cách chúng tôi thu thập, sử dụng, tiết lộ, lưu trữ và bảo vệ thông tin của bạn khi bạn sử dụng trang web NeriChi và các dịch vụ liên quan.',
        'Bằng cách sử dụng dịch vụ của chúng tôi, bạn đồng ý với việc thu thập và sử dụng thông tin theo chính sách này. Chúng tôi sẽ không sử dụng hoặc chia sẻ thông tin của bạn với bất kỳ ai ngoại trừ như được mô tả trong Chính sách bảo mật này.',
      ],
    },
    {
      title: '2. Thông tin chúng tôi thu thập',
      content: [
        '<strong>Thông tin cá nhân:</strong> Khi bạn đăng ký tài khoản, chúng tôi thu thập tên, địa chỉ email và mật khẩu của bạn. Nếu bạn chọn đăng nhập bằng tài khoản Google, chúng tôi cũng có thể thu thập tên, địa chỉ email và hình ảnh hồ sơ được liên kết với tài khoản đó.',
        '<strong>Dữ liệu sử dụng:</strong> Chúng tôi thu thập thông tin về cách bạn tương tác với trang web của chúng tôi, bao gồm các trang bạn truy cập, thời gian truy cập, bài hát bạn xem và lưu.',
        '<strong>Dữ liệu thiết bị:</strong> Chúng tôi có thể thu thập thông tin về thiết bị bạn sử dụng để truy cập dịch vụ của chúng tôi, bao gồm loại thiết bị, hệ điều hành, trình duyệt web và địa chỉ IP.',
      ],
    },
    {
      title: '3. Cách chúng tôi sử dụng thông tin',
      content: [
        'Chúng tôi sử dụng thông tin chúng tôi thu thập để:',
        '<ul class="list-disc pl-5 mb-4 space-y-2"><li>Cung cấp, duy trì và cải thiện dịch vụ của chúng tôi</li><li>Xử lý và quản lý tài khoản của bạn</li><li>Gửi thông báo kỹ thuật, cập nhật và tin nhắn hỗ trợ</li><li>Đảm bảo bảo mật và phát hiện hoạt động gian lận</li><li>Hiểu cách người dùng tương tác với dịch vụ của chúng tôi để cải thiện trải nghiệm</li><li>Cung cấp nội dung được cá nhân hóa dựa trên sở thích của bạn</li></ul>',
      ],
    },
    {
      title: '4. Chia sẻ thông tin',
      content: [
        'Chúng tôi không bán, trao đổi hoặc chuyển giao thông tin cá nhân của bạn cho bên thứ ba. Điều này không bao gồm các bên thứ ba đáng tin cậy giúp chúng tôi vận hành trang web, tiến hành hoạt động kinh doanh hoặc phục vụ bạn, miễn là các bên này đồng ý giữ bí mật thông tin này.',
        'Chúng tôi có thể tiết lộ thông tin của bạn khi chúng tôi tin rằng việc tiết lộ là cần thiết để tuân thủ luật pháp, thực thi chính sách của trang web hoặc bảo vệ quyền, tài sản hoặc an toàn của chúng tôi hoặc người khác.',
      ],
    },
    {
      title: '5. Bảo mật dữ liệu',
      content: [
        'Chúng tôi thực hiện các biện pháp bảo mật thích hợp để bảo vệ thông tin cá nhân của bạn khỏi truy cập, thay đổi, tiết lộ hoặc phá hủy trái phép. Dữ liệu cá nhân bạn cung cấp được lưu trữ trên các máy chủ bảo mật và chỉ có thể truy cập bởi số lượng giới hạn người có quyền truy cập đặc biệt.',
        'Mặc dù chúng tôi nỗ lực bảo vệ thông tin cá nhân của bạn, không có phương thức truyền tải nào qua Internet hoặc phương thức lưu trữ điện tử nào là an toàn 100%. Do đó, chúng tôi không thể đảm bảo bảo mật tuyệt đối.',
      ],
    },
    {
      title: '6. Cookie và công nghệ theo dõi',
      content: [
        'Chúng tôi sử dụng cookie và các công nghệ theo dõi tương tự để theo dõi hoạt động trên trang web của chúng tôi và lưu trữ một số thông tin nhất định. Cookie là các tệp có lượng dữ liệu nhỏ có thể bao gồm một mã định danh duy nhất ẩn danh.',
        'Bạn có thể yêu cầu trình duyệt của mình từ chối tất cả cookie hoặc thông báo khi cookie được gửi. Tuy nhiên, nếu bạn không chấp nhận cookie, bạn có thể không sử dụng được một số phần của dịch vụ của chúng tôi.',
      ],
    },
    {
      title: '7. Quyền và lựa chọn của bạn',
      content: [
        'Bạn có thể truy cập, sửa đổi hoặc xóa thông tin cá nhân của mình bất kỳ lúc nào bằng cách truy cập tài khoản của bạn. Nếu bạn muốn xóa tài khoản của mình hoàn toàn, vui lòng liên hệ với chúng tôi qua trang liên hệ.',
        'Bạn cũng có thể chọn không nhận email từ chúng tôi bằng cách nhấp vào liên kết hủy đăng ký trong bất kỳ email nào chúng tôi gửi.',
      ],
    },
    {
      title: '8. Thay đổi đối với chính sách này',
      content: [
        'Chúng tôi có thể cập nhật Chính sách bảo mật này của mình tùy từng thời điểm. Chúng tôi sẽ thông báo cho bạn về bất kỳ thay đổi nào bằng cách đăng chính sách mới trên trang này và cập nhật ngày "Cập nhật lần cuối" ở đầu trang.',
        'Bạn nên kiểm tra trang này định kỳ để biết về bất kỳ thay đổi nào. Những thay đổi đối với Chính sách bảo mật này có hiệu lực khi chúng được đăng trên trang này.',
      ],
    },
    {
      title: '9. Liên hệ với chúng tôi',
      content: [
        'Nếu bạn có bất kỳ câu hỏi nào về Chính sách bảo mật này, vui lòng liên hệ với chúng tôi:',
        '<ul class="list-disc pl-5 mb-4 space-y-2"><li>Email: support@nerichi.com</li><li>Qua trang liên hệ của chúng tôi: <a href="/contact" class="text-primary hover:underline">Liên hệ</a></li></ul>',
      ],
    },
  ],
}

export default function PrivacyPage() {
  const [language, setLanguage] = useState<'en' | 'vi'>('en')
  const content = language === 'en' ? enContent : viContent

  return (
    <MainLayout>
      <div className="py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">{content.title}</h1>
            <div className="flex space-x-2">
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded-md text-sm ${
                  language === 'en' ? 'bg-primary text-white' : 'bg-muted hover:bg-muted/80'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('vi')}
                className={`px-3 py-1 rounded-md text-sm ${
                  language === 'vi' ? 'bg-primary text-white' : 'bg-muted hover:bg-muted/80'
                }`}
              >
                Tiếng Việt
              </button>
            </div>
          </div>

          <div className="prose dark:prose-invert prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-a:text-primary max-w-none">
            <p className="text-lg mb-8">
              {content.lastUpdated}{' '}
              {new Date('2025-05-10').toLocaleDateString(language === 'en' ? 'en-US' : 'vi-VN')}
            </p>

            {content.sections.map((section, index) => (
              <section key={index} className="mb-10">
                <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
                {section.content.map((paragraph, pIndex) => (
                  <div
                    key={pIndex}
                    className={pIndex < section.content.length - 1 ? 'mb-4' : ''}
                    dangerouslySetInnerHTML={{ __html: paragraph }}
                  />
                ))}
              </section>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
