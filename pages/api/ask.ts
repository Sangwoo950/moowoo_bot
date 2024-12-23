// pages/api/ask.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import generateAnswer from '../../src/services/geminiService';

interface Data {
  answer?: string;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { question } = req.body;
  if (!question) {
    return res.status(400).json({ error: '질문을 입력해주세요.' });
  }

  try {
    const answer = await generateAnswer(question);
    res.status(200).json({ answer });
  } catch (e: any) {
    console.error('API 요청 오류:', e);
    res.status(500).json({ error: '답변을 생성할 수 없습니다.' });
  }
}
