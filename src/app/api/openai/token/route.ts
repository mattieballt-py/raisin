import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  console.log('[API] ===== /api/openai/token - Request received =====');
  console.log('[API] Request URL:', req.url);
  console.log('[API] Request method:', req.method);

  try {
    // Check for the OpenAI API key in environment variables
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      console.error('[API] ❌ Missing OPENAI_API_KEY environment variable');
      return NextResponse.json(
        {
          error: 'OPENAI_API_KEY environment variable is not set',
          value: null,
        },
        { status: 500 }
      );
    }

    console.log('[API] ✅ Using API key with length:', apiKey.length);

    // Make a request to OpenAI to create a session
    const res = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-realtime-preview", // Adjust model name if needed
        voice: "alloy", // Optional: specify voice
      }),
    });

    console.log('[API] OpenAI response status:', res.status);

    if (!res.ok) {
      const errorText = await res.text();
      console.error('[API] ❌ OpenAI API error response:', errorText);
      return NextResponse.json(
        {
          error: `OpenAI API error: ${res.status} - ${errorText}`,
          value: null,
        },
        { status: res.status }
      );
    }

    const data = await res.json();
    console.log('[API] ✅ OpenAI response data:', data);

    if (!data.client_secret || !data.client_secret.value) {
      console.error('[API] ❌ No client_secret in OpenAI response:', data);
      return NextResponse.json(
        {
          error: 'No client_secret received from OpenAI',
          value: null,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      value: data.client_secret.value,
      expires_at: data.client_secret.expires_at,
    });
  } catch (err) {
    console.error('[API] ❌ Error in /api/openai/token:', err);
    return NextResponse.json(
      {
        error: 'Internal server error',
        value: null,
      },
      { status: 500 }
    );
  }
}
