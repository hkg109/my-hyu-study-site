---
title: "7편 · 프로세스 관리 — 확인·제어·종료·작업"
description: "2과목 3장. PID·PPID와 프로세스 상태, 포그라운드·백그라운드·데몬·고아·좀비, ps·pstree·top·pgrep, nice·renice, kill과 시그널 번호, jobs·fg·bg·nohup, at과 cron 작업 예약까지 시험 포인트 중심으로 정리합니다."
order: 7
published: true
duration: 90
tags: [리눅스마스터 2급, 자격증, 2과목, 프로세스, 시그널, kill, nice, cron]
objectives:
  - PID·PPID, 프로세스 상태 코드(R·S·D·T·Z)와 프로세스 유형(데몬·고아·좀비)을 설명한다.
  - ps·pstree·top·pgrep 출력의 주요 필드와 옵션을 읽는다.
  - nice·renice로 우선순위를 바꾸고, kill·killall·pkill과 시그널 번호(1·2·9·15·18·19·20)를 쓴다.
  - jobs·fg·bg·nohup으로 작업을 제어하고, at과 crontab 다섯 필드로 작업을 예약한다.
---

## 학습 경로 · 2과목 3장

[← 6편 · 셸](/lectures/grade-mukhnzii/semester-certificate/subject-linux-master-2/lecture-06) · [다음: 8편 · 에디터 vi/vim →](/lectures/grade-mukhnzii/semester-certificate/subject-linux-master-2/lecture-08)

**범위:** 2과목 3장 "프로세스 관리" — 프로세스의 개념과 유형, 프로세스 확인(ps, pstree, top, pgrep), 우선순위(nice, renice), 시그널과 종료(kill, killall, pkill), 작업 제어(jobs, fg, bg, nohup), 작업 예약(at, cron).

**형광펜 읽는 법:** ==yellow:노랑== 핵심 정의·결론 · ==red:빨강== 시험에서 헷갈리는 구분·함정 · ==blue:파랑== 외워야 할 순서·목록

> [!EXAM]
> **이 장의 핵심 질문:** 지금 돌고 있는 프로그램을 어떻게 찾아내고, 우선순위를 바꾸고, 멈추거나 끝내고, 정해진 시간에 다시 돌게 만드는가?
>
> **전체 흐름:** ==blue:프로세스 개념(PID·PPID·상태) → 확인(ps·pstree·top·pgrep) → 우선순위(nice·renice) → 시그널과 종료(kill) → 작업 제어(&·jobs·fg·bg·nohup) → 예약(at·cron)==

---

## 단원 도입

| 출제 포인트 | 빈도 | 이렇게 나온다 |
|---|:---:|---|
| 시그널 번호와 이름 (1, 2, 9, 15, 18, 19, 20) | ★★★ | "kill의 기본 시그널은?", 번호 ↔ 이름 |
| crontab 필드 순서와 해석 | ★★★ | 예약 문장 → crontab 줄 고르기 |
| ps 옵션과 출력 필드 (aux, -ef, STAT) | ★★★ | "PPID까지 보이는 옵션은?" |
| nice 값 범위·renice 사용법 | ★★★ | 범위 -20–19, 일반 사용자 제약 |
| jobs·fg·bg·Ctrl+Z | ★★ | 정지된 작업을 백그라운드로 보내기 |
| 좀비·고아·데몬 | ★★ | 설명 → 용어 |
| nohup, at, atq, atrm | ★★ | 로그아웃 후에도 실행, 1회성 예약 |
| top 대화형 키, pstree, pgrep/pkill | ★ | 키 → 기능 |

> [!PAGEBREAK]

## PART 1 · 프로세스란 무엇인가

## 1. 프로세스의 개념

### 핵심 필기

> [!CONCEPT]
> **프로세스(Process)** — 디스크에 있는 프로그램이 메모리에 올라와 ==실행 중인 상태==. 같은 프로그램(`/bin/bash`)을 여러 번 실행하면 프로세스는 여러 개가 된다.

| 용어 | 뜻 |
|---|---|
| **PID** (Process ID) | 커널이 프로세스마다 붙이는 고유 번호 |
| **PPID** (Parent PID) | 이 프로세스를 만든 ==부모 프로세스의 PID== |
| **PID 1** | 부팅 때 커널이 처음 띄우는 프로세스 — `systemd`(예전엔 `init`). 모든 프로세스의 조상 |
| **fork** | 부모가 자기 자신을 복제해 자식 프로세스를 만드는 것 (새 PID) |
| **exec** | 현재 프로세스의 내용을 새 프로그램으로 ==덮어써서== 실행 (PID 유지) |

> [!NOTE]
> 셸에서 `ls`를 치면 셸이 fork로 자식을 만들고, 자식이 exec로 `ls` 프로그램으로 바뀐다. 셸은 자식이 끝날 때까지 기다렸다가(wait) 다음 프롬프트를 띄운다. 그래서 `ls`의 PPID는 그 셸의 PID다.

