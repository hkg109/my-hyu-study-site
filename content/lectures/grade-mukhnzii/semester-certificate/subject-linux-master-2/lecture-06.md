---
title: "6편 · 셸 — 개념·환경 변수·히스토리·프롬프트"
description: "2과목 2장. 셸의 역할과 종류, 로그인 셸 확인·변경, 셸 변수와 환경 변수, bash 설정 파일의 실행 순서, alias, history 확장, PS1 이스케이프까지 시험 포인트 중심으로 정리합니다."
order: 6
published: true
duration: 80
tags: [리눅스마스터 2급, 자격증, 2과목, 셸, bash, 환경 변수, history, PS1]
objectives:
  - sh·csh·ksh·tcsh·bash·zsh의 계보와 특징을 구분하고, 현재·로그인 셸을 확인하고 바꾼다.
  - 셸 변수와 환경 변수의 차이를 말하고 export·env·set·unset으로 다룬다.
  - 로그인 셸과 비로그인 셸에서 bash 설정 파일이 실행되는 순서를 쓴다.
  - alias, history 확장(!!, !n, !문자열), PS1 이스케이프를 읽고 쓴다.
---

## 학습 경로 · 2과목 2장

[← 5편 · 파일 시스템 명령어와 물리 구조](/lectures/grade-mukhnzii/semester-certificate/subject-linux-master-2/lecture-05) · [다음: 7편 · 프로세스 관리 →](/lectures/grade-mukhnzii/semester-certificate/subject-linux-master-2/lecture-07)

**범위:** 2과목 2장 "셸" — 셸의 개념과 종류, 환경 변수와 셸 변수, 셸 환경 설정 파일, alias와 history, 프롬프트(PS1).

**형광펜 읽는 법:** ==yellow:노랑== 핵심 정의·결론 · ==red:빨강== 시험에서 헷갈리는 구분·함정 · ==blue:파랑== 외워야 할 순서·목록

> [!EXAM]
> **이 장의 핵심 질문:** 사용자가 친 한 줄의 명령은 누가 해석하고, 그 사람만의 작업 환경(변수, 별칭, 프롬프트)은 어디에 저장되어 로그인할 때마다 되살아나는가?
>
> **전체 흐름:** ==blue:셸의 역할과 종류 → 셸 확인·변경(/etc/shells, chsh) → 변수(셸 변수 vs 환경 변수) → 설정 파일 실행 순서 → alias·history → 프롬프트 PS1==

---

## 단원 도입

| 출제 포인트 | 빈도 | 이렇게 나온다 |
|---|:---:|---|
| 셸 종류와 개발자·특징 (sh, csh, ksh, bash, zsh) | ★★★ | "Bill Joy가 만든 C 언어 문법의 셸은?", 발전 순서 |
| 로그인 셸 확인·변경 (`echo $SHELL`, `/etc/shells`, `chsh`) | ★★★ | 사용 가능한 셸 목록 파일, `chsh -s` 결과 |
| 환경 변수 이름과 의미 (PATH, HOME, PS1, HISTSIZE…) | ★★★ | 설명 → 변수 이름 고르기 |
| `export`, `env`, `set`, `unset` 구분 | ★★★ | "환경 변수만 출력", "셸 변수까지 모두 출력" |
| 설정 파일 실행 순서 | ★★★ | `/etc/profile` → `~/.bash_profile` → `~/.bashrc` → `/etc/bashrc` |
| history 확장 (`!!`, `!n`, `!-n`, `!문자열`) | ★★ | 출력 결과 고르기 |
| PS1 이스케이프 (`\u` `\h` `\w` `\W` `\t` `\$`) | ★★ | 프롬프트 모양 → PS1 값 |
| alias / unalias | ★★ | 별칭 설정·해제 명령 |

> [!PAGEBREAK]

## PART 1 · 셸이란 무엇이고 어떤 것이 있나

## 1. 셸의 개념과 기능

### 핵심 필기

> [!CONCEPT]
> **셸(Shell)** — 사용자가 입력한 명령을 해석해 커널에 전달하고 결과를 돌려주는 ==명령어 해석기(command interpreter)==. 커널을 조개껍데기처럼 감싸고 있는 사용자 인터페이스라서 셸이라 부른다.

- **명령어 해석기:** 프롬프트에서 받은 명령을 해석해 실행한다.
- **프로그래밍 언어:** 변수·조건·반복을 쓰는 **셸 스크립트**를 실행한다(인터프리터 방식, 컴파일 불필요).
- **사용자 환경 설정:** 환경 변수, 별칭, 프롬프트 등 개인 환경을 설정 파일로 구성한다.

