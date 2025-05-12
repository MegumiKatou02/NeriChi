'use client'

import React, { useState } from 'react'
import MainLayout from '../components/layout/MainLayout'

const enContent = {
  title: 'Terms of Use',
  lastUpdated: 'Last updated:',
  sections: [
    {
      title: '1. Acceptance of Terms',
      content: [
        'Welcome to NeriChi. These Terms of Use ("Terms") govern your access to and use of the NeriChi website, including any content, functionality, or services offered on or through the website.',
        'By accessing or using our service, you agree to be bound by these Terms. If you do not agree to any part of the Terms, you do not have permission to access the service.',
      ],
    },
    {
      title: '2. Changes to Terms',
      content: [
        'We may modify these Terms at our sole discretion, and you agree to be bound by the modified Terms. We will make reasonable efforts to notify you of any significant changes to the Terms.',
        'Your continued use of our service after we post modified Terms constitutes your acceptance of the modified Terms. You should check periodically for updates.',
      ],
    },
    {
      title: '3. User Accounts',
      content: [
        'To access some features of the website, you may need to create a user account. You must provide accurate, complete, and updated information, including a valid email address.',
        'You are entirely responsible for maintaining the security of your account and password and for all activities that occur under your account. You must notify us immediately of any security breach or unauthorized use of your account.',
        'We reserve the right to suspend or terminate your account, refuse any and all current or future use of the service if we believe you have violated any term of this agreement.',
      ],
    },
    {
      title: '4. Intellectual Property Rights',
      content: [
        'The service and its original content (excluding user-submitted content), features, and functionality are owned by NeriChi and are protected by copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws worldwide.',
        'Song lyrics and other content contributed by users may be protected by third-party copyrights. We respect the intellectual property rights of others and require our users to do the same.',
      ],
    },
    {
      title: '5. User Content',
      content: [
        'Our service allows you to post, store, share, and otherwise make available certain information, text, graphics, videos, or other material ("User Content"). You are responsible for the User Content that you post on or through the service, including its legality, reliability, and appropriateness.',
        "By posting or publishing User Content on or through the service, you represent and warrant that: (i) the User Content is owned by you and/or you have all rights, licenses, consents and releases necessary to use the User Content and grant the rights granted herein to us and other users, and (ii) the User Content and your or any third party's use of the User Content does not violate the copyright, trademark, trade secret, privacy, or other rights of any person.",
        'We have the right, but not the obligation, to monitor and edit User Content. We have the right, in our sole discretion, to remove or refuse to publish any User Content for any reason without notice.',
      ],
    },
    {
      title: '6. Prohibited Content',
      content: [
        'The following types of content are prohibited on our website:',
        '<ul class="list-disc pl-5 mb-4 space-y-2"><li>Content that infringes intellectual property rights</li><li>Defamatory, libelous, or offensive content</li><li>Pornographic, obscene, or indecent content</li><li>Fraudulent, false, or misleading content</li><li>Unauthorized advertising or marketing content</li><li>Illegal content or content that violates any law or regulation</li><li>Content that incites violence or discrimination</li><li>Content that harms minors in any way</li></ul>',
      ],
    },
    {
      title: '7. Links to Other Websites',
      content: [
        'Our service may contain links to third-party websites or services that are not owned or controlled by NeriChi.',
        'NeriChi has no control over and assumes no responsibility for the content, privacy policies, or practices of any third-party websites or services. You should review the terms and conditions as well as the privacy policies of the websites you visit.',
      ],
    },
    {
      title: '8. Disclaimer',
      content: [
        'Your use of the service is at your sole risk. The service is provided on an "AS IS" and "AS AVAILABLE" basis. NeriChi disclaims all warranties, whether express or implied, including but not limited to the implied warranties of merchantability, fitness for a particular purpose, title, and non-infringement.',
        'NeriChi does not warrant that (i) the service will meet your specific requirements, (ii) the service will be uninterrupted, timely, secure, or error-free, (iii) the results that may be obtained from the use of the service will be accurate or reliable, or (iv) the quality of any products, services, information, or other material purchased or obtained by you through the service will meet your expectations.',
      ],
    },
    {
      title: '9. Limitation of Liability',
      content: [
        'In no event shall NeriChi, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the service; (ii) any conduct or content of any third party on the service; (iii) any content obtained from the service; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage, and even if a remedy set forth herein is found to have failed of its essential purpose.',
      ],
    },
    {
      title: '10. Indemnification',
      content: [
        "You agree to defend, indemnify and hold harmless NeriChi and its subsidiaries, affiliates, officers, agents, co-branders, partners, and employees, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney's fees), arising from: (i) your use of and access to the service; (ii) your violation of any term of this Agreement; (iii) your violation of any third-party right, including without limitation any copyright, property, or privacy right; or (iv) any claim that your User Content caused damage to a third party.",
      ],
    },
    {
      title: '11. Governing Law',
      content: [
        'These Terms shall be governed and construed in accordance with the laws of Vietnam, without regard to its conflict of law provisions.',
      ],
    },
    {
      title: '12. Contact Us',
      content: [
        'If you have any questions about these Terms, please contact us:',
        '<ul class="list-disc pl-5 mb-4 space-y-2"><li>Email: support@nerichi.com</li><li>Through our contact page: <a href="/contact" class="text-primary hover:underline">Contact</a></li></ul>',
      ],
    },
  ],
}

