"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Flag,
  Clock,
  User,
  Users,
  Calendar,
  MessageSquare,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

type Report = {
  id: string;
  title: string;
  reportType: "user" | "club" | "event" | "content";
  reportedItemName: string;
  reportedBy: string;
  reportDate: string;
  status: "pending" | "investigating" | "resolved" | "dismissed";
  priority: "low" | "medium" | "high";
};

export default function ReportsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  // Dữ liệu mẫu
  const reports: Report[] = [
    {
      id: "1",
      title: "Người dùng đăng nội dung không phù hợp",
      reportType: "user",
      reportedItemName: "Nguyễn Văn A",
      reportedBy: "Trần Thị B",
      reportDate: "2023-11-15",
      status: "pending",
      priority: "high",
    },
    {
      id: "2",
      title: "Sự kiện có thông tin sai lệch",
      reportType: "event",
      reportedItemName: "Giải bóng đá giao hữu Cần Thơ",
      reportedBy: "Lê Văn C",
      reportDate: "2023-11-10",
      status: "investigating",
      priority: "medium",
    },
    {
      id: "3",
      title: "Câu lạc bộ vi phạm quy định",
      reportType: "club",
      reportedItemName: "Câu lạc bộ Tennis Đà Nẵng",
      reportedBy: "Phạm Văn D",
      reportDate: "2023-11-05",
      status: "resolved",
      priority: "medium",
    },
    {
      id: "4",
      title: "Nội dung bình luận xúc phạm",
      reportType: "content",
      reportedItemName: "Bình luận trong sự kiện XYZ",
      reportedBy: "Hoàng Văn E",
      reportDate: "2023-11-01",
      status: "dismissed",
      priority: "low",
    },
    {
      id: "5",
      title: "Người dùng giả mạo thông tin",
      reportType: "user",
      reportedItemName: "Đỗ Thị F",
      reportedBy: "Ngô Văn G",
      reportDate: "2023-10-28",
      status: "pending",
      priority: "high",
    },
    {
      id: "6",
      title: "Sự kiện có nội dung không phù hợp",
      reportType: "event",
      reportedItemName: "Giải cầu lông đôi nam nữ",
      reportedBy: "Vũ Thị H",
      reportDate: "2023-10-25",
      status: "investigating",
      priority: "high",
    },
  ];

  // Lọc báo cáo dựa trên các bộ lọc
  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reportedItemName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      report.reportedBy.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || report.status === statusFilter;

    const matchesType =
      typeFilter === "all" || report.reportType === typeFilter;

    const matchesPriority =
      priorityFilter === "all" || report.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesType && matchesPriority;
  });

  // Hiển thị badge trạng thái
  const getStatusBadge = (status: Report["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-600 border-yellow-200"
          >
            Chờ xử lý
          </Badge>
        );
      case "investigating":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-600 border-blue-200"
          >
            Đang điều tra
          </Badge>
        );
      case "resolved":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-600 border-green-200"
          >
            Đã giải quyết
          </Badge>
        );
      case "dismissed":
        return (
          <Badge
            variant="outline"
            className="bg-gray-50 text-gray-600 border-gray-200"
          >
            Đã bỏ qua
          </Badge>
        );
      default:
        return null;
    }
  };

  // Hiển thị badge mức độ ưu tiên
  const getPriorityBadge = (priority: Report["priority"]) => {
    switch (priority) {
      case "high":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-600 border-red-200"
          >
            Cao
          </Badge>
        );
      case "medium":
        return (
          <Badge
            variant="outline"
            className="bg-orange-50 text-orange-600 border-orange-200"
          >
            Trung bình
          </Badge>
        );
      case "low":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-600 border-green-200"
          >
            Thấp
          </Badge>
        );
      default:
        return null;
    }
  };

  // Hiển thị icon loại báo cáo
  const getReportTypeIcon = (type: Report["reportType"]) => {
    switch (type) {
      case "user":
        return <User className="h-4 w-4 text-blue-500" />;
      case "club":
        return <Users className="h-4 w-4 text-purple-500" />;
      case "event":
        return <Calendar className="h-4 w-4 text-orange-500" />;
      case "content":
        return <MessageSquare className="h-4 w-4 text-green-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  // Hiển thị tên loại báo cáo
  const getReportTypeName = (type: Report["reportType"]) => {
    switch (type) {
      case "user":
        return "Người dùng";
      case "club":
        return "Câu lạc bộ";
      case "event":
        return "Sự kiện";
      case "content":
        return "Nội dung";
      default:
        return "Khác";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Quản lý báo cáo
          </h1>
          <p className="text-muted-foreground text-gray-500 dark:text-gray-400">
            Xử lý các báo cáo từ người dùng
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Danh sách báo cáo</CardTitle>
          <CardDescription>
            Tổng cộng {reports.length} báo cáo trong hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm theo tiêu đề, người báo cáo..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="w-40">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    <SelectItem value="pending">Chờ xử lý</SelectItem>
                    <SelectItem value="investigating">Đang điều tra</SelectItem>
                    <SelectItem value="resolved">Đã giải quyết</SelectItem>
                    <SelectItem value="dismissed">Đã bỏ qua</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-40">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Loại báo cáo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả loại</SelectItem>
                    <SelectItem value="user">Người dùng</SelectItem>
                    <SelectItem value="club">Câu lạc bộ</SelectItem>
                    <SelectItem value="event">Sự kiện</SelectItem>
                    <SelectItem value="content">Nội dung</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-40">
                <Select
                  value={priorityFilter}
                  onValueChange={setPriorityFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Mức độ ưu tiên" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả mức độ</SelectItem>
                    <SelectItem value="high">Cao</SelectItem>
                    <SelectItem value="medium">Trung bình</SelectItem>
                    <SelectItem value="low">Thấp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tiêu đề</TableHead>
                  <TableHead>Loại báo cáo</TableHead>
                  <TableHead>Đối tượng</TableHead>
                  <TableHead>Người báo cáo</TableHead>
                  <TableHead>Ngày báo cáo</TableHead>
                  <TableHead>Mức độ</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Flag className="h-4 w-4 text-red-500" />
                        <span className="truncate max-w-[200px]">
                          {report.title}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {getReportTypeIcon(report.reportType)}
                        <span>{getReportTypeName(report.reportType)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="truncate max-w-[150px]">
                      {report.reportedItemName}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4 text-gray-500" />
                        <span>{report.reportedBy}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>
                          {new Date(report.reportDate).toLocaleDateString(
                            "vi-VN",
                          )}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{getPriorityBadge(report.priority)}</TableCell>
                    <TableCell>{getStatusBadge(report.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="cursor-pointer">
                            <Eye className="h-4 w-4 mr-2" />
                            Xem chi tiết
                          </DropdownMenuItem>
                          {report.status === "pending" && (
                            <DropdownMenuItem className="cursor-pointer text-blue-600">
                              <AlertTriangle className="h-4 w-4 mr-2" />
                              Bắt đầu điều tra
                            </DropdownMenuItem>
                          )}
                          {(report.status === "pending" ||
                            report.status === "investigating") && (
                            <DropdownMenuItem className="cursor-pointer text-green-600">
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Đánh dấu đã giải quyết
                            </DropdownMenuItem>
                          )}
                          {(report.status === "pending" ||
                            report.status === "investigating") && (
                            <DropdownMenuItem className="cursor-pointer text-gray-600">
                              <XCircle className="h-4 w-4 mr-2" />
                              Bỏ qua báo cáo
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="cursor-pointer text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
