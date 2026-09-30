/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, X, ChevronRight, CheckCircle2, PlayCircle, 
  BookOpen, Users, Star, Award, ArrowRight, XCircle, ArrowUp,
  MonitorPlay, Layout, Gamepad2, Briefcase, Quote, Search, Image as ImageIcon, Box,
  Plus, Edit, Trash2, Settings, FileText, Eye, EyeOff, LogOut, Lock, Shield, MessageCircle, Globe,
  Workflow, Sparkles, Zap, Database, Bot, Video
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
  const [readingProgress, setReadingProgress] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false); // Simulated admin login state
  const [adminPassword, setAdminPassword] = useState('Dongbac2ty');

  useEffect(() => {
    window.scrollTo(0, 0);
    setReadingProgress(0);
  }, [currentPage]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (scrollHeight > 0) {
        const progress = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));
        setReadingProgress(progress);
      } else {
        setReadingProgress(0);
      }
      setIsScrolled(scrollTop > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [currentPage, selectedCourse]);

  const navigateTo = (page: string) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
    setSelectedCourse(null);
  };

  return (
    <div className="min-h-screen font-sans text-slate-100 bg-[#07111F] selection:bg-[#E7B936] selection:text-[#07111F] relative">
      {/* READING PROGRESS BAR AT TOP */}
      <div 
        className="fixed top-0 left-0 right-0 z-[100] h-1 sm:h-1.5 bg-black/20 backdrop-blur-xs pointer-events-none"
        role="progressbar"
        aria-label="Tiến trình đọc trang"
        aria-valuenow={Math.round(readingProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div 
          className="h-full bg-gradient-to-r from-[#2563EB] via-[#22D3EE] to-[#E7B936] transition-[width] duration-150 ease-out relative shadow-[0_0_12px_rgba(34,211,238,0.7)]"
          style={{ width: `${readingProgress}%` }}
        >
          {readingProgress > 1 && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_8px_#22D3EE] ring-2 ring-[#E7B936]" />
          )}
        </div>
      </div>

      {/* READING PROGRESS FLOATING BADGE */}
      <AnimatePresence>
        {readingProgress > 3 && !isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="fixed top-2.5 right-4 md:right-8 z-[95] pointer-events-none"
          >
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#07111F]/90 backdrop-blur-md text-white text-xs font-semibold shadow-lg border border-[#E7B936]/40 tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E7B936] animate-pulse" />
              <span className="text-slate-400 font-normal hidden sm:inline">Đã đọc</span>
              <span className="text-[#E7B936] font-bold">{Math.round(readingProgress)}%</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER */}
      <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled ? 'bg-[#07111F]/92 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.4)] border-b border-slate-800/60' : 'bg-[#07111F]/85 backdrop-blur-sm border-b border-slate-800/30'}`}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div 
              className="flex items-center cursor-pointer group"
              onClick={() => navigateTo('home')}
            >
              <span className="text-2xl lg:text-3xl font-black tracking-tight text-white font-display uppercase group-hover:text-[#E7B936] transition-colors">
                EDUNEXA
              </span>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-9 items-center">
              <button 
                onClick={() => navigateTo('home')} 
                className={`text-sm font-semibold transition-all duration-250 py-1 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:transition-all after:duration-250 ${
                  currentPage === 'home' 
                    ? 'text-[#E7B936] after:w-full after:bg-[#E7B936]' 
                    : 'text-slate-300 hover:text-white after:w-0 hover:after:w-full after:bg-[#E7B936]'
                }`}
              >
                Trang Chủ
              </button>
              <button 
                onClick={() => navigateTo('courses')} 
                className={`text-sm font-semibold transition-all duration-250 py-1 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:transition-all after:duration-250 ${
                  currentPage === 'courses' 
                    ? 'text-[#E7B936] after:w-full after:bg-[#E7B936]' 
                    : 'text-slate-300 hover:text-white after:w-0 hover:after:w-full after:bg-[#E7B936]'
                }`}
              >
                Các khóa học
              </button>
              <a 
                href="https://www.facebook.com/groups/24037123512640076" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm font-semibold text-slate-300 hover:text-white transition-all duration-250 py-1 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-[#E7B936] after:transition-all after:duration-250"
              >
                Cộng Đồng
              </a>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 focus:outline-none transition-colors"
                aria-label="Mở menu điều hướng"
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
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
              />
              {/* Menu Panel */}
              <motion.div 
                initial={{ x: '100%', opacity: 0.5 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '100%', opacity: 0.5 }}
                transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.8 }}
                className="fixed top-0 right-0 bottom-0 w-[290px] bg-[#0B1628] text-white z-[70] md:hidden shadow-2xl flex flex-col border-l border-slate-800"
              >
                <div className="p-6 flex justify-between items-center border-b border-slate-800">
                  <div className="flex items-center">
                    <span className="text-xl font-black tracking-tight text-white font-display uppercase">
                      EDUNEXA
                    </span>
                  </div>
                  <button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-lg bg-white/5 text-slate-300 hover:text-white transition-colors"
                    aria-label="Đóng menu"
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
                            className="text-lg font-bold w-full text-left block text-slate-200 hover:text-[#E7B936] transition-colors"
                          >
                            {item.label}
                          </a>
                        ) : (
                          <button 
                            onClick={() => item.page ? navigateTo(item.page) : setIsMobileMenuOpen(false)}
                            className={`text-lg font-bold w-full text-left transition-colors ${currentPage === item.page ? 'text-[#E7B936]' : 'text-slate-200 hover:text-[#E7B936]'}`}
                          >
                            {item.label}
                          </button>
                        )}
                      </motion.li>
                    ))}
                  </ul>
                </nav>
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
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[24px] shadow-2xl border border-slate-100"
            >
              <button 
                onClick={() => setSelectedCourse(null)}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors z-10"
                aria-label="Đóng cửa sổ"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/2 h-64 md:h-auto bg-slate-900">
                  <img 
                    src={selectedCourse.image} 
                    alt={selectedCourse.title} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="w-full md:w-1/2 p-7 md:p-10">
                  <div className="inline-block px-3 py-1 rounded-md bg-[#07111F] text-white text-[11px] font-bold uppercase tracking-wider mb-4">
                    {selectedCourse.target}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#07111F] mb-3 font-display leading-tight">
                    {selectedCourse.title}
                  </h2>
                  <p className="text-slate-600 mb-6 leading-relaxed text-sm">
                    {selectedCourse.fullDescription || selectedCourse.description}
                  </p>
                  
                  <div className="space-y-3 mb-8">
                    <h4 className="font-bold text-[#07111F] text-sm uppercase tracking-wide">Lợi ích khóa học:</h4>
                    <ul className="space-y-2">
                      {(selectedCourse.benefits || []).map((benefit: string, i: number) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                          <CheckCircle2 className="w-4 h-4 text-[#E7B936] mt-0.5 flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100">
                    <div className="text-2xl font-black text-[#07111F]">{selectedCourse.price}</div>
                    <button 
                      onClick={() => {
                        navigateTo(`course-${selectedCourse.id}`);
                        setSelectedCourse(null);
                      }}
                      className="w-full sm:w-auto bg-[#E7B936] hover:bg-[#d8a829] text-[#07111F] px-8 py-3.5 h-[48px] rounded-xl font-bold text-sm uppercase tracking-wider transition-all shadow-md hover:shadow-lg"
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
      <footer id="footer" className="bg-[#07111F] text-slate-300 py-16 sm:py-20 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex flex-col items-start mb-6">
              <div className="flex items-center mb-2">
                <span className="text-3xl font-black tracking-tight text-white block font-display uppercase">
                  EDUNEXA
                </span>
              </div>
              <p className="text-slate-400 text-xs tracking-wider uppercase font-semibold">Empowering Minds. Bridging Futures.</p>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md mb-6">
              Hệ sinh thái đào tạo và giải pháp AI dành cho giáo viên, nhà trường và người làm giáo dục, hướng tới nâng cao năng lực nghề nghiệp và đồng hành cùng chuyển đổi số.
            </p>
            <div className="text-sm text-slate-400 space-y-3">
              <p className="flex items-center gap-2.5">
                <Shield className="w-4 h-4 text-[#E7B936]" />
                Hotline: <span className="text-white font-bold ml-1">094 456 2096</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-[#E7B936]" />
                Facebook: <a href="https://www.facebook.com/tranvandong.vietnam" target="_blank" rel="noopener noreferrer" className="text-slate-200 hover:text-[#E7B936] transition-colors">fb.com/tranvandong.vietnam</a>
              </p>
              <p className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-[#E7B936]" />
                TikTok: <a href="https://www.tiktok.com/@trn.ng_ai.trainer" target="_blank" rel="noopener noreferrer" className="text-slate-200 hover:text-[#E7B936] transition-colors">@trn.ng_ai.trainer</a>
              </p>
              <p className="flex items-center gap-2.5">
                <MonitorPlay className="w-4 h-4 text-[#E7B936]" />
                Youtube: <a href="https://www.youtube.com/@AITrainer.Offical" target="_blank" rel="noopener noreferrer" className="text-slate-200 hover:text-[#E7B936] transition-colors">@AITrainer.Offical</a>
              </p>
              <p className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-[#E7B936]" />
                Website: <a href="https://edunexaai.vercel.app" target="_blank" rel="noopener noreferrer" className="text-slate-200 hover:text-[#E7B936] transition-colors">edunexaai.vercel.app</a>
              </p>
            </div>
          </div>
          
          <div>
            <h4 className="text-base font-bold mb-4 text-white uppercase tracking-wider font-display">Khám Phá</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><button onClick={() => navigateTo('courses')} className="hover:text-[#E7B936] transition-colors">Hệ Sinh Thái Khóa Học</button></li>
              <li><a href="https://www.facebook.com/groups/24037123512640076" target="_blank" rel="noopener noreferrer" className="hover:text-[#E7B936] transition-colors">Cộng Đồng Facebook</a></li>
              <li><a href="#" className="hover:text-[#E7B936] transition-colors">Blog Chuyên Gia</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-base font-bold mb-4 text-white uppercase tracking-wider font-display">Hỗ Trợ</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><a href="#" className="hover:text-[#E7B936] transition-colors">Hướng Dẫn Thanh Toán</a></li>
              <li><a href="#" className="hover:text-[#E7B936] transition-colors">Câu Hỏi Thường Gặp</a></li>
              <li><a href="#" className="hover:text-[#E7B936] transition-colors">Chính Sách Bảo Mật</a></li>
              <li><a href="#" className="hover:text-[#E7B936] transition-colors">Điều Khoản Dịch Vụ</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8 mt-12 pt-8 border-t border-slate-800/80 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>&copy; 2026 EDUNEXA AI. Kiến tạo kỷ nguyên giáo dục mới.</p>
        </div>
      </footer>

      {/* SCROLL TO TOP BUTTON */}
      <ScrollToTop readingProgress={readingProgress} />
    </div>
  );
}

// SCROLL TO TOP COMPONENT
function ScrollToTop({ readingProgress }: { readingProgress?: number }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
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
          className="fixed bottom-6 right-6 z-[90] p-3.5 bg-[#0F172A] text-white rounded-full shadow-2xl hover:bg-[#1E293B] border border-[#D4AF37]/50 transition-all group flex flex-col items-center justify-center"
          aria-label="Cuộn lên đầu trang"
          title="Cuộn lên đầu trang"
        >
          <ArrowUp className="w-5 h-5 text-[#D4AF37] group-hover:-translate-y-0.5 transition-transform" />
          {typeof readingProgress === 'number' && readingProgress > 5 && (
            <span className="text-[10px] font-bold text-gray-200 mt-0.5 leading-none">
              {Math.round(readingProgress)}%
            </span>
          )}
        </motion.button>
      )}
    </AnimatePresence>
  );
}

// Staggered Entrance Animation Variants for Major Homepage Sections
const fadeUpContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08
    }
  }
};

const fadeUpItem = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.21, 0.47, 0.32, 0.98]
    }
  }
};

const fadeUpCard = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.21, 0.47, 0.32, 0.98]
    }
  }
};

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
      <section className="relative bg-[#06101F] overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 min-h-[720px] lg:min-h-[780px] flex items-center border-b border-slate-800/50">
        {/* Premium Multi-layer Background Ambience & Deep Lighting */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Deep Navy Base Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#06101F] via-[#0A172A] to-[#06101F]" />
          
          {/* Radial Blue Glow on the right */}
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[700px] h-[700px] bg-[radial-gradient(circle_at_65%_45%,rgba(37,99,235,0.22),transparent_65%)]" />
          
          {/* Subtle Cyan Glow behind visual */}
          <div className="absolute top-1/4 -right-12 w-[520px] h-[520px] rounded-full bg-[#22D3EE]/10 blur-[130px]" />
          
          {/* Warm Gold Glow near CTA */}
          <div className="absolute bottom-16 left-1/4 w-[360px] h-[360px] rounded-full bg-[#E7B936]/8 blur-[110px]" />
          
          {/* Top Radial Overhead Beam */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(37,99,235,0.18),transparent_70%)]" />

          {/* Futuristic Precision Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_45%,#000_50%,transparent_95%)] opacity-70" />

          {/* Background Micro Particle Dots */}
          <div className="absolute top-24 left-[15%] w-1.5 h-1.5 rounded-full bg-cyan-400/40 blur-[0.5px]" />
          <div className="absolute top-1/3 left-[45%] w-1 h-1 rounded-full bg-[#E7B936]/50 blur-[0.5px]" />
          <div className="absolute bottom-1/3 left-[20%] w-1.5 h-1.5 rounded-full bg-blue-400/30 blur-[0.5px]" />
          <div className="absolute top-20 right-[25%] w-1 h-1 rounded-full bg-cyan-300/40" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-8 w-full z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-14 justify-between">
            {/* Left Content (approx 56%) */}
            <div className="w-full lg:w-[56%] text-left">
              {/* Badge: Appears first (delay 0.1s) */}
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/25 text-[#22D3EE] text-xs font-bold tracking-[0.25em] uppercase mb-6 sm:mb-8 shadow-sm backdrop-blur-md"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#22D3EE] animate-pulse" />
                <span>PREMIUM EDTECH ACADEMY</span>
              </motion.div>
  
              {/* H1 Main Title: Appears after 100ms (delay 0.2s) */}
              <motion.h1 
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                className="text-4xl sm:text-5xl md:text-[58px] lg:text-[66px] xl:text-[72px] font-black leading-[1.08] tracking-[-0.025em] uppercase mb-6 font-display"
              >
                <span className="block text-white">
                  ỨNG DỤNG{' '}
                  <span className="bg-gradient-to-r from-[#F4C430] via-[#E7B936] to-[#22D3EE] bg-clip-text text-transparent drop-shadow-[0_4px_16px_rgba(231,185,54,0.25)]">
                    AI TOÀN DIỆN
                  </span>
                </span>
                <span className="block text-white drop-shadow-sm">
                  CHO GIÁO VIÊN
                </span>
              </motion.h1>
  
              {/* Subheading: Appears next (delay 0.3s) */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
                className="mb-8"
              >
                <p className="text-[#E7B936] text-xl sm:text-2xl lg:text-[26px] font-bold leading-snug mb-5 font-display">
                  Hệ sinh thái giáo dục dành cho Thầy Cô trong kỷ nguyên AI
                </p>
                {/* Description: Appears next (delay 0.4s) */}
                <motion.p 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
                  className="text-slate-300 text-base sm:text-lg lg:text-[18px] leading-[1.7] max-w-[610px] font-normal text-balance"
                >
                  EDUNEXA AI giúp Thầy Cô phát triển năng lực toàn diện thông qua tri thức, kỹ năng sống và ứng dụng công nghệ AI. 
                  Chúng tôi đồng hành xây dựng hệ sinh thái học tập hiện đại, giúp nâng cao hiệu quả dạy và học trong bối cảnh mới.
                </motion.p>
              </motion.div>
  
              {/* CTA Button: Appears next (delay 0.5s) */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
                className="flex flex-wrap gap-5"
              >
                <button 
                  onClick={() => navigateTo('courses')}
                  className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#F4C430] to-[#E7B936] text-[#06101F] px-8 sm:px-9 h-[56px] rounded-[14px] font-bold text-sm uppercase tracking-wider transition-all duration-250 shadow-[0_12px_28px_rgba(231,185,54,0.3)] hover:shadow-[0_18px_36px_rgba(231,185,54,0.45)] hover:-translate-y-[3px] active:translate-y-0 overflow-hidden"
                >
                  {/* Subtle shimmer hover reflection */}
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
                  <span className="relative z-10">Khám Phá Khóa Học</span>
                  <ArrowRight className="relative z-10 w-4 h-4 transition-transform duration-250 group-hover:translate-x-1.5" />
                </button>
              </motion.div>
            </div>

            {/* Right Side Visual Container (approx 44%) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.25, ease: "easeOut" }}
              className="w-full lg:w-[44%] relative"
            >
              {/* Soft Gradient Sphere / Glowing Orbit */}
              <div className="absolute -inset-6 bg-gradient-to-tr from-[#2563EB]/25 via-[#22D3EE]/20 to-[#E7B936]/15 rounded-[44px] blur-3xl opacity-80 pointer-events-none" />
              <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full bg-[#22D3EE]/15 blur-2xl pointer-events-none" />
              <div className="absolute -bottom-8 -left-8 w-48 h-48 rounded-full bg-[#2563EB]/20 blur-2xl pointer-events-none" />

              {/* Decorative Abstract AI Node Network SVG */}
              <div className="absolute -top-12 -right-10 w-52 h-52 opacity-35 pointer-events-none hidden sm:block">
                <svg viewBox="0 0 160 160" fill="none" className="w-full h-full">
                  <circle cx="30" cy="30" r="4" fill="#22D3EE" />
                  <circle cx="130" cy="40" r="5" fill="#E7B936" />
                  <circle cx="100" cy="120" r="4" fill="#2563EB" />
                  <circle cx="40" cy="110" r="3" fill="#22D3EE" />
                  <circle cx="80" cy="70" r="3" fill="#38BDF8" />
                  <line x1="30" y1="30" x2="130" y2="40" stroke="#22D3EE" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                  <line x1="130" y1="40" x2="100" y2="120" stroke="#E7B936" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                  <line x1="100" y1="120" x2="40" y2="110" stroke="#2563EB" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                  <line x1="40" y1="110" x2="30" y2="30" stroke="#22D3EE" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                  <line x1="80" y1="70" x2="130" y2="40" stroke="#22D3EE" strokeWidth="1" strokeDasharray="2 2" opacity="0.4" />
                </svg>
              </div>

              {/* High-End AI Dashboard / Card Frame */}
              <div className="relative rounded-[28px] p-2.5 sm:p-3 bg-gradient-to-b from-white/15 via-white/[0.05] to-white/[0.02] border border-white/12 shadow-[0_25px_65px_-15px_rgba(0,0,0,0.85),0_0_40px_rgba(37,99,235,0.18)] backdrop-blur-xl group transition-all duration-500 hover:shadow-[0_35px_80px_-15px_rgba(34,211,238,0.22)]">
                {/* Subtle Inner Highlight */}
                <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

                {/* Inner Image Frame */}
                <div className="relative rounded-[22px] overflow-hidden aspect-[4/5] max-h-[520px] w-full bg-[#0A172A]">
                  <img 
                    src="https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?auto=format&fit=crop&w=1200&q=80" 
                    alt="Ứng dụng AI Toàn Diện Cho Giáo Viên - EDUNEXA" 
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]" 
                    referrerPolicy="no-referrer"
                  />
                  {/* Subtle Lighting Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#06101F]/80 via-[#06101F]/20 to-transparent pointer-events-none" />
                  <div className="absolute inset-0 border border-white/10 rounded-[22px] pointer-events-none" />
                </div>

                {/* Floating Mini Card 1: Top-Left - AI VIDEO */}
                <div className="absolute -top-3 -left-3 sm:top-5 sm:-left-5 z-20 px-3.5 py-2 rounded-xl bg-[#0B1628]/90 backdrop-blur-md border border-cyan-400/30 shadow-[0_10px_25px_rgba(0,0,0,0.5)] flex items-center gap-2.5 hover:scale-105 transition-transform duration-300">
                  <div className="w-6 h-6 rounded-lg bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center">
                    <Video className="w-3.5 h-3.5 text-[#22D3EE]" />
                  </div>
                  <span className="text-xs font-bold text-white tracking-wider">AI VIDEO</span>
                </div>

                {/* Floating Mini Card 2: Middle-Left - TRÒ CHƠI AI */}
                <div className="absolute bottom-24 -left-4 sm:bottom-28 sm:-left-6 z-20 px-3.5 py-2 rounded-xl bg-[#0B1628]/90 backdrop-blur-md border border-[#E7B936]/35 shadow-[0_10px_25px_rgba(0,0,0,0.5)] flex items-center gap-2.5 hover:scale-105 transition-transform duration-300">
                  <div className="w-6 h-6 rounded-lg bg-[#E7B936]/20 border border-[#E7B936]/30 flex items-center justify-center">
                    <Gamepad2 className="w-3.5 h-3.5 text-[#E7B936]" />
                  </div>
                  <span className="text-xs font-bold text-[#E7B936] tracking-wider">TRÒ CHƠI AI</span>
                </div>

                {/* Floating Mini Card 3: Bottom-Right - AI BÀI GIẢNG */}
                <div className="absolute -bottom-3 -right-3 sm:bottom-5 sm:-right-5 z-20 px-3.5 py-2 rounded-xl bg-[#0B1628]/90 backdrop-blur-md border border-blue-400/30 shadow-[0_10px_25px_rgba(0,0,0,0.5)] flex items-center gap-2.5 hover:scale-105 transition-transform duration-300">
                  <div className="w-6 h-6 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center">
                    <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <span className="text-xs font-bold text-white tracking-wider">AI BÀI GIẢNG</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-[#0B1628] text-white border-y border-slate-800/60 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8">
          <motion.div 
            variants={fadeUpContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center"
          >
            {[
              { number: '10,000+', label: 'Giáo viên tham gia' },
              { number: '15+', label: 'Chuyên đề đào tạo' },
              { number: '98%', label: 'Tỷ lệ hài lòng' },
              { number: '10K+', label: 'Tài nguyên chia sẻ' }
            ].map((stat, idx) => (
              <motion.div key={idx} variants={fadeUpItem} className="flex flex-col items-center">
                <div className="text-4xl md:text-5xl font-black text-[#E7B936] mb-2 font-display tracking-tight">{stat.number}</div>
                <div className="text-sm md:text-base text-slate-400 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About EDUNEXA Section */}
      <section id="about" className="py-28 bg-[#F8FAFC] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8">
          {/* Header */}
          <motion.div 
            variants={fadeUpContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="max-w-3xl mx-auto text-center mb-20"
          >
            <motion.div variants={fadeUpItem} className="inline-block px-4 py-1.5 rounded-full bg-[#E7B936]/10 text-[#E7B936] text-xs font-bold uppercase tracking-[0.25em] mb-4 border border-[#E7B936]/25">
              VỀ CHÚNG TÔI
            </motion.div>
            <motion.h2 variants={fadeUpItem} className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#07111F] font-display uppercase tracking-tight leading-tight">
              Kiến Tạo Hệ Sinh Thái Giáo Dục <br className="hidden sm:inline" /><span className="text-[#E7B936]">Trong Kỷ Nguyên AI</span>
            </motion.h2>
          </motion.div>

          {/* Ecosystem, Mission, Values Grid */}
          <motion.div 
            variants={fadeUpContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24"
          >
            <motion.div 
              variants={fadeUpCard}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-9 rounded-[22px] border border-slate-200/80 border-t-4 border-t-[#E7B936] shadow-sm flex flex-col h-full hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-[#F8FAFC] rounded-xl border border-slate-200/70 shadow-xs flex items-center justify-center mb-6">
                <Layout className="w-6 h-6 text-[#E7B936]" />
              </div>
              <h3 className="text-xl font-bold text-[#07111F] mb-4 font-display">HỆ SINH THÁI GIÁO DỤC</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                EDUNEXA là doanh nghiệp giáo dục định hướng xây dựng hệ sinh thái học tập hiện đại. EDUNEXA tập trung vào phát triển năng lực toàn diện cho giáo viên và người học thông qua tri thức, kỹ năng sống và ứng dụng công nghệ, đặc biệt là AI trong dạy học. <br /><br />
                EDUNEXA không chỉ cung cấp đào tạo mà còn phát triển các mô hình học tập, học liệu số và giải pháp giáo dục giúp nâng cao hiệu quả dạy và học trong bối cảnh mới.
              </p>
            </motion.div>

            <motion.div 
              variants={fadeUpCard}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              className="bg-[#0B1628] p-9 rounded-[22px] text-white border border-slate-800 shadow-xl flex flex-col h-full"
            >
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6 border border-white/10">
                <Star className="w-6 h-6 text-[#E7B936]" />
              </div>
              <h3 className="text-xl font-bold mb-4 font-display">SỨ MỆNH</h3>
              <p className="text-slate-300 leading-relaxed text-sm">
                EDUNEXA giúp giáo viên và người học làm chủ công nghệ, đổi mới tư duy và phát triển năng lực phù hợp với tương lai. 
                Doanh nghiệp tập trung xây dựng các giải pháp giáo dục thực tiễn, dễ áp dụng và tạo ra giá trị bền vững.
              </p>
            </motion.div>

            <motion.div 
              variants={fadeUpCard}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-9 rounded-[22px] shadow-sm border border-slate-200/80 flex flex-col h-full hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-[#F8FAFC] rounded-xl border border-slate-200/70 shadow-xs flex items-center justify-center mb-6">
                <CheckCircle2 className="w-6 h-6 text-[#E7B936]" />
              </div>
              <h3 className="text-xl font-bold text-[#07111F] mb-4 font-display">GIÁ TRỊ CỐT LÕI</h3>
              <ul className="space-y-4">
                {[
                  "Lấy người học làm trung tâm",
                  "Học để phát triển năng lực thực",
                  "Ứng dụng công nghệ để nâng cao hiệu quả",
                  "Xây dựng hệ sinh thái giáo dục bền vững"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                    <CheckCircle2 className="w-5 h-5 text-[#E7B936] mt-0.5 flex-shrink-0" />
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>

          {/* Founder Section - Text Only Focus */}
          <motion.div 
            variants={fadeUpContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="bg-gradient-to-b from-[#07111F] to-[#0B1628] rounded-[28px] overflow-hidden shadow-2xl relative border border-white/10"
          >
            {/* Artistic background blur elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#E7B936]/5 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] -ml-48 -mb-48 pointer-events-none" />

            <div className="relative z-10 p-8 sm:p-12 md:p-20 flex flex-col items-center text-center">
              <div className="mb-12 max-w-3xl">
                <motion.div variants={fadeUpItem} className="inline-block px-5 py-2 rounded-full bg-[#E7B936]/10 text-[#E7B936] text-xs font-black uppercase tracking-[0.25em] mb-8 border border-[#E7B936]/20">
                  NGƯỜI SÁNG LẬP
                </motion.div>
                <motion.h2 variants={fadeUpItem} className="text-3xl md:text-5xl font-black text-white mb-8 font-display tracking-tight uppercase leading-tight">
                  THẦY <span className="text-[#E7B936]">TRẦN ĐÔNG</span>
                </motion.h2>
                <motion.div variants={fadeUpItem} className="space-y-6">
                  <p className="text-slate-300 text-lg md:text-xl leading-relaxed font-light">
                    Tên đầy đủ: <span className="text-white font-bold">Trần Văn Đông</span>. 
                  </p>
                  <p className="text-slate-400 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
                    Thầy là nhà đào tạo, chuyên nghiên cứu và triển khai ứng dụng AI trong giáo dục. Thầy tập trung đào tạo giáo viên, phát triển học liệu số và xây dựng các mô hình dạy học hiện đại.
                  </p>
                  <div className="w-16 h-1 bg-[#E7B936] mx-auto opacity-30 my-4" />
                  <p className="text-slate-400 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
                    EDUNEXA được thầy sáng lập với mục tiêu tạo ra một hệ sinh thái giáo dục giúp giáo viên và người học thích nghi nhanh với sự thay đổi của thời đại.
                  </p>
                </motion.div>
              </div>

              {/* Social Channels - Centered Grid */}
              <motion.div 
                variants={fadeUpContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-5xl"
              >
                <motion.a 
                  variants={fadeUpCard}
                  whileHover={{ y: -3, scale: 1.02 }}
                  href="https://www.facebook.com/tranvandong.vietnam" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-center gap-4 bg-white/5 hover:bg-white/10 text-white px-6 py-5 rounded-2xl transition-all border border-white/10 group backdrop-blur-sm"
                >
                  <Users className="w-6 h-6 text-[#E7B936] group-hover:scale-110 transition-transform" />
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] text-[#E7B936] uppercase font-black tracking-widest">Facebook</span>
                    <span className="text-sm font-bold">Trần Đông</span>
                  </div>
                </motion.a>
                <motion.div 
                  variants={fadeUpCard}
                  className="flex items-center justify-center gap-4 bg-white/5 text-white px-6 py-5 rounded-2xl border border-white/10 backdrop-blur-sm"
                >
                  <MessageCircle className="w-6 h-6 text-[#E7B936]" />
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] text-[#E7B936] uppercase font-black tracking-widest">Hotline / Zalo</span>
                    <span className="text-sm font-bold">094 456 2096</span>
                  </div>
                </motion.div>
                <motion.a 
                  variants={fadeUpCard}
                  whileHover={{ y: -3, scale: 1.02 }}
                  href="https://www.tiktok.com/@trn.ng_ai.trainer" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-center gap-4 bg-white/5 hover:bg-white/10 text-white px-6 py-5 rounded-2xl transition-all border border-white/10 group backdrop-blur-sm"
                >
                  <PlayCircle className="w-6 h-6 text-[#E7B936] group-hover:scale-110 transition-transform" />
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] text-[#E7B936] uppercase font-black tracking-widest">TikTok</span>
                    <span className="text-sm font-bold">@trn.ng_ai.trainer</span>
                  </div>
                </motion.a>
                <motion.a 
                  variants={fadeUpCard}
                  whileHover={{ y: -3, scale: 1.02 }}
                  href="https://www.youtube.com/@AITrainer.Offical" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-center gap-4 bg-white/5 hover:bg-white/10 text-white px-6 py-5 rounded-2xl transition-all border border-white/10 group backdrop-blur-sm"
                >
                  <MonitorPlay className="w-6 h-6 text-[#E7B936] group-hover:scale-110 transition-transform" />
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] text-[#E7B936] uppercase font-black tracking-widest">Youtube</span>
                    <span className="text-sm font-bold">@AITrainer.Offical</span>
                  </div>
                </motion.a>
              </motion.div>
              
              <motion.div variants={fadeUpItem} className="mt-14 p-6 sm:p-8 bg-white/5 rounded-2xl border border-white/10 max-w-3xl w-full">
                <p className="text-[#E7B936] font-medium italic text-lg md:text-xl leading-relaxed">
                  "EDUNEXA đồng hành cùng Thầy Cô trong hành trình đổi mới giáo dục và làm chủ công nghệ trong dạy học."
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Courses Preview Section */}
      <section ref={sectionRef} className="py-28 bg-[#F8FAFC] relative overflow-hidden border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8 relative z-10">
          <motion.div 
            variants={fadeUpContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14"
          >
            <div>
              <motion.div variants={fadeUpItem} className="inline-block px-4 py-1.5 rounded-full bg-[#E7B936]/10 text-[#E7B936] text-xs font-bold uppercase tracking-[0.25em] mb-3 border border-[#E7B936]/25">
                CHƯƠNG TRÌNH ĐÀO TẠO
              </motion.div>
              <motion.h2 variants={fadeUpItem} className="text-3xl md:text-4xl font-black text-[#07111F] font-display">Hệ Sinh Thái Khóa Học</motion.h2>
              <motion.p variants={fadeUpItem} className="text-slate-600 max-w-2xl text-base mt-2">Phát triển từng bước, chắc chắn và bền vững với các chương trình từ nền tảng đến chuyên sâu.</motion.p>
            </div>
            <motion.button 
              variants={fadeUpItem}
              onClick={() => navigateTo('courses')}
              className="inline-flex items-center text-sm font-bold text-[#07111F] hover:text-[#E7B936] transition-colors py-2 px-4 rounded-lg bg-white border border-slate-200 shadow-xs hover:border-[#E7B936]/50 self-start sm:self-auto cursor-pointer"
            >
              Xem tất cả <ChevronRight className="w-4 h-4 ml-1 text-[#E7B936]" />
            </motion.button>
          </motion.div>

          <motion.div 
            variants={fadeUpContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {courses.slice(0, visibleCourses).map((course, index) => {
              const y = index % 3 === 0 ? y1 : index % 3 === 1 ? y2 : y3;
              return (
                <motion.div key={course.id} style={{ y }} className="h-full">
                  <motion.div variants={fadeUpCard} className="h-full">
                    <CourseCard course={course} navigateTo={navigateTo} onSelectCourse={onSelectCourse} />
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
          
          {visibleCourses < courses.length && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-16 text-center"
            >
              <button 
                onClick={handleLoadMore}
                className="inline-flex items-center px-8 py-3.5 border-2 border-[#07111F] text-[#07111F] font-bold rounded-xl hover:bg-[#07111F] hover:text-white transition-all duration-200 shadow-sm hover:shadow-md group text-sm cursor-pointer"
              >
                Xem thêm khóa học 
                <motion.span
                  animate={{ y: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="ml-2"
                >
                  <ChevronRight className="w-4 h-4 rotate-90" />
                </motion.span>
              </button>
            </motion.div>
          )}
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-28 bg-[#0B1628] text-white border-t border-slate-800/80 relative overflow-hidden">
        {/* Subtle Ambient Radial Lighting */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(37,99,235,0.12),transparent_70%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8 relative z-10">
          <motion.div 
            variants={fadeUpContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="text-center mb-16"
          >
            <motion.div variants={fadeUpItem} className="inline-block px-4 py-1.5 rounded-full bg-[#E7B936]/10 text-[#E7B936] text-xs font-bold uppercase tracking-[0.25em] mb-4 border border-[#E7B936]/25">
              ĐÁNH GIÁ THỰC TẾ
            </motion.div>
            <motion.h2 variants={fadeUpItem} className="text-3xl md:text-4xl font-black text-white font-display">Chia Sẻ Từ Học Viên</motion.h2>
            <motion.p variants={fadeUpItem} className="text-slate-400 max-w-2xl mx-auto mt-3 text-base">Những câu chuyện thật từ các thầy cô đã và đang đồng hành cùng EDUNEXA trong hành trình chuyển đổi số.</motion.p>
          </motion.div>

          <div className="relative">
            <motion.div 
              variants={fadeUpContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {testimonials.map((t, idx) => (
                <motion.div 
                  key={t.id}
                  variants={fadeUpCard}
                  whileHover={{ y: -6 }}
                  className="bg-[#07111F]/90 p-8 rounded-[22px] shadow-xl border border-white/10 flex flex-col h-full relative backdrop-blur-sm hover:border-[#E7B936]/30 transition-all duration-300"
                >
                  <Quote className="absolute top-6 right-8 w-10 h-10 text-[#E7B936]/15" />
                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#E7B936] text-[#E7B936]" />
                    ))}
                  </div>
                  <p className="text-slate-300 italic mb-8 flex-grow leading-relaxed text-sm sm:text-base">
                    "{t.quote}"
                  </p>
                  <div className="flex items-center gap-4 pt-6 border-t border-white/10">
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
                      className="w-12 h-12 rounded-full object-cover border-2 border-[#E7B936]/40 shadow-sm"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="font-bold text-white text-base">{t.name}</h4>
                      <p className="text-xs text-slate-400">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CTA Bottom */}
      <section className="py-24 bg-gradient-to-r from-[#E7B936] via-[#DEAC27] to-[#D4A526] text-[#07111F] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.2),transparent_60%)] pointer-events-none" />
        <motion.div 
          variants={fadeUpContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="relative max-w-4xl mx-auto px-6 sm:px-8 text-center z-10"
        >
          <motion.h2 variants={fadeUpItem} className="text-3xl md:text-4xl lg:text-5xl font-black text-[#07111F] mb-6 font-display leading-tight">
            Sẵn Sàng Cùng EDUNEXA Bước Vào Kỷ Nguyên Giáo Dục Mới?
          </motion.h2>
          <motion.p variants={fadeUpItem} className="text-[#07111F]/85 text-base sm:text-lg mb-10 max-w-2xl mx-auto font-medium">
            Hãy lựa chọn khóa học phù hợp để bắt đầu hành trình ứng dụng AI chuyên nghiệp và đầy cảm hứng.
          </motion.p>
          <motion.button 
             variants={fadeUpItem}
             onClick={() => navigateTo('courses')}
             className="bg-[#07111F] hover:bg-[#0B1628] text-white px-10 py-4 h-[54px] rounded-xl font-bold text-base transition-all duration-250 shadow-2xl hover:shadow-[0_20px_40px_rgba(7,17,31,0.4)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            Bắt Đầu Hành Trình Cùng EDUNEXA
          </motion.button>
        </motion.div>
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
    <div className="bg-[#F8FAFC] min-h-screen py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full bg-[#E7B936]/10 text-[#E7B936] text-xs font-bold uppercase tracking-[0.25em] mb-3 border border-[#E7B936]/25">
            CHƯƠNG TRÌNH ĐÀO TẠO
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[#07111F] mb-5 font-display tracking-tight">Hệ Sinh Thái Khóa Học AI</h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Khám phá các chương trình đào tạo từ cơ bản đến chuyên sâu, được thiết kế riêng cho giáo viên Việt Nam để làm chủ kỷ nguyên trí tuệ nhân tạo.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-16 relative">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#E7B936] transition-colors" />
            <input 
              type="text"
              placeholder="Tìm kiếm khóa học (tên khóa học, nội dung...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-10 py-4 bg-white border border-slate-200 rounded-xl shadow-xs focus:outline-none focus:ring-2 focus:ring-[#E7B936]/30 focus:border-[#E7B936] transition-all text-[#07111F] text-sm font-medium"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                aria-label="Xóa từ khóa tìm kiếm"
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
          <div className="text-center py-20 bg-white rounded-[20px] border border-dashed border-slate-200 p-8">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-[#07111F] mb-2 font-display">Không tìm thấy khóa học nào</h3>
            <p className="text-slate-500 text-sm">Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc.</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="mt-5 text-[#E7B936] font-bold text-sm hover:underline"
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
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] transition-all duration-300 border border-slate-200/80 hover:border-slate-300 overflow-hidden flex flex-col h-full group"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
        <img 
          src={course.image} 
          alt={course.title} 
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]" 
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
        
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          <span className="bg-[#07111F]/90 backdrop-blur-xs text-white px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider shadow-sm border border-white/10">
            {course.target}
          </span>
          {isSpecial && (
            <span className="bg-[#E7B936] text-[#07111F] px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider shadow-sm">
              HOT OFFER
            </span>
          )}
        </div>
      </div>
      <div className="p-7 flex flex-col flex-grow bg-white">
        <div className="flex items-start gap-3.5 mb-3.5">
          <div className="p-2.5 bg-[#F8FAFC] rounded-xl border border-slate-100 group-hover:bg-[#E7B936]/10 transition-colors flex-shrink-0">
            {course.icon}
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-[#07111F] leading-snug font-display line-clamp-2">{course.title}</h3>
            <p className="text-[#E7B936] text-xs font-bold uppercase tracking-wider mt-1">{course.subtitle}</p>
          </div>
        </div>
        
        <p className="text-slate-500 text-sm mb-6 flex-grow leading-relaxed line-clamp-3">
          {course.description}
        </p>
        
        <div className="pt-5 border-t border-slate-100 mt-auto">
          <div className="flex justify-between items-end mb-5">
            <div className="flex flex-col">
              <span className="text-slate-400 text-xs line-through font-medium">{course.originalPrice}</span>
              <span className="text-2xl font-black text-[#07111F] font-display">{course.price}</span>
            </div>
            <div className="text-[#E7B936] transform group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
          
          <div className="grid grid-cols-1">
            <button 
              onClick={() => navigateTo(`course-${course.id}`)}
              className="w-full bg-[#07111F] hover:bg-[#1E293B] text-white h-[48px] rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
            >
              <span>Đăng Ký & Nhận Quà</span>
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

  if (!course) return <div className="py-40 text-center text-slate-400">Khóa học không tồn tại.</div>;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistered(true);
  };

  return (
    <div className="bg-[#F8FAFC]">
      {/* Hero Section */}
      <section className="relative pt-20 pb-24 lg:pt-28 lg:pb-32 bg-[#07111F] overflow-hidden border-b border-slate-800/40">
        {/* Subtle Ambient Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-[#07111F] via-[#0B1628] to-[#07111F]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(37,99,235,0.18),transparent_70%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-60" />
        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-[#E7B936]/15 border border-[#E7B936]/40 text-[#E7B936] font-bold text-xs uppercase tracking-[0.2em]">
              {course.subtitle}
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white mb-6 max-w-4xl mx-auto leading-tight font-display tracking-tight">
              {course.title}
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
              {course.description}
            </p>
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => document.getElementById('register-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-[#E7B936] hover:bg-[#d8a829] text-[#07111F] px-10 py-4 h-[54px] rounded-xl font-bold text-base transition-all shadow-[0_12px_32px_rgba(231,185,54,0.3)] hover:-translate-y-0.5 active:translate-y-0"
              >
                Đăng Ký Ngay
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pains Section */}
      <section className="py-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 rounded-full bg-rose-500/10 text-rose-600 text-xs font-bold uppercase tracking-[0.25em] mb-3 border border-rose-500/20">
              VẤN ĐỀ THƯỜNG GẶP
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-[#07111F] mb-4 font-display">
              {course.id === 'coaching-chuyen-biet' ? '1. Bạn Có Đang Gặp Những Vấn Đề Này?' : 'Bạn Có Đang Gặp Những Vấn Đề Này?'}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {course.pains.map((pain: string, idx: number) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-7 rounded-[20px] shadow-sm border border-slate-200/80 relative overflow-hidden flex flex-col hover:shadow-md transition-shadow"
              >
                <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-500"></div>
                <XCircle className="w-9 h-9 text-rose-500 mb-4" />
                <p className="text-slate-700 font-medium text-sm leading-relaxed">{pain}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-24 bg-white border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8 flex flex-col lg:flex-row items-center gap-14">
          <div className="w-full lg:w-1/2">
            <div className="relative rounded-[24px] overflow-hidden p-2 bg-[#07111F] shadow-2xl">
              <motion.img 
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                src={course.image} 
                alt={course.title} 
                className="rounded-[18px] w-full aspect-video object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <div className="inline-block px-4 py-1.5 rounded-full bg-[#E7B936]/10 text-[#E7B936] text-xs font-bold uppercase tracking-[0.25em] mb-4 border border-[#E7B936]/25">
              GIẢI PHÁP TỐI ƯU
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-[#07111F] mb-4 font-display leading-tight">
              {course.id === 'coaching-chuyen-biet' 
                ? '2. Khóa Học Sẽ Mang Lại Cho Bạn thêm nhiều hơn' 
                : course.id.includes('cam-nang') 
                  ? 'Cẩm nang Sẽ Mang Lại Cho Bạn' 
                  : 'Khóa Học Sẽ Mang Lại Cho Bạn'}
            </h2>
            <p className="text-slate-600 mb-8 text-base leading-relaxed">Lộ trình bài bản giúp biến AI thành trợ lý đắc lực, ứng dụng ngay vào công việc thực tế.</p>
            <ul className="space-y-4">
              {course.solutions.map((item: string, idx: number) => (
                <motion.li 
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-[#E7B936] flex-shrink-0 mt-0.5" />
                  <span className="text-slate-800 text-base font-medium">{item}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Specific Pillars for 'bo-tai-lieu-quan-trong' */}
      {course.id === 'bo-tai-lieu-quan-trong' && (
        <section className="py-24 bg-[#F8FAFC] relative">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black text-[#07111F] mb-3 font-display uppercase tracking-tight">Hệ Thống 3 Trụ Cột Cốt Lõi</h2>
              <p className="text-sm sm:text-base text-slate-500 uppercase tracking-widest font-bold">Học nhanh - Làm được - Dùng ngay</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 rounded-[24px] overflow-hidden">
              {[
                { 
                  num: '01', 
                  title: 'LÀM NHANH VIỆC BẮT BUỘC', 
                  desc: 'Soạn giáo án, đề kiểm tra, viết SKKN nhanh gấp 5 lần với quy trình AI tối ưu.',
                  color: 'bg-white border border-slate-200/80',
                  textColor: 'text-[#07111F]'
                },
                { 
                  num: '02', 
                  title: 'LÀM TỐT VIỆC TRÊN LỚP', 
                  desc: 'Tự tay thiết kế trò chơi học tập, mô phỏng 3D và thí nghiệm ảo sinh động.',
                  color: 'bg-[#E7B936] shadow-xl',
                  textColor: 'text-[#07111F]'
                },
                { 
                  num: '03', 
                  title: 'LÀM HAY VIỆC TRUYỀN ĐẠT', 
                  desc: 'Biến bài giảng thành video hoạt hình, phim giáo dục lôi cuốn và đầy cảm hứng.',
                  color: 'bg-[#07111F] text-white shadow-xl',
                  textColor: 'text-white'
                }
              ].map((pillar, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className={`${pillar.color} p-10 rounded-[22px] flex flex-col items-center text-center`}
                >
                  <span className={`text-5xl font-black mb-5 opacity-25 font-display`}>{pillar.num}</span>
                  <h3 className={`text-lg font-black mb-4 font-display tracking-tight leading-tight ${pillar.textColor}`}>{pillar.title}</h3>
                  <p className={`text-sm leading-relaxed ${pillar.textColor === 'text-white' ? 'text-slate-300' : 'text-slate-600'}`}>{pillar.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Curriculum Section */}
      <section className="py-24 bg-[#07111F] text-white border-t border-slate-800/80">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 rounded-full bg-[#E7B936]/10 text-[#E7B936] text-xs font-bold uppercase tracking-[0.25em] mb-3 border border-[#E7B936]/25">
              LỘ TRÌNH ĐÀO TẠO
            </div>
            <h2 className="text-3xl md:text-4xl font-black mb-4 font-display">Nội Dung Chương Trình Học</h2>
          </div>
          <div className="space-y-4">
            {course.curriculum.map((module: any, idx: number) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="bg-[#0B1628] border border-slate-800 p-6 rounded-[20px] flex items-center gap-6 hover:border-[#E7B936]/50 transition-all shadow-md"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#07111F] flex flex-col items-center justify-center flex-shrink-0 border border-slate-700/60 shadow-xs">
                  <span className="text-[#E7B936] font-black text-sm">M.{idx+1}</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1 font-display">{module.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{module.desc || "Bao gồm lý thuyết cốt lõi và thực hành ra sản phẩm thật."}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gifts Section */}
      <section className="py-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 rounded-full bg-[#E7B936]/10 text-[#E7B936] text-xs font-bold uppercase tracking-[0.25em] mb-3 border border-[#E7B936]/25">
              ĐẶC QUYỀN
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-[#07111F] mb-3 font-display">
              {course.id === 'coaching-chuyen-biet' 
                ? 'Quà Tặng Đặc Biệt: Khóa học AI Toàn Diện' 
                : 'Quà Tặng Đặc Biệt'}
            </h2>
            <p className="text-slate-600 text-base">
              {course.id === 'coaching-chuyen-biet' 
                ? 'Bộ quà tặng gồm: Toàn bộ các học liệu độc quyền của EDUNEXA' 
                : 'Dành riêng cho học viên đăng ký trong tháng này'}
            </p>
          </div>
          <div className={`grid grid-cols-1 ${course.gifts.length === 1 ? 'md:grid-cols-1 max-w-2xl mx-auto' : 'md:grid-cols-3'} gap-6`}>
            {course.gifts.map((gift: string, idx: number) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-8 rounded-[20px] shadow-sm border border-[#E7B936]/30 text-center hover:shadow-md transition-shadow flex flex-col items-center justify-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#E7B936]/10 flex items-center justify-center mb-5 border border-[#E7B936]/20">
                  <Award className="w-7 h-7 text-[#E7B936]" />
                </div>
                <p className="text-[#07111F] font-bold text-base leading-relaxed">{gift}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Form & Payment */}
      <section id="register-form" className="py-24 bg-white border-t border-slate-200/60">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-8">
          <div className="bg-white rounded-[28px] shadow-2xl overflow-hidden border border-slate-200/80 flex flex-col md:flex-row">
            {/* Payment Info */}
            <div className="bg-gradient-to-b from-[#07111F] to-[#0B1628] w-full md:w-2/5 p-8 sm:p-10 text-white flex flex-col justify-center relative overflow-hidden border-b md:border-b-0 md:border-r border-slate-800">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#E7B936]/10 rounded-bl-full pointer-events-none" />
              <h3 className="text-xl sm:text-2xl font-bold mb-4 relative z-10 font-display">Đầu tư cho sự nghiệp</h3>
              <div className="mb-6 relative z-10">
                <span className="text-slate-400 line-through text-base">{course.originalPrice}</span>
                <div className="text-3xl sm:text-4xl font-black text-[#E7B936] mt-1 font-display">{course.price}</div>
              </div>
              <div className="p-5 bg-white/5 rounded-2xl border border-white/10 mb-6 relative z-10">
                {course.price !== 'Liên hệ' && (
                  <div className="mb-5 flex flex-col items-center">
                    <p className="text-xs text-[#E7B936] font-bold uppercase mb-2 text-center tracking-wider">Quét mã QR để thanh toán</p>
                    <div className="bg-white p-3 rounded-xl shadow-lg w-full max-w-[200px]">
                      <img 
                        src="https://img.vietqr.io/image/tcb-8835583558-compact.jpg" 
                        alt="Bank QR Code" 
                        className="w-full h-auto object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                )}
                <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-3">Thông tin {course.price === 'Liên hệ' ? 'liên hệ & ' : ''}thanh toán</p>
                <div className="space-y-3">
                  {course.paymentInfo ? (
                    <div className="text-sm text-white font-medium leading-relaxed">
                      {course.paymentInfo}
                    </div>
                  ) : (
                    <>
                      <div>
                        <p className="text-[10px] text-[#E7B936] font-black uppercase tracking-wider">Ngân hàng</p>
                        <p className="text-sm font-bold text-white">Techcombank (TCB)</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#E7B936] font-black uppercase tracking-wider">Số tài khoản</p>
                        <p className="text-lg font-black tracking-wider text-white">88.3558.3558</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#E7B936] font-black uppercase tracking-wider">Chủ tài khoản</p>
                        <p className="text-xs font-bold uppercase text-white">CONG TY TNHH MTV GIAO DUC EDUNEXA</p>
                      </div>
                      <div className="pt-2 border-t border-white/10">
                        <p className="text-xs text-slate-300 italic font-medium">Nội dung: hoten + sdt + {course.title}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="space-y-3 mb-6 relative z-10">
                <p className="text-[10px] text-slate-400 uppercase tracking-widest">Liên hệ hỗ trợ</p>
                <div className="grid grid-cols-1 gap-2">
                  <a href="https://www.facebook.com/tranvandong.vietnam" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-white hover:text-[#E7B936] transition-colors bg-white/5 p-2 rounded-lg border border-white/10">
                    <Users className="w-3.5 h-3.5 text-[#E7B936]" /> Facebook Thầy Đông
                  </a>
                  <a href="https://www.tiktok.com/@trn.ng_ai.trainer" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-white hover:text-[#E7B936] transition-colors bg-white/5 p-2 rounded-lg border border-white/10">
                    <MessageCircle className="w-3.5 h-3.5 text-[#E7B936]" /> TikTok AI Trainer
                  </a>
                  <div className="flex items-center gap-2 text-xs text-white p-2 rounded-lg bg-white/5 border border-white/10">
                    <Shield className="w-3.5 h-3.5 text-[#E7B936]" /> Hotline: 094 456 2096
                  </div>
                </div>
              </div>
              <ul className="space-y-2 text-xs text-slate-300 relative z-10">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#E7B936]"/> Sở hữu trọn đời</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#E7B936]"/> Hỗ trợ đồng hành 24/7</li>
              </ul>
            </div>
            
            {/* Direct Link Section */}
            <div className="w-full md:w-3/5 p-8 sm:p-12 flex flex-col items-center justify-center text-center bg-white">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md"
              >
                <div className="w-16 h-16 bg-[#E7B936]/15 rounded-2xl flex items-center justify-center mb-6 mx-auto border border-[#E7B936]/25">
                  <FileText className="w-8 h-8 text-[#E7B936]" />
                </div>
                <h3 className="text-2xl font-bold text-[#07111F] mb-4 font-display uppercase tracking-tight">Thông tin đăng ký</h3>
                <p className="text-slate-700 text-base mb-8 leading-relaxed font-medium">
                  Sau khi Thầy Cô đăng ký, hãy điền thông tin vào <span className="text-[#E7B936] font-black">NGAY</span> link này nhé:
                </p>
                
                <a 
                  href="https://forms.gle/drgKvsnKvkACEHbe7" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full bg-[#E7B936] hover:bg-[#d8a829] text-[#07111F] text-center py-4 px-8 h-[54px] rounded-xl font-bold text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 mb-6 group"
                >
                  <FileText className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>ĐIỀN FORM ĐĂNG KÝ</span>
                </a>

                <p className="text-xs text-slate-500 italic">
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
      icon: editingCourse?.icon || <BookOpen className="w-6 h-6 text-[#E7B936]" />,
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
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 sm:p-10 rounded-[24px] shadow-xl w-full max-w-md border border-slate-200/80"
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-[#07111F] rounded-2xl flex items-center justify-center text-[#E7B936] shadow-md border border-slate-700">
              <Lock className="w-8 h-8" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-[#07111F] mb-2 font-display">Khu Vực Quản Trị</h2>
          <p className="text-center text-slate-500 mb-8 text-sm">Vui lòng nhập mật khẩu để tiếp tục.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Mật khẩu</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#E7B936]/30 focus:border-[#E7B936] outline-none transition-all text-sm text-[#07111F]"
                placeholder="••••••••"
                required
              />
            </div>
            {error && <p className="text-rose-500 text-xs font-semibold">{error}</p>}
            <button 
              type="submit"
              className="w-full bg-[#07111F] hover:bg-[#0B1628] text-white py-3.5 h-[50px] rounded-xl font-bold text-sm transition-all shadow-md mt-2"
            >
              Đăng Nhập
            </button>
          </form>
          <button 
            onClick={() => navigateTo('home')}
            className="w-full mt-4 text-slate-500 text-sm hover:text-[#07111F] transition-colors py-2 text-center"
          >
            Quay lại trang chủ
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-[#E7B936] mb-1">
              <Shield className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Admin Dashboard</span>
            </div>
            <h1 className="text-3xl font-black text-[#07111F] font-display">Quản Lý Nội Dung</h1>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => navigateTo('home')}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-xs"
            >
              <Eye className="w-4 h-4" /> Xem Website
            </button>
            <button 
              onClick={() => setIsAdmin(false)}
              className="flex items-center gap-2 px-4 py-2.5 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl text-sm font-semibold hover:bg-rose-100 transition-all"
            >
              <LogOut className="w-4 h-4" /> Đăng Xuất
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Tabs */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-[20px] shadow-xs border border-slate-200/80 overflow-hidden">
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
                      ? 'bg-[#F8FAFC] text-[#E7B936] border-[#E7B936]' 
                      : 'text-slate-600 border-transparent hover:bg-slate-50 hover:text-[#07111F]'
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
                  <h2 className="text-xl font-bold text-[#07111F] font-display">Danh Sách Khóa Học</h2>
                  <button 
                    onClick={() => {
                      setIsAddingCourse(true);
                      setEditingCourse(null);
                    }}
                    className="flex items-center gap-2 bg-[#07111F] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#0B1628] transition-all shadow-md"
                  >
                    <Plus className="w-4 h-4" /> Thêm Khóa Học
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {courses.map((course) => (
                    <div key={course.id} className="bg-white p-6 rounded-[20px] shadow-xs border border-slate-200/80 flex flex-col md:flex-row items-center gap-6">
                      <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-slate-900">
                        <img src={course.image} alt={course.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex-grow text-center md:text-left">
                        <h3 className="text-lg font-bold text-[#07111F] mb-1 font-display">{course.title}</h3>
                        <p className="text-sm text-slate-500 mb-2">{course.subtitle}</p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-3 text-xs">
                          <span className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md font-bold">{course.target}</span>
                          <span className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-md font-bold">{course.price}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setEditingCourse(course)}
                          className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          aria-label="Chỉnh sửa khóa học"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteCourse(course.id)}
                          className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                          aria-label="Xóa khóa học"
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
              <div className="bg-white p-12 rounded-[20px] shadow-xs border border-slate-200/80 text-center">
                <FileText className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[#07111F] mb-2 font-display">Quản Lý Bài Viết</h3>
                <p className="text-slate-500 text-sm">Tính năng này đang được phát triển. Bạn có thể thêm, sửa, xóa các bài viết và học liệu số tại đây.</p>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white p-12 rounded-[20px] shadow-xs border border-slate-200/80 text-center">
                <Settings className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[#07111F] mb-2 font-display">Cài Đặt Landing Page</h3>
                <p className="text-slate-500 text-sm">Chỉnh sửa nội dung Hero, Stats, và các section khác trên trang chủ.</p>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="bg-white p-8 rounded-[20px] shadow-xs border border-slate-200/80 max-w-md mx-auto">
                <h3 className="text-xl font-bold text-[#07111F] mb-6 font-display flex items-center gap-2">
                  <Shield className="w-6 h-6 text-[#E7B936]" /> Thay Đổi Mật Khẩu
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
                    <label className="block text-sm font-medium text-slate-700 mb-1">Mật khẩu hiện tại</label>
                    <input name="currentPassword" type="password" required className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#E7B936] text-sm text-[#07111F]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Mật khẩu mới</label>
                    <input name="newPassword" type="password" required className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#E7B936] text-sm text-[#07111F]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Xác nhận mật khẩu mới</label>
                    <input name="confirmPassword" type="password" required className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#E7B936] text-sm text-[#07111F]" />
                  </div>
                  <button type="submit" className="w-full bg-[#E7B936] text-[#07111F] py-3 rounded-xl font-bold hover:bg-[#d8a829] transition-all shadow-md mt-4 text-sm">
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
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[24px] shadow-2xl p-8 border border-slate-100"
            >
              <h2 className="text-2xl font-bold text-[#07111F] mb-6 font-display">
                {isAddingCourse ? 'Thêm Khóa Học Mới' : 'Chỉnh Sửa Khóa Học'}
              </h2>
              
              <form onSubmit={handleSaveCourse} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">ID Khóa học (slug)</label>
                    <input name="id" defaultValue={editingCourse?.id} required disabled={!isAddingCourse} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#E7B936] disabled:bg-slate-50 text-sm text-[#07111F]" placeholder="ai-toan-dien" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Đối tượng</label>
                    <input name="target" defaultValue={editingCourse?.target} required className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#E7B936] text-sm text-[#07111F]" placeholder="Giáo viên các cấp" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tiêu đề khóa học</label>
                  <input name="title" defaultValue={editingCourse?.title} required className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#E7B936] text-sm text-[#07111F]" placeholder="AI Toàn Diện Cho Giáo Viên" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tiêu đề phụ (Subtitle)</label>
                  <input name="subtitle" defaultValue={editingCourse?.subtitle} required className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#E7B936] text-sm text-[#07111F]" placeholder="Khóa học nền tảng chủ lực" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Mô tả ngắn</label>
                  <textarea name="description" defaultValue={editingCourse?.description} required className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#E7B936] h-24 text-sm text-[#07111F]" placeholder="Mô tả ngắn gọn về khóa học..."></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Giá ưu đãi</label>
                    <input name="price" defaultValue={editingCourse?.price} required className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#E7B936] text-sm text-[#07111F]" placeholder="1.490.000đ" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Giá gốc</label>
                    <input name="originalPrice" defaultValue={editingCourse?.originalPrice} required className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#E7B936] text-sm text-[#07111F]" placeholder="2.500.000đ" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">URL Hình ảnh</label>
                  <input name="image" defaultValue={editingCourse?.image} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#E7B936] text-sm text-[#07111F]" placeholder="https://..." />
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                  <button 
                    type="button"
                    onClick={() => {
                      setEditingCourse(null);
                      setIsAddingCourse(false);
                    }}
                    className="px-6 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition-all"
                  >
                    Hủy
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-2.5 bg-[#E7B936] text-[#07111F] rounded-xl text-sm font-bold hover:bg-[#d8a829] transition-all shadow-md"
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
