// lib/services/employee-service.ts
import type {
  Employee,
  EmployeeWithDetails,
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
  EmployeeQuery,
  ApiResponse,
  PaginatedResponse,
  PersonalInfo,
  ContactInfo,
  EmploymentInfo,
  FinancialInfo,
} from "@/lib/supabase-types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

class EmployeeService {
  private baseUrl = "/api/employees";

  // Utility method for API calls
  private async apiCall<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "API request failed");
      }

      return data;
    } catch (error) {
      console.error("API call failed:", error);
      throw error instanceof Error ? error : new Error("Unknown error");
    }
  }

  // Get employees with filtering and pagination
  async getEmployees(
    query: EmployeeQuery = {}
  ): Promise<PaginatedResponse<EmployeeWithDetails>> {
    const params = new URLSearchParams();

    if (query.page !== undefined) params.append("page", query.page.toString());
    if (query.page_size) params.append("pageSize", query.page_size.toString());
    if (query.search) params.append("search", query.search);
    if (query.employment_status)
      params.append("employment_status", query.employment_status);
    if (query.department_id)
      params.append("department_id", query.department_id.toString());
    if (query.sort_by) params.append("sortBy", query.sort_by);
    if (query.sort_order) params.append("sortOrder", query.sort_order);

    const url = `${this.baseUrl}?${params.toString()}`;
    const response = await this.apiCall<EmployeeWithDetails[]>(url);

    return {
      data: response.data || [],
      count: response.metadata?.pagination?.total || 0,
      page: response.metadata?.pagination?.page || 0,
      page_size: response.metadata?.pagination?.pageSize || 20,
      total_pages: response.metadata?.pagination?.totalPages || 0,
    };
  }

  // Get employee by ID
  async getEmployeeById(
    employeeId: string
  ): Promise<EmployeeWithDetails | null> {
    try {
      const response = await this.apiCall<EmployeeWithDetails>(
        `${this.baseUrl}/${employeeId}`
      );
      return response.data;
    } catch (error) {
      if (error instanceof Error && error.message.includes("not found")) {
        return null;
      }
      throw error;
    }
  }

  // Create new employee
  async createEmployee(employee: CreateEmployeeRequest): Promise<Employee> {
    const response = await this.apiCall<Employee>(this.baseUrl, {
      method: "POST",
      body: JSON.stringify(employee),
    });

    return response.data;
  }

  // Update employee
  async updateEmployee(
    employeeId: string,
    updates: UpdateEmployeeRequest
  ): Promise<Employee> {
    const response = await this.apiCall<Employee>(
      `${this.baseUrl}/${employeeId}`,
      {
        method: "PUT",
        body: JSON.stringify(updates),
      }
    );

    return response.data;
  }

  // Delete employee (soft delete)
  async deleteEmployee(employeeId: string): Promise<string> {
    await this.apiCall(`${this.baseUrl}/${employeeId}`, {
      method: "DELETE",
    });
    return employeeId;
  }

  // Get employee personal information
  async getPersonalInfo(employeeId: string): Promise<PersonalInfo | null> {
    try {
      const response = await this.apiCall<PersonalInfo>(
        `${this.baseUrl}/${employeeId}/personal`
      );
      return response.data;
    } catch (error) {
      if (error instanceof Error && error.message.includes("not found")) {
        return null;
      }
      throw error;
    }
  }

  // Update employee personal information
  async updatePersonalInfo(
    employeeId: string,
    info: Partial<PersonalInfo>
  ): Promise<PersonalInfo> {
    const response = await this.apiCall<PersonalInfo>(
      `${this.baseUrl}/${employeeId}/personal`,
      {
        method: "PUT",
        body: JSON.stringify(info),
      }
    );

    return response.data;
  }

  // Get employee contact information
  async getContactInfo(employeeId: string): Promise<ContactInfo | null> {
    try {
      const response = await this.apiCall<ContactInfo>(
        `${this.baseUrl}/${employeeId}/contact`
      );
      return response.data;
    } catch (error) {
      if (error instanceof Error && error.message.includes("not found")) {
        return null;
      }
      throw error;
    }
  }

  // Update employee contact information
  async updateContactInfo(
    employeeId: string,
    info: Partial<ContactInfo>
  ): Promise<ContactInfo> {
    const response = await this.apiCall<ContactInfo>(
      `${this.baseUrl}/${employeeId}/contact`,
      {
        method: "PUT",
        body: JSON.stringify(info),
      }
    );

    return response.data;
  }

  // Get employee employment information
  async getEmploymentInfo(employeeId: string): Promise<EmploymentInfo | null> {
    try {
      const response = await this.apiCall<EmploymentInfo>(
        `${this.baseUrl}/${employeeId}/employment`
      );
      return response.data;
    } catch (error) {
      if (error instanceof Error && error.message.includes("not found")) {
        return null;
      }
      throw error;
    }
  }

  // Update employee employment information
  async updateEmploymentInfo(
    employeeId: string,
    info: Partial<EmploymentInfo>
  ): Promise<EmploymentInfo> {
    const response = await this.apiCall<EmploymentInfo>(
      `${this.baseUrl}/${employeeId}/employment`,
      {
        method: "PUT",
        body: JSON.stringify(info),
      }
    );

    return response.data;
  }

  // Get employee financial information
  async getFinancialInfo(employeeId: string): Promise<FinancialInfo | null> {
    try {
      const response = await this.apiCall<FinancialInfo>(
        `${this.baseUrl}/${employeeId}/financial`
      );
      return response.data;
    } catch (error) {
      if (error instanceof Error && error.message.includes("not found")) {
        return null;
      }
      throw error;
    }
  }

  // Update employee financial information
  async updateFinancialInfo(
    employeeId: string,
    info: Partial<FinancialInfo>
  ): Promise<FinancialInfo> {
    const response = await this.apiCall<FinancialInfo>(
      `${this.baseUrl}/${employeeId}/financial`,
      {
        method: "PUT",
        body: JSON.stringify(info),
      }
    );

    return response.data;
  }

  // Search employees by name
  async searchEmployees(searchTerm: string, limit = 10): Promise<Employee[]> {
    const response = await this.getEmployees({
      search: searchTerm,
      page_size: limit,
      page: 0,
    });

    return response.data.map((emp) => ({
      employee_id: emp.employee_id,
      number: emp.number,
      full_name_english: emp.full_name_english,
      full_name_vietnamese: emp.full_name_vietnamese,
      display_name: emp.display_name,
      employment_status: emp.employment_status,
      marital_status: emp.marital_status,
      created_at: emp.created_at,
      updated_at: emp.updated_at,
    }));
  }

  // Get employees by department
  async getEmployeesByDepartment(
    departmentId: number
  ): Promise<EmployeeWithDetails[]> {
    const response = await this.getEmployees({
      department_id: departmentId,
      employment_status: "Active",
      page_size: 100,
    });

    return response.data;
  }

  // Get employee statistics
  async getEmployeeStats(): Promise<{
    total: number;
    active: number;
    terminated: number;
    onboarding: number;
    preOnboarding: number;
  }> {
    // This would typically be a separate API endpoint
    // For now, we'll implement it by fetching data and calculating
    const [active, terminated, onboarding, preOnboarding] = await Promise.all([
      this.getEmployees({ employment_status: "Active", page_size: 1 }),
      this.getEmployees({ employment_status: "Terminated", page_size: 1 }),
      this.getEmployees({ employment_status: "Onboarding", page_size: 1 }),
      this.getEmployees({ employment_status: "Pre-onboarding", page_size: 1 }),
    ]);

    return {
      total:
        active.count +
        terminated.count +
        onboarding.count +
        preOnboarding.count,
      active: active.count,
      terminated: terminated.count,
      onboarding: onboarding.count,
      preOnboarding: preOnboarding.count,
    };
  }
}