## 2. 프로세스 상태

### 핵심 필기

`ps`의 STAT(S) 열에 나오는 상태 코드:

| 코드 | 상태 | 뜻 |
|:---:|---|---|
| **R** | Running / Runnable | 실행 중이거나 실행 대기(run queue) |
| **S** | Interruptible Sleep | 이벤트를 기다리며 잠듦 — 시그널로 깨울 수 있음 (대부분이 이 상태) |
| **D** | Uninterruptible Sleep | 주로 디스크 I/O를 기다림 — 시그널로 깨울 수 없음 |
| **T** | Stopped | 시그널(SIGSTOP·SIGTSTP)로 정지됨 |
| **Z** | Zombie | 종료했지만 부모가 회수하지 않아 프로세스 테이블에 남음 (`<defunct>`) |
| **I** | Idle | 유휴 커널 스레드 |

**STAT 뒤에 붙는 보조 기호:** `<` 높은 우선순위, `N` 낮은 우선순위, `s` 세션 리더, `l` 멀티스레드, `+` 포그라운드 프로세스 그룹.

[![실행 대기 R과 실행 중 상태가 서로 오가고, 이벤트 대기로 S·D, SIGSTOP·SIGTSTP로 정지 T, SIGCONT로 복귀, 종료 후 부모가 회수하기 전까지 좀비 Z가 되는 상태 전이도](/materials/diagrams/lm2-l07a-process-states.svg)](/materials/diagrams/lm2-l07a-process-states.svg)

*그림 7-1 · 프로세스 상태 전이와 시그널 — 누르면 원본 크기로 열린다.*

> [!NOTE]
> - **읽는 순서:** 위의 생성(fork)에서 시작해 가운데 검은 R 상자를 중심으로 왼쪽(대기 S·D), 오른쪽(정지 T), 아래(종료 → Z)로 읽는다.
> - **핵심:** ==T는 시그널로 멈춘 것, S는 스스로 기다리는 것==. 둘 다 CPU를 쓰지 않지만 깨우는 방법이 다르다.
> - **시험 포인트:** ==red:정지 19(STOP)·20(TSTP), 재개 18(CONT)==. 좀비는 이미 죽어 있어 kill로 지울 수 없고 부모가 회수해야 사라진다.

```bash
$ sleep 50 &
$ kill -STOP %1; ps -o pid,stat,cmd -p $!
  PID STAT CMD
 1653 T    sleep 50
$ kill -CONT %1; ps -o pid,stat,cmd -p $!
  PID STAT CMD
 1653 S    sleep 50
```

## 3. 프로세스의 유형

### 핵심 필기

| 유형 | 뜻 |
|---|---|
| **포그라운드(Foreground)** | 터미널을 차지하고 실행 — 끝날 때까지 프롬프트가 돌아오지 않음 |
| **백그라운드(Background)** | 명령 뒤에 `&` — 프롬프트를 바로 돌려받고 뒤에서 실행 |
| **데몬(Daemon)** | 터미널 없이(`TTY ?`) 백그라운드에서 ==요청을 기다리며 상주==하는 서비스 프로세스. 이름 끝에 d가 많다(`sshd`, `httpd`, `crond`) |
| **고아(Orphan)** | ==부모가 먼저 종료==된 자식 — PID 1(systemd/init)이 새 부모가 되어 거둔다 |
| **좀비(Zombie)** | ==자식은 종료했는데 부모가 종료 상태를 회수(wait)하지 않아== 프로세스 테이블에 항목만 남은 것 |

**데몬 실행 방식:** ==standalone==(항상 메모리에 상주, 응답 빠름, 예: httpd) vs ==inetd/xinetd==(슈퍼 데몬이 요청이 올 때만 해당 서비스를 띄움, 자원 절약, 예: telnet). 현재 배포판은 systemd가 서비스를 관리한다.

```bash
$ ps -eo pid,ppid,stat,cmd | grep -E 'parent|defunct'
 1582     1 S    parent ...
 1584  1582 Z    [python3] <defunct>
```

> [!TRAP]
> ==red:고아는 "부모가 먼저 죽은 살아 있는 자식", 좀비는 "죽었는데 부모가 거두지 않은 자식"이다.== 좀비는 CPU·메모리는 거의 쓰지 않고 PID만 차지한다. 해결은 ==부모 프로세스를 종료==(그러면 PID 1이 입양해 회수)하거나 부모가 SIGCHLD를 처리하게 하는 것이다.

> [!CHECK]
> **1.** 부모 프로세스가 먼저 종료되어 PID 1이 새 부모가 된 프로세스를 무엇이라 하는가?
>
> **2.** `ps`의 STAT 열에서 T와 Z는 각각 무슨 상태인가?
>
> **3.** fork와 exec 중 PID가 새로 생기는 쪽은?

> [!PAGEBREAK]

## PART 2 · 프로세스 확인

