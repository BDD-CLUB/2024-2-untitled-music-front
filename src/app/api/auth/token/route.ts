import { NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // 요청 헤더에서 쿠키를 가져옵니다.
  const cookies = req.headers.cookie || '';
  const parsedCookies = cookie.parse(cookies);

  // 특정 쿠키 값 가져오기
  const token = parsedCookies['token']; // 쿠키 이름은 서버 설정에 따라 변경

  if (!token) {
    return res.status(401).json({ message: 'Token not found' });
  }

  // 클라이언트로 반환
  res.status(200).json({ token });
}