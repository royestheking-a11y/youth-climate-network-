import { Skeleton } from './skeleton';

export function CarouselSkeleton() {
  return (
    <section className="relative w-full h-[80svh] sm:h-[90svh] min-h-[480px] sm:min-h-[600px] flex items-center justify-center bg-[#0A3320] p-4 sm:p-8 pt-24 sm:pt-32 pb-8 sm:pb-16 overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #082819 0%, #0A3320 50%, #0D3E27 100%)' }} />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      <div className="relative z-10 w-full h-full max-w-[1400px] mx-auto flex gap-2 sm:gap-4">
        <Skeleton className="h-full rounded-2xl flex-[12]" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }} />
        <Skeleton className="h-full rounded-2xl flex-1 hidden sm:block" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }} />
        <Skeleton className="h-full rounded-2xl flex-1 hidden sm:block" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }} />
        <Skeleton className="h-full rounded-2xl flex-1 hidden md:block" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }} />
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
