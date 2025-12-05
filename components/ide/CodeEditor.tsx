"use client";
import Editor from "@monaco-editor/react";

interface CodeEditorProps {
  language: "html" | "css" | "javascript";
  value: string;
  onChange: (value: string | undefined) => void;
}

export default function CodeEditor({ language, value, onChange }: CodeEditorProps) {
  return (
    <div className="h-full w-full overflow-hidden rounded-lg border border-mux-surface bg-mux-bg">
      <div className="bg-mux-surface px-4 py-2 text-xs font-bold uppercase tracking-widest text-mux-muted">
        {language === "javascript" ? "JS" : language}
      </div>
      <Editor
        height="100%"
        defaultLanguage={language}
        theme="vs-dark"
        value={value}
        onChange={onChange}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          padding: { top: 16 },
          scrollBeyondLastLine: false,
          fontFamily: "'Fira Code', monospace",
        }}
      />
    </div>
  );
}