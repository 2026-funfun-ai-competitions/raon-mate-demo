# Raon Mate Backend

Java 21과 Spring Boot 4.1 기반 기업 워크숍 기획 API 서버입니다.
Google Gemini API를 활용하여 장소 추천과 일정 생성을 자동화합니다.

## 실행

```bash
./gradlew bootRun
```

서버는 기본적으로 `http://localhost:8085`에서 실행됩니다. 상태 확인은
`GET /actuator/health`를 사용합니다.

데모 데이터는 `backend/data/raonmate.mv.db`에 저장됩니다. H2 콘솔은
`http://localhost:8085/h2-console`에서 열 수 있으며 JDBC URL은
`jdbc:h2:file:./data/raonmate`입니다.

## AI 활용 아키텍처

Raon Mate는 **Google Gemini API**를 두 가지 핵심 기능에 사용합니다.

### 1. AI 장소 추천

> 구현: `venue/infrastructure/GeminiVenueRecommendationGenerator.java`

**처리 흐름:**

```
워크숍 조건 + 설문 결과 수집
        ↓
Google Places API(New)로 실제 장소 후보 검색 (최대 20건)
        ↓
후보 목록 + 워크숍 컨텍스트를 Gemini에 전달
        ↓
Gemini가 각 후보를 0~100 점수로 평가 · 순위화
        ↓
검증: 추천된 placeId가 실제 후보에 존재하는지 확인
        ↓
결과 반환 (점수, 추천 이유, 주의사항, 예상 비용)
```

**Grounding 전략** — Gemini가 임의의 장소를 생성할 수 없습니다.
- 시스템 프롬프트에서 `candidates에 존재하는 placeId만 골라 평가하라`고 지시
- 응답에 포함된 placeId가 Google Places 후보 목록에 없으면 해당 항목을 제거
- 설문 답변과 사용자 추가 요청은 "분석 데이터"로만 취급하며, 프롬프트 인젝션 방지를 위해 **명령으로 해석하지 않도록** 시스템 프롬프트에 명시

**비용 추정** — 사용자가 입력한 예산을 실제 가격 근거로 사용하지 않고, 장소 유형·지역·인원·당일/숙박 조건을 기반으로 보수적인 1인당 최소~최대 범위를 독립 추정합니다.

**캐싱 & 속도 제한:**
- 동일 조건 결과를 기본 10분간 인메모리 캐시 (최대 500건, LRU 교체)
- 워크숍별 최소 10초 요청 간격 제한 (429 응답)
- 동시 요청 시 `CompletableFuture`로 중복 AI 호출 방지

### 2. AI 일정 생성

> 구현: `schedule/infrastructure/GeminiScheduleGenerator.java`

**처리 흐름:**

```
워크숍 날짜, 유형(당일/숙박), 목적, 선택 장소 수집
        ↓
Gemini에 일정 생성 요청
        ↓
일정 항목별 시간 배치 (MOVE, MEAL, BREAK, SESSION, ACTIVITY, CHECK_IN, CHECK_OUT)
        ↓
검증: 날짜 범위 초과 및 시간 겹침 확인
        ↓
AI 실패 시 기본 일정으로 Fallback
```

- 숙박형은 전체 날짜를 활용, 당일형은 시작일 하루 안에서 구성
- 일정 항목은 워크숍당 최대 100개로 제한
- AI 호출 실패 시 하드코딩된 기본 일정을 생성하여 서비스 중단을 방지

### 공통 AI 설정

| 항목 | 값 |
| --- | --- |
| 모델 | `gemini-3.5-flash` (환경 변수로 변경 가능) |
| API 엔드포인트 | `generativelanguage.googleapis.com/v1beta/models/{model}:generateContent` |
| 응답 형식 | JSON 전용 (마크다운 코드 펜스 자동 제거) |
| 연결 타임아웃 | 3초 |
| 읽기 타임아웃 | 90초 |
| 최대 출력 토큰 | 4096 |

### Google Places 연동

> 구현: `venue/infrastructure/GooglePlacesVenueCandidateProvider.java`

- Google Places API (New)로 워크숍 조건에 맞는 장소 후보를 검색
- 검색 쿼리: 출발 위치 + "기업 워크숍 장소" + 워크숍 유형 + 필수 조건
- 위도·경도 제공 시 반경 50km 위치 편향 적용
- 반환 정보: placeId, 이름, 주소, 평점, 리뷰 수, 지도 URI, 대표 사진

장소 사진은 `/api/place-photos?name={photoName}` 엔드포인트를 통해 제공됩니다.

## API 엔드포인트

### 워크숍 관리

```text
POST   /api/workshops                          워크숍 생성
GET    /api/workshops                          워크숍 목록
GET    /api/workshops/{id}                     워크숍 조회
PUT    /api/workshops/{id}                     워크숍 수정
```

### 설문

```text
POST   /api/workshops/{id}/survey/generate     기본 설문 생성
GET    /api/workshops/{id}/survey              설문 및 응답 수 조회
POST   /api/workshops/{id}/survey/open         설문 공개
POST   /api/workshops/{id}/survey/close        설문 종료
POST   /api/workshops/{id}/survey/responses    참여자 응답 제출
```

