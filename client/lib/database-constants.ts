import type {
  EmploymentStatus,
  MaritalStatus,
  Gender,
  ContactType,
  EmployeeStatus,
  WorkingType,
  ContractType,
  LeaveRequestStatus,
  ApprovalStatus,
  AuditAction,
  SkillType,
  TableNames
} from './supabase-types';

// CONSTANTS

export const EMPLOYMENT_STATUS_OPTIONS: { value: EmploymentStatus; label: string }[] = [
  { value: 'Active', label: 'Active' },
  { value: 'Terminated', label: 'Terminated' },
  { value: 'Pre-onboarding', label: 'Pre-onboarding' },
  { value: 'Onboarding', label: 'Onboarding' }
];

export const MARITAL_STATUS_OPTIONS: { value: MaritalStatus; label: string }[] = [
  { value: 'Single', label: 'Single' },
  { value: 'Married', label: 'Married' },
  { value: 'Divorced', label: 'Divorced' },
  { value: 'Widowed', label: 'Widowed' }
];

export const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' }
];

export const CONTACT_TYPE_OPTIONS: { value: ContactType; label: string }[] = [
  { value: 'spouse', label: 'Spouse' },
  { value: 'child', label: 'Child' },
  { value: 'emergency_contact', label: 'Emergency Contact' },
  { value: 'parent', label: 'Parent' },
  { value: 'sibling', label: 'Sibling' },
  { value: 'other_family', label: 'Other Family' }
];

export const EMPLOYEE_STATUS_OPTIONS: { value: EmployeeStatus; label: string }[] = [
  { value: 'Normal', label: 'Normal' },
  { value: 'On Leave', label: 'On Leave' },
  { value: 'Suspended', label: 'Suspended' },
  { value: 'Notice Period', label: 'Notice Period' }
];

export const WORKING_TYPE_OPTIONS: { value: WorkingType; label: string }[] = [
  { value: 'Full-time', label: 'Full-time' },
  { value: 'Part-time', label: 'Part-time' },
  { value: 'Contract', label: 'Contract' },
  { value: 'Intern', label: 'Intern' }
];

export const CONTRACT_TYPE_OPTIONS: { value: ContractType; label: string }[] = [
  { value: 'Permanent', label: 'Permanent' },
  { value: 'Fixed-term', label: 'Fixed-term' },
  { value: 'Probation', label: 'Probation' },
  { value: 'Intern', label: 'Internship' },
  { value: 'Freelance', label: 'Freelance' }
];

export const LEAVE_REQUEST_STATUS_OPTIONS: { value: LeaveRequestStatus; label: string; color: string }[] = [
  { value: 'pending', label: 'Pending', color: 'orange' },
  { value: 'approved', label: 'Approved', color: 'green' },
  { value: 'rejected', label: 'Rejected', color: 'red' },
  { value: 'cancelled', label: 'Cancelled', color: 'gray' },
  { value: 'taken', label: 'Taken', color: 'blue' }
];

export const APPROVAL_STATUS_OPTIONS: { value: ApprovalStatus; label: string; color: string }[] = [
  { value: 'pending', label: 'Pending', color: 'orange' },
  { value: 'approved', label: 'Approved', color: 'green' },
  { value: 'rejected', label: 'Rejected', color: 'red' },
  { value: 'delegated', label: 'Delegated', color: 'blue' },
  { value: 'skipped', label: 'Skipped', color: 'gray' }
];

export const SKILL_TYPE_OPTIONS: { value: SkillType; label: string }[] = [
  { value: 'Technical', label: 'Technical' },
  { value: 'Soft Skills', label: 'Soft Skills' },
  { value: 'Languages', label: 'Languages' },
  { value: 'Certification', label: 'Certification' }
];

export const AUDIT_ACTION_OPTIONS: { value: AuditAction; label: string }[] = [
  { value: 'INSERT', label: 'Created' },
  { value: 'UPDATE', label: 'Updated' },
  { value: 'DELETE', label: 'Deleted' }
];

// DEFAULT VALUES

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;
export const DEFAULT_SORT_ORDER = 'desc';

export const DEFAULT_EMPLOYEE_STATUS: EmploymentStatus = 'Active';
export const DEFAULT_LEAVE_STATUS: LeaveRequestStatus = 'pending';
export const DEFAULT_APPROVAL_STATUS: ApprovalStatus = 'pending';

// VALIDATION CONSTANTS

