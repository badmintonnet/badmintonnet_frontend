import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { jwtDecode } from "jwt-decode";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
interface JwtPayload {
  authorities?: string[];
  [key: string]: unknown;
}
/**
 * Xóa đi ký tự `/` đầu tiên của path
 */
export const normalizePath = (path: string) => {
  return path.startsWith("/") ? path.slice(1) : path;
};

/**
 * Kiểm tra token JWT có ROLE_CLUB_OWNER hay không
 * @param {string} token - JWT token
 * @returns {boolean} true nếu có ROLE_CLUB_OWNER, false nếu không
 */
export function isClubOwner(token: string): boolean {
  try {
    const decoded = jwtDecode<JwtPayload>(token); // decode mà không cần secret
    return decoded.authorities?.includes("ROLE_CLUB_OWNER") || false;
  } catch {
    return false; // token không hợp lệ
  }
}

/**
 * Kiểm tra token JWT có ROLE_ADMIN hay không
 * @param {string} token - JWT token
 * @returns {boolean} true nếu có ROLE_ADMIN, false nếu không
 */
export function isAdmin(token: string): boolean {
  try {
    const decoded = jwtDecode<JwtPayload>(token); // decode mà không cần secret
    return decoded.authorities?.includes("ROLE_ADMIN") || false;
  } catch {
    return false; // token không hợp lệ
  }
}
export function isHTML(str: string): boolean {
  if (typeof str !== "string") return false;
  const trimmed = str.trim();
  if (!trimmed) return false;

  // Prefer DOMParser in browser for robust detection (handles multiple top-level nodes)
  if (typeof window !== "undefined" && "DOMParser" in window) {
    try {
      const doc = new DOMParser().parseFromString(trimmed, "text/html");
      return Array.from(doc.body.childNodes).some(
        (n) => n.nodeType === Node.ELEMENT_NODE,
      );
    } catch {
      return false;
    }
  }

  // Fallback: check if string contains any HTML-like tag
  return /<\/?[a-z][\s\S]*>/i.test(trimmed);
}
