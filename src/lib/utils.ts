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
  } catch (err) {
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
  } catch (err) {
    return false; // token không hợp lệ
  }
}
export function isHTML(str: string): boolean {
  const htmlPattern = /^\s*<([a-z]+)([^>]*)>.*<\/\1>\s*$/i;
  return htmlPattern.test(str);
}
