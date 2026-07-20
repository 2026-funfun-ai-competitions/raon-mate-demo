# 라온 메이트 (front)

라온 메이트 워크숍 관리 페이지의 프론트엔드 스캐폴드입니다.

## 기술 스택

- [Vite](https://vite.dev/)
- [React](https://react.dev/) 19 + TypeScript
- [Redux Toolkit](https://redux-toolkit.js.org/) / react-redux — 전역 상태 관리
- [React Router](https://reactrouter.com/) — 라우팅
- [Tailwind CSS](https://tailwindcss.com/) — 스타일링
- [Axios](https://axios-http.com/) — API 클라이언트

## 프로젝트 구조 & import alias

`@/`는 `src/`를 가리키는 alias입니다 (`vite.config.ts`, `tsconfig.app.json` 참고). 예: `import { store } from '@/app/store'`

- `src/app` — Redux store, typed hooks
- `src/features` — 기능 단위 슬라이스
- `src/api` — Axios 클라이언트 설정
- `src/pages` — 페이지 컴포넌트
- `src/routes` — React Router 라우트 정의

## 환경 변수 설정

`.env.example`을 복사해 `.env`를 만들고 값을 채워주세요.

```bash
cp .env.example .env
```

## 스크립트

```bash
npm run dev      # 개발 서버 실행
npm run build    # 타입 체크 + 프로덕션 빌드
npm run lint     # oxlint 실행
```