## 4. ps — 프로세스 스냅숏

### 핵심 필기

`ps`는 세 가지 옵션 문법을 받는다: ==유닉스(System V) 스타일== `-e -f`, ==BSD 스타일(하이픈 없음)== `a u x`, GNU 긴 옵션 `--sort`.

| 옵션 | 뜻 |
|---|---|
| (없음) | 현재 터미널에서 실행한 내 프로세스만 |
| `-e`, `-A` | 모든 프로세스 |
| `-f` | 풀 포맷 — UID, ==PPID==, C, STIME, CMD 표시 |
| `-l` | 롱 포맷 — F, S, PRI, NI, WCHAN 등 |
| `-u 사용자` | 특정 사용자의 프로세스 |
| `-p PID` | 특정 PID |
| `-o 필드,…` | 출력할 필드를 직접 지정 |
| `a` | 터미널에 연결된 모든 사용자의 프로세스 |
| `u` | 사용자 중심 포맷(USER, %CPU, %MEM…) |
| `x` | ==터미널이 없는 프로세스(데몬)까지== |

```bash
$ ps aux | head -3
USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root         1  0.0  0.1  25892  6596 ?        Ss   09:16   0:01 /sbin/init
root         2  0.0  0.0      0     0 ?        S    09:16   0:00 [kthreadd]
$ ps -ef | head -3
UID        PID  PPID  C STIME TTY          TIME CMD
root         1     0  0 09:16 ?        00:00:01 /sbin/init
root         2     0  0 09:16 ?        00:00:00 [kthreadd]
$ ps -l
F S   UID   PID  PPID  C PRI  NI ADDR SZ WCHAN  TTY          TIME CMD
0 S  1001  2210  2209  0  80   0 -  2024 do_wai pts/0    00:00:00 bash
4 R  1001  2301  2210  0  80   0 -  2516 -      pts/0    00:00:00 ps
```

| 필드 | 뜻 |
|---|---|
| `USER` / `UID` | 소유자 |
| `%CPU`, `%MEM` | CPU·메모리 사용률 |
| `VSZ` | 가상 메모리 크기(KB) |
| `RSS` | 실제 물리 메모리 사용량(KB) |
| `TTY` | 연결된 터미널 (`?` = 터미널 없음, 데몬) |
| `STAT` / `S` | 상태 코드 |
| `START` / `STIME` | 시작 시각 |
| `TIME` | 누적 CPU 사용 시간 |
| `C` | CPU 사용률(스케줄링용) |
| `PRI` / `NI` | 우선순위 / nice 값 |

> [!TRAP]
> `ps aux`에는 ==red:PPID가 없고==, `ps -ef`에는 ==red:%CPU·%MEM이 없다==. "부모 프로세스 번호까지 확인"이면 `-ef`(또는 `-l`), "메모리 사용률 확인"이면 `aux`. 또 BSD 스타일 `aux`에 하이픈을 붙인 `ps -aux`는 의미가 달라질 수 있는 비표준 표기다.

## 5. pstree · top · pgrep

### 핵심 필기

**pstree** — 프로세스의 부모-자식 관계를 ==트리 모양==으로 출력.

| 옵션 | 뜻 |
|---|---|
| `-p` | PID 함께 표시 |
| `-u` | UID가 바뀌는 지점에 사용자 이름 표시 |
| `-h` | 현재 프로세스와 조상 강조 |
| `-n` | 이름 대신 PID 순 정렬 |

```bash
$ pstree -p | head -3
systemd(1)-+-sshd(812)---sshd(2205)---bash(2210)---pstree(2330)
           |-crond(790)
           `-rsyslogd(745)-+-{rsyslogd}(750)
```

**top** — 실시간으로 갱신되는 프로세스 모니터.

```bash
$ top -b -n 1 | head -8
top - 17:21:47 up 4 min,  0 user,  load average: 0.63, 0.33, 0.13
Tasks:  80 total,   1 running,  79 sleeping,   0 stopped,   0 zombie
%Cpu(s):  0.0 us,  0.0 sy,  0.0 ni,100.0 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st
MiB Mem :  16091.2 total,  14776.1 free,    718.1 used,    900.6 buff/cache
MiB Swap:      0.0 total,      0.0 free,      0.0 used.  15373.0 avail Mem

  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND
  812 root      20   0   15432   9120   7680 S   0.3   0.1   0:00.42 sshd
