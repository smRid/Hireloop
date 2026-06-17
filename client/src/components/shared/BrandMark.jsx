/* ── Geometric diamond mark ──────────────────────────────────────── */
export default function BrandMark() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
      style={{
        "--mark-top": "var(--primary)",
        "--mark-bottom": "var(--ring)",
      }}
    >
      {/* Square rotated 45° — top half: brand teal (--primary) */}
      <rect
        x="3"
        y="3"
        width="14"
        height="14"
        rx="1"
        transform="rotate(45 10 10)"
        fill="var(--mark-top)"
      />
      {/* Bottom-half darker teal — diagonal split via clipPath */}
      <clipPath id="brand-mark-bottom">
        <rect x="0" y="10" width="20" height="10" />
      </clipPath>
      <rect
        x="3"
        y="3"
        width="14"
        height="14"
        rx="1"
        transform="rotate(45 10 10)"
        fill="var(--mark-bottom)"
        style={{ opacity: 0.65 }}
        clipPath="url(#brand-mark-bottom)"
      />
    </svg>
  );
}