```text
사용자 ──(명령 입력)──▶ 셸 ──(시스템 호출)──▶ 커널 ──▶ 하드웨어
        ◀──(결과 출력)──
```

> [!NOTE]
> 셸은 커널의 일부가 아니라 ==일반 사용자 프로그램==이다. 그래서 사용자마다 다른 셸을 쓸 수 있고, 로그인한 뒤 다른 셸을 또 실행할 수도 있다(그 셸은 원래 셸의 자식 프로세스가 된다).

## 2. 셸의 종류

### 핵심 필기

| 셸 | 경로 | 개발 | 특징 | 기본 프롬프트 |
|---|---|---|---|:---:|
| **sh** (Bourne shell) | `/bin/sh` | 스티븐 본(Stephen Bourne), AT&T 벨 연구소, 1977 | 유닉스 최초의 표준 셸, 단순·빠름, 히스토리·별칭 없음 | `$` |
| **csh** (C shell) | `/bin/csh` | 빌 조이(Bill Joy), 버클리(BSD) | ==C 언어와 비슷한 문법==, 히스토리·별칭·작업 제어 도입 | `%` |
| **ksh** (Korn shell) | `/bin/ksh` | 데이비드 콘(David Korn), AT&T, 1983 | ==sh와 호환==되면서 csh의 히스토리·별칭 기능 추가 | `$` |
| **tcsh** | `/bin/tcsh` | csh 확장판 | csh 호환 + 명령행 편집, 자동 완성 | `>` |
| **bash** (Bourne Again Shell) | `/bin/bash` | 브라이언 폭스(Brian Fox), ==GNU 프로젝트==, 1989 | sh 호환 + csh·ksh 장점, ==대부분 리눅스의 기본 셸== | `$` |
| **dash** (Debian Almquist shell) | `/bin/dash` | ash 계열 | 가볍고 빠름, 데비안·우분투의 `/bin/sh` | `$` |
| **zsh** (Z shell) | `/bin/zsh` | 폴 팔스타드(Paul Falstad), 1990 | ksh 기반에 bash·tcsh 기능을 대거 흡수, 강력한 자동 완성·테마 | `%` |

**계보로 묶어 외우기**

- ==blue:Bourne 계열: sh → ksh → bash → zsh== (스크립트 문법이 sh와 호환)
- ==blue:C 셸 계열: csh → tcsh==

> [!TRAP]
> ==red:bash는 Bourne Again Shell이지 "Bill Joy의 셸"이 아니다.== Bill Joy는 csh(그리고 vi)의 개발자다. 또 bash는 GNU 프로젝트 소속이므로 "리처드 스톨먼이 직접 만든 셸"이라는 보기도 틀린 표현이다(개발자는 브라이언 폭스).

