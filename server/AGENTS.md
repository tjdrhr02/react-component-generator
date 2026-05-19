# server/AGENTS.md

## Module Context

Bun HTTP 서버로 동작하는 AI API 프록시. 프론트엔드의 `/api/generate` 요청을 Anthropic 또는 Google API로 라우팅하고, 응답 코드를 react-live 호환 형식으로 정제하여 반환한다.

## Tech Stack & Constraints

- Bun 런타임 전용 (`Bun.serve` 사용). Node.js 호환 불필요.
- 외부 HTTP 클라이언트 라이브러리 없음 — `fetch` 직접 사용.
- 포트: `3002` 고정. 변경 시 `vite.config.ts` 프록시 설정도 함께 수정해야 함.
- 현재 사용 모델: Anthropic `claude-haiku-4-5-20251001`, Google `gemini-2.5-flash`.

## Implementation Patterns

**새 프로바이더 추가 순서:**
1. `Provider` 타입에 문자열 리터럴 추가.
2. `ENV_KEYS` 맵에 환경 변수 키 추가.
3. `call<Provider>(prompt, apiKey)` 함수 작성 (반환 타입: `Promise<string>`).
4. `/api/generate` 핸들러의 프로바이더 분기에 추가.

**응답 후처리 흐름:**
`AI 원시 텍스트` → `stripCodeFences()` → `ensureRenderCall()` → 클라이언트 반환

**엔드포인트:**
- `GET /api/config` — 환경 변수에 API 키 설정 여부 반환 (키 값 자체 노출 금지).
- `POST /api/generate` — `{ prompt, apiKey?, provider? }` 수신, `{ code }` 반환.

## Local Golden Rules

**Do's:**
- 모든 응답에 `CORS_HEADERS`를 포함한다.
- API 오류 응답은 HTTP 상태 코드와 함께 `{ error: string }` JSON 형식으로 반환한다.
- `ensureRenderCall()`은 AI가 render 호출을 누락했을 때만 추가하는 안전망이다. `SYSTEM_PROMPT`의 render 호출 지시를 제거하지 마라.

**Don'ts:**
- `SYSTEM_PROMPT`에 TypeScript 문법 허용 지시를 추가하지 마라 — react-live는 런타임 Babel 변환을 사용하므로 TypeScript 타입이 파싱 오류를 유발한다.
- `resolveApiKey()`를 우회하여 `process.env`를 직접 읽지 마라.
- `GET /api/config` 응답에 실제 API 키 값을 포함하지 마라 — 존재 여부(`boolean`)만 반환한다.
