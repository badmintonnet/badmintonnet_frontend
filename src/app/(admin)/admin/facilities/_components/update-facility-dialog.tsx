"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, MapPin, Upload } from "lucide-react";
import addressApiRequest from "@/apiRequest/address";
import facilityApiRequest from "@/apiRequest/facility";
import { FacilityType } from "@/schemaValidations/event.schema";

// Định nghĩa schema cho form
const formSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Tên cơ sở không được để trống"),
  address: z.string().min(1, "Địa chỉ không được để trống"),
  district: z.string().min(1, "Quận/Huyện không được để trống"),
  province: z.string().min(1, "Tỉnh/Thành phố không được để trống"),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  image: z.instanceof(File).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface Province {
  id: string;
  name: string;
}

interface Ward {
  id: string;
  name: string;
}

interface UpdateFacilityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  facility: FacilityType;
  onUpdate: (updatedFacility: FacilityType) => void;
}

export function UpdateFacilityDialog({
  open,
  onOpenChange,
  facility,
  onUpdate,
}: UpdateFacilityDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string | null>(
    facility.image || null
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: facility.id,
      name: facility.name,
      address: facility.address,
      district: facility.district,
      province: facility.city,
      latitude: facility.latitude?.toString() || "",
      longitude: facility.longitude?.toString() || "",
    },
  });

  // Lấy danh sách tỉnh/thành phố
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await addressApiRequest.getProvinces();
        setProvinces(response.payload.data.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách tỉnh/thành phố:", error);
        toast.error("Không thể lấy danh sách tỉnh/thành phố");
      }
    };

    if (open) {
      fetchProvinces();
    }
  }, [open]);

  // Lấy danh sách quận/huyện khi chọn tỉnh/thành phố
  useEffect(() => {
    const fetchWards = async () => {
      if (!selectedProvinceId) {
        setWards([]);
        return;
      }

      try {
        const response = await addressApiRequest.getWardsByProvinceId(
          selectedProvinceId
        );
        setWards(response.payload.data.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách quận/huyện:", error);
        toast.error("Không thể lấy danh sách quận/huyện");
      }
    };

    fetchWards();
  }, [selectedProvinceId]);

  // Xử lý khi chọn tỉnh/thành phố
  const handleProvinceChange = (provinceId: string) => {
    setSelectedProvinceId(provinceId);
    const province = provinces.find((p) => p.id === provinceId);
    if (province) {
      form.setValue("province", province.name);
    }
    form.setValue("district", "");
  };

  // Xử lý khi chọn quận/huyện
  const handleWardChange = (wardId: string) => {
    const ward = wards.find((w) => w.id === wardId);
    if (ward) {
      form.setValue("district", ward.name);
    }
  };

  // Xử lý khi chọn file hình ảnh
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);

      // Tạo URL để xem trước hình ảnh
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Xử lý submit form
  const router = useRouter();

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      let imageFileName = facility.image;

      // Upload hình ảnh mới nếu có
      if (values.image) {
        const formData = new FormData();
        formData.append("file", values.image);

        const uploadResponse = await facilityApiRequest.uploadImage(formData);
        imageFileName = uploadResponse.payload.data.fileName;
      }

      // Tạo facility với fileName từ response
      const facilityData = {
        id: values.id,
        name: values.name,
        address: values.address,
        district: values.district,
        province: values.province,
        city: values.province,
        latitude: values.latitude ? parseFloat(values.latitude) : 0,
        longitude: values.longitude ? parseFloat(values.longitude) : 0,
        image: imageFileName,
      };

      // Gọi API cập nhật facility
      // await facilityApiRequest.updateFacility(facilityData);

      // Cập nhật UI
      const updatedFacility: FacilityType = {
        ...facilityData,
        location: `${values.name}, ${values.address}, ${values.district}, ${values.province}`,
      };

      onUpdate(updatedFacility);
      toast.success("Cập nhật cơ sở vật chất thành công");

      // Refresh bằng cách sử dụng router
      router.refresh();
      // Đóng dialog
      onOpenChange(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật cơ sở vật chất:", error);
      toast.error("Không thể cập nhật cơ sở vật chất");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Cập nhật cơ sở vật chất</DialogTitle>
          <DialogDescription>
            Chỉnh sửa thông tin chi tiết về cơ sở vật chất
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Tên cơ sở */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên cơ sở</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên cơ sở" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Địa chỉ */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa chỉ</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập địa chỉ chi tiết" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tỉnh/Thành phố */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="province"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tỉnh/Thành phố</FormLabel>
                    <Select
                      onValueChange={handleProvinceChange}
                      defaultValue=""
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={field.value || "Chọn tỉnh/thành phố"}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {provinces.map((province) => (
                          <SelectItem key={province.id} value={province.id}>
                            {province.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Quận/Huyện */}
              <FormField
                control={form.control}
                name="district"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quận/Huyện</FormLabel>
                    <Select
                      onValueChange={handleWardChange}
                      defaultValue=""
                      disabled={!selectedProvinceId}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={field.value || "Chọn quận/huyện"}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {wards.map((ward) => (
                          <SelectItem key={ward.id} value={ward.id}>
                            {ward.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Tọa độ */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="latitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vĩ độ (Latitude)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="any"
                        placeholder="Ví dụ: 10.7769"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="longitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kinh độ (Longitude)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="any"
                        placeholder="Ví dụ: 106.6983"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Upload hình ảnh */}
            <FormItem>
              <FormLabel>Hình ảnh</FormLabel>
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    document.getElementById("image-upload-update")?.click()
                  }
                  className="w-full h-32 border-dashed flex flex-col items-center justify-center gap-2"
                >
                  {imagePreview ? (
                    <div className="relative w-full h-full">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="object-cover w-full h-full rounded-md"
                      />
                    </div>
                  ) : (
                    <>
                      <Upload className="h-6 w-6 text-gray-500" />
                      <span className="text-sm text-gray-500">
                        Tải lên hình ảnh
                      </span>
                    </>
                  )}
                </Button>
                <input
                  id="image-upload-update"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
            </FormItem>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý
                  </>
                ) : (
                  "Cập nhật"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
