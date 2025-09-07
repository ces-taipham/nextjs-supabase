/* eslint-disable @typescript-eslint/no-explicit-any */

// ENUMS & CONSTANTS

export type EmploymentStatus = 'Active' | 'Terminated' | 'Pre-onboarding' | 'Onboarding';
export type MaritalStatus = 'Single' | 'Married' | 'Divorced' | 'Widowed';
export type Gender = 'Male' | 'Female' | 'Other';
export type ContactType = 'spouse' | 'child' | 'emergency_contact' | 'parent' | 'sibling' | 'other_family';
export type EmployeeStatus = 'Normal' | 'On Leave' | 'Suspended' | 'Notice Period';
export type WorkingType = 'Full-time' | 'Part-time' | 'Contract' | 'Intern';
export type ContractType = 'Permanent' | 'Fixed-term' | 'Probation' | 'Intern' | 'Freelance';
export type LeaveRequestStatus = 'pending' | 'approved' | 'rejected' | 'cancelled' | 'taken';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'delegated' | 'skipped';
export type AuditAction = 'INSERT' | 'UPDATE' | 'DELETE';
export type SkillType = 'Technical' | 'Soft Skills' | 'Languages' | 'Certification';

// CORE ENTITIES

export interface Employee {
  employee_id: string;
  number: number;
  full_name_english: string;
  full_name_vietnamese: string;
  display_name?: string;
  employment_status: EmploymentStatus;
  marital_status?: MaritalStatus;
  created_at: string;
  updated_at: string;
}

