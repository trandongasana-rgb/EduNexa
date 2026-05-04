/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, X, ChevronRight, CheckCircle2, PlayCircle, 
  BookOpen, Users, Star, Award, ArrowRight, XCircle, ArrowUp,
  MonitorPlay, Layout, Gamepad2, Briefcase, Quote, Search, Image as ImageIcon, Box,
  Plus, Edit, Trash2, Settings, FileText, Eye, EyeOff, LogOut, Lock, Shield, MessageCircle
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';

// --- MOCK DATA ---
const courses = [
  {
    id: 'bo-tai-lieu-quan-trong',
    title: 'Bộ Tài Liệu: 03 Ngày Làm Chủ AI Trong Dạy Học',
    subtitle: 'Tài liệu học quan trọng',
    description: 'Bộ tài liệu quan trọng nhất giúp Thầy Cô bắt đầu hành trình ứng dụng AI vào dạy học một cách bài bản, dễ hiểu và thực tiễn.',
    fullDescription: 'Chương trình đào tạo qua tài liệu chi tiết gồm 15 chương, tập trung vào 3 trụ cột cốt lõi: Làm nhanh việc bắt buộc (giáo án, đề thi), Làm tốt việc trên lớp (trò chơi, mô phỏng 3D), và Làm hay việc truyền đạt (video bài giảng).',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    target: 'Giáo viên mới bắt đầu',
    price: '199.000đ',
    originalPrice: '699.000đ',
    icon: <FileText className="w-6 h-6 text-[#D4AF37]" />,
    benefits: ['15 chương chi tiết - Quy trình rõ ràng', 'Hình ảnh minh họa trực quan', 'Tặng kèm kho câu lệnh mẫu (Prompt)', 'Video các buổi học được xem lại'],
    pains: ['Mất thời gian soạn giáo án, đề kiểm tra.', 'Chưa biết cách tạo game học tập.', 'Muốn làm video bài giảng nhưng ngại kỹ thuật.'],
    solutions: ['Làm chủ mô hình 3 trụ cột ứng dụng AI.', 'Soạn bài, ra đề nhanh gấp 5 lần.', 'Tự tay thiết kế học liệu số hiện đại.'],
    curriculum: [
      { mod: 'Trụ cột 1', title: 'Làm nhanh việc bắt buộc (Giáo án, SKKN, Đề thi)', icon: <CheckCircle2 className="w-6 h-6 text-[#D4AF37]" /> },
      { mod: 'Trụ cột 2', title: 'Làm tốt việc trên lớp (Trò chơi, Mô phỏng 3D)', icon: <Gamepad2 className="w-6 h-6 text-[#D4AF37]" /> },
      { mod: 'Trụ cột 3', title: 'Làm hay việc truyền đạt (Video bài giảng số)', icon: <MonitorPlay className="w-6 h-6 text-[#D4AF37]" /> },
    ],
    gifts: ['Toàn bộ "CÁC CÂU LỆNH QUAN TRỌNG" (Mới nhất)', 'Kèm Video Buổi Học', 'Học 01 buổi chuyên sâu/Tháng trong năm 2026 + Trợ Lý Năng Lực Số'],
    paymentInfo: 'Techcombank (TCB) - STK: 88.3558.3558 - Chủ TK: CONG TY TNHH MTV GIAO DUC EDUNEXA - Nội dung: hoten + sdt + TAI LIEU 3 NGAY',
    qrImage: 'https://lh3.googleusercontent.com/d/1X5l_t1W_p_h4y3_8_v-8_v-8_v-8_v-8=w800' // Placeholder for the uploaded QR code
  },
  {
    id: 'ai-soan-giang-ho-tro-day-hoc',
    title: 'AI Trong Soạn Giảng Và Hỗ Trợ Dạy Học',
    subtitle: 'Khóa học E-Learning thực chiến',
    description: 'Làm chủ AI để soạn giáo án, tạo đề kiểm tra, viết SKKN, thiết kế slide tự động và tạo trợ lý ảo chuyên sâu.',
    fullDescription: 'Khóa học đào toàn diện kỹ năng sử dụng AI trong nghiệp vụ sư phạm hàng ngày, giúp giáo viên giải phóng sức lao động và nâng cao chất lượng giảng dạy.',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80',
    target: 'Giáo viên mọi cấp học',
    price: '399.000đ',
    originalPrice: '1.500.000đ',
    icon: <MonitorPlay className="w-6 h-6 text-[#D4AF37]" />,
    benefits: ['Quy trình thực hành 11 bước chuẩn hóa', 'Học chuyên sâu 02 buổi/tháng trong năm 2026', 'Nhóm Zalo đồng hành hỗ trợ'],
    pains: ['Áp lực soạn giảng quá tải.', 'Chưa biết cách tinh chỉnh AI chuẩn xác.', 'Thiếu tư duy bối cảnh cho trợ lý ảo.'],
    solutions: [
      'Giúp giáo viên nắm nền tảng AI, dạy học hiệu quả và tiết kiệm thời gian.',
      'Soạn giáo án nhanh, nội dung phong phú, phù hợp nhiều đối tượng học sinh.',
      'Thiết kế bài kiểm tra, đề thi tự động.',
      'Viết SKKN hiệu quả.',
      'Tạo slide đẹp, chuyên nghiệp tự động, giảm công sức thiết kế.',
      'Có trợ lý AI hỗ trợ giảng dạy, trả lời và gợi ý nội dung mọi lúc.'
    ],
    curriculum: [
      { 
        mod: 'Module 1', 
        title: 'Nền tảng quan trọng về AI giáo dục', 
        desc: 'Nắm vững các khái niệm cốt lõi, tư duy bối cảnh và cách vận hành của AI trong môi trường sư phạm.',
        icon: <Layout className="w-6 h-6 text-[#D4AF37]" /> 
      },
      { 
        mod: 'Module 2', 
        title: 'Nghiệp vụ soạn giảng AI chuyên sâu', 
        desc: 'Soạn giáo án & đề thi tự động, vẽ hình học, ứng dụng NotebookLM, quy trình viết & kiểm tra đạo văn SKKN bằng AI.',
        icon: <FileText className="w-6 h-6 text-[#D4AF37]" /> 
      },
      { 
        mod: 'Module 3', 
        title: 'Làm slide bài giảng tự động', 
        desc: 'Sử dụng AI để thiết kế slide chuyên nghiệp, thẩm mỹ chỉ từ đề cương hoặc từ khóa trong vài phút.',
        icon: <MonitorPlay className="w-6 h-6 text-[#D4AF37]" /> 
      },
      { 
        mod: 'Module 4', 
        title: 'Thiết kế trợ lý ảo cá nhân hoá', 
        desc: 'Tự tay xây dựng trợ lý AI có kiến thức chuyên sâu về bộ môn bạn dạy để hỗ trợ giảng dạy 24/7.',
        icon: <Users className="w-6 h-6 text-[#D4AF37]" /> 
      },
    ],
    gifts: [
      '1. Siêu App Ứng Dụng STEM - VVIP',
      '2. Siêu App AI Chấm Bài - VVIP',
      '3. Siêu App Vẽ Hình Học Thông Minh - VVIP',
      '4. Siêu App Tạo Prompt Trò Chơi Học Tập - VVIP',
      '5. Siêu App Prompt Mô Phỏng 3D - VVIP'
    ],
    paymentInfo: 'Techcombank (TCB) - STK: 88.3558.3558 - Chủ TK: CONG TY TNHH MTV GIAO DUC EDUNEXA - Nội dung: hoten + sdt + AI SOAN GIANG'
  },
  {
    id: 'bo-07-tro-ly-master-ai-video',
    title: 'Bộ 07 Trợ Lý Master AI Video',
    subtitle: 'Chinh phục 07 phong cách Video AI',
    description: 'Công cụ tạo ra kịch bản cho 07 phong cách Video AI Minh Họa Bài Giảng đang Hot hiện nay.',
    fullDescription: 'Giải pháp tối ưu cho giáo viên muốn tạo video bài giảng chuyên nghiệp mà không cần biết dựng phim phức tạp. Bộ trợ lý giúp đồng nhất nhân vật và phong cách.',
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80',
    target: 'Chuyên gia giáo dục số',
    price: '399.000đ',
    originalPrice: '3.000.000đ',
    icon: <Award className="w-6 h-6 text-[#D4AF37]" />,
    benefits: ['Làm chủ 07 phong cách video đỉnh cao', 'Học đồng nhất nhân vật trong mọi cảnh', 'Video hướng dẫn chi tiết từng bước'],
    pains: [
      'Video AI nhìn giả, không cảm xúc.',
      'Kỹ năng dựng phim và xử lý hậu kỳ còn hạn chế.',
      'Mất quá nhiều thời gian tìm kiếm tư liệu và kịch bản.',
      'Rào cản ngôn ngữ (không giỏi Tiếng Anh) khi sử dụng công cụ AI quốc tế.',
      'Lúng túng khi muốn đồng bộ nhân vật xuyên suốt video.',
      'Muốn làm video bài giảng chuyên nghiệp nhưng ngại kỹ thuật phức tạp.'
    ],
    solutions: [
      'Sản xuất video bài giảng giàu cảm xúc, chạm đến trái tim học sinh.',
      'Tạo video tranh cổ lịch sử độc đáo, tái hiện không gian kiến thức xưa sinh động.',
      'Thiết kế video 3D Cinematic sống động, nâng tầm bài giảng thành phim điện ảnh.',
      'Làm chủ video hoạt hình 2D minh họa bài giảng cực kỳ thu hút học sinh nhỏ tuổi.',
      'Kỹ thuật video bảng phấn (Chalkboard) hiện đại, giữ nét truyền thống một cách sáng tạo.',
      'Sáng tạo video sách truyện minh họa (Storybook) kể chuyện bài giảng lôi cuốn.',
      'Thiết kế video đồ họa phẳng (Flat Illustration) chuyên nghiệp, tinh tế và rõ nét.',
      'Tạo video nghệ thuật tranh cát (Sand Art) độc đáo, gây ấn tượng mạnh mẽ thị giác.'
    ],
    curriculum: [
      { 
        mod: 'Dạng 1-2', 
        title: 'Hoạt hình Tranh cổ & 2D Giáo dục', 
        desc: 'Video hướng dẫn chi tiết cách tạo kịch bản và sản xuất video phong cách cổ truyền hoặc hoạt hình 2D minh họa bài giảng.',
        icon: <ImageIcon className="w-6 h-6 text-[#D4AF37]" /> 
      },
      { 
        mod: 'Dạng 3-4', 
        title: 'Bảng phấn & 3D Nhân hóa Cinematic', 
        desc: 'Video hướng dẫn kỹ thuật bảng phấn và công nghệ 3D Cinematic giúp bài giảng sống động như phim điện ảnh.',
        icon: <MonitorPlay className="w-6 h-6 text-[#D4AF37]" /> 
      },
      { 
        mod: 'Dạng 5-7', 
        title: 'Sách truyện, Đồ họa phẳng & Tranh cát', 
        desc: 'Video hướng dẫn trọn bộ phong cách sách truyện, infographic và nghệ thuật tranh cát đầy cảm xúc.',
        icon: <BookOpen className="w-6 h-6 text-[#D4AF37]" /> 
      },
    ],
    gifts: ['3 Trợ lý tạo Video VEO3 cao cấp', 'Kho kịch bản phim giáo dục mẫu', 'Học 02 buổi chuyên sâu/tháng trong năm 2026'],
    paymentInfo: 'Techcombank (TCB) - STK: 88.3558.3558 - Chủ TK: CONG TY TNHH MTV GIAO DUC EDUNEXA - Nội dung: hoten + sdt + BO 7 TRO LY VIDEO'
  },
  {
    id: 'ai-to-chuc-hoat-dong-hoc-tap',
    title: 'AI Trong Tổ Chức Hoạt Động Học Tập',
    subtitle: 'Tạo Trò Chơi + 3D + Thí Nghiệm Ảo',
    description: 'Biến mọi tiết học thành sân chơi sáng tạo với kho trò chơi tương tác và mô phỏng 3D sinh động, cùng mô phỏng Thí Nghiệm ảo hấp dẫn.',
    fullDescription: 'Khóa học tập trung vào việc tạo ra các hoạt động học tập hiện đại, giúp học sinh hứng thú hơn thông qua các ứng dụng web và mô phỏng thực tế ảo.',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
    target: 'Giáo viên đổi mới sáng tạo',
    price: '399.000đ',
    originalPrice: '1.500.000đ',
    icon: <Gamepad2 className="w-6 h-6 text-[#D4AF37]" />,
    benefits: ['Quy trình tạo game tương tác A-Z', 'Sở hữu 15 mô phỏng 3D chuyên biệt', 'Nhóm Zalo đồng hành 24/7'],
    pains: [
      'Học sinh lười phát biểu, thiếu tập trung vào bài giảng.',
      'Tiết học khô khan, nặng về lý thuyết suông.',
      'Cần các thí nghiệm ảo trực quan nhưng không biết cách tìm hoặc làm.',
      'Mất quá nhiều thời gian để chuẩn bị một trò chơi hay trên lớp.',
      'Áp lực đổi mới phương pháp dạy học nhưng thiếu công cụ hỗ trợ.',
      'Muốn ứng dụng công nghệ 3D vào giảng dạy nhưng ngại kỹ thuật khó.'
    ],
    solutions: [
      'Xây dựng kho thí nghiệm ảo sinh động ngay trên trình duyệt web.',
      'Làm chủ quy trình thiết kế trò chơi học tập tương tác.',
      'Biến các kiến thức trừu tượng thành mô phỏng 3D trực quan, dễ hiểu.',
      'Tự tay xây dựng Web App giáo dục riêng phục vụ bộ môn mình dạy.',
      'Nâng cao sự tương tác và hứng thú của học sinh lên gấp nhiều lần.'
    ],
    curriculum: [
      { 
        mod: 'Chuyên đề 1', 
        title: 'Quy trình tạo trò chơi học tập tương tác', 
        desc: 'Sử dụng AI để thiết kế các trò chơi giáo dục đa dạng cấp học, giúp học sinh vừa học vừa chơi cực kỳ hiệu quả.',
        icon: <Gamepad2 className="w-6 h-6 text-[#D4AF37]" /> 
      },
      { 
        mod: 'Chuyên đề 2', 
        title: 'Cách thiết kế mô phỏng 3D', 
        desc: 'Hướng dẫn tạo ra các vật thể và không gian 3D trực quan, giúp minh họa các khái niệm khó một cách dễ dàng.',
        icon: <Box className="w-6 h-6 text-[#D4AF37]" /> 
      },
      { 
        mod: 'Chuyên đề 3', 
        title: 'Xây dựng thí nghiệm ảo sinh động', 
        desc: 'Thay thế các thí nghiệm vật lý, hóa học, sinh học nguy hiểm hoặc tốn kém bằng mô phỏng ảo an toàn và hấp dẫn.',
        icon: <Star className="w-6 h-6 text-[#D4AF37]" /> 
      },
      { 
        mod: 'Chuyên đề 4', 
        title: 'Quy trình thiết kế Web App giáo dục', 
        desc: 'Tự xây dựng các ứng dụng web học tập riêng biệt cho lớp học mà không cần biết lập trình chuyên sâu.',
        icon: <Layout className="w-6 h-6 text-[#D4AF37]" /> 
      },
      { 
        mod: 'Chuyên đề 5', 
        title: 'Tạo trợ lý AI phục vụ giảng dạy', 
        desc: 'Thiết lập các trợ lý ảo thông minh chuyên biệt để giải đáp thắc mắc và hỗ trợ học sinh học tập chủ động.',
        icon: <Users className="w-6 h-6 text-[#D4AF37]" /> 
      }
    ],
    gifts: [
      '1. 1200 Trò Chơi Cho Các Cấp Học bằng AI và PowerPoint',
      '2. 38 APP Giáo Dục và 04 Trợ Lý Ảo chuyên biệt',
      '3. 15 Mô Phỏng 3D và Thí Nghiệm Áo sinh động',
      '4. Học 02 buổi chuyên sâu/tháng trong năm 2026'
    ],
    paymentInfo: 'Techcombank (TCB) - STK: 88.3558.3558 - Chủ TK: CONG TY TNHH MTV GIAO DUC EDUNEXA - Nội dung: hoten + sdt + AI TO CHUC HOAT DONG'
  },
  {
    id: 'bo-10-sieu-tro-ly-ai-toan-dien',
    title: 'Bộ 10 Siêu Trợ Lý AI Toàn Diện',
    subtitle: 'Năng suất đột phá cho Giáo viên',
    description: 'Trọn bộ 10 trợ lý chuyên biệt hỗ trợ mọi khâu từ soạn giảng, tạo đề kiểm tra, viết SKKN, tích hợp NLS vào giáo án cũ, tạo slide tự động, tạo trò chơi học tập, Mô phỏng 3D + Thí Nghiệm Ảo đến thiết kế học liệu số như tạo hình ảnh, video minh họa bài học.',
    fullDescription: 'Hệ sinh thái trợ lý AI được thiết kế riêng cho đặc thù giáo dục Việt Nam, giúp giáo viên tăng hiệu suất làm việc lên 500% và hiện đại hóa mọi khâu trong nghiệp vụ sư phạm.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
    target: 'Giáo viên thời đại số',
    price: '399.000đ',
    originalPrice: '3.000.000đ',
    icon: <Users className="w-6 h-6 text-[#D4AF37]" />,
    benefits: ['10 Siêu trợ lý AI sẵn sàng sử dụng', 'Hướng dẫn chi tiết cách khai thác', 'Cập nhật tính năng mới liên tục'],
    pains: [
      'Chưa biết cách "huấn luyện" AI để ra kết quả chính xác và có tính sư phạm.',
      'Câu lệnh AI rời rạc, dẫn đến kết quả không đồng nhất giữa giáo án và đề thi.',
      'Mất hàng giờ đồng hồ mỗi ngày chỉ để soạn slide và tìm kiếm hình ảnh minh họa.',
      'Gặp khó khăn khi muốn tích hợp Năng Lực Số (NLS) vào các giáo án cũ.',
      'Muốn tạo trò chơi học tập hoặc mô phỏng 3D nhưng không biết kỹ thuật lập trình.',
      'Bế tắc khi muốn tạo hình ảnh minh họa bài giảng đẹp và đúng ý bằng AI.',
      'Lúng túng trong việc sản xuất video bài giảng bằng AI: từ kịch bản đến hình ảnh cử động.',
      'Áp lực phải đổi mới phương pháp dạy bằng hình ảnh và video nhưng rào cản kỹ thuật quá lớn.',
      'Tốn quá nhiều công sức cho việc viết Sáng kiến kinh nghiệm (SKKN) mỗi năm.'
    ],
    solutions: [
      'Sở hữu trọn bộ 10 trợ lý AI chuyên biệt, làm chủ mọi khâu nghiệp vụ sư phạm.',
      'Tự động hóa 90% việc soạn thảo giáo án chi tiết và ra đề kiểm tra đa cấp độ.',
      'Nâng cấp giáo án cũ lên chuẩn Năng Lực Số nhanh chóng với quy trình chuẩn hóa.',
      'Tạo Slide bài giảng đẹp mắt và chuyên nghiệp hoàn toàn tự động từ đề cương.',
      'Thiết kế vô vàn trò chơi học tập tương tác và mô phỏng 3D sinh động chỉ với câu lệnh.',
      'Tự xây dựng các App giáo dục và Trợ lý ảo (GPTs) riêng biệt cho bộ môn mình dạy.',
      'Sản xuất hình ảnh minh họa và film giáo dục đỉnh cao mà không cần kỹ năng dựng phim chuyên nghiệp.',
      'Nâng tầm thương hiệu cá nhân và trở thành giáo viên tiên phong trong kỷ nguyên AI.'
    ],
    curriculum: [
      { 
        mod: 'Trợ lý 01-02', 
        title: 'Soạn Giáo Án Chi Tiết & Viết SKKN Chuyên Sâu', 
        desc: 'Lợi ích: Tự động hóa khâu soạn giảng và viết sáng kiến bài bản, giúp giáo viên tiết kiệm 80% thời gian chuẩn bị hồ sơ sổ sách.',
        icon: <FileText className="w-6 h-6 text-[#D4AF37]" /> 
      },
      { 
        mod: 'Trợ lý 03-04', 
        title: 'Tạo Đề Kiểm Tra Tự Động & Prompt Slide', 
        desc: 'Lợi ích: Có ngay bộ đề thi đa cấp độ và đề cương slide chuyên nghiệp chỉ trong vài phút, nâng cao hiệu suất làm việc vượt trội.',
        icon: <MonitorPlay className="w-6 h-6 text-[#D4AF37]" /> 
      },
      { 
        mod: 'Trợ lý 05-06', 
        title: 'Thiết Kế Trợ Lý GPTs & Prompt Trò Chơi Học Tập', 
        desc: 'Lợi ích: Xây dựng trợ lý ảo thông minh riêng biệt và kho trò chơi lôi cuốn, tạo sự bùng nổ tương tác trong lớp học.',
        icon: <Gamepad2 className="w-6 h-6 text-[#D4AF37]" /> 
      },
      { 
        mod: 'Trợ lý 07-08', 
        title: 'Prompt Mô Phỏng 3D/TN Ảo & App Giáo Dục', 
        desc: 'Lợi ích: Hiện đại hóa bài giảng với công nghệ 3D và thí nghiệm ảo trực quan, giúp học sinh dễ dàng tiếp thu các khái niệm trừu tượng.',
        icon: <Box className="w-6 h-6 text-[#D4AF37]" /> 
      },
      { 
        mod: 'Trợ lý 09-10', 
        title: 'Prompt Hình Ảnh Minh Họa & Film Giáo Dục', 
        desc: 'Lợi ích: Tự tay sản xuất học liệu hình ảnh và video bài giảng chất lượng cao, nâng tầm thương hiệu cá nhân và phong cách giảng dạy.',
        icon: <ImageIcon className="w-6 h-6 text-[#D4AF37]" /> 
      }
    ],
    gifts: [
      '1. Toàn bộ "Nhân Vật SGK Đi Đứng Nói" cao cấp', 
      '2. Chuyên đề: "1200 Trò Chơi Học Tập Tương Tác Với Học Sinh"', 
      '3. Học 02 buổi chuyên sâu/tháng trong suốt năm 2026'
    ],
    paymentInfo: 'Techcombank (TCB) - STK: 88.3558.3558 - Chủ TK: CONG TY TNHH MTV GIAO DUC EDUNEXA - Nội dung: hoten + sdt + 10 SIEU TRO LY'
  },
  {
    id: '03-cuon-cam-nang-toan-dien',
    title: '03 Cuốn Cẩm Nang Toàn Diện',
    subtitle: 'Làm chủ Video AI + Canva + Games',
    description: 'Bộ 03 cuốn ebook thực chiến hướng dẫn chi tiết cách tự tay làm video AI, thiết kế Canva và trò chơi tương tác.',
    fullDescription: 'Thư viện cẩm nang giáo dục điện tử cầm tay chỉ việc, được cập nhật liên tục giúp giáo viên trở thành chuyên gia thiết kế học liệu số hiện đại.',
    image: 'https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?auto=format&fit=crop&w=1200&q=80',
    target: 'Giáo viên tự học & đổi mới sáng tạo',
    price: '399.000đ',
    originalPrice: '999.000đ',
    icon: <BookOpen className="w-6 h-6 text-[#D4AF37]" />,
    benefits: ['Làm chủ 07 loại video AI giáo dục', 'Thiết kế học liệu Canva chuyên nghiệp', 'Xây dựng kho trò chơi học tập phong phú'],
    pains: [
      'Ngại xuất hiện trước ống kính nhưng vẫn muốn làm video bài giảng chất lượng.',
      'Tốn quá nhiều thời gian và công sức để thiết kế một slide bài giảng đẹp.',
      'Học liệu số nghèo nàn, không thu hút và khó gây hứng thú cho học sinh.',
      'Gặp rào cản lớn về kỹ thuật dựng phim và bản quyền hình ảnh/âm thanh.',
      'Muốn ứng dụng AI nhưng bị rối giữa quá nhiều công cụ, không biết bắt đầu từ đâu.',
      'Tài liệu tự học rời rạc, thiếu lộ trình bài bản và người đồng hành hỗ trợ.',
      'Mất hàng giờ tìm kiếm ý tưởng cho các hoạt động trò chơi trên lớp mỗi ngày.'
    ],
    solutions: [
      'Làm chủ 07 loại video AI giáo dục đỉnh cao.',
      'Thiết kế học liệu số Canva chuyên nghiệp.',
      'Xây dựng kho trò chơi học tập phong phú.',
      'Sở hữu quy trình thiết kế tinh gọn, tiết kiệm 80% thời gian chuẩn bị bài.',
      'Tự tin sáng tạo nội dung số mà không cần lo lắng về rào cản kỹ thuật khó.',
      'Nâng tầm phong cách giảng dạy và giá trị bản thân trong thời đại số.'
    ],
    curriculum: [
      { 
        mod: 'Ebook 1', 
        title: 'Chinh phục 07 loại Video AI Giáo Dục', 
        desc: 'Hướng dẫn làm chủ từ Video nhân vật nói, Video vẽ tranh nghệ thuật đến Video Anime bài giảng cực kỳ lôi cuốn.',
        icon: <MonitorPlay className="w-6 h-6 text-[#D4AF37]" /> 
      },
      { 
        mod: 'Ebook 2', 
        title: 'Thiết kế học liệu số Canva chuyên nghiệp', 
        desc: 'Làm chủ Canva giáo dục toàn tập để tạo slide, poster, và các học liệu số hiện đại một cách nhanh chóng.',
        icon: <Star className="w-6 h-6 text-[#D4AF37]" /> 
      },
      { 
        mod: 'Ebook 3', 
        title: 'Xây dựng trò chơi tương tác và kho tài nguyên', 
        desc: 'Kho 1200+ trò chơi tương tác và quy trình xây dựng các hoạt động khởi động, củng cố bài giảng hiệu quả.',
        icon: <Gamepad2 className="w-6 h-6 text-[#D4AF37]" /> 
      }
    ],
    gifts: [
      '1. Toàn bộ "Nhân Vật SGK Đi Đứng Nói" cao cấp phục vụ thiết kế', 
      '2. Chuyên đề: "1200 Trò Chơi Học Tập Tương Tác Với Học Sinh"', 
      '3. Trợ lý AI: "Tạo Video Nghệ Thuật Tranh Cát" độc quyền',
      '4. Top các Trợ Lý chuyên tạo kịch bản Video Veo3 chuyên sâu',
      '5. Top các trợ lý dùng trong Soạn Giảng và Dạy Học VVIP',
      '6. Đặc quyền học Chuyên Sâu 02 buổi/tháng trong suốt năm 2026'
    ],
    paymentInfo: 'Techcombank (TCB) - STK: 88.3558.3558 - Chủ TK: CONG TY TNHH MTV GIAO DUC EDUNEXA - Nội dung: hoten + sdt + 3 CUON CAM NANG'
  },
  {
    id: 'coaching-chuyen-biet',
    title: 'Chương Trình Coaching: Đồng Hành Chuyên Biệt',
    subtitle: '1-1, Nhóm hoặc Đội ngũ',
    description: 'Chương trình đào tạo cá nhân hóa theo sát nhu cầu thực tế của Thầy Cô hoặc đơn vị giáo dục.',
    fullDescription: 'Cung cấp các gói tư vấn và huấn luyện trực tiếp để giải quyết các vấn đề cụ thể về chuyển đổi số giáo dục và ứng dụng AI cho từng cá nhân hoặc tổ chức.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
    target: 'Cá nhân & Tổ chức giáo dục',
    price: 'Liên hệ',
    originalPrice: 'Tùy quy mô',
    icon: <Users className="w-6 h-6 text-[#D4AF37]" />,
    benefits: ['Cá nhân hóa 100% lộ trình', 'Giải quyết vấn đề ngay tại chỗ', 'Hỗ trợ kỹ thuật trọn đời'],
    pains: [
      'Học các khóa học đông người không theo kịp, cần sự kèm cặp riêng biệt.',
      'Muốn triển khai ứng dụng AI đồng bộ cho cả Tổ chuyên môn hoặc Nhà trường.',
      'Gặp khó khăn trong việc tích hợp công nghệ vào đặc thù riêng của môn học mình dạy.',
      'Cần một chuyên gia đồng hành, "cầm tay chỉ việc" cho đến khi thật sự thành thạo.',
      'Muốn xây dựng dấu ấn cá nhân hoặc thương hiệu giáo dục riêng biệt trên không gian số.',
      'Áp lực trước sự thay đổi chóng mặt của công nghệ, không biết bắt đầu từ đâu để hiệu quả.',
      'Thiếu một lộ trình phát triển năng lực số rõ ràng, bài bản cho bản thân hoặc đội ngũ.'
    ],
    solutions: [
      'Lộ trình coaching 1-1 hoặc theo nhóm được cá nhân hóa 100% theo nhu cầu thực tế.',
      'Chuyên gia trực tiếp tháo gỡ mọi nút thắt kỹ thuật và tư vấn chiến lược chuyên môn.',
      'Xây dựng hệ thống vận hành và kho học liệu AI độc bản cho cá nhân hoặc tổ chức.',
      'Nâng tầm vị thế, chuyển đổi số toàn diện và bền vững cho sự nghiệp giảng dạy.',
      'Chuyển giao toàn bộ quy trình và bí kíp ứng dụng AI tiên tiến nhất của EDUNEXA.',
      'Hỗ trợ kỹ thuật và đồng hành dài hạn, đảm bảo kết quả ứng dụng thực tế cao nhất.',
      'Tiết kiệm tối đa thời gian tự mày mò, đi thẳng đến thành công cùng người dẫn đường.'
    ],
    curriculum: [
      { mod: 'Gói 1', title: 'Coaching 1-1 Chuyên sâu', icon: <Star className="w-6 h-6 text-[#D4AF37]" /> },
      { mod: 'Gói 2', title: 'Coaching Đội nhóm/Tổ chuyên môn', icon: <Users className="w-6 h-6 text-[#D4AF37]" /> },
      { mod: 'Gói 3', title: 'Đào tạo Doanh nghiệp & Nhà trường', icon: <Briefcase className="w-6 h-6 text-[#D4AF37]" /> },
    ],
    gifts: [
      'Toàn bộ các học liệu độc quyền và tài nguyên số Premium của EDUNEXA'
    ],
    paymentInfo: 'Hotline: 094 456 2096'
  }
];

