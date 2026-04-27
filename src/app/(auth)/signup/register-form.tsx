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
import { useEffect, useState } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import authApiRequest from "@/apiRequest/auth";
import addressApiRequest from "@/apiRequest/address";
import GoogleSignUpButton from "@/app/(auth)/signup/gg-signup-button";

interface Province {
  id: string;
  full_name: string;
}

interface Ward {
  id: string;
  full_name: string;
}

const RegisterForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [selectedProvinceId, setSelectedProvinceId] = useState("");
  const [selectedWardId, setSelectedWardId] = useState("");
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(true);
  const [isLoadingWards, setIsLoadingWards] = useState(false);
  const [additionalAddress, setAdditionalAddress] = useState("");

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

  useEffect(() => {
    const loadProvinces = async () => {
      try {
        const response = await addressApiRequest.getProvinces();
        setProvinces(response.payload.data.data || []);
      } catch (error) {
        console.error("Error loading provinces:", error);
      } finally {
        setIsLoadingProvinces(false);
      }
    };

    loadProvinces();
  }, []);

  // Load wards when province changes
  useEffect(() => {
    const loadWards = async () => {
      if (!selectedProvinceId) {
        setWards([]);
        setSelectedWardId("");
        return;
      }

      setIsLoadingWards(true);
      try {
        const response =
          await addressApiRequest.getWardsByProvinceId(selectedProvinceId);
        setWards(response.payload.data.data || []);
        setSelectedWardId("");
      } catch (error) {
        console.error("Error loading wards:", error);
        setWards([]);
      } finally {
        setIsLoadingWards(false);
      }
    };

    loadWards();
  }, [selectedProvinceId]);

  // Update location field when province/ward changes
  useEffect(() => {
    const updateLocation = () => {
      const selectedProvince = provinces.find(
        (p) => p.id === selectedProvinceId,
      );
      const selectedWard = wards.find((w) => w.id === selectedWardId);

      const locationParts: string[] = [];

      if (selectedWard) {
        locationParts.push(selectedWard.full_name);
      }
      if (selectedProvince) {
        locationParts.push(selectedProvince.full_name);
      }

      const baseLocation = locationParts.join(", ");
      const fullLocation = additionalAddress
        ? `${additionalAddress}, ${baseLocation}`
        : baseLocation;

      form.setValue("address", fullLocation);
    };

    updateLocation();
  }, [
    selectedProvinceId,
    selectedWardId,
    additionalAddress,
    provinces,
    wards,
    form,
  ]);

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProvinceId(e.target.value);
  };

  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedWardId(e.target.value);
  };

  // Xử lý submit
  async function onSubmit(values: RegisterBodyType) {
    if (loading) return;
    setLoading(true);
    try {
      // Giả lập API call
      await authApiRequest.register(values);
      toast.success("Đăng ký thành công", {
        description: "Tài khoản của bạn đã được tạo thành công!",
      });
      // router.push("/profile/player-rating");
      router.push("/verify?email=" + encodeURIComponent(values.email));
    } catch {
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
                  Họ và tên <span className="text-red-500">*</span>
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
                  Email <span className="text-red-500">*</span>
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
                  Mật khẩu <span className="text-red-500">*</span>
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
                  Xác nhận mật khẩu <span className="text-red-500">*</span>
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
                  Ngày sinh <span className="text-red-500">*</span>
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
                  Giới tính <span className="text-red-500">*</span>
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

        <div className="space-y-4">
          <div className="flex items-center mb-1">
            <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              Địa chỉ <span className="text-red-500">*</span>
            </FormLabel>
          </div>

          {/* Province and Ward Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Province Select */}
            <div>
              <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Tỉnh thành
              </FormLabel>
              <div className="relative">
                <select
                  value={selectedProvinceId}
                  onChange={handleProvinceChange}
                  disabled={isLoadingProvinces}
                  className="appearance-none block w-full h-10 px-3 py-2 pr-8 text-sm border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 focus:border-blue-600 dark:focus:border-blue-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {isLoadingProvinces ? "Đang tải..." : "Chọn tỉnh thành"}
                  </option>
                  {provinces.map((province) => (
                    <option key={province.id} value={province.id}>
                      {province.full_name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 pr-3 flex items-center pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Ward Select */}
            <div>
              <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Phường/Xã
              </FormLabel>
              <div className="relative">
                <select
                  value={selectedWardId}
                  onChange={handleWardChange}
                  disabled={isLoadingWards || !selectedProvinceId}
                  className="appearance-none block w-full h-10 px-3 py-2 pr-8 text-sm border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 focus:border-blue-600 dark:focus:border-blue-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {isLoadingWards
                      ? "Đang tải..."
                      : "Chọn phường xã (tùy chọn)"}
                  </option>
                  {wards.map((ward) => (
                    <option key={ward.id} value={ward.id}>
                      {ward.full_name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 pr-3 flex items-center pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Additional Address Details */}
          <div>
            <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Địa chỉ chi tiết (tùy chọn)
            </FormLabel>
            <Input
              placeholder="Ví dụ: Số 123, đường ABC..."
              value={additionalAddress}
              onChange={(e) => setAdditionalAddress(e.target.value)}
              className="h-10 text-sm border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 rounded-lg transition-all duration-300"
            />
          </div>

          {/* Final Location Display */}
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Địa chỉ đầy đủ
                </FormLabel>
                <FormControl>
                  <Input
                    className="h-10 text-sm border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 rounded-lg transition-all duration-300 bg-gray-50 dark:bg-gray-800"
                    {...field}
                    readOnly
                  />
                </FormControl>
                <FormMessage className="text-red-500 dark:text-red-400 text-xs" />
              </FormItem>
            )}
          />
        </div>

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
          <GoogleSignUpButton />
        </div>
      </form>
    </Form>
  );
};

export default RegisterForm;
