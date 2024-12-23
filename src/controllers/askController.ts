// src/controllers/askController.ts
import { Request, Response, NextFunction } from 'express';
import generateAnswer from '../services/geminiService';
import loadDocument from '../utils/documentLoader';

const askController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  console.log('Received /ask request with body:', req.body); // 요청 로그

  try {
    const { question } = req.body;

    if (!question) {
      console.warn('질문이 제공되지 않았습니다.');
      res.status(400).json({ error: '질문을 입력해주세요.' });
      return;
    }

    // 파일을 비동기적으로 로드하고 기다림
    const documentText: string = await loadDocument('document.txt');

    if (!documentText) {
      console.error('문서 텍스트가 비어 있습니다.');
      res.status(500).json({ error: '문서를 로드할 수 없습니다.' });
      return;
    }

    console.log('Generating answer for question:', question);
    const answer = await generateAnswer(question, documentText);
    console.log('Generated answer:', answer);
    res.json({ answer });
  } catch (error) {
    console.error('askController 오류:', error);
    res.status(500).json({ error: '답변을 생성할 수 없습니다.' });
  }
};

export default askController;
