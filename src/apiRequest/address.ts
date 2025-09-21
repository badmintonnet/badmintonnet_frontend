import http from "@/lib/http";
import {
  ProvinceResponseType,
  WardResponseType,
} from "@/schemaValidations/address.schema";

const addressApiRequest = {
  // Lấy danh sách Tỉnh/Thành
  getProvinces: async () => {
    return await http.get<ProvinceResponseType>("/address/provinces");
  },

  getWardsByProvinceId: async (provinceId: string) => {
    return await http.get<WardResponseType>(`/address/wards/${provinceId}`);
  },
};

export default addressApiRequest;