### AI 장소 추천

```text
POST   /api/workshops/{id}/venue-recommendations              추천 생성 (Gemini)
GET    /api/workshops/{id}/venue-recommendations              최근 추천 조회
PUT    /api/workshops/{id}/venue-recommendations/selection    장소 선택 저장 (최대 3곳)
```

요청 예시:

```json
{
  "latitude": 37.5665,
  "longitude": 126.9780,
  "maxResults": 5,
  "additionalRequest": "대중교통 접근성이 좋은 곳을 우선해 주세요."
}
```

위도·경도는 함께 생략할 수 있으며, 생략하면 워크숍의 출발 위치 문자열을 기준으로 검색합니다.

### AI 일정 생성

```text
POST   /api/workshops/{id}/schedule/generate   일정 생성 (Gemini)
GET    /api/workshops/{id}/schedule            일정 조회
PUT    /api/workshops/{id}/schedule            일정 수정
```

### 예산

```text
GET    /api/workshops/{id}/budget              예산 조회
POST   /api/workshops/{id}/budget/initialize   기본 예산 항목 초기화
PUT    /api/workshops/{id}/budget              예산 수정
```

### 알림

```text
GET    /api/workshops/{id}/notifications       알림 이력 조회
POST   /api/workshops/{id}/notifications/send  알림 발송 (Slack)
```

### 기타

```text
GET    /api/place-photos?name={photoName}      Google Places 사진 조회
GET    /actuator/health                         서버 상태 확인
```

## API 문서

- Swagger UI: `http://localhost:8085/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8085/v3/api-docs`

## 환경 변수

| 이름 | 기본값 | 설명 |
| --- | --- | --- |
| `SERVER_PORT` | `8085` | 서버 포트 |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:3000,http://localhost:5173` | 허용할 프론트엔드 Origin 목록 |
| `GEMINI_API_KEY` | (필수) | Gemini API 키 |
| `GEMINI_MODEL` | `gemini-3.5-flash` | 사용할 Gemini 모델 |
| `GEMINI_CACHE_TTL` | `10m` | 추천 결과 캐시 유지 시간 |
| `GEMINI_MINIMUM_REQUEST_INTERVAL` | `10s` | 워크숍별 최소 요청 간격 |
| `GOOGLE_PLACES_API_KEY` | `GEMINI_API_KEY` 값 | Places API (New)가 활성화된 Google Cloud API 키 |
| `RECOMMENDATION_API_TOKEN` | (미설정 시 검증 생략) | 장소 추천 API 접근 토큰 |
| `SLACK_WEBHOOK_URL` | (선택) | Slack 알림 Webhook URL |

AI 기능을 사용하려면 저장소 루트의 `.env`에 키를 입력한 뒤 환경 변수를 불러와 실행합니다.

```bash
set -a
source ../.env
set +a
./gradlew bootRun -PskipFrontendBuild
```

## 에러 처리

AI 관련 에러는 다음과 같이 응답합니다.

| 상황 | HTTP 상태 | 에러 코드 |
| --- | --- | --- |
| API 키 미설정 또는 Gemini 호출 실패 | 503 | `AI_SERVICE_UNAVAILABLE` |
| 워크숍별 요청 간격 초과 | 429 | `TOO_MANY_REQUESTS` |
| 추천 API 토큰 불일치 | 401 | `UNAUTHORIZED` |

## 보안

- 장소 추천 API는 `X-Recommendation-Key` 헤더로 보호 (토큰 미설정 시 로컬 개발용으로 검증 생략)
- 토큰 검증에 상수 시간 비교(timing-safe) 적용
- 설문 응답은 AI 전달 시 참여자 정보를 제거하고 질문별 응답 빈도로 익명 집계

## 테스트

```bash
./gradlew test
```

## 프론트엔드 통합 빌드

저장소 루트의 `frontend/package.json`이 존재하면 백엔드 빌드 시 다음 작업이
자동으로 실행됩니다.

```text
npm ci → npm run build → frontend/dist를 Spring Boot static 리소스로 복사
```

통합 실행 파일은 다음 명령으로 생성합니다.

```bash
./gradlew bootJar
java -jar build/libs/raon-mate-backend-0.0.1-SNAPSHOT.jar
```

생성된 JAR 하나로 API와 React 화면을 함께 제공합니다. 프론트엔드 빌드를
생략해야 할 때는 `./gradlew bootJar -PskipFrontendBuild`를 사용합니다.

## 패키지 구조

```text
com.raonmate.backend
├── global/              # 공통 설정, 예외 처리, API 로깅
├── workshop/            # 워크숍 관리 (생성, 상태 전이)
├── survey/              # 설문 생성 · 응답 수집
├── venue/               # AI 장소 추천 (Gemini + Google Places)
├── schedule/            # AI 일정 생성 (Gemini)
├── budget/              # 예산 관리
└── notification/        # 알림 발송 (Slack)
```

각 도메인은 `api` (컨트롤러/DTO), `application` (서비스), `domain` (엔티티/리포지토리),
`infrastructure` (외부 연동) 레이어로 구성됩니다.
