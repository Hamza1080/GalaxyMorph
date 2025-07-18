import { NextResponse } from "next/server"

// This is a proxy route to handle CORS issues if needed
export async function POST(request: Request) {
  const body = await request.json()
  const { url, method, data, headers } = body

  try {
    const response = await fetch(url, {
      method: method || "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify(data),
    })

    const responseData = await response.json()
    return NextResponse.json(responseData)
  } catch (error) {
    console.error("Proxy error:", error)
    return NextResponse.json({ error: "Failed to fetch from API" }, { status: 500 })
  }
}
