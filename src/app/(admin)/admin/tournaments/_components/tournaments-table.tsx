"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import CustomPagination from "@/components/custom-pagination";
import { TournamentAdminResponse } from "@/schemaValidations/tournament.schema";
import TournamentCreateModal from "@/app/(admin)/admin/tournaments/_components/create-modal";

interface TournamentsTableProps {
  tournaments: TournamentAdminResponse[];
  totalPages: number;
  currentPage: number;
  accessToken: string;
  totalElements: number;
}

export default function TournamentsTable({
  tournaments,
  totalPages,
  currentPage,
  totalElements,
}: TournamentsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const router = useRouter();

  // --- Bộ lọc ---
  const filteredTournaments = tournaments.filter((t) => {
    const matchesSearch = t.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // --- Badge trạng thái ---
  const getStatusBadge = (status: TournamentAdminResponse["status"]) => {
    const badgeMap: Record<string, { text: string; color: string }> = {
      UPCOMING: {
        text: "Sắp diễn ra",
        color:
          "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-700",
      },
      REGISTRATION_OPEN: {
        text: "Mở đăng ký",
        color:
          "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-300 border-green-200 dark:border-green-700",
      },
      REGISTRATION_CLOSED: {
        text: "Đã đóng đăng ký",
        color:
          "bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700",
      },
      IN_PROGRESS: {
        text: "Đang diễn ra",
        color:
          "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700",
      },
      COMPLETED: {
        text: "Hoàn thành",
        color:
          "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700",
      },
      CANCELLED: {
        text: "Đã hủy",
        color:
          "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 border-red-200 dark:border-red-700",
      },
    };
    const b = badgeMap[status];
    return (
      <Badge variant="outline" className={b.color}>
        {b.text}
      </Badge>
    );
  };

  // --- Hành động ---
  const updateTournamentStatus = async (id: string, newStatus: string) => {
    // TODO: Implement API call to update tournament status.
    // Keep parameters for the future request payload.
    void id;
    void newStatus;
    try {
      //   await adminApiRequest.updateTournamentStatus(id, newStatus, accessToken);
      toast.success("Cập nhật trạng thái thành công");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Không thể cập nhật trạng thái");
    }
  };

  const deleteTournament = async (id: string) => {
    // TODO: Implement API call to delete tournament.
    // Keep parameter for the future request payload.
    void id;
    try {
      //   await adminApiRequest.deleteTournament(id, accessToken);
      toast.success("Xóa giải đấu thành công");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Xóa giải đấu thất bại");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Quản lý giải đấu
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Quản lý tất cả giải đấu trong hệ thống
          </p>
        </div>
        <div className="flex gap-2">
          {/* <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Xuất Excel
          </Button> */}
          <TournamentCreateModal />
        </div>
      </div>

      <Card className="dark:border-gray-700 dark:bg-gray-900">
        <CardHeader className="pb-3">
          <CardTitle className="dark:text-white">Danh sách giải đấu</CardTitle>
          <CardDescription className="dark:text-gray-400">
            Tổng cộng {totalElements} giải đấu trong hệ thống
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Bộ lọc */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <Input
                placeholder="Tìm kiếm theo tên giải đấu..."
                className="pl-10 dark:text-white dark:bg-gray-800 dark:border-gray-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-4">
              <div className="w-52">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-800 dark:text-white">
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    <SelectItem value="UPCOMING">Sắp diễn ra</SelectItem>
                    <SelectItem value="REGISTRATION_OPEN">
                      Mở đăng ký
                    </SelectItem>
                    <SelectItem value="REGISTRATION_CLOSED">
                      Đã đóng đăng ký
                    </SelectItem>
                    <SelectItem value="IN_PROGRESS">Đang diễn ra</SelectItem>
                    <SelectItem value="COMPLETED">Hoàn thành</SelectItem>
                    <SelectItem value="CANCELLED">Đã hủy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="dark:border-gray-700 dark:text-white"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Bảng */}
          <div className="rounded-md border dark:border-gray-700">
            <Table>
              <TableHeader>
                <TableRow className="dark:border-gray-700">
                  <TableHead className="dark:text-gray-300">
                    Tên giải đấu
                  </TableHead>
                  <TableHead className="dark:text-gray-300">
                    Thời gian
                  </TableHead>
                  <TableHead className="dark:text-gray-300">Đăng ký</TableHead>
                  <TableHead className="dark:text-gray-300">Địa điểm</TableHead>
                  <TableHead className="dark:text-gray-300">
                    Trạng thái
                  </TableHead>
                  <TableHead className="text-right dark:text-gray-300">
                    Thao tác
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTournaments.map((tournament) => (
                  <TableRow
                    key={tournament.id}
                    className="dark:border-gray-700"
                  >
                    <TableCell className="font-medium dark:text-white">
                      <div className="flex flex-col">
                        <span>{tournament.name}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {tournament.categories?.length
                            ? `${tournament.categories.length} hạng mục`
                            : "Không có hạng mục"}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="dark:text-gray-200">
                      {new Date(tournament.startDate).toLocaleDateString(
                        "vi-VN",
                      )}{" "}
                      →{" "}
                      {new Date(tournament.endDate).toLocaleDateString("vi-VN")}
                    </TableCell>

                    <TableCell className="dark:text-gray-200">
                      {new Date(
                        tournament.registrationStartDate,
                      ).toLocaleDateString("vi-VN")}{" "}
                      →{" "}
                      {new Date(
                        tournament.registrationEndDate,
                      ).toLocaleDateString("vi-VN")}
                    </TableCell>

                    <TableCell className="dark:text-gray-200">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                        {tournament.facility
                          ? tournament.facility.location
                          : (tournament.location ?? "Chưa cập nhật")}
                      </div>
                    </TableCell>

                    <TableCell>{getStatusBadge(tournament.status)}</TableCell>

                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="dark:text-gray-200"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-48 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                        >
                          <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/tournaments/${tournament.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center cursor-pointer"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Xem chi tiết
                            </Link>
                          </DropdownMenuItem>

                          {tournament.status === "UPCOMING" && (
                            <DropdownMenuItem
                              className="cursor-pointer text-green-600 dark:text-green-400"
                              onClick={() =>
                                updateTournamentStatus(
                                  tournament.id,
                                  "REGISTRATION_OPEN",
                                )
                              }
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Mở đăng ký
                            </DropdownMenuItem>
                          )}

                          {tournament.status !== "CANCELLED" && (
                            <DropdownMenuItem
                              className="cursor-pointer text-red-600 dark:text-red-400"
                              onClick={() =>
                                updateTournamentStatus(
                                  tournament.id,
                                  "CANCELLED",
                                )
                              }
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Hủy giải
                            </DropdownMenuItem>
                          )}

                          <DropdownMenuItem
                            className="cursor-pointer text-red-600 dark:text-red-400"
                            onClick={() => deleteTournament(tournament.id)}
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

          {/* Phân trang */}
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
