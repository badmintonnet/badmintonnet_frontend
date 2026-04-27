"use client";

import "@ant-design/v5-patch-for-react-19";
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  Search,
  MapPin,
  ChevronDown,
  ChevronUp,
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import addressApiRequest from "@/apiRequest/address";
import facilityApiRequest from "@/apiRequest/facility";
import { useRouter } from "next/navigation";
import { DatePicker, Slider, Select } from "antd";
import dayjs from "dayjs";
import { FacilityType } from "@/schemaValidations/event.schema";
import Image from "next/image";

interface Province {
  id: string;
  full_name: string;
}

interface Ward {
  id: string;
  full_name: string;
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
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchValue, setSearchValue] = useState(searchQuery);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
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
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [facilities, setFacilities] = useState<FacilityType[]>([]);
  const [loadingFacilities, setLoadingFacilities] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);

  const { RangePicker } = DatePicker;
  const router = useRouter();

  const levels = [
    "Mới tập chơi",
    "Cơ bản",
    "Trung bình",
    "Trung bình khá",
    "Khá",
    "Bán chuyên",
  ];
  const categories = [
    { key: "MEN_SINGLE", value: "Đơn Nam" },
    { key: "WOMEN_SINGLE", value: "Đơn Nữ" },
    { key: "MEN_DOUBLE", value: "Đôi Nam" },
    { key: "WOMEN_DOUBLE", value: "Đôi Nữ" },
    { key: "MIXED_DOUBLE", value: "Đôi Nam Nữ" },
  ];
  const statusOptions = [
    { key: "OPEN", value: "Đang mở", color: "emerald" },
    { key: "ONGOING", value: "Sắp diễn ra", color: "blue" },
    { key: "FINISHED", value: "Đã kết thúc", color: "gray" },
    { key: "CLOSED", value: "Đã đóng", color: "orange" },
    { key: "CANCELLED", value: "Đã hủy", color: "red" },
  ];
  const quickTimeFilters = [
    { key: "urgent", value: "Tuyển gấp" },
    { key: "today", value: "Hôm nay" },
    { key: "weekend", value: "Cuối tuần" },
    { key: "week", value: "Tuần này" },
  ];
  const quickSizeFilters = [
    { key: "NHO", value: "Nhóm nhỏ", desc: "<10 người" },
    { key: "VUA", value: "Vừa", desc: "10-20 người" },
    { key: "DONG", value: "Đông", desc: ">20 người" },
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

  useEffect(() => {
    const fetchWards = async () => {
      if (!selectedProvince) {
        setWards([]);
        return;
      }
      setLoadingWards(true);
      try {
        const response =
          await addressApiRequest.getWardsByProvinceId(selectedProvince);
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

  useEffect(() => {
    const fetchFacilities = async () => {
      setLoadingFacilities(true);
      try {
        const response = await facilityApiRequest.getAllFacilitiesFilter();
        setFacilities(response.payload.data || []);
      } catch (error) {
        console.error("Error fetching facilities:", error);
        setFacilities([]);
      } finally {
        setLoadingFacilities(false);
      }
    };
    fetchFacilities();
  }, []);

  const handleLevelToggle = useCallback((level: string) => {
    setSelectedLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level],
    );
  }, []);

  const handleCategoryToggle = useCallback((key: string) => {
    setSelectedCategories((prev) =>
      prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key],
    );
  }, []);

  const handleStatusToggle = useCallback((status: string) => {
    setSelectedStatus((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status],
    );
  }, []);

  const handleQuickTimeFilter = useCallback((filter: string) => {
    setQuickTime((prevQuickTime) => {
      const newQuickTime = prevQuickTime === filter ? "" : filter;
      if (filter !== prevQuickTime) {
        setDateRange({ start: "", end: "" });
      }
      return newQuickTime;
    });
  }, []);

  const handleQuickSizeFilter = useCallback((filter: string) => {
    setQuickSizeFilter((prevFilter) => (prevFilter === filter ? "" : filter));
  }, []);

  const clearAllFilters = useCallback(() => {
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
    setSelectedFacilities([]);
    setSelectedStatus([]);
    if (searchInputRef.current) {
      searchInputRef.current.value = "";
    }
  }, []);

  const activeFilterCount = useMemo(() => {
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
    if (selectedFacilities.length > 0) count++;
    if (selectedStatus.length > 0) count++;
    return count;
  }, [
    searchValue,
    selectedProvince,
    selectedWard,
    dateRange,
    quickTime,
    feeRange,
    freeOnly,
    selectedLevels,
    selectedCategories,
    quickSizeFilter,
    minRating,
    selectedFacilities,
    selectedStatus,
  ]);

  const handleApplyFilters = useCallback(() => {
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
        dayjs(dateRange.start, "DD/MM/YYYY HH:mm").format(
          "YYYY-MM-DDTHH:mm:ss",
        ),
      );
    if (dateRange.end)
      params.append(
        "endDate",
        dayjs(dateRange.end, "DD/MM/YYYY HH:mm").format("YYYY-MM-DDTHH:mm:ss"),
      );

    if (selectedLevels.length > 0)
      params.append("levels", selectedLevels.join(","));
    if (selectedCategories.length > 0)
      params.append("categories", selectedCategories.join(","));
    if (quickSizeFilter) params.append("participantSize", quickSizeFilter);
    if (minRating > 0) params.append("minRating", String(minRating));
    if (selectedFacilities.length > 0) {
      const facilityNames = selectedFacilities
        .map((id) => {
          const facility = facilities.find((f) => f.id === id);
          return facility ? facility.name : "";
        })
        .filter(Boolean);
      params.append("facilityNames", facilityNames.join(","));
    }
    if (selectedStatus.length > 0)
      params.append("status", selectedStatus.join(","));

    router.push(`/events${params.toString() ? `?${params.toString()}` : ""}`);
  }, [
    provinces,
    selectedProvince,
    wards,
    selectedWard,
    searchValue,
    quickTime,
    freeOnly,
    feeRange,
    dateRange,
    selectedLevels,
    selectedCategories,
    quickSizeFilter,
    minRating,
    selectedFacilities,
    facilities,
    selectedStatus,
    router,
  ]);

  return (
    <div className="w-full mb-6">
      <Card className="w-full bg-white dark:bg-gray-800 border-0 p-0 gap-0 shadow-md rounded-xl overflow-hidden">
        {/* Header with Gradient */}
        <div
          className="relative flex items-center justify-between px-6 py-4 cursor-pointer bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Filter className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                Bộ lọc
                {activeFilterCount > 0 && (
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                    {activeFilterCount}
                  </span>
                )}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                Lọc và tìm kiếm hoạt động phù hợp
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  clearAllFilters();
                }}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="h-4 w-4 mr-1" />
                Xóa tất cả
              </Button>
            )}
            {isFilterOpen ? (
              <ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            )}
          </div>
        </div>

        {/* Filter Content */}
        {isFilterOpen && (
          <div className="p-6 space-y-6 bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-gray-800 dark:to-gray-900">
            {/* Search Bar - Prominent */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                ref={searchInputRef}
                defaultValue={searchValue}
                onChange={(e) => {
                  const value = e.target.value;
                  const timeoutId = setTimeout(() => {
                    setSearchValue(value);
                  }, 500);
                  return () => clearTimeout(timeoutId);
                }}
                placeholder="Tìm kiếm theo tên, địa điểm, câu lạc bộ..."
                className="w-full pl-10 pr-4 py-3 border-2 border-transparent rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 shadow-md focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50 transition-all"
              />
            </div>

            {/* Quick Filters Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {quickTimeFilters.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => handleQuickTimeFilter(filter.key)}
                  className={`p-2 rounded-lg border transition-all ${
                    quickTime === filter.key
                      ? "bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300"
                      : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <div className="text-xs font-medium">{filter.value}</div>
                </button>
              ))}
            </div>

            {/* Main Filters - Cards Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {/* Location Card */}
              <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-md border border-gray-100 dark:border-gray-600">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <MapPin className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                    Địa điểm
                  </h4>
                </div>
                <div className="space-y-2">
                  <select
                    value={selectedProvince}
                    onChange={(e) => {
                      setSelectedProvince(e.target.value);
                      setSelectedWard("");
                    }}
                    disabled={loadingProvinces}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all disabled:opacity-50"
                  >
                    <option value="">Chọn tỉnh/thành phố</option>
                    {provinces.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.full_name}
                      </option>
                    ))}
                  </select>
                  {selectedProvince && (
                    <select
                      value={selectedWard}
                      onChange={(e) => setSelectedWard(e.target.value)}
                      disabled={loadingWards}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all disabled:opacity-50"
                    >
                      <option value="">Chọn quận/huyện</option>
                      {wards.map((w) => (
                        <option key={w.id} value={w.id}>
                          {w.full_name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              {/* Time Card */}
              <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-md border border-gray-100 dark:border-gray-600">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Calendar className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                    Khoảng thời gian
                  </h4>
                </div>
                <RangePicker
                  className="w-full dark:bg-gray-800"
                  value={
                    dateRange.start && dateRange.end
                      ? [
                          dayjs(dateRange.start, "DD/MM/YYYY HH:mm"),
                          dayjs(dateRange.end, "DD/MM/YYYY HH:mm"),
                        ]
                      : undefined
                  }
                  onChange={(dates, dateStrings) => {
                    setDateRange({
                      start: dateStrings[0] || "",
                      end: dateStrings[1] || "",
                    });
                    setQuickTime("");
                  }}
                  placeholder={["Từ ngày", "Đến ngày"]}
                  showTime={true}
                  format="DD/MM/YYYY HH:mm"
                />
              </div>

              {/* Fee Card */}
              <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-md border border-gray-100 dark:border-gray-600">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                    <DollarSign className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                    Phí tham gia
                  </h4>
                </div>
                <label className="flex items-center gap-2 mb-3 p-2 rounded-lg cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={freeOnly}
                    onChange={(e) => setFreeOnly(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500"
                  />
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    Miễn phí
                  </span>
                </label>
                <div className="px-2">
                  <Slider
                    range
                    min={0}
                    max={500}
                    value={[feeRange.min, feeRange.max]}
                    onChange={(value) =>
                      setFeeRange({ min: value[0], max: value[1] })
                    }
                    styles={{
                      track: { background: "#10b981" },
                      tracks: { background: "#10b981" },
                    }}
                  />
                  <div className="flex justify-between mt-2">
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs font-semibold text-gray-700 dark:text-gray-300">
                      {feeRange.min}K VNĐ
                    </span>
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs font-semibold text-gray-700 dark:text-gray-300">
                      {feeRange.max}K VNĐ
                    </span>
                  </div>
                </div>
              </div>

              {/* Facility Card with Select */}
              <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-md border border-gray-100 dark:border-gray-600">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                    <Building2 className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                    Sân vận động
                  </h4>
                </div>
                <Select
                  mode="multiple"
                  showSearch
                  loading={loadingFacilities}
                  placeholder="Tìm và chọn sân"
                  value={selectedFacilities}
                  onChange={setSelectedFacilities}
                  style={{ width: "100%" }}
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  optionRender={(option) => {
                    const facility = facilities.find(
                      (f) => f.id === option.value,
                    );
                    return (
                      <div className="flex items-center gap-2">
                        {facility?.image && (
                          <div className="w-10 h-10 relative overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg">
                            <Image
                              src={facility.image}
                              alt={facility.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <span>{facility?.name}</span>
                      </div>
                    );
                  }}
                  options={facilities.map((facility) => ({
                    value: facility.id,
                    label: facility.name,
                  }))}
                  className="dark:bg-gray-800"
                  maxTagCount={2}
                />
              </div>
            </div>

            {/* Categories Section */}
            <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-md border border-gray-100 dark:border-gray-600">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
                  <Award className="h-3.5 w-3.5 text-pink-600 dark:text-pink-400" />
                </div>
                <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                  Hạng mục thi đấu
                </h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => handleCategoryToggle(cat.key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                      selectedCategories.includes(cat.key)
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border border-transparent"
                    }`}
                  >
                    {selectedCategories.includes(cat.key) && (
                      <Check className="inline h-3 w-3 mr-1" />
                    )}
                    {cat.value}
                  </button>
                ))}
              </div>
            </div>

            {/* Levels & Size */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Levels */}
              <div className="bg-white dark:bg-gray-700 rounded-xl p-5 shadow-md border border-gray-100 dark:border-gray-600">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                    <Star className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                    Trình độ
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {levels.map((level) => (
                    <button
                      key={level}
                      onClick={() => handleLevelToggle(level)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedLevels.includes(level)
                          ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border border-transparent"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div className="bg-white dark:bg-gray-700 rounded-xl p-5 shadow-md border border-gray-100 dark:border-gray-600">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg">
                    <Users className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                    Quy mô
                  </h4>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {quickSizeFilters.map((filter) => (
                    <button
                      key={filter.key}
                      onClick={() => handleQuickSizeFilter(filter.key)}
                      className={`p-3 rounded-lg text-center transition-all border ${
                        quickSizeFilter === filter.key
                          ? "bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300"
                          : "bg-gray-100 dark:bg-gray-800 border-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                      }`}
                    >
                      <div className="font-semibold text-sm">
                        {filter.value}
                      </div>
                      <div
                        className={`text-xs mt-1 ${
                          quickSizeFilter === filter.key
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {filter.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Rating & Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Rating */}
              <div className="bg-white dark:bg-gray-700 rounded-xl p-5 shadow-md border border-gray-100 dark:border-gray-600">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                    <Star className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                    Đánh giá tối thiểu
                  </h4>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() =>
                          setMinRating(star === minRating ? 0 : star)
                        }
                        className={`p-2 transition-all hover:scale-110 ${
                          star <= minRating
                            ? "text-yellow-400"
                            : "text-gray-300 dark:text-gray-600"
                        }`}
                      >
                        <Star className="h-7 w-7 fill-current" />
                      </button>
                    ))}
                  </div>
                  <span className="px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg text-sm font-semibold text-yellow-700 dark:text-yellow-300">
                    {minRating > 0 ? `${minRating}+ sao` : "Tất cả"}
                  </span>
                </div>
              </div>

              {/* Status */}
              <div className="bg-white dark:bg-gray-700 rounded-xl p-5 shadow-md border border-gray-100 dark:border-gray-600">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
                    <Clock className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                    Trạng thái
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map((status) => (
                    <button
                      key={status.key}
                      onClick={() => handleStatusToggle(status.key)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                        selectedStatus.includes(status.key)
                          ? `bg-${status.color}-500 text-white shadow-md scale-105`
                          : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                    >
                      {selectedStatus.includes(status.key) && (
                        <Check className="h-3.5 w-3.5" />
                      )}
                      {status.value}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Apply Button - Sticky */}
            <div className="sticky bottom-0 pt-6 -mx-6 -mb-6 px-6 pb-6 bg-gradient-to-t from-white via-white dark:from-gray-800 dark:via-gray-800 to-transparent">
              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    clearAllFilters();
                    router.push("/events");
                    setIsFilterOpen(false);
                  }}
                  variant="outline"
                  className="flex-1 py-6 text-base font-semibold border-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X className="h-5 w-5 mr-2" />
                  Xóa bộ lọc
                </Button>
                <Button
                  onClick={handleApplyFilters}
                  className="flex-[2] py-6 text-base font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
                >
                  <Search className="h-5 w-5 mr-2" />
                  Tìm kiếm
                  {activeFilterCount > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-white/30 rounded-full text-sm">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
