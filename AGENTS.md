# AGENTS.md

## Operational Commands

```bash
bun install          # 의존성 설치
bun run dev          # API 서버 + Vite 프론트엔드 동시 실행 (포트: 3002, 5173)
bun run server       # Bun API 서버만 실행 (포트: 3002)
bun run build        # TypeScript 컴파일 + Vite 빌드
bun run lint         # ESLint 자동 수정
bun run type-check   # TypeScript 타입 검사 (빌드 없음)
```

**필수 도구:** `bun` 고정. `npm`, `yarn`, `pnpm` 절대 사용 금지.

## Golden Rules

**Immutable:**
- API 키를 코드에 하드코딩하지 마라. 반드시 환경 변수(`ANTHROPIC_API_KEY`, `GOOGLE_API_KEY`) 또는 클라이언트 요청으로만 처리한다.
- AI가 생성하는 컴포넌트 코드는 **순수 JavaScript**여야 한다. TypeScript 문법(타입 어노테이션, 인터페이스, 제네릭, `as` 캐스트) 절대 허용 금지.
- 생성된 컴포넌트는 `render(<ComponentName />)` 호출로 끝나야 한다 — react-live `noInline` 모드의 필수 요구사항.

**Do's:**
- 서버 코드(`server/`)에서 `fetch` API를 직접 사용한다 (axios 등 HTTP 클라이언트 불필요).
- 새 AI 프로바이더 추가 시 `server/index.ts`의 `Provider` 타입과 `ENV_KEYS` 맵을 함께 업데이트한다.
- 공유 타입은 `src/types/index.ts`에 통합 관리한다.

**Don'ts:**
- 생성된 컴포넌트에 CSS 파일, CSS 모듈, 외부 라이브러리 임포트를 사용하지 마라 — 인라인 스타일만 허용.
- `server/index.ts`의 `SYSTEM_PROMPT`를 검토 없이 변경하지 마라. 생성 품질과 react-live 렌더링 호환성에 직접 영향을 미친다.

## Project Context

프롬프트 입력을 받아 AI로 React 컴포넌트를 즉시 생성하고, 브라우저에서 실시간 미리보기와 코드를 제공하는 도구.

**Tech Stack:** React 19, TypeScript 5.9, Vite 8, Bun, react-live, Anthropic Claude API, Google Gemini API

## Standards

**코딩 컨벤션:**
- TypeScript strict 모드 (`tsconfig.app.json` 기준).
- 컴포넌트는 Named Export 사용 (`export function ComponentName`).
- 커스텀 훅은 `src/hooks/` 디렉토리에 `use` 접두사로 작성.

**Git:**
- 커밋 메시지: `type(scope): 한국어 설명` 형식.
- 타입: `feat`, `fix`, `refactor`, `chore`, `docs`.

**TDD:** 테스트 주도 개발 규칙 → [.claude/rules/TDD.md](./.claude/rules/TDD.md) 참조.

**Maintenance Policy:** 이 파일의 규칙과 실제 코드 동작이 달라진 경우, 즉시 업데이트를 제안하라.

## Context Map

- **[AI API 서버 수정 (server/)](./server/AGENTS.md)** — Bun 서버, AI 프로바이더 라우팅, SYSTEM_PROMPT 수정 시.
- **[프론트엔드 컴포넌트/훅 (src/)](./src/AGENTS.md)** — React 컴포넌트, 커스텀 훅, 타입 정의 수정 시.
