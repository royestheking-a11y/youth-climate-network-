import { Skeleton } from './skeleton';

export function CarouselSkeleton() {
  return (
    <section className="relative w-full h-[85svh] sm:h-[90svh] min-h-[580px] sm:min-h-[640px] flex items-center justify-center bg-[#072416] p-4 sm:p-8 pt-24 sm:pt-32 pb-8 sm:pb-16 overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #051C12 0%, #0A3320 50%, #0D3E27 100%)' }} />
      <div className="relative z-10 w-full h-full max-w-[1440px] mx-auto rounded-3xl overflow-hidden bg-white/5 border border-white/10 animate-pulse flex flex-col justify-end p-8 sm:p-14">
        <Skeleton className="h-6 w-48 rounded-full bg-white/10 mb-4" />
        <Skeleton className="h-12 sm:h-16 w-3/4 max-w-2xl rounded-2xl bg-white/10 mb-4" />
        <Skeleton className="h-6 w-1/2 max-w-xl rounded-xl bg-white/10 mb-6" />
        <div className="flex gap-4">
          <Skeleton className="h-12 w-40 rounded-full bg-white/10" />
          <Skeleton className="h-12 w-36 rounded-full bg-white/10" />
        </div>
      </div>
    </section>
  );
}

export function CardSkeleton() {
  return (
    <div className="flex flex-col gap-3 h-full">
      <Skeleton className="w-full aspect-[4/3] sm:aspect-video rounded-2xl" />
      <div className="px-1 flex flex-col gap-2 flex-1">
        <Skeleton className="h-6 w-3/4 rounded" />
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-5/6 rounded" />
      </div>
    </div>
  );
}

export function MediaSkeleton() {
  return (
    <Skeleton className="w-full aspect-[4/3] rounded-2xl" />
  );
}

export function VideoSkeleton() {
  return (
    <div className="flex flex-col gap-3 h-full bg-white rounded-2xl overflow-hidden shadow-sm">
      <Skeleton className="w-full aspect-[16/9] rounded-none" />
      <div className="p-4 flex flex-col gap-2">
        <Skeleton className="h-4 w-1/3 rounded-full" />
        <Skeleton className="h-5 w-full rounded" />
      </div>
    </div>
  );
}
