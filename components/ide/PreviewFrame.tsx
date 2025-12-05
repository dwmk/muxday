"use client";
import { useEffect, useState } from "react";

interface PreviewProps {
  html: string;
  css: string;
  js: string;
}

export default function PreviewFrame({ html, css, js }: PreviewProps) {
  const [srcDoc, setSrcDoc] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSrcDoc(`
        <html>
          <head>
            <style>
              body { margin: 0; font-family: sans-serif; color: #fff; }
              ${css}
            </style>
          </head>
          <body>
            ${html}
            <script>
              try {
                ${js}
              } catch (err) {
                console.error(err);
              }
            </script>
          </body>
        </html>
      `);
    }, 600); // Debounce updates by 600ms

    return () => clearTimeout(timeout);
  }, [html, css, js]);

  return (
    <div className="h-full w-full bg-white rounded-lg overflow-hidden border-2 border-mux-blurple shadow-[0_0_15px_rgba(88,101,242,0.3)]">
      <iframe
        title="preview"
        srcDoc={srcDoc}
        className="h-full w-full"
        sandbox="allow-scripts" // NO allow-same-origin for security!
      />
    </div>
  );
}