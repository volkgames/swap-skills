import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto">
      <div className="flex flex-col gap-12 items-center justify-center py-20">
        <h1 className="text-4xl font-bold text-center">
          Offer your knowledge. Request a new skill. <br className="hidden md:inline" />
          <span className="text-primary">No money involved.</span>
        </h1>
        <div className="flex flex-col items-center gap-4">
          <Button
            asChild
            size="lg"
            className="px-8 py-5 text-lg font-semibold shadow-lg"
          >
            <Link href="/sign-up">
              Get Started for Free
            </Link>
          </Button>
          <span className="text-muted-foreground text-sm">
            Join a community of learners and sharers. <br className="hidden md:inline" />
            <span className="font-medium">Sign up now and start swapping skills!</span>
          </span>
        </div>
      </div>
    </div>
  );
}
