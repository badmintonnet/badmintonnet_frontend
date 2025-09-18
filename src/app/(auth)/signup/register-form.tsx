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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RegisterBody,
  RegisterBodyType,
} from "@/schemaValidations/auth.schema";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import authApiRequest from "@/apiRequest/auth";

const RegisterForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm<RegisterBodyType>({
    resolver: zodResolver(RegisterBody),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      birthDate: "",
      gender: undefined,
      address: "",
    },
  });

  // Xử lý submit
  async function onSubmit(values: RegisterBodyType) {
    if (loading) return;
    setLoading(true);
    try {
      // Giả lập API call
      await authApiRequest.register(values);
      // await authApiRequest.auth({
      //   sessionToken: result.payload.data.token,
      //   expiresAt: result.payload.data.expiresAt,
      // });
      toast.success("Đăng ký thành công", {
        description: "Tài khoản của bạn đã được tạo thành công!",
      });
      router.push("/profile/player-rating");
    } catch (error: unknown) {
      // handleErrorApi({
      //   error,
      //   setError: form.setError,
      //   duration: 3000,
      // });
      toast.error("Đăng ký thất bại", {
        description: "Vui lòng kiểm tra lại thông tin đăng ký.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 w-full max-w-2xl"
        noValidate
      >
        {/* Row 1: Họ tên và Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Họ và tên
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nhập họ và tên"
                    className="h-10 text-sm border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 rounded-lg transition-all duration-300"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500 dark:text-red-400 text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nhập email của bạn"
                    type="email"
                    className="h-10 text-sm border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 rounded-lg transition-all duration-300"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500 dark:text-red-400 text-xs" />
              </FormItem>
            )}
          />
        </div>

        {/* Row 2: Mật khẩu và Xác nhận mật khẩu */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Mật khẩu
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nhập mật khẩu"
                    type="password"
                    className="h-10 text-sm border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 rounded-lg transition-all duration-300"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500 dark:text-red-400 text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Xác nhận mật khẩu
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Xác nhận mật khẩu"
                    type="password"
                    className="h-10 text-sm border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 rounded-lg transition-all duration-300"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500 dark:text-red-400 text-xs" />
              </FormItem>
            )}
          />
        </div>

        {/* Row 3: Ngày sinh và Giới tính */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="birthDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Ngày sinh
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="YYYY-MM-DD"
                    type="date"
                    className="h-10 text-sm border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 rounded-lg transition-all duration-300"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500 dark:text-red-400 text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Giới tính
                </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="h-10 text-sm border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 rounded-lg transition-all duration-300">
                      <SelectValue placeholder="Chọn giới tính" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MALE">Nam</SelectItem>
                      <SelectItem value="FEMALE">Nữ</SelectItem>
                      <SelectItem value="OTHER">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage className="text-red-500 dark:text-red-400 text-xs" />
              </FormItem>
            )}
          />
        </div>

        {/* Row 4: Địa chỉ (full width) */}
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                Địa chỉ
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Nhập địa chỉ của bạn"
                  className="h-10 text-sm border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 rounded-lg transition-all duration-300"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500 dark:text-red-400 text-xs" />
            </FormItem>
          )}
        />

        {/* Login link và Button */}
        <div className="flex flex-col space-y-3 pt-2">
          <div className="text-center">
            <Link
              href="/login"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500 font-medium hover:underline transition-colors duration-300 text-sm"
            >
              Đã có tài khoản? Đăng nhập
            </Link>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-blue-600 text-white font-semibold text-base rounded-lg hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-500 transition-all duration-300 flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Đang xử lý...
              </>
            ) : (
              "Đăng ký"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default RegisterForm;
