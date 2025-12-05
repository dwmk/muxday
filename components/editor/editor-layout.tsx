"use client"

import { useState, useCallback, useEffect } from "react"
import { CodeEditor } from "./code-editor"
import { PreviewFrame } from "./preview-frame"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Save, Settings, Eye, Code, FileCode, FileJson, Paintbrush, Loader2, Check, Monitor } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { Project } from "@/lib/types"
import { useRouter } from "next/navigation"

interface EditorLayoutProps {
  project?: Project
  userId: string
}

export function EditorLayout({ project, userId }: EditorLayoutProps) {
  const [htmlCode, setHtmlCode] = useState(
    project?.html_code || "<h1>Hello MuxDay!</h1>\n<p>Start building your project.</p>",
  )
  const [cssCode, setCssCode] = useState(
    project?.css_code ||
      "body {\n  background: linear-gradient(135deg, #1a1a2e, #16213e);\n  color: white;\n  min-height: 100vh;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n}\n\nh1 {\n  color: #5865f2;\n  font-size: 3rem;\n}",
  )
  const [jsCode, setJsCode] = useState(
    project?.js_code || "// Your JavaScript here\nconsole.log('Welcome to MuxDay!');",
  )
  const [title, setTitle] = useState(project?.title || "Untitled Project")
  const [description, setDescription] = useState(project?.description || "")
  const [isPublic, setIsPublic] = useState(project?.is_public ?? true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState("html")
  const [viewMode, setViewMode] = useState<"split" | "code" | "preview">("split")
  const [isMobile, setIsMobile] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const { toast } = useToast()
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const generateSlug = (title: string) => {
    return (
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") || "untitled"
    )
  }

  const handleSave = useCallback(async () => {
    setSaving(true)
    try {
      const slug = generateSlug(title)

      if (project?.id) {
        // Update existing project
        const { error } = await supabase
          .from("projects")
          .update({
            title,
            description,
            html_code: htmlCode,
            css_code: cssCode,
            js_code: jsCode,
            is_public: isPublic,
            updated_at: new Date().toISOString(),
          })
          .eq("id", project.id)

        if (error) throw error
      } else {
        // Create new project
        const { data, error } = await supabase
          .from("projects")
          .insert({
            user_id: userId,
            slug,
            title,
            description,
            html_code: htmlCode,
            css_code: cssCode,
            js_code: jsCode,
            is_public: isPublic,
          })
          .select()
          .single()

        if (error) throw error

        // Redirect to edit page with project ID
        router.push(`/editor/${data.id}`)
      }

      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      toast({ title: "Project saved successfully!" })
    } catch (error: any) {
      toast({
        title: "Error saving project",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }, [project?.id, userId, title, description, htmlCode, cssCode, jsCode, isPublic, supabase, router, toast])

  // Auto-save every 30 seconds
  useEffect(() => {
    if (!project?.id) return
    const interval = setInterval(handleSave, 30000)
    return () => clearInterval(interval)
  }, [project?.id, handleSave])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault()
        handleSave()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleSave])

  const EditorTabs = () => (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
      <div className="flex items-center justify-between border-b border-border px-2 py-1 bg-card">
        <TabsList className="h-8 bg-transparent">
          <TabsTrigger
            value="html"
            className="text-xs data-[state=active]:bg-blurple-500/20 data-[state=active]:text-blurple-400"
          >
            <FileCode className="h-3 w-3 mr-1" />
            HTML
          </TabsTrigger>
          <TabsTrigger
            value="css"
            className="text-xs data-[state=active]:bg-blurple-500/20 data-[state=active]:text-blurple-400"
          >
            <Paintbrush className="h-3 w-3 mr-1" />
            CSS
          </TabsTrigger>
          <TabsTrigger
            value="js"
            className="text-xs data-[state=active]:bg-blurple-500/20 data-[state=active]:text-blurple-400"
          >
            <FileJson className="h-3 w-3 mr-1" />
            JS
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="html" className="flex-1 m-0 data-[state=inactive]:hidden">
        <CodeEditor value={htmlCode} onChange={setHtmlCode} language="html" />
      </TabsContent>
      <TabsContent value="css" className="flex-1 m-0 data-[state=inactive]:hidden">
        <CodeEditor value={cssCode} onChange={setCssCode} language="css" />
      </TabsContent>
      <TabsContent value="js" className="flex-1 m-0 data-[state=inactive]:hidden">
        <CodeEditor value={jsCode} onChange={setJsCode} language="javascript" />
      </TabsContent>
    </Tabs>
  )

  const Preview = () => (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between border-b border-border px-3 py-1.5 bg-card">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Eye className="h-4 w-4" />
          Preview
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
      </div>
      <div className="flex-1 bg-white">
        <PreviewFrame htmlCode={htmlCode} cssCode={cssCode} jsCode={jsCode} />
      </div>
    </div>
  )

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-border px-4 py-2 bg-card">
        <div className="flex items-center gap-3">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-48 md:w-64 h-8 bg-background text-sm"
            placeholder="Project title"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* View mode toggle (desktop only) */}
          <div className="hidden md:flex items-center border border-border rounded-md">
            <Button
              variant="ghost"
              size="sm"
              className={`h-7 px-2 rounded-r-none ${viewMode === "code" ? "bg-blurple-500/20" : ""}`}
              onClick={() => setViewMode("code")}
            >
              <Code className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`h-7 px-2 rounded-none border-x border-border ${viewMode === "split" ? "bg-blurple-500/20" : ""}`}
              onClick={() => setViewMode("split")}
            >
              <Monitor className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`h-7 px-2 rounded-l-none ${viewMode === "preview" ? "bg-blurple-500/20" : ""}`}
              onClick={() => setViewMode("preview")}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>

          {/* Mobile view toggle */}
          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8"
              onClick={() => setViewMode(viewMode === "code" ? "preview" : "code")}
            >
              {viewMode === "code" ? <Eye className="h-4 w-4" /> : <Code className="h-4 w-4" />}
            </Button>
          )}

          <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8">
                <Settings className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Project Settings</DialogTitle>
                <DialogDescription>Configure your project settings and visibility.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your project..."
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Public Project</Label>
                    <p className="text-xs text-muted-foreground">Allow anyone to view this project</p>
                  </div>
                  <Switch checked={isPublic} onCheckedChange={setIsPublic} />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => setSettingsOpen(false)}>Done</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button size="sm" className="h-8 bg-blurple-500 hover:bg-blurple-600" onClick={handleSave} disabled={saving}>
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : saved ? (
              <Check className="h-4 w-4" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span className="ml-1 hidden sm:inline">{saving ? "Saving..." : saved ? "Saved" : "Save"}</span>
          </Button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 overflow-hidden">
        {isMobile ? (
          // Mobile layout - tabbed view
          <div className="h-full">{viewMode === "code" ? <EditorTabs /> : <Preview />}</div>
        ) : (
          // Desktop layout - resizable panels
          <>
            {viewMode === "code" && <EditorTabs />}
            {viewMode === "preview" && <Preview />}
            {viewMode === "split" && (
              <ResizablePanelGroup direction="horizontal">
                <ResizablePanel defaultSize={50} minSize={30}>
                  <EditorTabs />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={50} minSize={30}>
                  <Preview />
                </ResizablePanel>
              </ResizablePanelGroup>
            )}
          </>
        )}
      </div>
    </div>
  )
}
