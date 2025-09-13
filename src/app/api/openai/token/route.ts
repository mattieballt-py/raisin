// src/app/api/openai/token/route.ts

import { NextRequest, NextResponse } from 'next/server';

export default async function handler(req: NextRequest) {
  const response = await fetch('https://api.openai.com/v1/agents/ephemeral', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  return NextResponse.json(data);
}
