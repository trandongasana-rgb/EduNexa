export type CourseCategoryId =
  | 'ALL'
  | 'SOAN_GIAO_AN'
  | 'SLIDE_AI'
  | 'TRO_CHOI_MO_PHONG'
  | 'VIDEO_AI'
  | 'UNG_DUNG_TRO_LY'
  | 'TAI_LIEU_CAM_NANG'
  | 'COACHING';

export interface CurriculumItem {
  mod: string;
  title: string;
  desc?: string;
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  categoryIds: Exclude<CourseCategoryId, 'ALL'>[];
  description: string;
  fullDescription: string;
  outcome: string;
  image: string;
  target: string;
  price: string;
  originalPrice?: string;
  registerUrl: string;
  registerLabel?: string;
  benefits: string[];
  pains: string[];
  solutions: string[];
  curriculum: CurriculumItem[];
  gifts: string[];
  paymentInfo: string;
  brochurePdfUrl?: string;
  vietQrImageUrl?: string;
  status?: 'published' | 'hidden';
  featured?: boolean;
  displayOrder?: number;
}

export interface HeroMediaItem {
  id: string;
  label: string;
  title: string;
  description: string;
  mediaType: 'image' | 'video';
  mediaUrl: string;
  posterUrl?: string;
  relatedCourseId?: string;
  active?: boolean;
}

export interface StudentArtifact {
  id: string;
  category: string;
  title: string;
  description: string;
  image: string;
  courseId: string;
  courseLabel: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  quote: string;
  sourceLabel: string;
  sourceUrl: string;
  avatar: string;
  productImage: string;
  productCaption: string;
}

export interface SiteMediaConfig {
  valueSectionImage: string;
  founderPortrait: string;
}

export interface SiteSettings {
  siteName?: string;
  siteDescription?: string;
  footerDescription?: string;
  copyrightText?: string;
  contactEmail?: string;
  registrationFormUrl: string;
  zaloConsultUrl?: string;
  paymentUrl?: string;
  hotlineDisplay: string;
  hotlineTel: string;
  facebookCommunityUrl: string;
  facebookPersonalUrl: string;
  tiktokUrl: string;
  youtubeUrl: string;
  websiteUrl: string;
  mobileStickyEnabled: boolean;
  mobileStickyLabel: string;
  mobileStickySublabel: string;
  mobileStickyUrl: string;
}

export interface RoadmapModule {
  num: string;
  stage: 1 | 2 | 3;
  title: string;
  summary: string;
  output: string;
}

export interface HeroContentConfig {
  kicker: string;
  headlineLine1: string;
  headlineLine2: string;
  description: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
  trustPoints: string[];
}

export interface InstructorConfig {
  kicker: string;
  heading: string;
  name: string;
  roleLine: string;
  bioParagraph1: string;
  bioParagraph2: string;
  quote: string;
  portraitUrl: string;
}

export interface FaqItem {
  id: string;
  q: string;
  a: string;
}

export type StandardSectionKey =
  | 'gia-tri'
  | 'khoa-hoc'
  | 'san-pham'
  | 'lo-trinh'
  | 'quy-trinh'
  | 'giang-vien'
  | 'phan-hoi'
  | 'hoi-dap'
  | 'dang-ky';

export interface CustomLandingSection {
  id: string;
  kicker: string;
  title: string;
  body: string;
  ctaLabel?: string;
  ctaUrl?: string;
  imageUrl?: string;
  visible: boolean;
  theme: 'white' | 'light' | 'navy';
}

export interface SectionVisibilityMap {
  'gia-tri': boolean;
  'khoa-hoc': boolean;
  'san-pham': boolean;
  'lo-trinh': boolean;
  'quy-trinh': boolean;
  'giang-vien': boolean;
  'phan-hoi': boolean;
  'hoi-dap': boolean;
  'dang-ky': boolean;
}

export interface CmsSnapshot {
  courses: Course[];
  heroContent: HeroContentConfig;
  heroShowcase: HeroMediaItem[];
  artifacts: StudentArtifact[];
  testimonials: TestimonialItem[];
  instructor: InstructorConfig;
  faqs: FaqItem[];
  sectionVisibility: SectionVisibilityMap;
  customSections: CustomLandingSection[];
  siteMedia: SiteMediaConfig;
  settings: SiteSettings;
}

export interface CmsStateResponse {
  draft: CmsSnapshot;
  published: CmsSnapshot;
  draftUpdatedAt: string;
  publishedUpdatedAt: string;
  hasUnpublishedChanges: boolean;
}

