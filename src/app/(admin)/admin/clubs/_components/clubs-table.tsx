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
  Download,
  Users,
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
import { ClubAdminSchemaType } from "@/schemaValidations/clubs.schema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import adminApiRequest from "@/apiRequest/admin";
import Link from "next/link";
import CustomPagination from "@/components/custom-pagination";

interface ClubsTableProps {
  clubs: ClubAdminSchemaType[];
  totalPages: number;
  currentPage: number;
  accessToken: string;
  totalElements: number;
}

export default function ClubsTable({
  clubs,
  totalPages,
  currentPage,
  accessToken,
  totalElements,
}: ClubsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const router = useRouter();

  // Lọc câu lạc bộ dựa trên các bộ lọc
  const filteredClubs = clubs.filter((club) => {
    const matchesSearch =
      club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      club.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      club.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || club.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Hiển thị badge trạng thái
  const getStatusBadge = (status: ClubAdminSchemaType["status"]) => {
    switch (status) {
      case "ACTIVE":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-600 border-green-200"
          >
            Hoạt động
          </Badge>
        );
      case "INACTIVE":
        return (
          <Badge
            variant="outline"
            className="bg-gray-50 text-gray-600 border-gray-200"
          >
            Không hoạt động
          </Badge>
        );
      case "PENDING":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-600 border-yellow-200"
          >
            Chờ duyệt
          </Badge>
        );
      default:
        return null;
    }
  };

  // Hàm cập nhật trạng thái câu lạc bộ
  const updateClubStatus = async (clubId: string, newStatus: string) => {
    try {
      await adminApiRequest.updateClubStatus(clubId, newStatus, accessToken);
      toast("Cập nhật trạng thái thành công");
      router.refresh();
    } catch (error) {
      toast("Không thể cập nhật trạng thái câu lạc bộ");
      console.error("Error updating club status:", error);
    }
  };

  const deleteClub = async (clubId: string) => {
    try {
      await adminApiRequest.deleteClub(clubId, accessToken);
      toast("Xóa Câu Lạc Bộ thành công");
      router.refresh();
    } catch (error) {
      toast("Xóa Câu Lạc Bộ thất bại");
      console.error("Error updating club status:", error);
    }
  };

  // Tạo mảng các trang để hiển thị trong pagination
  const generatePagination = (currentPage: number, totalPages: number) => {
    // Nếu không có trang nào hoặc chỉ có 1 trang
    if (totalPages <= 1) return [0];

    // Nếu ít hơn 7 trang, hiển thị tất cả
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i);
    }

    const pages: number[] = [0]; // Trang đầu

    // Xác định phạm vi trang cần hiển thị
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages - 2, currentPage + 1);

    // Điều chỉnh nếu gần đầu
    if (currentPage <= 2) {
      endPage = Math.min(4, totalPages - 2);
    }

    // Điều chỉnh nếu gần cuối
    if (currentPage >= totalPages - 3) {
      startPage = Math.max(totalPages - 5, 1);
      endPage = totalPages - 2;
    }

    // Thêm dấu chấm lửng nếu cần
    if (startPage > 1) {
      pages.push(-1); // Dấu chấm lửng đầu
    }

    // Thêm các trang xung quanh trang hiện tại
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Thêm dấu chấm lửng nếu cần
    if (endPage < totalPages - 2) {
      pages.push(-2); // Dấu chấm lửng cuối
    }

    // Trang cuối
    pages.push(totalPages - 1);

    return pages;
  };

  const paginationItems = generatePagination(currentPage, totalPages);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Quản lý câu lạc bộ
          </h1>
          <p className="text-muted-foreground text-gray-500 dark:text-gray-400">
            Quản lý tất cả câu lạc bộ trong hệ thống
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Xuất Excel
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Danh sách câu lạc bộ</CardTitle>
          <CardDescription>
            Tổng cộng {totalElements} câu lạc bộ trong hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm theo tên, chủ sở hữu..."
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
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    <SelectItem value="ACTIVE">Hoạt động</SelectItem>
                    <SelectItem value="INACTIVE">Không hoạt động</SelectItem>
                    <SelectItem value="PENDING">Chờ duyệt</SelectItem>
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
                  <TableHead>Tên câu lạc bộ</TableHead>
                  <TableHead>Chủ sở hữu</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Số thành viên</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClubs.map((club) => (
                  <TableRow key={club.id}>
                    <TableCell className="font-medium">{club.name}</TableCell>
                    <TableCell>{club.ownerName}</TableCell>
                    <TableCell>{club.email}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span>
                          {club.memberCount} / {club.maxMembers}{" "}
                        </span>
                      </div>
                    </TableCell>
                    {/* <TableCell>{club.reputation?.toFixed(2)}</TableCell> */}
                    <TableCell>{getStatusBadge(club.status)}</TableCell>
                    <TableCell>
                      {new Date(club.createdAt).toLocaleDateString("vi-VN")}
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
                              href={`/clubs/${club.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center cursor-pointer"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Xem chi tiết
                            </Link>
                          </DropdownMenuItem>
                          {club.status === "PENDING" && (
                            <DropdownMenuItem
                              className="cursor-pointer text-green-600"
                              onClick={() =>
                                updateClubStatus(club.slug, "ACTIVE")
                              }
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Phê duyệt
                            </DropdownMenuItem>
                          )}
                          {club.status === "ACTIVE" ? (
                            <DropdownMenuItem
                              className="cursor-pointer text-orange-600"
                              onClick={() =>
                                updateClubStatus(club.slug, "INACTIVE")
                              }
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Vô hiệu hóa
                            </DropdownMenuItem>
                          ) : club.status === "INACTIVE" ? (
                            <DropdownMenuItem
                              className="cursor-pointer text-green-600"
                              onClick={() =>
                                updateClubStatus(club.slug, "ACTIVE")
                              }
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Kích hoạt
                            </DropdownMenuItem>
                          ) : null}
                          <DropdownMenuItem
                            className="cursor-pointer text-red-600"
                            onClick={() => deleteClub(club.slug)}
                          >
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
