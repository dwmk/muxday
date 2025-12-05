"use client"

import { useEffect, useRef, useCallback } from "react"
import { EditorView, basicSetup } from "codemirror"
import { EditorState } from "@codemirror/state"
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
  const editorRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)

  const getLanguageExtension = useCallback(() => {
    switch (language) {
      case "html":
        return html()
      case "css":
        return css()
      case "javascript":
        return javascript()
      default:
        return html()
    }
  }, [language])

  useEffect(() => {
    if (!editorRef.current) return

    const state = EditorState.create({
      doc: value,
      extensions: [
        basicSetup,
        getLanguageExtension(),
        oneDark,
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChange(update.state.doc.toString())
          }
        }),
        EditorView.theme({
          "&": {
            height: "100%",
            backgroundColor: "hsl(240 10% 5%)",
          },
          ".cm-content": {
            fontFamily: "var(--font-mono)",
            padding: "8px 0",
          },
          ".cm-line": {
            padding: "0 8px",
          },
        }),
      ],
    })

    const view = new EditorView({
      state,
      parent: editorRef.current,
    })

    viewRef.current = view

    return () => {
      view.destroy()
    }
  }, [language, getLanguageExtension])

  // Update content when value changes externally
  useEffect(() => {
    if (viewRef.current) {
      const currentValue = viewRef.current.state.doc.toString()
      if (value !== currentValue) {
        viewRef.current.dispatch({
          changes: {
            from: 0,
            to: currentValue.length,
            insert: value,
          },
        })
      }
    }
  }, [value])

  return <div ref={editorRef} className={`h-full overflow-hidden ${className}`} />
}