const viContent = {
  title: 'Điều khoản sử dụng',
  lastUpdated: 'Cập nhật lần cuối:',
  sections: [
    {
      title: '1. Chấp nhận điều khoản',
      content: [
        'Chào mừng đến với NeriChi. Các Điều khoản sử dụng này ("Điều khoản") chi phối việc bạn truy cập và sử dụng trang web NeriChi, bao gồm bất kỳ nội dung, chức năng hoặc dịch vụ nào được cung cấp trên hoặc thông qua trang web.',
        'Bằng cách truy cập hoặc sử dụng dịch vụ của chúng tôi, bạn đồng ý bị ràng buộc bởi các Điều khoản này. Nếu bạn không đồng ý với bất kỳ phần nào của các Điều khoản, bạn không có quyền truy cập dịch vụ của chúng tôi.',
      ],
    },
    {
      title: '2. Thay đổi đối với điều khoản',
      content: [
        'Chúng tôi có thể sửa đổi các Điều khoản này theo quyết định riêng của mình và bạn đồng ý tuân theo các Điều khoản được sửa đổi. Chúng tôi sẽ nỗ lực hợp lý để thông báo cho bạn về bất kỳ thay đổi đáng kể nào đối với các Điều khoản.',
        'Việc bạn tiếp tục sử dụng dịch vụ của chúng tôi sau khi đăng các Điều khoản sửa đổi cấu thành việc bạn chấp nhận các Điều khoản sửa đổi. Bạn nên kiểm tra định kỳ để cập nhật về các thay đổi.',
      ],
    },
    {
      title: '3. Tài khoản người dùng',
      content: [
        'Để truy cập một số tính năng của trang web, bạn có thể cần tạo tài khoản người dùng. Bạn phải cung cấp thông tin chính xác, đầy đủ và cập nhật, bao gồm địa chỉ email hợp lệ.',
        'Bạn hoàn toàn chịu trách nhiệm về việc bảo mật tài khoản và mật khẩu của bạn và về tất cả các hoạt động xảy ra dưới tài khoản của bạn. Bạn phải thông báo ngay cho chúng tôi về bất kỳ vi phạm bảo mật hoặc sử dụng trái phép tài khoản của bạn.',
        'Chúng tôi có quyền tạm ngừng hoặc chấm dứt tài khoản của bạn, từ chối bất kỳ và tất cả việc sử dụng hiện tại hoặc tương lai của dịch vụ nếu chúng tôi tin rằng bạn đã vi phạm bất kỳ điều khoản nào của thỏa thuận này.',
      ],
    },
    {
      title: '4. Quyền sở hữu trí tuệ',
      content: [
        'Dịch vụ và nội dung ban đầu của nó (không bao gồm nội dung do người dùng gửi), các tính năng và chức năng đều thuộc sở hữu của NeriChi và được bảo vệ bởi luật bản quyền, thương hiệu, bằng sáng chế, bí mật thương mại và các luật sở hữu trí tuệ hoặc quyền sở hữu khác trên toàn thế giới.',
        'Lời bài hát và nội dung khác do người dùng đóng góp có thể được bảo vệ bởi bản quyền của bên thứ ba. Chúng tôi tôn trọng quyền sở hữu trí tuệ của người khác và yêu cầu người dùng của chúng tôi cũng làm như vậy.',
      ],
    },
    {
      title: '5. Nội dung người dùng',
      content: [
        'Dịch vụ của chúng tôi cho phép bạn đăng, lưu trữ, chia sẻ và cung cấp thông tin, văn bản, đồ họa, video hoặc các tài liệu khác ("Nội dung người dùng"). Bạn chịu trách nhiệm về Nội dung người dùng mà bạn đăng trên hoặc thông qua dịch vụ, bao gồm tính hợp pháp, độ tin cậy, và sự phù hợp của nó.',
        'Bằng cách đăng hoặc xuất bản Nội dung người dùng trên hoặc thông qua dịch vụ, bạn tuyên bố và đảm bảo rằng: (i) Nội dung người dùng thuộc sở hữu của bạn và/hoặc bạn có tất cả các quyền, giấy phép, chấp thuận và phát hành cần thiết để sử dụng Nội dung người dùng và cấp các quyền được cấp theo đây cho chúng tôi và những người dùng khác, và (ii) Nội dung người dùng và việc bạn hoặc bất kỳ bên thứ ba nào sử dụng Nội dung người dùng không vi phạm bản quyền, thương hiệu, bí mật thương mại, quyền riêng tư hoặc quyền khác của bất kỳ người nào.',
        'Chúng tôi có quyền, nhưng không có nghĩa vụ, giám sát và chỉnh sửa Nội dung người dùng. Chúng tôi có quyền, theo quyết định riêng của mình, xóa hoặc từ chối xuất bản bất kỳ Nội dung người dùng nào vì bất kỳ lý do gì mà không cần thông báo.',
      ],
    },
    {
      title: '6. Nội dung bị cấm',
      content: [
        'Những loại nội dung sau đây bị cấm trên trang web của chúng tôi:',
        '<ul class="list-disc pl-5 mb-4 space-y-2"><li>Nội dung vi phạm quyền sở hữu trí tuệ</li><li>Nội dung phỉ báng, bôi nhọ, hoặc xúc phạm</li><li>Nội dung khiêu dâm, tục tĩu, hoặc có tính chất khiêu dâm</li><li>Nội dung lừa đảo, sai sự thật, hoặc gây hiểu lầm</li><li>Nội dung quảng cáo hoặc tiếp thị trái phép</li><li>Nội dung phi pháp hoặc vi phạm bất kỳ luật hoặc quy định nào</li><li>Nội dung xúi giục bạo lực hoặc phân biệt đối xử</li><li>Nội dung gây hại cho trẻ vị thành niên dưới bất kỳ hình thức nào</li></ul>',
      ],
    },
    {
      title: '7. Liên kết đến trang web khác',
      content: [
        'Dịch vụ của chúng tôi có thể chứa các liên kết đến các trang web hoặc dịch vụ của bên thứ ba không thuộc sở hữu hoặc kiểm soát của NeriChi.',
        'NeriChi không kiểm soát và không chịu trách nhiệm về nội dung, chính sách bảo mật, hoặc thực tiễn của bất kỳ trang web hoặc dịch vụ nào của bên thứ ba. Bạn nên xem xét các điều khoản và điều kiện cũng như chính sách bảo mật của các trang web bạn truy cập.',
      ],
    },
    {
      title: '8. Miễn trừ trách nhiệm',
      content: [
        'Dịch vụ của bạn được cung cấp trên cơ sở "NGUYÊN TRẠNG" và "NHƯ CÓ SẴN". NeriChi từ chối tất cả các bảo đảm, dù rõ ràng hay ngụ ý, bao gồm nhưng không giới hạn ở các bảo đảm ngụ ý về khả năng bán được, sự phù hợp cho một mục đích cụ thể, quyền sở hữu và không vi phạm.',
        'NeriChi không đảm bảo rằng (i) dịch vụ sẽ đáp ứng các yêu cầu cụ thể của bạn, (ii) dịch vụ sẽ không bị gián đoạn, kịp thời, an toàn, hoặc không có lỗi, (iii) kết quả có thể thu được từ việc sử dụng dịch vụ sẽ chính xác hoặc đáng tin cậy, hoặc (iv) chất lượng của bất kỳ sản phẩm, dịch vụ, thông tin, hoặc tài liệu khác mua hoặc có được bởi bạn thông qua dịch vụ sẽ đáp ứng kỳ vọng của bạn.',
      ],
    },
    {
      title: '9. Giới hạn trách nhiệm',
      content: [
        'Trong mọi trường hợp, NeriChi, hay các giám đốc, nhân viên, đối tác, đại lý, nhà cung cấp, hoặc công ty liên kết của nó, sẽ không chịu trách nhiệm cho bất kỳ thiệt hại gián tiếp, ngẫu nhiên, đặc biệt, hậu quả hoặc thiệt hại trừng phạt, bao gồm nhưng không giới hạn ở, mất lợi nhuận, dữ liệu, sử dụng, uy tín, hoặc tổn thất vô hình khác, phát sinh từ (i) việc bạn truy cập hoặc sử dụng hoặc không thể truy cập hoặc sử dụng dịch vụ; (ii) bất kỳ hành vi hoặc nội dung nào của bên thứ ba trên dịch vụ; (iii) bất kỳ nội dung nào thu được từ dịch vụ; và (iv) truy cập trái phép, sử dụng hoặc thay đổi các giao dịch của bạn hoặc nội dung, cho dù dựa trên bảo hành, hợp đồng, vi phạm, hoặc bất kỳ lý thuyết pháp lý nào khác, cho dù chúng tôi đã được thông báo về khả năng thiệt hại hay không, và ngay cả khi một biện pháp khắc phục được quy định ở đây được phát hiện là không đạt được mục đích thiết yếu của nó.',
      ],
    },
    {
      title: '10. Bồi thường',
      content: [
        'Bạn đồng ý bảo vệ, bồi thường và giữ cho NeriChi và các công ty con, công ty liên kết, cán bộ, đại lý, đồng tác giả, đối tác và nhân viên của nó không bị tổn hại từ và chống lại bất kỳ và tất cả khiếu nại, thiệt hại, nghĩa vụ, tổn thất, trách nhiệm, chi phí hoặc nợ, và chi phí (bao gồm nhưng không giới hạn phí luật sư), phát sinh từ (i) việc bạn sử dụng và truy cập dịch vụ; (ii) vi phạm bất kỳ điều khoản nào của Thỏa thuận này; (iii) vi phạm bất kỳ quyền của bên thứ ba nào, bao gồm nhưng không giới hạn ở bất kỳ quyền bản quyền, quyền sở hữu hoặc quyền riêng tư; hoặc (iv) bất kỳ khiếu nại nào rằng Nội dung người dùng của bạn đã gây thiệt hại cho bên thứ ba.',
      ],
    },
    {
      title: '11. Luật áp dụng',
      content: [
        'Các Điều khoản này sẽ được điều chỉnh và giải thích theo luật của Việt Nam, mà không liên quan đến các quy tắc xung đột pháp luật của nó.',
      ],
    },
    {
      title: '12. Liên hệ',
      content: [
        'Nếu bạn có bất kỳ câu hỏi nào về những Điều khoản này, vui lòng liên hệ với chúng tôi:',
        '<ul class="list-disc pl-5 mb-4 space-y-2"><li>Email: support@nerichi.com</li><li>Qua trang liên hệ của chúng tôi: <a href="/contact" class="text-primary hover:underline">Liên hệ</a></li></ul>',
      ],
    },
  ],
}

export default function TermsPage() {
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