```

| 실행 옵션 | 뜻 | 대화형 키 | 뜻 |
|---|---|---|---|
| `-d 초` | 갱신 간격 | `h`, `?` | 도움말 |
| `-p PID` | 특정 PID만 | `q` | 종료 |
| `-u 사용자` | 특정 사용자만 | **`k`** | ==kill== — PID와 시그널 입력 |
| `-b` | 배치 모드(파일로 저장할 때) | **`r`** | ==renice== — nice 값 변경 |
| `-n 횟수` | 갱신 횟수 후 종료 | `P` / `M` / `T` | CPU / 메모리 / 시간 순 정렬 |
| | | `u` | 사용자 필터 |
| | | `space` | 즉시 갱신 |

**pgrep / pkill** — 이름·사용자·터미널 조건으로 PID를 찾거나(pgrep) 시그널을 보낸다(pkill).

| 옵션 | 뜻 |
|---|---|
| `-l` | 이름도 함께 출력 (pgrep) |
| `-u 사용자` | 사용자 조건 |
| `-t 터미널` | 터미널 조건 (예: `-t pts/1`) |
| `-x` | 이름이 정확히 일치 |
| `-f` | 전체 명령행으로 검색 |
| `-n` / `-o` | 가장 최근 / 가장 오래된 하나 |

```bash
$ pgrep -l sshd
812 sshd
2205 sshd
$ pgrep -u kim -l
3101 bash
3150 vim
```

> [!CHECK]
> **4.** 터미널이 없는 데몬까지 포함해 모든 사용자의 프로세스를 사용자 중심 포맷으로 보는 BSD 스타일 ps 옵션은?
>
> **5.** top 실행 중 특정 프로세스의 nice 값을 바꾸려면 어떤 키를 누르나?

> [!PAGEBREAK]

## PART 3 · 우선순위와 시그널

## 6. nice · renice — 우선순위 조정

### 핵심 필기

> [!CONCEPT]
> **nice 값(NI)** — 프로세스가 CPU를 얼마나 "양보"할지를 나타내는 값. ==범위는 -20(가장 높은 우선순위)부터 19(가장 낮은 우선순위)까지==, 기본값 0. 값이 클수록 친절하게(nice) 양보하므로 우선순위는 낮아진다. `ps -l`의 PRI는 보통 80 + NI로 표시된다.

| 명령 | 뜻 |
|---|---|
| `nice 명령` | nice 값을 ==기본 10만큼 증가==시켜 실행 |
| `nice -n 10 명령` | NI를 10 증가시켜 실행 |
| `nice -10 명령` | NI를 10 증가 (옛 표기, `-n 10`과 같음) |
| `nice --10 명령` | NI를 ==10 감소==(= -10) — root만 가능 |
| `renice 값 -p PID` | 실행 중인 프로세스의 NI를 ==그 값으로 지정== |
| `renice 값 -u 사용자` | 해당 사용자의 모든 프로세스 |
| `renice 값 -g 그룹` | 프로세스 그룹 |

```bash
$ nice -n 10 sleep 30 &
$ ps -o pid,ni,cmd -p $!
  PID  NI CMD
 1025  10 sleep 30
$ renice -n 5 -p 1025
1025 (process ID) old priority 10, new priority 5
$ renice +15 1025
1025 (process ID) old priority 5, new priority 15
```

> [!TRAP]
> ==red:nice는 "현재 값에 더하기", renice는 "그 값으로 바꾸기"다.== `nice -10`은 마이너스 10이 아니라 +10이다(앞의 하이픈은 옵션 기호). 그리고 ==일반 사용자는 NI를 올리기(우선순위 낮추기)만 할 수 있고==, 0 미만으로 내리는 것은 root만 가능하다.

## 7. 시그널과 kill · killall · pkill

### 핵심 필기

> [!CONCEPT]
> **시그널(Signal)** — 프로세스에 보내는 ==소프트웨어 인터럽트==. 받은 프로세스는 기본 동작(종료, 정지 등)을 하거나 직접 정의한 처리기를 실행한다. 단 ==SIGKILL(9)과 SIGSTOP(19)은 무시하거나 가로챌 수 없다==.

| 번호 | 이름 | 기본 동작 | 언제 |
|:---:|---|---|---|
| ==1== | **SIGHUP** | 종료 | 터미널 연결이 끊김. 데몬에게는 ==설정 파일 다시 읽기==로 자주 씀 |
| ==2== | **SIGINT** | 종료 | 키보드 ==Ctrl+C== |
| 3 | SIGQUIT | 종료 + 코어 덤프 | 키보드 Ctrl+\\ |
| ==9== | **SIGKILL** | 강제 종료 | 무시 불가, 정리 작업 없이 즉시 |
| 11 | SIGSEGV | 종료 + 코어 덤프 | 잘못된 메모리 접근 |
| ==15== | **SIGTERM** | 종료 | ==kill의 기본 시그널==, 정상 종료 요청 |
| 17 | SIGCHLD | 무시 | 자식이 종료·정지되었음을 부모에게 알림 |
| ==18== | **SIGCONT** | 재개 | 정지된 프로세스를 다시 실행 (fg·bg가 사용) |
| ==19== | **SIGSTOP** | 정지 | 무시 불가 정지 |
| ==20== | **SIGTSTP** | 정지 | 키보드 ==Ctrl+Z== |

```bash
$ kill -l | head -4
 1) SIGHUP	 2) SIGINT	 3) SIGQUIT	 4) SIGILL	 5) SIGTRAP
 6) SIGABRT	 7) SIGBUS	 8) SIGFPE	 9) SIGKILL	10) SIGUSR1
