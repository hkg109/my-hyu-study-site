# 정시개 통번역 강의 노트 통폐합 계획

## 1. 조사 범위와 결론

- 기존 페이지별 노트: **44개**
  - 17판: PDF 1–14쪽, 39–48쪽(24개)
  - 18판: PDF 1–13쪽, 38–44쪽(20개)
- 원본 PDF:
  - `mis-17-ch1-ch2.pdf`: 75쪽
  - `mis-18-ch3-ch4.pdf`: 74쪽
- 통합 결과: **10개 학습 단위**
  - 17판 1장 3개, 2장 2개
  - 18판 3장 3개, 4장 2개
- 판본은 한 문서 안에서 섞지 않는다. 17판은 1·2장, 18판은 3·4장의 출처로만 사용한다.

기존 frontmatter는 모든 파일이 `title`, `description`, `order`, `published`, `tags`를 사용하며 `published: true`다. 제목은 판본·PDF 쪽·책 쪽을, 설명은 페이지 단위 전체 번역임을 표시한다. 새 문서는 같은 형식을 유지하되 `duration`과 `objectives`를 추가하고 `order`를 1–10으로 연속 부여한다.

## 2. Docling 대조 결과

Docling 2.137.0의 표준 PDF 파이프라인으로 전체 PDF를 다시 변환하지 않고 다음 경계만 확인했다.

- 17판 PDF 13–16쪽: 14쪽에서 `1-2 정보시스템이란 무엇인가?`가 시작되고 15–16쪽에서 데이터·정보, 정보시스템 활동과 차원으로 이어진다. 기존 노트는 14쪽에서 끝나므로 **절 중간에서 끊긴 범위**다.
- 17판 PDF 37–40쪽: 37–38쪽은 1장 말미·참고문헌이고 39쪽부터 샤프 기업용 소셜 네트워킹 사례로 2장이 시작된다. 기존 39쪽 시작은 장 경계와 일치한다.
- 18판 PDF 12–15쪽: 13쪽의 정보시스템 설계 시사점 다음 14쪽부터 포터의 경쟁세력 모형(3.4)이 시작된다. 기존 노트는 3.3절 말미에서 끊긴 범위다.
- 18판 PDF 37–40쪽: 37쪽은 3장 말미, 38쪽은 `4장 정보시스템의 윤리적·사회적 쟁점`, 39–40쪽은 위치 추적 앱 사례다. 기존 38쪽 시작은 장 경계와 일치한다.

17판 13–16쪽은 원문 일부가 이미지로 저장되어 OCR이 필요했다. Docling OCR에는 글자 누락이 있었으므로 이미 정리된 기존 번역을 우선하고, 장·절 경계 확인에만 OCR 결과를 사용한다. 페이지 충돌이나 동일 페이지의 중복 파일은 발견되지 않았다.

## 3. 누락 구간 판정

아래 구간은 PDF에는 실제 페이지가 있으나 기존 44개 Markdown에는 없다. 따라서 “제공 자료 범위 밖”이 아니라 **원본 PDF 안의 미번역·미노트 구간**이다. 이번 작업은 기존 44개 노트의 통폐합이므로 새 사실을 임의로 채우지 않고, 통합 문서에서 범위 경계를 명시한다.

| 판본 | 기존 노트가 없는 PDF 쪽 | 책 쪽 | 판정 |
| --- | --- | --- | --- |
| 17판 | 15–38 | 47–70 | 1장 1-2절 이후부터 장말까지. 원본에는 있으나 기존 번역 없음 |
| 17판 | 49–75 | 81–107 | 2장 2-2절 이후부터 장말까지. 원본에는 있으나 기존 번역 없음 |
| 18판 | 14–37 | 84–107 | 3장 3.4절 이후부터 장말까지. 원본에는 있으나 기존 번역 없음 |
| 18판 | 45–74 | 115–144 | 4장 4.1절 이후부터 장말까지. 원본에는 있으나 기존 번역 없음 |

## 4. 기존 파일 조사 및 신규 매핑

