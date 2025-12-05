import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get("title") || "MuxDay Project"
  const username = searchParams.get("username") || "anonymous"

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0a0a0f",
        backgroundImage: "linear-gradient(135deg, #5865f2 0%, #0a0a0f 50%)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 80px",
          backgroundColor: "rgba(10, 10, 15, 0.9)",
          borderRadius: "24px",
          border: "1px solid rgba(88, 101, 242, 0.3)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              backgroundColor: "#5865f2",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
            }}
          >
            {"</>"}
          </div>
          <span style={{ color: "#ffffff", fontSize: "24px", fontWeight: "bold" }}>MuxDay</span>
        </div>
        <h1
          style={{
            color: "#ffffff",
            fontSize: "48px",
            fontWeight: "bold",
            textAlign: "center",
            margin: 0,
            marginBottom: "16px",
          }}
        >
          {title}
        </h1>
        <p style={{ color: "#a0a0a0", fontSize: "24px", margin: 0 }}>by @{username}</p>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  )
}
