import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingBrowsePage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col space-y-6">
        <h1 className="text-3xl font-bold">Browse Skills</h1>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-64 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-[200px] w-full" />
          </div>
          
          <div className="flex-1 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 9 }).map((_, i) => (
                <Skeleton key={i} className="h-[250px] w-full" />
              ))}
            </div>
            
            <div className="flex justify-center">
              <Skeleton className="h-10 w-[400px]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 