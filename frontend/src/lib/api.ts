import axios, { AxiosError } from "axios";
import { createClient } from "./supabase";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach Supabase auth token to every request
api.interceptors.request.use(async (config) => {
  try {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
  } catch {
    // If supabase is not configured, continue without token
  }
  return config;
});

// Global response error handler
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ detail?: string }>) => {
    const message =
      error.response?.data?.detail || error.message || "An unexpected error occurred";
    return Promise.reject(new Error(message));
  }
);

// ─── Types ───────────────────────────────────────────────────────────────────

export interface BusinessLead {
  id: string;
  name: string;
  website: string;
  city: string;
  country: string;
  industry: string;
  google_rating: number | null;
  review_count: number | null;
  company_size?: string;
  phone?: string;
  address?: string;
}

export interface DashboardStats {
  total_leads: number;
  emails_sent: number;
  conversion_rate: number;
  active_campaigns: number;
  recent_leads: BusinessLead[];
  recent_emails: EmailRecord[];
}

export interface CrmLeadEntry {
  id: string;
  lead_id: string;
  status: string;
  position: number;
  notes: string;
  lead: {
    id: string;
    name: string;
    industry: string;
    email: string;
    phone: string;
    website: string;
    city: string;
    country: string;
    google_rating: number | null;
    review_count: number | null;
  };
  created_at: string;
  updated_at: string;
}

export interface EmailRecord {
  id: string;
  to_email: string;
  to_name: string;
  subject: string;
  status: string;
  sent_at: string | null;
  created_at: string;
}

export interface EmailDraft {
  subject: string;
  body: string;
  model: string;
}

export interface LeadScoreResult {
  score: number;
  factors: string[];
  recommendation: string;
}

export interface WebsiteAuditResult {
  observations: string[];
  pain_points: string[];
  talking_points: string[];
  score: number;
}

export interface AnalyticsOverview {
  total_leads: number;
  total_emails_sent: number;
  total_emails_opened: number;
  total_emails_replied: number;
  conversion_rate: number;
  leads_by_industry: Record<string, number>;
  emails_by_status: Record<string, number>;
  leads_by_status: Record<string, number>;
}

// ─── API Methods ─────────────────────────────────────────────────────────────

export const leadsApi = {
  discover: (params: { country?: string; city?: string; industry?: string }) =>
    api.get<{ leads: BusinessLead[] }>("/leads/discover", { params }),

  score: (data: {
    business_name: string;
    industry: string;
    google_rating?: number;
    review_count?: number;
    has_website?: boolean;
  }) => api.post<LeadScoreResult>("/leads/score", data),

  auditWebsite: (data: { url: string; business_name: string; industry: string }) =>
    api.post<WebsiteAuditResult>("/leads/audit", data),

  enrich: (leadId: string) =>
    api.post(`/leads/${leadId}/enrich`),
};

export const crmApi = {
  getLeads: () =>
    api.get<{ leads: CrmLeadEntry[] }>("/crm/leads"),

  addLead: (data: { lead_id: string; status?: string; notes?: string }) =>
    api.post("/crm/leads", data),

  updateLead: (
    id: string,
    data: { status?: string; notes?: string; position?: number }
  ) => api.patch(`/crm/leads/${id}`, data),

  deleteLead: (id: string) =>
    api.delete(`/crm/leads/${id}`),

  getStats: () =>
    api.get<Record<string, number>>("/crm/stats"),
};

export const emailsApi = {
  generateDraft: (data: {
    name: string;
    industry: string;
    tone?: string;
    additional_context?: string;
  }) => api.post<EmailDraft>("/emails/generate-draft", data),

  send: (data: {
    lead_id?: string;
    to_email: string;
    to_name?: string;
    subject: string;
    body: string;
  }) => api.post("/emails/send", data),

  getHistory: () =>
    api.get<{ emails: EmailRecord[] }>("/emails/history"),
};

export const dashboardApi = {
  getStats: () =>
    api.get<DashboardStats>("/dashboard/stats"),
};

export const analyticsApi = {
  getOverview: () =>
    api.get<AnalyticsOverview>("/analytics/overview"),
};

export default api;
