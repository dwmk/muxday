"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import CodeEditor from "@/components/ide/CodeEditor";
import PreviewFrame from "@/components/ide/PreviewFrame";
import { Save, Share2, Settings } from "lucide-react";

export default function IDEPage() {
  const params = useParams();
  const [html, setHtml] = useState("<h1>Hello MuxDay</h1>");
  const [css, setCss] = useState("h1 { color: #5865F2; }");
  const [js, setJs] = useState("console.log('MuxDay init');");
  
  // Mobile Tab State
  const [activeTab, setActiveTab] = useState<"editor" | "preview">("editor");
  const [activeEditor, setActiveEditor] = useState<"html" | "css" | "js">("html");

  const handleSave = async () => {
    // Logic to call Supabase update
    console.log("Saving to Supabase...");
  };

  return (
    <div className="flex h-screen flex-col bg-mux-bg text-white">
      {/* Top Bar */}
      <header className="flex h-14 items-center justify-between border-b border-mux-surface px-4">
        <div className="flex items-center gap-2">
           <div className="h-8 w-8 rounded bg-mux-blurple flex items-center justify-center font-bold">M</div>
           <span className="font-mono text-sm text-mux-muted">@{params.username} / {params.project}</span>
        </div>
        <button onClick={handleSave} className="bg-mux-blurple hover:bg-mux-blurple-hover px-4 py-1.5 rounded text-sm font-medium transition-colors flex items-center gap-2">
          <Save size={14} /> Save
        </button>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 overflow-hidden relative">
        
        {/* DESKTOP LAYOUT (Hidden on mobile) */}
        <div className="hidden md:flex h-full">
          <div className="w-1/2 flex flex-col border-r border-mux-surface">
            <div className="h-1/3 p-1"><CodeEditor language="html" value={html} onChange={(v) => setHtml(v || "")} /></div>
            <div className="h-1/3 p-1"><CodeEditor language="css" value={css} onChange={(v) => setCss(v || "")} /></div>
            <div className="h-1/3 p-1"><CodeEditor language="javascript" value={js} onChange={(v) => setJs(v || "")} /></div>
          </div>
          <div className="w-1/2 p-2 bg-gray-100">
            <PreviewFrame html={html} css={css} js={js} />
          </div>
        </div>

        {/* MOBILE LAYOUT (Hidden on desktop) */}
        <div className="md:hidden h-full flex flex-col">
          {/* Mobile Tabs */}
          <div className="flex bg-mux-surface text-sm">
             <button onClick={() => setActiveTab("editor")} className={`flex-1 py-3 ${activeTab === "editor" ? "border-b-2 border-mux-blurple text-white" : "text-mux-muted"}`}>Code</button>
             <button onClick={() => setActiveTab("preview")} className={`flex-1 py-3 ${activeTab === "preview" ? "border-b-2 border-mux-blurple text-white" : "text-mux-muted"}`}>Preview</button>
          </div>

          <div className="flex-1 relative">
            {activeTab === "editor" && (
              <div className="flex flex-col h-full">
                <div className="flex bg-mux-bg border-b border-mux-surface overflow-x-auto">
                   {['html', 'css', 'js'].map((lang) => (
                     <button 
                       key={lang}
                       onClick={() => setActiveEditor(lang as any)}
                       className={`px-4 py-2 uppercase text-xs font-bold ${activeEditor === lang ? "text-mux-blurple" : "text-mux-muted"}`}
                     >
                       {lang}
                     </button>
                   ))}
                </div>
                <div className="flex-1">
                   {activeEditor === "html" && <CodeEditor language="html" value={html} onChange={(v) => setHtml(v || "")} />}
                   {activeEditor === "css" && <CodeEditor language="css" value={css} onChange={(v) => setCss(v || "")} />}
                   {activeEditor === "js" && <CodeEditor language="javascript" value={js} onChange={(v) => setJs(v || "")} />}
                </div>
              </div>
            )}
            
            {activeTab === "preview" && (
              <div className="h-full w-full bg-white">
                 <PreviewFrame html={html} css={css} js={js} />
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}