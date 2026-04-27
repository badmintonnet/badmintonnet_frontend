"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";

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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import facilityApiRequest from "@/apiRequest/facility";

import { Search, MoreHorizontal, Edit, Trash2, MapPin } from "lucide-react";
import CustomPagination from "@/components/custom-pagination";
import { UpdateFacilityDialog } from "./update-facility-dialog";
import { FacilityType } from "@/schemaValidations/event.schema";

interface FacilitiesTableProps {
  facilities: FacilityType[];
  totalPages: number;
  currentPage: number;
  totalElements: number;
}

export function FacilitiesTable({
  facilities,
  totalPages,
  currentPage,
}: FacilitiesTableProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFacility, setSelectedFacility] = useState<FacilityType | null>(
    null,
  );
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Hàm xử lý tìm kiếm
  const handleSearch = () => {
    // Chuyển hướng với query params
    router.push(
      `/admin/facilities?page=0&search=${encodeURIComponent(searchQuery)}`,
    );
  };

  // Hàm xử lý xóa facility
  const handleDelete = async () => {
    if (!selectedFacility) return;

    try {
      await facilityApiRequest.deleteFacility(selectedFacility.id);

      toast.success("Xóa cơ sở vật chất thành công");
      setIsDeleteDialogOpen(false);

      // Refresh bằng cách chuyển hướng lại trang hiện tại
      router.refresh();
    } catch (error) {
      console.error("Error deleting facility:", error);
      toast.error("Không thể xóa cơ sở vật chất");
    }
  };

  // Hàm xử lý cập nhật facility
  const handleUpdate = () => {
    toast.success("Đã cập nhật sân thành công");
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Danh sách sân</CardTitle>
          <CardDescription>
            Quản lý thông tin các sân trong hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Thanh tìm kiếm */}
          <div className="flex items-center mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                type="search"
                placeholder="Tìm kiếm theo tên, địa chỉ..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button variant="outline" className="ml-2" onClick={handleSearch}>
              Tìm kiếm
            </Button>
          </div>

          {/* Bảng dữ liệu */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên cơ sở</TableHead>
                  <TableHead>Địa chỉ</TableHead>
                  <TableHead>Quận/Huyện</TableHead>
                  <TableHead>Tỉnh/Thành phố</TableHead>
                  <TableHead>Hình ảnh</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {facilities.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10">
                      <div className="flex justify-center">
                        <MapPin className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Không có cơ sở vật chất nào
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  facilities.map((facility) => (
                    <TableRow key={facility.id}>
                      <TableCell className="font-medium">
                        {facility.name}
                      </TableCell>
                      <TableCell>{facility.address}</TableCell>
                      <TableCell>{facility.district}</TableCell>
                      <TableCell>{facility.city}</TableCell>
                      <TableCell>
                        {facility.image ? (
                          <div className="h-10 w-10 relative rounded-md overflow-hidden">
                            <Image
                              src={facility.image}
                              alt={facility.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
                            <MapPin className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                          </div>
                        )}
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
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedFacility(facility);
                                setIsUpdateDialogOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedFacility(facility);
                                setIsDeleteDialogOpen(true);
                              }}
                              className="text-red-600 dark:text-red-400"
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

      {/* Dialog xác nhận xóa */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              {`Bạn có chắc chắn muốn xóa cơ sở vật chất "${selectedFacility?.name}" không? 
              Hành động này không thể hoàn tác.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog cập nhật facility */}
      {selectedFacility && (
        <UpdateFacilityDialog
          open={isUpdateDialogOpen}
          onOpenChange={setIsUpdateDialogOpen}
          facility={selectedFacility}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}
