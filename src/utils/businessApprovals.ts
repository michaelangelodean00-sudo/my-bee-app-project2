// Lightweight client-side store for business profile approvals.
// Replace with Lovable Cloud table when backend is enabled.

export type BusinessApprovalStatus = "pending" | "approved" | "rejected";

export interface BusinessApprovalSubmission {
  id: string;
  submittedAt: number;
  status: BusinessApprovalStatus;
  reviewedAt?: number;
  // Submitted profile snapshot
  name: string;
  avatarUrl: string;
  bio: string;
  location: string;
  businessCategory: string;
  businessPhone: string;
  businessWebsite: string;
  businessInstagram: string;
  businessFacebook: string;
  businessTwitter: string;
  businessTiktok: string;
  businessStreetAddress: string;
  businessGoogleMapUrl: string;
  // Owner identity (mock — single-user demo)
  ownerKey: string;
}

const STORAGE_KEY = "bee.business-approvals.v1";
const EVENT = "bee:business-approvals-changed";

const read = (): BusinessApprovalSubmission[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as BusinessApprovalSubmission[]) : [];
  } catch {
    return [];
  }
};

const write = (rows: BusinessApprovalSubmission[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
    window.dispatchEvent(new Event(EVENT));
  } catch {
    /* ignore quota */
  }
};

export const listApprovals = (): BusinessApprovalSubmission[] =>
  read().sort((a, b) => b.submittedAt - a.submittedAt);

export const listPending = (): BusinessApprovalSubmission[] =>
  listApprovals().filter((r) => r.status === "pending");

export const getMyLatest = (
  ownerKey: string
): BusinessApprovalSubmission | undefined =>
  listApprovals().find((r) => r.ownerKey === ownerKey);

export const submitBusinessApproval = (
  data: Omit<BusinessApprovalSubmission, "id" | "submittedAt" | "status">
): BusinessApprovalSubmission => {
  const rows = read();
  // Replace any previous pending submission from same owner
  const filtered = rows.filter(
    (r) => !(r.ownerKey === data.ownerKey && r.status === "pending")
  );
  const submission: BusinessApprovalSubmission = {
    ...data,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    submittedAt: Date.now(),
    status: "pending",
  };
  write([submission, ...filtered]);
  return submission;
};

export const setApprovalStatus = (
  id: string,
  status: Exclude<BusinessApprovalStatus, "pending">
) => {
  const rows = read().map((r) =>
    r.id === id ? { ...r, status, reviewedAt: Date.now() } : r
  );
  write(rows);
};

export const subscribeApprovals = (cb: () => void) => {
  const handler = () => cb();
  window.addEventListener(EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(EVENT, handler);
    window.removeEventListener("storage", handler);
  };
};
