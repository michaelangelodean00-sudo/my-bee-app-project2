// Builds outbound links only to fixed hosts from validated values; returns null on anything unexpected.
export const ISLANDS = [
  "New Providence", "Grand Bahama", "Abaco", "Eleuthera", "Exuma",
  "Andros", "Bimini", "Long Island", "Cat Island", "Other",
] as const;

export const WHATSAPP_RE = /^\+?[0-9]{7,15}$/;
export const WEBSITE_RE = /^https:\/\/[A-Za-z0-9.-]+\.[A-Za-z]{2,}(\/[A-Za-z0-9._~/?#&=%+-]*)?$/;
export const INSTAGRAM_RE = /^[A-Za-z0-9._]{1,30}$/;
export const FACEBOOK_RE = /^[A-Za-z0-9.-]{1,80}$/;

export const whatsappUrl = (n?: string | null) =>
  n && WHATSAPP_RE.test(n) ? `https://wa.me/${n.replace(/^\+/, "")}` : null;
export const websiteUrl = (u?: string | null) => (u && WEBSITE_RE.test(u) && u.length <= 200 ? u : null);
export const instagramUrl = (h?: string | null) =>
  h && INSTAGRAM_RE.test(h) ? `https://www.instagram.com/${encodeURIComponent(h)}` : null;
export const facebookUrl = (h?: string | null) =>
  h && FACEBOOK_RE.test(h) ? `https://www.facebook.com/${encodeURIComponent(h)}` : null;
export const telUrl = (p?: string | null) => {
  const d = (p ?? "").replace(/[^0-9+]/g, "");
  return d.length >= 7 ? `tel:${d}` : null;
};