// Export singleton instance
export const employeeService = new EmployeeService();

// Query keys
export const EMPLOYEE_QUERY_KEYS = {
  all: ["employees"] as const,
  lists: () => [...EMPLOYEE_QUERY_KEYS.all, "list"] as const,
  list: (query: EmployeeQuery) =>
    [...EMPLOYEE_QUERY_KEYS.lists(), query] as const,
  details: () => [...EMPLOYEE_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...EMPLOYEE_QUERY_KEYS.details(), id] as const,
  personalInfo: (id: string) =>
    [...EMPLOYEE_QUERY_KEYS.all, "personal", id] as const,
  contactInfo: (id: string) =>
    [...EMPLOYEE_QUERY_KEYS.all, "contact", id] as const,
  employmentInfo: (id: string) =>
    [...EMPLOYEE_QUERY_KEYS.all, "employment", id] as const,
  financialInfo: (id: string) =>
    [...EMPLOYEE_QUERY_KEYS.all, "financial", id] as const,
  stats: () => [...EMPLOYEE_QUERY_KEYS.all, "stats"] as const,
} as const;

// Custom hooks for employee data
export const useEmployees = (query: EmployeeQuery = {}) => {
  return useQuery({
    queryKey: EMPLOYEE_QUERY_KEYS.list(query),
    queryFn: () => employeeService.getEmployees(query),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useEmployee = (employeeId: string) => {
  return useQuery({
    queryKey: EMPLOYEE_QUERY_KEYS.detail(employeeId),
    queryFn: () => employeeService.getEmployeeById(employeeId),
    enabled: !!employeeId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useEmployeeStats = () => {
  return useQuery({
    queryKey: EMPLOYEE_QUERY_KEYS.stats(),
    queryFn: () => employeeService.getEmployeeStats(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Mutation hooks
export const useCreateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (employee: CreateEmployeeRequest) =>
      employeeService.createEmployee(employee),
    onSuccess: () => {
      // Invalidate employees list
      queryClient.invalidateQueries({ queryKey: EMPLOYEE_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: EMPLOYEE_QUERY_KEYS.stats() });

      toast.success("Employee created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create employee");
    },
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      employeeId,
      updates,
    }: {
      employeeId: string;
      updates: UpdateEmployeeRequest;
    }) => employeeService.updateEmployee(employeeId, updates),
    onSuccess: (data, variables) => {
      // Update cached data
      queryClient.setQueryData(
        EMPLOYEE_QUERY_KEYS.detail(variables.employeeId),
        data
      );

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: EMPLOYEE_QUERY_KEYS.lists() });

      toast.success("Employee updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update employee");
    },
  });
};

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (employeeId: string) =>
      employeeService.deleteEmployee(employeeId),
    onSuccess: (employeeId: string) => {
      // Remove from cache
      queryClient.removeQueries({
        queryKey: EMPLOYEE_QUERY_KEYS.detail(employeeId),
      });

      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: EMPLOYEE_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: EMPLOYEE_QUERY_KEYS.stats() });

      toast.success("Employee deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete employee");
    },
  });
};

