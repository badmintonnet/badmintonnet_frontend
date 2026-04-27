"use client";

import authApiRequest from "@/apiRequest/auth";
import { useRouter } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";
import { toast } from "sonner";

function OtpForm({ email }: { email: string | null }) {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    // Focus vào ô đầu tiên khi component mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index: number, value: string) => {
    // Chỉ cho phép số
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Chỉ lấy ký tự cuối cùng
    setOtp(newOtp);

    // Tự động chuyển sang ô tiếp theo
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    // Xử lý phím Backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    // Xử lý phím mũi tên trái
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    // Xử lý phím mũi tên phải
    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split("").forEach((char, index) => {
      if (index < 6) {
        newOtp[index] = char;
      }
    });
    setOtp(newOtp);

    // Focus vào ô cuối cùng được điền
    const lastIndex = Math.min(pastedData.length, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  const handleSubmit = async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6) return;

    if (!email) {
      console.error("No email provided for OTP verification");
      return;
    }

    console.log("Mã OTP:", otpValue);
    try {
      await authApiRequest.verify({ email, otp: otpValue });
      router.push("/login");
    } catch (error) {
      console.error("OTP verification failed", error);
    }
  };

  const handleResend = async () => {
    if (!email || resendLoading) return;
    setResendLoading(true);
    try {
      await authApiRequest.sendOtp(email);
      toast.success("Mã OTP đã được gửi lại đến email của bạn.");
      setOtp(Array(6).fill(""));
      inputRefs.current[0]?.focus();
    } catch (error) {
      console.error("Resend OTP failed", error);
      toast.error("Không thể gửi lại mã OTP. Vui lòng thử lại.");
    } finally {
      setResendLoading(false);
    }
  };

  const isComplete = otp.every((digit) => digit !== "");

  return (
    <div className="w-full space-y-6">
      {/* OTP Input */}
      <div className="flex justify-center gap-2 sm:gap-3">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all"
          />
        ))}
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={!isComplete}
        className={`w-full py-3 rounded-lg font-bold text-white transition-all ${
          isComplete
            ? "bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            : "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
        }`}
      >
        {isComplete ? "✓ XÁC THỰC" : "NHẬP ĐẦY ĐỦ MÃ OTP"}
      </button>

      {/* Resend OTP */}
      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Không nhận được mã?
        </p>
        <button
          onClick={handleResend}
          disabled={resendLoading}
          aria-busy={resendLoading}
          className={`inline-flex items-center gap-2 text-blue-600 font-semibold text-sm transition-all ${
            resendLoading
              ? "opacity-60 cursor-not-allowed"
              : "hover:text-blue-700 hover:underline"
          }`}
        >
          {resendLoading ? (
            <>
              <svg
                className="animate-spin w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              Đang gửi...
            </>
          ) : (
            <>
              <span>🔄</span> Gửi lại mã OTP
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default OtpForm;