책 쪽은 frontmatter와 출처 문구를 기준으로 확인했다. 17판은 `책 쪽 = PDF 쪽 + 32`, 18판은 `책 쪽 = PDF 쪽 + 70`으로 일관된다.

| 기존 파일 | 기존 order | 판본 / PDF / 책 쪽 | 주요 개념 | 새 통합 파일 |
| --- | ---: | --- | --- | --- |
| lecture-17-p001.md | 2 | 17판 / 1 / 33 | 제1부 질문, 1–4장 개관 | lecture-01-digital-business.md |
| lecture-17-p002.md | 3 | 17판 / 2 / 34 | 1장 목표와 사례 | lecture-01-digital-business.md |
| lecture-17-p003.md | 4 | 17판 / 3 / 35 | 스마트 매장, 센서, 무인결제 | lecture-01-digital-business.md |
| lecture-17-p004.md | 5 | 17판 / 4 / 36 | 개인화, 프로세스 재설계 | lecture-01-digital-business.md |
| lecture-17-p005.md | 6 | 17판 / 5 / 37 | 경영·조직·기술, IT 투자 가치 | lecture-01-digital-business.md |
| lecture-17-p006.md | 7 | 17판 / 6 / 38 | IT 혁신, 새 비즈니스 모델, 전자상거래 | lecture-02-globalization-digital-firm.md |
| lecture-17-p007.md | 8 | 17판 / 7 / 39 | 모바일 경영, 디지털 조직, 세계화 | lecture-02-globalization-digital-firm.md |
| lecture-17-p008.md | 9 | 17판 / 8 / 40 | 원격근무 기술과 편익 | lecture-02-globalization-digital-firm.md |
| lecture-17-p009.md | 10 | 17판 / 9 / 41 | 디지털 격차, 원격 협업 한계, 세계화 | lecture-02-globalization-digital-firm.md |
| lecture-17-p010.md | 11 | 17판 / 10 / 42 | 글로벌 가치사슬, 디지털 기업, 프로세스 | lecture-02-globalization-digital-firm.md |
| lecture-17-p011.md | 12 | 17판 / 11 / 43 | 디지털 기업, 여섯 전략 목표 | lecture-03-strategic-objectives-information-systems.md |
| lecture-17-p012.md | 13 | 17판 / 12 / 44 | 운영 우수성, 비즈니스 모델, 친밀성 | lecture-03-strategic-objectives-information-systems.md |
| lecture-17-p013.md | 14 | 17판 / 13 / 45 | 의사결정, 경쟁우위 | lecture-03-strategic-objectives-information-systems.md |
| lecture-17-p014.md | 15 | 17판 / 14 / 46 | 생존, IT·정보시스템·데이터·정보 | lecture-03-strategic-objectives-information-systems.md |
| lecture-17-p039.md | 40 | 17판 / 39 / 71 | 샤프, 기업용 소셜 네트워크 | lecture-04-business-processes-collaboration.md |
| lecture-17-p040.md | 41 | 17판 / 40 / 72 | 지식 공유, 협업, 문화 변화 | lecture-04-business-processes-collaboration.md |
| lecture-17-p041.md | 42 | 17판 / 41 / 73 | 사례 도식, 비즈니스 프로세스 | lecture-04-business-processes-collaboration.md |
| lecture-17-p042.md | 43 | 17판 / 42 / 74 | 기능별·범기능 프로세스 | lecture-04-business-processes-collaboration.md |
| lecture-17-p043.md | 44 | 17판 / 43 / 75 | 주문 이행, 프로세스 개선 | lecture-04-business-processes-collaboration.md |
| lecture-17-p044.md | 45 | 17판 / 44 / 76 | 경영 계층, TPS | lecture-05-management-level-systems.md |
| lecture-17-p045.md | 46 | 17판 / 45 / 77 | 급여 TPS, 비즈니스 인텔리전스 | lecture-05-management-level-systems.md |
| lecture-17-p046.md | 47 | 17판 / 46 / 78 | MIS, DSS | lecture-05-management-level-systems.md |
| lecture-17-p047.md | 48 | 17판 / 47 / 79 | MIS 보고서, 모형 기반 DSS | lecture-05-management-level-systems.md |
| lecture-17-p048.md | 49 | 17판 / 48 / 80 | DSS, ESS, 디지털 대시보드 | lecture-05-management-level-systems.md |
| lecture-18-p001.md | 77 | 18판 / 1 / 71 | 3장 목표 | lecture-06-organizations-and-information-systems.md |
| lecture-18-p002.md | 78 | 18판 / 2 / 72 | 도리토스 사일런트, AI/ML | lecture-06-organizations-and-information-systems.md |
| lecture-18-p003.md | 79 | 18판 / 3 / 73 | 전략, 고객 경험, 사례 도식 | lecture-06-organizations-and-information-systems.md |
| lecture-18-p004.md | 80 | 18판 / 4 / 74 | 조직과 IT의 양방향 관계 | lecture-06-organizations-and-information-systems.md |
| lecture-18-p005.md | 81 | 18판 / 5 / 75 | 기술적·행동적 조직 관점 | lecture-06-organizations-and-information-systems.md |
| lecture-18-p006.md | 82 | 18판 / 6 / 76 | 조직 특징, 루틴 | lecture-06-organizations-and-information-systems.md |
| lecture-18-p007.md | 83 | 18판 / 7 / 77 | 조직 정치·문화 | lecture-06-organizations-and-information-systems.md |
| lecture-18-p008.md | 84 | 18판 / 8 / 78 | 환경과 조직, 정보시스템의 연결 | lecture-07-environment-disruption-structure.md |
| lecture-18-p009.md | 85 | 18판 / 9 / 79 | 파괴적 기술, 선도자와 추격자 | lecture-07-environment-disruption-structure.md |
| lecture-18-p010.md | 86 | 18판 / 10 / 80 | 다섯 조직 구조, IT 영향 개관 | lecture-07-environment-disruption-structure.md |
| lecture-18-p011.md | 87 | 18판 / 11 / 81 | 거래비용·대리인 이론 | lecture-08-it-organizational-change.md |
| lecture-18-p012.md | 88 | 18판 / 12 / 82 | 조직 수평화, 저항 | lecture-08-it-organizational-change.md |
| lecture-18-p013.md | 89 | 18판 / 13 / 83 | 변화 관리, 설계 시사점 | lecture-08-it-organizational-change.md |
| lecture-18-p038.md | 114 | 18판 / 38 / 108 | 4장 목표 | lecture-09-location-data-ethical-dilemma.md |
| lecture-18-p039.md | 115 | 18판 / 39 / 109 | 위치 데이터 생태계, 동의 | lecture-09-location-data-ethical-dilemma.md |
| lecture-18-p040.md | 116 | 18판 / 40 / 110 | 규제, 프라이버시 딜레마 | lecture-09-location-data-ethical-dilemma.md |
| lecture-18-p041.md | 117 | 18판 / 41 / 111 | 윤리 정의, 기업의 책임 | lecture-09-location-data-ethical-dilemma.md |
| lecture-18-p042.md | 118 | 18판 / 42 / 112 | 윤리·사회·정치 모형 | lecture-10-information-age-moral-dimensions.md |
| lecture-18-p043.md | 119 | 18판 / 43 / 113 | 다섯 도덕적 차원, 기술 추세 | lecture-10-information-age-moral-dimensions.md |
| lecture-18-p044.md | 120 | 18판 / 44 / 114 | 프로파일링, AI·모바일·분석 | lecture-10-information-age-moral-dimensions.md |