export type InquiryStatus = 'new' | 'contacted' | 'enrolled' | 'archived';

export interface InquiryRecord {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  courseId: string;
  courseTitle: string;
  note: string;
  source: string;
  status: InquiryStatus;
  adminNotes: string;
  consentAccepted?: boolean;
  consentAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLogItem {
  id: number;
  timestamp: string;
  actor: string;
  action: string;
  entityType: string;
  entityId: string | null;
  summary: string;
  status: 'success' | 'warning' | 'error';
}

export interface AdminOverviewResponse {
  courses: {
    total: number;
    published: number;
    hidden: number;
    featured: number;
  };
  media: {
    total: number;
    published: number;
    pending: number;
    fromDrive: number;
    uploaded: number;
  };
  banners: {
    total: number;
    active: number;
  };
  inquiries: {
    total: number;
    newCount: number;
    contactedCount: number;
    enrolledCount: number;
  };
  drive: {
    isOperational: boolean;
    connectionStatus: string;
    rootFolderName: string;
    lastSyncedAt: string | null;
    lastErrorCount: number;
  };
  cms: {
    draftUpdatedAt: string;
    publishedUpdatedAt: string;
    hasUnpublishedChanges: boolean;
  };
  recentLogs: AuditLogItem[];
}

export type DriveCategory =
  | 'BANNER_HERO'
  | 'ANH_KHOA_HOC'
  | 'SAN_PHAM_HOC_VIEN'
  | 'ANH_GIANG_VIEN'
  | 'THU_VIEN_ANH'
  | 'ANH_DOI_TAC'
  | 'CHO_DUYET';

export type PublicationStatus =
  | 'published'
  | 'pending'
  | 'unpublished'
  | 'archived'
  | 'deleted_in_drive'
  | 'error';

export type DeletePolicy = 'unpublish' | 'archive' | 'keep';

export interface FolderGroupRule {
  category: DriveCategory;
  folderName: string;
  label: string;
  autoPublish: boolean;
  enabled: boolean;
}

export interface DriveConfig {
  id: number;
  rootFolderId: string;
  rootFolderName: string;
  rootFolderUrl: string;
  connectedEmail: string;
  connectedDisplayName: string;
  connectionStatus: 'disconnected' | 'connected_verified' | 'error';
  lastVerifiedAt: string | null;
  lastError: string | null;
  syncIntervalMinutes: number;
  autoSyncEnabled: boolean;
  deletePolicy: DeletePolicy;
  maxFileSizeMb: number;
  folderRules: FolderGroupRule[];
}

export interface SyncedMediaAsset {
  id: string;
  driveFileId: string;
  folderId: string;
  filename: string;
  mimeType: string;
  fileSize: number;
  width: number;
  height: number;
  checksum: string;
  modifiedTime: string;
  title: string;
  altText: string;
  category: DriveCategory;
  courseId: string | null;
  displayOrder: number;
  publicUrl: string;
  thumbnailUrl: string;
  publicationStatus: PublicationStatus;
  errorMessage: string | null;
  lastSyncedAt: string;
  createdAt: string;
}

export interface SyncLogItem {
  id: number;
  startedAt: string;
  finishedAt: string;
  triggerType: 'manual' | 'scheduled' | 'verify';
  status: 'success' | 'partial' | 'error';
  discoveredCount: number;
  syncedCount: number;
  skippedCount: number;
  updatedCount: number;
  deletedCount: number;
  errorCount: number;
  errorMessage: string | null;
  details: string[];
}

export interface DriveStatusResponse {
  config: DriveConfig;
  hasLiveOAuth: boolean;
  isOperational: boolean;
  isSyncRunning: boolean;
  counts: {
    totalStored: number;
    published: number;
    pending: number;
    error: number;
    deletedInDrive: number;
  };
  lastLog: SyncLogItem | null;
  logs: SyncLogItem[];
  courseMatchCatalog: Array<{ courseId: string; tokens: string[] }>;
}

export interface FolderVerificationResult {
  ok: boolean;
  folderId: string;
  folderName: string;
  detectedSubfolders: Array<{
    id: string;
    name: string;
    matchedCategory: DriveCategory | null;
    matchedLabel: string | null;
  }>;
  missingConfiguredFolders: string[];
  error?: string;
}

export interface PublicMediaResponse {
  updatedAt: string;
  totalPublished: number;
  grouped: Record<DriveCategory, SyncedMediaAsset[]>;
}

