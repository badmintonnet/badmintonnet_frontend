"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

import {
  Search,
  MoreHorizontal,
  Download,
  ShieldCheck,
  ShieldAlert,
  Ban,
} from "lucide-react";
import CustomPagination from "@/components/custom-pagination";
import { AccountAdminType } from "@/schemaValidations/account.schema";
import adminApiRequest from "@/apiRequest/admin";

interface UsersTableProps {
  users: AccountAdminType[];
  totalPages: number;
  currentPage: number;
  totalElements: number;
}

export default function UsersTable({
  users,
  totalPages,
  currentPage,
  totalElements,
}: UsersTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const filteredUsers = users.filter((u) =>
    [u.fullName, u.email, u.phone].some((val) =>
      val?.toLowerCase().includes(searchTerm.toLowerCase()),
    ),
  );

  const toggleUserStatus = async (id: string, enabled: boolean) => {
    try {
      // await adminApiRequest.toggleUserStatus(id, !enabled);
      toast.success(enabled ? "Đã khóa tài khoản" : "Đã mở khóa tài khoản");
      adminApiRequest.banUser(id);
      router.refresh();
    } catch (error) {
      toast.error("Cập nhật thất bại");
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Quản lý người dùng</h1>
          <p className="text-gray-500">
            Danh sách tài khoản người dùng trên hệ thống
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Xuất Excel
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Danh sách người dùng</CardTitle>
          <CardDescription>
            Tổng cộng {totalElements} người dùng
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="relative w-full mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Tìm theo họ tên, email, số điện thoại..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Họ tên</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Số điện thoại</TableHead>
                  <TableHead>Vai trò</TableHead>
                  <TableHead className="text-center">Điểm kỹ năng</TableHead>
                  <TableHead className="text-center">
                    Số hoạt động tham gia
                  </TableHead>
                  <TableHead className="text-center">Điểm uy tín</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-6">
                      Không có dữ liệu
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.fullName}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone}</TableCell>

                      {/* Vai trò + tooltip club nếu là Chủ CLB */}
                      <TableCell>
                        {user.role === "Chủ CLB" ? (
                          <TooltipProvider delayDuration={150}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge
                                  className={
                                    "bg-blue-100 text-blue-700 border border-blue-300 dark:bg-blue-900 dark:text-blue-100 dark:border-blue-700 cursor-pointer transition-colors hover:bg-blue-200 dark:hover:bg-blue-800"
                                  }
                                >
                                  Chủ CLB
                                </Badge>
                              </TooltipTrigger>

                              <TooltipContent
                                side="top"
                                align="center"
                                className="w-72 p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg"
                              >
                                <p className="font-semibold text-sm mb-2">
                                  CLB sở hữu ({user.ownerClubs.length})
                                </p>
                                <div className="space-y-2 max-h-48 overflow-y-auto">
                                  {user.ownerClubs.map((club) => (
                                    <Link
                                      href={`/clubs/${club.slug}`}
                                      key={club.slug}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md p-2 transition-colors"
                                    >
                                      <Image
                                        src={
                                          club.urlLogo ||
                                          "/images/default-club.png"
                                        }
                                        alt={club.clubName}
                                        width={28}
                                        height={28}
                                        className="rounded-full object-cover border border-gray-200 dark:border-gray-600"
                                      />
                                      <span className="text-sm truncate">
                                        {club.clubName}
                                      </span>
                                    </Link>
                                  ))}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700"
                          >
                            {user.role}
                          </Badge>
                        )}
                      </TableCell>

                      <TableCell className="text-center">
                        {user?.overallScore.toFixed(1)}
                      </TableCell>
                      <TableCell className="text-center">
                        {user.totalParticipatedEvents}
                      </TableCell>
                      <TableCell className="text-center">
                        {user.reputationScore}
                      </TableCell>
                      <TableCell>
                        {format(new Date(user.createdAt), "dd/MM/yyyy", {
                          locale: vi,
                        })}
                      </TableCell>
                      <TableCell>
                        {user.enabled ? (
                          <Badge className="bg-green-50 text-green-600 border-green-200">
                            Hoạt động
                          </Badge>
                        ) : (
                          <Badge className="bg-red-50 text-red-600 border-red-200">
                            Đã khóa
                          </Badge>
                        )}
                      </TableCell>

                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/profile/${user.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ShieldCheck className="w-4 h-4 mr-2" />
                                Xem hồ sơ
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className={
                                user.enabled ? "text-red-600" : "text-green-600"
                              }
                              onClick={() =>
                                toggleUserStatus(user.id, user.enabled)
                              }
                            >
                              {user.enabled ? (
                                <>
                                  <Ban className="w-4 h-4 mr-2" /> Khóa tài
                                  khoản
                                </>
                              ) : (
                                <>
                                  <ShieldAlert className="w-4 h-4 mr-2" /> Mở
                                  khóa
                                </>
                              )}
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
