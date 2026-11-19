import type { CmsSnapshot } from '../src/types.ts';

const IMG_HERO_CLASSROOM = '/site-assets/vn_teacher_hero_classroom_1795059315644.jpg';
const IMG_LESSON_PLANNING = '/site-assets/vn_teacher_lesson_planning_1795059325799.jpg';
const IMG_FOUNDER_PORTRAIT =
  '/assets/aistudio/480428932_9169204309853060_5234755669048678809_n_46b98dc4.jpg';
const IMG_INTERACTIVE_GAMES = '/site-assets/vn_teacher_interactive_games_1795059326886.jpg';
const IMG_SCIENCE_LAB_3D = '/site-assets/vn_teacher_science_lab_3d_1795059326436.jpg';
const IMG_VIDEO_STUDIO = '/site-assets/vn_teacher_video_studio_1795059324657.jpg';
const IMG_WORKSHOP_COACHING = '/site-assets/vn_teacher_workshop_coaching_1795059323779.jpg';

const DEFAULT_REGISTER_FORM = 'https://forms.gle/drgKvsnKvkACEHbe7';

export function buildDefaultCmsSnapshot(): CmsSnapshot {
  return {
    heroContent: {
      kicker: 'Chương trình đào tạo ứng dụng AI cho giáo viên · EDUNEXA',
      headlineLine1: 'HỌC AI THỰC CHIẾN.',
      headlineLine2: 'TẠO HỌC LIỆU DÙNG ĐƯỢC NGAY.',
      description:
        'Từ giáo án, slide, trò chơi tương tác đến video mô phỏng và ứng dụng giáo dục. Học theo quy trình thực hành, tạo sản phẩm phù hợp với công việc giảng dạy.',
      primaryCtaLabel: 'KHÁM PHÁ KHÓA HỌC',
      secondaryCtaLabel: 'XEM SẢN PHẨM THỰC TẾ',
      trustPoints: [
        'Hướng dẫn bằng tiếng Việt từng bước',
        'Kèm bộ câu lệnh & tài liệu thực hành',
        'Nhóm Zalo hỏi đáp và đồng hành',
      ],
    },
    heroShowcase: [
      {
        id: 'hero-lesson-slide',
        label: 'Giáo án & Slide',
        title: 'Giáo án chuẩn 5512 & Slide bài giảng trực quan',
        description:
          'Xây dựng kế hoạch bài dạy, phiếu học tập và chuyển đổi thành slide trình chiếu rõ bố cục cho tiết học trên lớp.',
        mediaType: 'image',
        mediaUrl: IMG_HERO_CLASSROOM,
        relatedCourseId: 'ai-toan-dien-cho-giao-vien',
        active: true,
      },
      {
        id: 'hero-game',
        label: 'Trò chơi tương tác',
        title: 'Trò chơi khởi động và củng cố kiến thức trên lớp',
        description:
          'Thiết kế minigame, câu hỏi trắc nghiệm tương tác trực tiếp trên trình duyệt theo từng môn học và cấp học.',
        mediaType: 'image',
        mediaUrl: IMG_INTERACTIVE_GAMES,
        relatedCourseId: 'ai-to-chuc-hoat-dong-hoc-tap',
        active: true,
      },
      {
        id: 'hero-3d-lab',
        label: 'Mô phỏng 3D',
        title: 'Thí nghiệm ảo & mô phỏng trực quan cho môn Khoa học',
        description:
          'Minh họa trực quan các khái niệm trừu tượng bằng mô hình 3D và thí nghiệm ảo an toàn ngay trong bài giảng.',
        mediaType: 'image',
        mediaUrl: IMG_SCIENCE_LAB_3D,
        relatedCourseId: 'ai-to-chuc-hoat-dong-hoc-tap',
        active: true,
      },
      {
        id: 'hero-video',
        label: 'Video bài giảng',
        title: 'Video AI giáo dục & học liệu số hiện đại',
        description:
          'Thực hành viết kịch bản, tạo nhân vật minh họa và đóng gói video bài giảng phục vụ dạy học trực tiếp và trực tuyến.',
        mediaType: 'image',
        mediaUrl: IMG_VIDEO_STUDIO,
        relatedCourseId: '03-cuon-cam-nang-toan-dien',
        active: true,
      },
    ],
    courses: [
      {
        id: 'ai-toan-dien-cho-giao-vien',
        title: 'AI Toàn Diện Cho Giáo Viên',
        subtitle: 'Làm chủ trọn bộ 10 chuyên đề AI sư phạm',
        categoryIds: ['SOAN_GIAO_AN', 'SLIDE_AI', 'TRO_CHOI_MO_PHONG', 'VIDEO_AI', 'UNG_DUNG_TRO_LY'],
        description:
          'Khóa học tổng hợp đầy đủ 10 chuyên đề thực chiến: từ nền tảng AI, nghiệp vụ soạn giảng, tạo slide, trợ lý ảo, trò chơi, thí nghiệm ảo, mô phỏng 3D, app giáo dục, Canva AI đến tạo video AI giáo dục.',
        fullDescription:
          'Chương trình đào tạo AI hệ thống dành cho giáo viên Việt Nam gồm 10 chuyên đề thực hành từng bước, giúp Thầy Cô kết nối các công cụ AI thành quy trình thống nhất để phục vụ soạn giảng và tổ chức dạy học.',
        outcome:
          'Tự xây dựng trọn bộ học liệu số từ giáo án 5512, slide, trợ lý ảo, trò chơi, mô phỏng 3D, Web App đến video bài giảng AI.',
        image: IMG_WORKSHOP_COACHING,
        target: 'Giáo viên mọi cấp học & Cán bộ quản lý',
        price: '999.000đ',
        originalPrice: '1.999.000đ',
        registerUrl: DEFAULT_REGISTER_FORM,
        status: 'published',
        featured: true,
        displayOrder: 10,
        benefits: [
          'Trọn bộ 10 chuyên đề thực hành theo đúng lộ trình từ cơ bản đến nâng cao',
          'Thực hành soạn giảng, slide, trợ lý ảo, trò chơi, thí nghiệm ảo, 3D, app và video AI',
          'Có nhóm Zalo hỏi đáp và đồng hành trong quá trình áp dụng',
          'Tặng kèm bộ tài nguyên thực hành & kho câu lệnh mẫu theo từng chuyên đề',
        ],
        pains: [
          'Học nhiều nội dung rời rạc nhưng chưa ghép thành quy trình áp dụng vào công việc hằng ngày.',
          'Khối lượng soạn kế hoạch bài dạy chuẩn 5512, ma trận đề và hồ sơ chuyên môn dày đặc.',
          'Muốn tổ chức trò chơi, mô phỏng trực quan và học liệu số nhưng thiếu hướng dẫn bài bản.',
          'Bối rối trước nhiều công cụ AI mới, không rõ nên chọn công cụ nào phù hợp cho giáo dục.',
        ],
        solutions: [
          'Thực hành theo hệ thống 10 chuyên đề liền mạch từ tư duy nền tảng đến sản phẩm hoàn thiện.',
          'Chuẩn hóa quy trình soạn kế hoạch bài dạy, ma trận đề kiểm tra và phiếu học tập.',
          'Tự thiết kế trò chơi tương tác, thí nghiệm ảo, mô phỏng 3D và Web App giáo dục.',
          'Sản xuất video bài giảng AI và ấn phẩm Canva phù hợp với từng môn học.',
          'Sở hữu trợ lý ảo phục vụ chuyên môn riêng và nhóm Zalo hỏi đáp đồng hành.',
        ],
        curriculum: [
          {
            mod: 'Chuyên đề 01',
            title: 'Nền tảng quan trọng',
            desc: 'Hiểu bản chất AI trong giáo dục, cấu trúc câu lệnh chuẩn bối cảnh sư phạm với ChatGPT, Claude và Gemini.',
          },
          {
            mod: 'Chuyên đề 02',
            title: 'Nghiệp vụ soạn giảng',
            desc: 'Soạn Kế hoạch bài dạy (KHBD) chuẩn 5512, xây dựng ma trận đề kiểm tra 4 mức độ nhận thức, phiếu học tập và quy trình viết SKKN.',
          },
          {
            mod: 'Chuyên đề 03',
            title: 'Tạo Slide tự động',
            desc: 'Chuyển đổi đề cương bài dạy thành slide thuyết trình rõ ràng, thẩm mỹ và đồng bộ nội dung.',
          },
          {
            mod: 'Chuyên đề 04',
            title: 'Tạo Trợ lý ảo',
            desc: 'Thiết lập và huấn luyện trợ lý AI theo tài liệu bộ môn để hỗ trợ chuẩn bị bài và giải đáp chuyên môn.',
          },
          {
            mod: 'Chuyên đề 05',
            title: 'Tạo Trò chơi học tập',
            desc: 'Thiết kế trò chơi tương tác cho phần khởi động, luyện tập và củng cố kiến thức trên lớp.',
          },
          {
            mod: 'Chuyên đề 06',
            title: 'Tạo Thí nghiệm ảo',
            desc: 'Xây dựng thí nghiệm ảo trực quan chạy trên trình duyệt web phục vụ các môn khoa học tự nhiên.',
          },
          {
            mod: 'Chuyên đề 07',
            title: 'Tạo Mô phỏng 3D',
            desc: 'Tạo mô hình và không gian 3D tương tác giúp học sinh quan sát trực tiếp các khái niệm trừu tượng.',
          },
          {
            mod: 'Chuyên đề 08',
            title: 'Thiết kế APP Giáo dục',
            desc: 'Xây dựng ứng dụng web học tập cho lớp học và bộ môn mà không cần tự viết mã lập trình.',
          },
          {
            mod: 'Chuyên đề 09',
            title: 'Ứng dụng AI trong Canva',
            desc: 'Thiết kế học liệu số, poster, sơ đồ tư duy, truyện tranh minh họa và đồ họa giảng dạy bằng Canva AI.',
          },
          {
            mod: 'Chuyên đề 10',
            title: 'Tạo Video AI Giáo dục',
            desc: 'Thực hành các dạng video AI giáo dục: nhân vật sách giáo khoa, video vẽ tranh nghệ thuật, anime và kịch bản Veo3.',
          },
        ],
        gifts: [
          '1. Trọn bộ Siêu App Sư Phạm VVIP (STEM, Chấm bài, Vẽ hình học, Tạo Game)',
          '2. Kho 1200+ Trò Chơi Học Tập Tương Tác cho các cấp học',
          '3. Bộ tài nguyên Nhân vật SGK đi đứng nói chuyện phục vụ thiết kế bài giảng',
          '4. Bộ câu lệnh chuẩn hóa cho trọn vẹn 10 chuyên đề thực chiến',
          '5. Có nhóm Zalo hỏi đáp và đồng hành',
        ],
        paymentInfo:
          'Techcombank (TCB) - STK: 88.3558.3558 - Chủ TK: CONG TY TNHH MTV GIAO DUC EDUNEXA - Nội dung: hoten + sdt + AI TOAN DIEN',
      },
      {
        id: 'bo-tai-lieu-quan-trong',
        title: 'Bộ Tài Liệu: 03 Ngày Làm Chủ AI Trong Dạy Học',
        subtitle: 'Tài liệu nền tảng thực hành theo 3 trụ cột',
        categoryIds: ['SOAN_GIAO_AN', 'SLIDE_AI', 'TAI_LIEU_CAM_NANG'],
        description:
          'Bộ tài liệu nhập môn bài bản gồm 15 chương hướng dẫn rõ từng bước, giúp giáo viên mới bắt đầu tiếp cận AI đúng cách và áp dụng ngay vào bài dạy.',
        fullDescription:
          'Chương trình đào tạo qua tài liệu chi tiết gồm 15 chương, xoay quanh 3 trụ cột thực hành: tối ưu công việc bắt buộc (giáo án, đề thi), tăng tương tác trên lớp (trò chơi, mô phỏng 3D) và nâng cao khả năng truyền đạt (video bài giảng).',
        outcome:
          'Nắm vững tư duy 3 trụ cột ứng dụng AI và tự tạo sản phẩm đầu tiên cho giáo án, trò chơi và video bài giảng.',
        image: IMG_LESSON_PLANNING,
        target: 'Giáo viên mới bắt đầu tìm hiểu AI',
        price: '299.000đ',
        originalPrice: '699.000đ',
        registerUrl: DEFAULT_REGISTER_FORM,
        status: 'published',
        featured: false,
        displayOrder: 20,
        benefits: [
          '15 chương hướng dẫn chi tiết, minh họa trực quan dễ làm theo',
          'Kho câu lệnh mẫu (Prompt) dùng trực tiếp trong công việc soạn giảng',
          'Kèm video các buổi học để chủ động xem lại và thực hành',
          'Học và được xem lại các buổi đã học trong năm 2026',
        ],
        pains: [
          'Chưa biết bắt đầu học AI từ đâu giữa quá nhiều thông tin rời rạc.',
          'Mất nhiều công sức khi soạn giáo án, đề kiểm tra và phiếu học tập.',
          'Muốn tạo trò chơi học tập hoặc video minh họa nhưng ngại rào cản kỹ thuật.',
        ],
        solutions: [
          'Làm chủ mô hình 3 trụ cột ứng dụng AI dành riêng cho giáo viên.',
          'Có sẵn mẫu câu lệnh và quy trình từng bước để áp dụng ngay.',
          'Tự tin xây dựng giáo án, trò chơi và học liệu số phục vụ tiết học.',
        ],
        curriculum: [
          {
            mod: 'Trụ cột 1',
            title: 'Làm nhanh việc bắt buộc (Giáo án, SKKN, Đề thi)',
            desc: 'Chuẩn hóa thao tác soạn kế hoạch bài dạy, ngân hàng câu hỏi và tài liệu chuyên môn.',
          },
          {
            mod: 'Trụ cột 2',
            title: 'Làm tốt việc trên lớp (Trò chơi, Mô phỏng 3D)',
            desc: 'Tổ chức hoạt động học tập sinh động bằng trò chơi tương tác và học liệu trực quan.',
          },
          {
            mod: 'Trụ cột 3',
            title: 'Làm hay việc truyền đạt (Video bài giảng số)',
            desc: 'Biến nội dung bài học thành video giáo dục dễ hiểu, thu hút sự chú ý của học sinh.',
          },
        ],
        gifts: [
          'Toàn bộ "CÁC CÂU LỆNH QUAN TRỌNG" (Cập nhật mới nhất)',
          'Kèm Video Buổi Học để xem lại chủ động',
          'Học và được xem lại các buổi đã học trong năm 2026',
        ],
        paymentInfo:
          'Techcombank (TCB) - STK: 88.3558.3558 - Chủ TK: CONG TY TNHH MTV GIAO DUC EDUNEXA - Nội dung: hoten + sdt + TAI LIEU 3 NGAY',
      },
      {
        id: 'ai-soan-giang-ho-tro-day-hoc',
        title: 'AI Trong Soạn Giảng Và Hỗ Trợ Dạy Học',
        subtitle: 'Khóa học E-Learning nghiệp vụ sư phạm',
        categoryIds: ['SOAN_GIAO_AN', 'SLIDE_AI', 'UNG_DUNG_TRO_LY'],
        description:
          'Tập trung chuyên sâu vào nghiệp vụ soạn giáo án, xây dựng đề kiểm tra, viết SKKN, làm slide tự động và tạo trợ lý ảo hỗ trợ giảng dạy.',
        fullDescription:
          'Khóa học tập trung giải quyết các công việc cốt lõi của giáo viên: từ tư duy đặt câu lệnh sư phạm, sử dụng NotebookLM, tạo đề kiểm tra đến thiết kế slide và xây dựng trợ lý ảo theo bộ môn.',
        outcome:
          'Thành thạo quy trình soạn giáo án, đề kiểm tra, slide bài giảng và tạo trợ lý AI riêng cho môn học mình giảng dạy.',
        image: IMG_HERO_CLASSROOM,
        target: 'Giáo viên mọi cấp học',
        price: '399.000đ',
        originalPrice: '1.500.000đ',
        registerUrl: DEFAULT_REGISTER_FORM,
        status: 'published',
        featured: false,
        displayOrder: 30,
        benefits: [
          'Quy trình thực hành chuẩn hóa theo 4 module nghiệp vụ soạn giảng',
          'Soạn giáo án, đề kiểm tra, vẽ hình học, ứng dụng NotebookLM và SKKN',
          'Tạo slide bài giảng và thiết kế trợ lý ảo cá nhân hóa',
          'Có nhóm Zalo hỏi đáp và đồng hành',
        ],
        pains: [
          'Khối lượng soạn giáo án, đề thi và tài liệu chuyên môn chiếm nhiều buổi tối.',
          'Dùng AI nhưng câu trả lời còn chung chung, chưa sát chương trình giáo dục Việt Nam.',
          'Chưa biết cách nạp tài liệu bộ môn để tạo trợ lý ảo hỗ trợ lâu dài.',
        ],
        solutions: [
          'Nắm vững nền tảng và tư duy bối cảnh khi làm việc với AI trong giảng dạy.',
          'Soạn giáo án, câu hỏi và đề kiểm tra có cấu trúc rõ ràng, phân hóa theo đối tượng học sinh.',
          'Tạo slide bài giảng gọn đẹp từ đề cương bài học.',
          'Xây dựng trợ lý AI chuyên biệt theo tài liệu môn học để tra cứu và gợi ý ý tưởng.',
        ],
        curriculum: [
          {
            mod: 'Module 1',
            title: 'Nền tảng quan trọng về AI giáo dục',
            desc: 'Nắm vững khái niệm cốt lõi, tư duy bối cảnh và cách vận hành AI trong môi trường sư phạm.',
          },
          {
            mod: 'Module 2',
            title: 'Nghiệp vụ soạn giảng AI chuyên sâu',
            desc: 'Soạn giáo án & đề thi, vẽ hình học, ứng dụng NotebookLM, quy trình viết & rà soát SKKN bằng AI.',
          },
          {
            mod: 'Module 3',
            title: 'Làm slide bài giảng tự động',
            desc: 'Thiết kế slide thuyết trình rõ ràng, thẩm mỹ từ đề cương hoặc từ khóa bài học.',
          },
          {
            mod: 'Module 4',
            title: 'Thiết kế trợ lý ảo cá nhân hóa',
            desc: 'Xây dựng trợ lý AI nạp tài liệu bộ môn để hỗ trợ chuẩn bị bài và giảng dạy.',
          },
        ],
        gifts: [
          '1. Siêu App Ứng Dụng STEM - VVIP',
          '2. Siêu App AI Chấm Bài - VVIP',
          '3. Siêu App Vẽ Hình Học Thông Minh - VVIP',
          '4. Siêu App Tạo Prompt Trò Chơi Học Tập - VVIP',
          '5. Siêu App Prompt Mô Phỏng 3D - VVIP',
        ],
        paymentInfo:
          'Techcombank (TCB) - STK: 88.3558.3558 - Chủ TK: CONG TY TNHH MTV GIAO DUC EDUNEXA - Nội dung: hoten + sdt + AI SOAN GIANG',
      },
      {
        id: 'ai-to-chuc-hoat-dong-hoc-tap',
        title: 'AI Trong Tổ Chức Hoạt Động Học Tập',
        subtitle: 'Tạo Trò Chơi, Mô Phỏng 3D, Thí Nghiệm Ảo & Web App',
        categoryIds: ['TRO_CHOI_MO_PHONG', 'UNG_DUNG_TRO_LY'],
        description:
          'Hướng dẫn thiết kế trò chơi học tập tương tác, mô phỏng 3D, thí nghiệm ảo và ứng dụng web phục vụ các hoạt động sôi nổi ngay trên lớp.',
        fullDescription:
          'Khóa học tập trung vào thiết kế hoạt động học tập trực quan và giàu tương tác, giúp giáo viên tự tạo trò chơi, thí nghiệm ảo, mô phỏng 3D và Web App giáo dục mà không cần biết lập trình.',
        outcome:
          'Tự thiết kế trò chơi lớp học, thí nghiệm ảo, mô phỏng 3D và Web App giáo dục chia sẻ cho học sinh sử dụng ngay.',
        image: IMG_INTERACTIVE_GAMES,
        target: 'Giáo viên muốn đổi mới hoạt động lớp học',
        price: '399.000đ',
        originalPrice: '1.500.000đ',
        registerUrl: DEFAULT_REGISTER_FORM,
        status: 'published',
        featured: false,
        displayOrder: 40,
        benefits: [
          'Quy trình tạo trò chơi học tập tương tác theo từng bài dạy',
          'Thiết kế mô phỏng 3D, thí nghiệm ảo và Web App không cần viết code',
          'Kèm kho 1200 trò chơi, 38 App giáo dục và 15 mô phỏng 3D tham khảo',
          'Có nhóm Zalo hỏi đáp và đồng hành',
        ],
        pains: [
          'Tiết học thiên về trình bày một chiều khiến học sinh ít tương tác.',
          'Cần thí nghiệm ảo hoặc hình ảnh 3D trực quan nhưng thiếu công cụ và thiết bị.',
          'Có ý tưởng trò chơi hoặc ứng dụng ôn tập nhưng không biết lập trình.',
        ],
        solutions: [
          'Thực hành quy trình tạo trò chơi học tập tương tác gắn với nội dung bài học.',
          'Biến khái niệm trừu tượng thành mô phỏng 3D và thí nghiệm ảo ngay trên trình duyệt.',
          'Xây dựng Web App giáo dục và trợ lý AI riêng phục vụ lớp học.',
        ],
        curriculum: [
          {
            mod: 'Chuyên đề 1',
            title: 'Quy trình tạo trò chơi học tập tương tác',
            desc: 'Thiết kế các trò chơi phù hợp từng cấp học cho hoạt động khởi động và củng cố bài.',
          },
          {
            mod: 'Chuyên đề 2',
            title: 'Cách thiết kế mô phỏng 3D',
            desc: 'Tạo vật thể và không gian 3D giúp minh họa các kiến thức khó hình dung.',
          },
          {
            mod: 'Chuyên đề 3',
            title: 'Xây dựng thí nghiệm ảo sinh động',
            desc: 'Mô phỏng các thí nghiệm Vật lý, Hóa học, Sinh học trực quan và an toàn.',
          },
          {
            mod: 'Chuyên đề 4',
            title: 'Quy trình thiết kế Web App giáo dục',
            desc: 'Tạo ứng dụng web học tập riêng cho lớp học mà không cần nền tảng lập trình.',
          },
          {
            mod: 'Chuyên đề 5',
            title: 'Tạo trợ lý AI phục vụ giảng dạy',
            desc: 'Thiết lập trợ lý ảo hỗ trợ học sinh ôn tập và giải đáp kiến thức bài học.',
          },
        ],
        gifts: [
          '1. 1200 Trò Chơi Cho Các Cấp Học bằng AI và PowerPoint',
          '2. 38 APP Giáo Dục và 04 Trợ Lý Ảo chuyên biệt',
          '3. 15 Mô Phỏng 3D và Thí Nghiệm Ảo sinh động',
          '4. Có nhóm Zalo hỏi đáp và đồng hành',
        ],
        paymentInfo:
          'Techcombank (TCB) - STK: 88.3558.3558 - Chủ TK: CONG TY TNHH MTV GIAO DUC EDUNEXA - Nội dung: hoten + sdt + AI TO CHUC HOAT DONG',
      },
      {
        id: '03-cuon-cam-nang-toan-dien',
        title: '03 Cuốn Cẩm Nang Toàn Diện',
        subtitle: 'Làm chủ Video AI, Canva giáo dục và Trò chơi tương tác',
        categoryIds: ['VIDEO_AI', 'TRO_CHOI_MO_PHONG', 'TAI_LIEU_CAM_NANG'],
        description:
          'Bộ 03 cuốn cẩm nang điện tử hướng dẫn chi tiết từng bước cách sản xuất 07 loại video AI giáo dục, thiết kế Canva và xây dựng trò chơi học tập.',
        fullDescription:
          'Thư viện cẩm nang thực hành giúp giáo viên tự tra cứu và áp dụng theo từng bước rõ ràng để tạo video bài giảng, đồ họa Canva và trò chơi tương tác cho lớp học.',
        outcome:
          'Chủ động sản xuất 07 dạng video AI giáo dục, thiết kế học liệu Canva đồng bộ và tổ chức trò chơi tương tác.',
        image: IMG_VIDEO_STUDIO,
        target: 'Giáo viên tự học & sáng tạo học liệu số',
        price: '399.000đ',
        originalPrice: '999.000đ',
        registerUrl: DEFAULT_REGISTER_FORM,
        status: 'published',
        featured: false,
        displayOrder: 50,
        benefits: [
          'Hướng dẫn làm 07 loại video AI giáo dục (nhân vật nói, tranh vẽ, anime...)',
          'Quy trình thiết kế học liệu số, slide và poster trên Canva',
          'Kho 1200+ trò chơi tương tác và bộ tài nguyên nhân vật SGK',
          'Có nhóm Zalo hỏi đáp và đồng hành',
        ],
        pains: [
          'Muốn làm video bài giảng nhưng ngại quay hình trực tiếp hoặc gặp khó khi dựng phim.',
          'Tài liệu tự học trên mạng rời rạc, khó tổng hợp thành các bước cụ thể.',
          'Mất nhiều thời gian tìm ý tưởng thiết kế slide và hoạt động cho học sinh.',
        ],
        solutions: [
          'Thực hành theo 03 cuốn cẩm nang chia bước rõ ràng, dễ tra cứu bất cứ lúc nào.',
          'Làm chủ quy trình sản xuất 07 dạng video AI phục vụ bài giảng.',
          'Thiết kế đồ họa học tập trên Canva và tổ chức kho trò chơi sinh động.',
        ],
        curriculum: [
          {
            mod: 'Ebook 1',
            title: 'Chinh phục 07 loại Video AI Giáo Dục',
            desc: 'Hướng dẫn từ video nhân vật nói, video vẽ tranh nghệ thuật đến video hoạt hình bài giảng.',
          },
          {
            mod: 'Ebook 2',
            title: 'Thiết kế học liệu số Canva chuyên nghiệp',
            desc: 'Ứng dụng Canva giáo dục để tạo slide, poster, phiếu học tập và đồ họa trực quan.',
          },
          {
            mod: 'Ebook 3',
            title: 'Xây dựng trò chơi tương tác và kho tài nguyên',
            desc: 'Khai thác kho 1200+ trò chơi và quy trình thiết kế hoạt động khởi động, củng cố kiến thức.',
          },
        ],
        gifts: [
          '1. Toàn bộ "Nhân Vật SGK Đi Đứng Nói" phục vụ thiết kế bài giảng',
          '2. Chuyên đề: "1200 Trò Chơi Học Tập Tương Tác Với Học Sinh"',
          '3. Trợ lý AI: "Tạo Video Nghệ Thuật Tranh Cát"',
          '4. Bộ Trợ Lý viết kịch bản Video Veo3 chuyên sâu',
          '5. Bộ trợ lý dùng trong Soạn Giảng và Dạy Học',
          '6. Có nhóm Zalo hỏi đáp và đồng hành',
        ],
        paymentInfo:
          'Techcombank (TCB) - STK: 88.3558.3558 - Chủ TK: CONG TY TNHH MTV GIAO DUC EDUNEXA - Nội dung: hoten + sdt + 3 CUON CAM NANG',
      },
      {
        id: 'coaching-chuyen-biet',
        title: 'Chương Trình Coaching: Đồng Hành Chuyên Biệt',
        subtitle: 'Kèm cặp 1-1, Tổ chuyên môn hoặc Nhà trường',
        categoryIds: ['COACHING'],
        description:
          'Chương trình huấn luyện cá nhân hóa theo sát nhu cầu thực tế của từng giáo viên, nhóm giáo viên hoặc nhà trường triển khai ứng dụng AI.',
        fullDescription:
          'Gói tư vấn và đào tạo trực tiếp theo yêu cầu riêng của cá nhân, tổ chuyên môn hoặc đơn vị giáo dục, tập trung tháo gỡ vướng mắc cụ thể và chuyển giao quy trình ứng dụng AI phù hợp.',
        outcome:
          'Xây dựng lộ trình và kho học liệu AI bám sát đúng đặc thù bộ môn hoặc kế hoạch chuyển đổi số của nhà trường.',
        image: IMG_FOUNDER_PORTRAIT,
        target: 'Cá nhân, Tổ chuyên môn & Nhà trường',
        price: 'Liên hệ',
        originalPrice: 'Theo nhu cầu',
        registerUrl: DEFAULT_REGISTER_FORM,
        registerLabel: 'Đăng ký tư vấn',
        status: 'published',
        featured: false,
        displayOrder: 60,
        benefits: [
          'Thiết kế nội dung huấn luyện bám sát mục tiêu riêng của cá nhân hoặc đơn vị',
          'Thực hành trực tiếp, tháo gỡ vướng mắc kỹ thuật ngay trong buổi làm việc',
          'Chuyển giao quy trình và bộ học liệu thực hành của EDUNEXA',
        ],
        pains: [
          'Cần sự kèm cặp sát sao riêng theo tiến độ cá nhân thay vì học lớp đông.',
          'Tổ chuyên môn hoặc nhà trường muốn triển khai AI đồng bộ cho đội ngũ giáo viên.',
          'Cần xây dựng giải pháp ứng dụng AI phù hợp với đặc thù riêng của từng bộ môn.',
        ],
        solutions: [
          'Khảo sát nhu cầu và xây dựng lộ trình coaching riêng cho từng cá nhân hoặc đơn vị.',
          'Trực tiếp hướng dẫn thao tác, giải quyết bài toán chuyên môn ngay tại buổi học.',
          'Chuyển giao tài nguyên và đồng hành hỗ trợ triển khai thực tế.',
        ],
        curriculum: [
          {
            mod: 'Gói 1',
            title: 'Coaching 1-1 Chuyên sâu',
            desc: 'Kèm cặp trực tiếp theo mục tiêu giảng dạy, nghiên cứu hoặc xây dựng học liệu cá nhân.',
          },
          {
            mod: 'Gói 2',
            title: 'Coaching Đội nhóm & Tổ chuyên môn',
            desc: 'Đào tạo thực hành đồng bộ cho nhóm giáo viên cùng bộ môn hoặc tổ chuyên môn.',
          },
          {
            mod: 'Gói 3',
            title: 'Tập huấn Nhà trường & Đơn vị giáo dục',
            desc: 'Thiết kế chương trình tập huấn ứng dụng AI vào giảng dạy theo kế hoạch của nhà trường.',
          },
        ],
        gifts: ['Toàn bộ học liệu thực hành và bộ tài nguyên số của EDUNEXA'],
        paymentInfo: 'Hotline / Zalo tư vấn trực tiếp: 094 456 2096',
      },
    ],
    artifacts: [
      {
        id: 'artifact-khbd',
        category: 'Soạn giảng',
        title: 'Kế hoạch bài dạy 5512 & Ma trận đề kiểm tra',
        description:
          'Cấu trúc rõ hoạt động khởi động, hình thành kiến thức, luyện tập, vận dụng cùng ngân hàng câu hỏi và phiếu học tập.',
        image: IMG_LESSON_PLANNING,
        courseId: 'ai-soan-giang-ho-tro-day-hoc',
        courseLabel: 'AI Trong Soạn Giảng Và Hỗ Trợ Dạy Học',
      },
      {
        id: 'artifact-slide',
        category: 'Trình chiếu',
        title: 'Bộ Slide bài giảng & Đồ họa Canva sư phạm',
        description:
          'Chuyển hóa dàn ý bài dạy thành slide trình chiếu có hình ảnh minh họa, sơ đồ trực quan và bố cục dễ theo dõi.',
        image: IMG_HERO_CLASSROOM,
        courseId: 'ai-toan-dien-cho-giao-vien',
        courseLabel: 'AI Toàn Diện Cho Giáo Viên',
      },
      {
        id: 'artifact-game',
        category: 'Hoạt động lớp học',
        title: 'Trò chơi học tập tương tác nhiều cấp học',
        description:
          'Tạo hoạt động khởi động, vượt chướng ngại vật và ôn tập kiến thức chạy trực tiếp trên máy tính lớp học.',
        image: IMG_INTERACTIVE_GAMES,
        courseId: 'ai-to-chuc-hoat-dong-hoc-tap',
        courseLabel: 'AI Trong Tổ Chức Hoạt Động Học Tập',
      },
      {
        id: 'artifact-3d',
        category: 'STEM & Khoa học',
        title: 'Thí nghiệm ảo & Mô phỏng 3D tương tác',
        description:
          'Xây dựng mô hình trực quan cho các nội dung khó quan sát bằng mắt thường trong môn Toán, Lý, Hóa, Sinh và KHTN.',
        image: IMG_SCIENCE_LAB_3D,
        courseId: 'ai-to-chuc-hoat-dong-hoc-tap',
        courseLabel: 'AI Trong Tổ Chức Hoạt Động Học Tập',
      },
      {
        id: 'artifact-app',
        category: 'Ứng dụng web',
        title: 'Web App giáo dục & Trợ lý AI riêng cho môn học',
        description:
          'Đóng gói ứng dụng ôn tập, tra cứu kiến thức và trợ lý ảo nạp tài liệu chuyên môn mà không cần tự lập trình.',
        image: IMG_WORKSHOP_COACHING,
        courseId: 'ai-toan-dien-cho-giao-vien',
        courseLabel: 'AI Toàn Diện Cho Giáo Viên',
      },
      {
        id: 'artifact-video',
        category: 'Video giáo dục',
        title: 'Video bài giảng AI & Nhân vật sách giáo khoa',
        description:
          'Sản xuất video kể chuyện lịch sử, văn học, bài giảng hoạt hình và clip minh họa kiến thức dễ tiếp cận với học sinh.',
        image: IMG_VIDEO_STUDIO,
        courseId: '03-cuon-cam-nang-toan-dien',
        courseLabel: '03 Cuốn Cẩm Nang Toàn Diện',
      },
    ],
    // Không tự tạo phản hồi giả — Quản trị viên thêm phản hồi thực tế có nguồn xác thực trong /quan-tri
    testimonials: [],
    instructor: {
      kicker: '07 · Giảng viên & Học viện EDUNEXA',
      heading: 'Đồng hành cùng giáo viên Việt Nam chuyển đổi số thực chất',
      name: 'Thầy Trần Đông (Trần Văn Đông)',
      roleLine: 'Nhà sáng lập EDUNEXA · Đào tạo ứng dụng AI trong giáo dục',
      bioParagraph1:
        'Thầy Trần Đông (Trần Văn Đông) là nhà sáng lập EDUNEXA, trực tiếp nghiên cứu, xây dựng giáo trình và hướng dẫn giáo viên ứng dụng trí tuệ nhân tạo vào soạn giảng, thiết kế học liệu số và tổ chức hoạt động lớp học.',
      bioParagraph2:
        'Các chương trình tại EDUNEXA được xây dựng theo hướng thực hành trực tiếp trên bối cảnh chương trình giáo dục phổ thông Việt Nam, giúp Thầy Cô tiếp cận công nghệ dễ hiểu, có hệ thống và áp dụng được vào công việc hằng ngày.',
      quote:
        'AI không thay thế người thầy, mà đóng vai trò công cụ hỗ trợ để người thầy có thêm không gian sáng tạo và tập trung tốt hơn cho học sinh.',
      portraitUrl: IMG_FOUNDER_PORTRAIT,
    },
    faqs: [
      {
        id: 'faq-1',
        q: 'Tôi chưa từng biết hoặc dùng AI có học được không?',
        a: 'Hoàn toàn học được. Các chương trình tại EDUNEXA được thiết kế theo phương pháp cầm tay chỉ việc bằng tiếng Việt, hướng dẫn từ tư duy nền tảng, có sẵn mẫu câu lệnh và video xem lại để Thầy Cô thực hành từng bước.',
      },
      {
        id: 'faq-2',
        q: 'Tôi không biết lập trình thì có tạo được Web App và Trò chơi không?',
        a: 'Có. Khóa học hướng dẫn cách mô tả yêu cầu sư phạm để AI hỗ trợ tạo mã và đóng gói thành trò chơi, mô phỏng 3D hoặc ứng dụng web phục vụ dạy học mà Thầy Cô không cần tự viết code.',
      },
      {
        id: 'faq-3',
        q: 'Tôi chỉ dùng tài khoản AI miễn phí thì có học và thực hành được không?',
        a: 'Được. Quy trình thực hành tại EDUNEXA ưu tiên các công cụ AI có phiên bản miễn phí (ChatGPT, Gemini, Claude, Canva...) để bất kỳ giáo viên nào cũng có thể thực hành và ứng dụng.',
      },
      {
        id: 'faq-4',
        q: 'Khóa học có phù hợp với giáo viên lớn tuổi hoặc ít tiếp xúc công nghệ không?',
        a: 'Phù hợp. Bài giảng trình bày chậm rãi, tập trung vào thao tác thực tế gắn với công việc soạn giảng hằng ngày và có nhóm Zalo hỏi đáp để hỗ trợ khi Thầy Cô gặp vướng mắc.',
      },
      {
        id: 'faq-5',
        q: 'Tôi dạy môn đặc thù (Âm nhạc, Mỹ thuật, GDCD, Mầm non...) thì áp dụng thế nào?',
        a: 'AI có thể ứng dụng linh hoạt ở nhiều cấp học và môn học: từ Ngữ văn, Lịch sử, Địa lý (tranh minh họa, truyện kể, video), Toán - Lý - Hóa - Sinh (mô phỏng 3D, thí nghiệm ảo, ngân hàng câu hỏi) đến Mầm non, Tiểu học và các môn năng khiếu (trò chơi, phiếu học tập trực quan).',
      },
      {
        id: 'faq-6',
        q: 'Học xong có tự làm được sản phẩm thực tế để dùng trên lớp không?',
        a: 'Mỗi chuyên đề đều gắn với bài tập thực hành cụ thể như kế hoạch bài dạy, slide, trò chơi, mô phỏng hoặc video bài giảng để Thầy Cô tự tạo sản phẩm phù hợp với môn học mình đang phụ trách.',
      },
      {
        id: 'faq-7',
        q: 'Việc xem lại bài giảng và hỗ trợ sau khi đăng ký được thực hiện như thế nào?',
        a: 'Thầy Cô được cung cấp video bài giảng, tài liệu và bộ câu lệnh để chủ động xem lại khi cần, đồng thời tham gia nhóm Zalo hỏi đáp và đồng hành cùng giảng viên và cộng đồng giáo viên EDUNEXA.',
      },
    ],
    sectionVisibility: {
      'gia-tri': true,
      'khoa-hoc': true,
      'san-pham': true,
      'lo-trinh': true,
      'quy-trinh': true,
      'giang-vien': true,
      'phan-hoi': true,
      'hoi-dap': true,
      'dang-ky': true,
    },
    customSections: [],
    siteMedia: {
      valueSectionImage: IMG_WORKSHOP_COACHING,
      founderPortrait: IMG_FOUNDER_PORTRAIT,
    },
    settings: {
      siteName: 'EDUNEXA AI — Đào Tạo Ứng Dụng AI Thực Chiến Cho Giáo Viên',
      siteDescription:
        'Học AI thực chiến dành cho giáo viên Việt Nam. Tạo giáo án chuẩn 5512, slide bài giảng, trò chơi tương tác, mô phỏng 3D, Web App và video AI giáo dục.',
      footerDescription:
        'Hệ thống đào tạo ứng dụng AI thực hành dành cho giáo viên và đơn vị giáo dục Việt Nam, hướng tới tạo ra học liệu số thực tế áp dụng ngay trong giảng dạy.',
      copyrightText: '© 2026 CONG TY TNHH MTV GIAO DUC EDUNEXA. Bảo lưu mọi quyền.',
      contactEmail: 'lienhe@edunexa.edu.vn',
      registrationFormUrl: DEFAULT_REGISTER_FORM,
      zaloConsultUrl: 'https://zalo.me/0944562096',
      paymentUrl: '',
      hotlineDisplay: '094 456 2096',
      hotlineTel: 'tel:0944562096',
      facebookCommunityUrl: 'https://www.facebook.com/groups/24037123512640076',
      facebookPersonalUrl: 'https://www.facebook.com/tranvandong.vietnam',
      tiktokUrl: 'https://www.tiktok.com/@trn.ng_ai.trainer',
      youtubeUrl: 'https://www.youtube.com/@AITrainer.Offical',
      websiteUrl: 'https://edunexaai.vercel.app',
      mobileStickyEnabled: true,
      mobileStickyLabel: 'Đăng ký khóa học',
      mobileStickySublabel: 'Tư vấn & Zalo: 094 456 2096',
      mobileStickyUrl: '#dang-ky',
    },
  };
}
