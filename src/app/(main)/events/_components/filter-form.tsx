"use client";

import { useState, useEffect } from "react";
import { Search, MapPin, ChevronDown } from "lucide-react";
import addressApiRequest from "@/apiRequest/address";

interface Province {
  id: string;
  full_name: string;
}

interface Ward {
  id: string;
  full_name: string;
}

interface FilterFormProps {
  searchQuery?: string;
  provinceId?: string;
  wardId?: string;
}

export default function FilterForm({
  searchQuery = "",
  provinceId = "",
  wardId = "",
}: FilterFormProps) {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [selectedProvinceId, setSelectedProvinceId] = useState(provinceId);
  const [selectedWardId, setSelectedWardId] = useState(wardId);
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(true);
  const [isLoadingWards, setIsLoadingWards] = useState(false);
  const [searchValue, setSearchValue] = useState(searchQuery);

  // Load danh sách tỉnh thành khi component mount
  useEffect(() => {
    const loadProvinces = async () => {
      try {
        const response = await addressApiRequest.getProvinces();
        console.log("Provinces response:", response);
        setProvinces(response.payload.data.data || []);
      } catch (error) {
        console.error("Error loading provinces:", error);
      } finally {
        setIsLoadingProvinces(false);
      }
    };

    loadProvinces();
  }, []);

  // Load danh sách phường xã khi tỉnh thành thay đổi
  useEffect(() => {
    const loadWards = async () => {
      if (!selectedProvinceId) {
        setWards([]);
        setSelectedWardId("");
        return;
      }

      setIsLoadingWards(true);
      try {
        const response = await addressApiRequest.getWardsByProvinceId(
          selectedProvinceId
        );
        setWards(response.payload.data.data || []);
        setSelectedWardId("");
      } catch (error) {
        console.error("Error loading wards:", error);
        setWards([]);
      } finally {
        setIsLoadingWards(false);
      }
    };

    loadWards();
  }, [selectedProvinceId]);

  useEffect(() => {
    if (provinceId && provinceId !== selectedProvinceId) {
      setSelectedProvinceId(provinceId);
    }
  }, [provinceId]);

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProvinceId(e.target.value);
  };

  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedWardId(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (searchValue.trim()) params.append("search", searchValue.trim());
    if (selectedProvinceId) params.append("provinceId", selectedProvinceId);
    if (selectedWardId) params.append("wardId", selectedWardId);

    const url = `/events${params.toString() ? `?${params.toString()}` : ""}`;
    // window.location.href = url;
  };

  const clearFilters = () => {
    setSearchValue("");
    setSelectedProvinceId("");
    setSelectedWardId("");
    setWards([]);
  };

  return (
    <div className="mb-6 w-full mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-4">
          {/* Header - Compact */}
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
              Tìm kiếm hoạt động
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Khám phá các hoạt động thú vị trong khu vực của bạn
            </p>
          </div>

          {/* Search Input - Compact */}
          <div className="mb-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400 group-focus-within:text-blue-500 dark:group-focus-within:text-emerald-500 transition-colors duration-200" />
              </div>
              <input
                type="text"
                name="search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Tìm kiếm theo tên hoạt động, địa điểm..."
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-emerald-500 focus:border-transparent focus:bg-white dark:focus:bg-gray-800 transition-all duration-200 text-sm"
              />
            </div>
          </div>

          {/* Location Filters - More Compact */}
          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                Lọc theo địa điểm
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {/* Province Select - Compact */}
              <div className="relative">
                <select
                  value={selectedProvinceId}
                  onChange={handleProvinceChange}
                  disabled={isLoadingProvinces}
                  className="appearance-none block w-full px-3 py-2.5 pr-8 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-emerald-500 focus:border-transparent focus:bg-white dark:focus:bg-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  <option value="">
                    {isLoadingProvinces ? "Đang tải..." : "Chọn tỉnh thành"}
                  </option>
                  {provinces.map((province) => (
                    <option key={province.id} value={province.id}>
                      {province.full_name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              </div>

              {/* Ward Select - Compact */}
              {selectedProvinceId && (
                <div className="relative animate-in slide-in-from-top-2 duration-300">
                  <select
                    value={selectedWardId}
                    onChange={handleWardChange}
                    disabled={isLoadingWards}
                    className="appearance-none block w-full px-3 py-2.5 pr-8 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-emerald-500 focus:border-transparent focus:bg-white dark:focus:bg-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    <option value="">
                      {isLoadingWards
                        ? "Đang tải..."
                        : "Chọn phường xã (tùy chọn)"}
                    </option>
                    {wards.map((ward) => (
                      <option key={ward.id} value={ward.id}>
                        {ward.full_name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons - Compact */}
          <div className="flex flex-col sm:flex-row gap-2 justify-between items-center">
            <button
              type="button"
              onClick={clearFilters}
              className="w-full sm:w-auto px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium transition-colors duration-200 underline underline-offset-4 hover:no-underline"
            >
              Xóa bộ lọc
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 focus:ring-4 focus:ring-blue-200 dark:focus:ring-emerald-200 focus:outline-none text-sm"
            >
              <span className="flex items-center justify-center gap-2">
                <Search className="h-4 w-4" />
                Tìm kiếm
              </span>
            </button>
          </div>

          {/* Active Filters Display - Compact */}
          {(searchValue || selectedProvinceId || selectedWardId) && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap gap-1.5 items-center">
                <span className="text-xs text-gray-600 dark:text-gray-400 mr-2">
                  Bộ lọc:
                </span>
                {searchValue && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                    {searchValue}
                  </span>
                )}
                {selectedProvinceId && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                    {
                      provinces.find((p) => p.id === selectedProvinceId)
                        ?.full_name
                    }
                  </span>
                )}
                {selectedWardId && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                    {wards.find((w) => w.id === selectedWardId)?.full_name}
                  </span>
                )}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
