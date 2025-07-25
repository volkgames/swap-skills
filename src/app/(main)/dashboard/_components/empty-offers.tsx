import { XIcon } from "lucide-react";

export default function EmptyOffers() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-16 bg-card rounded-2xl shadow-md border border-muted mx-auto max-w-xl mt-12">
      <XIcon className="w-16 h-16 text-muted-foreground mb-2" />
      <h2 className="text-xl font-semibold text-center">No Offers Yet</h2>
      <p className="text-muted-foreground text-center">
        You haven&apos;t created any offers. Click &quot;Add Offer&quot; to get
        started and share your skills with the community.
      </p>
    </div>
  );
} 