> [!TRAP]
> ==red:root의 프롬프트는 셸 종류와 상관없이 보통 샵(#) 기호다.== `$`(Bourne 계열)와 `%`(C 셸 계열)는 일반 사용자 기본값이다.

## 3. 현재 셸 확인과 로그인 셸 변경

### 핵심 필기

| 목적 | 명령·파일 |
|---|---|
| 로그인 셸 확인 | `echo $SHELL` (환경 변수 SHELL), `/etc/passwd`의 ==7번째 필드== |
| 지금 실행 중인 셸 확인 | `echo $0`, `ps` |
| 사용 가능한 셸 목록 | **`/etc/shells`**, `chsh -l` (Red Hat 계열 util-linux의 chsh) |
| 로그인 셸 변경 | `chsh -s /bin/csh 사용자`, `usermod -s /bin/csh 사용자` |
| 잠시 다른 셸 쓰기 | 셸 이름 입력(예: `csh`) → 자식 셸 실행, `exit`로 복귀 |

```bash
$ echo $SHELL
/bin/bash
$ cat /etc/shells
# /etc/shells: valid login shells
/bin/sh
/bin/bash
/usr/bin/bash
/bin/rbash
/usr/bin/dash
$ grep '^kim:' /etc/passwd
kim:x:1001:1001::/home/kim:/bin/bash
$ chsh -s /bin/sh kim          # 다음 로그인부터 /bin/sh
$ grep '^kim:' /etc/passwd
kim:x:1001:1001::/home/kim:/bin/sh
```

> [!TRAP]
> `chsh`로 바꾼 ==red:로그인 셸은 지금 셸이 아니라 다음 로그인부터 적용된다.== 그래서 바꾼 직후 `echo $SHELL`은 여전히 이전 값이 나올 수 있다. 또 `/etc/shells`에 없는 경로는 일반 사용자가 로그인 셸로 지정할 수 없다.

> [!CHECK]
> **1.** 시스템에서 로그인 셸로 쓸 수 있는 셸의 목록이 들어 있는 파일은?
>
> **2.** C 언어와 비슷한 문법을 가진 셸과 그 확장판을 쓰시오.
>
> **3.** 사용자 lee의 로그인 셸을 `/bin/zsh`로 바꾸는 명령을 두 가지 쓰시오.

> [!PAGEBREAK]

## PART 2 · 변수와 설정 파일

## 4. 셸 변수와 환경 변수

### 핵심 필기

| 구분 | 셸 변수(지역 변수) | 환경 변수(전역 변수) |
|---|---|---|
| 범위 | ==현재 셸에서만== 유효 | 현재 셸 + ==자식 프로세스에 상속== |
| 만드는 법 | `NAME=value` | `export NAME=value` 또는 `NAME=value; export NAME` |
| 확인 | `set` (셸 변수 + 환경 변수 + 함수 전부) | `env`, `printenv`, `export` (환경 변수만) |

**변수 다루는 명령**

| 명령 | 역할 |
|---|---|
| `NAME=value` | 셸 변수 선언 — 등호 양쪽에 ==공백이 없어야 한다== |
| `echo $NAME` | 변수 값 출력 |
| `export NAME` | 셸 변수를 환경 변수로 바꾼다 |
| `export -n NAME` | 환경 변수 속성만 제거(셸 변수로 남음) |
| `unset NAME` | 변수 자체를 삭제 |
| `set` | 셸 변수·환경 변수·함수 모두 출력 |
| `env` / `printenv` | 환경 변수만 출력 (`printenv HOME`처럼 하나만도 가능) |
| `readonly NAME` | 읽기 전용 변수로 만든다 |

```bash
$ A=10
$ bash -c 'echo "child A=[$A]"'     # 자식 셸에는 안 보인다
child A=[]
$ export A
$ bash -c 'echo "child A=[$A]"'     # export 후에는 상속된다
child A=[10]
$ unset A
$ echo "A=[$A]"
A=[]
```

> [!TRAP]
> `A = 10`처럼 띄어 쓰면 ==red:변수 선언이 아니라 A라는 명령을 실행하려다 오류가 난다.== 또 `set`과 `env`의 차이는 단골이다: 셸 변수까지 보이는 쪽이 `set`, 환경 변수만 보이는 쪽이 `env`.

### 주요 환경 변수

| 변수 | 의미 |
|---|---|
| `HOME` | 사용자 홈 디렉터리 |
| `PATH` | 명령을 찾을 디렉터리 목록(`:`로 구분) |
| `PWD` / `OLDPWD` | 현재 / 직전 작업 디렉터리 (`cd -`가 OLDPWD 사용) |
| `USER`, `LOGNAME` | 사용자 이름 / 로그인 이름 |
| `UID` | 사용자 UID |
| `SHELL` | 로그인 셸 경로 |
| `HOSTNAME` | 호스트 이름 |
| `TERM` | 터미널 종류 |
| `LANG` | 언어·로캘 (예: `ko_KR.UTF-8`) |
| `MAIL` | 메일 수신함 경로 |
| `PS1` / `PS2` | 기본 프롬프트 / 2차 프롬프트(명령이 다음 줄로 이어질 때, 기본 `> `) |
| `HISTFILE` | 히스토리 저장 파일 (기본 `~/.bash_history`) |
| `HISTSIZE` | ==메모리==에 기억할 히스토리 개수 |
| `HISTFILESIZE` | ==히스토리 파일==에 저장할 최대 줄 수 |
| `TMOUT` | 입력이 없으면 자동 로그아웃할 초 |
| `DISPLAY` | X 윈도우 출력 위치 (11편) |

**특수 변수(셸이 자동으로 채움)**

| 변수 | 의미 |
|---|---|
| `$$` | 현재 셸의 PID |
| `$?` | 직전 명령의 종료 상태(0이면 성공) |
| `$!` | 마지막 백그라운드 작업의 PID |
| `$0` | 실행 중인 셸·스크립트 이름 |
| `$1`…`$9` | 위치 매개변수(인자) |
| `$#` | 인자 개수 |
| `$*`, `$@` | 모든 인자 |

```bash
$ false; echo $?
1
$ true; echo $?
0
$ set -- a b c; echo $# $1 $@
3 a a b c
```

### 따옴표와 명령 치환

| 표기 | 동작 |
|---|---|
| `'…'` 작은따옴표 | 안의 모든 문자를 글자 그대로 (변수 치환 안 함) |
| `"…"` 큰따옴표 | `$`, 백틱, `\`만 해석하고 나머지는 글자 그대로 |
| 백틱 또는 `$(…)` | 명령 치환 — 명령을 실행한 결과로 바꾼다 |
| `\` | 바로 뒤 한 글자의 특수 의미를 없앤다 |

```bash
$ echo '$HOME' "$HOME" $(echo hi) \$HOME
$HOME /root hi $HOME
```

## 5. 셸 환경 설정 파일과 실행 순서

### 핵심 필기

| 파일 | 적용 대상 | 실행 시점 | 주로 넣는 것 |
|---|---|---|---|
| **`/etc/profile`** | 시스템 전체 사용자 | 로그인할 때 | 환경 변수(PATH 등), 시작 프로그램 |
| `/etc/profile.d/*.sh` | 시스템 전체 | `/etc/profile`이 불러옴 | 패키지별 환경 설정 |
| **`/etc/bashrc`** (데비안 계열은 `/etc/bash.bashrc`) | 시스템 전체 | bash가 실행될 때 (`~/.bashrc`가 불러옴) | 전역 alias, 함수, 기본 PS1 |
| **`~/.bash_profile`** | 개인 | 로그인할 때 | 개인 환경 변수, 시작 프로그램 |
| `~/.bash_login`, `~/.profile` | 개인 | `~/.bash_profile`이 없을 때 대신 | 데비안 계열은 `~/.profile` 사용 |
| **`~/.bashrc`** | 개인 | bash가 실행될 때마다 | 개인 alias, 함수 |
| `~/.bash_logout` | 개인 | ==로그아웃할 때== | 화면 지우기, 임시 파일 정리 |
| `~/.bash_history` | 개인 | 셸 종료 시 기록 | 명령 히스토리 |

**로그인 셸의 실행 순서 (Red Hat 계열 기준)**

==blue:/etc/profile → ~/.bash_profile → ~/.bashrc → /etc/bashrc==

- `/etc/profile`이 먼저 읽히고 그 안에서 `/etc/profile.d/*.sh`를 불러온다.
- `~/.bash_profile`은 안에서 `~/.bashrc`를 불러오고, `~/.bashrc`가 다시 `/etc/bashrc`를 불러온다.
- 로그인하지 않고 터미널 창만 새로 연 **비로그인 대화형 셸**은 `~/.bashrc`(→ `/etc/bashrc`)만 읽는다.
- 로그아웃 시 `~/.bash_logout`이 실행된다.

[![로그인 셸은 /etc/profile, profile.d, ~/.bash_profile, ~/.bashrc, /etc/bashrc 순으로 읽고 비로그인 셸은 ~/.bashrc부터 읽으며 로그아웃 시 ~/.bash_logout이 실행되는 흐름도](/materials/diagrams/lm2-l06a-bash-startup.svg)](/materials/diagrams/lm2-l06a-bash-startup.svg)

*그림 6-1 · bash 설정 파일이 읽히는 순서 — 누르면 원본 크기로 열린다.*

> [!NOTE]
> - **읽는 순서:** 왼쪽 기둥(로그인 셸)을 위에서 아래로 따라간다. 오른쪽 비로그인 셸은 중간인 `~/.bashrc`에서 합류한다.
> - **핵심:** ==/etc는 전체 사용자, 홈 디렉터리는 개인==. profile 계열은 로그인 때 한 번, bashrc 계열은 셸을 열 때마다 읽힌다.
> - **시험 포인트:** 로그아웃 때 실행되는 파일은 ==red:개인 bash_logout 하나뿐==이다(`~/.bash_logout`). "모든 사용자에게 적용되는 환경 변수"를 넣을 곳은 `/etc/profile`.

```bash
$ cat ~/.bash_profile
# .bash_profile
if [ -f ~/.bashrc ]; then
        . ~/.bashrc                 # 개인 bashrc를 불러온다
fi
PATH=$PATH:$HOME/bin
export PATH
$ vi ~/.bashrc                      # alias를 추가한 뒤
$ source ~/.bashrc                  # 또는 . ~/.bashrc — 다시 로그인하지 않고 즉시 적용
```

> [!CONCEPT]
> **source (= `.`)** — 스크립트를 자식 셸이 아니라 ==현재 셸에서 실행==한다. 그래서 설정 파일 안의 변수·별칭이 지금 셸에 바로 반영된다. `bash ~/.bashrc`처럼 실행하면 자식 셸에만 적용되고 끝나 버린다.

> [!TRAP]
> ==red:"전체 사용자" 파일은 /etc 아래에, "개인" 파일은 홈 디렉터리에 점(.)으로 시작하는 숨김 파일로 있다.== `/etc/.bashrc`, `~/bashrc` 같은 경로는 존재하지 않는 함정 보기다.

> [!NOTE]
> C 셸 계열은 이름이 다르다: 전역 `/etc/csh.cshrc`, `/etc/csh.login`, 개인 `~/.cshrc`, `~/.login`, `~/.logout`. 환경 변수는 `setenv NAME value`로 만든다.

> [!CHECK]
> **4.** 셸 변수를 자식 프로세스에도 전달되는 환경 변수로 만드는 명령은?
>
> **5.** 셸 변수와 환경 변수, 셸 함수까지 모두 출력하는 명령과 환경 변수만 출력하는 명령은?
>
> **6.** 로그아웃할 때 실행되는 개인 설정 파일은?

> [!PAGEBREAK]

## PART 3 · 편의 기능 — alias, history, 프롬프트

## 6. alias — 명령에 별명 붙이기

### 핵심 필기

| 명령 | 역할 |
|---|---|
| `alias` | 현재 설정된 별칭 전체 출력 |
| `alias 이름='명령'` | 별칭 설정 (`=` 양쪽 공백 없음) |
| `alias 이름` | 해당 별칭만 출력 |
| `unalias 이름` | 별칭 해제 |
| `unalias -a` | 모든 별칭 해제 |
| `\명령` | 그 순간만 별칭을 무시하고 원래 명령 실행 |

```bash
$ alias ll='ls -l'
$ alias ll
alias ll='ls -l'
$ type ll
ll is aliased to `ls -l'
$ unalias ll
$ type ll
bash: type: ll: not found
```

> [!NOTE]
> Red Hat 계열 root의 `~/.bashrc`에는 `alias rm='rm -i'`, `alias cp='cp -i'`, `alias mv='mv -i'`가 들어 있어 덮어쓰기·삭제 전에 확인을 묻는다. 별칭은 ==셸을 닫으면 사라지므로== 영구히 쓰려면 `~/.bashrc`에 적는다.

## 7. history — 명령 기록과 재실행

### 핵심 필기

| 명령 | 뜻 |
|---|---|
| `history` | 기록 전체를 번호와 함께 출력 |
| `history 10` | 최근 10개만 출력 |
| `history -c` | 메모리의 기록 삭제 |
| `history -w` | 현재 기록을 히스토리 파일에 기록 |
| **`!!`** | 바로 직전 명령 재실행 |
| **`!n`** | n번 명령 재실행 |
| `!-n` | n번째 이전 명령 재실행 (`!-1` = `!!`) |
| **`!문자열`** | 그 문자열로 ==시작하는== 가장 최근 명령 |
| `!?문자열?` | 그 문자열을 ==포함하는== 가장 최근 명령 |
| `^old^new` | 직전 명령의 old를 new로 바꿔 실행 |
| `!$` | 직전 명령의 마지막 인자 |
| `!^` / `!*` | 직전 명령의 첫 인자 / 모든 인자 |
| `fc -l` | 기록 목록 (history와 비슷) |

**관련 변수:** `HISTSIZE`(메모리 개수), `HISTFILESIZE`(파일 줄 수), `HISTFILE`(파일 경로), `HISTTIMEFORMAT`(시간 표시 형식), `HISTCONTROL`(`ignoredups` 연속 중복 무시, `ignorespace` 공백으로 시작하는 명령 무시, `ignoreboth` 둘 다).

> [!EXAMPLE]
> **bash -i 에서 실제로 돌려 본 결과**
>
> ```bash
> $ echo hello
> hello
> $ ls -d /etc
> /etc
> $ date +%Y
> 2026
> $ !!            # 직전 명령
> date +%Y
> 2026
> $ !e            # e로 시작하는 최근 명령
> echo hello
> hello
> $ !?etc?        # etc를 포함하는 최근 명령
> ls -d /etc
> /etc
> $ echo one two three
> one two three
> $ ^three^four^
> echo four
> four
> ```
>
> 히스토리 확장은 실행 전에 ==확장된 명령을 한 줄 먼저 보여 준다==.

> [!TRAP]
> `!n`은 ==red:"n번 명령"==, `!-n`은 ==red:"n개 전 명령"==이다. 또 `HISTSIZE`와 `HISTFILESIZE`를 바꿔 묻는다: 메모리(셸이 켜져 있는 동안) 쪽이 HISTSIZE, 파일(`~/.bash_history`) 쪽이 HISTFILESIZE다.

> [!NOTE]
> 기록은 셸이 끝날 때 `~/.bash_history`에 저장된다. 그래서 같은 사용자가 터미널 두 개를 열면 먼저 닫은 쪽 기록이 나중 쪽에 덮이거나 합쳐질 수 있다.

## 8. 프롬프트 — PS1 이스케이프

### 핵심 필기

`PS1`은 기본 프롬프트 문자열이고, 백슬래시 이스케이프로 정보를 끼워 넣는다. Red Hat 계열 기본값은 `PS1='[\u@\h \W]\$ '` → `[root@server1 ~]#`.

| 이스케이프 | 뜻 | 예 |
|---|---|---|
| **`\u`** | 사용자 이름 | `kim` |
| **`\h`** | 호스트 이름(첫 번째 `.` 앞까지) | `server1` |
| `\H` | 호스트 이름 전체 | `server1.example.com` |
| **`\w`** | 현재 디렉터리 ==전체 경로== (홈은 `~`) | `/usr/local/bin` |
| **`\W`** | 현재 디렉터리의 ==마지막 이름만== | `bin` |
| `\t` | 24시간 `HH:MM:SS` | `17:19:57` |
| `\T` | 12시간 `HH:MM:SS` | `05:19:57` |
| `\@` | 12시간 am/pm | `05:19 PM` |
| `\A` | 24시간 `HH:MM` | `17:19` |
| `\d` | "요일 월 일" | `Fri Oct 30` |
| `\s` | 셸 이름 | `bash` |
| `\v` / `\V` | bash 버전 / 버전+패치 | `5.2` / `5.2.21` |
| `\!` | 이 명령의 히스토리 번호 | `512` |
| `\#` | 이 셸에서 실행한 명령 번호 | `7` |
| `\j` | 현재 작업(job) 개수 | `0` |
| **`\$`** | root면 `#`, 일반 사용자면 `$` | `#` |
| `\n` | 줄바꿈 | |
| `\\` | 백슬래시 문자 | |

```bash
$ cd /usr/local/bin
$ PS1='\w|\W|\t|\T|\@|\A|\d|\s|\v|\V|\$ '
/usr/local/bin|bin|17:19:57|05:19:57|05:19 PM|17:19|Fri Oct 30|bash|5.2|5.2.21|# 
$ PS1='[\u@\h \W]\$ '
[root@vm bin]#
```

위 출력은 root로 실행했기 때문에 `\$`가 `#`로 바뀌었다.

> [!TRAP]
> `\w`(소문자)는 ==red:전체 경로==, `\W`(대문자)는 ==red:마지막 디렉터리 이름만== `\h`/`\H`도 같은 대소문자 함정이다. `\t`는 24시간, `\T`는 12시간.

> [!CHECK]
> **7.** 직전 명령을 다시 실행하는 히스토리 확장과, "vi"로 시작하는 가장 최근 명령을 실행하는 확장을 쓰시오.
>
> **8.** 프롬프트를 `kim@server1:/var/log$` 모양으로 만드는 PS1 값을 쓰시오.
>
> **9.** 히스토리 파일에 저장할 최대 줄 수를 정하는 변수는?

> [!PAGEBREAK]

## 기출 유형 연습

> [!QUIZ]
> 다음 중 셸에 대한 설명으로 틀린 것은?
>
> **A.** bash는 GNU 프로젝트로 개발되었으며 Bourne 셸과 호환된다.
>
> **B.** csh는 Bill Joy가 개발했으며 C 언어와 유사한 문법을 가진다.
>
> **C.** ksh는 csh를 확장한 셸로 명령행 자동 완성 기능을 처음 도입했다.
>
> **D.** 사용 가능한 셸 목록은 `/etc/shells`에서 확인한다.

> [!HINT 1]
> csh를 확장한 셸은 이름 앞에 한 글자가 더 붙는다.

> [!ANSWER]
> **C.** ksh(Korn shell)는 David Korn이 만든 ==Bourne 셸 호환== 셸이다. csh를 확장한 것은 **tcsh**다.

> [!QUIZ]
> 사용자가 로그인할 때 bash 설정 파일이 실행되는 순서로 옳은 것은? (Red Hat 계열 기준)
>
> **A.** `~/.bashrc` → `~/.bash_profile` → `/etc/bashrc` → `/etc/profile`
>
> **B.** `/etc/profile` → `~/.bash_profile` → `~/.bashrc` → `/etc/bashrc`
>
> **C.** `/etc/bashrc` → `/etc/profile` → `~/.bashrc` → `~/.bash_profile`
>
> **D.** `/etc/profile` → `/etc/bashrc` → `~/.bash_profile` → `~/.bash_logout`

> [!HINT 1]
> 시스템 전체 profile이 가장 먼저이고, 개인 profile이 개인 bashrc를 부른다.

> [!ANSWER]
> **B.** `/etc/profile` → `~/.bash_profile` → `~/.bashrc` → `/etc/bashrc`. `~/.bash_logout`은 로그아웃 때 실행되므로 로그인 순서에 끼지 않는다.

> [!QUIZ]
> 다음 명령을 차례로 입력했을 때 마지막 줄의 출력은?
>
> ```bash
> $ NAME=linux
> $ bash
> $ echo "[$NAME]"
> ```
>
> **A.** `[linux]`
>
> **B.** `[]`
>
> **C.** `[$NAME]`
>
> **D.** `bash: NAME: command not found`

> [!HINT 1]
> `bash`를 입력하면 새 자식 셸이 뜬다. export를 했는가?

> [!ANSWER]
> **B.** `NAME`은 export하지 않은 ==셸 변수==라 자식 셸에 상속되지 않는다. 큰따옴표 안의 `$NAME`은 치환되지만 값이 비어 있어 `[]`가 출력된다.

> [!QUIZ]
> 프롬프트에 "사용자이름@호스트명 현재디렉터리의 마지막 이름"과 root 여부 기호가 나오도록 하는 설정은?
>
> **A.** `PS1='[\u@\h \W]\$ '`
>
> **B.** `PS1='[\h@\u \w]\$ '`
>
> **C.** `PS2='[\u@\h \W]\$ '`
>
> **D.** `PS1='[\U@\H \w]# '`

> [!HINT 1]
> 기본 프롬프트 변수 이름과 `\W`(대문자)의 뜻을 떠올린다.

> [!ANSWER]
> **A.** `\u` 사용자, `\h` 호스트, `\W` 마지막 디렉터리 이름, `\$`는 root면 `#`. C는 2차 프롬프트 PS2, D의 `\U`는 PS1 이스케이프가 아니고 `#`은 고정 문자다.

> [!QUIZ]
> 환경 변수에 대한 설명으로 옳지 않은 것은?
>
> **A.** `HISTSIZE`는 메모리에 저장할 히스토리 개수다.
>
> **B.** `env`는 셸 변수와 환경 변수를 모두 출력한다.
>
> **C.** `export -n`은 환경 변수를 셸 변수로 되돌린다.
>
> **D.** `PATH`의 디렉터리들은 콜론(:)으로 구분한다.

> [!HINT 1]
> 셸 변수까지 보여 주는 명령은 `set`이다.

> [!ANSWER]
> **B.** `env`(와 `printenv`)는 ==환경 변수만== 출력한다. 셸 변수까지 모두 보려면 `set`.

> [!PAGEBREAK]

## 단원 마무리

### 장 요약

| 주제 | 꼭 기억할 것 |
|---|---|
| 셸 종류 | ==blue:Bourne 계열 sh → ksh → bash → zsh, C 계열 csh → tcsh==. bash = GNU, Brian Fox |
| 셸 확인·변경 | `echo $SHELL`, `echo $0`, `/etc/shells`, `chsh -s`, `/etc/passwd` 7번째 필드 |
| 변수 | 셸 변수는 현재 셸만, `export`하면 환경 변수로 상속. `set`은 전부, `env`는 환경 변수만 |
| 설정 파일 | ==blue:/etc/profile → ~/.bash_profile → ~/.bashrc → /etc/bashrc==, 로그아웃 `~/.bash_logout` |
| alias | `alias 이름='명령'`, `unalias`, 영구 설정은 `~/.bashrc` |
| history | `!!` 직전, `!n` n번, `!-n` n개 전, `!문자열` 시작, `^a^b` 치환. HISTSIZE(메모리) vs HISTFILESIZE(파일) |
| PS1 | `\u` 사용자, `\h` 호스트, `\w` 전체 경로, `\W` 마지막 이름, `\t` 24시간, `\$` root면 # |

## 책을 덮고 꺼내 보기

- 사용 가능한 로그인 셸 목록 파일은 {{/etc/shells}}다.
- C 셸을 확장해 명령행 편집을 넣은 셸은 {{tcsh}}다.
- 셸 변수를 환경 변수로 바꾸는 명령은 {{export}}다.
- 환경 변수만 출력하는 명령은 {{env}} 또는 printenv다.
- 로그인할 때 모든 사용자에게 적용되는 설정 파일은 {{/etc/profile}}이다.
- 로그아웃할 때 실행되는 파일은 {{~/.bash_logout}}이다.
- 직전 명령을 다시 실행하는 히스토리 확장은 {{!!}}다.
- PS1에서 현재 디렉터리 전체 경로는 {{\w}}, 마지막 이름만은 {{\W}}다.

> [!FLASHCARD]
> Q: sh, csh, ksh, bash의 개발자는?
> A: sh — Stephen Bourne(AT&T), csh — Bill Joy(BSD), ksh — David Korn(AT&T), bash — Brian Fox(GNU 프로젝트).

> [!FLASHCARD]
> Q: 로그인 셸을 확인·변경하는 방법은?
> A: 확인은 `echo $SHELL` 또는 `/etc/passwd` 7번째 필드, 변경은 `chsh -s 셸경로 사용자` 또는 `usermod -s`. 사용 가능 목록은 `/etc/shells`(`chsh -l`).

> [!FLASHCARD]
> Q: set, env, export의 차이는?
> A: `set`은 셸 변수·환경 변수·함수를 모두, `env`/`printenv`는 환경 변수만 출력한다. `export NAME`은 셸 변수를 환경 변수로 만든다(인자 없이 쓰면 환경 변수 목록).

> [!FLASHCARD]
> Q: 로그인 셸의 bash 설정 파일 실행 순서는?
> A: `/etc/profile`(→ `/etc/profile.d/*.sh`) → `~/.bash_profile` → `~/.bashrc` → `/etc/bashrc`. 비로그인 셸은 `~/.bashrc`부터. 로그아웃은 `~/.bash_logout`.

> [!FLASHCARD]
> Q: !n, !-n, !문자열, !?문자열? 의 차이는?
> A: `!n`은 n번 명령, `!-n`은 n개 전 명령, `!문자열`은 그 문자열로 시작하는 최근 명령, `!?문자열?`은 그 문자열을 포함하는 최근 명령.

> [!FLASHCARD]
> Q: HISTSIZE와 HISTFILESIZE의 차이는?
> A: HISTSIZE는 셸이 메모리에 기억하는 개수, HISTFILESIZE는 `~/.bash_history` 파일에 저장하는 최대 줄 수.

> [!FLASHCARD]
> Q: PS1 이스케이프 \u \h \w \W \t \$ 의 뜻은?
> A: 사용자 이름, 호스트 이름(첫 점 앞), 현재 디렉터리 전체 경로, 현재 디렉터리 마지막 이름, 24시간 시각, root면 `#` 아니면 `$`.

**다음으로 갈 기준:** 설정 파일 네 개의 순서와 `set`/`env` 차이를 보지 않고 말할 수 있으면 다음 편으로 간다: [7편 · 프로세스 관리](/lectures/grade-mukhnzii/semester-certificate/subject-linux-master-2/lecture-07).

> [!PAGEBREAK]

## 정답과 해설

### 확인 문제 정답

1. **`/etc/shells`** — 레드햇 계열에서는 `chsh -l`로도 볼 수 있다.
2. **csh**(C shell)와 그 확장판 **tcsh**.
3. `chsh -s /bin/zsh lee`, `usermod -s /bin/zsh lee` — 다음 로그인부터 적용된다.
4. **`export`** (`export NAME` 또는 `export NAME=value`).
5. 전부 출력은 **`set`**, 환경 변수만은 **`env`**(또는 `printenv`).
6. **`~/.bash_logout`**.
7. 직전 명령은 **`!!`**, vi로 시작하는 최근 명령은 **`!vi`**.
8. **`PS1='\u@\h:\w\$ '`** — `/var/log` 전체 경로가 나와야 하므로 소문자 `\w`, 일반 사용자라 `\$`가 `$`로 표시된다.
9. **`HISTFILESIZE`** — 메모리 쪽은 HISTSIZE.
