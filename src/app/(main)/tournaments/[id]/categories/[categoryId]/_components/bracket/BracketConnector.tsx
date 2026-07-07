// SVG connector drawn between two adjacent bracket rounds.
// Math-based positioning — no DOM measurement.
// Constants must match the values used in BracketRound / BracketMatchCard.
const CARD_H = 88; // px — min-h-[88px] on each BracketMatchCard
const CARD_GAP = 12; // px — gap-3 (12px) between cards in BracketRound
const COL_W = 40; // px — width of this SVG element
const HALF = COL_W / 2;

function cardCenter(index: number): number {
  return index * (CARD_H + CARD_GAP) + CARD_H / 2;
}

interface Props {
  /** Number of matches in the current (left-hand) round. */
  matchCount: number;
}

export default function BracketConnector({ matchCount }: Props) {
  const pairs = Math.floor(matchCount / 2);
  const svgH = matchCount * CARD_H + (matchCount - 1) * CARD_GAP;

  const d = Array.from({ length: pairs }, (_, j) => {
    const y1 = cardCenter(2 * j);
    const y2 = cardCenter(2 * j + 1);
    const mid = (y1 + y2) / 2;
    // top arm → vertical bar → bottom arm, then mid → right
    return `M 0 ${y1} H ${HALF} M 0 ${y2} H ${HALF} M ${HALF} ${y1} V ${y2} M ${HALF} ${mid} H ${COL_W}`;
  }).join(" ");

  return (
    <svg
      width={COL_W}
      height={svgH}
      className="shrink-0 self-start mt-[2.25rem]"
      aria-hidden="true"
    >
      <path d={d} fill="none" strokeWidth="1.5" className="stroke-border" />
    </svg>
  );
}
