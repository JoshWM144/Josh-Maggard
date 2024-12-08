import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Canvas from "../components/Canvas";
import PromptInput from "../components/PromptInput";
import AnimationControls from "../components/AnimationControls";
import ObjectLibrary from "../components/ObjectLibrary";
import { useState } from "react";

export default function Home() {
  const [objects, setObjects] = useState<any[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <header className="border-b bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            AI Blueboard Education
          </h1>
          <Button variant="outline">Help</Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="lg:col-span-3 p-4">
            <Canvas objects={objects} isPlaying={isPlaying} />
            <AnimationControls 
              isPlaying={isPlaying}
              onPlayPause={() => setIsPlaying(!isPlaying)}
              onReset={() => {
                setIsPlaying(false);
                setObjects([]);
              }}
            />
          </Card>

          <div className="space-y-6">
            <Card className="p-4">
              <PromptInput 
                onPromptSubmit={(prompt) => {
                  // Handle prompt submission
                  console.log("New prompt:", prompt);
                }} 
              />
            </Card>

            <Card className="p-4">
              <ObjectLibrary 
                onObjectSelect={(obj) => {
                  setObjects([...objects, obj]);
                }}
              />
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