// Hooks for employee sub-information
export const useUpdatePersonalInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      employeeId,
      info,
    }: {
      employeeId: string;
      info: Partial<PersonalInfo>;
    }) => employeeService.updatePersonalInfo(employeeId, info),
    onSuccess: (data, variables) => {
      // Update cached data
      queryClient.setQueryData(
        EMPLOYEE_QUERY_KEYS.personalInfo(variables.employeeId),
        data
      );

      // Invalidate employee detail to refresh full data
      queryClient.invalidateQueries({
        queryKey: EMPLOYEE_QUERY_KEYS.detail(variables.employeeId),
      });

      toast.success("Personal information updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update personal information");
    },
  });
};

export const useUpdateContactInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      employeeId,
      info,
    }: {
      employeeId: string;
      info: Partial<ContactInfo>;
    }) => employeeService.updateContactInfo(employeeId, info),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        EMPLOYEE_QUERY_KEYS.contactInfo(variables.employeeId),
        data
      );
      queryClient.invalidateQueries({
        queryKey: EMPLOYEE_QUERY_KEYS.detail(variables.employeeId),
      });

      toast.success("Contact information updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update contact information");
    },
  });
};

export const useUpdateEmploymentInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      employeeId,
      info,
    }: {
      employeeId: string;
      info: Partial<EmploymentInfo>;
    }) => employeeService.updateEmploymentInfo(employeeId, info),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        EMPLOYEE_QUERY_KEYS.employmentInfo(variables.employeeId),
        data
      );
      queryClient.invalidateQueries({
        queryKey: EMPLOYEE_QUERY_KEYS.detail(variables.employeeId),
      });

      toast.success("Employment information updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update employment information");
    },
  });
};

export const useUpdateFinancialInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      employeeId,
      info,
    }: {
      employeeId: string;
      info: Partial<FinancialInfo>;
    }) => employeeService.updateFinancialInfo(employeeId, info),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        EMPLOYEE_QUERY_KEYS.financialInfo(variables.employeeId),
        data
      );
      queryClient.invalidateQueries({
        queryKey: EMPLOYEE_QUERY_KEYS.detail(variables.employeeId),
      });

      toast.success("Financial information updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update financial information");
    },
  });
};