## 5. 새 목차와 학습 단위

| order | 새 파일 | 판본·장 | 출처 범위 | 예상 학습 시간 | 중심 질문 |
| ---: | --- | --- | --- | ---: | --- |
| 1 | lecture-01-digital-business.md | 17판 1장 | PDF 1–5 / 책 33–37 | 35분 | 기술 도입이 사업 성과가 되려면 무엇이 함께 바뀌어야 하는가? |
| 2 | lecture-02-globalization-digital-firm.md | 17판 1장 | PDF 6–10 / 책 38–42 | 40분 | 정보시스템은 경영·조직·세계화를 어떻게 바꾸는가? |
| 3 | lecture-03-strategic-objectives-information-systems.md | 17판 1장 | PDF 11–14 / 책 43–46 | 35분 | 기업은 왜 정보시스템에 투자하며 IT와 IS는 어떻게 다른가? |
| 4 | lecture-04-business-processes-collaboration.md | 17판 2장 | PDF 39–43 / 책 71–75 | 40분 | 협업 시스템과 프로세스 재설계는 어떻게 성과를 만드는가? |
| 5 | lecture-05-management-level-systems.md | 17판 2장 | PDF 44–48 / 책 76–80 | 40분 | TPS·MIS·DSS·ESS는 어떤 결정과 계층을 지원하는가? |
| 6 | lecture-06-organizations-and-information-systems.md | 18판 3장 | PDF 1–7 / 책 71–77 | 45분 | 조직을 이해하지 못하면 왜 시스템 구현에 실패하는가? |
| 7 | lecture-07-environment-disruption-structure.md | 18판 3장 | PDF 8–10 / 책 78–80 | 35분 | 환경·파괴적 기술·조직 구조는 시스템 선택을 어떻게 바꾸는가? |
| 8 | lecture-08-it-organizational-change.md | 18판 3장 | PDF 11–13 / 책 81–83 | 35분 | IT는 기업 경계와 위계를 바꾸지만 왜 저항을 낳는가? |
| 9 | lecture-09-location-data-ethical-dilemma.md | 18판 4장 | PDF 38–41 / 책 108–111 | 40분 | 유용한 위치 데이터가 언제 프라이버시 침해가 되는가? |
| 10 | lecture-10-information-age-moral-dimensions.md | 18판 4장 | PDF 42–44 / 책 112–114 | 35분 | 새로운 기술의 파급효과를 어떤 윤리 틀로 평가할 것인가? |