export const VALIDATION_RULES = {
  EMPLOYEE_ID_LENGTH: { min: 3, max: 50 },
  FULL_NAME_LENGTH: { min: 2, max: 150 },
  DISPLAY_NAME_LENGTH: { min: 2, max: 100 },
  EMAIL_MAX_LENGTH: 100,
  PHONE_MAX_LENGTH: 20,
  IDENTITY_CARD_LENGTH: { min: 9, max: 12 },
  PASSPORT_LENGTH: { min: 6, max: 15 },
  TAX_CODE_LENGTH: { min: 10, max: 14 },
  SOCIAL_INSURANCE_LENGTH: { min: 10, max: 12 },
  BANK_ACCOUNT_LENGTH: { min: 8, max: 20 },
  LEAVE_REASON_MAX_LENGTH: 1000,
  COMMENT_MAX_LENGTH: 2000,
  POSITION_MAX_LENGTH: 100,
  DEPARTMENT_CODE_LENGTH: { min: 2, max: 10 }
} as const;

export const DATE_CONSTRAINTS = {
  MIN_BIRTH_YEAR: 1940,
  MAX_BIRTH_YEAR: new Date().getFullYear() - 16,
  MAX_FUTURE_LEAVE_MONTHS: 12,
  MIN_NOTICE_DAYS: 1,
  MAX_NOTICE_DAYS: 365
} as const;

// UTILITY FUNCTIONS

/**
 * Get label for employment status
 */
export function getEmploymentStatusLabel(status: EmploymentStatus): string {
  return EMPLOYMENT_STATUS_OPTIONS.find(option => option.value === status)?.label || status;
}

/**
 * Get label for leave request status with color
 */
export function getLeaveStatusInfo(status: LeaveRequestStatus): { label: string; color: string } {
  const option = LEAVE_REQUEST_STATUS_OPTIONS.find(opt => opt.value === status);
  return {
    label: option?.label || status,
    color: option?.color || 'gray'
  };
}

/**
 * Get label for approval status with color
 */
export function getApprovalStatusInfo(status: ApprovalStatus): { label: string; color: string } {
  const option = APPROVAL_STATUS_OPTIONS.find(opt => opt.value === status);
  return {
    label: option?.label || status,
    color: option?.color || 'gray'
  };
}

/**
 * Generate employee ID
 */
export function generateEmployeeId(prefix = 'EMP', number: number): string {
  return `${prefix}${number.toString().padStart(4, '0')}`;
}

/**
 * Format full name (Vietnamese style: Last Name + First Name)
 */
export function formatFullName(firstName: string, lastName: string): string {
  return `${lastName} ${firstName}`.trim();
}

/**
 * Calculate leave days (excluding weekends)
 */
export function calculateLeaveDays(startDate: Date, endDate: Date): number {
  let count = 0;
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay();
    // Skip weekends (Saturday = 6, Sunday = 0)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return count;
}

/**
 * Check if employee can take leave
 */
export function canTakeLeave(
  requestedDays: number,
  availableBalance: number,
  leaveType: { max_consecutive_days?: number }
): { canTake: boolean; reason?: string } {
  if (requestedDays > availableBalance) {
    return {
      canTake: false,
      reason: `Insufficient leave balance. Available: ${availableBalance} days`
    };
  }
  
  if (leaveType.max_consecutive_days && requestedDays > leaveType.max_consecutive_days) {
    return {
      canTake: false,
      reason: `Exceeds maximum consecutive days: ${leaveType.max_consecutive_days} days`
    };
  }
  
  return { canTake: true };
}

/**
 * Get age from birth date
 */
export function calculateAge(birthDate: string): number {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Format currency (VND)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
}

/**
 * Format date (Vietnamese style)
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('vi-VN');
}

/**
 * Format datetime (Vietnamese style)
 */
export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('vi-VN');
}

/**
 * Check if date is in future
 */
export function isFutureDate(date: string | Date): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d > new Date();
}

/**
 * Check if date is weekend
 */
