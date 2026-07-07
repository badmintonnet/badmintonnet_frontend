import { HttpError } from "@/lib/http";

const GENERIC_FALLBACK = "Đã có lỗi xảy ra, vui lòng thử lại.";

/**
 * Lấy message hiển thị cho người dùng từ một lỗi khi gọi API.
 *
 * - Lỗi từ BE (HttpError) → trả về đúng `payload.message` của BE
 *   (vd: "Mỗi thành viên chỉ có thể gán vào một vị trí: ...").
 * - Lỗi mạng / không xác định (fetch reject, mất kết nối...) → trả về `networkFallback`.
 *
 * Nhờ đó UI luôn hiển thị đúng thông báo BE trả về; chỉ khi thực sự lỗi mạng
 * mới dùng câu mặc định phía FE.
 */
export function getApiErrorMessage(
  error: unknown,
  networkFallback = "Không thể kết nối máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại.",
): string {
  if (error instanceof HttpError) {
    return error.payload?.message || GENERIC_FALLBACK;
  }
  return networkFallback;
}
