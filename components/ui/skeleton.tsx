
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden bg-muted rounded ${className ?? ""}`}
    >
      <span
        className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent"
        style={{
          backgroundSize: "200% 100%",
          backgroundPosition: "left center",
        }}
      />
    </div>
  );
}
