# HJS STUDY

학년, 학기, 과목별 학습 내용과 족보를 Markdown으로 관리하는 개인 학습 사이트입니다.

## 실행

```bash
npm ci
npm run dev
```

개발 서버는 기본적으로 `http://localhost:3000`에서 실행됩니다.

운영 빌드는 다음 순서로 확인합니다.

```bash
npm run build
npm start
```

## 콘텐츠 구조

- `content/lectures/catalog.json`: 학년, 학기, 과목 이름과 순서
- `content/lectures/<학년 ID>/<학기 ID>/<과목 ID>/lecture-*.md`: 새 강의 노트
- `content/practice/*.md`: 화면의 `족보` 탭에 표시되는 Markdown
- `content/weeks/*.md`: 개편 전에 작성한 기존 노트. 카탈로그의 `legacySource`를 통해 새 과목 구조 안에 표시됩니다.

자세한 작성법은 [콘텐츠 관리 안내](docs/content-guide.md)를 참고하세요.

## 비밀번호 설정

비밀번호는 저장소에 두지 않고 서버 환경변수로 관리합니다. 변수 목록과 설명은 [.env.example](.env.example)에 있습니다.

| 변수 | 용도 |
| --- | --- |
| `AUTH_SECRET` | 족보·관리자 인증 쿠키 서명용 비밀값 (32자 이상) |
| `PRACTICE_PASSWORD_DEFAULT` | `accessKey`가 없는 족보의 기본 비밀번호 |
| `PRACTICE_PASSWORD_<KEY>` | `accessKey`를 지정한 족보의 개별 비밀번호 |
| `ADMIN_PASSWORD` | 로컬 개발 서버의 관리자 모드 비밀번호 |

족보 frontmatter에는 비밀이 아닌 참조 이름만 적습니다.

```yaml
accessKey: cse-midterm   # → PRACTICE_PASSWORD_CSE_MIDTERM
```

- `accessKey`가 없는 족보만 기본 비밀번호로 열립니다.
- `accessKey`가 있는데 해당 변수가 없으면 기본 비밀번호로 대체하지 않고 잠긴 상태로 둡니다.
- 한 족보의 비밀번호로는 그 족보만 열립니다. 한 번 입력하면 30일 동안 유지되고, 비밀번호나 `accessKey`를 바꾸면 그 족보에 대한 기존 접속만 다시 잠깁니다.

## 관리자 모드

관리자 기능은 `npm run dev`로 실행한 로컬 사이트에서만 활성화됩니다.

- 학년, 학기, 과목 추가
- 학년명, 학기명, 과목명 수정
- 과목별 새 강의 노트 생성
- 강의 제목과 Markdown 본문 수정
- 족보 제목, 설명, Markdown 본문 수정

관리자 변경은 프로젝트의 JSON 또는 Markdown 파일에 바로 저장됩니다. 운영 배포에서는 관리자 버튼과 저장 API가 비활성화됩니다.

## 검사

```bash
npm test
npm run typecheck
npm run build
```
