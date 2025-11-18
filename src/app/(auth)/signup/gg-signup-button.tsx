"use client";

import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import authApiRequest from "@/apiRequest/auth";
import { useRouter } from "next/navigation";
import React from "react";

export default function GoogleSignUpButton() {
  const router = useRouter();

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const idToken = await user.getIdToken(true);

      const res = await authApiRequest.loginWithFirebase(idToken);

      toast.success("Đăng ký thành công!");

      router.push("/");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error("Đăng nhập Google thất bại: " + (error.message || ""));
      console.error(error);
    }
  };

  return (
    <Button
      type="button"
      onClick={handleGoogleLogin}
      className="w-full h-12 flex items-center justify-center gap-2 rounded-lg font-medium transition-colors border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-400"
      aria-label="Đăng nhập với Google"
    >
      <FcGoogle className="text-2xl" />
      Đăng ký với Google
    </Button>
  );
}