11) SIGSEGV	12) SIGUSR2	13) SIGPIPE	14) SIGALRM	15) SIGTERM
16) SIGSTKFLT	17) SIGCHLD	18) SIGCONT	19) SIGSTOP	20) SIGTSTP
$ kill -l 15
TERM
$ kill -l TERM
15
```

**종료 명령 비교**

| 명령 | 대상 지정 | 예 |
|---|---|---|
| `kill` | ==PID== 또는 작업 번호(`%n`) | `kill 1234`, `kill -9 1234`, `kill -s KILL 1234`, `kill -SIGKILL 1234`, `kill %1` |
| `killall` | ==프로세스 이름== | `killall httpd`, `killall -9 vim` |
| `pkill` | 이름·사용자·터미널 등 ==조건== | `pkill -u kim`, `pkill -9 -t pts/2` |

같은 시그널은 `-9`, `-KILL`, `-SIGKILL`, `-s KILL` 어느 표기로도 보낼 수 있다.

> [!TRAP]
> 시그널 없이 `kill PID`만 쓰면 ==red:9가 아니라 15(SIGTERM)가 간다.== 또 Ctrl+C(2, INT)와 Ctrl+Z(20, TSTP)를 바꿔 묻는다: Ctrl+C는 종료, Ctrl+Z는 일시 정지다. 정지된 작업은 사라진 것이 아니라 jobs 목록에 남아 있다.

> [!EXAMPLE]
> **데몬 설정만 다시 읽히기**
>
> ```bash
> $ pgrep -x sshd -o          # 부모 sshd의 PID
> 812
> $ kill -HUP 812             # = kill -1 812 : 접속 중인 세션은 유지하고 설정만 다시 읽는다
> ```

> [!CHECK]
> **6.** 사용자 kim의 모든 프로세스를 강제 종료하는 pkill 명령을 쓰시오.
>
> **7.** 실행 중인 PID 2000의 nice 값을 -5로 지정하는 명령과, 이 명령을 실행할 수 있는 사용자는?

> [!PAGEBREAK]

## PART 4 · 작업 제어와 예약

## 8. 포그라운드·백그라운드 작업 제어

### 핵심 필기

| 명령·키 | 뜻 |
|---|---|
| `명령 &` | 백그라운드로 실행 — `[작업번호] PID` 출력 |
| ==Ctrl+Z== | 포그라운드 작업을 ==일시 정지==(SIGTSTP)하고 프롬프트로 |
| Ctrl+C | 포그라운드 작업 종료(SIGINT) |
| `jobs` | 현재 셸의 작업 목록 (`-l`이면 PID도) |
| `fg %n` | n번 작업을 ==포그라운드==로 |
| `bg %n` | 정지된 n번 작업을 ==백그라운드에서 계속== 실행 |
| `kill %n` | n번 작업에 SIGTERM |
| `%+` / `%-` | 현재 작업(가장 최근) / 그 이전 작업 — jobs에서 `+`, `-`로 표시 |

```bash
$ sleep 100 &
[1] 1108
$ sleep 200 &
[2] 1109
$ jobs
[1]-  Running                 sleep 100 &
[2]+  Running                 sleep 200 &
$ vi memo.txt            # 편집 중 Ctrl+Z
[3]+  Stopped                 vi memo.txt
$ fg %3                  # 다시 vi 화면으로
```

> [!NOTE]
> 작업 번호(`%1`)는 ==그 셸 안에서만 유효한 번호==이고, PID는 시스템 전체에서 유일한 번호다. 다른 터미널에서 띄운 작업은 내 셸의 `jobs`에 보이지 않는다.

**nohup — 로그아웃해도 계속 실행**

로그아웃하면 셸은 자식들에게 SIGHUP(1)을 보내 함께 종료시킨다. `nohup`은 ==SIGHUP을 무시하게 해서== 로그아웃 뒤에도 실행을 이어 가게 한다. 터미널 출력은 `nohup.out`에 쌓인다.

```bash
$ nohup ./backup.sh &
[1] 2450
nohup: ignoring input and appending output to 'nohup.out'
```

> [!TRAP]
> ==red:nohup만으로는 백그라운드가 되지 않는다.== 프롬프트를 돌려받으려면 뒤에 `&`를 붙여야 한다. 출력 파일은 현재 디렉터리의 `nohup.out`(쓸 수 없으면 `~/nohup.out`)이다.

## 9. 작업 예약 — at (한 번)

### 핵심 필기

`at`은 정해진 시각에 ==한 번만== 실행한다. `atd` 데몬이 처리한다.

| 명령 | 뜻 |
|---|---|
| `at 시각` | 예약 입력 시작 — 명령을 입력하고 ==Ctrl+D==로 마침 |
| `at -f 파일 시각` | 파일에 적힌 명령을 예약 |
| `atq` (= `at -l`) | 예약 목록 |
| `atrm 번호` (= `at -d 번호`) | 예약 삭제 |
| `batch` | 시스템 부하가 낮을 때 실행 |

시각 표현 예: `at 10:30`, `at 10:30 pm`, `at now + 5 minutes`, `at now + 2 hours`, `at 9am tomorrow`, `at midnight`, `at noon`, `at 4pm + 3 days`.

```bash
$ at now + 5 minutes
at> tar czf /backup/home.tgz /home
at> <EOT>                    # Ctrl+D
job 3 at Fri Oct 30 17:40:00 2026
$ atq
3	Fri Oct 30 17:40:00 2026 a root
$ atrm 3
```

**접근 제어:** `/etc/at.allow`가 있으면 그 목록의 사용자만 사용 가능, 없으면 `/etc/at.deny`에 적힌 사용자만 금지.

## 10. 작업 예약 — cron (반복)

### 핵심 필기

`cron`은 주기적으로 ==반복==하는 작업을 실행한다. `crond`(데비안 계열은 `cron`) 데몬이 매분 확인한다.

| 명령 | 뜻 |
|---|---|
| `crontab -e` | 내 crontab 편집 |
| `crontab -l` | 내 crontab 내용 출력 |
| `crontab -r` | 내 crontab ==전체 삭제== |
| `crontab -u 사용자 -e` | (root) 다른 사용자의 crontab 편집 |
| `crontab 파일` | 파일 내용을 crontab으로 등록 |

**crontab 한 줄의 필드 — 6개**

==blue:분 · 시 · 일 · 월 · 요일 · 명령==

| 필드 | 범위 |
|---|---|
| 분(minute) | 0–59 |
| 시(hour) | 0–23 |
| 일(day of month) | 1–31 |
| 월(month) | 1–12 (또는 jan…dec) |
| 요일(day of week) | ==0–7 (0과 7이 일요일)==, 1=월요일 … 6=토요일 |
| 명령 | 실행할 명령 |

| 기호 | 뜻 | 예 |
|---|---|---|
| `*` | 모든 값 | 시 필드의 `*` = 매시 |
| `,` | 여러 값 나열 | `1,15` = 1일과 15일 |
| `-` | 범위 | `1-5` = 월–금 |
| `/` | 간격 | `*/10` = 10마다 |

```bash
$ crontab -l
# 분 시 일 월 요일 명령
30 2 * * *     /root/backup.sh              # 매일 02:30
0 9 * * 1-5    /usr/bin/report.sh           # 평일(월–금) 09:00
*/10 * * * *   /usr/local/bin/check.sh      # 10분마다
0 0 1 * *      /usr/sbin/logrotate.sh       # 매월 1일 00:00
0 18 * * 0     /home/kim/weekly.sh          # 매주 일요일 18:00
0 12 1,15 * *  /home/kim/pay.sh             # 매월 1일·15일 12:00
```

**관련 파일**

| 파일 | 뜻 |
|---|---|
| `/var/spool/cron/사용자` | 사용자별 crontab 저장 위치(레드햇 계열, 데비안 계열은 `/var/spool/cron/crontabs/`) |
| `/etc/crontab` | 시스템 crontab — ==요일과 명령 사이에 사용자 이름 필드==가 하나 더 있음 |
| `/etc/cron.d/` | 패키지별 시스템 cron 파일 |
| `/etc/cron.hourly`, `cron.daily`, `cron.weekly`, `cron.monthly` | 넣어 두면 주기별로 실행되는 스크립트 디렉터리 |
| `/etc/cron.allow`, `/etc/cron.deny` | 사용 허가·금지 사용자 (allow가 우선) |

```text
# /etc/crontab 형식
SHELL=/bin/bash
PATH=/sbin:/bin:/usr/sbin:/usr/bin
# 분 시 일 월 요일 사용자 명령
17 *  *  *  *  root  run-parts /etc/cron.hourly
```

> [!TRAP]
> ==red:필드 순서는 "분 시 일 월 요일"이다.== "시 분"으로 착각해 2시 30분을 `2 30 * * *`로 쓰면 오답이다(시 필드에 30은 허용 범위 0–23을 벗어난다). 맞는 줄은 `30 2 * * *`. 또 `* 2 * * *`는 "2시에 한 번"이 아니라 ==2시대의 매분(60번)== 실행이다. `crontab -r`은 확인 없이 전부 지운다.

> [!CHECK]
> **8.** 매주 월요일부터 금요일까지 오후 6시 30분에 `/root/a.sh`를 실행하는 crontab 줄을 쓰시오.
>
> **9.** 정지된 작업 2번을 백그라운드에서 계속 실행시키는 명령은?
>
> **10.** at 예약 목록을 보는 명령 두 가지는?

> [!PAGEBREAK]

## 기출 유형 연습

> [!QUIZ]
> `kill` 명령을 시그널 지정 없이 실행했을 때 전달되는 시그널은?
>
> **A.** SIGHUP(1)
>
> **B.** SIGINT(2)
>
> **C.** SIGKILL(9)
>
> **D.** SIGTERM(15)

> [!HINT 1]
> 기본은 "정상 종료 요청"이다. 강제 종료가 아니다.

> [!ANSWER]
> **D.** 기본 시그널은 ==SIGTERM(15)==. 프로세스가 정리 작업을 하고 끝낼 기회를 준다. 응답하지 않을 때 `-9`(SIGKILL)를 쓴다.

> [!QUIZ]
> 다음 중 키보드 입력과 시그널의 연결이 옳은 것은?
>
> **A.** Ctrl+C — SIGTSTP(20)
>
> **B.** Ctrl+Z — SIGTSTP(20)
>
> **C.** Ctrl+Z — SIGKILL(9)
>
> **D.** Ctrl+C — SIGQUIT(3)

> [!HINT 1]
> Ctrl+C는 인터럽트(INT), Ctrl+Z는 터미널 정지(Terminal SToP).

> [!ANSWER]
> **B.** Ctrl+Z는 SIGTSTP(20)로 일시 정지, Ctrl+C는 SIGINT(2)로 종료, Ctrl+\\는 SIGQUIT(3).

> [!QUIZ]
> 매월 1일과 15일 새벽 3시 정각에 `/root/clean.sh`를 실행하는 crontab 설정은?
>
> **A.** `0 3 1,15 * * /root/clean.sh`
>
> **B.** `3 0 1,15 * * /root/clean.sh`
>
> **C.** `0 3 * 1,15 * /root/clean.sh`
>
> **D.** `0 3 1-15 * * /root/clean.sh`

> [!HINT 1]
> 필드 순서는 분 · 시 · 일 · 월 · 요일. "1일과 15일"은 나열 기호다.

> [!ANSWER]
> **A.** 분 0, 시 3, 일 1,15. B는 0시 3분, C는 1월·15월(존재하지 않음) 매일, D는 1일부터 15일까지 매일이다.

> [!QUIZ]
> nice와 renice에 대한 설명으로 틀린 것은?
>
> **A.** nice 값의 범위는 -20부터 19까지다.
>
> **B.** `nice` 명령에 값을 주지 않으면 nice 값이 10 증가한다.
>
> **C.** 일반 사용자도 renice로 자기 프로세스의 nice 값을 -5로 낮출 수 있다.
>
> **D.** nice 값이 클수록 우선순위는 낮아진다.

> [!HINT 1]
> 우선순위를 "높이는" 방향은 관리자 권한이 필요하다.

> [!ANSWER]
> **C.** 일반 사용자는 nice 값을 ==올리기만== 할 수 있다. 0 미만(높은 우선순위)으로 바꾸는 것은 root만 가능하다.

> [!QUIZ]
> 자식 프로세스가 종료되었으나 부모 프로세스가 종료 상태를 회수하지 않아 프로세스 테이블에 남아 있는 프로세스는?
>
> **A.** 데몬 프로세스
>
> **B.** 고아 프로세스
>
> **C.** 좀비 프로세스
>
> **D.** 포그라운드 프로세스

> [!HINT 1]
> ps에서 상태 Z, `<defunct>`로 보인다.

> [!ANSWER]
> **C.** 좀비 프로세스. 고아는 반대로 ==부모가 먼저 죽은== 살아 있는 자식이다.

> [!QUIZ]
> 사용자가 로그아웃한 뒤에도 `./long_job.sh`가 계속 실행되도록 백그라운드로 띄우는 명령은?
>
> **A.** `bg ./long_job.sh`
>
> **B.** `nohup ./long_job.sh &`
>
> **C.** `nice ./long_job.sh &`
>
> **D.** `at now ./long_job.sh`

> [!HINT 1]
> 로그아웃 때 오는 시그널(HUP)을 무시하게 하는 명령이다.

> [!ANSWER]
> **B.** `nohup`이 SIGHUP을 무시하게 하고 `&`가 백그라운드로 보낸다. `bg`는 이미 정지된 작업 번호를 받는 명령이다.

> [!PAGEBREAK]

## 단원 마무리

### 장 요약

| 주제 | 꼭 기억할 것 |
|---|---|
| 개념 | PID·PPID, PID 1 = systemd/init, fork(복제·새 PID) vs exec(덮어쓰기·PID 유지) |
| 상태 | R 실행, S 잠듦, D 깨울 수 없는 대기, T 정지, Z 좀비 |
| 유형 | 데몬(상주, TTY ?), 고아(부모 먼저 종료 → PID 1 입양), 좀비(부모 미회수) |
| ps | `aux`(%CPU·%MEM, x=터미널 없는 것까지), `-ef`(PPID), `-l`(PRI·NI) |
| 우선순위 | ==NI -20–19, 기본 0, nice 기본 +10, renice는 절댓값 지정, 낮추기는 root만== |
| 시그널 | ==blue:1 HUP · 2 INT · 9 KILL · 15 TERM(기본) · 18 CONT · 19 STOP · 20 TSTP== |
| 작업 제어 | `&`, Ctrl+Z, `jobs`, `fg %n`, `bg %n`, `nohup … &` |
| 예약 | at(1회, atq·atrm, Ctrl+D), cron(반복, ==blue:분 시 일 월 요일 명령==, `crontab -e -l -r -u`) |

## 책을 덮고 꺼내 보기

- 부모 프로세스의 번호를 {{PPID}}라 한다.
- 무시할 수 없는 강제 종료 시그널은 {{9번 SIGKILL}}이다.
- kill의 기본 시그널은 {{15번 SIGTERM}}이다.
- Ctrl+Z가 보내는 시그널은 {{20번 SIGTSTP}}이다.
- 정지된 프로세스를 재개하는 시그널은 {{18번 SIGCONT}}다.
- nice 값의 범위는 {{-20부터 19}}까지다.
- crontab의 필드 순서는 {{분 시 일 월 요일 명령}}이다.
- 로그아웃 후에도 실행을 유지하는 명령은 {{nohup}}이다.

> [!FLASHCARD]
> Q: 시험에 나오는 시그널 7개의 번호와 이름은?
> A: 1 SIGHUP(연결 끊김·설정 재로드), 2 SIGINT(Ctrl+C), 9 SIGKILL(강제 종료), 15 SIGTERM(kill 기본), 18 SIGCONT(재개), 19 SIGSTOP(정지, 무시 불가), 20 SIGTSTP(Ctrl+Z).

> [!FLASHCARD]
> Q: ps aux와 ps -ef의 차이는?
> A: aux는 BSD 스타일로 USER·%CPU·%MEM·VSZ·RSS·STAT을 보여 주고, -ef는 유닉스 스타일로 UID·PID·PPID·C·STIME을 보여 준다. PPID는 -ef 쪽에 있다.

> [!FLASHCARD]
> Q: 고아 프로세스와 좀비 프로세스의 차이는?
> A: 고아는 부모가 먼저 종료되어 PID 1이 입양한 살아 있는 프로세스, 좀비는 이미 종료했지만 부모가 wait로 회수하지 않아 프로세스 테이블에만 남은 프로세스(STAT Z, defunct)다.

> [!FLASHCARD]
> Q: nice와 renice의 사용법 차이는?
> A: nice는 새로 실행할 명령의 NI를 현재 값에서 증감(기본 +10), renice는 실행 중인 프로세스(-p PID, -u 사용자, -g 그룹)의 NI를 지정한 값으로 바꾼다. 음수로 낮추는 것은 root만 가능.

> [!FLASHCARD]
> Q: kill, killall, pkill은 무엇으로 대상을 고르나?
> A: kill은 PID(또는 %작업번호), killall은 프로세스 이름, pkill은 이름·사용자(-u)·터미널(-t) 같은 조건.

> [!FLASHCARD]
> Q: at 관련 명령과 cron 관련 명령은?
> A: at — `at 시각`(Ctrl+D로 끝), `atq`(=at -l), `atrm`(=at -d). cron — `crontab -e`(편집), `-l`(목록), `-r`(삭제), `-u 사용자`(대상 지정).

> [!FLASHCARD]
> Q: /etc/crontab과 사용자 crontab의 형식 차이는?
> A: `/etc/crontab`은 요일 필드와 명령 사이에 실행할 사용자 이름 필드가 하나 더 있다.

**다음으로 갈 기준:** 시그널 7개 번호를 쓰고, 예약 문장을 crontab 한 줄로 바꿀 수 있으면 다음 편으로 간다: [8편 · 에디터 vi/vim](/lectures/grade-mukhnzii/semester-certificate/subject-linux-master-2/lecture-08).

> [!PAGEBREAK]

## 정답과 해설

### 확인 문제 정답

1. **고아 프로세스(Orphan)**.
2. **T는 정지(Stopped)**, **Z는 좀비(Zombie)**.
3. **fork** — 부모를 복제한 새 프로세스가 생겨 새 PID를 받는다. exec는 PID를 유지한 채 실행 내용만 바꾼다.
4. **`ps aux`** — a(모든 사용자), u(사용자 포맷), x(터미널 없는 프로세스 포함).
5. **`r`** — renice. `k`는 kill.
6. **`pkill -9 -u kim`** (또는 `pkill -KILL -u kim`).
7. **`renice -5 -p 2000`** (또는 `renice -n -5 -p 2000`). 음수로 낮추는 것이므로 **root**만 실행할 수 있다.
8. **`30 18 * * 1-5 /root/a.sh`**.
9. **`bg %2`**.
10. **`atq`**, **`at -l`**.
