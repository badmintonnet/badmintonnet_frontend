"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";

/**
 * Vẽ đường nối "khuỷu" (elbow) giữa các vòng của bracket loại trực tiếp bằng cách
 * ĐO vị trí thật của từng card trong DOM (không giả định chiều cao cố định).
 *
 * Cách dùng:
 *  - Gắn `containerRef` vào phần tử flex chứa các cột vòng (phần tử cuộn ngang bên trong).
 *  - Mỗi card thêm thuộc tính: data-bracket-card, data-bracket-round={r}, data-bracket-index={i}
 *    (index tính theo thứ tự tie/match trong vòng, bắt đầu từ 0).
 *  - Render `<svg>` overlay với `paths` và kích thước `size`.
 *
 * Ghép cặp: winner của tie/match index 2k và 2k+1 ở vòng r đi vào slot index k ở vòng r+1
 * (đúng slotting của bracket + advanceClubTie ở backend).
 */
export function useBracketConnectors(revision: unknown) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [paths, setPaths] = useState("");
  const [size, setSize] = useState({ w: 0, h: 0 });
  const rafRef = useRef<number | null>(null);

  const recompute = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const crect = container.getBoundingClientRect();

    const cards = Array.from(
      container.querySelectorAll<HTMLElement>("[data-bracket-card]"),
    );
    const byRound = new Map<number, HTMLElement[]>();
    for (const el of cards) {
      const r = Number(el.dataset.bracketRound ?? "0");
      const list = byRound.get(r) ?? [];
      list.push(el);
      byRound.set(r, list);
    }
    // Sắp xếp mỗi vòng theo index để ghép cặp đúng
    for (const list of byRound.values()) {
      list.sort(
        (a, b) =>
          Number(a.dataset.bracketIndex ?? "0") -
          Number(b.dataset.bracketIndex ?? "0"),
      );
    }

    const roundKeys = [...byRound.keys()].sort((a, b) => a - b);
    let d = "";
    for (let i = 0; i < roundKeys.length - 1; i++) {
      const src = byRound.get(roundKeys[i]) ?? [];
      const dst = byRound.get(roundKeys[i + 1]) ?? [];
      dst.forEach((tgt, k) => {
        const t = tgt.getBoundingClientRect();
        const tx = t.left - crect.left;
        const tyc = t.top - crect.top + t.height / 2;
        const midX = tx - 18; // điểm gấp khuỷu nằm trong khoảng trống giữa 2 vòng
        for (const s of [src[2 * k], src[2 * k + 1]]) {
          if (!s) continue;
          const sb = s.getBoundingClientRect();
          const sx = sb.right - crect.left;
          const syc = sb.top - crect.top + sb.height / 2;
          d += `M ${sx.toFixed(1)} ${syc.toFixed(1)} H ${midX.toFixed(1)} V ${tyc.toFixed(1)} H ${tx.toFixed(1)} `;
        }
      });
    }

    setSize({ w: container.scrollWidth, h: container.scrollHeight });
    setPaths(d);
  }, []);

  const schedule = useCallback(() => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => recompute());
  }, [recompute]);

  useLayoutEffect(() => {
    schedule();
    const container = containerRef.current;
    if (!container) return;

    const ro = new ResizeObserver(() => schedule());
    ro.observe(container);
    container
      .querySelectorAll("[data-bracket-card]")
      .forEach((el) => ro.observe(el));

    window.addEventListener("resize", schedule);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", schedule);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
    // revision thay đổi khi dữ liệu bracket đổi → đo lại
  }, [schedule, revision]);

  return { containerRef, paths, size, recompute: schedule };
}
