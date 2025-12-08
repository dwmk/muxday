"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"

// Icons & UI
import { 
  Save, Settings, Play, Monitor, Smartphone, 
  FileCode, FileJson, Paintbrush, Terminal, 
  Check, Loader2, PanelLeftClose, PanelLeftOpen,
  Share2, RotateCcw
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"

// Local Components
import { CodeEditor } from "./code-editor"
import { PreviewFrame } from "./preview-frame"
import { useToast } from "@/hooks/use-toast"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { Project } from "@/lib/types"

// --- Helper: Debounce Hook ---
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])
  return debouncedValue
}

interface EditorLayoutProps {
  project?: Project
  userId: string
}

interface ConsoleLog {
  type: 'log' | 'error' | 'warn' | 'info';
  message: string;
  timestamp: string;
}

export function EditorLayout({ project, userId }: EditorLayoutProps) {
  // --- State: Code ---
  const [htmlCode, setHtmlCode] = useState(project?.html_code || "<h1>Hello World</h1>")
  const [cssCode, setCssCode] = useState(project?.css_code || "body { background: #f4f4f5; font-family: sans-serif; padding: 2rem; } h1 { color: #3b82f6; }")
  const [jsCode, setJsCode] = useState(project?.js_code || "console.log('Project loaded!');")

  // --- State: Meta ---
  const [title, setTitle] = useState(project?.title || "Untitled Project")
  const [isPublic, setIsPublic] = useState(project?.is_public ?? true)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(project?.updated_at ? new Date(project.updated_at) : null)

  // --- State: UI ---
  const [activeTab, setActiveTab] = useState<"html" | "css" | "js">("html")
  const [showSidebar, setShowSidebar] = useState(true)
  const [consoleOpen, setConsoleOpen] = useState(true)
  const [logs, setLogs] = useState<ConsoleLog[]>([])
  const [isMobile, setIsMobile] = useState(false)
  
  // Debounce code for preview to prevent lag
  const debouncedHtml = useDebounce(htmlCode, 600)
  const debouncedCss = useDebounce(cssCode, 600)
  const debouncedJs = useDebounce(jsCode, 1000) // Longer delay for JS to prevent syntax error execution

  const { toast } = useToast()
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  // --- Effects ---

  // 1. Mobile Detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // 2. Keyboard Shortcuts (Cmd+S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault()
        handleSave()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [htmlCode, cssCode, jsCode, title])

  // 3. Listen for Console Logs from PreviewFrame
  useEffect(() => {
    const handleConsoleMsg = (e: CustomEvent) => {
      const { type, message } = e.detail
      if (type === 'clear') {
        setLogs([])
      } else {
        setLogs(prev => [...prev, { 
          type, 
          message, 
          timestamp: new Date().toLocaleTimeString() 
        }])
      }
    }
    window.addEventListener('console-message', handleConsoleMsg as EventListener)
    return () => window.removeEventListener('console-message', handleConsoleMsg as EventListener)
  }, [])

  // --- Handlers ---

  const handleSave = useCallback(async () => {
    setSaving(true)
    try {
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "untitled"
      const payload = {
        title,
        html_code: htmlCode,
        css_code: cssCode,
        js_code: jsCode,
        is_public: isPublic,
        updated_at: new Date().toISOString(),
      }

      if (project?.id) {
        const { error } = await supabase.from("projects").update(payload).eq("id", project.id)
        if (error) throw error
      } else {
        const { data, error } = await supabase.from("projects").insert({ ...payload, user_id: userId, slug }).select().single()
        if (error) throw error
        router.push(`/editor/${data.id}`)
      }

      setLastSaved(new Date())
      toast({ title: "Saved successfully", duration: 2000 })
    } catch (err: any) {
      toast({ title: "Save failed", description: err.message, variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }, [project, userId, title, htmlCode, cssCode, jsCode, isPublic, supabase, router, toast])


  // --- Render Components ---

  const Sidebar = () => (
    <div className="h-full bg-zinc-950 border-r border-zinc-800 flex flex-col">
      <div className="p-4 border-b border-zinc-800">
        <h2 className="font-semibold text-zinc-100 flex items-center gap-2">
          <Settings className="w-4 h-4" /> Project
        </h2>
      </div>
      <div className="p-4 space-y-6">
        <div className="space-y-2">
          <Label className="text-zinc-400 text-xs uppercase tracking-wider">Project Name</Label>
          <Input 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            className="bg-zinc-900 border-zinc-700 text-zinc-200 focus-visible:ring-blurple-500"
          />
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-zinc-400">Public Access</Label>
          <Switch checked={isPublic} onCheckedChange={setIsPublic} />
        </div>
        <div className="pt-4 border-t border-zinc-800">
           <Button variant="outline" className="w-full justify-start text-zinc-400 hover:text-white bg-transparent border-zinc-700 hover:bg-zinc-800" onClick={() => router.push('/dashboard')}>
             Back to Dashboard
           </Button>
        </div>
      </div>
    </div>
  )

  const ConsolePanel = () => (
    <div className="h-full flex flex-col bg-zinc-950">
      <div className="h-9 min-h-[36px] flex items-center px-4 border-b border-zinc-800 bg-zinc-900/50 justify-between">
        <span className="text-xs font-medium text-zinc-400 flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5" /> Console
        </span>
        <Button 
          variant="ghost" size="icon" className="h-6 w-6 text-zinc-500 hover:text-zinc-300"
          onClick={() => setLogs([])}
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </Button>
      </div>
      <ScrollArea className="flex-1 p-2 font-mono text-xs">
        {logs.length === 0 && (
          <div className="text-zinc-600 italic px-2 py-1">Console is clear</div>
        )}
        {logs.map((log, i) => (
          <div key={i} className={`flex gap-2 py-1 px-2 border-b border-zinc-900/50 ${
            log.type === 'error' ? 'text-red-400 bg-red-950/10' :
            log.type === 'warn' ? 'text-yellow-400 bg-yellow-950/10' : 'text-zinc-300'
          }`}>
            <span className="text-zinc-600 shrink-0 select-none">[{log.timestamp}]</span>
            <span className="break-all whitespace-pre-wrap">{log.message}</span>
          </div>
        ))}
      </ScrollArea>
    </div>
  )

  // Desktop 3-pane Layout
  const DesktopLayout = () => (
    <ResizablePanelGroup direction="horizontal" className="h-full w-full">
      {/* 1. Sidebar (Collapsible) */}
      {showSidebar && (
        <>
          <ResizablePanel defaultSize={15} minSize={10} maxSize={20} className="hidden lg:block">
            <Sidebar />
          </ResizablePanel>
          <ResizableHandle className="bg-zinc-800 hidden lg:flex" />
        </>
      )}

      {/* 2. Code Editors */}
      <ResizablePanel defaultSize={45} minSize={30}>
        <div className="h-full flex flex-col bg-[#1e1e1e]">
          {/* Editor Tabs */}
          <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className="flex-1 flex flex-col">
            <div className="flex items-center justify-between bg-zinc-950 border-b border-zinc-800 px-2">
              <TabsList className="h-10 bg-transparent p-0 gap-1">
                {[
                  { id: 'html', icon: FileCode, label: 'HTML', color: 'text-orange-400' },
                  { id: 'css', icon: Paintbrush, label: 'CSS', color: 'text-blue-400' },
                  { id: 'js', icon: FileJson, label: 'JS', color: 'text-yellow-400' }
                ].map(tab => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="data-[state=active]:bg-[#1e1e1e] data-[state=active]:text-zinc-100 data-[state=active]:border-t-2 data-[state=active]:border-t-blurple-500 rounded-none border-t-2 border-transparent px-4 py-2 h-full text-zinc-500 transition-all"
                  >
                    <tab.icon className={`w-3.5 h-3.5 mr-2 ${tab.color}`} />
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              <div className="flex items-center gap-2 pr-2">
                <Button variant="ghost" size="sm" onClick={() => setShowSidebar(!showSidebar)} className="h-8 w-8 p-0 text-zinc-400">
                  {showSidebar ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
                </Button>
              </div>
            </div>

            {/* Editor Area */}
            <div className="flex-1 relative">
              <TabsContent value="html" className="mt-0 h-full absolute inset-0">
                <CodeEditor language="html" value={htmlCode} onChange={setHtmlCode} />
              </TabsContent>
              <TabsContent value="css" className="mt-0 h-full absolute inset-0">
                <CodeEditor language="css" value={cssCode} onChange={setCssCode} />
              </TabsContent>
              <TabsContent value="js" className="mt-0 h-full absolute inset-0">
                <CodeEditor language="javascript" value={jsCode} onChange={setJsCode} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </ResizablePanel>

      <ResizableHandle className="bg-zinc-800" />

      {/* 3. Preview & Console */}
      <ResizablePanel defaultSize={40} minSize={20}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={consoleOpen ? 70 : 100} minSize={30}>
            <div className="h-full flex flex-col bg-white">
              <div className="h-10 flex items-center justify-between px-3 border-b bg-zinc-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-zinc-600 uppercase tracking-wider flex items-center gap-1">
                     <Monitor className="w-3 h-3" /> Preview
                  </span>
                  {/* Stale Indicator */}
                  {(htmlCode !== debouncedHtml || cssCode !== debouncedCss || jsCode !== debouncedJs) && (
                     <Badge variant="secondary" className="h-5 text-[10px] px-1 bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Syncing...</Badge>
                  )}
                </div>
                <div className="flex gap-1.5">
                   <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                   <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
                   <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
                </div>
              </div>
              <div className="flex-1 relative bg-white">
                <PreviewFrame 
                  htmlCode={debouncedHtml} 
                  cssCode={debouncedCss} 
                  jsCode={debouncedJs} 
                />
              </div>
            </div>
          </ResizablePanel>
          
          <ResizableHandle className="bg-zinc-800" withHandle />

          {/* Console Section */}
          <ResizablePanel 
            defaultSize={30} 
            minSize={10} 
            maxSize={80}
            collapsible={true}
            collapsedSize={0}
            onCollapse={() => setConsoleOpen(false)}
            onExpand={() => setConsoleOpen(true)}
            className={!consoleOpen ? "hidden" : ""}
          >
            <ConsolePanel />
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  )

  // --- Main Layout Render ---
  return (
    <div className="h-screen w-full flex flex-col bg-zinc-950 text-zinc-100 overflow-hidden font-sans">
      
      {/* Header / Toolbar */}
      <header className="h-14 border-b border-zinc-800 flex items-center justify-between px-4 bg-zinc-950 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-blurple-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-blurple-500/20">M</div>
          <div className="flex flex-col">
            <h1 className="text-sm font-medium text-zinc-100">{title}</h1>
            <span className="text-[10px] text-zinc-500">
              {saving ? "Saving..." : lastSaved ? `Saved ${lastSaved.toLocaleTimeString()}` : "Unsaved"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Save Button */}
          <Button 
            size="sm" 
            onClick={handleSave} 
            disabled={saving}
            className={`h-8 font-medium transition-all ${
              saving ? "bg-zinc-800 text-zinc-400" : "bg-blurple-600 hover:bg-blurple-500 text-white"
            }`}
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" /> : <Save className="w-3.5 h-3.5 mr-2" />}
            {saving ? "Saving" : "Save"}
          </Button>

           <Button size="sm" variant="outline" className="h-8 border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800">
             <Share2 className="w-3.5 h-3.5 mr-2" /> Share
           </Button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 overflow-hidden relative">
        {isMobile ? (
          /* Mobile View: Simplified Tabs */
          <Tabs defaultValue="code" className="h-full flex flex-col">
             <TabsList className="w-full justify-start rounded-none border-b border-zinc-800 bg-zinc-900 p-0 h-10">
                <TabsTrigger value="code" className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-blurple-500 data-[state=active]:bg-zinc-800">Code</TabsTrigger>
                <TabsTrigger value="preview" className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-blurple-500 data-[state=active]:bg-zinc-800">Preview</TabsTrigger>
             </TabsList>
             <TabsContent value="code" className="flex-1 mt-0">
                <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className="h-full flex flex-col">
                   <div className="bg-zinc-950 p-2 flex gap-2">
                      <Button size="sm" variant={activeTab === 'html' ? 'secondary' : 'ghost'} onClick={() => setActiveTab('html')} className="flex-1">HTML</Button>
                      <Button size="sm" variant={activeTab === 'css' ? 'secondary' : 'ghost'} onClick={() => setActiveTab('css')} className="flex-1">CSS</Button>
                      <Button size="sm" variant={activeTab === 'js' ? 'secondary' : 'ghost'} onClick={() => setActiveTab('js')} className="flex-1">JS</Button>
                   </div>
                   <div className="flex-1">
                      {activeTab === 'html' && <CodeEditor language="html" value={htmlCode} onChange={setHtmlCode} />}
                      {activeTab === 'css' && <CodeEditor language="css" value={cssCode} onChange={setCssCode} />}
                      {activeTab === 'js' && <CodeEditor language="javascript" value={jsCode} onChange={setJsCode} />}
                   </div>
                </Tabs>
             </TabsContent>
             <TabsContent value="preview" className="flex-1 mt-0 bg-white">
                <PreviewFrame htmlCode={debouncedHtml} cssCode={debouncedCss} jsCode={debouncedJs} />
             </TabsContent>
          </Tabs>
        ) : (
          /* Desktop View */
          <DesktopLayout />
        )}
      </main>
    </div>
  )
}
