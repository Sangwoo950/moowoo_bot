// // src/app.ts
// import express, { Application, Request, Response } from 'express';
// import bodyParser from 'body-parser';
// import dotenv from 'dotenv';
// import askController from './controllers/askController';

// dotenv.config();

// const app: Application = express();
// const PORT: number = parseInt(process.env.PORT || '3000', 10);

// // 미들웨어 설정
// app.use(bodyParser.json()); // 최신 Express 버전에서는 express.json() 사용 가능

// // 엔드포인트 설정
// app.post('/ask', askController);

// // 기본 라우트
// app.get('/', (req: Request, res: Response) => {
//   res.send('Gemini API 기반 봇 서버입니다.');
// });

// // 404 핸들러
// app.use((req: Request, res: Response) => {
//   res.status(404).json({ error: '엔드포인트를 찾을 수 없습니다.' });
// });

// // 에러 핸들링 미들웨어
// app.use((err: Error, req: Request, res: Response) => {
//   console.error('서버 에러:', err.stack);
//   res.status(500).json({ error: '서버 내부 오류입니다.' });
// });

// // 서버 시작
// app.listen(PORT, () => {
//   console.log(`서버가 포트 ${PORT}에서 시작되었습니다.`);
// });
