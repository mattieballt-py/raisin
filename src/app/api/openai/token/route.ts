import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  console.log('[API] ===== /api/openai/token - Request received =====');
  console.log('[API] Request URL:', req.url);
  console.log('[API] Request method:', req.method);
  console.log('[API] Request headers:', Object.fromEntries(req.headers.entries()));
  
  try {
    // Check all possible environment variable sources
    const apiKey = process.env.OPENAI_API_KEY;
    const apiKeyFromNext = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    
    console.log('[API] Environment variables check:');
    console.log('[API] - process.env.OPENAI_API_KEY present:', !!apiKey);
    console.log('[API] - process.env.OPENAI_API_KEY length:', apiKey?.length || 0);
    console.log('[API] - process.env.NEXT_PUBLIC_OPENAI_API_KEY present:', !!apiKeyFromNext);
    console.log('[API] - process.env.NEXT_PUBLIC_OPENAI_API_KEY length:', apiKeyFromNext?.length || 0);
    console.log('[API] - NODE_ENV:', process.env.NODE_ENV);
    console.log('[API] - All env vars starting with OPENAI:', Object.keys(process.env).filter(key => key.startsWith('OPENAI')));
    
    const finalApiKey = apiKey || apiKeyFromNext;
    
    if (!finalApiKey) {
      console.error('[API] ❌ No OpenAI API key found in environment variables');
      console.error('[API] Available environment variables:', Object.keys(process.env).sort());
      return NextResponse.json({ 
        error: 'OPENAI_API_KEY environment variable is not set',
        value: null,
        debug: {
          hasOpenAIKey: !!apiKey,
          hasNextPublicKey: !!apiKeyFromNext,
          nodeEnv: process.env.NODE_ENV,
          availableKeys: Object.keys(process.env).filter(key => key.includes('OPENAI'))
        }
      }, { status: 500 });
    }

    console.log('[API] ✅ Using API key with length:', finalApiKey.length);
    console.log('[API] API key prefix:', finalApiKey.substring(0, 10) + '...');
    
    console.log('[API] Making request to OpenAI Realtime API...');
    console.log('[API] Request URL: https://api.openai.com/v1/realtime/sessions');
    console.log('[API] Request body:', JSON.stringify({
      model: "gpt-4o-realtime-preview-2024-12-17",
    }, null, 2));
    
    // Call OpenAI to create ephemeral token
    const res = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${finalApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-realtime-preview-2024-12-17",
      }),
    });

    console.log('[API] OpenAI response status:', res.status);
    console.log('[API] OpenAI response status text:', res.statusText);
    console.log('[API] OpenAI response headers:', Object.fromEntries(res.headers.entries()));

    if (!res.ok) {
      const errorText = await res.text();
      console.error('[API] ❌ OpenAI API error response:');
      console.error('[API] Status:', res.status);
      console.error('[API] Status Text:', res.statusText);
      console.error('[API] Response body:', errorText);
      
      return NextResponse.json({ 
        error: `OpenAI API error: ${res.status} - ${errorText}`,
        value: null,
        debug: {
          status: res.status,
          statusText: res.statusText,
          responseBody: errorText
        }
      }, { status: res.status });
    }

    const data = await res.json();
    console.log('[API] ✅ OpenAI response data received:');
    console.log('[API] Full response:', JSON.stringify(data, null, 2));

    if (!data.client_secret || !data.client_secret.value) {
      console.error('[API] ❌ No client_secret in OpenAI response:');
      console.error('[API] Response structure:', Object.keys(data));
      console.error('[API] client_secret present:', !!data.client_secret);
      console.error('[API] client_secret.value present:', !!(data.client_secret && data.client_secret.value));
      
      return NextResponse.json({ 
        error: 'No client_secret received from OpenAI',
        value: null,
        debug: {
          responseKeys: Object.keys(data),
          hasClientSecret: !!data.client_secret,
          hasClientSecretValue: !!(data.client_secret && data.client_secret.value)
        }
      }, { status: 500 });
    }

    console.log('[API] ✅ Ephemeral token retrieved successfully!');
    console.log('[API] Token length:', data.client_secret.value.length);
    console.log('[API] Token prefix:', data.client_secret.value.substring(0, 10) + '...');
    console.log('[API] Token expires at:', data.client_secret.expires_at);
    console.log('[API] Token expires in:', new Date(data.client_secret.expires_at * 1000).toISOString());

    return NextResponse.json({ 
      value: data.client_secret.value,
      expires_at: data.client_secret.expires_at,
      debug: {
        tokenLength: data.client_secret.value.length,
        expiresAt: data.client_secret.expires_at,
        expiresAtISO: new Date(data.client_secret.expires_at * 1000).toISOString()
      }
    });
  } catch (err) {
    console.error('[API] ❌ Error in /api/openai/token:');
    console.error('[API] Error type:', typeof err);
    console.error('[API] Error message:', err instanceof Error ? err.message : String(err));
    console.error('[API] Error stack:', err instanceof Error ? err.stack : 'No stack trace');
    console.error('[API] Full error object:', err);
    
    return NextResponse.json({ 
      error: err instanceof Error ? err.message : 'Unknown error occurred',
      value: null,
      debug: {
        errorType: typeof err,
        errorMessage: err instanceof Error ? err.message : String(err),
        hasStack: !!(err instanceof Error && err.stack)
      }
    }, { status: 500 });
  }
}
