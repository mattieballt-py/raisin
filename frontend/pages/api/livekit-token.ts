import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { identity, room } = req.body;

  try {
    const response = await fetch('http://127.0.0.1:8000/api/get-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identity, room }),
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch token' });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Server error: ' + (error as Error).message });
  }
}
