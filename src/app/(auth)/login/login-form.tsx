"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoginBody, LoginBodyType } from "@/schemaValidations/auth.schema";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import authApiRequest from "@/apiRequest/auth";
import { isAborted } from "zod/v3";
import { prepareFlightRouterStateForRequest } from "next/dist/client/flight-data-helpers";
import { isAdmin } from "@/lib/utils";
import GoogleLoginButton from "@/app/(auth)/login/gg-login-button";
import ForgotPasswordDialog from "./forgot-password-dialog";

const LoginForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Xử lý submit
  async function onSubmit(values: LoginBodyType) {
    if (loading) return;
    console.log(values);
    setLoading(true);
    try {
      const res = await authApiRequest.login(values);

      const accessToken = res.payload.data.accessToken;

      toast.success("Đăng nhập thành công", {
        // description: result.payload.message,
      });

      if (isAdmin(accessToken)) {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Vui lòng thử lại";
      toast.error("Đăng nhập thất bại", {
        description: message,
      });
      if (message === "Tài khoản chưa được kích hoạt") {
        router.push("/verify?email=" + encodeURIComponent(values.email));
      }
      // handleErrorApi({
      //   error,
      //   setError: form.setError,
      //   duration: 3000,
      // });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 w-full"
        noValidate
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                Email
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Nhập email của bạn"
                  type="email"
                  className="h-12 text-lg border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 rounded-lg transition-all duration-300"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500 dark:text-red-400" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                Mật khẩu
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Nhập mật khẩu"
                  type="password"
                  className="h-12 text-lg border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 rounded-lg transition-all duration-300"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500 dark:text-red-400" />
            </FormItem>
          )}
        />
        <div className="flex flex-col sm:flex-row sm:justify-between gap-4 text-sm">
          {/* mở dialog quên mật khẩu */}
          <ForgotPasswordDialog />
          <Link
            href="/signup"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500 font-medium hover:underline transition-colors duration-300"
          >
            Tạo tài khoản mới
          </Link>
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 bg-blue-600 text-white font-semibold text-lg rounded-lg hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-500 transition-all duration-300 flex items-center justify-center"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Đang xử lý...
            </>
          ) : (
            "Đăng nhập"
          )}
        </Button>
        <GoogleLoginButton />
      </form>
    </Form>
  );
};

export default LoginForm;
