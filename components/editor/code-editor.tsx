"use client"

import { useEffect, useRef } from "react"
import { EditorView, basicSetup } from "codemirror"
import { EditorState } from "@codemirror/state"
import { keymap } from "@codemirror/view"
import { indentWithTab } from "@codemirror/commands"
import { html } from "@codemirror/lang-html"
import { css } from "@codemirror/lang-css"
import { javascript } from "@codemirror/lang-javascript"
import { oneDark } from "@codemirror/theme-one-dark"

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language: "html" | "css" | "javascript"
  className?: string
}

export function CodeEditor({ value, onChange, language, className }: CodeEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)

  // Extensions factory
  const getExtensions = () => {
    const langExtension = 
      language === "html" ? html() :
      language === "css" ? css() : 
      javascript({ jsx: true, typescript: true });

    return [
      basicSetup,
      keymap.of([indentWithTab]),
      langExtension,
      oneDark, // VS Code dark theme equivalent
      EditorView.lineWrapping,
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          onChange(update.state.doc.toString())
        }
      }),
      EditorView.theme({
        "&": { height: "100%", fontSize: "14px" },
        ".cm-scroller": { fontFamily: "'JetBrains Mono', 'Fira Code', monospace" },
        ".cm-gutters": { backgroundColor: "#1e1e1e", borderRight: "1px solid #2b2b2b" },
        ".cm-activeLineGutter": { backgroundColor: "#2c313a" },
      })
    ]
  }

  // Initialize Editor
  useEffect(() => {
    if (!containerRef.current) return

    const state = EditorState.create({
      doc: value,
      extensions: getExtensions(),
    })

    const view = new EditorView({
      state,
      parent: containerRef.current,
    })

    viewRef.current = view

    return () => view.destroy()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Run once on mount

  // Sync external value changes (e.g. from database load)
  useEffect(() => {
    const view = viewRef.current
    if (view && value !== view.state.doc.toString()) {
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: value }
      })
    }
  }, [value])

  return (
    <div 
      ref={containerRef} 
      className={`h-full w-full overflow-hidden bg-[#1e1e1e] ${className}`}
    />
  )
}
