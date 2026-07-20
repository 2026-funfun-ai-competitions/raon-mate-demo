# Raon Mate Backend

Java 21과 Spring Boot 4.1 기반 API 서버입니다.

## 실행

```bash
./gradlew bootRun
```

서버는 기본적으로 `http://localhost:8085`에서 실행됩니다. 상태 확인은
`GET /actuator/health`를 사용합니다.

데모 데이터는 `backend/data/raonmate.mv.db`에 저장됩니다. H2 콘솔은
`http://localhost:8085/h2-console`에서 열 수 있으며 JDBC URL은
`jdbc:h2:file:./data/raonmate`입니다.

## API 문서

- Swagger UI: `http://localhost:8085/swagger-ui.html`

## Gemini 장소 추천

Google Places에서 실제 장소 후보를 조회한 뒤 Gemini가 워크숍 조건과 설문 결과에 따라
후보를 평가하는 장소 추천 API입니다. Gemini가 임의의 장소를 추천 결과에 추가할 수 없습니다.

저장소 루트의 `.env`에 키를 입력한 뒤 환경 변수를 불러와 실행합니다.

```bash
set -a
source ../.env
set +a
./gradlew bootRun -PskipFrontendBuild
```

`POST /api/workshops/{workshopId}/venue-recommendations` 요청 예시:

```json
{
  "latitude": 37.5665,
  "longitude": 126.9780,
  "maxResults": 5,
  "additionalRequest": "대중교통 접근성이 좋은 곳을 우선해 주세요."
}
```

위도와 경도는 함께 생략할 수 있으며, 생략하면 워크숍의 출발 위치 문자열을 기준으로 검색합니다.
API 키가 없거나 Gemini 호출에 실패하면 대체 추천 없이 `503 AI_SERVICE_UNAVAILABLE`을 반환합니다.
Google Places에서 확인된 장소만 반환하며, 각 장소에는 공식 `mapUri`, `placeId`, 평점과
리뷰 수가 포함됩니다. 신뢰 가능한 워크숍 견적이 없으므로 예상 비용은 `null`로 반환됩니다.
동일 조건의 결과는 기본 10분 동안 캐시되고 새 생성 요청은 워크숍별 10초 간격으로 제한됩니다.

공개 배포에서는 `.env`의 `RECOMMENDATION_API_TOKEN`을 설정하고 요청에 다음 헤더를 추가하세요.
토큰을 설정하지 않으면 로컬 개발 편의를 위해 헤더 검사를 수행하지 않습니다.

```text
X-Recommendation-Key: 설정한_토큰
```
- OpenAPI JSON: `http://localhost:8085/v3/api-docs`

## 워크숍 설문 API

```text
POST /api/workshops                         워크숍 생성
GET  /api/workshops                         워크숍 목록
GET  /api/workshops/{id}                    워크숍 조회
POST /api/workshops/{id}/survey/generate    기본 설문 생성
GET  /api/workshops/{id}/survey             설문 및 응답 수 조회
POST /api/workshops/{id}/survey/open        설문 공개
POST /api/workshops/{id}/survey/close       설문 종료
POST /api/workshops/{id}/survey/responses   참여자 응답 제출
```

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

## 환경 변수

| 이름 | 기본값 | 설명 |
| --- | --- | --- |
| `SERVER_PORT` | `8085` | 서버 포트 |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:3000,http://localhost:5173` | 허용할 프론트엔드 Origin 목록 |
| `GOOGLE_PLACES_API_KEY` | `GEMINI_API_KEY` 값 | Places API (New)가 활성화된 Google Cloud API 키 |

운영 환경에서는 `CORS_ALLOWED_ORIGINS`를 실제 프론트엔드 주소로 지정하세요.

## 패키지 구조

```text
com.raonmate.backend
├── global          # 공통 설정, 예외 처리
└── {domain}        # 도메인별 controller/service/repository/dto
```

기능 추가 시 `com.raonmate.backend.{domain}` 아래에 도메인 단위로 구성합니다.
