const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

function getAuthHeaders() {
  const token = sessionStorage.getItem("tn_admin_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...getAuthHeaders(), ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || "Request failed");
  }
  return res.json();
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export async function adminLogin(username, password) {
  const data = await request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
  sessionStorage.setItem("tn_admin_token", data.access_token);
  sessionStorage.setItem("tn_admin_role", data.role);
  return data;
}

export function adminLogout() {
  sessionStorage.removeItem("tn_admin_token");
  sessionStorage.removeItem("tn_admin_role");
}

// ── Departments ───────────────────────────────────────────────────────────────
export const getDepartments = () => request("/api/departments/");

export const createDepartment = (payload) =>
  request("/api/departments/", { method: "POST", body: JSON.stringify(payload) });

export const updateDepartment = (id, payload) =>
  request(`/api/departments/${id}`, { method: "PUT", body: JSON.stringify(payload) });

export const deleteDepartment = (id) =>
  request(`/api/departments/${id}`, { method: "DELETE" });

// ── Officers ──────────────────────────────────────────────────────────────────
export const getOfficers = () => request("/api/officers/");

export const createOfficer = (payload) =>
  request("/api/officers/", { method: "POST", body: JSON.stringify(payload) });

export const updateOfficer = (id, payload) =>
  request(`/api/officers/${id}`, { method: "PUT", body: JSON.stringify(payload) });

export const deleteOfficer = (id) =>
  request(`/api/officers/${id}`, { method: "DELETE" });

// ── Complaints ────────────────────────────────────────────────────────────────
export async function submitComplaint(formData, files = []) {
  const fd = new FormData();
  Object.entries(formData).forEach(([key, val]) => {
    if (val !== null && val !== undefined && val !== "") fd.append(key, val);
  });
  files.forEach((file) => fd.append("files", file));

  const res = await fetch(`${BASE_URL}/api/complaints/`, {
    method: "POST",
    body: fd,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || "Submission failed");
  }
  return res.json();
}

export const trackComplaint = (token) => request(`/api/complaints/track/${token}`);

export const getComplaints = (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  return request(`/api/complaints/${params ? `?${params}` : ""}`);
};

export const assignOfficer = (complaintId, officerId) =>
  request(`/api/complaints/${complaintId}/assign`, {
    method: "PATCH",
    body: JSON.stringify({ officer_id: officerId }),
  });

export const updateComplaintStatus = (complaintId, status, notes = null) =>
  request(`/api/complaints/${complaintId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status, notes }),
  });

export const submitFeedback = (token, rating, comment) =>
  request(`/api/complaints/track/${token}/feedback`, {
    method: "POST",
    body: JSON.stringify({ rating, comment }),
  });

// ── Stats ─────────────────────────────────────────────────────────────────────
export const getStats = () => request("/api/stats/");
