"use client"

import { useEffect, useRef, useMemo } from "react"

interface PreviewFrameProps {
  htmlCode: string
  cssCode: string
  jsCode: string
}

export function PreviewFrame({ htmlCode, cssCode, jsCode }: PreviewFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const srcDoc = useMemo(() => {
    // Sanitize and create secure document
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: https:; img-src * data: blob:; media-src * data: blob:; font-src * data:;">
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; padding: 16px; font-family: system-ui, sans-serif; }
    ${cssCode}
  </style>
</head>
<body>
  ${htmlCode}
  <script>
    // Sandbox protection - prevent access to parent window
    (function() {
      'use strict';
      
      // Block access to parent
      Object.defineProperty(window, 'parent', { value: window, writable: false });
      Object.defineProperty(window, 'top', { value: window, writable: false });
      Object.defineProperty(window, 'frameElement', { value: null, writable: false });
      
      // Console wrapper for debugging
      const originalConsole = console;
      window.console = {
        log: (...args) => originalConsole.log('[Preview]', ...args),
        error: (...args) => originalConsole.error('[Preview]', ...args),
        warn: (...args) => originalConsole.warn('[Preview]', ...args),
        info: (...args) => originalConsole.info('[Preview]', ...args),
        clear: () => originalConsole.clear(),
      };

      // Error handling
      window.onerror = function(msg, url, line, col, error) {
        console.error('Error:', msg, 'at line', line);
        return true;
      };

      try {
        ${jsCode}
      } catch (e) {
        console.error('Script Error:', e.message);
      }
    })();
  </script>
</body>
</html>`
  }, [htmlCode, cssCode, jsCode])

  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.srcdoc = srcDoc
    }
  }, [srcDoc])

  return (
    <iframe
      ref={iframeRef}
      title="Preview"
      sandbox="allow-scripts allow-modals"
      className="w-full h-full bg-white"
      srcDoc={srcDoc}
    />
  )
}
