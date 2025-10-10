export default function HomeSkeleton() {
  return Array.from({ length: 8 }, (_, index) => (
    <div
      key={`skeleton-${index}`}
      className="flex animate-pulse flex-col gap-3"
    >
      <div className="bg-muted aspect-[4/3] w-full rounded-3xl" />
      <div className="bg-muted h-4 w-3/4 rounded-full" />
      <div className="bg-muted h-3 w-1/2 rounded-full" />
      <div className="bg-muted h-3 w-1/3 rounded-full" />
    </div>
  ));
}
