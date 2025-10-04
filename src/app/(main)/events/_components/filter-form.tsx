"use client";

import "@ant-design/v5-patch-for-react-19";
import { useState, useEffect, use } from "react";
import {
  Search,
  MapPin,
  ChevronDown,
  Calendar,
  DollarSign,
  Users,
  Star,
  Building2,
  Filter,
  X,
  Check,
  Clock,
  Award,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import addressApiRequest from "@/apiRequest/address";
import { useRouter } from "next/navigation";
import { DatePicker, Slider } from "antd";
import dayjs from "dayjs";

interface Province {
  id: string;
  full_name: string;
}

interface Ward {
  id: string;
  full_name: string;
}

interface Club {
  id: string;
  name: string;
  logo?: string;
}

interface FilterSidebarProps {
  searchQuery?: string;
  province?: string;
  ward?: string;
  quickTimeFilter?: string;
  isFree?: boolean;
  minFee?: number;
  maxFee?: number;
  startDate?: string;
  endDate?: string;
}

export default function FilterForm({
  searchQuery = "",
  province = "",
  ward = "",
  quickTimeFilter = "",
  isFree = false,
  minFee = 0,
  maxFee = 500,
  startDate = "",
  endDate = "",
}: FilterSidebarProps) {
  // Filter states
  const [searchValue, setSearchValue] = useState(searchQuery);
  const [selectedProvince, setSelectedProvince] = useState(province);
  const [selectedWard, setSelectedWard] = useState(ward);

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);

  const [dateRange, setDateRange] = useState({
    start: startDate ? dayjs(startDate).format("DD/MM/YYYY HH:mm") : "",
    end: endDate ? dayjs(endDate).format("DD/MM/YYYY HH:mm") : "",
  });
  const [quickTime, setQuickTime] = useState(quickTimeFilter);
  const [feeRange, setFeeRange] = useState({ min: minFee, max: maxFee });
  const [freeOnly, setFreeOnly] = useState(isFree);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [quickSizeFilter, setQuickSizeFilter] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [selectedClubs, setSelectedClubs] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);

  const { RangePicker } = DatePicker;

  const router = useRouter();

  // Mock data
  const levels = [
    "Mới tập chơi",
    "Cơ bản",
    "Trung bình",
    "Trung bình khá",
    "Khá",
    "Bán chuyên",
  ];
  // const categories = ["Đơn Nam", "Đơn Nữ", "Đôi Nam", "Đôi Nữ", "Đôi Nam Nữ"];
  const categories = [
    { key: "MEN_SINGLE", value: "Đơn Nam" },
    { key: "WOMEN_SINGLE", value: "Đơn Nữ" },
    { key: "MEN_DOUBLE", value: "Đôi Nam" },
    { key: "WOMEN_DOUBLE", value: "Đôi Nữ" },
    { key: "MIXED_DOUBLE", value: "Đôi Nam Nữ" },
  ];
  const clubs: Club[] = [
    { id: "1", name: "CLB Cầu Lông Sài Gòn", logo: "🏸" },
    { id: "2", name: "Badminton Pro Club", logo: "⭐" },
    { id: "3", name: "Victory Sports Club", logo: "🏆" },
  ];
  const statusOptions = [
    { key: "OPEN", value: "Đang mở đăng ký" },
    { key: "ONGOING", value: "Sắp diễn ra" },
    { key: "FINISHED", value: "Đã kết thúc" },
    { key: "CLOSED", value: "Đã đóng" },
    { key: "CANCELLED", value: "Đã hủy" },
  ];
  const quickTimeFilters = ["Tuyển gấp", "Hôm nay", "Cuối tuần", "Tuần này"];
  const quickSizeFilters = [
    { key: "NHO", value: "Nhóm nhỏ (<10)" },
    { key: "VUA", value: "Vừa (10-20)" },
    { key: "DONG", value: "Đông (>20)" },
  ];

  useEffect(() => {
    const fetchProvinces = async () => {
      setLoadingProvinces(true);
      try {
        const response = await addressApiRequest.getProvinces();
        setProvinces(response.payload.data.data || []);
      } catch (error) {
        console.error("Error fetching provinces:", error);
        setProvinces([]);
      } finally {
        setLoadingProvinces(false);
      }
    };

    fetchProvinces();
  }, []);

  // Fetch wards when province is selected
  useEffect(() => {
    const fetchWards = async () => {
      if (!selectedProvince) {
        setWards([]);
        return;
      }

      setLoadingWards(true);
      try {
        const response = await addressApiRequest.getWardsByProvinceId(
          selectedProvince
        );
        setWards(response.payload.data.data || []);
      } catch (error) {
        console.error("Error fetching wards:", error);
        setWards([]);
      } finally {
        setLoadingWards(false);
      }
    };

    fetchWards();
  }, [selectedProvince]);

  // Helper functions
  const handleLevelToggle = (level: string) => {
    setSelectedLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  const handleCategoryToggle = (key: string) => {
    setSelectedCategories((prev) =>
      prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key]
    );
  };

  const handleClubToggle = (clubName: string) => {
    setSelectedClubs((prev) =>
      prev.includes(clubName)
        ? prev.filter((c) => c !== clubName)
        : [...prev, clubName]
    );
  };

  const handleStatusToggle = (status: string) => {
    setSelectedStatus((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const handleQuickTimeFilter = (filter: string) => {
    setQuickTime(quickTime === filter ? "" : filter);
    if (filter !== quickTime) {
      setDateRange({ start: "", end: "" });
    }
  };

  const handleQuickSizeFilter = (filter: string) => {
    setQuickSizeFilter(quickSizeFilter === filter ? "" : filter);
  };

  const clearAllFilters = () => {
    setSearchValue("");
    setSelectedProvince("");
    setSelectedWard("");
    setWards([]);
    setDateRange({ start: "", end: "" });
    setQuickTime("");
    setFeeRange({ min: 0, max: 500 });
    setFreeOnly(false);
    setSelectedLevels([]);
    setSelectedCategories([]);
    setQuickSizeFilter("");
    setMinRating(0);
    setSelectedClubs([]);
    setSelectedStatus([]);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (searchValue) count++;
    if (selectedProvince) count++;
    if (selectedWard) count++;
    if (dateRange.start || dateRange.end || quickTime) count++;
    if (feeRange.min > 0 || feeRange.max < 500 || freeOnly) count++;
    if (selectedLevels.length > 0) count++;
    if (selectedCategories.length > 0) count++;
    if (quickSizeFilter) count++;
    if (minRating > 0) count++;
    if (selectedClubs.length > 0) count++;
    if (selectedStatus.length > 0) count++;
    return count;
  };

  const handleApplyFilters = () => {
    const provinceSelected = provinces.find((p) => p.id === selectedProvince);
    const wardSelected = wards.find((w) => w.id === selectedWard);

    const params = new URLSearchParams();
    if (searchValue.trim()) params.append("search", searchValue.trim());
    if (selectedProvince)
      params.append("province", provinceSelected?.full_name || "");
    if (selectedWard) params.append("ward", wardSelected?.full_name || "");

    if (quickTime) params.append("quickTimeFilter", quickTime);
    if (freeOnly) params.append("isFree", "true");
    if (feeRange.min > 0) params.append("minFee", feeRange.min.toString());
    if (feeRange.max < 500) params.append("maxFee", feeRange.max.toString());
    if (dateRange.start)
      params.append(
        "startDate",
        dayjs(dateRange.start, "DD/MM/YYYY HH:mm").format("YYYY-MM-DDTHH:mm:ss")
      );
    if (dateRange.end)
      params.append(
        "endDate",
        dayjs(dateRange.end, "DD/MM/YYYY HH:mm").format("YYYY-MM-DDTHH:mm:ss")
      );

    // Advanced filters (encode as comma-separated values)
    if (selectedLevels.length > 0)
      params.append("levels", selectedLevels.join(","));
    if (selectedCategories.length > 0)
      params.append("categories", selectedCategories.join(","));
    if (quickSizeFilter) params.append("participantSize", quickSizeFilter);
    if (minRating > 0) params.append("minRating", String(minRating));
    if (selectedClubs.length > 0)
      params.append("clubNames", selectedClubs.join(","));
    if (selectedStatus.length > 0)
      params.append("status", selectedStatus.join(","));

    router.push(`/events${params.toString() ? `?${params.toString()}` : ""}`);

    // // TODO: Implement filter application logic
    // const filters = {
    //   search: searchValue,
    //   province: selectedProvince,
    //   ward: selectedWard,
    //   dateRange,
    //   quickTimeFilter: quickTime,
    //   feeRange,
    //   isFree: freeOnly,
    //   levels: selectedLevels,
    //   categories: selectedCategories,
    //   quickSizeFilter,
    //   minRating,
    //   clubs: selectedClubs,
    //   status: selectedStatus,
    // };
  };

  // Reusable filter content component
  const FilterContent = () => (
    <div className="space-y-6">
      {/* Search Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Tìm kiếm
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Tên hoạt động, địa điểm..."
            className="w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-emerald-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-6">
        {/* 1. Thông tin cơ bản */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4" />
            Thông tin cơ bản
          </h3>

          {/* Thời gian */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700 dark:text-gray-300 text-sm">
              Thời gian
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {quickTimeFilters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => handleQuickTimeFilter(filter)}
                  className={`px-2.5 py-1 text-xs rounded-full border transition-all ${
                    quickTime === filter
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-400"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
            <div className="space-y-2">
              <RangePicker
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                value={
                  dateRange.start && dateRange.end
                    ? [
                        dayjs(dateRange.start, "DD/MM/YYYY HH:mm"),
                        dayjs(dateRange.end, "DD/MM/YYYY HH:mm"),
                      ]
                    : null
                }
                onChange={(dates, dateStrings) => {
                  setDateRange({
                    start: dateStrings[0] || "",
                    end: dateStrings[1] || "",
                  });
                  console.log(dateStrings);
                  console.log(dates);
                }}
                placeholder={["Từ ngày", "Đến ngày"]}
                showTime={true}
                format="DD/MM/YYYY hh:mm"
              />
            </div>
          </div>

          {/* Địa điểm */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700 dark:text-gray-300 text-sm flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Địa điểm
            </h4>
            <div className="space-y-2">
              <div className="relative">
                <select
                  value={selectedProvince}
                  onChange={(e) => {
                    setSelectedProvince(e.target.value);
                    setSelectedWard(""); // Reset ward when province changes
                  }}
                  disabled={loadingProvinces}
                  className="w-full px-3 py-2 pr-8 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-emerald-500 appearance-none disabled:opacity-50"
                >
                  <option value="">Chọn tỉnh thành</option>
                  {provinces.map((province) => (
                    <option key={province.id} value={province.id}>
                      {province.full_name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                {loadingProvinces && (
                  <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                    {/* Loading spinner */}
                  </div>
                )}
              </div>

              {selectedProvince && (
                <div className="relative">
                  <select
                    value={selectedWard}
                    onChange={(e) => setSelectedWard(e.target.value)}
                    disabled={loadingWards || !selectedProvince}
                    className="w-full px-3 py-2 pr-8 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-emerald-500 appearance-none disabled:opacity-50"
                  >
                    <option value="">Chọn quận/huyện</option>
                    {wards.map((ward) => (
                      <option key={ward.id} value={ward.id}>
                        {ward.full_name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  {loadingWards && (
                    <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                      {/* Loading spinner */}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Phí tham gia */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700 dark:text-gray-300 text-sm flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Phí tham gia
            </h4>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={freeOnly}
                onChange={(e) => setFreeOnly(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Miễn phí
              </span>
            </label>
            <div className="space-y-2">
              <Slider
                range
                defaultValue={[20, 50]}
                value={[feeRange.min, feeRange.max]}
                onChange={(value) =>
                  setFeeRange({ min: value[0], max: value[1] })
                }
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* 2. Đối tượng & Trình độ */}
        <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2 text-sm">
            <Award className="h-4 w-4" />
            Đối tượng & Trình độ
          </h3>

          {/* Level */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700 dark:text-gray-300 text-sm">
              Trình độ
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {levels.map((level) => (
                <button
                  key={level}
                  onClick={() => handleLevelToggle(level)}
                  className={`px-2.5 py-1 text-xs rounded-full border transition-all ${
                    selectedLevels.includes(level)
                      ? "bg-emerald-500 text-white border-emerald-500"
                      : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-emerald-400"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700 dark:text-gray-300 text-sm">
              Hạng mục
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((category) => (
                <button
                  key={category.key}
                  onClick={() => handleCategoryToggle(category.key)}
                  className={`px-2.5 py-1.5 text-xs rounded-lg border transition-all flex items-center gap-1 ${
                    selectedCategories.includes(category.key)
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-400"
                  }`}
                >
                  {selectedCategories.includes(category.key) && (
                    <Check className="h-3 w-3" />
                  )}
                  {category.value}
                </button>
              ))}
            </div>
          </div>

          {/* Số lượng người tham gia */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700 dark:text-gray-300 text-sm flex items-center gap-2">
              <Users className="h-4 w-4" />
              Số lượng người
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {quickSizeFilters.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => handleQuickSizeFilter(filter.key)}
                  className={`px-2.5 py-1 text-xs rounded-full border transition-all ${
                    quickSizeFilter === filter.key
                      ? "bg-purple-500 text-white border-purple-500"
                      : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-purple-400"
                  }`}
                >
                  {filter.value}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Uy tín & CLB */}
        <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2 text-sm">
            <Building2 className="h-4 w-4" />
            Uy tín & CLB
          </h3>

          {/* Rating */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700 dark:text-gray-300 text-sm">
              Rating tối thiểu
            </h4>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setMinRating(star === minRating ? 0 : star)}
                    className={`p-0.5 ${
                      star <= minRating ? "text-yellow-400" : "text-gray-300"
                    }`}
                  >
                    <Star className="h-4 w-4 fill-current" />
                  </button>
                ))}
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {minRating > 0 ? `${minRating}+ sao` : "Tất cả"}
              </span>
            </div>
          </div>

          {/* CLB */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700 dark:text-gray-300 text-sm">
              CLB tổ chức
            </h4>
            <div className="space-y-2">
              {clubs.map((club) => (
                <label
                  key={club.id}
                  className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedClubs.includes(club.id)}
                    onChange={() => handleClubToggle(club.name)}
                    className="w-3.5 h-3.5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm">{club.logo}</span>
                  <span className="text-xs text-gray-700 dark:text-gray-300 flex-1">
                    {club.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Trạng thái */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700 dark:text-gray-300 text-sm flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Trạng thái
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {statusOptions.map((status) => (
                <button
                  key={status.key}
                  onClick={() => handleStatusToggle(status.key)}
                  className={`px-2.5 py-1.5 text-xs rounded-lg border transition-all flex items-center gap-1 ${
                    selectedStatus.includes(status.key)
                      ? "bg-indigo-500 text-white border-indigo-500"
                      : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-indigo-400"
                  }`}
                >
                  {selectedStatus.includes(status.key) && (
                    <Check className="h-3 w-3" />
                  )}
                  {status.value}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-6 border-t border-gray-200 dark:border-gray-700 space-y-3">
        <Button onClick={clearAllFilters} variant="outline" className="w-full">
          <X className="h-4 w-4 mr-2" />
          Xóa tất cả bộ lọc
        </Button>

        <Button
          onClick={handleApplyFilters}
          className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700"
        >
          <Search className="h-4 w-4 mr-2" />
          Áp dụng ({getActiveFilterCount()})
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <Card className="hidden lg:block w-full sticky top-8 h-fit bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Filter className="h-5 w-5 text-blue-600 dark:text-emerald-400" />
                Bộ lọc tìm kiếm
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {getActiveFilterCount()} bộ lọc đang áp dụng
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <FilterContent />
        </CardContent>
      </Card>

      {/* Mobile Sheet */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="w-full mb-4 flex items-center justify-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Bộ lọc ({getActiveFilterCount()})
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full sm:max-w-md">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-blue-600 dark:text-emerald-400" />
                Bộ lọc tìm kiếm
              </SheetTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {getActiveFilterCount()} bộ lọc đang áp dụng
              </p>
            </SheetHeader>
            <div className="mt-6">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