## 6. 작성·검증 방침

1. 새 파일은 원문의 장·절 구조를 보존하되 번역을 그대로 이어 붙이지 않고 질문 중심 학습 노트로 재구성한다.
2. 영어는 시험에 필요한 핵심 용어와 짧은 원문 표현만 병기한다.
3. 각 절 끝에 PDF 링크와 책 쪽을 표시한다.
4. 17판과 18판 사이의 용어·사례 시점 차이는 별도 `판본 차이` 단락으로만 언급한다.
5. 새 파일을 먼저 `published: false`로 생성해 렌더링을 확인한 뒤 기존 파일을 보관소로 이동하고 공개 상태로 전환한다.
6. 원본 44개는 `docs/archive/mis-translation-page-splits/`에 그대로 보존한다.

## 7. 구현 및 검증 결과

- 2026-10-12에 계획한 10개 통합 문서를 생성하고 `order: 1–10`, `published: true`로 공개했다.
- 기존 44개는 `docs/archive/mis-translation-page-splits/`로 이동했으며 파일명과 내용은 보존했다.
- 과목 manifest에서 새 강의 10개와 35–45분의 학습 시간이 순서대로 로드되는 것을 확인했다.
- 44개 기존 파일이 위 매핑표에 정확히 한 번씩 등장하는지 자동 검사했다.
- PDF 파일 존재 여부와 모든 `#page=` 앵커가 각 PDF의 실제 쪽수 안에 있는지 검사했다.
- 120자 이상의 동일 단락이 새 문서 사이에서 반복되지 않음을 확인했다.
- `catalog.json`과 과목 ID·경로는 변경하지 않았다.
- `npm run lint`, `npm run typecheck`, `npm run build`는 통과했다.
- `npm test`는 18개 중 17개가 통과했다. 실패한 1개는 이 과목과 무관한 기존 practice Markdown의 난이도 순서 기대값 문제다. 강의 manifest, 중복 order, Markdown/목차, 검색 관련 검사는 통과했다.

