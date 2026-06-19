"use client";

import { GitBranch, Sparkles } from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/workspace/EmptyState";

export function AiPanel() {
  return (
    <aside className="flex h-full min-h-0 w-[350px] shrink-0 flex-col border-l border-border bg-muted/30">
      <Tabs defaultValue="diagram" className="flex h-full min-h-0 flex-col gap-0">
        <div className="flex h-10 shrink-0 items-center bg-background/50 px-3">
          <TabsList className="h-8 w-full">
            <TabsTrigger value="diagram" className="flex-1">
              <GitBranch className="size-3.5" />
              Diagram
            </TabsTrigger>
            <TabsTrigger value="explanation" className="flex-1">
              <Sparkles className="size-3.5" />
              Explanation
            </TabsTrigger>
          </TabsList>
        </div>

        <Separator />

        <TabsContent
          value="diagram"
          className="min-h-0 flex-1 overflow-hidden data-[orientation=horizontal]:mt-0"
        >
          <ScrollArea className="h-full">
            <EmptyState
              icon={GitBranch}
              title="Analyze a file to generate flowchart"
              description="Your architecture diagram will render here"
              className="min-h-[320px]"
            />
          </ScrollArea>
        </TabsContent>

        <TabsContent
          value="explanation"
          className="min-h-0 flex-1 overflow-hidden data-[orientation=horizontal]:mt-0"
        >
          <ScrollArea className="h-full">
            <EmptyState
              icon={Sparkles}
              title="AI explanation will appear here"
              description="Runtime logic and step-by-step breakdown after analysis"
              className="min-h-[320px]"
            />
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </aside>
  );
}
