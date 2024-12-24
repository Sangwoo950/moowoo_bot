import type { NextApiRequest, NextApiResponse } from 'next';
import { generateAnswer } from '../../src/services/geminiService';
import axios, { AxiosError } from 'axios'; // axios 임포트 추가

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
  } catch (error: unknown) {
    // `unknown` 사용
    console.error('API 요청 오류:', error);
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ error: string }>;
      const errorMsg =
        axiosError.response?.data.error || '답변을 생성할 수 없습니다.';
      res.status(500).json({ error: errorMsg });
    } else if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res
        .status(500)
        .json({ error: '죄송합니다. 답변을 생성하는데 문제가 발생했습니다.' });
    }
  }
}
