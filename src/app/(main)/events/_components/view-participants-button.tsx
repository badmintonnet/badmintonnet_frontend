"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  Users,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
} from "lucide-react";
import { ParticipantType } from "@/schemaValidations/event.schema";
import { clientSessionToken } from "@/lib/http";
import eventClubApiRequest from "@/apiRequest/club.event";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface ViewParticipantsButtonProps {
  eventId: string;
}

const PAGE_SIZE_OPTIONS = [
  { value: 5, label: "5 / trang" },
  { value: 10, label: "10 / trang" },
  { value: 20, label: "20 / trang" },
  { value: 50, label: "50 / trang" },
];

export default function ViewParticipantsButton({
  eventId,
}: ViewParticipantsButtonProps) {
  const [open, setOpen] = useState(false);
  const [participants, setParticipants] = useState<ParticipantType[]>([]);
  const [filteredParticipants, setFilteredParticipants] = useState<
    ParticipantType[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [genderFilter, setGenderFilter] = useState<string>("ALL");

  const fetchParticipants = async (
    currentPage: number,
    currentPageSize: number
  ) => {
    setLoading(true);
    try {
      const accessToken = clientSessionToken.value;
      const res = await eventClubApiRequest.getParticipants(
        eventId,
        accessToken || "",
        currentPage,
        currentPageSize
      );
      const participantsData = res.payload.data.content || [];
      setParticipants(participantsData);
      setTotalPages(res.payload.data.totalPages || 1);
      setTotalElements(res.payload.data.totalElements || 0);

      // Apply local filtering
      applyFilters(participantsData, searchQuery, genderFilter);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Không thể tải danh sách thành viên");
      }
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (
    data: ParticipantType[],
    search: string,
    gender: string
  ) => {
    let filtered = [...data];

    // Search filter
    if (search.trim()) {
      filtered = filtered.filter(
        (p) =>
          p.fullName.toLowerCase().includes(search.toLowerCase()) ||
          p.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Gender filter
    if (gender !== "ALL") {
      filtered = filtered.filter((p) => p.gender === gender);
    }

    setFilteredParticipants(filtered);
  };

  const handleOpen = () => {
    setOpen(true);
    setPage(0);
    fetchParticipants(0, pageSize);
  };

  const handlePageSizeChange = (newSize: string) => {
    const size = parseInt(newSize);
    setPageSize(size);
    setPage(0);
    fetchParticipants(0, size);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchParticipants(newPage, pageSize);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    applyFilters(participants, value, genderFilter);
  };

  const handleGenderFilterChange = (value: string) => {
    setGenderFilter(value);
    applyFilters(participants, searchQuery, value);
  };

  useEffect(() => {
    if (open && participants.length > 0) {
      applyFilters(participants, searchQuery, genderFilter);
    }
  }, [searchQuery, genderFilter, participants, open]);

  const getGenderText = (gender: string) => {
    switch (gender) {
      case "MALE":
        return "Nam";
      case "FEMALE":
        return "Nữ";
      default:
        return "Khác";
    }
  };

  const getGenderColor = (gender: string) => {
    switch (gender) {
      case "MALE":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300";
      case "FEMALE":
        return "bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300";
    }
  };

  return (
    <>
      <Button
        className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 
                   dark:from-emerald-600 dark:to-teal-700 dark:hover:from-emerald-700 dark:hover:to-teal-800 
                   text-white font-medium py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02] 
                   hover:shadow-lg active:scale-[0.98] shadow-md"
        onClick={handleOpen}
      >
        <Users className="w-4 h-4 mr-2" />
        Xem thành viên tham gia
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl">
          <DialogHeader className="pb-6 border-b border-gray-100 dark:border-gray-800">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Danh sách thành viên tham gia
            </DialogTitle>
            {!loading && (
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center ">
                  <Badge
                    variant="secondary"
                    className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                  >
                    Tổng: {totalElements} thành viên
                  </Badge>
                  {(searchQuery || genderFilter !== "ALL") && (
                    <Badge
                      variant="outline"
                      className="text-blue-600 dark:text-blue-400"
                    >
                      Hiển thị: {filteredParticipants.length}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center ">
                  <Select
                    value={pageSize.toString()}
                    onValueChange={handlePageSizeChange}
                  >
                    <SelectTrigger className="w-32 h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PAGE_SIZE_OPTIONS.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value.toString()}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </DialogHeader>

          {/* Filters */}
          <div className="space-y-4 py-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm theo tên hoặc email..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10 h-10 border-gray-200 dark:border-gray-700 focus:border-emerald-500 dark:focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <Select
                  value={genderFilter}
                  onValueChange={handleGenderFilterChange}
                >
                  <SelectTrigger className="w-32 h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Tất cả</SelectItem>
                    <SelectItem value="MALE">Nam</SelectItem>
                    <SelectItem value="FEMALE">Nữ</SelectItem>
                    <SelectItem value="OTHER">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Participants List */}
          <div className="max-h-96 overflow-y-auto pr-2 -mr-2">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-600 dark:text-emerald-400 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Đang tải...
                  </p>
                </div>
              </div>
            ) : filteredParticipants.length > 0 ? (
              <div className="grid gap-3">
                {filteredParticipants.map((p, index) => (
                  <div
                    key={p.id}
                    className="group flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-800 
                             hover:border-emerald-200 dark:hover:border-emerald-700 
                             hover:bg-gradient-to-r hover:from-emerald-50/50 hover:to-teal-50/50 
                             dark:hover:from-emerald-900/10 dark:hover:to-teal-900/10 
                             transition-all duration-200 hover:shadow-md"
                  >
                    <div className="relative">
                      <Avatar className="w-12 h-12 ring-2 ring-transparent group-hover:ring-emerald-200 dark:group-hover:ring-emerald-700 transition-all duration-200">
                        <AvatarImage src={p.avatarUrl || ""} alt={p.fullName} />
                        <AvatarFallback
                          className="bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/50 dark:to-teal-900/50 
                                                   text-emerald-700 dark:text-emerald-300 font-semibold text-sm"
                        >
                          {p.fullName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate text-base">
                            {p.fullName}
                          </h3>
                          {p.clubMember ? (
                            <Badge className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-0.5 shrink-0">
                              Thành viên CLB
                            </Badge>
                          ) : (
                            <Badge className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-0.5 shrink-0">
                              Vãng lai
                            </Badge>
                          )}
                        </div>

                        <Badge
                          variant="outline"
                          className={`text-xs shrink-0 ${getGenderColor(
                            p.gender
                          )}`}
                        >
                          {getGenderText(p.gender)}
                        </Badge>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate mb-2 font-medium">
                        {p.email}
                      </p>

                      <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-500">
                        <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md font-medium">
                          Tham gia:{" "}
                          {new Date(p.joinedAt).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center">
                  <Users className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {searchQuery || genderFilter !== "ALL"
                    ? "Không tìm thấy thành viên"
                    : "Chưa có ai tham gia"}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {searchQuery || genderFilter !== "ALL"
                    ? "Thử thay đổi bộ lọc để xem thêm thành viên"
                    : "Sự kiện chưa có thành viên nào tham gia"}
                </p>
              </div>
            )}
          </div>

          {/* Enhanced Pagination */}
          {!loading && participants.length > 0 && totalPages > 1 && (
            <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-800">
              <Button
                variant="outline"
                disabled={page === 0}
                onClick={() => handlePageChange(page - 1)}
                className="flex items-center gap-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 
                          hover:bg-emerald-50 hover:border-emerald-300 dark:hover:bg-emerald-900/20 dark:hover:border-emerald-600
                          disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <ChevronLeft className="w-4 h-4" />
                Trước
              </Button>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400 font-medium px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  Trang {page + 1} / {totalPages}
                </span>
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  (
                  {Math.min(
                    page * pageSize + filteredParticipants.length,
                    totalElements
                  )}{" "}
                  / {totalElements})
                </div>
              </div>

              <Button
                variant="outline"
                disabled={page + 1 >= totalPages}
                onClick={() => handlePageChange(page + 1)}
                className="flex items-center gap-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 
                          hover:bg-emerald-50 hover:border-emerald-300 dark:hover:bg-emerald-900/20 dark:hover:border-emerald-600
                          disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Sau
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
