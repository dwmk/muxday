// editor.tsx
"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { keymap } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";

import {
  Box,
  Stack,
  Typography,
  Button,
  IconButton,
  Switch,
  Badge,
  Chip,
  Divider,
  Tooltip,
  AppBar,
  Toolbar,
  Input,
  FormControl,
  FormLabel,
  Sheet,
  LinearProgress,
  Tabs,
  TabList,
  Tab,
  TabPanel,
} from "@mui/joy";
import {
  Save,
  Share,
  Code,
  Palette,
  Javascript,
  Terminal,
  Smartphone,
  DesktopWindows,
  Settings,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Monitor,
  Public,
  PublicOff,
  Autorenew,
} from "@mui/icons-material";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Project } from "@/lib/types";

// Debounce Hook
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function Editor({ project, userId }: { project?: Project; userId: string }) {
  const [title, setTitle] = useState(project?.title || "Untitled Project");
  const [isPublic, setIsPublic] = useState(project?.is_public ?? true);
  const [htmlCode, setHtmlCode] = useState(project?.html_code || "<h1>Hello World</h1>");
  const [cssCode, setCssCode] = useState(project?.css_code || "body { margin: 2rem; font-family: sans-serif; }");
  const [jsCode, setJsCode] = useState(project?.js_code || "console.log('Ready!');");

  const [activeTab, setActiveTab] = useState<"html" | "css" | "js">("html");
  const [viewMode, setViewMode] = useState<"split" | "preview" | "code">("split");
  const [consoleOpen, setConsoleOpen] = useState(true);
  const [logs, setLogs] = useState<{ type: string; message: string; time: string }[]>([]);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(
    project?.updated_at ? new Date(project.updated_at) : null
  );

  const router = useRouter();
  const supabase = getSupabaseBrowserClient();

  // Smart debouncing: only update preview when typing stops
  const debouncedHtml = useDebounce(htmlCode, 500);
  const debouncedCss = useDebounce(cssCode, 500);
  const debouncedJs = useDebounce(jsCode, 800);

  const isSynced = htmlCode === debouncedHtml && cssCode === debouncedCss && jsCode === debouncedJs;

  // Console message listener
  useEffect(() => {
    const handler = (e: any) => {
      const { type, message } = e.detail;
      if (type === "clear") {
        setLogs([]);
      } else {
        setLogs((prev) => [...prev, { type, message, time: new Date().toLocaleTimeString() }]);
      }
    };
    window.addEventListener("console-message", handler);
    return () => window.removeEventListener("console-message", handler);
  }, []);

  // Save handler
  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const payload = {
        title,
        html_code: htmlCode,
        css_code: cssCode,
        js_code: jsCode,
        is_public: isPublic,
        updated_at: new Date().toISOString(),
      };

      if (project?.id) {
        const { error } = await supabase.from("projects").update(payload).eq("id", project.id);
        if (error) throw error;
      } else {
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        const { data, error } = await supabase
          .from("projects")
          .insert({ ...payload, user_id: userId, slug })
          .select()
          .single();
        if (error) throw error;
        router.replace(`/editor/${data.id}`);
      }

      setLastSaved(new Date());
    } catch (err: any) {
      alert("Save failed: " + err.message);
    } finally {
      setSaving(false);
    }
  }, [project, userId, title, htmlCode, cssCode, jsCode, isPublic, supabase, router]);

  // Keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", down);
    return () => window.removeEventListener("keydown", down);
  }, [handleSave]);

  // Preview srcDoc
  const srcDoc = useMemo(() => {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; padding: 1rem; font-family: system-ui, sans-serif; background: white; color: #000; }
    ${cssCode}
  </style>
</head>
<body>
  ${debouncedHtml}
  <script>
    (function() {
      const post = (type, msg) => {
        const message = typeof msg === 'object' && msg !== null ? 
          (msg.stack || JSON.stringify(msg, null, 2)) : String(msg);
        window.parent.postMessage({ source: 'preview-frame-log', type, message }, '*');
      };

        ['log', 'info', 'warn', 'error'].forEach(method => {
          console[method] = (...args) => {
            post(method, args.length === 1 ? args[0] : args);
            Function.prototype.apply.call(console[method], console, args);
          };
        });

        window.onerror = (msg, url, line) => post('error', msg + ' at line ' + line);
        window.addEventListener('unhandledrejection', e => post('error', e.reason));

        try { ${debouncedJs} } catch (e) { console.error(e); }
      })();
  </script>
</body>
</html>`;
  }, [debouncedHtml, debouncedCss, debouncedJs]);

  // CodeMirror Editor Component
  const CodeMirrorEditor = ({ value, onChange, language }: { value: string; onChange: (v: string) => void; language: string }) => {
    const ref = useRef<HTMLDivElement>(null);
    const view = useRef<EditorView | null>(null);

    useEffect(() => {
      if (!ref.current) return;
      const extensions = [
        basicSetup,
        keymap.of([indentWithTab]),
        language === "html" ? html() :
        language === "css" ? css() :
        javascript({ jsx: true, typescript: true }),
        oneDark,
        EditorView.lineWrapping,
        EditorView.updateListener.of((u) => u.docChanged && onChange(u.state.doc.toString())),
        EditorView.theme({
          "&": { height: "100%", fontSize: "14px" },
          ".cm-scroller": { fontFamily: "'JetBrains Mono', monospace" },
        }),
      ];

      const state = EditorState.create({ doc: value, extensions });
      const v = new EditorView({ state, parent: ref.current });
      view.current = v;

      return () => v.destroy();
    }, [language]);

    useEffect(() => {
      if (view.current && value !== view.current.state.doc.toString()) {
        view.current.dispatch({
          changes: { from: 0, to: view.current.state.doc.length, insert: value },
        });
      }
    }, [value]);

    return <div ref={ref} style={{ height: "100%" }} />;
  };

  const isMobile = window.innerWidth < 768;

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column", bgcolor: "#0d1117", color: "#c9d1d9" }}>
      {/* Header */}
      <AppBar position="static" color="neutral" sx={{ bgcolor: "#161b22", borderBottom: "1px solid #30363d" }}>
        <Toolbar>
          <Stack direction="row" alignItems="center" gap={2} flex={1}>
            <Box sx={{ width: 32, height: 32, bgcolor: "#238636", borderRadius: 2, display: "grid", placeItems: "center", fontWeight: "bold", color: "white" }}>
              M
            </Box>
            <Box>
              <Typography level="title-md">{title}</Typography>
              <Typography level="body-xs" sx={{ opacity: 0.7 }}>
                {saving ? "Saving..." : lastSaved ? `Saved at ${lastSaved.toLocaleTimeString()}` : "Not saved"}
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" gap={1}>
            <Button
              startDecorator={saving ? <Autorenew className="animate-spin" /> : <Save />}
              onClick={handleSave}
              loading={saving}
              color="success"
              size="sm"
            >
              Save
            </Button>
            <Button startDecorator={<Share />} variant="outlined" size="sm">
              Share
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      {isMobile ? (
        <Tabs value={viewMode} onChange={(_, v) => setViewMode(v as any)} sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <TabList>
            <Tab value="code"><Code /> Code</Tab>
            <Tab value="preview"><Monitor /> Preview</Tab>
          </TabList>

          <TabPanel value="code" sx={{ flex: 1, p: 0 }}>
            <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v as any)}>
              <TabList sx={{ bgcolor: "#161b22" }}>
                <Tab value="html"><Code fontSize="small" /> HTML</Tab>
                <Tab value="css"><Palette /> CSS</Tab>
                <Tab value="js"><Javascript /> JS</Tab>
              </TabList>
              <Box sx={{ height: "calc(100vh - 200px)" }}>
                {activeTab === "html" && <CodeMirrorEditor value={htmlCode} onChange={setHtmlCode} language="html" />}
                {activeTab === "css" && <CodeMirrorEditor value={cssCode} onChange={setCssCode} language="css" />}
                {activeTab === "js" && <CodeMirrorEditor value={jsCode} onChange={setJsCode} language="javascript" />}
              </Box>
            </Tabs>
          </TabPanel>

          <TabPanel value="preview" sx={{ flex: 1, p: 0, bgcolor: "white" }}>
            <iframe srcDoc={srcDoc} style={{ width: "100%", height: "100%", border: "none" }} title="Preview" sandbox="allow-scripts" />
          </TabPanel>
        </Tabs>
      ) : (
        <Stack direction="row" sx={{ flex: 1, overflow: "hidden" }}>
          {/* Sidebar */}
          <Sheet sx={{ width: 280, bgcolor: "#0d1117", borderRight: "1px solid #30363d", p: 2, display: { xs: "none", lg: "block" } }}>
            <Typography level="title-lg" startDecorator={<Settings />} mb={3}>Settings</Typography>

            <FormControl sx={{ mb: 3 }}>
              <FormLabel>Project Name</FormLabel>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </FormControl>

            <FormControl orientation="horizontal" sx={{ justifyContent: "space-between" }}>
              <FormLabel>Public</FormLabel>
              <Switch checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} startDecorator={isPublic ? <Public /> : <PublicOff />} />
            </FormControl>

            <Button fullWidth variant="plain" sx={{ mt: 4 }} onClick={() => router.push("/dashboard")}>
              ← Back to Dashboard
            </Button>
          </Sheet>

          {/* Editor + Preview Split */}
          <Box sx={{ flex: 1, display: "flex", position: "relative" }}>
            <Box sx={{ width: "50%", bgcolor: "#0d1117", display: "flex", flexDirection: "column" }}>
              <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v as any)}>
                <TabList sx={{ bgcolor: "#161b22" }}>
                  <Tab value="html"><Code /> HTML</Tab>
                  <Tab value="css"><Palette /> CSS</Tab>
                  <Tab value="js"><Javascript /> JS</Tab>
                </TabList>
              </Tabs>
              <Box sx={{ flex: 1 }}>
                {activeTab === "html" && <CodeMirrorEditor value={htmlCode} onChange={setHtmlCode} language="html" />}
                {activeTab === "css" && <CodeMirrorEditor value={cssCode} onChange={setCssCode} language="css" />}
                {activeTab === "js" && <CodeMirrorEditor value={jsCode} onChange={setJsCode} language="javascript" />}
              </Box>
            </Box>

            <Divider orientation="vertical" />

            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", bgcolor: "white" }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 1, bgcolor: "#f6f8fa", borderBottom: "1px solid #d0d7de" }}>
                <Stack direction="row" gap={1} alignItems="center">
                  <Monitor fontSize="small" />
                  <Typography level="title-sm">Preview</Typography>
                  {!isSynced && <Chip size="sm" color="warning" startDecorator={<Autorenew fontSize="small" className="animate-spin" />}>Syncing...</Chip>}
                </Stack>
                <IconButton size="sm" onClick={() => setLogs([])}><RefreshCw /></IconButton>
              </Stack>

              <Box sx={{ flex: consoleOpen ? 0.7 : 1 }}>
                <iframe srcDoc={srcDoc} style={{ width: "100%", height: "100%", border: "none" }} title="Live Preview" sandbox="allow-scripts allow-modals" />
              </Box>

              {consoleOpen && (
                <>
                  <Divider />
                  <Sheet sx={{ height: "30%", bgcolor: "#0d1117", display: "flex", flexDirection: "column" }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 1, borderBottom: "1px solid #30363d" }}>
                      <Typography level="body-sm" startDecorator={<Terminal fontSize="small" />}>Console</Typography>
                      <IconButton size="sm" onClick={() => setConsoleOpen(false)}><ChevronLeft /></IconButton>
                    </Stack>
                    <Box sx={{ flex: 1, overflow: "auto", p: 1, fontFamily: "monospace", fontSize: "12px" }}>
                      {logs.length === 0 ? (
                        <Typography level="body-xs" sx={{ opacity: 0.5 }}>Console is clear</Typography>
                      ) : (
                        logs.map((log, i) => (
                          <Box key={i} sx={{ color: log.type === "error" ? "#f85149" : log.type === "warn" ? "#d29922" : "#8b949e", mb: 0.5 }}>
                            [{log.time}] {log.message}
                          </Box>
                        ))
                      )}
                    </Box>
                  </Sheet>
                </>
              )}
              {!consoleOpen && (
                <Tooltip title="Open Console">
                  <IconButton onClick={() => setConsoleOpen(true)} sx={{ position: "absolute", bottom: 16, right: 16, bgcolor: "#238636" }}>
                    <Terminal />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Box>
        </Stack>
      )}
    </Box>
  );
}
