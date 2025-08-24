export const defaultFootballRules = {
  TOURNAMENT: {
    eventFormat: {
      thể_thức: "Loại trực tiếp",
      số_người_mỗi_đội: 11,
      thời_lượng_trận: 90,
      số_đội_tối_đa: 16,
    },
    sportRule: {
      việt_vị: true,
      phạm_lỗi: true,
      số_lần_thay_người: 3,
      có_hiệp_phụ: true,
      đá_luân_lưu: true,
    },
  },
  TRAINING: {
    eventFormat: {
      quy_mô_nhóm: 10,
      thời_lượng_buổi_tập: 60,
      số_buổi_mỗi_tuần: 2,
    },
    sportRule: {
      trọng_tâm: "Kỹ thuật cách sút bóng",
      dụng_cụ: "Cơ bản",
      có_thay_người: true,
    },
  },
  CLUB_ACTIVITY: {
    eventFormat: {
      số_người_mỗi_đội: 11,
      thời_lượng_trận: 90,
      giao_hữu: true,
      số_đội_tối_đa: 2,
    },
    sportRule: {
      việt_vị: false,
      phạm_lỗi: true,
      số_lần_thay_người: 5,
      ăn_mừng_bàn_thắng: true,
    },
  },
};

export const defaultBadmintonRules = {
  TOURNAMENT: {
    eventFormat: {
      nội_dung: "Đơn",
      đánh_theo_set: 3,
      điểm_mỗi_set: 21,
      số_người_tối_đa: 32,
    },
    sportRule: {
      luật_phát_cầu: "Luật mới",
      hệ_thống_tính_điểm: "rally",
      loại_cầu: "Hải Yến S90",
      có_thời_gian_nghỉ: true,
    },
  },
  TRAINING: {
    eventFormat: {
      quy_mô_nhóm: 8,
      thời_lượng_buổi_tập: 60,
      số_buổi_mỗi_tuần: 2,
    },
    sportRule: {
      trọng_tâm: "Bộ pháp cơ bản",
      dụng_cụ: "Vợt",
      hệ_thống_tính_điểm: "rally",
    },
  },
  CLUB_ACTIVITY: {
    eventFormat: { loại_trận: "Đôi", giao_hữu: true, số_người_tối_đa: 16 },
    sportRule: {
      luật_phát_cầu: "Luật mới",
      hệ_thống_tính_điểm: "rally",
      có_thời_gian_nghỉ: true,
      hoạt_động_giải_trí: true,
    },
  },
};