export interface Department {
  id: number;
  name: string;
  code: string;
  description?: string;
  head_id?: string;
  parent_department_id?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PersonalInfo {
  id: number;
  employee_id: string;
  identity_card_number?: string;
  identity_card_issued_date?: string;
  identity_card_issued_place?: string;
  passport_number?: string;
  passport_issued_date?: string;
  passport_expired_date?: string;
  passport_issued_place?: string;
  date_of_birth?: string;
  place_of_birth?: string;
  nationality?: string;
  gender?: Gender;
  ethnic?: string;
  religion?: string;
  tax_code?: string;
  social_insurance_number?: string;
  health_insurance_number?: string;
  academic_level?: string;
  certificate?: string;
  created_at: string;
  updated_at: string;
}

export interface ContactInfo {
  id: number;
  employee_id: string;
  mobile_phone?: string;
  permanent_address?: string;
  temporary_address?: string;
  personal_email?: string;
  company_email?: string;
  created_at: string;
  updated_at: string;
}

export interface EmploymentInfo {
  id: number;
  employee_id: string;
  department_id?: number;
  manager_id?: string;
  position_vietnamese?: string;
  position_english?: string;
  grade?: string;
  onboarding_date?: string;
  official_resignation_date?: string;
  last_working_date?: string;
  status_of_contract?: string;
  status_of_compulsory_insurance?: string;
  working_type?: WorkingType;
  trade_union_registration: boolean;
  employee_status: EmployeeStatus;
  status_from_date?: string;
  status_to_date?: string;
  created_at: string;
  updated_at: string;
}

export interface FinancialInfo {
  id: number;
  employee_id: string;
  basic_salary?: number;
  position_allowance?: number;
  meal_allowance?: number;
  travel_allowance?: number;
  other_allowance?: number;
  bank_name?: string;
  bank_account_number?: string;
  bank_account_holder?: string;
  currency?: string;
  created_at: string;
  updated_at: string;
}

export interface Contract {
  id: number;
  employee_id: string;
  contract_number?: string;
  contract_type: ContractType;
  start_date: string;
  end_date?: string;
  basic_salary?: number;
  working_hours_per_week?: number;
  probation_period_months?: number;
  notice_period_days?: number;
  benefits?: Record<string, any>;
  terms_and_conditions?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// CONTACT & SKILL MANAGEMENT

export interface EmployeeContact {
  id: number;
  employee_id: string;
  contact_type: ContactType;
  full_name: string;
  relationship?: string;
  phone_number?: string;
  email?: string;
  address?: string;
  is_emergency_contact: boolean;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: number;
  name: string;
  category?: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface EmployeeSkill {
  id: number;
  employee_id: string;
  skill_id: number;
  proficiency_level?: number;
  years_of_experience?: number;
  skill_type?: SkillType;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// LEAVE MANAGEMENT

export interface LeaveType {
  id: number;
  name: string;
  code: string;
  description?: string;
  max_days_per_year?: number;
  carry_forward_allowed: boolean;
  max_carry_forward_days?: number;
  requires_medical_certificate: boolean;
  advance_notice_days?: number;
  max_consecutive_days?: number;
  approval_levels: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LeaveRequest {
  id: number;
  employee_id: string;
  leave_type_id: number;
  start_date: string;
  end_date: string;
  total_days: number;
  reason?: string;
  status: LeaveRequestStatus;
  approved_by?: string;
  approved_at?: string;
  comments?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface LeaveApproval {
  id: number;
  leave_request_id: number;
  approver_id: string;
  approval_level: number;
  status: ApprovalStatus;
  approved_at?: string;
  comments?: string;
  is_required: boolean;
  created_at: string;
  updated_at: string;
}

export interface LeaveBalance {
  id: number;
  employee_id: string;
  leave_type_id: number;
  year: number;
  total_allocated: number;
  carried_forward: number;
  used: number;
  pending: number;
  available: number; // Generated column
  created_at: string;
  updated_at: string;
}

export interface LeaveDocument {
  id: number;
  leave_request_id: number;
  document_type?: string;
  file_name: string;
  file_path: string;
  file_size?: number;
  uploaded_by: string;
  uploaded_at: string;
  created_at: string;
  updated_at: string;
}

export interface LeavePolicy {
  id: number;
  name: string;
  description?: string;
  leave_type_id: number;
  department_id?: number;
  employee_id?: string;
  policy_rules: Record<string, any>;
  effective_from: string;
  effective_to?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// WORKFLOW & AUDIT

export interface ApprovalWorkflow {
  id: number;
  name: string;
  description?: string;
  entity_type: string;
  steps: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApprovalWorkflowStep {
  id: number;
  workflow_id: number;
  step_order: number;
  step_name: string;
  approver_type: string;
  approver_id?: string;
  is_required: boolean;
  can_delegate: boolean;
  auto_approve_conditions?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: number;
  table_name: string;
  record_id: string;
  action: AuditAction;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  changed_by?: string;
  changed_at: string;
  ip_address?: string;
  user_agent?: string;
}

// EXTENDED TYPES FOR CLIENT USE

// Employee with related information
export interface EmployeeWithDetails extends Employee {
  personal_info?: PersonalInfo;
  contact_info?: ContactInfo;
  employment_info?: EmploymentInfo;
  financial_info?: FinancialInfo;
  department?: Department;
  manager?: Employee;
  contracts?: Contract[];
  skills?: (EmployeeSkill & { skill: Skill })[];
  emergency_contacts?: EmployeeContact[];
}

// Leave request with related information
export interface LeaveRequestWithDetails extends LeaveRequest {
  leave_type: LeaveType;
  employee: Employee;
  approvals?: (LeaveApproval & { approver: Employee })[];
  documents?: LeaveDocument[];
}

// Department with hierarchy
export interface DepartmentWithHierarchy extends Department {
  head?: Employee;
  parent_department?: Department;
  sub_departments?: Department[];
  employees?: Employee[];
}

// API RESPONSE TYPES

export interface ApiResponse<T> {
  metadata: any;
  data: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  page_size: number;
  total_pages: number;
}

// FORM TYPES

export type CreateEmployeeRequest = Omit<Employee, 'employee_id' | 'number' | 'created_at' | 'updated_at'>;
export type UpdateEmployeeRequest = Partial<Omit<Employee, 'employee_id' | 'number' | 'created_at' | 'updated_at'>>;

export type CreateLeaveRequestRequest = Omit<LeaveRequest, 'id' | 'status' | 'approved_by' | 'approved_at' | 'created_at' | 'updated_at'>;
export type UpdateLeaveRequestRequest = Partial<Omit<LeaveRequest, 'id' | 'employee_id' | 'created_by' | 'created_at' | 'updated_at'>>;

export type CreateDepartmentRequest = Omit<Department, 'id' | 'created_at' | 'updated_at'>;
export type UpdateDepartmentRequest = Partial<Omit<Department, 'id' | 'created_at' | 'updated_at'>>;


// QUERY TYPES

export interface EmployeeQuery {
  employment_status?: EmploymentStatus;
  department_id?: number;
  search?: string;
  page?: number;
  page_size?: number;
  sort_by?: keyof Employee;
  sort_order?: 'asc' | 'desc';
}

export interface LeaveRequestQuery {
  employee_id?: string;
  leave_type_id?: number;
  status?: LeaveRequestStatus;
  start_date?: string;
  end_date?: string;
  page?: number;
  page_size?: number;
}

export interface DepartmentQuery {
  is_active?: boolean;
  parent_department_id?: number;
  search?: string;
}

// UTILITY TYPES

export type TableNames = 
  | 'employees'
  | 'departments'
  | 'personal_info'
  | 'contact_info'
  | 'employment_info'
  | 'financial_info'
  | 'contracts'
  | 'employee_contacts'
  | 'skills'
  | 'employee_skills'
  | 'leave_types'
  | 'leave_requests'
  | 'leave_approvals'
  | 'leave_balances'
  | 'leave_documents'
  | 'leave_policies'
  | 'approval_workflows'
  | 'approval_workflow_steps'
  | 'audit_logs';

export type DatabaseRow = 
  | Employee
  | Department
  | PersonalInfo
  | ContactInfo
  | EmploymentInfo
  | FinancialInfo
  | Contract
  | EmployeeContact
  | Skill
  | EmployeeSkill
  | LeaveType
  | LeaveRequest
  | LeaveApproval
  | LeaveBalance
  | LeaveDocument
  | LeavePolicy
  | ApprovalWorkflow
  | ApprovalWorkflowStep
  | AuditLog;