"use client";

export default function BackButton() {
  return (
    <button
      onClick={() => window.history.back()}
      className="mt-4 inline-block text-sm text-blue-600 hover:underline"
    >
      ← Quay lại
    </button>
  );
}
