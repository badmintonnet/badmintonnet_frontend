"use client";

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
  Filter,
  X,
  Check,
  Star,
  Building2,
} from "lucide-react";
import { Select } from "antd";
import addressApiRequest from "@/apiRequest/address";
import { useRouter } from "next/navigation";
import Image from "next/image";
import facilityApiRequest from "@/apiRequest/facility";
import { FacilityType } from "@/schemaValidations/event.schema";

interface Province {
  id: string;
  full_name: string;
}

interface Ward {
  id: string;
  full_name: string;
}

interface ClubFilterProps {
  searchQuery?: string;
  province?: string;
  ward?: string;
  selectedLevels?: string[];
  reputationSort?: string;
  facilityNames?: string[];
}

export default function ClubFilterForm({
  searchQuery = "",
  province = "",
  ward = "",
  selectedLevels = [],
  reputationSort = "",
  facilityNames = [],
}: ClubFilterProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchValue, setSearchValue] = useState(searchQuery);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState(province);
  const [selectedWard, setSelectedWard] = useState(ward);
  const [levels, setLevels] = useState<string[]>(selectedLevels);
  const [sortReputation, setSortReputation] = useState(reputationSort);
  const [selectedFacilities, setSelectedFacilities] =
    useState<string[]>(facilityNames);

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);

  // Facilities
  const [facilities, setFacilities] = useState<FacilityType[]>([]);
  const [loadingFacilities, setLoadingFacilities] = useState(false);

  const levelOptions = [
    "Mới bắt đầu",
    "Trung bình",
    "Khá",
    "Nâng cao",
    "Chuyên nghiệp",
  ];

  const reputationOptions = [
    {
      key: "asc",
      value: "Thấp đến cao",
      icon: ChevronUp,
    },
    {
      key: "desc",
      value: "Cao đến thấp",
      icon: ChevronDown,
    },
  ];

  // Fetch facilities data
  useEffect(() => {
    const fetchFacilities = async () => {
      setLoadingFacilities(true);
      try {
        const response = await facilityApiRequest.getAllFacilitiesFilter();
        setFacilities(response.payload.data || []);
      } catch (error) {
        console.error("Error fetching facilities:", error);
      } finally {
        setLoadingFacilities(false);
      }
    };

    fetchFacilities();
  }, []);

  // Fetch provinces
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

  // Fetch wards when province changes
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

  const handleLevelToggle = useCallback((level: string) => {
    setLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level],
    );
  }, []);

  const clearAllFilters = useCallback(() => {
    setSearchValue("");
    setSelectedProvince("");
    setSelectedWard("");
    setWards([]);
    setLevels([]);
    setSortReputation("");
    setSelectedFacilities([]);
    if (searchInputRef.current) {
      searchInputRef.current.value = "";
    }
  }, []);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchValue) count++;
    if (selectedProvince) count++;
    if (selectedWard) count++;
    if (levels.length > 0) count++;
    if (sortReputation) count++;
    if (selectedFacilities.length > 0) count++;
    return count;
  }, [
    searchValue,
    selectedProvince,
    selectedWard,
    levels,
    sortReputation,
    selectedFacilities,
  ]);

  const router = useRouter();

  const handleApplyFilters = useCallback(() => {
    const provinceSelected = provinces.find((p) => p.id === selectedProvince);
    const wardSelected = wards.find((w) => w.id === selectedWard);

    const params = new URLSearchParams();

    if (searchValue.trim()) params.append("search", searchValue.trim());
    if (selectedProvince)
      params.append("province", provinceSelected?.full_name || "");
    if (selectedWard) params.append("ward", wardSelected?.full_name || "");
    if (levels.length > 0) params.append("levels", levels.join(","));
    if (sortReputation) params.append("reputationSort", sortReputation);
    if (selectedFacilities.length > 0)
      params.append("facilityNames", selectedFacilities.join(","));

    router.push(`/clubs?${params.toString()}`);
    setIsFilterOpen(false);
  }, [
    provinces,
    selectedProvince,
    wards,
    selectedWard,
    searchValue,
    levels,
    sortReputation,
    selectedFacilities,
    router,
  ]);

  return (
    <div className="w-full mb-6">
      <div className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md rounded-lg overflow-hidden">
        {/* Header */}
        <div
          className="relative flex items-center justify-between px-4 py-3 cursor-pointer bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-md">
              <Filter className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                Bộ lọc
                {activeFilterCount > 0 && (
                  <span className="px-1.5 py-0.5 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                    {activeFilterCount}
                  </span>
                )}
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {activeFilterCount > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearAllFilters();
                }}
                className="px-2 py-1 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors flex items-center gap-1"
              >
                <X className="h-3 w-3" />
                Xóa
              </button>
            )}
            {isFilterOpen ? (
              <ChevronUp className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            )}
          </div>
        </div>

        {/* Filter Content */}
        {isFilterOpen && (
          <div className="p-4 space-y-4 bg-gray-50 dark:bg-gray-800/50">
            {/* Search Bar */}
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
                  setTimeout(() => setSearchValue(value), 500);
                }}
                placeholder="Tìm kiếm cơ sở..."
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50 transition-all"
              />
            </div>

            {/* Main Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Location Card */}
              <div className="bg-white dark:bg-gray-700 rounded-lg p-3.5 shadow-sm border border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded">
                    <MapPin className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
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
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all disabled:opacity-50"
                  >
                    <option value="">Tỉnh/thành phố</option>
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
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all disabled:opacity-50"
                    >
                      <option value="">Quận/huyện</option>
                      {wards.map((w) => (
                        <option key={w.id} value={w.id}>
                          {w.full_name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              {/* Facility Names */}
              <div className="bg-white dark:bg-gray-700 rounded-lg p-3.5 shadow-sm border border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1 bg-indigo-100 dark:bg-indigo-900/30 rounded">
                    <Building2 className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Sân vận động
                  </h4>
                </div>
                <Select
                  mode="multiple"
                  showSearch
                  placeholder="Tìm và chọn sân"
                  value={selectedFacilities}
                  onChange={setSelectedFacilities}
                  style={{ width: "100%" }}
                  size="middle"
                  loading={loadingFacilities}
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={facilities.map((facility) => ({
                    value: facility.name,
                    label: facility.name,
                  }))}
                  optionRender={(option) => {
                    const facility = facilities.find(
                      (f) => f.name === option.value,
                    );
                    return (
                      <div className="flex items-center gap-2">
                        {facility?.image && (
                          <div className="w-9 h-9 relative overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg">
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
                  className="dark:bg-gray-800"
                  maxTagCount={2}
                />
              </div>

              {/* Reputation Sort */}
              <div className="bg-white dark:bg-gray-700 rounded-lg p-3.5 shadow-sm border border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1 bg-yellow-100 dark:bg-yellow-900/30 rounded">
                    <Star className="h-3.5 w-3.5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Uy tín
                  </h4>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {reputationOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.key}
                        onClick={() =>
                          setSortReputation(
                            sortReputation === option.key ? "" : option.key,
                          )
                        }
                        className={`p-2 rounded-md border text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                          sortReputation === option.key
                            ? "bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300"
                            : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        {option.value}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="bg-white dark:bg-gray-700 rounded-lg p-3.5 shadow-sm border border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1 bg-amber-100 dark:bg-amber-900/30 rounded">
                    <Star className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Trình độ
                  </h4>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {levelOptions.map((level) => (
                    <button
                      key={level}
                      onClick={() => handleLevelToggle(level)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                        levels.includes(level)
                          ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700"
                          : "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600"
                      }`}
                    >
                      {levels.includes(level) && (
                        <Check className="inline h-3 w-3 mr-0.5" />
                      )}
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Apply Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  clearAllFilters();
                  setIsFilterOpen(false);
                  router.push("/clubs");
                }}
                className="flex-1 py-2.5 px-3 text-sm font-medium border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-all flex items-center justify-center gap-1.5"
              >
                <X className="h-4 w-4" />
                Xóa bộ lọc
              </button>
              <button
                onClick={() => {
                  handleApplyFilters();
                }}
                className="flex-[2] py-2.5 px-3 text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5"
              >
                <Search className="h-4 w-4" />
                Tìm kiếm
                {activeFilterCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded-full text-xs">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