const testimonials = [
  {
    id: 1,
    name: 'Cô Nguyễn Thu Hà',
    role: 'Giáo viên Ngữ văn - THPT Chu Văn An',
    quote: 'Khóa học AI Toàn Diện đã thay đổi hoàn toàn cách tôi soạn bài. Trước đây mất 3 tiếng để chuẩn bị một giáo án chất lượng, nay chỉ còn 30 phút nhờ sự trợ giúp của AI.',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 2,
    name: 'Thầy Trần Minh Hoàng',
    role: 'Giảng viên - Đại học Sư phạm Hà Nội',
    quote: 'Nội dung tại EDUNEXA rất thực tế và có chiều sâu học thuật. Đây là nền tảng tốt nhất để các giảng viên tiếp cận với công nghệ giáo dục hiện đại một cách bài bản.',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 3,
    name: 'Cô Lê Thị Mai',
    role: 'Giáo viên Tiểu học - Vinschool',
    quote: 'Các trò chơi học tập tạo bằng AI khiến học sinh của tôi vô cùng hào hứng. Tiết học trở nên sôi nổi hơn bao giờ hết, và tôi cũng cảm thấy yêu nghề hơn khi có những trợ lý AI đắc lực.',
    avatar: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=150&q=80'
  }
];

export default function App() {
  const [coursesData, setCoursesData] = useState(courses);
  const [testimonialsData, setTestimonialsData] = useState(testimonials);
  const [currentPage, setCurrentPage] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // Simulated admin login state
  const [adminPassword, setAdminPassword] = useState('Dongbac2ty');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigateTo = (page: string) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
    setSelectedCourse(null);
  };

  return (
    <div className="min-h-screen font-sans text-[#111827] bg-[#F8F5EE] selection:bg-[#D4AF37] selection:text-white">
      {/* HEADER */}
      <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-lg py-2' : 'bg-white py-4 border-b border-gray-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <div 
              className="flex items-center cursor-pointer group"
              onClick={() => navigateTo('home')}
            >
              <span className="text-xl md:text-2xl lg:text-3xl font-black tracking-tight text-[#0F172A] font-display uppercase">
                EDUNEXA
              </span>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-8 items-center">
              <button onClick={() => navigateTo('home')} className={`text-sm font-bold transition-colors ${currentPage === 'home' ? 'text-[#D4AF37]' : 'text-gray-600 hover:text-[#0F172A]'}`}>Trang Chủ</button>
              <button onClick={() => navigateTo('courses')} className={`text-sm font-bold transition-colors ${currentPage === 'courses' ? 'text-[#D4AF37]' : 'text-gray-600 hover:text-[#0F172A]'}`}>Các khóa học</button>
              <a href="https://www.facebook.com/groups/24037123512640076" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-gray-600 hover:text-[#D4AF37] transition-colors">Cộng Đồng</a>
            </nav>

            {/* CTA Button Desktop */}
            <div className="hidden md:flex items-center">
              <button 
                onClick={() => document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-[#0F172A] hover:bg-[#111827] text-white px-6 py-2.5 rounded-md font-medium text-sm transition-all shadow-md hover:shadow-lg flex items-center gap-2"
              >
                Nhận Tư Vấn <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-600 hover:text-[#0F172A] focus:outline-none"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] md:hidden"
              />
              {/* Menu Panel */}
              <motion.div 
                initial={{ x: '100%', opacity: 0.5 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '100%', opacity: 0.5 }}
                transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.8 }}
                className="fixed top-0 right-0 bottom-0 w-[280px] bg-white z-[70] md:hidden shadow-2xl flex flex-col"
              >
                <div className="p-6 flex justify-between items-center border-b border-gray-100">
                  <div className="flex items-center">
                    <span className="text-xl font-black tracking-tight text-[#0F172A] font-display uppercase">
                      EDUNEXA
                    </span>
                  </div>
                  <button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <nav className="flex-grow py-8 px-6">
                  <ul className="space-y-6">
                    {[
                      { label: 'Trang Chủ', page: 'home' },
                      { label: 'Các khóa học', page: 'courses' },
                      { label: 'Cộng Đồng', url: 'https://www.facebook.com/groups/24037123512640076' },
                      { label: 'Các bài viết', page: null },
                    ].map((item, i) => (
                      <motion.li
                        key={item.label}
                        initial={{ opacity: 0, x: 15, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 10, scale: 0.95 }}
                        transition={{ 
                          duration: 0.4, 
                          delay: 0.1 + i * 0.08,
                          ease: [0.16, 1, 0.3, 1]
                        }}
                      >
                        {item.url ? (
                          <a 
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xl font-bold w-full text-left block text-[#0F172A] hover:text-[#D4AF37] transition-colors"
                          >
                            {item.label}
                          </a>
                        ) : (
                          <button 
                            onClick={() => item.page ? navigateTo(item.page) : setIsMobileMenuOpen(false)}
                            className={`text-xl font-bold w-full text-left transition-colors ${currentPage === item.page ? 'text-[#D4AF37]' : 'text-[#0F172A] hover:text-[#D4AF37]'}`}
                          >
                            {item.label}
                          </button>
                        )}
                      </motion.li>
                    ))}
                  </ul>
                </nav>

                <div className="p-6 border-t border-gray-100">
                  <button 
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full bg-[#0F172A] text-white py-4 rounded-md font-bold shadow-lg flex items-center justify-center gap-2 hover:bg-[#111827] transition-all"
                  >
                    Nhận Tư Vấn <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>

      {/* MAIN CONTENT AREA */}
      <main>
        <AnimatePresence mode="wait">
          {currentPage === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <HomeView navigateTo={navigateTo} onSelectCourse={setSelectedCourse} courses={coursesData} />
            </motion.div>
          )}
          {currentPage === 'courses' && (
            <motion.div
              key="courses"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <CoursesView navigateTo={navigateTo} onSelectCourse={setSelectedCourse} courses={coursesData} />
            </motion.div>
          )}
          {currentPage.startsWith('course-') && (
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <CourseLandingView 
                course={coursesData.find(c => `course-${c.id}` === currentPage)} 
                navigateTo={navigateTo}
              />
            </motion.div>
          )}
          {currentPage === 'admin' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <AdminView 
                courses={coursesData} 
                setCourses={setCoursesData} 
                isAdmin={isAdmin} 
                setIsAdmin={setIsAdmin} 
                navigateTo={navigateTo}
                adminPassword={adminPassword}
                setAdminPassword={setAdminPassword}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* COURSE DETAIL MODAL */}
      <AnimatePresence>
        {selectedCourse && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCourse(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl"
            >
              <button 
                onClick={() => setSelectedCourse(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors z-10"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/2 h-64 md:h-auto">
                  <img 
                    src={selectedCourse.image} 
                    alt={selectedCourse.title} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="w-full md:w-1/2 p-8 md:p-10">
                  <div className="inline-block px-3 py-1 rounded-full bg-[#F8F5EE] text-[#D4AF37] text-xs font-bold uppercase tracking-wider mb-4">
                    {selectedCourse.target}
                  </div>
                  <h2 className="text-3xl font-bold text-[#0F172A] mb-4 font-display leading-tight">
                    {selectedCourse.title}
                  </h2>
                  <p className="text-gray-600 mb-8 leading-relaxed">
                    {selectedCourse.fullDescription || selectedCourse.description}
                  </p>
                  
                  <div className="space-y-4 mb-10">
                    <h4 className="font-bold text-[#0F172A]">Lợi ích khóa học:</h4>
                    <ul className="space-y-2">
                      {(selectedCourse.benefits || []).map((benefit: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <CheckCircle2 className="w-4 h-4 text-[#D4AF37] mt-0.5 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4 pt-6 border-t border-gray-100">
                    <div className="text-2xl font-bold text-[#0F172A]">{selectedCourse.price}</div>
                    <button 
                      onClick={() => {
                        if (selectedCourse.id === 'ai-toan-dien') {
                          navigateTo('landing-ai-toan-dien');
                        } else {
                          document.getElementById('register-form')?.scrollIntoView({ behavior: 'smooth' });
                          setSelectedCourse(null);
                        }
                      }}
                      className="w-full sm:w-auto bg-[#D4AF37] hover:bg-[#B68A1F] text-white px-8 py-3 rounded-md font-bold transition-all shadow-lg"
                    >
                      Đăng Ký Ngay
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ScrollToTop />

      {/* FOOTER */}
      <footer id="footer" className="bg-[#0F172A] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex flex-col items-start mb-6">
              <div className="flex items-center mb-2">
                <span className="text-3xl font-black tracking-tight text-white block font-display uppercase">
                  EDUNEXA
                </span>
              </div>
              <p className="text-white text-sm tracking-wide font-bold">Empowering Minds. Bridging Futures.</p>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md mb-6">
              Hệ sinh thái đào tạo và giải pháp AI dành cho giáo viên, nhà trường và người làm giáo dục, hướng tới nâng cao năng lực nghề nghiệp và đồng hành cùng chuyển đổi số.
            </p>
            <div className="text-sm text-gray-400 space-y-3">
              <p className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#D4AF37]" />
                Hotline: <span className="text-white font-bold ml-1">094 456 2096</span>
              </p>
              <p className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#D4AF37]" />
                Facebook: <a href="https://www.facebook.com/tranvandong.vietnam" target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] hover:underline">fb.com/tranvandong.vietnam</a>
              </p>
              <p className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#D4AF37]" />
                TikTok: <a href="https://www.tiktok.com/@trn.ng_ai.trainer" target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] hover:underline">@trn.ng_ai.trainer</a>
              </p>
              <p className="flex items-center gap-2">
                <MonitorPlay className="w-4 h-4 text-[#D4AF37]" />
                Youtube: <a href="https://www.youtube.com/@AITrainer.Offical" target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] hover:underline">@AITrainer.Offical</a>
              </p>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-[#F8F5EE]">Khám Phá</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><button onClick={() => navigateTo('courses')} className="hover:text-[#D4AF37] transition-colors">Hệ Sinh Thái Khóa Học</button></li>
              <li><a href="https://www.facebook.com/groups/24037123512640076" target="_blank" rel="noopener noreferrer" className="hover:text-[#D4AF37] transition-colors">Cộng Đồng Facebook</a></li>
              <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Blog Chuyên Gia</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-[#F8F5EE]">Hỗ Trợ</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Hướng Dẫn Thanh Toán</a></li>
              <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Câu Hỏi Thường Gặp</a></li>
              <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Chính Sách Bảo Mật</a></li>
              <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Điều Khoản Dịch Vụ</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>&copy; 2026 EDUNEXA AI. Kiến tạo kỷ nguyên giáo dục mới.</p>
        </div>
      </footer>
    </div>
  );
}

// SCROLL TO TOP COMPONENT
function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-[90] p-4 bg-[#D4AF37] text-white rounded-full shadow-2xl hover:bg-[#B68A1F] transition-all group"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

// 1. HOME PAGE VIEW
function HomeView({ navigateTo, onSelectCourse, courses }: { navigateTo: (p: string) => void, onSelectCourse: (c: any) => void, courses: any[] }) {
  const [visibleCourses, setVisibleCourses] = useState(5);
  
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -150]);

  const handleLoadMore = () => {
    setVisibleCourses(prev => Math.min(prev + 3, courses.length));
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-[#0F172A] overflow-hidden pt-24 pb-32 lg:pt-40 lg:pb-48">
        {/* Premium Background Gradient */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#0F172A] via-[#111827] to-[#0F172A]"></div>
          <div className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full bg-[#D4AF37]/5 blur-[120px]"></div>
          <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-blue-900/10 blur-[100px]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="w-full lg:w-3/5 text-left"
            >
              {/* Subtle Badge */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-3 mb-8 text-[#D4AF37]/80 text-xs font-bold uppercase tracking-[0.3em] bg-white/5 px-6 py-2 rounded-full border border-white/10"
              >
                Premium EdTech Academy
              </motion.div>
  
              {/* Main Title */}
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-tight mb-8 font-display tracking-tight uppercase">
                EDUNEXA
              </h1>
  
              {/* Slogan & Introduction */}
              <div className="mb-10">
                <p className="text-[#D4AF37] text-xl md:text-2xl font-bold leading-tight mb-6 font-display">
                  Hệ sinh thái giáo dục dành cho Thầy Cô trong kỷ nguyên AI
                </p>
                <p className="text-white text-base md:text-lg leading-relaxed max-w-2xl font-light">
                  EDUNEXA AI giúp Thầy Cô phát triển năng lực toàn diện thông qua tri thức, kỹ năng sống và ứng dụng công nghệ AI. 
                  Chúng tôi đồng hành xây dựng hệ sinh thái học tập hiện đại, giúp nâng cao hiệu quả dạy và học trong bối cảnh mới.
                </p>
              </div>
  
              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-5">
                <button 
                  onClick={() => navigateTo('courses')}
                  className="bg-[#D4AF37] hover:bg-[#B68A1F] text-white px-10 py-4 rounded-sm font-bold text-sm uppercase tracking-widest transition-all shadow-[0_20px_50px_rgba(212,175,55,0.2)] hover:translate-y-[-4px]"
                >
                  Khám Phá Khóa Học
                </button>
                <button 
                  onClick={() => document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-transparent hover:bg-white text-white hover:text-[#0F172A] border border-white/20 px-10 py-4 rounded-sm font-bold text-sm uppercase tracking-widest transition-all"
                >
                  Nhận Tư Vấn Miễn Phí
                </button>
              </div>
            </motion.div>

            {/* Right Side Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 30 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="w-full lg:w-2/5 relative"
            >
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl group aspect-square lg:aspect-[4/5]">
                <img 
                  src="https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?auto=format&fit=crop&w=1200&q=80" 
                  alt="Vietnamese AI Education" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/40 to-transparent pointer-events-none"></div>
              </div>
              
              {/* Decorative Glow */}
              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#D4AF37]/10 blur-[120px] rounded-full"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-[#0F172A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            {[
              { number: '10,000+', label: 'Giáo viên tham gia' },
              { number: '15+', label: 'Chuyên đề đào tạo' },
              { number: '98%', label: 'Tỷ lệ hài lòng' },
              { number: '10K+', label: 'Tài nguyên chia sẻ' }
            ].map((stat, idx) => (
              <div key={idx}>
                <div className="text-4xl md:text-5xl font-bold text-[#D4AF37] mb-2 font-display">{stat.number}</div>
                <div className="text-sm md:text-base text-gray-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About EDUNEXA Section */}
      <section id="about" className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Simplified Large Header */}
          <div className="max-w-4xl mx-auto text-center mb-28">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative inline-block"
            >
              <h2 className="text-6xl md:text-9xl font-black text-[#0F172A] font-display uppercase tracking-tighter leading-none relative z-10">
                VỀ <span className="text-[#D4AF37]">CHÚNG TÔI</span>
              </h2>
              <div className="absolute -bottom-4 left-0 w-full h-8 bg-[#D4AF37]/10 -rotate-1"></div>
            </motion.div>
          </div>

          {/* Ecosystem, Mission, Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#F8F5EE] p-10 rounded-2xl border-t-4 border-[#D4AF37] flex flex-col h-full"
            >
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6">
                <Layout className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-4 font-display">HỆ SINH THÁI GIÁO DỤC</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                EDUNEXA là doanh nghiệp giáo dục định hướng xây dựng hệ sinh thái học tập hiện đại. EDUNEXA tập trung vào phát triển năng lực toàn diện cho giáo viên và người học thông qua tri thức, kỹ năng sống và ứng dụng công nghệ, đặc biệt là AI trong dạy học. <br /><br />
                EDUNEXA không chỉ cung cấp đào tạo mà còn phát triển các mô hình học tập, học liệu số và giải pháp giáo dục giúp nâng cao hiệu quả dạy và học trong bối cảnh mới.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-[#0F172A] p-10 rounded-2xl text-white shadow-xl flex flex-col h-full"
            >
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6">
                <Star className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <h3 className="text-xl font-bold mb-4 font-display">SỨ MỆNH</h3>
              <p className="text-gray-300 leading-relaxed text-sm">
                EDUNEXA giúp giáo viên và người học làm chủ công nghệ, đổi mới tư duy và phát triển năng lực phù hợp với tương lai. 
                Doanh nghiệp tập trung xây dựng các giải pháp giáo dục thực tiễn, dễ áp dụng và tạo ra giá trị bền vững.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white p-10 rounded-2xl shadow-md border border-gray-100 flex flex-col h-full"
            >
              <div className="w-12 h-12 bg-[#F8F5EE] rounded-xl flex items-center justify-center mb-6">
                <CheckCircle2 className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-4 font-display">GIÁ TRỊ CỐT LÕI</h3>
              <ul className="space-y-4">
                {[
                  "Lấy người học làm trung tâm",
                  "Học để phát triển năng lực thực",
                  "Ứng dụng công nghệ để nâng cao hiệu quả",
                  "Xây dựng hệ sinh thái giáo dục bền vững"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                    <CheckCircle2 className="w-5 h-5 text-[#D4AF37] mt-0.5 flex-shrink-0" />
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Founder Section - Text Only Focus */}
          <div className="bg-[#0F172A] rounded-[3rem] overflow-hidden shadow-2xl relative">
            {/* Artistic background blur elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[120px] -mr-64 -mt-64"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] -ml-48 -mb-48"></div>

            <div className="relative z-10 p-10 md:p-20 flex flex-col items-center text-center">
              <div className="mb-12 max-w-3xl">
                <div className="inline-block px-6 py-2 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-black uppercase tracking-[0.3em] mb-8 border border-[#D4AF37]/20">
                  NGƯỜI SÁNG LẬP
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-white mb-10 font-display tracking-tight uppercase leading-tight">
                  THẦY <span className="text-[#D4AF37]">TRẦN ĐÔNG</span>
                </h2>
                <div className="space-y-8">
                  <p className="text-gray-300 text-xl md:text-2xl leading-relaxed font-light">
                    Tên đầy đủ: <span className="text-white font-bold">Trần Văn Đông</span>. 
                  </p>
                  <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
                    Thầy là nhà đào tạo, chuyên nghiên cứu và triển khai ứng dụng AI trong giáo dục. Thầy tập trung đào tạo giáo viên, phát triển học liệu số và xây dựng các mô hình dạy học hiện đại.
                  </p>
                  <div className="w-16 h-1 bg-[#D4AF37] mx-auto opacity-30"></div>
                  <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
                    EDUNEXA được thầy sáng lập với mục tiêu tạo ra một hệ sinh thái giáo dục giúp giáo viên và người học thích nghi nhanh với sự thay đổi của thời đại.
                  </p>
                </div>
              </div>

              {/* Social Channels - Centered Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-5xl">
                <a 
                  href="https://www.facebook.com/tranvandong.vietnam" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-center gap-4 bg-white/5 hover:bg-white/10 text-white px-8 py-6 rounded-2xl transition-all border border-white/10 group backdrop-blur-sm"
                >
                  <Users className="w-7 h-7 text-[#D4AF37] group-hover:scale-110 transition-transform" />
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] text-[#D4AF37] uppercase font-black tracking-widest">Facebook</span>
                    <span className="text-sm font-bold">Trần Đông</span>
                  </div>
                </a>
                <div 
                  className="flex items-center justify-center gap-4 bg-white/5 text-white px-8 py-6 rounded-2xl border border-white/10 backdrop-blur-sm"
                >
                  <MessageCircle className="w-7 h-7 text-[#D4AF37]" />
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] text-[#D4AF37] uppercase font-black tracking-widest">Hotline / Zalo</span>
                    <span className="text-sm font-bold">094 456 2096</span>
                  </div>
                </div>
                <a 
                  href="https://www.tiktok.com/@trn.ng_ai.trainer" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-center gap-4 bg-white/5 hover:bg-white/10 text-white px-8 py-6 rounded-2xl transition-all border border-white/10 group backdrop-blur-sm"
                >
                  <PlayCircle className="w-7 h-7 text-[#D4AF37] group-hover:scale-110 transition-transform" />
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] text-[#D4AF37] uppercase font-black tracking-widest">TikTok</span>
                    <span className="text-sm font-bold">@trn.ng_ai.trainer</span>
                  </div>
                </a>
                <a 
                  href="https://www.youtube.com/@AITrainer.Offical" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-center gap-4 bg-white/5 hover:bg-white/10 text-white px-8 py-6 rounded-2xl transition-all border border-white/10 group backdrop-blur-sm"
                >
                  <MonitorPlay className="w-7 h-7 text-[#D4AF37] group-hover:scale-110 transition-transform" />
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] text-[#D4AF37] uppercase font-black tracking-widest">Youtube</span>
                    <span className="text-sm font-bold">@AITrainer.Offical</span>
                  </div>
                </a>
              </div>
              
              <div className="mt-16 p-8 bg-white/5 rounded-3xl border border-white/10 max-w-4xl w-full">
                <p className="text-[#D4AF37] font-medium italic text-xl md:text-2xl leading-relaxed">
                  "EDUNEXA đồng hành cùng Thầy Cô trong hành trình đổi mới giáo dục và làm chủ công nghệ trong dạy học."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Preview Section */}
      <section ref={sectionRef} className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-4 font-display">Hệ Sinh Thái Khóa Học</h2>
              <p className="text-gray-600 max-w-2xl">Phát triển từng bước, chắc chắn và bền vững với các chương trình từ nền tảng đến chuyên sâu.</p>
            </div>
            <button 
              onClick={() => navigateTo('courses')}
              className="hidden md:flex items-center text-[#0F172A] font-semibold hover:text-[#D4AF37] transition-colors"
            >
              Xem tất cả <ChevronRight className="w-5 h-5 ml-1" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.slice(0, visibleCourses).map((course, index) => {
              // Apply different parallax speeds to each column
              const y = index % 3 === 0 ? y1 : index % 3 === 1 ? y2 : y3;
              return (
                <motion.div key={course.id} style={{ y }}>
                  <CourseCard course={course} navigateTo={navigateTo} onSelectCourse={onSelectCourse} />
                </motion.div>
              );
            })}
          </div>
          
          {visibleCourses < courses.length && (
            <div className="mt-16 text-center">
              <button 
                onClick={handleLoadMore}
                className="inline-flex items-center px-8 py-3 border-2 border-[#0F172A] text-[#0F172A] font-bold rounded-md hover:bg-[#0F172A] hover:text-white transition-all group"
              >
                Xem thêm khóa học 
                <motion.span
                  animate={{ y: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="ml-2"
                >
                  <ChevronRight className="w-5 h-5 rotate-90" />
                </motion.span>
              </button>
            </div>
          )}
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-24 bg-[#F8F5EE] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-4 font-display">Chia Sẻ Từ Học Viên</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Những câu chuyện thật từ các thầy cô đã và đang đồng hành cùng EDUNEXA trong hành trình chuyển đổi số.</p>
          </div>

          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((t, idx) => (
                <motion.div 
                  key={t.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white p-8 rounded-xl shadow-md border border-gray-100 flex flex-col h-full relative"
                >
                  <Quote className="absolute top-6 right-8 w-10 h-10 text-[#D4AF37]/10" />
                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
                    ))}
                  </div>
                  <p className="text-gray-600 italic mb-8 flex-grow leading-relaxed">
                    "{t.quote}"
                  </p>
                  <div className="flex items-center gap-4 pt-6 border-t border-gray-50">
                    <motion.img 
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 3, 
                        ease: "easeInOut",
                        delay: idx * 0.5
                      }}
                      src={t.avatar} 
                      alt={t.name} 
                      className="w-12 h-12 rounded-full object-cover border-2 border-[#F8F5EE] shadow-sm"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="font-bold text-[#0F172A]">{t.name}</h4>
                      <p className="text-xs text-gray-500">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Bottom */}
      <section className="py-24 bg-[#D4AF37] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] to-[#B68A1F]"></div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-display">Sẵn Sàng Cùng EDUNEXA Bước Vào Kỷ Nguyên Giáo Dục Mới?</h2>
          <p className="text-white/90 text-lg mb-10">Hãy lựa chọn khóa học phù hợp để bắt đầu hành trình ứng dụng AI chuyên nghiệp và đầy cảm hứng.</p>
          <button 
             onClick={() => navigateTo('courses')}
             className="bg-[#0F172A] hover:bg-[#111827] text-white px-8 py-4 rounded-md font-semibold text-lg transition-all shadow-xl"
          >
            Bắt Đầu Hành Trình Cùng EDUNEXA
          </button>
        </div>
      </section>
    </div>
  );
}

// 2. COURSES CATALOG VIEW
function CoursesView({ navigateTo, onSelectCourse, courses }: { navigateTo: (p: string) => void, onSelectCourse: (c: any) => void, courses: any[] }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[#F8F5EE] min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-6 font-display">Hệ Sinh Thái Khóa Học AI</h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Khám phá các chương trình đào tạo từ cơ bản đến chuyên sâu, được thiết kế riêng cho giáo viên Việt Nam để làm chủ kỷ nguyên trí tuệ nhân tạo.
          </p>
          <div className="w-24 h-1 bg-[#D4AF37] mx-auto mt-8 rounded-full"></div>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-16 relative">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#D4AF37] transition-colors" />
            <input 
              type="text"
              placeholder="Tìm kiếm khóa học (tên khóa học, nội dung...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] transition-all text-[#0F172A]"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} navigateTo={navigateTo} onSelectCourse={onSelectCourse} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-[#0F172A] mb-2">Không tìm thấy khóa học nào</h3>
            <p className="text-gray-500">Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc.</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="mt-6 text-[#D4AF37] font-bold hover:underline"
            >
              Xóa tìm kiếm
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// REUSABLE COURSE CARD
function CourseCard({ course, navigateTo, onSelectCourse }: { course: any, navigateTo: (p: string) => void, onSelectCourse: (c: any) => void, key?: string }) {
  const isSpecial = course.originalPrice && course.originalPrice !== course.price;
  
  return (
    <motion.div 
      whileHover={{ y: -12 }}
      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full group"
    >
      <div className="relative h-64 overflow-hidden">
        <img 
          src={course.image} 
          alt={course.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className="bg-[#0F172A] text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg">
            {course.target}
          </span>
          {isSpecial && (
            <span className="bg-[#D4AF37] text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg animate-pulse">
              HOT OFFER
            </span>
          )}
        </div>
      </div>
      <div className="p-8 flex flex-col flex-grow bg-white">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 bg-[#F8F5EE] rounded-xl group-hover:bg-[#D4AF37]/10 transition-colors">
            {course.icon}
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#0F172A] leading-snug font-display line-clamp-2">{course.title}</h3>
            <p className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest mt-1">{course.subtitle}</p>
          </div>
        </div>
        
        <p className="text-gray-500 text-sm mb-8 flex-grow leading-relaxed line-clamp-3">
          {course.description}
        </p>
        
        <div className="pt-6 border-t border-gray-50 mt-auto">
          <div className="flex justify-between items-end mb-6">
            <div className="flex flex-col">
              <span className="text-gray-400 text-xs line-through font-medium">{course.originalPrice}</span>
              <span className="text-2xl font-black text-[#0F172A] font-display">{course.price}</span>
            </div>
            <div className="text-[#D4AF37]">
              <ArrowRight className="w-6 h-6 transform group-hover:translate-x-2 transition-transform" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            <button 
              onClick={() => navigateTo(`course-${course.id}`)}
              className="w-full bg-[#0F172A] hover:bg-[#1e293b] text-white py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all shadow-md group-hover:shadow-xl"
            >
              Đăng Ký & Nhận Quà
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// 3. GENERIC COURSE LANDING VIEW
function CourseLandingView({ course, navigateTo }: { course: any, navigateTo: (p: string) => void }) {
  const [isRegistered, setIsRegistered] = useState(false);

  if (!course) return <div className="py-40 text-center">Khóa học không tồn tại.</div>;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistered(true);
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative pt-20 pb-24 lg:pt-32 lg:pb-32 bg-[#0F172A] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37] font-semibold text-sm">
              {course.subtitle}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 max-w-4xl mx-auto leading-tight font-display">
              {course.title}
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
              {course.description}
            </p>
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => document.getElementById('register-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-[#D4AF37] hover:bg-[#B68A1F] text-white px-8 py-4 rounded-md font-bold text-lg transition-all shadow-[0_0_20px_rgba(212,175,55,0.4)]"
              >
                Đăng Ký Ngay
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pains Section */}
      <section className="py-20 bg-[#F8F5EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-4 font-display">
              {course.id === 'coaching-chuyen-biet' ? '1. Bạn Có Đang Gặp Những Vấn Đề Này?' : 'Bạn Có Đang Gặp Những Vấn Đề Này?'}
            </h2>
            <div className="w-20 h-1 bg-[#D4AF37] mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {course.pains.map((pain: string, idx: number) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-red-400"></div>
                <XCircle className="w-10 h-10 text-red-400 mb-4" />
                <p className="text-gray-700 font-medium">{pain}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2">
            <motion.img 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              src={course.image} 
              alt={course.title} 
              className="rounded-2xl shadow-xl aspect-video object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="w-full lg:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-6 font-display">
              {course.id === 'coaching-chuyen-biet' 
                ? '2. Khóa Học Sẽ Mang Lại Cho Bạn thêm nhiều hơn' 
                : course.id.includes('cam-nang') 
                  ? 'Cẩm nang Sẽ Mang Lại Cho Bạn' 
                  : 'Khóa Học Sẽ Mang Lại Cho Bạn'}
            </h2>
            <p className="text-gray-600 mb-8 text-lg">Lộ trình bài bản giúp biến AI thành trợ lý đắc lực, ứng dụng ngay vào công việc thực tế.</p>
            <ul className="space-y-4">
              {course.solutions.map((item: string, idx: number) => (
                <motion.li 
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 className="w-6 h-6 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-800 text-lg font-medium">{item}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Specific Pillars for 'bo-tai-lieu-quan-trong' */}
      {course.id === 'bo-tai-lieu-quan-trong' && (
        <section className="py-24 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-[#0F172A] mb-4 font-display uppercase tracking-tight">Hệ Thống 3 Trụ Cột Cốt Lõi</h2>
              <p className="text-lg text-gray-500 uppercase tracking-widest font-bold">Học nhanh - Làm được - Dùng ngay</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 rounded-[2rem] overflow-hidden border border-gray-100 shadow-2xl">
              {[
                { 
                  num: '01', 
                  title: 'LÀM NHANH VIỆC BẮT BUỘC', 
                  desc: 'Soạn giáo án, đề kiểm tra, viết SKKN nhanh gấp 5 lần với quy trình AI tối ưu.',
                  color: 'bg-white',
                  textColor: 'text-[#0F172A]'
                },
                { 
                  num: '02', 
                  title: 'LÀM TỐT VIỆC TRÊN LỚP', 
                  desc: 'Tự tay thiết kế trò chơi học tập, mô phỏng 3D và thí nghiệm ảo sinh động.',
                  color: 'bg-[#D4AF37]',
                  textColor: 'text-white'
                },
                { 
                  num: '03', 
                  title: 'LÀM HAY VIỆC TRUYỀN ĐẠT', 
                  desc: 'Biến bài giảng thành video hoạt hình, phim giáo dục lôi cuốn và đầy cảm hứng.',
                  color: 'bg-[#0F172A]',
                  textColor: 'text-white'
                }
              ].map((pillar, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className={`${pillar.color} p-12 flex flex-col items-center text-center`}
                >
                  <span className={`text-6xl font-black mb-6 ${pillar.textColor === 'text-white' ? 'text-white/20' : 'opacity-20 ' + pillar.textColor}`}>{pillar.num}</span>
                  <h3 className={`text-xl font-black mb-6 font-display tracking-tight leading-tight ${pillar.textColor === 'text-white' ? 'text-white' : pillar.textColor}`}>{pillar.title}</h3>
                  <p className={`text-sm leading-relaxed ${pillar.textColor === 'text-white' ? 'text-white' : 'text-gray-600'}`}>{pillar.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Curriculum Section */}
      <section className="py-20 bg-[#0F172A] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-display">Nội Dung Chương Trình Học</h2>
            <div className="w-20 h-1 bg-[#D4AF37] mx-auto rounded-full"></div>
          </div>
          <div className="space-y-6">
            {course.curriculum.map((module: any, idx: number) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-[#111827] border border-gray-700 p-6 rounded-xl flex items-center gap-6 hover:border-[#D4AF37] transition-all"
              >
                <div className="w-16 h-16 rounded-full bg-[#1e293b] flex flex-col items-center justify-center flex-shrink-0 border border-gray-700">
                  <span className="text-[#D4AF37] font-bold text-sm">M.{idx+1}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1 font-display">{module.title}</h3>
                  <p className="text-gray-400 text-sm">{module.desc || "Bao gồm lý thuyết cốt lõi và thực hành ra sản phẩm thật."}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gifts Section */}
      <section className="py-20 bg-[#F8F5EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-4 font-display">
              {course.id === 'coaching-chuyen-biet' 
                ? 'Quà Tặng Đặc Biệt: khóa học AI Toàn Diện Các chuyên đề của EDUNEXA' 
                : 'Quà Tặng Đặc Biệt'}
            </h2>
            <p className="text-gray-600">
              {course.id === 'coaching-chuyen-biet' 
                ? 'Bộ quà tặng gồm: Toàn bộ các học liệu độc quyền của EDUNEXA' 
                : 'Dành riêng cho học viên đăng ký trong tháng này'}
            </p>
          </div>
          <div className={`grid grid-cols-1 ${course.gifts.length === 1 ? 'md:grid-cols-1 max-w-2xl mx-auto' : 'md:grid-cols-3'} gap-8`}>
            {course.gifts.map((gift: string, idx: number) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-8 rounded-xl shadow-sm border border-[#D4AF37]/30 text-center"
              >
                <Award className="w-12 h-12 text-[#D4AF37] mx-auto mb-4" />
                <p className="text-[#0F172A] font-bold text-lg">{gift}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Form & Payment */}
      <section id="register-form" className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col md:flex-row">
            {/* Payment Info */}
            <div className="bg-[#0F172A] w-full md:w-2/5 p-10 text-white flex flex-col justify-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37] rounded-bl-full opacity-20"></div>
              <h3 className="text-2xl font-bold mb-6 relative z-10 font-display">Đầu tư cho sự nghiệp</h3>
              <div className="mb-8 relative z-10">
                <span className="text-gray-400 line-through text-lg">{course.originalPrice}</span>
                <div className="text-4xl font-bold text-[#D4AF37] mt-1 font-display">{course.price}</div>
              </div>
              <div className="p-5 bg-white/5 rounded-2xl border border-white/10 mb-8 relative z-10">
                {course.price !== 'Liên hệ' && (
                  <div className="mb-6 flex flex-col items-center">
                    <p className="text-xs text-[#D4AF37] font-bold uppercase mb-3 text-center">Quét mã QR để thanh toán</p>
                    <div className="bg-white p-3 rounded-xl shadow-lg w-full max-w-[220px]">
                      <img 
                        src="https://img.vietqr.io/image/tcb-8835583558-compact.jpg" 
                        alt="Bank QR Code" 
                        className="w-full h-auto object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                )}
                <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-3">Thông tin {course.price === 'Liên hệ' ? 'liên hệ & ' : ''}thanh toán</p>
                <div className="space-y-4">
                  {course.paymentInfo ? (
                    <div className="text-sm text-white font-medium leading-relaxed">
                      {course.paymentInfo}
                    </div>
                  ) : (
                    <>
                      <div>
                        <p className="text-xs text-[#D4AF37] font-black uppercase">Ngân hàng</p>
                        <p className="text-sm font-bold">Techcombank (TCB)</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#D4AF37] font-black uppercase">Số tài khoản</p>
                        <p className="text-xl font-black tracking-wider text-white">88.3558.3558</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#D4AF37] font-black uppercase">Chủ tài khoản</p>
                        <p className="text-sm font-bold uppercase">CONG TY TNHH MTV GIAO DUC EDUNEXA</p>
                      </div>
                      <div className="pt-2 border-t border-white/10">
                        <p className="text-xs text-gray-400 italic font-bold">Nội dung: hoten + sdt + {course.title}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="space-y-4 mb-8 relative z-10">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest">Liên hệ hỗ trợ</p>
                <div className="grid grid-cols-1 gap-2">
                  <a href="https://www.facebook.com/tranvandong.vietnam" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-white hover:text-[#D4AF37] transition-colors bg-white/5 p-2 rounded-lg border border-white/10">
                    <Users className="w-3.5 h-3.5 text-[#D4AF37]" /> Facebook Thầy Đông
                  </a>
                  <a href="https://www.tiktok.com/@trn.ng_ai.trainer" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-white hover:text-[#D4AF37] transition-colors bg-white/5 p-2 rounded-lg border border-white/10">
                    <MessageCircle className="w-3.5 h-3.5 text-[#D4AF37]" /> TikTok AI Trainer
                  </a>
                  <a href="https://www.youtube.com/@AITrainer.Offical" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-white hover:text-[#D4AF37] transition-colors bg-white/5 p-2 rounded-lg border border-white/10">
                    <MonitorPlay className="w-3.5 h-3.5 text-[#D4AF37]" /> Youtube AI Trainer
                  </a>
                  <div className="flex flex-col gap-1 p-2 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2 text-xs text-white">
                      <Shield className="w-3.5 h-3.5 text-[#D4AF37]" /> 094 456 2096
                    </div>
                  </div>
                </div>
              </div>
              <ul className="space-y-3 text-sm text-gray-300 relative z-10">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#D4AF37]"/> Sở hữu trọn đời</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#D4AF37]"/> Hỗ trợ 24/7</li>
              </ul>
            </div>
            
            {/* Direct Link Section */}
            <div className="w-full md:w-3/5 p-10 flex flex-col items-center justify-center text-center">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-20 h-20 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <FileText className="w-10 h-10 text-[#D4AF37]" />
                </div>
                <h3 className="text-2xl font-bold text-[#0F172A] mb-6 font-display uppercase tracking-tight">Thông tin đăng ký</h3>
                <p className="text-gray-700 text-lg mb-8 leading-relaxed font-medium">
                  Sau khi Thầy Cô đăng ký, hãy điền thông tin vào <span className="text-[#D4AF37] font-black">NGAY</span> link này nhé:
                </p>
                
                <a 
                  href="https://forms.gle/drgKvsnKvkACEHbe7" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full bg-[#D4AF37] hover:bg-[#B68A1F] text-white text-center py-4 px-8 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 mb-6 group"
                >
                  <FileText className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  ĐIỀN FORM ĐĂNG KÝ
                </a>

                <p className="text-sm text-gray-500 italic">
                  * Vui lòng hoàn tất thanh toán trước khi điền form để được kích hoạt nhanh nhất.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// 5. ADMIN DASHBOARD VIEW
function AdminView({ courses, setCourses, isAdmin, setIsAdmin, navigateTo, adminPassword, setAdminPassword }: { 
  courses: any[], 
  setCourses: React.Dispatch<React.SetStateAction<any[]>>, 
  isAdmin: boolean, 
  setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>,
  navigateTo: (p: string) => void,
  adminPassword: string,
  setAdminPassword: React.Dispatch<React.SetStateAction<string>>
}) {
  const [activeTab, setActiveTab] = useState('courses');
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === adminPassword) {
      setIsAdmin(true);
      setError('');
    } else {
      setError('Mật khẩu không chính xác.');
    }
  };

  const handleDeleteCourse = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khóa học này?')) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const courseData = {
      id: editingCourse?.id || formData.get('id') as string,
      title: formData.get('title') as string,
      subtitle: formData.get('subtitle') as string,
      description: formData.get('description') as string,
      price: formData.get('price') as string,
      originalPrice: formData.get('originalPrice') as string,
      target: formData.get('target') as string,
      image: formData.get('image') as string || 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      icon: editingCourse?.icon || <BookOpen className="w-6 h-6 text-[#D4AF37]" />,
      pains: editingCourse?.pains || ['Mất thời gian soạn bài', 'Thiếu kỹ năng AI'],
      solutions: editingCourse?.solutions || ['Làm chủ công cụ AI', 'Tiết kiệm thời gian'],
      curriculum: editingCourse?.curriculum || [{ mod: 'Module 1', title: 'Tổng quan' }],
      gifts: editingCourse?.gifts || ['Prompt mẫu'],
      paymentInfo: editingCourse?.paymentInfo || `Bank: Techcombank (TCB) - STK: 88.3558.3558 - Owner: CONG TY TNHH MTV GIAO DUC EDUNEXA - Content: hoten + sdt + ${(formData.get('title') as string || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[đĐ]/g, 'd').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`
    };

    if (isAddingCourse) {
      setCourses([...courses, courseData]);
    } else {
      setCourses(courses.map(c => c.id === courseData.id ? courseData : c));
    }
    setEditingCourse(null);
    setIsAddingCourse(false);
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F5EE] px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100"
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-[#0F172A] rounded-full flex items-center justify-center text-[#D4AF37]">
              <Lock className="w-8 h-8" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-[#0F172A] mb-2 font-display">Khu Vực Quản Trị</h2>
          <p className="text-center text-gray-500 mb-8">Vui lòng nhập mật khẩu để tiếp tục.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button 
              type="submit"
              className="w-full bg-[#0F172A] text-white py-3 rounded-lg font-bold hover:bg-[#111827] transition-all shadow-lg"
            >
              Đăng Nhập
            </button>
          </form>
          <button 
            onClick={() => navigateTo('home')}
            className="w-full mt-4 text-gray-500 text-sm hover:text-[#0F172A] transition-colors"
          >
            Quay lại trang chủ
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F5EE] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-[#D4AF37] mb-1">
              <Shield className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Admin Dashboard</span>
            </div>
            <h1 className="text-3xl font-bold text-[#0F172A] font-display">Quản Lý Nội Dung</h1>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => navigateTo('home')}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
            >
              <Eye className="w-4 h-4" /> Xem Website
            </button>
            <button 
              onClick={() => setIsAdmin(false)}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-lg text-sm font-medium hover:bg-red-100 transition-all"
            >
              <LogOut className="w-4 h-4" /> Đăng Xuất
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Tabs */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {[
                { id: 'courses', label: 'Khóa học', icon: <BookOpen className="w-5 h-5" /> },
                { id: 'settings', label: 'Cài đặt Landing', icon: <Settings className="w-5 h-5" /> },
                { id: 'security', label: 'Bảo mật', icon: <Shield className="w-5 h-5" /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-6 py-4 text-sm font-bold transition-all border-l-4 ${
                    activeTab === tab.id 
                      ? 'bg-[#F8F5EE] text-[#D4AF37] border-[#D4AF37]' 
                      : 'text-gray-500 border-transparent hover:bg-gray-50 hover:text-[#0F172A]'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-grow">
            {activeTab === 'courses' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-[#0F172A] font-display">Danh Sách Khóa Học</h2>
                  <button 
                    onClick={() => {
                      setIsAddingCourse(true);
                      setEditingCourse(null);
                    }}
                    className="flex items-center gap-2 bg-[#0F172A] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#111827] transition-all shadow-md"
                  >
                    <Plus className="w-4 h-4" /> Thêm Khóa Học
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {courses.map((course) => (
                    <div key={course.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-6">
                      <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={course.image} alt={course.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex-grow text-center md:text-left">
                        <h3 className="text-lg font-bold text-[#0F172A] mb-1">{course.title}</h3>
                        <p className="text-sm text-gray-500 mb-2">{course.subtitle}</p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs">
                          <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded font-bold">{course.target}</span>
                          <span className="bg-green-50 text-green-600 px-2 py-1 rounded font-bold">{course.price}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setEditingCourse(course)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteCourse(course.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'articles' && (
              <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
                <FileText className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[#0F172A] mb-2">Quản Lý Bài Viết</h3>
                <p className="text-gray-500">Tính năng này đang được phát triển. Bạn có thể thêm, sửa, xóa các bài viết và học liệu số tại đây.</p>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
                <Settings className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[#0F172A] mb-2">Cài Đặt Landing Page</h3>
                <p className="text-gray-500">Chỉnh sửa nội dung Hero, Stats, và các section khác trên trang chủ.</p>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-md mx-auto">
                <h3 className="text-xl font-bold text-[#0F172A] mb-6 font-display flex items-center gap-2">
                  <Shield className="w-6 h-6 text-[#D4AF37]" /> Thay Đổi Mật Khẩu
                </h3>
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const current = formData.get('currentPassword');
                    const newPass = formData.get('newPassword');
                    const confirmPass = formData.get('confirmPassword');

                    if (current !== adminPassword) {
                      alert('Mật khẩu hiện tại không đúng.');
                      return;
                    }
                    if (newPass !== confirmPass) {
                      alert('Mật khẩu mới không khớp.');
                      return;
                    }
                    if (!newPass || (newPass as string).length < 6) {
                      alert('Mật khẩu mới phải có ít nhất 6 ký tự.');
                      return;
                    }

                    setAdminPassword(newPass as string);
                    alert('Thay đổi mật khẩu thành công!');
                    e.currentTarget.reset();
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu hiện tại</label>
                    <input name="currentPassword" type="password" required className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#D4AF37]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
                    <input name="newPassword" type="password" required className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#D4AF37]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu mới</label>
                    <input name="confirmPassword" type="password" required className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#D4AF37]" />
                  </div>
                  <button type="submit" className="w-full bg-[#D4AF37] text-white py-3 rounded-lg font-bold hover:bg-[#B68A1F] transition-all shadow-md mt-4">
                    Cập Nhật Mật Khẩu
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit/Add Modal */}
      <AnimatePresence>
        {(editingCourse || isAddingCourse) && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setEditingCourse(null);
                setIsAddingCourse(false);
              }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl p-8"
            >
              <h2 className="text-2xl font-bold text-[#0F172A] mb-6 font-display">
                {isAddingCourse ? 'Thêm Khóa Học Mới' : 'Chỉnh Sửa Khóa Học'}
              </h2>
              
              <form onSubmit={handleSaveCourse} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ID Khóa học (slug)</label>
                    <input name="id" defaultValue={editingCourse?.id} required disabled={!isAddingCourse} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#D4AF37] disabled:bg-gray-50" placeholder="ai-toan-dien" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Đối tượng</label>
                    <input name="target" defaultValue={editingCourse?.target} required className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#D4AF37]" placeholder="Giáo viên các cấp" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề khóa học</label>
                  <input name="title" defaultValue={editingCourse?.title} required className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#D4AF37]" placeholder="AI Toàn Diện Cho Giáo Viên" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề phụ (Subtitle)</label>
                  <input name="subtitle" defaultValue={editingCourse?.subtitle} required className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#D4AF37]" placeholder="Khóa học nền tảng chủ lực" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả ngắn</label>
                  <textarea name="description" defaultValue={editingCourse?.description} required className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#D4AF37] h-24" placeholder="Mô tả ngắn gọn về khóa học..."></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Giá ưu đãi</label>
                    <input name="price" defaultValue={editingCourse?.price} required className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#D4AF37]" placeholder="1.490.000đ" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Giá gốc</label>
                    <input name="originalPrice" defaultValue={editingCourse?.originalPrice} required className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#D4AF37]" placeholder="2.500.000đ" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL Hình ảnh</label>
                  <input name="image" defaultValue={editingCourse?.image} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#D4AF37]" placeholder="https://..." />
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                  <button 
                    type="button"
                    onClick={() => {
                      setEditingCourse(null);
                      setIsAddingCourse(false);
                    }}
                    className="px-6 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all"
                  >
                    Hủy
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-2 bg-[#D4AF37] text-white rounded-lg text-sm font-bold hover:bg-[#B68A1F] transition-all shadow-md"
                  >
                    Lưu Thay Đổi
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
