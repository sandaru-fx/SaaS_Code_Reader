import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-4xl font-bold tracking-tight">CodeRider</h1>
      <p className="max-w-md text-center text-muted-foreground">
        AI-powered visual code workspace — understand your codebase with
        flowcharts and step-by-step explanations.
      </p>
      <Button disabled>Workspace coming in Phase 2</Button>
    </div>
  );
}
