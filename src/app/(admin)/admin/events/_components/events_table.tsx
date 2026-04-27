"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

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
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  Users,
  Download,
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
import CustomPagination from "@/components/custom-pagination";
import { EventAdminType } from "@/schemaValidations/event.schema";

interface EventsTableProps {
  events: EventAdminType[];
  totalPages: number;
  currentPage: number;
  totalElements: number;
  accessToken: string;
}

export default function EventsTable({
  events,
  totalPages,
  currentPage,
  totalElements,
}: EventsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const router = useRouter();

  // Lọc sự kiện theo tên CLB, tiêu đề và trạng thái
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.nameClub.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || event.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Badge trạng thái
  const getStatusBadge = (status: EventAdminType["status"]) => {
    switch (status) {
      case "DRAFT":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-600 border-blue-200"
          >
            Đang chỉnh sửa
          </Badge>
        );
      case "OPEN":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-600 border-green-200"
          >
            Đang mở đăng ký
          </Badge>
        );
      case "CLOSED":
        return (
          <Badge
            variant="outline"
            className="bg-gray-50 text-gray-600 border-gray-200"
          >
            Đã đóng đăng ký
          </Badge>
        );
      case "ONGOING":
        return (
          <Badge
            variant="outline"
            className="bg-orange-50 text-orange-600 border-orange-200"
          >
            Đang diễn ra
          </Badge>
        );
      case "FINISHED":
        return (
          <Badge
            variant="outline"
            className="bg-purple-50 text-purple-600 border-purple-200"
          >
            Đã kết thúc
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-600 border-red-200"
          >
            Đã hủy
          </Badge>
        );
      default:
        return null;
    }
  };

  // Hàm cập nhật trạng thái (ví dụ: hủy hoặc mở lại)
  const updateEventStatus = async (slug: string, newStatus: string) => {
    // TODO: Implement API call to update event status.
    // Keep parameters for the future request payload.
    void slug;
    void newStatus;
    try {
      //   await adminApiRequest.updateEventStatus(slug, newStatus, accessToken);
      toast.success("Cập nhật trạng thái thành công");
      router.refresh();
    } catch (error) {
      toast.error("Không thể cập nhật trạng thái");
      console.error(error);
    }
  };

  const deleteEvent = async (slug: string) => {
    // TODO: Implement API call to delete event.
    // Keep parameter for the future request payload.
    void slug;
    try {
      //   await adminApiRequest.deleteEvent(slug, accessToken);
      toast.success("Xóa buổi đánh cầu thành công");
      router.refresh();
    } catch (error) {
      toast.error("Xóa thất bại");
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Quản lý hoạt động của CLB
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Quản lý tất cả buổi đánh cầu do các CLB tổ chức
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Xuất Excel
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Danh sách buổi đánh cầu</CardTitle>
          <CardDescription>
            Tổng cộng {totalElements} buổi đánh cầu trong hệ thống
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Bộ lọc và tìm kiếm */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm theo tiêu đề, CLB, địa điểm..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-4">
              <div className="w-40">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="UPCOMING">Sắp diễn ra</SelectItem>
                    <SelectItem value="ONGOING">Đang diễn ra</SelectItem>
                    <SelectItem value="FINISHED">Đã kết thúc</SelectItem>
                    <SelectItem value="CANCELLED">Đã hủy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Bảng dữ liệu */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tiêu đề</TableHead>
                  <TableHead>CLB</TableHead>
                  <TableHead>Thời gian</TableHead>
                  <TableHead>Địa điểm</TableHead>
                  <TableHead className="text-center">Số người</TableHead>
                  <TableHead className="text-center">Trạng thái</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6">
                      Không có dữ liệu
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">
                        {event.title}
                      </TableCell>
                      <TableCell>{event.nameClub}</TableCell>
                      <TableCell>
                        {format(event.startTime, "HH:mm", { locale: vi })} -{" "}
                        {format(event.endTime, "HH:mm", { locale: vi })}{" "}
                        {format(event.startTime, "dd/MM/yyyy", { locale: vi })}
                      </TableCell>
                      <TableCell>
                        {event.facility?.location ?? event.location}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span>
                            {event.joinedMember}/{event.totalMember}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {getStatusBadge(event.status)}
                      </TableCell>
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
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/events/${event.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center cursor-pointer"
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Xem chi tiết
                              </Link>
                            </DropdownMenuItem>
                            {event.status !== "CANCELLED" && (
                              <DropdownMenuItem
                                className="cursor-pointer text-red-600"
                                onClick={() =>
                                  updateEventStatus(event.slug, "CANCELLED")
                                }
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Hủy buổi đánh
                              </DropdownMenuItem>
                            )}
                            {event.status === "CANCELLED" && (
                              <DropdownMenuItem
                                className="cursor-pointer text-green-600"
                                onClick={() =>
                                  updateEventStatus(event.slug, "UPCOMING")
                                }
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Mở lại
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              className="cursor-pointer text-red-600"
                              onClick={() => deleteEvent(event.slug)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6">
              <CustomPagination
                totalPages={totalPages}
                currentPage={currentPage}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
