"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import {
  Save,
  RefreshCw,
  Mail,
  Shield,
  Database,
  FileText,
  Upload,
  AlertTriangle,
  Globe,
  Image as ImageIcon,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SettingsPage() {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [autoApproveClubs, setAutoApproveClubs] = useState(false);
  const [autoApproveEvents, setAutoApproveEvents] = useState(false);
  const [maxUploadSize, setMaxUploadSize] = useState("10");
  const [defaultLanguage, setDefaultLanguage] = useState("vi");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Cài đặt hệ thống
        </h1>
        <p className="text-muted-foreground text-gray-500 dark:text-gray-400">
          Quản lý cấu hình và thiết lập hệ thống
        </p>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">Cài đặt chung</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="security">Bảo mật</TabsTrigger>
          <TabsTrigger value="backup">Sao lưu & Phục hồi</TabsTrigger>
        </TabsList>

        {/* Cài đặt chung */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt chung</CardTitle>
              <CardDescription>
                Quản lý các thiết lập chung của hệ thống
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Chế độ bảo trì */}
              <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <div className="flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2 text-yellow-500" />
                    <Label htmlFor="maintenance-mode" className="font-medium">
                      Chế độ bảo trì
                    </Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Khi bật, trang web sẽ hiển thị thông báo bảo trì và người
                    dùng không thể truy cập
                  </p>
                </div>
                <Switch
                  id="maintenance-mode"
                  checked={isMaintenanceMode}
                  onCheckedChange={setIsMaintenanceMode}
                />
              </div>

              {/* Ngôn ngữ mặc định */}
              <div className="space-y-2">
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-2 text-blue-500" />
                  <Label htmlFor="default-language">Ngôn ngữ mặc định</Label>
                </div>
                <Select
                  value={defaultLanguage}
                  onValueChange={setDefaultLanguage}
                >
                  <SelectTrigger id="default-language">
                    <SelectValue placeholder="Chọn ngôn ngữ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vi">Tiếng Việt</SelectItem>
                    <SelectItem value="en">Tiếng Anh</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Kích thước tải lên tối đa */}
              <div className="space-y-2">
                <div className="flex items-center">
                  <Upload className="h-4 w-4 mr-2 text-green-500" />
                  <Label htmlFor="max-upload-size">
                    Kích thước tải lên tối đa (MB)
                  </Label>
                </div>
                <Input
                  id="max-upload-size"
                  type="number"
                  value={maxUploadSize}
                  onChange={(e) => setMaxUploadSize(e.target.value)}
                />
              </div>

              {/* Phê duyệt tự động */}
              <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-approve-clubs" className="font-medium">
                    Tự động phê duyệt câu lạc bộ mới
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Câu lạc bộ mới sẽ được tự động phê duyệt mà không cần xác
                    nhận của quản trị viên
                  </p>
                </div>
                <Switch
                  id="auto-approve-clubs"
                  checked={autoApproveClubs}
                  onCheckedChange={setAutoApproveClubs}
                />
              </div>

              <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-approve-events" className="font-medium">
                    Tự động phê duyệt sự kiện mới
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Sự kiện mới sẽ được tự động phê duyệt mà không cần xác nhận
                    của quản trị viên
                  </p>
                </div>
                <Switch
                  id="auto-approve-events"
                  checked={autoApproveEvents}
                  onCheckedChange={setAutoApproveEvents}
                />
              </div>

              {/* Logo hệ thống */}
              <div className="space-y-2">
                <div className="flex items-center">
                  <ImageIcon className="h-4 w-4 mr-2 text-purple-500" />
                  <Label>Logo hệ thống</Label>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-md border flex items-center justify-center">
                    <ImageIcon className="h-10 w-10 text-gray-400" />
                  </div>
                  <Button variant="outline" size="sm">
                    Thay đổi logo
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full sm:w-auto">
                <Save className="mr-2 h-4 w-4" />
                Lưu thay đổi
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Cài đặt Email */}
        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt Email</CardTitle>
              <CardDescription>
                Quản lý cấu hình email và thông báo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Cấu hình SMTP */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-blue-500" />
                  Cấu hình SMTP
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtp-host">Máy chủ SMTP</Label>
                    <Input id="smtp-host" placeholder="smtp.example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp-port">Cổng SMTP</Label>
                    <Input id="smtp-port" placeholder="587" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtp-username">Tên đăng nhập</Label>
                    <Input
                      id="smtp-username"
                      placeholder="username@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp-password">Mật khẩu</Label>
                    <Input
                      id="smtp-password"
                      type="password"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="from-email">Email người gửi</Label>
                  <Input id="from-email" placeholder="noreply@sportsnet.com" />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Kiểm tra kết nối
                  </Button>
                </div>
              </div>

              <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications" className="font-medium">
                    Thông báo qua email
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Gửi email thông báo cho người dùng khi có sự kiện mới, cập
                    nhật từ câu lạc bộ, v.v.
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>

              {/* Mẫu email */}
              <div className="space-y-2">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-orange-500" />
                  <Label htmlFor="email-template">Mẫu email chào mừng</Label>
                </div>
                <Textarea
                  id="email-template"
                  placeholder="Nội dung mẫu email chào mừng"
                  className="min-h-[150px]"
                  defaultValue="Chào mừng bạn đến với SportsNet! Chúng tôi rất vui khi bạn tham gia cộng đồng của chúng tôi."
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full sm:w-auto">
                <Save className="mr-2 h-4 w-4" />
                Lưu thay đổi
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Cài đặt bảo mật */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt bảo mật</CardTitle>
              <CardDescription>
                Quản lý các thiết lập bảo mật của hệ thống
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-red-500" />
                  Cấu hình bảo mật
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="password-policy">Chính sách mật khẩu</Label>
                  <Select defaultValue="strong">
                    <SelectTrigger id="password-policy">
                      <SelectValue placeholder="Chọn chính sách" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">
                        Cơ bản (ít nhất 8 ký tự)
                      </SelectItem>
                      <SelectItem value="medium">
                        Trung bình (ít nhất 8 ký tự, bao gồm chữ và số)
                      </SelectItem>
                      <SelectItem value="strong">
                        Mạnh (ít nhất 10 ký tự, bao gồm chữ hoa, chữ thường, số
                        và ký tự đặc biệt)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="session-timeout">
                    Thời gian hết hạn phiên (phút)
                  </Label>
                  <Input id="session-timeout" type="number" defaultValue="60" />
                </div>

                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="two-factor-auth" className="font-medium">
                      Xác thực hai yếu tố
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Yêu cầu xác thực hai yếu tố cho tài khoản quản trị viên
                    </p>
                  </div>
                  <Switch id="two-factor-auth" defaultChecked />
                </div>

                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="ip-restriction" className="font-medium">
                      Giới hạn địa chỉ IP
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Giới hạn truy cập trang quản trị từ các địa chỉ IP cụ thể
                    </p>
                  </div>
                  <Switch id="ip-restriction" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="allowed-ips">
                    Địa chỉ IP được phép (mỗi IP một dòng)
                  </Label>
                  <Textarea
                    id="allowed-ips"
                    placeholder="192.168.1.1
