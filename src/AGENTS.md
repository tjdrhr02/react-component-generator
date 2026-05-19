# src/AGENTS.md

## Module Context

React 19 + TypeScript 프론트엔드. Vite 개발 서버(포트 5173)가 `/api/*` 요청을 `localhost:3002`로 프록시하여 Bun 서버와 통신한다.

## Tech Stack & Constraints

- React 19 (Concurrent 기능 사용 가능).
- 상태 관리: React 내장 훅만 사용 (Redux, Zustand 등 외부 라이브러리 추가 불필요).
- 스타일링: 전역 CSS (`src/index.css`, `src/App.css`). Tailwind, CSS Modules 없음.
- react-live `noInline` 모드: `LiveProvider`에 전달하는 코드는 반드시 `render()` 호출 포함.

## Implementation Patterns

- 타입 추가 시 `src/types/index.ts`에 통합. 컴포넌트 내부 타입만 파일 내 로컬 정의 허용.
- 새 훅 작성: `src/hooks/use<Name>.ts`, 반환 인터페이스는 파일 내부에 정의.
- `GeneratedComponent` ID 생성 패턴 유지: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`.

## Local Golden Rules

**Do's:**
- `useComponentGenerator` 훅이 컴포넌트 생성 상태의 단일 소스(single source of truth)다. 생성 로직이나 `fetch('/api/generate')` 직접 호출을 컴포넌트에 작성하지 마라.
- `LivePreview`에 전달하는 `code` prop은 서버 응답값을 그대로 사용한다. 클라이언트에서 재가공하지 마라.

**Don'ts:**
- 외부 상태 관리 라이브러리를 도입하지 마라.
- `GeneratedComponent` 타입에 불필요한 AI 메타데이터 필드를 추가하지 마라 — 필요한 경우 `src/types/index.ts`에서 합의 후 변경.