export function isWeekend(date: string | Date): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  const dayOfWeek = d.getDay();
  return dayOfWeek === 0 || dayOfWeek === 6;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number (Vietnamese format)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(\+84|0)[3-9]\d{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * Validate identity card number (Vietnamese)
 */
export function isValidIdentityCard(idCard: string): boolean {
  const idRegex = /^\d{9}$|^\d{12}$/;
  return idRegex.test(idCard);
}

/**
 * Mask sensitive information
 */
export function maskSensitiveInfo(info: string, visibleChars = 4): string {
  if (info.length <= visibleChars) return info;
  const visiblePart = info.slice(-visibleChars);
  const maskedPart = '*'.repeat(info.length - visibleChars);
  return maskedPart + visiblePart;
}

// TABLE METADATA WITH LUCIDE REACT ICONS

export const TABLE_METADATA: Record<TableNames, { label: string; icon: string }> = {
  employees: { label: 'Employees', icon: 'Users' },
  departments: { label: 'Departments', icon: 'Building2' },
  personal_info: { label: 'Personal Info', icon: 'User' },
  contact_info: { label: 'Contact Info', icon: 'Phone' },
  employment_info: { label: 'Employment Info', icon: 'Briefcase' },
  financial_info: { label: 'Financial Info', icon: 'DollarSign' },
  contracts: { label: 'Contracts', icon: 'FileText' },
  employee_contacts: { label: 'Employee Contacts', icon: 'UserCheck' },
  skills: { label: 'Skills', icon: 'Target' },
  employee_skills: { label: 'Employee Skills', icon: 'Star' },
  leave_types: { label: 'Leave Types', icon: 'Calendar' },
  leave_requests: { label: 'Leave Requests', icon: 'CalendarCheck' },
  leave_approvals: { label: 'Leave Approvals', icon: 'CheckSquare' },
  leave_balances: { label: 'Leave Balances', icon: 'BarChart3' },
  leave_documents: { label: 'Leave Documents', icon: 'Paperclip' },
  leave_policies: { label: 'Leave Policies', icon: 'ClipboardList' },
  approval_workflows: { label: 'Approval Workflows', icon: 'GitBranch' },
  approval_workflow_steps: { label: 'Workflow Steps', icon: 'GitCommit' },
  audit_logs: { label: 'Audit Logs', icon: 'FileSearch' }
};

/**
 * Get table metadata
 */
export function getTableInfo(tableName: TableNames): { label: string; icon: string } {
  return TABLE_METADATA[tableName] || { label: tableName, icon: 'Database' };
}

// STATUS BADGE VARIANTS (for Tailwind/shadcn styling)

export const STATUS_VARIANTS = {
  employment: {
    Active: 'bg-green-100 text-green-800 border-green-200',
    Terminated: 'bg-red-100 text-red-800 border-red-200',
    'Pre-onboarding': 'bg-blue-100 text-blue-800 border-blue-200',
    Onboarding: 'bg-yellow-100 text-yellow-800 border-yellow-200'
  },
  leave: {
    pending: 'bg-orange-100 text-orange-800 border-orange-200',
    approved: 'bg-green-100 text-green-800 border-green-200',
    rejected: 'bg-red-100 text-red-800 border-red-200',
    cancelled: 'bg-gray-100 text-gray-800 border-gray-200',
    taken: 'bg-blue-100 text-blue-800 border-blue-200'
  },
  approval: {
    pending: 'bg-orange-100 text-orange-800 border-orange-200',
    approved: 'bg-green-100 text-green-800 border-green-200',
    rejected: 'bg-red-100 text-red-800 border-red-200',
    delegated: 'bg-blue-100 text-blue-800 border-blue-200',
    skipped: 'bg-gray-100 text-gray-800 border-gray-200'
  }
} as const;

/**
 * Get status badge classes for Tailwind/shadcn
 */
export function getStatusBadgeClasses(
  type: 'employment' | 'leave' | 'approval',
  status: string
): string {
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border';
  const statusClasses = STATUS_VARIANTS[type][status as keyof typeof STATUS_VARIANTS[typeof type]] || 
                       'bg-gray-100 text-gray-800 border-gray-200';
  
  return `${baseClasses} ${statusClasses}`;
}

// ICON MAPPING FOR DIFFERENT CONTEXTS

export const CONTEXT_ICONS = {
  actions: {
    add: 'Plus',
    edit: 'Edit',
    delete: 'Trash2',
    view: 'Eye',
    download: 'Download',
    upload: 'Upload',
    search: 'Search',
    filter: 'Filter',
    refresh: 'RefreshCw',
    save: 'Save',
    cancel: 'X',
    approve: 'Check',
    reject: 'X',
    pending: 'Clock'
  },
  navigation: {
    dashboard: 'LayoutDashboard',
    employees: 'Users',
    departments: 'Building2',
    leaves: 'Calendar',
    reports: 'BarChart3',
    settings: 'Settings',
    profile: 'User',
    logout: 'LogOut'
  },
  status: {
    success: 'CheckCircle',
    error: 'XCircle',
    warning: 'AlertTriangle',
    info: 'Info',
    loading: 'Loader2'
  }
} as const;

/**
 * Get icon name for context
 */
export function getContextIcon(
  context: keyof typeof CONTEXT_ICONS,
  action: string
): string {
  return CONTEXT_ICONS[context][action as keyof typeof CONTEXT_ICONS[typeof context]] || 'Circle';
}