10.0.0.1"
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full sm:w-auto">
                <Save className="mr-2 h-4 w-4" />
                Lưu thay đổi
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Sao lưu & Phục hồi */}
        <TabsContent value="backup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sao lưu & Phục hồi</CardTitle>
              <CardDescription>
                Quản lý sao lưu và phục hồi dữ liệu hệ thống
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center">
                  <Database className="h-5 w-5 mr-2 text-green-500" />
                  Sao lưu dữ liệu
                </h3>

                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-backup" className="font-medium">
                      Tự động sao lưu
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Tự động sao lưu dữ liệu hệ thống theo lịch trình
                    </p>
                  </div>
                  <Switch id="auto-backup" defaultChecked />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="backup-frequency">Tần suất sao lưu</Label>
                  <Select defaultValue="daily">
                    <SelectTrigger id="backup-frequency">
                      <SelectValue placeholder="Chọn tần suất" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hàng giờ</SelectItem>
                      <SelectItem value="daily">Hàng ngày</SelectItem>
                      <SelectItem value="weekly">Hàng tuần</SelectItem>
                      <SelectItem value="monthly">Hàng tháng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="backup-retention">
                    Thời gian lưu trữ (ngày)
                  </Label>
                  <Input
                    id="backup-retention"
                    type="number"
                    defaultValue="30"
                  />
                </div>

                <div className="flex justify-start gap-2">
                  <Button>
                    <Database className="mr-2 h-4 w-4" />
                    Tạo sao lưu ngay
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Phục hồi dữ liệu</h3>

                <div className="space-y-2">
                  <Label htmlFor="restore-file">Tệp sao lưu</Label>
                  <div className="flex gap-2">
                    <Input id="restore-file" type="file" />
                    <Button variant="outline">
                      <Upload className="mr-2 h-4 w-4" />
                      Tải lên
                    </Button>
                  </div>
                </div>

                <div className="rounded-lg border p-4 bg-yellow-50">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800">Cảnh báo</h4>
                      <p className="text-sm text-yellow-700">
                        Phục hồi dữ liệu sẽ ghi đè lên dữ liệu hiện tại. Hãy đảm
                        bảo bạn đã sao lưu dữ liệu hiện tại trước khi thực hiện
                        phục hồi.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-start gap-2">
                  <Button variant="destructive">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Phục hồi dữ liệu
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
