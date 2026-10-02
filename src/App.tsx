/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, X, ChevronRight, CheckCircle2, PlayCircle, 
  BookOpen, Users, Star, Award, ArrowRight, ArrowLeft, XCircle, ArrowUp,
  MonitorPlay, Layout, Gamepad2, Briefcase, Quote, Search, Image as ImageIcon, Box,
  Plus, Edit, Trash2, Settings, FileText, Eye, EyeOff, LogOut, Lock, Shield, MessageCircle, Globe,
  Workflow, Sparkles, Zap, Database, Bot, Video, Clock, AlertCircle,
  BrainCircuit, BookOpenCheck, Presentation, FlaskConical, Smartphone, Palette, Clapperboard, Boxes, WandSparkles,
  ChevronDown, ChevronUp, Check, HelpCircle,
  TrendingUp, TrendingDown, Activity, BarChart3, PieChart as PieChartIcon, Calendar, Filter, ArrowUpRight, UserCheck, Download, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
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
    price: '299.000đ',
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
    gifts: ['Toàn bộ "CÁC CÂU LỆNH QUAN TRỌNG" (Mới nhất)', 'Kèm Video Buổi Học', 'Học và được xem lại các buổi đã học trong năm 2026'],
    paymentInfo: 'Techcombank (TCB) - STK: 88.3558.3558 - Chủ TK: CONG TY TNHH MTV GIAO DUC EDUNEXA - Nội dung: hoten + sdt + TAI LIEU 3 NGAY',
    qrImage: 'https://lh3.googleusercontent.com/d/1X5l_t1W_p_h4y3_8_v-8_v-8_v-8_v-8=w800' // Placeholder for the uploaded QR code
  },
  {
    id: 'ai-soan-giang-ho-tro-day-hoc',
    title: 'AI Trong Soạn Giảng Và Hỗ Trợ Dạy Học',
    subtitle: 'Khóa học E-Learning thực chiến',
    description: 'Làm chủ AI để soạn giáo án, tạo đề kiểm tra, viết SKKN, thiết kế slide tự động và tạo trợ lý ảo chuyên sâu.',
    fullDescription: 'Khóa học đào toàn diện kỹ năng sử dụng AI trong nghiệp vụ sư phạm hàng ngày, giúp giáo viên giải phóng sức lao động và nâng cao chất lượng giảng dạy.',
    image: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=1200&q=80',
    target: 'Giáo viên mọi cấp học',
    price: '399.000đ',
    originalPrice: '1.500.000đ',
    icon: <MonitorPlay className="w-6 h-6 text-[#D4AF37]" />,
    benefits: ['Quy trình thực hành 11 bước chuẩn hóa', 'Có nhóm Zalo hỏi đáp và đồng hành', 'Video bài giảng xem lại trọn đời'],
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
    id: 'ai-toan-dien-cho-giao-vien',
    title: 'AI Toàn Diện Cho Giáo Viên',
    subtitle: 'Làm chủ trọn bộ AI Sư phạm từ A-Z',
    description: 'Khóa học tổng lực bao gồm trọn vẹn 10 chuyên đề thực chiến: từ Nền tảng quan trọng, Nghiệp vụ soạn giảng, Tạo Slide, Trợ lý ảo, Trò chơi, Thí nghiệm ảo, Mô phỏng 3D, App giáo dục, Canva AI đến Tạo Video AI giáo dục.',
    fullDescription: 'Chương trình đào tạo AI toàn diện và chuyên sâu nhất dành cho giáo viên Việt Nam gồm 10 chuyên đề thực chiến "Cầm tay chỉ việc", tích hợp toàn bộ các năng lực số và công cụ AI tân tiến nhất hiện nay, giúp Thầy Cô tự động hóa công việc hành chính và đổi mới phương pháp giảng dạy.',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80',
    target: 'Giáo viên mọi cấp học & Cán bộ quản lý',
    price: '999.000đ',
    originalPrice: '1.999.000đ',
    icon: <Sparkles className="w-6 h-6 text-[#D4AF37]" />,
    benefits: [
      'Trọn bộ 10 chuyên đề thực chiến theo đúng lộ trình',
      'Làm chủ soạn giảng, slide, trợ lý, game, 3D, app và video AI',
      'Có nhóm Zalo hỏi đáp và đồng hành',
      'Tặng trọn bộ Siêu App Sư Phạm & Kho Prompt VVIP'
    ],
    pains: [
      'Học nhiều khóa học rời rạc, chắp vá, tốn kém chi phí nhưng không liên kết được thành hệ thống.',
      'Áp lực hồ sơ sổ sách, soạn giáo án chuẩn 5512, ma trận đề thi và SKKN chiếm hết thời gian nghỉ ngơi.',
      'Tiết học khô khan, học sinh thiếu hào hứng, khó duy trì sự tập trung trong giờ học.',
      'Muốn làm video bài giảng sinh động, học liệu số cuốn hút nhưng không rành kỹ thuật dựng phim.',
      'Bị ngợp giữa hàng trăm công cụ AI mới xuất hiện mỗi tuần, không biết ứng dụng công cụ nào phù hợp với giáo dục.',
      'Thiếu tài liệu thực hành và sự đồng hành, gặp lỗi kỹ thuật không biết hỏi ai.'
    ],
    solutions: [
      'Làm chủ hệ thống 10 chuyên đề AI thực chiến độc quyền, ứng dụng ngay vào giảng dạy thực tế.',
      'Tiết kiệm 80% thời gian soạn bài, tạo đề kiểm tra ma trận và phiếu học tập tự động.',
      'Nâng cấp tiết học thành sân chơi sáng tạo với kho trò chơi tương tác và mô phỏng 3D sinh động.',
      'Tự tay sản xuất các loại video AI giáo dục chuyên nghiệp, không cần lộ mặt hay biết dựng video phức tạp.',
      'Sở hữu trợ lý AI thông minh riêng cho từng bộ môn, hỗ trợ chuyên môn 24/7.',
      'Được cung cấp trọn bộ câu lệnh chuẩn hóa và nhóm Zalo đồng hành giải đáp thắc mắc liên tục.'
    ],
    curriculum: [
      { 
        mod: 'Chuyên đề 01', 
        title: 'Nền tảng quan trọng', 
        desc: 'Nắm vững bản chất AI trong giáo dục, tư duy ra lệnh (Prompt Engineering) chuẩn bối cảnh sư phạm, làm chủ ChatGPT, Claude và Gemini.',
        icon: <BrainCircuit className="w-6 h-6 text-[#D4AF37]" /> 
      },
      { 
        mod: 'Chuyên đề 02', 
        title: 'Nghiệp vụ soạn giảng', 
        desc: 'Tự động hóa soạn Kế hoạch bài dạy (KHBD) chuẩn 5512, tạo ma trận đề kiểm tra 4 mức độ nhận thức, phiếu học tập và quy trình viết SKKN.',
        icon: <FileText className="w-6 h-6 text-[#D4AF37]" /> 
      },
      { 
        mod: 'Chuyên đề 03', 
        title: 'Tạo Slide tự động', 
        desc: 'Sử dụng AI kết hợp các công cụ chuyên dụng để biến đề cương bài dạy thành slide thuyết trình sinh động, chuyên nghiệp trong vài phút.',
        icon: <Presentation className="w-6 h-6 text-[#D4AF37]" /> 
      },
      { 
        mod: 'Chuyên đề 04', 
        title: 'Tạo Trợ lý ảo', 
        desc: 'Tự tay thiết kế và huấn luyện các trợ lý ảo AI đóng vai gia sư, trợ giảng 24/7 theo từng phân môn học chuyên biệt.',
        icon: <Bot className="w-6 h-6 text-[#D4AF37]" /> 
      },
      { 
        mod: 'Chuyên đề 05', 
        title: 'Tạo Trò chơi học tập', 
        desc: 'Quy trình thiết kế các trò chơi tương tác đa dạng cấp học (khởi động, vượt chướng ngại vật, củng cố kiến thức) cực kỳ sôi nổi.',
        icon: <Gamepad2 className="w-6 h-6 text-[#D4AF37]" /> 
      },
      { 
        mod: 'Chuyên đề 06', 
        title: 'Tạo Thí nghiệm ảo', 
        desc: 'Xây dựng kho thí nghiệm ảo trực quan, an toàn và sinh động ngay trên trình duyệt web phục vụ các bài giảng khoa học.',
        icon: <FlaskConical className="w-6 h-6 text-[#D4AF37]" /> 
      },
      { 
        mod: 'Chuyên đề 07', 
        title: 'Tạo Mô phỏng 3D', 
        desc: 'Biến các kiến thức trừu tượng thành các mô hình và không gian 3D tương tác đa chiều, giúp học sinh dễ hiểu và hứng thú.',
        icon: <Box className="w-6 h-6 text-[#D4AF37]" /> 
      },
      { 
        mod: 'Chuyên đề 08', 
        title: 'Thiết kế APP Giáo dục', 
        desc: 'Tự tay xây dựng các ứng dụng web học tập riêng biệt cho lớp học và bộ môn mà không cần biết bất kỳ dòng mã lập trình nào.',
        icon: <Smartphone className="w-6 h-6 text-[#D4AF37]" /> 
      },
      { 
        mod: 'Chuyên đề 09', 
        title: 'Ứng dụng AI trong Canva', 
        desc: 'Làm chủ Canva AI toàn tập: thiết kế học liệu số, poster sự kiện, truyện tranh và đồ họa giáo dục hiện đại, bắt mắt.',
        icon: <Palette className="w-6 h-6 text-[#D4AF37]" /> 
      },
      { 
        mod: 'Chuyên đề 10', 
        title: 'Tạo Video AI Giáo dục', 
        desc: 'Làm chủ các loại video AI giáo dục: video nhân vật SGK cử động nói chuyện, video vẽ tranh nghệ thuật, anime và kịch bản Veo3.',
        icon: <Clapperboard className="w-6 h-6 text-[#D4AF37]" /> 
      }
    ],
    gifts: [
      '1. Trọn bộ Siêu App Sư Phạm VVIP (STEM, Chấm bài, Vẽ hình học, Tạo Game)',
      '2. Kho 1200+ Trò Chơi Học Tập Tương Tác cho các cấp học',
      '3. Bộ tài nguyên Nhân vật SGK đi đứng nói chuyện cao cấp',
      '4. Bộ Prompt chuẩn hóa cho trọn vẹn 10 chuyên đề thực chiến',
      '5. Có nhóm Zalo hỏi đáp và đồng hành'
    ],
    paymentInfo: 'Techcombank (TCB) - STK: 88.3558.3558 - Chủ TK: CONG TY TNHH MTV GIAO DUC EDUNEXA - Nội dung: hoten + sdt + AI TOAN DIEN'
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
      '4. Có nhóm Zalo hỏi đáp và đồng hành'
    ],
    paymentInfo: 'Techcombank (TCB) - STK: 88.3558.3558 - Chủ TK: CONG TY TNHH MTV GIAO DUC EDUNEXA - Nội dung: hoten + sdt + AI TO CHUC HOAT DONG'
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
      '6. Có nhóm Zalo hỏi đáp và đồng hành'
    ],
    paymentInfo: 'Techcombank (TCB) - STK: 88.3558.3558 - Chủ TK: CONG TY TNHH MTV GIAO DUC EDUNEXA - Nội dung: hoten + sdt + 3 CUON CAM NANG'
  },
  {
    id: 'coaching-chuyen-biet',
    title: 'Chương Trình Coaching: Đồng Hành Chuyên Biệt',
    subtitle: '1-1, Nhóm hoặc Đội ngũ',
    description: 'Chương trình đào tạo cá nhân hóa theo sát nhu cầu thực tế của Thầy Cô hoặc đơn vị giáo dục.',
    fullDescription: 'Cung cấp các gói tư vấn và huấn luyện trực tiếp để giải quyết các vấn đề cụ thể về chuyển đổi số giáo dục và ứng dụng AI cho từng cá nhân hoặc tổ chức.',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
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
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    productImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80',
    productTag: 'Sản phẩm: Bộ KHBD 5512 Ngữ Văn & Tranh minh họa'
  },
  {
    id: 2,
    name: 'Thầy Trần Minh Hoàng',
    role: 'Giảng viên - Đại học Sư phạm Hà Nội',
    quote: 'Nội dung tại EDUNEXA rất thực tế và có chiều sâu học thuật. Đây là nền tảng tốt nhất để các giảng viên tiếp cận với công nghệ giáo dục hiện đại một cách bài bản.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    productImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
    productTag: 'Sản phẩm: Mô phỏng 3D Vật lý & Trắc nghiệm tự động'
  },
  {
    id: 3,
    name: 'Cô Lê Thị Mai',
    role: 'Giáo viên Tiểu học - Vinschool',
    quote: 'Các trò chơi học tập tạo bằng AI khiến học sinh của tôi vô cùng hào hứng. Tiết học trở nên sôi nổi hơn bao giờ hết, và tôi cũng cảm thấy yêu nghề hơn khi có những trợ lý AI đắc lực.',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    productImage: 'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?auto=format&fit=crop&w=600&q=80',
    productTag: 'Sản phẩm: Game khởi động tương tác & Video bài giảng'
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
  const [showMobileStickyCTA, setShowMobileStickyCTA] = useState(true);
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
      <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled ? 'bg-[#07111F]/95 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.4)] border-b border-slate-800/80' : 'bg-[#07111F]/80 backdrop-blur-sm border-b border-slate-800/30'}`}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between items-center h-[72px]">
            {/* Logo */}
            <div 
              className="flex items-center cursor-pointer group"
              onClick={() => navigateTo('home')}
            >
              <span className="text-2xl lg:text-3xl font-black tracking-tight text-white font-display uppercase group-hover:text-[#F2C037] transition-colors">
                EDUNEXA
              </span>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-8 items-center">
              <button 
                onClick={() => navigateTo('home')} 
                className={`text-sm font-semibold transition-all duration-250 py-1 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:transition-all after:duration-250 cursor-pointer ${
                  currentPage === 'home' 
                    ? 'text-[#F2C037] after:w-full after:bg-[#F2C037]' 
                    : 'text-slate-300 hover:text-white after:w-0 hover:after:w-full after:bg-[#F2C037]'
                }`}
              >
                Trang Chủ
              </button>
              <button 
                onClick={() => navigateTo('courses')} 
                className={`text-sm font-semibold transition-all duration-250 py-1 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:transition-all after:duration-250 cursor-pointer ${
                  currentPage === 'courses' 
                    ? 'text-[#F2C037] after:w-full after:bg-[#F2C037]' 
                    : 'text-slate-300 hover:text-white after:w-0 hover:after:w-full after:bg-[#F2C037]'
                }`}
              >
                Khóa Học AI Cho Giáo Viên
              </button>
              <a 
                href="https://www.facebook.com/groups/24037123512640076" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm font-semibold text-slate-300 hover:text-white transition-all duration-250 py-1 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-[#F2C037] after:transition-all after:duration-250"
              >
                Cộng Đồng
              </a>
            </nav>

            {/* Desktop Right CTA: XEM LỘ TRÌNH */}
            <div className="hidden md:flex items-center">
              <button
                onClick={() => {
                  if (currentPage !== 'home') {
                    navigateTo('home');
                    setTimeout(() => {
                      document.getElementById('roadmap-section')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  } else {
                    document.getElementById('roadmap-section')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="px-4 py-2 text-xs font-bold text-[#F2C037] border border-[#F2C037]/60 rounded-xl hover:bg-[#F2C037] hover:text-[#07111F] transition-all cursor-pointer whitespace-nowrap shadow-xs uppercase tracking-wider"
              >
                XEM LỘ TRÌNH
              </button>
            </div>

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
                
                <nav className="flex-grow py-8 px-6 flex flex-col justify-between">
                  <ul className="space-y-6">
                    {[
                      { label: 'Trang Chủ', page: 'home' },
                      { label: 'Khóa Học AI Cho Giáo Viên', page: 'courses' },
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
                            className="text-lg font-bold w-full text-left block text-slate-200 hover:text-[#F2C037] transition-colors"
                          >
                            {item.label}
                          </a>
                        ) : (
                          <button 
                            onClick={() => item.page ? navigateTo(item.page) : setIsMobileMenuOpen(false)}
                            className={`text-lg font-bold w-full text-left transition-colors ${currentPage === item.page ? 'text-[#F2C037]' : 'text-slate-200 hover:text-[#F2C037]'}`}
                          >
                            {item.label}
                          </button>
                        )}
                      </motion.li>
                    ))}
                  </ul>

                  {/* Mobile Drawer CTA button */}
                  <div className="pt-6 border-t border-slate-800">
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        if (currentPage !== 'home') {
                          navigateTo('home');
                          setTimeout(() => {
                            document.getElementById('roadmap-section')?.scrollIntoView({ behavior: 'smooth' });
                          }, 100);
                        } else {
                          document.getElementById('roadmap-section')?.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="w-full py-3.5 px-4 bg-[#F2C037] text-[#07111F] rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      <span>XEM LỘ TRÌNH 10 CHUYÊN ĐỀ</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
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
              Hệ thống các khóa học AI thực chiến dành riêng cho giáo viên, nhà trường và người làm giáo dục, hướng tới nâng cao năng lực nghề nghiệp, tiết kiệm thời gian soạn bài và đồng hành cùng chuyển đổi số.
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
              <li><button onClick={() => navigateTo('courses')} className="hover:text-[#E7B936] transition-colors">Các Khóa Học AI Cho Giáo Viên</button></li>
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
          <button 
            onClick={() => navigateTo('admin')}
            className="text-slate-500 hover:text-[#E7B936] transition-colors flex items-center gap-1.5 cursor-pointer text-xs"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Khu vực Quản trị (Admin Dashboard)</span>
          </button>
        </div>
      </footer>

      {/* Sticky Mobile Bottom CTA */}
      <AnimatePresence>
        {currentPage === 'home' && isScrolled && showMobileStickyCTA && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-[#07111F]/95 backdrop-blur-md border-t border-slate-800 p-3 shadow-2xl flex items-center justify-between gap-3"
          >
            <div className="flex-1 min-w-0 pl-1">
              <p className="text-xs font-bold text-white truncate">CÁC KHÓA HỌC AI CHO GIÁO VIÊN</p>
              <p className="text-[11px] text-[#F2C037] font-semibold truncate">Quy trình thực chiến tạo sản phẩm ngay</p>
            </div>
            <button
              onClick={() => {
                document.getElementById('roadmap-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3.5 py-2 bg-gradient-to-r from-[#F4C430] to-[#E7B936] text-[#07111F] rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 flex-shrink-0 cursor-pointer shadow-md"
            >
              <span>Xem Lộ Trình</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setShowMobileStickyCTA(false)}
              className="p-1.5 text-slate-400 hover:text-white cursor-pointer"
              aria-label="Đóng thanh thông báo"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

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

const COURSE_CATEGORIES: Record<string, string | string[]> = {
  'bo-tai-lieu-quan-trong': 'SOAN_GIANG',
  'ai-soan-giang-ho-tro-day-hoc': 'SOAN_GIANG',
  'ai-toan-dien-cho-giao-vien': ['SOAN_GIANG', 'VIDEO_AI', 'TU_DONG_HOA', 'GAME_APP'],
  'ai-to-chuc-hoat-dong-hoc-tap': 'GAME_APP',
  '03-cuon-cam-nang-toan-dien': 'THIET_KE',
  'coaching-chuyen-biet': 'COACHING'
};

const isCourseInCategory = (courseId: string, categoryId: string) => {
  if (categoryId === 'ALL') return true;
  const cat = COURSE_CATEGORIES[courseId];
  if (!cat) return false;
  if (Array.isArray(cat)) return cat.includes(categoryId);
  return cat === categoryId;
};

const CATEGORIES = [
  { id: 'ALL', label: 'TẤT CẢ' },
  { id: 'SOAN_GIANG', label: 'SOẠN GIẢNG' },
  { id: 'VIDEO_AI', label: 'VIDEO AI' },
  { id: 'GAME_APP', label: 'TRÒ CHƠI & APP' },
  { id: 'TU_DONG_HOA', label: 'TRỢ LÝ & TỰ ĐỘNG HÓA' },
  { id: 'THIET_KE', label: 'THIẾT KẾ' },
  { id: 'COACHING', label: 'ĐỒNG HÀNH 1-1' }
];

// FAQ Schema.org Structured Data & Data Source
const HOMEPAGE_FAQS = [
  {
    q: 'Tôi chưa từng biết hoặc dùng AI có học được không?',
    a: 'Hoàn toàn học được! Các chương trình tại EDUNEXA được thiết kế theo phương pháp "Cầm tay chỉ việc", sử dụng hoàn toàn tiếng Việt, hướng dẫn từ tư duy cơ bản, có mẫu câu lệnh sẵn và video xem lại để Thầy Cô thực hành theo từng bước.'
  },
  {
    q: 'Tôi không biết lập trình thì có tạo được Web App và Trò chơi không?',
    a: 'Chắc chắn được. EDUNEXA hướng dẫn Thầy Cô cách điều khiển AI viết mã và đóng gói thành sản phẩm mà không cần Thầy Cô phải tự viết bất kỳ dòng code nào.'
  },
  {
    q: 'Tôi chỉ dùng tài khoản AI miễn phí thì có học và thực hành được không?',
    a: 'Hoàn toàn được. Các quy trình giảng dạy tại EDUNEXA ưu tiên tối đa các công cụ AI có phiên bản miễn phí (ChatGPT Free, Gemini, Claude, Canva Education...) để bất kỳ giáo viên nào cũng có thể ứng dụng ngay.'
  },
  {
    q: 'Khóa học có phù hợp với giáo viên lớn tuổi hoặc không rành công nghệ không?',
    a: 'Rất phù hợp. Rất nhiều học viên của EDUNEXA là các thầy cô trên 45, 50 tuổi. Nhịp điệu bài giảng chậm rãi, tập trung vào thao tác thực tiễn và có đội ngũ trợ giảng hỗ trợ qua nhóm Zalo 24/7.'
  },
  {
    q: 'Tôi dạy môn đặc thù (Âm nhạc, Mỹ thuật, GDCD, Mầm non,...) thì áp dụng thế nào?',
    a: 'AI được ứng dụng cho toàn bộ các môn học: từ Ngữ văn, Lịch sử, Địa lý (tạo truyện tranh, video tranh cổ) đến Toán, Lý, Hóa, Sinh (mô phỏng 3D, đề thi trắc nghiệm, thí nghiệm ảo) và Mầm non/Tiểu học (trò chơi sinh động, phiếu bài tập hình ảnh trực quan).'
  },
  {
    q: 'Học xong có tự làm được sản phẩm thực tế để dạy trên lớp không?',
    a: 'Cam kết 100% Thầy Cô tự tay làm ra sản phẩm ngay trong buổi học. Có sản phẩm thực tế (kế hoạch bài dạy, slide trình chiếu, video bài giảng, minigame) để ứng dụng vào giảng dạy ngay ngày hôm sau.'
  },
  {
    q: 'Khóa học được học lại và hỗ trợ sau khóa học như thế nào?',
    a: 'Thầy Cô được sở hữu tài nguyên và video bài giảng trọn đời, xem lại bất cứ lúc nào trên hệ thống E-Learning và được tham gia nhóm Zalo cộng đồng giáo viên để được hỗ trợ chuyên môn 24/7.'
  }
];

const HOMEPAGE_FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": HOMEPAGE_FAQS.map(item => ({
    "@type": "Question",
    "name": item.q,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": item.a
    }
  }))
};

// 1. HOME PAGE VIEW
function HomeView({ navigateTo, onSelectCourse, courses }: { navigateTo: (p: string) => void, onSelectCourse: (c: any) => void, courses: any[] }) {
  const [visibleCourses, setVisibleCourses] = useState(6);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -150]);

  const filteredCourses = selectedCategory === 'ALL'
    ? courses
    : courses.filter(c => isCourseInCategory(c.id, selectedCategory));

  const handleLoadMore = () => {
    setVisibleCourses(prev => Math.min(prev + 3, filteredCourses.length));
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
            {/* Left Content (approx 54%) */}
            <div className="w-full lg:w-[54%] text-left">
              {/* Eyebrow badge: CHƯƠNG TRÌNH ĐÀO TẠO THỰC CHIẾN */}
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#F2C037]/10 border border-[#F2C037]/30 text-[#F2C037] text-xs font-bold tracking-[0.2em] uppercase mb-6 shadow-sm backdrop-blur-md"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#F2C037] animate-pulse" />
                <span>CHƯƠNG TRÌNH ĐÀO TẠO THỰC CHIẾN</span>
              </motion.div>
  
              {/* H1 Main Title: CÁC KHÓA HỌC AI CHO GIÁO VIÊN */}
              <motion.h1 
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-[62px] xl:text-[68px] font-black leading-[1.08] tracking-[-0.02em] uppercase mb-6 font-display"
              >
                <span className="block text-white">CÁC KHÓA HỌC AI</span>
                <span className="block mt-1">
                  <span className="bg-gradient-to-r from-[#F4C430] via-[#F2C037] to-[#E7B936] bg-clip-text text-transparent drop-shadow-[0_4px_24px_rgba(242,192,55,0.35)]">
                    CHO GIÁO VIÊN
                  </span>
                </span>
              </motion.h1>
  
              {/* Core statement right below H1 */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
                className="mb-8 space-y-3"
              >
                <p className="text-[#F2C037] text-lg sm:text-xl font-bold leading-snug font-display">
                  “Không dạy lý thuyết dàn trải. Mỗi khóa học là một quy trình thực chiến giúp Thầy Cô tự tay tạo sản phẩm dạy học ngay trong buổi học.”
                </p>
                <div className="pt-2">
                  <span className="inline-block px-3 py-1 rounded-md bg-white/10 text-white text-xs sm:text-sm font-black uppercase tracking-wider mb-2">
                    TỪ SOẠN GIẢNG ĐẾN SLIDE, 3D, GAME, APP & VIDEO AI
                  </span>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-[580px]">
                    Làm chủ các giải pháp AI chuyên biệt để tiết kiệm đến 80% thời gian chuẩn bị bài, giải phóng áp lực hành chính và kiến tạo những tiết học tương tác tràn đầy hứng khởi.
                  </p>
                </div>
              </motion.div>
  
              {/* CTAs */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2"
              >
                <button 
                  onClick={() => {
                    document.getElementById('course-ecosystem-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="group relative inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#F4C430] to-[#E7B936] text-[#07111F] px-8 h-[54px] rounded-[14px] font-black text-sm uppercase tracking-wider transition-all duration-250 shadow-[0_12px_28px_rgba(242,192,55,0.3)] hover:shadow-[0_18px_36px_rgba(242,192,55,0.45)] hover:-translate-y-[2px] active:translate-y-0 overflow-hidden cursor-pointer"
                >
                  <span className="relative z-10">KHÁM PHÁ CÁC KHÓA HỌC</span>
                  <span className="relative z-10 text-lg">↓</span>
                </button>
                <button 
                  onClick={() => {
                    document.getElementById('roadmap-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center justify-center gap-2 text-slate-300 hover:text-[#F2C037] px-4 py-3 text-sm font-bold uppercase tracking-wider transition-colors cursor-pointer group"
                >
                  <span>XEM 10 CHUYÊN ĐỀ NỀN TẢNG</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </motion.div>
            </div>

            {/* Right Side Visual: AI Education Command Center (approx 46%) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.25, ease: "easeOut" }}
              className="w-full lg:w-[46%] relative mt-6 lg:mt-0"
            >
              {/* Soft Gradient Sphere / Glowing Orbit */}
              <div className="absolute -inset-6 bg-gradient-to-tr from-[#2563EB]/25 via-[#22D3EE]/20 to-[#E7B936]/15 rounded-[44px] blur-3xl opacity-80 pointer-events-none" />
              <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full bg-[#22D3EE]/15 blur-2xl pointer-events-none" />
              <div className="absolute -bottom-8 -left-8 w-48 h-48 rounded-full bg-[#2563EB]/20 blur-2xl pointer-events-none" />

              {/* Decorative Abstract AI Node Network SVG */}
              <div className="absolute -top-10 -right-8 w-48 h-48 opacity-30 pointer-events-none hidden sm:block">
                <svg viewBox="0 0 160 160" fill="none" className="w-full h-full">
                  <circle cx="30" cy="30" r="4" fill="#22D3EE" />
                  <circle cx="130" cy="40" r="5" fill="#E7B936" />
                  <circle cx="100" cy="120" r="4" fill="#2563EB" />
                  <circle cx="40" cy="110" r="3" fill="#22D3EE" />
                  <line x1="30" y1="30" x2="130" y2="40" stroke="#22D3EE" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                  <line x1="130" y1="40" x2="100" y2="120" stroke="#E7B936" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                  <line x1="100" y1="120" x2="40" y2="110" stroke="#2563EB" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                </svg>
              </div>

              {/* AI Education Command Center Card Frame */}
              <div className="relative rounded-[26px] p-4 sm:p-5 bg-[#0A172A]/95 border border-white/15 shadow-[0_25px_65px_-15px_rgba(0,0,0,0.85),0_0_40px_rgba(37,99,235,0.18)] backdrop-blur-xl group">
                {/* Window Top Controls */}
                <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                  </div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#E7B936]" />
                    <span>AI Education Command Center</span>
                  </div>
                  <div className="w-3" />
                </div>

                {/* Workspace Center Content with Inspiring Educator Photo & Glassmorphic AI Overlays */}
                <div className="rounded-[18px] bg-[#06101F] border border-white/10 relative overflow-hidden group/img">
                  {/* Real Teacher with AI Workspace Image */}
                  <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=900&q=80" 
                      alt="Giáo viên Việt Nam ứng dụng AI trong giảng dạy" 
                      className="w-full h-full object-cover object-top filter brightness-[0.92] group-hover/img:scale-105 transition-transform duration-700 ease-out"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#06101F] via-[#06101F]/40 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#06101F]/60 via-transparent to-transparent" />

                    {/* Live Status Badge */}
                    <div className="absolute top-3 left-3 bg-[#07111F]/90 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Lớp Học Số Thực Chiến</span>
                    </div>

                    {/* Metric Highlight Badge */}
                    <div className="absolute top-3 right-3 bg-[#F2C037] text-[#07111F] px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-md">
                      Tiết kiệm 80% thời gian
                    </div>
                  </div>

                  {/* Flow Simulation Rows under photo */}
                  <div className="p-4 space-y-2.5 bg-[#06101F]/95">
                    <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/25 flex items-center justify-center">
                          <BookOpenCheck className="w-3.5 h-3.5 text-[#E7B936]" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">Soạn Giảng KHBD 5512</div>
                          <div className="text-[10px] text-slate-400">Chuẩn hóa cấu trúc bộ môn chỉ 15 phút</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-[#E7B936] bg-[#E7B936]/10 px-2 py-0.5 rounded">Hoàn thành</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-cyan-500/15 border border-cyan-500/25 flex items-center justify-center">
                          <Presentation className="w-3.5 h-3.5 text-[#22D3EE]" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">Slide & Trò Chơi Tương Tác</div>
                          <div className="text-[10px] text-slate-400">Tự động hóa trình chiếu sinh động</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-[#22D3EE] bg-cyan-500/10 px-2 py-0.5 rounded">Đã kích hoạt</span>
                    </div>
                  </div>
                </div>

                {/* 6 Surrounding Floating Cards with Lucide Icons */}
                {/* 1. SOẠN GIẢNG (Top-Left) */}
                <div className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 z-20 px-3 py-1.5 rounded-xl bg-[#0B1628]/95 backdrop-blur-md border border-[#E7B936]/40 shadow-lg flex items-center gap-2">
                  <BookOpenCheck className="w-3.5 h-3.5 text-[#E7B936]" />
                  <span className="text-[11px] font-bold text-white tracking-wider">SOẠN GIẢNG</span>
                </div>

                {/* 2. SLIDE AI (Top-Right) */}
                <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 z-20 px-3 py-1.5 rounded-xl bg-[#0B1628]/95 backdrop-blur-md border border-cyan-400/40 shadow-lg flex items-center gap-2">
                  <Presentation className="w-3.5 h-3.5 text-[#22D3EE]" />
                  <span className="text-[11px] font-bold text-white tracking-wider">SLIDE AI</span>
                </div>

                {/* 3. TRỢ LÝ AI (Middle-Left) */}
                <div className="absolute top-1/2 -left-4 sm:-left-6 -translate-y-1/2 z-20 px-3 py-1.5 rounded-xl bg-[#0B1628]/95 backdrop-blur-md border border-blue-400/40 shadow-lg flex items-center gap-2">
                  <Bot className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-[11px] font-bold text-white tracking-wider">TRỢ LÝ AI</span>
                </div>

                {/* 4. TRÒ CHƠI (Middle-Right) */}
                <div className="absolute top-1/2 -right-4 sm:-right-6 -translate-y-1/2 z-20 px-3 py-1.5 rounded-xl bg-[#0B1628]/95 backdrop-blur-md border border-emerald-400/40 shadow-lg flex items-center gap-2">
                  <Gamepad2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[11px] font-bold text-white tracking-wider">TRÒ CHƠI</span>
                </div>

                {/* 5. VIDEO AI (Bottom-Left) */}
                <div className="absolute -bottom-3 -left-3 sm:-bottom-4 sm:-left-4 z-20 px-3 py-1.5 rounded-xl bg-[#0B1628]/95 backdrop-blur-md border border-violet-400/40 shadow-lg flex items-center gap-2">
                  <Video className="w-3.5 h-3.5 text-violet-400" />
                  <span className="text-[11px] font-bold text-white tracking-wider">VIDEO AI</span>
                </div>

                {/* 6. APP GIÁO DỤC (Bottom-Right) */}
                <div className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 z-20 px-3 py-1.5 rounded-xl bg-[#0B1628]/95 backdrop-blur-md border border-amber-400/40 shadow-lg flex items-center gap-2">
                  <Smartphone className="w-3.5 h-3.5 text-[#E7B936]" />
                  <span className="text-[11px] font-bold text-white tracking-wider">APP GIÁO DỤC</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. PAIN POINTS (Nỗi đau giáo viên - Light Background #F8FAFC) */}
      <section id="pain-points-section" className="py-24 lg:py-28 bg-[#F8FAFC] text-[#111827] relative overflow-hidden border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8 relative z-10">
          <motion.div 
            variants={fadeUpContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <motion.div variants={fadeUpItem} className="inline-block px-4 py-1.5 rounded-full bg-rose-50 text-rose-600 text-xs font-bold uppercase tracking-[0.2em] mb-4 border border-rose-200">
              NHỮNG VIỆC ĐANG LẤY ĐI THỜI GIAN CỦA GIÁO VIÊN
            </motion.div>
            <motion.h2 variants={fadeUpItem} className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#111827] font-display uppercase tracking-tight leading-tight">
              THẦY CÔ CÓ ĐANG GẶP <br className="hidden sm:inline" />
              <span className="text-[#B45309]">NHỮNG VẤN ĐỀ NÀY?</span>
            </motion.h2>
            <motion.p variants={fadeUpItem} className="text-slate-600 text-base sm:text-lg mt-4 max-w-2xl mx-auto font-medium">
              Công việc ngày càng nhiều, yêu cầu ngày càng cao, nhưng quỹ thời gian của giáo viên thì không tăng thêm.
            </motion.p>
          </motion.div>

          {/* 5 Distinct Groups */}
          <motion.div 
            variants={fadeUpContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          >
            {/* NHÓM 1: THỜI GIAN */}
            <motion.div variants={fadeUpCard} className="bg-white rounded-[22px] border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group">
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
                <img 
                  src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=700&q=80" 
                  alt="Áp lực thời gian soạn bài" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 text-xs font-black text-amber-300 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-full uppercase tracking-wider border border-amber-300/30">
                  NHÓM 1: THỜI GIAN
                </span>
              </div>
              <div className="p-7">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-amber-50 text-[#B45309] border border-amber-100">
                    <Clock className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-black text-[#111827] font-display">ÁP LỰC THỜI GIAN CHUẨN BỊ</h3>
                </div>
                <ul className="space-y-3">
                  {[
                    'Soạn giáo án và kế hoạch bài dạy quá lâu.',
                    'Làm slide mất nhiều giờ tìm ảnh, bố cục và căn chỉnh.',
                    'Chuẩn bị câu hỏi, phiếu học tập lặp đi lặp lại.',
                    'Chỉnh sửa tài liệu nhiều lần theo mẫu biểu.'
                  ].map((p, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <XCircle className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* NHÓM 2: CÔNG CỤ AI */}
            <motion.div variants={fadeUpCard} className="bg-white rounded-[22px] border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group">
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
                <img 
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=700&q=80" 
                  alt="Dùng AI nhưng kết quả lúc đúng lúc sai" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 text-xs font-black text-blue-300 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-full uppercase tracking-wider border border-blue-300/30">
                  NHÓM 2: DÙNG AI
                </span>
              </div>
              <div className="p-7">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-blue-50 text-[#2563EB] border border-blue-100">
                    <Bot className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-black text-[#111827] font-display">CHƯA TẠO THÀNH KẾT QUẢ</h3>
                </div>
                <ul className="space-y-3">
                  {[
                    'Biết ChatGPT / Gemini nhưng kết quả lúc đúng lúc sai.',
                    'AI trả lời chung chung, thiếu tính sư phạm Việt Nam.',
                    'Không biết cách viết prompt rõ ràng để AI hiểu ý.',
                    'Quá nhiều công cụ mới ra đời, không biết nên chọn gì.'
                  ].map((p, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <XCircle className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* NHÓM 3: NỘI DUNG HẤP DẪN */}
            <motion.div variants={fadeUpCard} className="bg-white rounded-[22px] border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group">
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
                <img 
                  src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=700&q=80" 
                  alt="Khó làm video và học liệu trực quan" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 text-xs font-black text-violet-300 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-full uppercase tracking-wider border border-violet-300/30">
                  NHÓM 3: HỌC LIỆU SỐ
                </span>
              </div>
              <div className="p-7">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-violet-50 text-violet-600 border border-violet-100">
                    <Video className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-black text-[#111827] font-display">BÀI GIẢNG CHƯA TRỰC QUAN</h3>
                </div>
                <ul className="space-y-3">
                  {[
                    'Muốn làm video bài giảng nhưng quá nhiều công đoạn phức tạp.',
                    'Muốn tạo game tương tác nhưng không biết lập trình.',
                    'Kiến thức trừu tượng khó giải thích bằng hình ảnh tĩnh.',
                    'Muốn có thí nghiệm ảo nhưng thiếu công cụ mô phỏng.'
                  ].map((p, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <XCircle className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* NHÓM 4: CÔNG NGHỆ */}
            <motion.div variants={fadeUpCard} className="bg-white rounded-[22px] border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group">
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=700&q=80" 
                  alt="Rào cản lập trình và ứng dụng giáo dục" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 text-xs font-black text-emerald-300 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-full uppercase tracking-wider border border-emerald-300/30">
                  NHÓM 4: CÔNG NGHỆ
                </span>
              </div>
              <div className="p-7">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-black text-[#111827] font-display">RÀO CẢN KỸ THUẬT</h3>
                </div>
                <ul className="space-y-3">
                  {[
                    'Có ý tưởng app giáo dục cho học sinh nhưng không biết code.',
                    'Khó kết nối các công cụ AI thành một quy trình làm việc.',
                    'Muốn tự động hóa công việc nhưng không biết bắt đầu từ đâu.'
                  ].map((p, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <XCircle className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* NHÓM 5: ÁP LỰC CÔNG VIỆC */}
            <motion.div variants={fadeUpCard} className="bg-white rounded-[22px] border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between md:col-span-2 overflow-hidden group">
              <div className="relative aspect-[21/9] sm:aspect-[24/9] w-full overflow-hidden bg-slate-100">
                <img 
                  src="https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=900&q=80" 
                  alt="Khối lượng hành chính và hồ sơ sổ sách quá tải" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 text-xs font-black text-rose-300 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-full uppercase tracking-wider border border-rose-300/30">
                  NHÓM 5: ÁP LỰC HỒ SƠ & ĐỔI MỚI
                </span>
              </div>
              <div className="p-7">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-rose-50 text-rose-600 border border-rose-100">
                    <Workflow className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-black text-[#111827] font-display">KHỐI LƯỢNG HÀNH CHÍNH QUÁ TẢI</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  {[
                    'Hồ sơ, sổ sách, báo cáo và tài liệu lặp đi lặp lại ngoài giờ lên lớp.',
                    'Phải liên tục thích ứng với yêu cầu và chương trình mới.',
                    'Quản lý dữ liệu học sinh và đề kiểm tra thủ công mất nhiều thời gian.',
                    'Muốn đổi mới phương pháp nhưng quỹ thời gian quá hạn chế.'
                  ].map((p, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <XCircle className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="px-7 pb-6 pt-0">
                <div className="border-t border-slate-100 text-xs text-slate-500 italic bg-slate-50/70 p-3 rounded-xl">
                  Dữ liệu thực tế: OECD ghi nhận khối lượng công việc hành chính là nguồn căng thẳng đáng kể với giáo viên. Tại Việt Nam, 52% giáo viên THCS trong khảo sát TALIS 2024 cho biết việc theo kịp thay đổi chương trình là nguồn gây stress lớn.
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 3. PATTERN INTERRUPT (Full-width Dark #07111F) */}
      <section className="py-24 bg-[#07111F] text-white relative overflow-hidden border-y border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.12),transparent_70%)] pointer-events-none" />
        <motion.div 
          variants={fadeUpContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="max-w-5xl mx-auto px-6 sm:px-8 text-center relative z-10"
        >
          <motion.h2 variants={fadeUpItem} className="text-2xl sm:text-3xl md:text-5xl font-black text-slate-300 font-display uppercase tracking-tight leading-tight mb-4">
            THẦY CÔ KHÔNG CẦN HỌC THÊM 20 CÔNG CỤ AI.
          </motion.h2>
          <motion.div variants={fadeUpItem} className="text-3xl sm:text-4xl md:text-6xl font-black font-display uppercase tracking-tight text-[#F2C037] drop-shadow-md mb-8">
            THẦY CÔ CẦN MỘT QUY TRÌNH ĐÚNG.
          </motion.div>
          <motion.p variants={fadeUpItem} className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            “Biết việc nào nên giao cho AI, cách yêu cầu AI chuẩn xác và cách biến kết quả thành sản phẩm thực tế phục vụ dạy học.”
          </motion.p>
        </motion.div>
      </section>

      {/* 4. SOLUTION (Warm White #FFFDF8) */}
      <section className="py-24 bg-[#FFFDF8] text-[#111827] relative overflow-hidden border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8 relative z-10">
          <motion.div 
            variants={fadeUpContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <motion.div variants={fadeUpItem} className="inline-block px-4 py-1.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-[0.2em] mb-4 border border-amber-200">
              GIẢI PHÁP CỦA EDUNEXA
            </motion.div>
            <motion.h2 variants={fadeUpItem} className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#111827] font-display uppercase tracking-tight leading-tight">
              MỘT HỆ SINH THÁI AI <br className="hidden sm:inline" />
              <span className="text-[#B45309]">XOAY QUANH CÔNG VIỆC CỦA GIÁO VIÊN</span>
            </motion.h2>
            <motion.p variants={fadeUpItem} className="text-slate-600 text-base sm:text-lg mt-4 max-w-2xl mx-auto font-medium">
              Không học lý thuyết dàn trải. Đi thẳng từ công việc thực tế đến sản phẩm hoàn thiện qua 4 bước:
            </motion.p>
          </motion.div>

          {/* 4-Step Visual Flow */}
          <motion.div 
            variants={fadeUpContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              {
                step: 'BƯỚC 01',
                title: 'XÁC ĐỊNH CÔNG VIỆC',
                desc: 'Nhận diện chính xác nhiệm vụ đang lấy đi nhiều thời gian nhất của Thầy Cô trong tuần.',
                image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&q=80',
                icon: <Search className="w-5 h-5 text-[#B45309]" />
              },
              {
                step: 'BƯỚC 02',
                title: 'CHỌN QUY TRÌNH AI',
                desc: 'Áp dụng bộ câu lệnh mẫu (Prompt) và trợ lý chuyên biệt đã được tối ưu cho từng bộ môn.',
                image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=500&q=80',
                icon: <Workflow className="w-5 h-5 text-[#2563EB]" />
              },
              {
                step: 'BƯỚC 03',
                title: 'TẠO SẢN PHẨM',
                desc: 'Tự động tạo kế hoạch bài dạy, slide, video, trò chơi, mô phỏng 3D hay app học tập.',
                image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=500&q=80',
                icon: <Sparkles className="w-5 h-5 text-emerald-600" />
              },
              {
                step: 'BƯỚC 04',
                title: 'ỨNG DỤNG VÀO DẠY HỌC',
                desc: 'Đưa ngay vào tiết học thực tế để học sinh tương tác hào hứng và giảm áp lực chuẩn bị.',
                image: 'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?auto=format&fit=crop&w=500&q=80',
                icon: <Presentation className="w-5 h-5 text-violet-600" />
              }
            ].map((st, idx) => (
              <motion.div 
                key={idx}
                variants={fadeUpCard}
                whileHover={{ y: -5 }}
                className="bg-white rounded-[22px] border border-amber-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                    <img 
                      src={st.image} 
                      alt={st.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <span className="absolute bottom-2.5 left-3 text-[11px] font-black text-amber-300 bg-black/60 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-amber-300/30">
                      {st.step}
                    </span>
                  </div>
                  <div className="p-6">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-3">
                      {st.icon}
                    </div>
                    <h3 className="text-base font-black text-[#111827] mb-2 font-display uppercase tracking-tight">
                      {st.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {st.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 5. 10 CHUYÊN ĐỀ GIẢI QUYẾT NỖI ĐAU (Lộ trình nền tảng - Light #F8FAFC) */}
      <section id="roadmap-section" className="py-24 lg:py-28 bg-[#F8FAFC] text-[#111827] relative overflow-hidden border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8 relative z-10">
          <motion.div 
            variants={fadeUpContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <motion.div variants={fadeUpItem} className="inline-block px-4 py-1.5 rounded-full bg-[#F2C037]/20 text-[#92400E] text-xs font-bold uppercase tracking-[0.2em] mb-4 border border-[#F2C037]/40">
              10 CHUYÊN ĐỀ NỀN TẢNG
            </motion.div>
            <motion.h2 variants={fadeUpItem} className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#111827] font-display uppercase tracking-tight leading-tight">
              GIÚP GIÁO VIÊN GIẢI QUYẾT <br className="hidden sm:inline" />
              <span className="text-[#B45309]">NHỮNG VIỆC ĐANG TỐN NHIỀU THỜI GIAN</span>
            </motion.h2>
            <motion.p variants={fadeUpItem} className="text-slate-600 text-base sm:text-lg mt-4 max-w-2xl mx-auto font-medium">
              Một lộ trình nền tảng giúp Thầy Cô đi từ sử dụng AI đến tự tạo sản phẩm giáo dục phục vụ công việc giảng dạy hằng ngày.
            </motion.p>
          </motion.div>

          {/* 10 Foundation Modules: PAIN -> SOLUTION -> OUTPUT */}
          <motion.div 
            variants={fadeUpContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {[
              {
                num: '01',
                title: 'Nền tảng quan trọng về AI giáo dục',
                pain: 'Dùng AI nhưng kết quả không ổn định, chưa biết cách viết prompt và quy trình chuẩn.',
                solution: 'Làm chủ tư duy bối cảnh, cấu trúc prompt sư phạm và quy trình làm việc chuẩn mực.',
                output: 'Khả năng giao tiếp chính xác với AI, nhận kết quả đúng chuyên môn ngay lần đầu.',
                image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=700&q=80',
                icon: <BookOpenCheck className="w-5 h-5 text-[#B45309]" />
              },
              {
                num: '02',
                title: 'Nghiệp vụ soạn giảng AI chuyên sâu',
                pain: 'Giáo án, kế hoạch bài dạy (KHBD), câu hỏi và học liệu mất quá nhiều thời gian.',
                solution: 'Tự động hóa soạn kế hoạch bài dạy chuẩn 5512, ngân hàng đề thi phân hóa và phiếu bài tập.',
                output: 'Hoàn thành hồ sơ bài giảng và đề thi phân hóa trong 15 phút.',
                image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=700&q=80',
                icon: <FileText className="w-5 h-5 text-[#2563EB]" />
              },
              {
                num: '03',
                title: 'Tạo Slide bài giảng tự động',
                pain: 'Có nội dung nhưng mất nhiều giờ tìm ảnh, bố cục, thiết kế và chỉnh sửa trình chiếu.',
                solution: 'Chuyển hóa dàn ý bài học thành slide trực quan, thẩm mỹ chuẩn sư phạm tự động.',
                output: 'Bộ slide PowerPoint / Canva hoàn thiện, bố cục khoa học, tiết kiệm 80% công sức.',
                image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=700&q=80',
                icon: <Presentation className="w-5 h-5 text-violet-600" />
              },
              {
                num: '04',
                title: 'Tạo Trợ lý ảo cá nhân hóa (GPTs)',
                pain: 'Công việc hành chính lặp lại, tài liệu nhiều và muốn có trợ lý hỗ trợ theo nhu cầu riêng.',
                solution: 'Huấn luyện trợ lý ảo thông minh nạp dữ liệu sách giáo khoa và tài liệu bộ môn của Thầy Cô.',
                output: 'Trợ lý AI riêng biệt hỗ trợ giải đáp học sinh và gợi ý ý tưởng giảng dạy 24/7.',
                image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=700&q=80',
                icon: <Bot className="w-5 h-5 text-emerald-600" />
              },
              {
                num: '05',
                title: 'Tạo Trò chơi học tập tương tác',
                pain: 'Muốn học sinh hào hứng, tăng tương tác nhưng không biết kỹ thuật lập trình game.',
                solution: 'Sử dụng AI tạo nhanh các trò chơi khởi động, câu hỏi củng cố và quiz tương tác lớp học.',
                output: 'Kho mini game học tập vui nhộn kích thích 100% học sinh tham gia phát biểu.',
                image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=700&q=80',
                icon: <Gamepad2 className="w-5 h-5 text-[#B45309]" />
              },
              {
                num: '06',
                title: 'Tạo Thí nghiệm ảo sinh động',
                pain: 'Những thí nghiệm khó, tốn thiết bị, nguy hiểm hoặc không thuận tiện thực hiện trực tiếp.',
                solution: 'Xây dựng phòng thí nghiệm ảo tương tác trực tiếp ngay trên trình duyệt web.',
                output: 'Mô phỏng thí nghiệm Lý, Hóa, Sinh an toàn, trực quan, học sinh tự thao tác được.',
                image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=700&q=80',
                icon: <FlaskConical className="w-5 h-5 text-[#2563EB]" />
              },
              {
                num: '07',
                title: 'Tạo Mô phỏng 3D trực quan',
                pain: 'Kiến thức không gian và khái niệm trừu tượng rất khó hình dung chỉ bằng hình ảnh tĩnh.',
                solution: 'Biến công thức, sơ đồ và hiện tượng thành mô hình 3D xoay lật 360 độ.',
                output: 'Học liệu 3D sinh động giúp học sinh hiểu sâu bản chất kiến thức.',
                image: 'https://images.unsplash.com/photo-1633493106185-5b4cf594a501?auto=format&fit=crop&w=700&q=80',
                icon: <Box className="w-5 h-5 text-violet-600" />
              },
              {
                num: '08',
                title: 'Thiết kế Web App Giáo dục',
                pain: 'Có ý tưởng ứng dụng phục vụ học tập nhưng bị cản trở vì không biết lập trình.',
                solution: 'Quy trình sử dụng AI để tự tay xây dựng Web App giáo dục không cần viết mã.',
                output: 'Ứng dụng học tập, tra cứu công thức, ôn tập riêng chia sẻ cho học sinh sử dụng.',
                image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=700&q=80',
                icon: <Smartphone className="w-5 h-5 text-emerald-600" />
              },
              {
                num: '09',
                title: 'Ứng dụng AI trong Canva',
                pain: 'Thiết kế học liệu, poster và nội dung trực quan mất quá nhiều thời gian chuẩn bị.',
                solution: 'Khai thác sức mạnh AI trong Canva để tự động tạo sơ đồ, infographic và ấn phẩm sư phạm.',
                output: 'Bộ học liệu trực quan chuyên nghiệp, đồng nhất phong cách giảng dạy.',
                image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=700&q=80',
                icon: <Palette className="w-5 h-5 text-[#B45309]" />
              },
              {
                num: '10',
                title: 'Tạo Video AI Giáo dục',
                pain: 'Làm video bài giảng từ ý tưởng đến thành phẩm có quá nhiều bước phức tạp và tốn công.',
                solution: 'Quy trình viết kịch bản, tạo hình ảnh nhân vật ảo và lồng tiếng tự nhiên bằng AI.',
                output: 'Video bài giảng số sinh động có giáo viên số giảng bài tự nhiên, thu hút.',
                image: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=700&q=80',
                icon: <Video className="w-5 h-5 text-violet-600" />
              }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                variants={fadeUpCard}
                whileHover={{ y: -6 }}
                className="bg-white rounded-[24px] border border-slate-200/90 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="text-xs font-black text-white bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-full uppercase tracking-wider border border-white/20">
                        Chuyên đề {item.num}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <span className="text-xs font-bold text-emerald-300 bg-emerald-950/80 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                        Nền tảng thực chiến
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-4 right-4 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white">
                        {item.icon}
                      </div>
                      <h3 className="text-base sm:text-lg font-black text-white font-display line-clamp-1 drop-shadow-sm">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="space-y-2.5 text-xs sm:text-sm">
                      <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-100">
                        <span className="font-bold text-rose-700 block mb-0.5">Nỗi đau giải quyết:</span>
                        <span className="text-slate-700">{item.pain}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100">
                        <span className="font-bold text-blue-700 block mb-0.5">Giải pháp AI:</span>
                        <span className="text-slate-700">{item.solution}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100">
                        <span className="font-bold text-emerald-700 block mb-0.5">Sản phẩm đầu ra:</span>
                        <span className="text-slate-700 font-medium">{item.output}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Section End CTA */}
          <div className="mt-14 text-center">
            <button
              onClick={() => {
                document.getElementById('course-ecosystem-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#111827] text-white hover:bg-[#B45309] rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
            >
              <span>KHÁM PHÁ CÁC CHƯƠNG TRÌNH HỌC</span>
              <span>↓</span>
            </button>
          </div>
        </div>
      </section>

      {/* 6. CÁC KHÓA HỌC AI CHO GIÁO VIÊN (Commercial Ecosystem - White #FFFFFF) */}
      <section id="course-ecosystem-section" ref={sectionRef} className="py-24 lg:py-28 bg-white relative overflow-hidden border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8 relative z-10">
          <motion.div 
            variants={fadeUpContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="text-center max-w-3xl mx-auto mb-14"
          >
            <motion.div variants={fadeUpItem} className="inline-block px-4 py-1.5 rounded-full bg-[#F2C037]/20 text-[#92400E] text-xs font-bold uppercase tracking-[0.2em] mb-4 border border-[#F2C037]/40">
              DANH MỤC KHÓA HỌC THỰC CHIẾN
            </motion.div>
            <motion.h2 variants={fadeUpItem} className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#111827] font-display uppercase tracking-tight leading-tight">
              CÁC KHÓA HỌC AI <br className="hidden sm:inline" />
              <span className="text-[#B45309]">CHO GIÁO VIÊN</span>
            </motion.h2>
            <motion.p variants={fadeUpItem} className="text-slate-600 text-base sm:text-lg mt-4 max-w-2xl mx-auto font-medium">
              Không dạy lý thuyết hàn lâm. Mỗi khóa học là một giải pháp trọn gói cầm tay chỉ việc, giúp Thầy Cô làm chủ từng công đoạn sư phạm và tự tay tạo sản phẩm thực tế ứng dụng ngay trên lớp.
            </motion.p>
          </motion.div>

          {/* Category Filter Chips - Mobile horizontal scrollable */}
          <div className="mb-12 flex items-center justify-start lg:justify-center gap-2 overflow-x-auto pb-3 no-scrollbar">
            {CATEGORIES.map(cat => {
              const count = cat.id === 'ALL' 
                ? courses.length 
                : courses.filter(c => isCourseInCategory(c.id, cat.id)).length;
              if (count === 0 && cat.id !== 'ALL') return null;
              
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    isActive 
                      ? 'bg-[#111827] text-white shadow-md' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-[#F2C037] text-[#07111F]' : 'bg-slate-200 text-slate-700'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Courses Grid */}
          <motion.div 
            variants={fadeUpContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredCourses.slice(0, visibleCourses).map((course, index) => {
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
          
          {visibleCourses < filteredCourses.length && (
            <div className="mt-14 text-center">
              <button 
                onClick={handleLoadMore}
                className="inline-flex items-center px-8 py-3.5 border-2 border-[#111827] text-[#111827] font-bold rounded-xl hover:bg-[#111827] hover:text-white transition-all text-xs uppercase tracking-wider cursor-pointer"
              >
                Xem thêm khóa học ({filteredCourses.length - visibleCourses})
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 7. FEEDBACK HỌC VIÊN (Social Proof - #0B172A Navy Background) */}
      <section className="py-24 lg:py-28 bg-[#0B172A] text-white border-t border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(37,99,235,0.12),transparent_70%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8 relative z-10">
          <motion.div 
            variants={fadeUpContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="text-center mb-16"
          >
            <motion.div variants={fadeUpItem} className="inline-block px-4 py-1.5 rounded-full bg-[#F2C037]/15 text-[#F2C037] text-xs font-bold uppercase tracking-[0.2em] mb-4 border border-[#F2C037]/30">
              CÂU CHUYỆN TỪ HỌC VIÊN
            </motion.div>
            <motion.h2 variants={fadeUpItem} className="text-3xl md:text-5xl font-black text-white font-display uppercase tracking-tight">
              THẦY CÔ ĐÃ ỨNG DỤNG ĐƯỢC GÌ SAU KHI HỌC?
            </motion.h2>
            <motion.p variants={fadeUpItem} className="text-slate-400 max-w-2xl mx-auto mt-3 text-base">
              Kết quả ứng dụng thực tế từ các thầy cô đã đồng hành cùng các chương trình của EDUNEXA.
            </motion.p>
          </motion.div>

          <motion.div 
            variants={fadeUpContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {testimonials.map((t: any, idx) => (
              <motion.div 
                key={t.id}
                variants={fadeUpCard}
                whileHover={{ y: -6 }}
                className="bg-[#07111F]/90 p-7 rounded-[24px] shadow-xl border border-white/10 flex flex-col h-full relative backdrop-blur-sm hover:border-[#F2C037]/40 transition-all duration-300 overflow-hidden group"
              >
                <Quote className="absolute top-5 right-6 w-9 h-9 text-[#F2C037]/15 pointer-events-none" />
                
                {/* Product Artifact Created by Teacher */}
                {t.productImage && (
                  <div className="mb-5 rounded-xl overflow-hidden border border-white/10 bg-slate-900 relative">
                    <img 
                      src={t.productImage} 
                      alt={t.productTag || t.name} 
                      className="w-full aspect-[16/9] object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <span className="absolute bottom-2 left-3 right-3 text-[11px] font-bold text-amber-300 truncate">
                      {t.productTag}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#F2C037] text-[#F2C037]" />
                  ))}
                </div>
                <p className="text-slate-300 italic mb-6 flex-grow leading-relaxed text-sm sm:text-base">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-4 pt-5 border-t border-white/10">
                  <img 
                    src={t.avatar} 
                    alt={t.name} 
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#F2C037]/40 shadow-sm"
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
      </section>

      {/* 8. FAQ (White Background #FFFFFF) */}
      <section className="py-24 bg-white text-[#111827] relative overflow-hidden border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 relative z-10">
          <motion.div 
            variants={fadeUpContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="text-center mb-16"
          >
            <motion.div variants={fadeUpItem} className="inline-block px-4 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-[0.2em] mb-4 border border-slate-200">
              GIẢI ĐÁP THẮC MẮC
            </motion.div>
            <motion.h2 variants={fadeUpItem} className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#111827] font-display uppercase tracking-tight leading-tight">
              NHỮNG CÂU HỎI THẦY CÔ THƯỜNG QUAN TÂM
            </motion.h2>
            <motion.p variants={fadeUpItem} className="text-slate-600 text-base sm:text-lg mt-4 max-w-2xl mx-auto font-medium">
              Giải tỏa mọi băn khoăn trước khi Thầy Cô bắt đầu hành trình làm chủ AI cùng EDUNEXA.
            </motion.p>
          </motion.div>

          {/* Schema.org FAQPage JSON-LD Structured Data for Search Engine Rich Snippets */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(HOMEPAGE_FAQ_JSON_LD) }}
          />

          <div className="space-y-4">
            {HOMEPAGE_FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx}
                  className="rounded-2xl border border-slate-200/90 overflow-hidden bg-[#F8FAFC] transition-colors"
                >
                  <button 
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-6 text-left flex justify-between items-center gap-4 hover:bg-slate-100/50 transition-colors cursor-pointer"
                  >
                    <span className="font-bold text-base sm:text-lg text-[#111827] font-display">
                      {faq.q}
                    </span>
                    <span className="p-1.5 rounded-full bg-white border border-slate-200 text-slate-600 flex-shrink-0">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                      >
                        <div className="px-6 pb-6 pt-2 text-slate-600 text-sm sm:text-base leading-relaxed border-t border-slate-200/60 bg-white">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. THÔNG TIN NGƯỜI ĐÀO TẠO (Trainer Info - Light #F8FAFC) */}
      <section id="about" className="py-24 bg-[#F8FAFC] text-[#111827] relative overflow-hidden border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8 relative z-10">
          <motion.div 
            variants={fadeUpContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <motion.div variants={fadeUpItem} className="inline-block px-4 py-1.5 rounded-full bg-[#F2C037]/20 text-[#92400E] text-xs font-bold uppercase tracking-[0.2em] mb-4 border border-[#F2C037]/40">
              GIẢNG VIÊN ĐỒNG HÀNH
            </motion.div>
            <motion.h2 variants={fadeUpItem} className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#111827] font-display uppercase tracking-tight leading-tight">
              NGƯỜI ĐỒNG HÀNH CÙNG THẦY CÔ
            </motion.h2>
            <motion.p variants={fadeUpItem} className="text-slate-600 text-base sm:text-lg mt-3">
              Thầy <span className="font-bold text-[#111827]">Trần Đông</span> (Trần Văn Đông) - Nhà sáng lập EDUNEXA
            </motion.p>
          </motion.div>

          <motion.div 
            variants={fadeUpContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="max-w-5xl mx-auto bg-white rounded-[28px] p-6 sm:p-10 lg:p-12 border border-slate-200 shadow-xl relative overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              {/* Left Column: Portrait Photo of Thầy Trần Đông */}
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-[22px] overflow-hidden aspect-[4/5] bg-slate-900 shadow-lg border border-slate-100 group">
                  <img 
                    src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80" 
                    alt="Thầy Trần Đông - Nhà sáng lập EDUNEXA" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07111F]/90 via-[#07111F]/20 to-transparent" />
                  
                  {/* Floating Badges */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#07111F]/90 backdrop-blur-md text-amber-300 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-amber-300/30">
                      AI Sư Phạm Thực Chiến
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="text-xl font-black font-display">Thầy Trần Đông</div>
                    <div className="text-xs text-slate-300">Nhà sáng lập EDUNEXA • AI Master Trainer</div>
                  </div>
                </div>

                {/* Stat Badge */}
                <div className="absolute -bottom-3 -right-3 bg-white p-3 rounded-2xl shadow-xl border border-slate-200 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-[#B45309]">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-black text-[#07111F]">10,000+</div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase">Giáo viên đồng hành</div>
                  </div>
                </div>
              </div>

              {/* Right Column: Bio & Philosophy & Channels */}
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-4">
                  <p className="text-slate-700 text-base leading-relaxed">
                    Thầy <span className="font-bold text-[#07111F]">Trần Đông</span> (Trần Văn Đông) là nhà đào tạo, chuyên gia nghiên cứu và triển khai ứng dụng trí tuệ nhân tạo trong giáo dục. Thầy đã trực tiếp đồng hành và tập huấn chuyển đổi số cho hàng chục nghìn giáo viên và nhà trường trên khắp cả nước.
                  </p>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    EDUNEXA được sáng lập nhằm đưa AI trở thành công cụ thực chiến gần gũi, giúp thầy cô giải phóng sức lao động, tiết kiệm hàng trăm giờ chuẩn bị bài và truyền cảm hứng học tập mạnh mẽ hơn tới học sinh.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200">
                  <p className="text-[#B45309] font-bold italic text-sm leading-relaxed">
                    "AI sinh ra không phải để thay thế người thầy, mà để trao quyền cho người thầy làm được những điều phi thường hơn."
                  </p>
                </div>

                {/* Verified Channels */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                    <MessageCircle className="w-4 h-4 text-[#B45309] flex-shrink-0" />
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Hotline / Zalo</div>
                      <div className="text-xs font-bold text-[#111827]">094 456 2096</div>
                    </div>
                  </div>
                  <a 
                    href="https://www.facebook.com/tranvandong.vietnam" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#B45309] flex items-center gap-3 transition-colors group"
                  >
                    <Users className="w-4 h-4 text-[#2563EB] flex-shrink-0 group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Facebook</div>
                      <div className="text-xs font-bold text-[#111827] group-hover:text-[#2563EB]">Trần Đông</div>
                    </div>
                  </a>
                  <a 
                    href="https://www.tiktok.com/@trn.ng_ai.trainer" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#B45309] flex items-center gap-3 transition-colors group"
                  >
                    <PlayCircle className="w-4 h-4 text-rose-600 flex-shrink-0 group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">TikTok</div>
                      <div className="text-xs font-bold text-[#111827] group-hover:text-rose-600">@trn.ng_ai.trainer</div>
                    </div>
                  </a>
                  <a 
                    href="https://www.youtube.com/@AITrainer.Offical" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#B45309] flex items-center gap-3 transition-colors group"
                  >
                    <MonitorPlay className="w-4 h-4 text-red-600 flex-shrink-0 group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">YouTube</div>
                      <div className="text-xs font-bold text-[#111827] group-hover:text-red-600">@AITrainer.Offical</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 10. FINAL CTA (Deep Navy Background #07111F) */}
      <section className="py-24 bg-gradient-to-b from-[#07111F] via-[#0A172A] to-[#07111F] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(242,192,55,0.08),transparent_70%)] pointer-events-none" />
        
        <motion.div 
          variants={fadeUpContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="relative max-w-4xl mx-auto px-6 sm:px-8 text-center z-10"
        >
          <motion.h2 variants={fadeUpItem} className="text-3xl md:text-5xl font-black text-white mb-3 font-display leading-tight uppercase">
            ĐỪNG HỌC AI CHỈ ĐỂ BIẾT AI.
          </motion.h2>
          <motion.div variants={fadeUpItem} className="text-3xl md:text-5xl font-black text-[#F2C037] mb-6 font-display leading-tight uppercase">
            HÃY DÙNG AI ĐỂ LÀM ĐƯỢC VIỆC.
          </motion.div>
          <motion.p variants={fadeUpItem} className="text-slate-300 text-base sm:text-lg mb-10 max-w-2xl mx-auto font-normal leading-relaxed">
            Chọn một chương trình phù hợp với công việc Thầy Cô đang muốn giải quyết để biến AI thành trợ thủ đắc lực nhất.
          </motion.p>
          <motion.div variants={fadeUpItem} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => {
                document.getElementById('course-ecosystem-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#F4C430] to-[#E7B936] text-[#07111F] px-10 py-4 h-[56px] rounded-xl font-black text-sm uppercase tracking-wider transition-all duration-250 shadow-[0_12px_28px_rgba(242,192,55,0.3)] hover:shadow-[0_18px_36px_rgba(242,192,55,0.45)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <span>KHÁM PHÁ CÁC KHÓA HỌC</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
          <p className="text-xs text-slate-400 mt-4 font-medium">
            Cam kết đồng hành và hỗ trợ giải đáp chuyên môn trọn đời.
          </p>
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
            CHƯƠNG TRÌNH ĐÀO TẠO THỰC CHIẾN
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[#07111F] mb-5 font-display tracking-tight">Các Khóa Học AI Cho Giáo Viên</h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Tổng hợp đầy đủ các chương trình đào tạo AI thực chiến dành riêng cho giáo viên Việt Nam: từ soạn giáo án 5512, làm slide tự động, tạo trợ lý ảo môn học, thiết kế trò chơi học tập, mô phỏng 3D đến sản xuất video bài giảng số.
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

// BESPOKE PAIN, OUTCOME & 3 BENEFITS DATA MAPPING FOR HIGH CONVERSION
const COURSE_PAIN_AND_RESULTS: Record<string, { pain: string; outcome: string; benefits: string[] }> = {
  'bo-tai-lieu-quan-trong': {
    pain: 'Mới bắt đầu tìm hiểu AI, bị ngợp giữa hàng trăm công cụ và chưa có lộ trình bài bản.',
    outcome: 'Làm chủ tư duy và quy trình AI 3 trụ cột chỉ sau 3 ngày tự thực hành.',
    benefits: [
      'Nắm trọn quy trình 3 trụ cột AI ứng dụng trong sư phạm',
      'Soạn giáo án, đề thi và học liệu nhanh gấp 5 lần',
      'Sở hữu kho câu lệnh mẫu (prompt) dùng được ngay'
    ]
  },
  'ai-soan-giang-ho-tro-day-hoc': {
    pain: 'Soạn giáo án, KHBD chuẩn 5512 và ngân hàng đề thi mất hàng giờ mỗi tuần.',
    outcome: 'Hoàn thiện hồ sơ bài dạy và phiếu học tập chuẩn chỉ trong 15-20 phút.',
    benefits: [
      'Tạo kế hoạch bài dạy chuẩn phân phối chương trình',
      'Tạo câu hỏi, đề thi và phiếu học tập tự động',
      'Thiết kế slide bài giảng chuyên nghiệp từ đề cương'
    ]
  },
  'ai-toan-dien-cho-giao-vien': {
    pain: 'Học nhiều khóa lẻ tẻ tốn kém, quá tải soạn giáo án 5512, ma trận đề thi và chưa biết làm slide, game, app hay video AI.',
    outcome: 'Làm chủ trọn vẹn 10 chuyên đề thực chiến theo đúng lộ trình từ soạn giảng, slide, trợ lý, game, 3D, app đến video AI.',
    benefits: [
      'Trọn bộ 10 chuyên đề thực chiến chuẩn hóa theo lộ trình',
      'Tự động hóa soạn giảng, làm slide, thiết kế trợ lý & app giáo dục',
      'Tự tay tạo trò chơi, thí nghiệm ảo, 3D, Canva và video AI giáo dục'
    ]
  },
  'ai-to-chuc-hoat-dong-hoc-tap': {
    pain: 'Muốn tiết học sôi nổi, có trò chơi và thí nghiệm trực quan nhưng không biết lập trình.',
    outcome: 'Tạo trò chơi tương tác, thí nghiệm ảo và web app giáo dục không cần 1 dòng code.',
    benefits: [
      'Biến ý tưởng bài dạy thành trò chơi tương tác lôi cuốn',
      'Tạo mô phỏng 3D và thí nghiệm ảo trực quan an toàn',
      'Tạo ứng dụng giáo dục chia sẻ trực tiếp cho học sinh'
    ]
  },
  '03-cuon-cam-nang-toan-dien': {
    pain: 'Tài liệu tự học trên mạng rời rạc, chắp vá, thiếu hệ thống và không sát thực tế Việt Nam.',
    outcome: 'Nắm giữ cẩm nang thực hành chi tiết từng bước, tra cứu và làm theo mọi lúc mọi nơi.',
    benefits: [
      'Tự tay làm video AI, thiết kế Canva và trò chơi bài bản',
      'Sở hữu kho tài nguyên 1200+ hoạt động tương tác sinh động',
      'Thực hành từng bước theo cẩm nang tinh gọn, dễ áp dụng'
    ]
  },
  'coaching-chuyen-biet': {
    pain: 'Gặp vướng mắc riêng về kỹ thuật hoặc nhà trường cần triển khai chuyển đổi số đồng bộ.',
    outcome: 'Được chuyên gia kèm cặp 1-1, giải quyết dứt điểm rào cản và ra sản phẩm ngay.',
    benefits: [
      'Lộ trình cá nhân hóa 100% bám sát nhu cầu thực tế',
      'Hướng dẫn giải quyết trực tiếp rào cản công nghệ',
      'Đội ngũ chuyên gia đồng hành và hỗ trợ bền vững'
    ]
  }
};

// REUSABLE COURSE CARD (Fulfills all requirements: Image, Title, Main Pain, Outcome, 3 Benefits, Price, CTA "XEM CHI TIẾT")
function CourseCard({ course, navigateTo, onSelectCourse }: { course: any, navigateTo: (p: string) => void, onSelectCourse: (c: any) => void, key?: string }) {
  const isSpecial = course.originalPrice && course.originalPrice !== course.price;
  const cardData = COURSE_PAIN_AND_RESULTS[course.id] || {
    pain: course.pains?.[0] || 'Gặp nhiều khó khăn và mất thời gian khi chuẩn bị bài giảng?',
    outcome: course.solutions?.[0] || 'Làm chủ công cụ AI để tiết kiệm 70% thời gian làm việc.',
    benefits: (course.solutions || course.benefits || []).slice(0, 3)
  };
  
  return (
    <motion.div 
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="bg-white rounded-[24px] shadow-sm hover:shadow-lg hover:shadow-slate-300/60 transition-all duration-300 border border-[#E5E7EB] hover:border-slate-300 overflow-hidden flex flex-col h-full group will-change-transform"
    >
      {/* 1. Ảnh khóa học */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
        <img 
          src={course.image} 
          alt={course.title} 
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]" 
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-50 group-hover:opacity-30 transition-opacity duration-300" />
        
        {course.target && (
          <div className="absolute top-4 left-4">
            <span className="bg-[#07111F]/90 backdrop-blur-xs text-white px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider shadow-sm border border-white/10">
              {course.target}
            </span>
          </div>
        )}
      </div>

      <div className="p-7 flex flex-col flex-grow bg-white">
        {/* 2. Tên khóa học */}
        <h3 className="text-xl font-bold text-[#07111F] leading-snug font-display mb-4 group-hover:text-[#F2C037] transition-colors">
          {course.title}
        </h3>

        {/* 3. Một nỗi đau chính */}
        <div className="mb-3.5 p-3 rounded-xl bg-rose-50/70 border border-rose-100">
          <p className="text-[10px] font-bold uppercase tracking-wider text-rose-600 mb-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Nỗi đau chính:
          </p>
          <p className="text-slate-700 text-xs sm:text-sm font-medium leading-relaxed">
            {cardData.pain}
          </p>
        </div>

        {/* 4. Một câu kết quả */}
        <div className="mb-5 p-3 rounded-xl bg-emerald-50/70 border border-emerald-100">
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 mb-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Kết quả đạt được:
          </p>
          <p className="text-slate-800 text-xs sm:text-sm font-bold leading-relaxed">
            {cardData.outcome}
          </p>
        </div>
        
        {/* 5. 3 Lợi ích cụ thể */}
        <div className="mb-6 flex-grow">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
            3 Lợi ích cụ thể:
          </p>
          <ul className="space-y-2">
            {cardData.benefits.slice(0, 3).map((res: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-snug">
                <CheckCircle2 className="w-4 h-4 text-[#2563EB] mt-0.5 flex-shrink-0" />
                <span>{res}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Footer: Giá & 6. CTA "XEM CHI TIẾT" -> 7. Mở đúng route */}
        <div className="pt-4 border-t border-slate-100 mt-auto">
          <div className="flex justify-between items-end mb-4">
            <div className="flex flex-col">
              {isSpecial && (
                <span className="text-slate-400 text-xs line-through font-medium">{course.originalPrice}</span>
              )}
              <span className="text-2xl font-black text-[#07111F] font-display">{course.price}</span>
            </div>
            <span className="text-xs text-slate-400 font-medium">Hỗ trợ trọn đời</span>
          </div>
          
          <button 
            onClick={() => navigateTo(`course-${course.id}`)}
            className="w-full bg-[#07111F] hover:bg-[#F2C037] hover:text-[#07111F] text-white h-[48px] rounded-[14px] font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2 cursor-pointer group/btn"
          >
            <span>XEM CHI TIẾT</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
          </button>
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
      {/* Top Back Navigation Bar */}
      <div className="bg-[#050D1A] py-3.5 px-6 border-b border-white/10 sticky top-16 z-30 backdrop-blur-md bg-[#050D1A]/95">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigateTo('home')}
              className="inline-flex items-center gap-2 text-slate-300 hover:text-[#F2C037] font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại Trang Chủ</span>
            </button>
            <span className="text-slate-600">/</span>
            <button 
              onClick={() => navigateTo('courses')}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer hidden sm:inline"
            >
              Tất cả khóa học
            </button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-slate-500 hidden md:inline">Đang xem:</span>
            <span className="text-[#F2C037] font-semibold truncate max-w-[220px] sm:max-w-none">{course.title}</span>
          </div>
        </div>
      </div>

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
        <div className={`${course.curriculum.length > 5 ? 'max-w-6xl' : 'max-w-5xl'} mx-auto px-6 sm:px-8 lg:px-8`}>
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 rounded-full bg-[#E7B936]/10 text-[#E7B936] text-xs font-bold uppercase tracking-[0.25em] mb-3 border border-[#E7B936]/25">
              LỘ TRÌNH ĐÀO TẠO
            </div>
            <h2 className="text-3xl md:text-4xl font-black mb-4 font-display">Nội Dung Chương Trình Học</h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
              Lộ trình 10 chuyên đề thực chiến cầm tay chỉ việc, được chuẩn hóa từ nền tảng đến sản xuất sản phẩm số nâng cao
            </p>
          </div>
          <div className={course.curriculum.length > 5 ? 'grid grid-cols-1 lg:grid-cols-2 gap-4' : 'space-y-4'}>
            {course.curriculum.map((module: any, idx: number) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="bg-[#0B1628] border border-slate-800 p-5 sm:p-6 rounded-[20px] flex items-start gap-4 hover:border-[#E7B936]/50 transition-all shadow-md group"
              >
                <div className="w-13 h-13 rounded-2xl bg-[#07111F] flex items-center justify-center flex-shrink-0 border border-slate-700/60 shadow-xs text-[#E7B936] group-hover:scale-105 transition-transform">
                  {module.icon || <span className="text-[#E7B936] font-bold text-xs">{module.mod || `M.${idx+1}`}</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="text-[11px] font-black uppercase tracking-wider text-[#E7B936] bg-[#E7B936]/10 px-2 py-0.5 rounded-md border border-[#E7B936]/20">
                      {module.mod || `M.${idx+1}`}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-white font-display">
                      {module.title}
                    </h3>
                  </div>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    {module.desc || "Bao gồm lý thuyết cốt lõi và thực hành ra sản phẩm thật."}
                  </p>
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

// Mock Analytics Datasets for Recharts by Timeframe
type TimeframeOption = 'all' | 'month' | 'quarter' | 'year';

const TIMEFRAME_OPTIONS: Array<{ id: TimeframeOption; label: string; desc: string }> = [
  { id: 'all', label: 'Tất cả', desc: 'Toàn thời gian lũy kế' },
  { id: 'month', label: 'Tháng này', desc: 'Tháng 9/2026' },
  { id: 'quarter', label: 'Quý này', desc: 'Quý 3/2026 (T7, T8, T9)' },
  { id: 'year', label: 'Năm 2026', desc: '9 tháng năm 2026' },
];

const TIMEFRAME_CONFIGS: Record<TimeframeOption, {
  label: string;
  sublabel: string;
  badge: string;
  metrics: {
    totalRegistrations: string;
    regGrowth: string;
    activeTeachers: string;
    activeGrowth: string;
    aiArtifacts: string;
    artifactsGrowth: string;
    completionRate: string;
    completionGrowth: string;
  };
  registrations: Array<{ time: string; registrations: number; activated: number }>;
  userActivity: Array<{ time: string; activeTeachers: number; aiGenerations: number }>;
  courseDistribution: Array<{ name: string; count: number; share: number; color: string }>;
  hourlyActivity: Array<{ hour: string; users: number }>;
  growthNote: string;
}> = {
  all: {
    label: 'Tất cả',
    sublabel: 'Dữ liệu lũy kế toàn thời gian từ khi thành lập học viện',
    badge: 'Toàn bộ thời gian',
    metrics: {
      totalRegistrations: '2,410',
      regGrowth: '+34.2%',
      activeTeachers: '4,820',
      activeGrowth: '+28.1%',
      aiArtifacts: '28,450',
      artifactsGrowth: '+45.8%',
      completionRate: '92.8%',
      completionGrowth: '+5.2%',
    },
    registrations: [
      { time: 'Q4/2025', registrations: 245, activated: 198 },
      { time: 'Q1/2026', registrations: 375, activated: 326 },
      { time: 'Q2/2026', registrations: 738, activated: 672 },
      { time: 'Q3/2026', registrations: 1052, activated: 968 },
    ],
    userActivity: [
      { time: 'T1/26', activeTeachers: 1420, aiGenerations: 2850 },
      { time: 'T2/26', activeTeachers: 1680, aiGenerations: 3420 },
      { time: 'T3/26', activeTeachers: 2150, aiGenerations: 4890 },
      { time: 'T4/26', activeTeachers: 2640, aiGenerations: 5920 },
      { time: 'T5/26', activeTeachers: 3100, aiGenerations: 7120 },
      { time: 'T6/26', activeTeachers: 3580, aiGenerations: 8450 },
      { time: 'T7/26', activeTeachers: 3620, aiGenerations: 8690 },
      { time: 'T8/26', activeTeachers: 3850, aiGenerations: 9340 },
      { time: 'T9/26', activeTeachers: 4120, aiGenerations: 10450 },
    ],
    courseDistribution: [
      { name: 'AI Toàn Diện Giáo Viên', count: 652, share: 27, color: '#F59E0B' },
      { name: 'AI Soạn Giảng 5512', count: 723, share: 30, color: '#2563EB' },
      { name: 'Bộ 3 Ngày Nền Tảng', count: 482, share: 20, color: '#E7B936' },
      { name: 'Trò Chơi & 3D Học Tập', count: 289, share: 12, color: '#10B981' },
      { name: '03 Cuốn Cẩm Nang Số', count: 168, share: 7, color: '#8B5CF6' },
      { name: 'Coaching Chuyên Biệt 1-1', count: 96, share: 4, color: '#F43F5E' },
    ],
    hourlyActivity: [
      { hour: '06h', users: 480 },
      { hour: '08h', users: 1650 },
      { hour: '10h', users: 1980 },
      { hour: '12h', users: 890 },
      { hour: '14h', users: 3120 },
      { hour: '16h', users: 2980 },
      { hour: '18h', users: 1420 },
      { hour: '20h', users: 4560 },
      { hour: '22h', users: 3890 },
      { hour: '23h', users: 1680 },
    ],
    growthNote: 'Tổng lũy kế đạt 2,410 học viên với 92.8% tỷ lệ hài lòng cao',
  },
  month: {
    label: 'Tháng này',
    sublabel: 'Dữ liệu chi tiết 4 tuần trong tháng 9/2026',
    badge: 'Tháng 9/2026',
    metrics: {
      totalRegistrations: '486',
      regGrowth: '+26.8%',
      activeTeachers: '3,980',
      activeGrowth: '+24.2%',
      aiArtifacts: '9,820',
      artifactsGrowth: '+36.1%',
      completionRate: '94.2%',
      completionGrowth: '+6.1%',
    },
    registrations: [
      { time: 'Tuần 1 (01-07)', registrations: 102, activated: 94 },
      { time: 'Tuần 2 (08-14)', registrations: 118, activated: 108 },
      { time: 'Tuần 3 (15-21)', registrations: 124, activated: 116 },
      { time: 'Tuần 4 (22-30)', registrations: 142, activated: 132 },
    ],
    userActivity: [
      { time: '17/09', activeTeachers: 2140, aiGenerations: 4520 },
      { time: '19/09', activeTeachers: 2650, aiGenerations: 5890 },
      { time: '21/09', activeTeachers: 3120, aiGenerations: 7150 },
      { time: '23/09', activeTeachers: 2410, aiGenerations: 4920 },
      { time: '25/09', activeTeachers: 3350, aiGenerations: 7820 },
      { time: '27/09', activeTeachers: 3710, aiGenerations: 8910 },
      { time: '28/09', activeTeachers: 3850, aiGenerations: 9340 },
      { time: '29/09', activeTeachers: 3420, aiGenerations: 7650 },
      { time: '30/09', activeTeachers: 3980, aiGenerations: 9820 },
    ],
    courseDistribution: [
      { name: 'AI Toàn Diện Giáo Viên', count: 136, share: 28, color: '#F59E0B' },
      { name: 'AI Soạn Giảng 5512', count: 146, share: 30, color: '#2563EB' },
      { name: 'Bộ 3 Ngày Nền Tảng', count: 97, share: 20, color: '#E7B936' },
      { name: 'Trò Chơi & 3D Học Tập', count: 58, share: 12, color: '#10B981' },
      { name: '03 Cuốn Cẩm Nang Số', count: 34, share: 7, color: '#8B5CF6' },
      { name: 'Coaching Chuyên Biệt 1-1', count: 15, share: 3, color: '#F43F5E' },
    ],
    hourlyActivity: [
      { hour: '06h', users: 320 },
      { hour: '08h', users: 1120 },
      { hour: '10h', users: 1380 },
      { hour: '12h', users: 620 },
      { hour: '14h', users: 2150 },
      { hour: '16h', users: 2210 },
      { hour: '18h', users: 950 },
      { hour: '20h', users: 3420 },
      { hour: '22h', users: 2940 },
      { hour: '23h', users: 1150 },
    ],
    growthNote: 'Tháng 9 ghi nhận tuần 4 tăng đột biến 142 lượt đăng ký mới',
  },
  quarter: {
    label: 'Quý này',
    sublabel: 'Dữ liệu Quý 3/2026 (Tháng 7, 8 và 9)',
    badge: 'Quý 3/2026',
    metrics: {
      totalRegistrations: '1,238',
      regGrowth: '+21.3%',
      activeTeachers: '3,850',
      activeGrowth: '+19.5%',
      aiArtifacts: '12,400',
      artifactsGrowth: '+31.2%',
      completionRate: '92.5%',
      completionGrowth: '+5.0%',
    },
    registrations: [
      { time: 'Tháng 7/2026', registrations: 340, activated: 312 },
      { time: 'Tháng 8/2026', registrations: 412, activated: 380 },
      { time: 'Tháng 9/2026', registrations: 486, activated: 450 },
    ],
    userActivity: [
      { time: 'Tuần 27', activeTeachers: 2750, aiGenerations: 5900 },
      { time: 'Tuần 29', activeTeachers: 2980, aiGenerations: 6420 },
      { time: 'Tuần 31', activeTeachers: 3150, aiGenerations: 7100 },
      { time: 'Tuần 33', activeTeachers: 3340, aiGenerations: 7850 },
      { time: 'Tuần 35', activeTeachers: 3580, aiGenerations: 8400 },
      { time: 'Tuần 37', activeTeachers: 3750, aiGenerations: 8950 },
      { time: 'Tuần 39', activeTeachers: 3980, aiGenerations: 9820 },
    ],
    courseDistribution: [
      { name: 'AI Toàn Diện Giáo Viên', count: 347, share: 28, color: '#F59E0B' },
      { name: 'AI Soạn Giảng 5512', count: 371, share: 30, color: '#2563EB' },
      { name: 'Bộ 3 Ngày Nền Tảng', count: 248, share: 20, color: '#E7B936' },
      { name: 'Trò Chơi & 3D Học Tập', count: 148, share: 12, color: '#10B981' },
      { name: '03 Cuốn Cẩm Nang Số', count: 87, share: 7, color: '#8B5CF6' },
      { name: 'Coaching Chuyên Biệt 1-1', count: 37, share: 3, color: '#F43F5E' },
    ],
    hourlyActivity: [
      { hour: '06h', users: 290 },
      { hour: '08h', users: 1080 },
      { hour: '10h', users: 1320 },
      { hour: '12h', users: 590 },
      { hour: '14h', users: 2040 },
      { hour: '16h', users: 2150 },
      { hour: '18h', users: 910 },
      { hour: '20h', users: 3290 },
      { hour: '22h', users: 2810 },
      { hour: '23h', users: 1090 },
    ],
    growthNote: 'Quý 3 tăng trưởng +21.3% nhờ nhu cầu chuẩn bị năm học mới 2026',
  },
  year: {
    label: 'Năm 2026',
    sublabel: 'Dữ liệu toàn diện 9 tháng năm 2026',
    badge: 'Năm 2026',
    metrics: {
      totalRegistrations: '1,428',
      regGrowth: '+18.5%',
      activeTeachers: '3,980',
      activeGrowth: '+24.2%',
      aiArtifacts: '14,920',
      artifactsGrowth: '+36.1%',
      completionRate: '91.4%',
      completionGrowth: '+4.8%',
    },
    registrations: [
      { time: 'T1/2026', registrations: 72, activated: 58 },
      { time: 'T2/2026', registrations: 98, activated: 82 },
      { time: 'T3/2026', registrations: 145, activated: 126 },
      { time: 'T4/2026', registrations: 182, activated: 164 },
      { time: 'T5/2026', registrations: 228, activated: 202 },
      { time: 'T6/2026', registrations: 295, activated: 268 },
      { time: 'T7/2026', registrations: 340, activated: 312 },
      { time: 'T8/2026', registrations: 412, activated: 380 },
      { time: 'T9/2026', registrations: 486, activated: 450 },
    ],
    userActivity: [
      { time: '17/09', activeTeachers: 2140, aiGenerations: 4520 },
      { time: '19/09', activeTeachers: 2650, aiGenerations: 5890 },
      { time: '21/09', activeTeachers: 3120, aiGenerations: 7150 },
      { time: '23/09', activeTeachers: 2410, aiGenerations: 4920 },
      { time: '25/09', activeTeachers: 3350, aiGenerations: 7820 },
      { time: '27/09', activeTeachers: 3710, aiGenerations: 8910 },
      { time: '28/09', activeTeachers: 3850, aiGenerations: 9340 },
      { time: '29/09', activeTeachers: 3420, aiGenerations: 7650 },
      { time: '30/09', activeTeachers: 3980, aiGenerations: 9820 },
    ],
    courseDistribution: [
      { name: 'AI Toàn Diện Giáo Viên', count: 400, share: 28, color: '#F59E0B' },
      { name: 'AI Soạn Giảng 5512', count: 428, share: 30, color: '#2563EB' },
      { name: 'Bộ 3 Ngày Nền Tảng', count: 286, share: 20, color: '#E7B936' },
      { name: 'Trò Chơi & 3D Học Tập', count: 171, share: 12, color: '#10B981' },
      { name: '03 Cuốn Cẩm Nang Số', count: 100, share: 7, color: '#8B5CF6' },
      { name: 'Coaching Chuyên Biệt 1-1', count: 43, share: 3, color: '#F43F5E' },
    ],
    hourlyActivity: [
      { hour: '06h', users: 320 },
      { hour: '08h', users: 1120 },
      { hour: '10h', users: 1380 },
      { hour: '12h', users: 620 },
      { hour: '14h', users: 2150 },
      { hour: '16h', users: 2210 },
      { hour: '18h', users: 950 },
      { hour: '20h', users: 3420 },
      { hour: '22h', users: 2940 },
      { hour: '23h', users: 1150 },
    ],
    growthNote: 'Tốc độ tăng trưởng trung bình cả năm đạt +28.4% mỗi tháng',
  }
};

const RECENT_REGISTRATIONS = [
  { id: 'REG-1093', teacher: 'Thầy Hoàng Văn Bách', subject: 'Toán & Tin - THPT Chuyên Sư Phạm', course: 'AI Toàn Diện Cho Giáo Viên', time: '5 phút trước', status: 'Đã kích hoạt' },
  { id: 'REG-1092', teacher: 'Cô Nguyễn Thị Mai', subject: 'Ngữ Văn - THPT Chu Văn An', course: 'AI Soạn Giảng Và Hỗ Trợ Dạy Học', time: '10 phút trước', status: 'Đã kích hoạt' },
  { id: 'REG-1091', teacher: 'Thầy Lê Hoàng Nam', subject: 'Vật Lý - THCS Lê Quý Đôn', course: 'AI Tổ Chức Hoạt Động Học Tập (Game & 3D)', time: '35 phút trước', status: 'Đã kích hoạt' },
  { id: 'REG-1090', teacher: 'Cô Trần Thu Hà', subject: 'Tiếng Anh - THPT Hà Nội - Amsterdam', course: '03 Cuốn Cẩm Nang Toàn Diện', time: '1 giờ trước', status: 'Đã kích hoạt' },
  { id: 'REG-1089', teacher: 'Thầy Phạm Minh Tuấn', subject: 'Toán Học - THPT Lương Thế Vinh', course: 'AI Toàn Diện Cho Giáo Viên', time: '2 giờ trước', status: 'Đã kích hoạt' },
  { id: 'REG-1088', teacher: 'Cô Đỗ Quỳnh Anh', subject: 'Lịch Sử & Địa Lý - THCS Trưng Vương', course: 'Bộ Tài Liệu: 03 Ngày Làm Chủ AI', time: '3 giờ trước', status: 'Đã kích hoạt' },
  { id: 'REG-1087', teacher: 'Thầy Vũ Đình Trọng', subject: 'Tin Học - THPT Nguyễn Huệ', course: 'Coaching Chuyên Biệt 1-1', time: '4 giờ trước', status: 'Đang liên hệ' },
];

// Custom Tooltip for Recharts
const ChartCustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#07111F]/95 border border-slate-700/80 p-3.5 rounded-xl shadow-2xl backdrop-blur-md text-xs">
        <p className="font-bold text-white mb-2 pb-1 border-b border-white/10">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center justify-between gap-4 py-0.5">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: entry.color || entry.stroke || entry.fill }} />
              {entry.name}:
            </span>
            <span className="font-bold text-white">
              {typeof entry.value === 'number' ? entry.value.toLocaleString('vi-VN') : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

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
  const [activeTab, setActiveTab] = useState('analytics');
  const [analyticsTimeframe, setAnalyticsTimeframe] = useState<TimeframeOption>('year');
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const currentData = TIMEFRAME_CONFIGS[analyticsTimeframe] || TIMEFRAME_CONFIGS['year'];

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
      image: formData.get('image') as string || 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=800&q=80',
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
                { id: 'analytics', label: 'Thống kê & Xu hướng', icon: <TrendingUp className="w-5 h-5" /> },
                { id: 'courses', label: 'Quản lý khóa học', icon: <BookOpen className="w-5 h-5" /> },
                { id: 'settings', label: 'Cài đặt Landing', icon: <Settings className="w-5 h-5" /> },
                { id: 'security', label: 'Bảo mật', icon: <Shield className="w-5 h-5" /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-6 py-4 text-sm font-bold transition-all border-l-4 cursor-pointer ${
                    activeTab === tab.id 
                      ? 'bg-[#F8FAFC] text-[#B45309] border-[#B45309]' 
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
            {/* ANALYTICS DASHBOARD WITH RECHARTS */}
            {activeTab === 'analytics' && (
              <div className="space-y-8">
                {/* Dashboard Sub-Header & Dropdown Filter Controls */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-[22px] border border-slate-200/90 shadow-xs">
                  <div>
                    <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                      <BarChart3 className="w-6 h-6 text-[#B45309]" />
                      <h2 className="text-xl font-bold text-[#07111F] font-display">
                        Thống Kê Đăng Ký & Xu Hướng Hoạt Động
                      </h2>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#B45309]/10 text-[#B45309] border border-[#B45309]/20">
                        {currentData.badge}
                      </span>
                    </div>
                    <p className="text-slate-500 text-xs sm:text-sm">
                      {currentData.sublabel}
                    </p>
                  </div>
                  
                  {/* Dropdown Filter + Quick-select Tabs */}
                  <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <label htmlFor="analytics-timeframe-dropdown" className="text-xs font-bold text-slate-500 flex items-center gap-1.5 whitespace-nowrap">
                        <Filter className="w-3.5 h-3.5 text-[#B45309]" />
                        <span>Bộ lọc:</span>
                      </label>
                      <div className="relative flex-grow sm:flex-grow-0">
                        <select
                          id="analytics-timeframe-dropdown"
                          value={analyticsTimeframe}
                          onChange={(e) => setAnalyticsTimeframe(e.target.value as TimeframeOption)}
                          className="w-full sm:w-auto appearance-none bg-slate-50 hover:bg-slate-100 text-[#07111F] font-bold text-xs sm:text-sm pl-3.5 pr-9 py-2.5 rounded-xl border border-slate-200/90 shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#B45309]/30 focus:border-[#B45309] transition-all cursor-pointer"
                        >
                          {TIMEFRAME_OPTIONS.map(opt => (
                            <option key={opt.id} value={opt.id}>
                              {opt.label} ({opt.desc})
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    {/* Quick-switch buttons on desktop */}
                    <div className="hidden lg:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                      {TIMEFRAME_OPTIONS.map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => setAnalyticsTimeframe(opt.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            analyticsTimeframe === opt.id
                              ? 'bg-white text-[#B45309] shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 4 High-Level Metric Cards (Dynamically calculated based on timeframe) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {/* Card 1: Registrations */}
                  <div className="bg-white p-6 rounded-[22px] border border-slate-200/90 shadow-xs">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lượt Đăng Ký ({currentData.label})</span>
                      <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#B45309] border border-amber-200/60 flex items-center justify-center">
                        <Users className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="text-3xl font-black text-[#07111F] font-display mb-1">
                      {currentData.metrics.totalRegistrations}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="inline-flex items-center gap-0.5 text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                        <TrendingUp className="w-3.5 h-3.5" /> {currentData.metrics.regGrowth}
                      </span>
                      <span className="text-slate-400">tăng trưởng</span>
                    </div>
                  </div>

                  {/* Card 2: Active Teachers */}
                  <div className="bg-white p-6 rounded-[22px] border border-slate-200/90 shadow-xs">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Giáo Viên Hoạt Động (DAU)</span>
                      <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#2563EB] border border-blue-200/60 flex items-center justify-center">
                        <Activity className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="text-3xl font-black text-[#07111F] font-display mb-1">
                      {currentData.metrics.activeTeachers}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="inline-flex items-center gap-0.5 text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                        <TrendingUp className="w-3.5 h-3.5" /> {currentData.metrics.activeGrowth}
                      </span>
                      <span className="text-slate-400">tỷ lệ tương tác cao</span>
                    </div>
                  </div>

                  {/* Card 3: AI Lesson Artifacts */}
                  <div className="bg-white p-6 rounded-[22px] border border-slate-200/90 shadow-xs">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Học Liệu AI Đã Tạo</span>
                      <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 border border-violet-200/60 flex items-center justify-center">
                        <Sparkles className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="text-3xl font-black text-[#07111F] font-display mb-1">
                      {currentData.metrics.aiArtifacts}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="inline-flex items-center gap-0.5 text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                        <TrendingUp className="w-3.5 h-3.5" /> {currentData.metrics.artifactsGrowth}
                      </span>
                      <span className="text-slate-400">giáo án, video, slide</span>
                    </div>
                  </div>

                  {/* Card 4: Course Completion */}
                  <div className="bg-white p-6 rounded-[22px] border border-slate-200/90 shadow-xs">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tỷ Lệ Hoàn Thành</span>
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60 flex items-center justify-center">
                        <Award className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="text-3xl font-black text-[#07111F] font-display mb-1">
                      {currentData.metrics.completionRate}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="inline-flex items-center gap-0.5 text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                        <TrendingUp className="w-3.5 h-3.5" /> {currentData.metrics.completionGrowth}
                      </span>
                      <span className="text-slate-400">đánh giá 4.9/5 sao</span>
                    </div>
                  </div>
                </div>

                {/* ROW 1: Course Registrations Over Time (Area Chart) + Course Distribution (Donut Pie Chart) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Registration Trends Chart (2 cols) */}
                  <div className="lg:col-span-2 bg-white p-6 sm:p-7 rounded-[22px] border border-slate-200/90 shadow-xs flex flex-col justify-between">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
                      <div>
                        <h3 className="text-base sm:text-lg font-black text-[#07111F] font-display uppercase tracking-tight">
                          Xu Hướng Lượt Đăng Ký Khóa Học ({currentData.label})
                        </h3>
                        <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
                          Tăng trưởng số lượng đăng ký mới và học viên kích hoạt thành công ({currentData.sublabel.toLowerCase()})
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="w-3 h-3 rounded-full bg-[#E7B936] inline-block" />
                        <span className="text-slate-600 font-medium">Đăng ký mới</span>
                        <span className="w-3 h-3 rounded-full bg-[#2563EB] inline-block ml-2" />
                        <span className="text-slate-600 font-medium">Đã kích hoạt</span>
                      </div>
                    </div>

                    <div className="h-[320px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={currentData.registrations} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorRegistrations" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#E7B936" stopOpacity={0.35}/>
                              <stop offset="95%" stopColor="#E7B936" stopOpacity={0.0}/>
                            </linearGradient>
                            <linearGradient id="colorActivated" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                          <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
                          <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                          <Tooltip content={<ChartCustomTooltip />} />
                          <Area 
                            type="monotone" 
                            dataKey="registrations" 
                            name="Lượt đăng ký mới" 
                            stroke="#E7B936" 
                            strokeWidth={3} 
                            fillOpacity={1} 
                            fill="url(#colorRegistrations)" 
                          />
                          <Area 
                            type="monotone" 
                            dataKey="activated" 
                            name="Đã kích hoạt khóa học" 
                            stroke="#2563EB" 
                            strokeWidth={2.5} 
                            fillOpacity={1} 
                            fill="url(#colorActivated)" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span>Giai đoạn hiển thị: <strong className="text-slate-800 font-bold">{currentData.label}</strong></span>
                      <span className="text-emerald-600 font-bold">{currentData.growthNote}</span>
                    </div>
                  </div>

                  {/* Course Registration Distribution (1 col) */}
                  <div className="bg-white p-6 sm:p-7 rounded-[22px] border border-slate-200/90 shadow-xs flex flex-col justify-between">
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-[#07111F] font-display uppercase tracking-tight">
                        Cơ Cấu Khóa Học Đăng Ký
                      </h3>
                      <p className="text-slate-500 text-xs sm:text-sm mt-0.5 mb-4">
                        Tỷ lệ lựa chọn chương trình ({currentData.label})
                      </p>

                      <div className="h-[210px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={currentData.courseDistribution}
                              cx="50%"
                              cy="50%"
                              innerRadius={55}
                              outerRadius={85}
                              paddingAngle={3}
                              dataKey="count"
                              nameKey="name"
                            >
                              {currentData.courseDistribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip content={<ChartCustomTooltip />} />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                          <span className="text-2xl font-black text-[#07111F]">{currentData.metrics.totalRegistrations}</span>
                          <span className="text-[10px] font-bold uppercase text-slate-400">Đăng ký</span>
                        </div>
                      </div>
                    </div>

                    {/* Breakdown list */}
                    <div className="space-y-2 pt-3 border-t border-slate-100">
                      {currentData.courseDistribution.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                            <span className="text-slate-700 font-medium truncate max-w-[140px] sm:max-w-[160px]">{item.name}</span>
                          </div>
                          <div className="flex items-center gap-2 font-bold">
                            <span className="text-slate-900">{item.count}</span>
                            <span className="text-slate-400 text-[11px] w-8 text-right">({item.share}%)</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ROW 2: User Activity Trends Over Time (Composed Line & Area) + Hourly Peak (Bar Chart) */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                  {/* Daily Active Users and AI Artifact Generations (3 cols) */}
                  <div className="lg:col-span-3 bg-white p-6 sm:p-7 rounded-[22px] border border-slate-200/90 shadow-xs flex flex-col justify-between">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
                      <div>
                        <h3 className="text-base sm:text-lg font-black text-[#07111F] font-display uppercase tracking-tight">
                          Xu Hướng Hoạt Động & Tương Tác Sư Phạm Số
                        </h3>
                        <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
                          Theo dõi số lượng giáo viên tương tác và số lượt tạo tài liệu/prompt AI ({currentData.label})
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="w-3 h-3 rounded-full bg-[#2563EB] inline-block" />
                        <span className="text-slate-600 font-medium">Giáo viên online</span>
                        <span className="w-3 h-3 rounded-full bg-[#8B5CF6] inline-block ml-2" />
                        <span className="text-slate-600 font-medium">Lượt tạo AI</span>
                      </div>
                    </div>

                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={currentData.userActivity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                          <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
                          <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                          <Tooltip content={<ChartCustomTooltip />} />
                          <Line 
                            type="monotone" 
                            dataKey="activeTeachers" 
                            name="Giáo viên hoạt động" 
                            stroke="#2563EB" 
                            strokeWidth={3} 
                            dot={{ r: 4, fill: '#2563EB' }}
                            activeDot={{ r: 6 }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="aiGenerations" 
                            name="Lượt tạo bài học AI" 
                            stroke="#8B5CF6" 
                            strokeWidth={3} 
                            dot={{ r: 4, fill: '#8B5CF6' }}
                            activeDot={{ r: 6 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span>Thời gian học trung bình: <strong className="text-slate-800 font-bold">46.5 phút / phiên</strong></span>
                      <span className="text-violet-600 font-bold">Trung bình 2.4 giáo án hoặc video / giáo viên</span>
                    </div>
                  </div>

                  {/* Hourly Peak Activity (2 cols) */}
                  <div className="lg:col-span-2 bg-white p-6 sm:p-7 rounded-[22px] border border-slate-200/90 shadow-xs flex flex-col justify-between">
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-[#07111F] font-display uppercase tracking-tight">
                        Khung Giờ Giáo Viên Hoạt Động
                      </h3>
                      <p className="text-slate-500 text-xs sm:text-sm mt-0.5 mb-6">
                        Khảo sát 24 giờ trong ngày để xác định thời điểm giáo viên tập trung nghiên cứu
                      </p>

                      <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={currentData.hourlyActivity} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                            <XAxis dataKey="hour" stroke="#94a3b8" fontSize={10} tickLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                            <Tooltip content={<ChartCustomTooltip />} />
                            <Bar dataKey="users" name="Giáo viên trực tuyến" fill="#E7B936" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-amber-700 font-bold">
                        <Clock className="w-3.5 h-3.5 text-[#B45309]" /> 2 Đỉnh cao: 14h-16h & 20h-22h
                      </span>
                      <span className="text-slate-400">Khung giờ vàng soạn bài</span>
                    </div>
                  </div>
                </div>

                {/* ROW 3: Real-time Recent Course Registrations Feed */}
                <div className="bg-white p-6 sm:p-7 rounded-[22px] border border-slate-200/90 shadow-xs">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-[#07111F] font-display uppercase tracking-tight flex items-center gap-2">
                        <UserCheck className="w-5 h-5 text-emerald-600" />
                        <span>Danh Sách Đăng Ký Mới Nhất Theo Thời Gian Thực</span>
                      </h3>
                      <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
                        Tự động đồng bộ hóa thông tin từ form đăng ký và tài khoản kích hoạt
                      </p>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Live Feed
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                          <th className="pb-3 pl-2">Mã ĐK</th>
                          <th className="pb-3">Giáo Viên & Trường</th>
                          <th className="pb-3">Khóa Học Đăng Ký</th>
                          <th className="pb-3">Thời Gian</th>
                          <th className="pb-3 pr-2 text-right">Trạng Thái</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {RECENT_REGISTRATIONS.map((reg) => (
                          <tr key={reg.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3.5 pl-2 font-mono font-bold text-slate-500 text-xs">
                              {reg.id}
                            </td>
                            <td className="py-3.5">
                              <div className="font-bold text-[#07111F]">{reg.teacher}</div>
                              <div className="text-xs text-slate-500">{reg.subject}</div>
                            </td>
                            <td className="py-3.5 font-medium text-slate-800">
                              {reg.course}
                            </td>
                            <td className="py-3.5 text-xs text-slate-500 whitespace-nowrap">
                              {reg.time}
                            </td>
                            <td className="py-3.5 pr-2 text-right">
                              <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                                reg.status === 'Đã kích hoạt'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}>
                                {reg.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

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
