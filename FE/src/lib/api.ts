import { ApiResponse, Lead, LeadDetails, LoginCredentials, User } from './types';
import { API_CONFIG, AUTH_CONFIG } from './config';

// Get full API URL with base path from environment
const getApiUrl = (endpoint: string) => {
  // Remove leading slash if present to prevent double slashes
  const path = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
  
  // Combine base URL with path
  return `${API_CONFIG.BASE_URL}/${path}`;
};

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
};

// Base API functions
async function apiGet<T>(url: string): Promise<ApiResponse<T>> {
  try {
    const token = getAuthToken();
    const response = await fetch(getApiUrl(url), {
      credentials: 'include',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch data');
    }

    return {
      success: true,
      data: data.data,
    };
  } catch (error) {
    return {
      success: false,
      data: null as unknown as T,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

async function apiPost<T, R>(url: string, data: T): Promise<ApiResponse<R>> {
  try {
    const token = getAuthToken();
    const response = await fetch(getApiUrl(url), {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to create resource');
    }

    return {
      success: true,
      data: result.data,
      message: result.message,
    };
  } catch (error) {
    return {
      success: false,
      data: null as unknown as R,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

async function apiPatch<T, R>(url: string, data: T): Promise<ApiResponse<R>> {
  try {
    const token = getAuthToken();
    const response = await fetch(getApiUrl(url), {
      method: 'PATCH',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to update resource');
    }

    return {
      success: true,
      data: result.data,
      message: result.message,
    };
  } catch (error) {
    return {
      success: false,
      data: null as unknown as R,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

async function apiDelete<T>(url: string): Promise<ApiResponse<T>> {
  try {
    const token = getAuthToken();
    const response = await fetch(getApiUrl(url), {
      method: 'DELETE',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to delete resource');
    }

    return {
      success: true,
      data: result.data,
      message: result.message,
    };
  } catch (error) {
    return {
      success: false,
      data: null as unknown as T,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Exported API functions
interface GetLeadsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export const getLeads = async (params: GetLeadsParams = {}) => {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.search) queryParams.append('search', params.search);
  if (params.status) queryParams.append('status', params.status);

  const response = await fetch(`${API_CONFIG.BASE_URL}/leads?${queryParams.toString()}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem(AUTH_CONFIG.TOKEN_KEY)}`,
      'Content-Type': 'application/json'
    }
  });

  const data = await response.json();
  return data;
};

export async function getLead(id: string): Promise<ApiResponse<LeadDetails>> {
  return apiGet<LeadDetails>(`/leads/${id}`);
}

export async function createLead(leadData: Partial<Lead>): Promise<ApiResponse<Lead>> {
  return apiPost<Partial<Lead>, Lead>('/leads', leadData);
}

export async function updateLeadStatus(
  id: string,
  status: 'new' | 'contacted' | 'qualified' | 'disqualified'
): Promise<ApiResponse<Lead>> {
  return apiPatch<{ status: string }, Lead>(`/leads/${id}/status`, { 
    status: status.toUpperCase() 
  });
}

export async function deleteLead(id: string): Promise<ApiResponse<null>> {
  return apiDelete<null>(`/leads/${id}`);
}

export async function uploadFile(leadId: string, file: File): Promise<ApiResponse<{ filename: string }>> {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const token = getAuthToken();
    const response = await fetch(getApiUrl(`/files/${leadId}`), {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: formData,
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to upload file');
    }

    return {
      success: true,
      data: result.data,
      message: result.message,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function deleteFile(id: string): Promise<ApiResponse<null>> {
  return apiDelete<null>(`/files/${id}`);
}

export async function getLeadFiles(leadId: string): Promise<ApiResponse<{ filename: string }[]>> {
  return apiGet<{ filename: string }[]>(`/files/lead/${leadId}`);
}

export async function login(
  credentials: LoginCredentials
): Promise<ApiResponse<User & { token: string }>> {
  try {
    const response = await fetch(getApiUrl('/auth/login'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Login failed');
    }

    // Save token to localStorage
    if (result.token) {
      localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, result.token);
    }

    return {
      success: true,
      data: result,
      message: result.message,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function register(
  userData: { email: string; password: string; name: string }
): Promise<ApiResponse<User & { token: string }>> {
  return apiPost<typeof userData, User & { token: string }>('/auth/register', userData);
}

export async function sendEmail(emailData: {
  to: string;
  templateId: string;
  variables?: Record<string, string>;
}): Promise<ApiResponse<{ sent: boolean }>> {
  return apiPost<typeof emailData, { sent: boolean }>('/email/send', emailData);
}

export async function sendCustomEmail(
  leadId: string,
  emailData: { subject: string; content: string }
): Promise<ApiResponse<null>> {
  return apiPost<{ subject: string; content: string }, null>(
    `/email/send-custom/${leadId}`,
    emailData
  );
}
