---
title: "3편 · 기본 명령어 (1) 사용자 계정과 권한"
description: "1과목 3장 전반부. 계정 관리 명령(useradd·usermod·userdel·passwd·chage·groupadd)과 /etc/passwd·shadow·group 필드, su·sudo, chmod·chown·umask, SetUID·SetGID·Sticky Bit, id·who·w·last까지 시험 포인트 중심으로 정리합니다."
order: 3
published: true
duration: 90
tags: [리눅스마스터 2급, 자격증, 1과목, 사용자 계정, 권한, chmod, umask]
objectives:
  - useradd·usermod·passwd·chage의 주요 옵션과 계정 정보 파일의 필드 순서를 말한다.
  - su와 su -, sudo와 /etc/sudoers의 차이를 설명한다.
  - chmod 숫자·문자 모드와 umask로 만들어지는 기본 권한을 계산한다.
  - SetUID·SetGID·Sticky Bit의 의미와 ls -l 표기(s, S, t, T)를 구분한다.
---

## 학습 경로 · 1과목 3장

[← 2편 · 리눅스 설치](/lectures/grade-mukhnzii/semester-certificate/subject-linux-master-2/lecture-02) · [다음: 4편 · 디렉터리·파일 조작과 기타 필수 명령어 →](/lectures/grade-mukhnzii/semester-certificate/subject-linux-master-2/lecture-04)

**범위:** 1과목 3장 "리눅스 기본 명령어" 중 사용자 관리와 권한 — 계정 생성·수정·삭제, 계정 정보 파일, 사용자 전환, 소유권과 허가권, 특수 권한, 로그인 사용자 확인.

**형광펜 읽는 법:** ==yellow:노랑== 핵심 정의·결론 · ==red:빨강== 시험에서 헷갈리는 구분·함정 · ==blue:파랑== 외워야 할 순서·목록

> [!EXAM]
> **이 장의 핵심 질문:** 리눅스는 "누가" 로그인했는지 어디에 적어 두고, 그 사람이 파일을 "읽고·쓰고·실행할 수 있는지"를 무엇으로 판단하는가?
>
> **전체 흐름:** ==blue:계정 만들기(useradd) → 계정이 적히는 파일(passwd·shadow·group) → 비밀번호 정책(passwd·chage) → 다른 사용자로 일하기(su·sudo) → 파일 권한(chmod·chown·umask) → 특수 권한(SetUID·SetGID·Sticky) → 누가 접속했나(id·who·w·last)==

---

## 단원 도입

| 출제 포인트 | 빈도 | 이렇게 나온다 |
|---|:---:|---|
| chmod 숫자 ↔ rwx 변환 | ★★★ | "rwxr-x--x를 숫자로", 결과 권한 고르기 |
| umask 계산 | ★★★ | umask 027일 때 새 파일·디렉터리 권한 |
| SetUID·SetGID·Sticky (4·2·1, s·t 표기) | ★★★ | /tmp의 권한, passwd 명령의 특수 권한 |
| /etc/passwd·/etc/shadow 필드 순서 | ★★★ | "세 번째 필드는?", 필드 의미 고르기 |
| useradd·usermod 옵션 (-g, -G, -a, -d, -s, -e) | ★★★ | 보조 그룹 추가 명령 완성하기 |
| chage·passwd 옵션 (-l, -m, -M, -W, -E, -S, -l/-u) | ★★ | 비밀번호 최대 사용 기간 설정 |
| su vs su -, sudo·visudo | ★★ | 환경 변수까지 바꾸는 쪽 |
| chown·chgrp, chown user:group | ★★ | 소유자와 그룹을 한 번에 바꾸는 명령 |
| /etc/login.defs, /etc/skel, /etc/default/useradd | ★★ | 홈 디렉터리 초기 파일이 복사되는 곳 |
| id·who·w·last·whoami | ★ | 접속 기록 확인 명령 고르기 |

> [!PAGEBREAK]

## PART 1 · 사용자 계정 관리

## 1. 사용자와 그룹의 기본 개념

### 핵심 필기

- 리눅스는 ==yellow:멀티유저 시스템==이라 모든 프로세스와 파일에 소유자(UID)와 **그룹(GID)이** 붙는다. 시스템은 이름이 아니라 **숫자 ID**로 판단한다.
- 사용자는 하나의 **기본 그룹**(primary group) 하나와 여러 개의 **보조 그룹**(supplementary group)에 속할 수 있다.

| 구분 | UID 범위 (CentOS 7 이후·Rocky·Ubuntu 기준) | 예 |
|---|---|---|
| 슈퍼유저(관리자) | ==yellow:0== | root |
| 시스템 계정 | 1–999 (구버전 1–499) | bin, daemon, apache |
| 일반 사용자 | 1000 이상 (구버전 500 이상) | kim, lee |

> [!TRAP]
> ==red:관리자 여부는 이름 "root"가 아니라 UID 0으로 결정된다.== /etc/passwd에서 다른 계정의 UID를 0으로 바꾸면 그 계정도 관리자 권한을 갖는다(보안 점검 항목). 또 UID 범위의 경계값(500 → 1000)은 배포판 버전에 따라 다르므로 문제의 조건을 읽는다.

## 2. 계정 정보 파일 — passwd · shadow · group

### 핵심 필기

**/etc/passwd** — 사용자 정보, 7개 필드, 콜론(`:`)으로 구분. 누구나 읽을 수 있다(644).

```bash
$ grep -E '^(root|kim):' /etc/passwd
root:x:0:0:root:/root:/bin/bash
kim:x:1000:1000:Kim Linux:/home/kim:/bin/bash
```

| 순서 | 필드 | 예 (kim) | 비고 |
|:---:|---|---|---|
| 1 | 사용자 이름 | kim | 로그인 이름 |
| 2 | 비밀번호 | x | ==yellow:x = 실제 암호는 /etc/shadow에 있음== |
| 3 | UID | 1000 | 0이면 관리자 |
| 4 | GID | 1000 | 기본 그룹 |
| 5 | GECOS(설명) | Kim Linux | 실명·연락처 (chfn으로 수정) |
| 6 | 홈 디렉터리 | /home/kim | |
| 7 | 로그인 셸 | /bin/bash | /sbin/nologin, /bin/false면 로그인 불가 |

**/etc/shadow** — 암호화된 비밀번호와 기간 정책, ==yellow:9개 필드==. root만 읽을 수 있다(Rocky는 0000, Ubuntu는 640 root:shadow).

```bash
# grep '^kim:' /etc/shadow
kim:$6$Fz3...생략...:20756:0:99999:7:::
```

| 순서 | 필드 | 예 | 뜻 |
|:---:|---|---|---|
| 1 | 사용자 이름 | kim | |
| 2 | 암호화된 비밀번호 | `$6$...` | `$1$` MD5, `$5$` SHA-256, `$6$` SHA-512, `$y$` yescrypt |
| 3 | 마지막 변경일 | 20756 | ==red:1970-01-01부터 센 날짜 수== |
| 4 | 최소 사용 기간(MIN) | 0 | 바꾼 뒤 며칠 지나야 다시 바꿀 수 있나 |
| 5 | 최대 사용 기간(MAX) | 99999 | 며칠마다 바꿔야 하나 |
| 6 | 경고 기간(WARN) | 7 | 만료 며칠 전부터 경고 |
| 7 | 비활성 기간(INACTIVE) | (빈칸) | 만료 후 며칠 지나면 계정 잠금 |
| 8 | 계정 만료일(EXPIRE) | (빈칸) | 1970-01-01부터 센 날짜 수 |
| 9 | 예약 | (빈칸) | 사용 안 함 |

- 비밀번호 필드가 `!`로 시작하면 **잠긴 계정**(passwd -l, usermod -L), `!!`는 RHEL 계열에서 아직 비밀번호를 정하지 않은 계정, `*`는 비밀번호 로그인 불가(시스템 계정).

**/etc/group** — 그룹 정보, 4개 필드: ==blue:그룹 이름 : 비밀번호(x) : GID : 그룹 구성원(쉼표 구분)==

```bash
$ grep -E '^(wheel|dev):' /etc/group
wheel:x:10:kim
dev:x:2000:kim,lee
```

- 그룹 비밀번호는 **/etc/gshadow**에 있다.
- 4번째 필드에는 ==red:그 그룹을 보조 그룹으로 가진 사용자==만 나온다. 기본 그룹(passwd의 GID)으로 속한 사용자는 보통 여기 적히지 않는다.

> [!TRAP]
> ==red:passwd는 7필드, shadow는 9필드, group은 4필드.== "shadow의 5번째 필드" = 최대 사용 기간(MAX), "passwd의 5번째 필드" = GECOS. 번호로 묻는 문제가 자주 나오므로 순서를 통째로 외운다.

> [!CONCEPT]
> **pwconv / pwunconv** — passwd 파일의 비밀번호를 shadow로 옮기거나(pwconv) 되돌린다(pwunconv). **pwck / grpck**는 passwd·group 파일의 형식 오류를 검사한다.

## 3. 계정 생성 · 수정 · 삭제

### 핵심 필기

**useradd** — 계정 생성 (Debian 계열의 adduser는 대화형 스크립트)

| 옵션 | 뜻 | 예 |
|---|---|---|
| `-u UID` | UID 지정 | `useradd -u 1500 kim` |
| `-g 그룹` | ==yellow:기본 그룹== 지정 | `useradd -g dev kim` |
| `-G 그룹,그룹` | ==yellow:보조 그룹== 지정 | `useradd -G wheel,dev kim` |
| `-d 경로` | 홈 디렉터리 지정 | `useradd -d /data/kim kim` |
| `-m` | 홈 디렉터리 생성 | `useradd -m kim` |
| `-M` | 홈 디렉터리 만들지 않음 | |
| `-s 셸` | 로그인 셸 지정 | `useradd -s /bin/sh kim` |
| `-c 설명` | GECOS(설명) | `useradd -c "Kim Linux" kim` |
| `-e 날짜` | 계정 만료일 (YYYY-MM-DD) | `useradd -e 2026-12-31 kim` |
| `-f 일수` | 비밀번호 만료 후 비활성 기간 | |
| `-k 디렉터리` | /etc/skel 대신 쓸 초기 파일 디렉터리 | |
| `-r` | 시스템 계정 생성 | |
| `-D` | ==yellow:기본값 확인·변경== (/etc/default/useradd) | `useradd -D -s /bin/sh` |

```bash
# useradd -m -s /bin/bash -c "Kim Linux" -G wheel kim
# passwd kim
Changing password for user kim.
New password:
Retype new password:
passwd: all authentication tokens updated successfully.
# useradd -D
GROUP=100
HOME=/home
INACTIVE=-1
EXPIRE=
SHELL=/bin/bash
SKEL=/etc/skel
CREATE_MAIL_SPOOL=yes
```

**useradd가 참고하고 바꾸는 파일**

| 파일 | 역할 |
|---|---|
| /etc/default/useradd | useradd 기본값(HOME, SHELL, SKEL, INACTIVE, EXPIRE …) — `useradd -D`로 확인 |
| /etc/login.defs | UID·GID 범위, 비밀번호 기간(PASS_MAX_DAYS, PASS_MIN_DAYS, PASS_WARN_AGE), CREATE_HOME, UMASK, 암호화 방식(ENCRYPT_METHOD) |
| ==yellow:/etc/skel== | 새 홈 디렉터리에 **복사될 초기 파일**(.bashrc, .bash_profile, .bash_logout …) |
| /etc/passwd, shadow, group, gshadow | 결과가 기록되는 곳 |

**usermod** — 계정 수정 (옵션 대부분이 useradd와 같다)

| 옵션 | 뜻 |
|---|---|
| `-l 새이름` | 로그인 이름 변경 |
| `-u`, `-g`, `-s`, `-d`, `-c`, `-e` | UID, 기본 그룹, 셸, 홈, 설명, 만료일 변경 |
| `-m` (`-d`와 함께) | 홈 디렉터리 내용을 새 위치로 이동 |
| `-G 그룹` | 보조 그룹을 ==red:이 목록으로 교체== |
| `-aG 그룹` | 보조 그룹에 ==yellow:추가(append)== |
| `-L` / `-U` | 계정 잠금 / 해제 (shadow 비밀번호 앞에 `!`) |

```bash
# usermod -aG dev kim
# id kim
uid=1000(kim) gid=1000(kim) groups=1000(kim),10(wheel),2000(dev)
# usermod -G dev kim          # -a 없이 쓰면 wheel이 빠진다
# id kim
uid=1000(kim) gid=1000(kim) groups=1000(kim),2000(dev)
```

**userdel** — 계정 삭제

| 옵션 | 뜻 |
|---|---|
| (없음) | 계정 정보만 삭제, 홈 디렉터리는 남음 |
| `-r` | ==yellow:홈 디렉터리와 메일 스풀까지 삭제== |
| `-f` | 로그인 중이어도 강제 삭제 |

**그룹 명령**

| 명령 | 용도 | 예 |
|---|---|---|
| groupadd | 그룹 생성 (`-g GID`) | `groupadd -g 2000 dev` |
| groupmod | 그룹 수정 (`-n 새이름`, `-g 새GID`) | `groupmod -n devel dev` |
| groupdel | 그룹 삭제 (누군가의 기본 그룹이면 삭제 불가) | `groupdel devel` |
| gpasswd | 그룹 구성원·관리자 관리 (`-a 사용자` 추가, `-d 사용자` 제거, `-A` 관리자 지정) | `gpasswd -a lee dev` |
| newgrp | 현재 셸의 기본 그룹을 임시로 바꿈 | `newgrp dev` |
| groups | 사용자가 속한 그룹 목록 | `groups kim` |

> [!TRAP]
> ==red:usermod -G만 쓰면 기존 보조 그룹이 사라지고 지정한 그룹으로 교체된다.== 기존 그룹을 유지한 채 추가하려면 반드시 `-a`를 붙여 `usermod -aG`. 또 ==red:-g(소문자)는 기본 그룹, -G(대문자)는 보조 그룹==이다.

> [!EXAMPLE]
> **문제 상황:** 개발팀원 lee를 만들고, 홈 디렉터리는 /home/lee, 셸은 bash, 보조 그룹 dev, 계정은 2026년 12월 31일에 만료되게 하라.
>
> ```bash
> # useradd -m -d /home/lee -s /bin/bash -G dev -e 2026-12-31 lee
> # passwd lee
> ```

> [!CHECK]
> **1.** /etc/shadow의 5번째 필드와 /etc/passwd의 5번째 필드는 각각 무엇인가?
>
> **2.** kim의 기존 보조 그룹을 유지하면서 docker 그룹을 추가하는 명령을 쓰시오.
>
> **3.** 새 사용자의 홈 디렉터리에 .bashrc를 자동으로 넣어 두려면 어느 디렉터리에 두는가?

## 4. 비밀번호 정책 — passwd · chage

### 핵심 필기

**passwd** — 비밀번호 변경과 상태 관리. 일반 사용자는 자기 비밀번호만, root는 누구 것이든 바꿀 수 있다.

| 옵션 | 뜻 |
|---|---|
| (없음) / `사용자` | 비밀번호 변경 |
| `-l` / `-u` | 비밀번호 잠금(lock) / 해제(unlock) |
| `-d` | 비밀번호 삭제 (빈 비밀번호) |
| `-S` | 상태 출력 (Status) |
| `-e` | 즉시 만료 → 다음 로그인 때 변경 강제 |
| `-n` / `-x` / `-w` / `-i` | 최소 / 최대 / 경고 / 비활성 기간 |
| `--stdin` | (RHEL 계열) 표준 입력으로 비밀번호 받기 |

**chage** — 비밀번호 기간(age) 정책 전용 명령

| 옵션 | 뜻 | shadow 필드 |
|---|---|:---:|
| `-l` | 정책 목록 보기 | — |
| `-d 날짜` | 마지막 변경일 설정 (`-d 0`이면 다음 로그인 때 변경 강제) | 3 |
| `-m 일수` | 최소 사용 기간 | 4 |
| `-M 일수` | ==yellow:최대 사용 기간== | 5 |
| `-W 일수` | 경고 기간 | 6 |
| `-I 일수` | 비활성 기간 | 7 |
| `-E 날짜` | 계정 만료일 | 8 |

```bash
# chage -M 90 -W 7 kim
# chage -l kim
Last password change                                    : Oct 30, 2026
Password expires                                        : Jan 28, 2027
Password inactive                                       : never
Account expires                                         : never
Minimum number of days between password change          : 0
Maximum number of days between password change          : 90
Number of days of warning before password expires       : 7
```

> [!TRAP]
> ==red:passwd와 chage의 같은 기능 옵션 글자가 다르다.== 최대 사용 기간은 passwd `-x` / chage `-M`, 최소는 passwd `-n` / chage `-m`. 또 ==red:passwd -l은 "잠금(lock)", chage -l은 "목록(list)"==이다.

> [!CHECK]
> **4.** kim의 비밀번호를 60일마다 바꾸도록 하는 chage 명령은?
>
> **5.** passwd -S kim과 chage -l kim의 공통점과 차이를 한 줄로 쓰시오.

## 5. 다른 사용자로 일하기 — su · sudo

### 핵심 필기

| 명령 | 동작 | 비밀번호 |
|---|---|---|
| `su 사용자` | 사용자만 바꿈, **현재 환경(작업 디렉터리·환경 변수) 유지** | 바꿀 대상의 비밀번호 |
| `su - 사용자` (`su -l`) | ==yellow:로그인 셸로 전환== — 대상의 홈·환경 변수·설정 파일까지 적용 | 대상의 비밀번호 |
| `su` / `su -` | 사용자 생략 시 **root** | root 비밀번호 |
| `su -c '명령' 사용자` | 명령 하나만 실행하고 돌아옴 | 대상의 비밀번호 |
| `sudo 명령` | /etc/sudoers에 허용된 사용자가 다른 사용자(기본 root) 권한으로 명령 실행 | ==yellow:자기 비밀번호== |
| `sudo -l` | 내가 sudo로 할 수 있는 명령 목록 | |
| `sudo -u 사용자 명령` | root 말고 지정한 사용자로 실행 | |
| `sudo -i` / `sudo -s` | root 로그인 셸 / root 셸 | |

**/etc/sudoers** — 반드시 `visudo`로 편집(문법 검사).

```bash
# visudo
root    ALL=(ALL)       ALL
%wheel  ALL=(ALL)       ALL                # RHEL 계열: wheel 그룹 전체 허용 (% = 그룹)
kim     ALL=(ALL)       NOPASSWD: /usr/bin/systemctl
```

- 형식: ==blue:사용자 호스트=(실행할 사용자) 명령==. `%`가 붙으면 그룹.
- 관리자 그룹: RHEL·Rocky는 **wheel**, Ubuntu·Debian은 **sudo**.

> [!TRAP]
> ==red:su는 "대상 계정"의 비밀번호, sudo는 "내" 비밀번호를 묻는다.== 또 `su`(하이픈 없음)는 root가 되어도 PATH 등 환경이 그대로라 /sbin 명령을 못 찾는 일이 생긴다. 환경까지 바꾸려면 `su -`.

## 6. 로그인 사용자 확인 — id · who · w · last

| 명령 | 보여 주는 것 |
|---|---|
| `id [사용자]` | UID, GID, 소속 그룹 전체 |
| `whoami` | 현재 유효 사용자 이름 (su 후에는 바뀐 이름) |
| `who` | 현재 로그인한 사용자, 터미널, 로그인 시각 (/var/run/utmp) |
| `who am i` | 처음 로그인한 원래 사용자 정보 |
| `w` | who + 시스템 가동 시간·부하·**각 사용자가 실행 중인 명령(WHAT)** |
| `users` | 로그인한 사용자 이름만 한 줄로 |
| `last` | ==yellow:로그인·로그아웃·재부팅 기록== (/var/log/wtmp) |
| `lastb` | 로그인 **실패** 기록 (/var/log/btmp) |
| `lastlog` | 사용자별 **마지막** 로그인 시각 (/var/log/lastlog) |
| `finger` | 사용자 상세 정보 (설치 필요) |

```bash
$ id
uid=1000(kim) gid=1000(kim) groups=1000(kim),10(wheel)
$ w
 17:20:34 up 3 days,  2:11,  2 users,  load average: 0.08, 0.03, 0.01
USER     TTY      FROM             LOGIN@   IDLE   JCPU   PCPU WHAT
kim      pts/0    192.168.0.10     16:58    0.00s  0.05s  0.00s w
lee      pts/1    192.168.0.11     17:05    3:12   0.02s  0.02s vi report.txt
$ last -n 2
kim      pts/0        192.168.0.10     Fri Oct 30 16:58   still logged in
reboot   system boot  6.1.0-rocky      Tue Oct 27 15:09   still running
```

> [!TRAP]
> ==red:last는 wtmp(성공 기록), lastb는 btmp(실패 기록), lastlog는 사용자별 마지막 접속.== 현재 접속자는 who·w·users(utmp)다.

> [!CHECK]
> **6.** 일반 사용자 kim이 `su`로 root가 된 뒤 `whoami`와 `who am i`를 실행하면 각각 누구로 나오는가?

> [!PAGEBREAK]

## PART 2 · 파일 권한

## 7. 소유권과 허가권 읽기

### 핵심 필기

```bash
$ ls -l report.sh
-rwxr-x--x 1 kim dev 512 Oct 30 17:20 report.sh
```

| 위치 | 값 | 뜻 |
|---|---|---|
| 1번째 글자 | `-` | 파일 종류: `-` 일반, `d` 디렉터리, `l` 심볼릭 링크, `b` 블록 장치, `c` 문자 장치, `s` 소켓, `p` 파이프 |
| 2–4 | `rwx` | ==blue:소유자(user, u)== 권한 |
| 5–7 | `r-x` | ==blue:그룹(group, g)== 권한 |
| 8–10 | `--x` | ==blue:기타 사용자(others, o)== 권한 |
| 다음 숫자 | 1 | 하드 링크 수 |
| kim / dev | | 소유자 / 소유 그룹 |

| 권한 | 숫자 | 파일에서 | 디렉터리에서 |
|:---:|:---:|---|---|
| r | 4 | 내용 읽기 | ==yellow:목록 보기(ls)== |
| w | 2 | 내용 수정 | ==yellow:안에서 파일 생성·삭제·이름 변경== |
| x | 1 | 실행 | ==yellow:들어가기(cd), 안의 파일 접근== |

[![rwxr-x--x를 소유자·그룹·기타 세 칸으로 나누고 각 칸의 r=4 w=2 x=1을 더해 751이 되는 과정, 그 앞에 붙는 특수 권한 SetUID 4·SetGID 2·Sticky 1 자리와 s·t 표기를 정리한 그림](/materials/diagrams/lm2-l03a-permissions.svg)](/materials/diagrams/lm2-l03a-permissions.svg)

*그림 3-1 · 권한 비트를 8진수로 읽기 — 누르면 원본 크기로 열린다.*

> [!NOTE]
> - **읽는 순서:** 맨 위 `ls -l` 한 줄을 세 칸(u·g·o)으로 자르고, 칸마다 4·2·1을 더해 숫자 한 자리를 만든다. 아래 띠는 네 번째(맨 앞) 자리인 특수 권한이다.
> - **핵심:** ==r=4, w=2, x=1==, 세 자리 숫자의 순서는 항상 소유자·그룹·기타.
> - **시험 포인트:** 특수 권한은 x 자리에 겹쳐 표시된다. 실행 권한이 있으면 소문자(s, t), 없으면 대문자(S, T).

> [!TRAP]
> ==red:디렉터리 안의 파일을 지울 수 있는지는 "파일"의 권한이 아니라 "디렉터리"의 w 권한이 결정한다.== 파일이 444(읽기 전용)여도 디렉터리에 w·x가 있으면 삭제할 수 있다. 이것을 막는 장치가 Sticky Bit다.

## 8. chmod — 숫자 모드와 문자 모드

### 핵심 필기

**숫자(8진수) 모드:** 칸마다 r(4)+w(2)+x(1)을 더한다.

| 숫자 | rwx | 자주 쓰는 곳 |
|:---:|---|---|
| 755 | rwxr-xr-x | 실행 파일, 디렉터리 |
| 644 | rw-r--r-- | 일반 파일 |
| 700 | rwx------ | 개인 디렉터리 |
| 600 | rw------- | 개인 키, 개인 설정 |
| 751 | rwxr-x--x | |
| 777 | rwxrwxrwx | (위험) 모두 허용 |

**문자(기호) 모드:** ==blue:누구(u g o a) + 연산(+ - =) + 권한(r w x s t)==

```bash
$ chmod 754 a
$ ls -l a
-rwxr-xr-- 1 root root 0 Oct 30 17:20 a
$ chmod u=rwx,g=rx,o= a
$ ls -l a
-rwxr-x--- 1 root root 0 Oct 30 17:20 a
$ ls -l b
-rw-r----- 1 root root 0 Oct 30 17:20 b
$ chmod a+x,o-r b
$ ls -l b
-rwxr-x--x 1 root root 0 Oct 30 17:20 b
```

| 예 | 뜻 |
|---|---|
| `chmod u+x f` | 소유자에게 실행 추가 |
| `chmod go-w f` | 그룹·기타에서 쓰기 제거 |
| `chmod a=r f` | 모두 읽기만 (444) |
| `chmod o= f` | 기타의 권한을 모두 제거 |
| `chmod -R 755 dir` | 하위까지 재귀 적용 |

> [!TRAP]
> `=` 연산자는 ==red:"그 권한으로 설정"이라 나머지를 지운다.== `chmod g=r`은 그룹에 r만 남기고 w·x를 없앤다. `+`·`-`는 다른 비트를 건드리지 않는다. 또 `a`는 all(u+g+o)이다. "others"의 o를 owner로 착각하지 말 것.

## 9. chown · chgrp — 소유자와 그룹 바꾸기

| 명령 | 뜻 |
|---|---|
| `chown lee file` | 소유자를 lee로 |
| `chown lee:dev file` | ==yellow:소유자와 그룹을 한 번에== (`lee.dev`도 예전 표기로 허용) |
| `chown :dev file` | 그룹만 변경 (chgrp와 같음) |
| `chown lee: file` | 소유자를 lee로, 그룹을 lee의 기본 그룹으로 |
| `chown -R lee:dev dir` | 하위까지 재귀 |
| `chgrp dev file` | 그룹만 변경 |

- 소유자 변경(chown)은 원칙적으로 **root만** 할 수 있다. chgrp는 소유자가 자기가 속한 그룹으로는 바꿀 수 있다.

## 10. umask — 새 파일의 기본 권한

### 핵심 필기

- 새로 만드는 파일·디렉터리에서 ==yellow:빼 버릴 권한==을 지정하는 값.
- 출발점: **파일 666**(실행 권한은 기본으로 주지 않음), **디렉터리 777**.
- 결과 = 출발점에서 umask에 해당하는 비트를 끈 것 (정확히는 `출발점 AND NOT umask`).

| umask | 새 파일 (666 기준) | 새 디렉터리 (777 기준) |
|:---:|:---:|:---:|
| 022 | ==yellow:644== rw-r--r-- | ==yellow:755== rwxr-xr-x |
| 002 | 664 rw-rw-r-- | 775 rwxrwxr-x |
| 027 | 640 rw-r----- | 750 rwxr-x--- |
| 077 | 600 rw------- | 700 rwx------ |

```bash
$ umask
0022
$ umask -S
u=rwx,g=rx,o=rx
$ umask 027
$ touch b; mkdir e
$ ls -ld b e
-rw-r----- 1 root root    0 Oct 30 17:20 b
drwxr-x--- 2 root root 4096 Oct 30 17:20 e
```

- `umask -S`는 **결과적으로 허용되는 권한**을 문자로 보여 준다.
- 설정은 현재 셸에만 적용된다. 영구 적용은 ~/.bashrc, /etc/profile, /etc/bashrc 등에 적는다. 시스템 기본값은 /etc/login.defs의 UMASK.
- 관례상 root는 022, RHEL 계열 일반 사용자는 002(사용자 전용 그룹이므로).

> [!TRAP]
> ==red:umask는 "남길 권한"이 아니라 "뺄 권한"이다.== 그리고 단순 뺄셈이 아니다. umask 033이면 파일은 666에서 0·3·3 비트를 끄므로 ==red:644==(666−033 = 633이 아니다). 파일 출발점에는 x가 없어서 끌 x가 없기 때문이다.

> [!EXAMPLE]
> **umask 033 계산하기**
>
> | | 소유자 | 그룹 | 기타 |
> |---|:---:|:---:|:---:|
> | 파일 출발점 666 | rw- | rw- | rw- |
> | umask 033이 끄는 비트 | --- | -wx | -wx |
> | 결과 | rw- (6) | r-- (4) | r-- (4) |
>
> 결과는 644. 디렉터리는 777에서 같은 비트를 꺼 744(rwxr--r--)가 된다.

> [!CHECK]
> **7.** `-rw-r-----`를 숫자로 쓰고, 그룹에 쓰기 권한을 추가하는 문자 모드 명령을 쓰시오.
>
> **8.** umask가 077일 때 새 디렉터리의 권한을 rwx 표기로 쓰시오.

## 11. 특수 권한 — SetUID · SetGID · Sticky Bit

### 핵심 필기

| 특수 권한 | 숫자 | 표시 위치 | 붙는 곳 | 효과 | 대표 예 |
|---|:---:|---|---|---|---|
| **SetUID** | ==yellow:4000== | 소유자 x 자리 `s` | 실행 파일 | 실행하는 동안 ==파일 소유자==의 권한으로 동작 | /usr/bin/passwd (`-rwsr-xr-x`, 4755) |
| **SetGID** | ==yellow:2000== | 그룹 x 자리 `s` | 실행 파일 / 디렉터리 | 파일: 그룹 권한으로 실행 · 디렉터리: 안에 만든 파일이 디렉터리의 그룹을 물려받음 | 공유 작업 디렉터리 |
| **Sticky Bit** | ==yellow:1000== | 기타 x 자리 `t` | 디렉터리 | 누구나 쓸 수 있어도 ==자기 파일만 삭제== 가능 | /tmp (`drwxrwxrwt`, 1777) |

```bash
$ ls -ld /tmp /usr/bin/passwd
drwxrwxrwt 23 root root 12288 Oct 30 17:20 /tmp
-rwsr-xr-x  1 root root 64152 May 30  2024 /usr/bin/passwd
$ chmod 4755 a;  ls -l a
-rwsr-xr-x 1 root root 0 Oct 30 17:20 a
$ chmod 2755 e;  ls -ld e
drwxr-sr-x 2 root root 4096 Oct 30 17:20 e
$ chmod 1777 d;  ls -ld d
drwxrwxrwt 2 root root 4096 Oct 30 17:20 d
$ chmod 4644 b;  ls -l b
-rwSr--r-- 1 root root 0 Oct 30 17:20 b
```

- 문자 모드: `chmod u+s`(SetUID), `chmod g+s`(SetGID), `chmod o+t` 또는 `+t`(Sticky).
- ==red:대문자 S·T는 "특수 권한은 켜졌지만 그 자리의 x가 없음"==을 뜻한다. 위의 4644 → `rwS`. 실행 권한이 없으니 SetUID가 사실상 의미가 없다.
- passwd 명령이 SetUID인 이유: 일반 사용자도 root만 쓸 수 있는 /etc/shadow를 고쳐야 하기 때문.
- SetUID가 걸린 root 소유 파일은 보안 위험 → 점검: `find / -perm -4000 -type f`.

```bash
$ find / -perm -4000 -type f 2>/dev/null | head -3
/usr/bin/sudo
/usr/bin/chfn
/usr/bin/chsh
```

> [!TRAP]
> ==red:Sticky Bit는 4가 아니라 1, SetUID가 4다.== "SUID 4 · SGID 2 · Sticky 1"은 rwx의 4·2·1과 같은 순서(u·g·o 자리)라고 기억한다. 6755 = SetUID+SetGID+755, 3777 = SetGID+Sticky+777.

> [!CHECK]
> **9.** `drwxrwxrwt`를 4자리 숫자로 쓰고, 이 권한이 걸린 대표 디렉터리를 쓰시오.
>
> **10.** `-rwSr--r--`에서 대문자 S는 무엇을 뜻하는가?

> [!PAGEBREAK]

## PART 3 · 기출 유형 연습

> [!QUIZ]
> 다음 중 /etc/shadow 파일의 필드 순서가 올바른 것은?
>
> **A.** 사용자 이름 → 암호 → 최소 사용 기간 → 마지막 변경일 → 최대 사용 기간
>
> **B.** 사용자 이름 → 암호 → 마지막 변경일 → 최소 사용 기간 → 최대 사용 기간
>
> **C.** 사용자 이름 → 암호 → UID → GID → 홈 디렉터리
>
> **D.** 사용자 이름 → 암호 → 최대 사용 기간 → 경고 기간 → 최소 사용 기간

> [!HINT 1]
> "언제 바꿨나"가 먼저 오고, 그다음 "얼마 동안(최소→최대)", 그다음 "경고"다.

> [!ANSWER]
> **B.** 순서는 이름·암호·마지막 변경일·MIN·MAX·WARN·INACTIVE·EXPIRE·예약. C는 /etc/passwd의 필드다.

> [!QUIZ]
> umask 값이 027인 상태에서 새 파일과 새 디렉터리를 만들었다. 생성된 권한으로 옳은 것은?
>
> **A.** 파일 750, 디렉터리 750
>
> **B.** 파일 640, 디렉터리 750
>
> **C.** 파일 640, 디렉터리 640
>
> **D.** 파일 751, 디렉터리 750

> [!HINT 1]
> 파일은 666, 디렉터리는 777에서 출발한다.

> [!ANSWER]
> **B.** 666에서 027 비트를 끄면 640(rw-r-----), 777에서 끄면 750(rwxr-x---). 실습 결과도 `-rw-r-----`, `drwxr-x---`였다.

> [!QUIZ]
> 사용자 kim을 기존 보조 그룹을 유지한 채 project 그룹에 추가하는 명령으로 옳은 것은?
>
> **A.** `usermod -g project kim`
>
> **B.** `usermod -G project kim`
>
> **C.** `usermod -aG project kim`
>
> **D.** `useradd -G project kim`

> [!HINT 1]
> 소문자 g와 대문자 G의 차이, 그리고 "추가(append)"를 뜻하는 옵션을 떠올린다.

> [!ANSWER]
> **C.** A는 기본 그룹을 바꾸고, B는 보조 그룹 목록을 project 하나로 교체한다. D는 이미 있는 계정에 쓸 수 없다(계정 생성 명령).

> [!QUIZ]
> 다음 중 권한 설정 결과가 `-rwsr-x--x`가 되는 명령은?
>
> **A.** `chmod 2751 file`
>
> **B.** `chmod 4751 file`
>
> **C.** `chmod 1751 file`
>
> **D.** `chmod 4750 file`

> [!HINT 1]
> s가 어느 칸의 x 자리에 있는지, 그리고 기타 칸이 `--x`인지 확인한다.

> [!ANSWER]
> **B.** 소유자 칸의 s = SetUID(4), 나머지 rwx r-x --x = 751. A는 `-rwxr-s--x`, C는 `-rwxr-x--t`, D는 `-rwsr-x---`.

> [!QUIZ]
> 일반 사용자가 /tmp 디렉터리에 만든 파일을 다른 일반 사용자가 지우지 못하는 이유로 옳은 것은?
>
> **A.** /tmp에 SetUID가 설정되어 있기 때문이다.
>
> **B.** /tmp의 기타 사용자 권한에 w가 없기 때문이다.
>
> **C.** /tmp에 Sticky Bit가 설정되어 있기 때문이다.
>
> **D.** /tmp에 SetGID가 설정되어 있기 때문이다.

> [!HINT 1]
> /tmp는 `drwxrwxrwt`다. 마지막 글자를 본다.

> [!ANSWER]
> **C.** 기타에도 w가 있어 누구나 파일을 만들 수 있지만, Sticky Bit(t) 때문에 ==자기 소유 파일만== 지울 수 있다(디렉터리 소유자와 root는 예외).

> [!QUIZ]
> 다음 중 사용자의 로그인 성공·로그아웃·재부팅 기록을 확인하는 명령은?
>
> **A.** `w`
>
> **B.** `last`
>
> **C.** `lastb`
>
> **D.** `whoami`

> [!HINT 1]
> 과거 기록은 /var/log/wtmp에 쌓인다.

> [!ANSWER]
> **B.** last는 wtmp를 읽는다. lastb는 로그인 실패(btmp), w는 현재 접속자와 실행 중인 명령, whoami는 현재 유효 사용자 이름.

> [!QUIZ]
> 비밀번호 최대 사용 기간을 90일로 지정하는 명령으로 옳지 않은 것은?
>
> **A.** `chage -M 90 kim`
>
> **B.** `passwd -x 90 kim`
>
> **C.** `chage -m 90 kim`
>
> **D.** /etc/login.defs의 PASS_MAX_DAYS를 90으로 바꾼 뒤 새로 만든 계정

> [!HINT 1]
> chage에서 소문자 m과 대문자 M 중 무엇이 "최대"인가?

> [!ANSWER]
> **C.** chage -m은 최소 사용 기간이다. D는 이후 만들어지는 계정의 기본값으로 적용된다(기존 계정은 바뀌지 않음).

> [!PAGEBREAK]

## 단원 마무리

| 주제 | 꼭 외울 것 |
|---|---|
| 계정 파일 | passwd 7필드 (이름:x:UID:GID:GECOS:홈:셸), shadow 9필드 (이름:암호:최종변경:MIN:MAX:WARN:INACTIVE:EXPIRE:예약), group 4필드 |
| 계정 명령 | useradd(-u -g -G -d -m -s -c -e -D), usermod(-aG -L -U -l), userdel -r, groupadd -g, gpasswd -a |
| 기본값 파일 | /etc/default/useradd, /etc/login.defs, /etc/skel |
| 비밀번호 정책 | chage -l -m -M -W -I -E -d, passwd -l -u -S -d -e -x -n -w |
| 사용자 전환 | su(환경 유지), su -(로그인 셸), sudo(내 비밀번호, /etc/sudoers, visudo) |
| 권한 숫자 | r4 w2 x1, 순서 u·g·o, 디렉터리의 w = 생성·삭제 |
| umask | 파일 666·디렉터리 777에서 비트를 끔, 022 → 644/755 |
| 특수 권한 | SetUID 4(s, passwd) · SetGID 2(s) · Sticky 1(t, /tmp), 대문자 = x 없음 |
| 접속 확인 | id, whoami, who, w, users, last(wtmp), lastb(btmp), lastlog |

## 책을 덮고 꺼내 보기

- /etc/passwd의 두 번째 필드가 x이면 실제 암호는 {{/etc/shadow}}에 있다.
- 새 계정의 홈 디렉터리에 복사될 초기 파일은 {{/etc/skel}}에 둔다.
- 보조 그룹을 유지한 채 추가하는 usermod 옵션은 {{-aG}}다.
- umask가 022이면 새 파일은 {{644}}, 새 디렉터리는 {{755}}다.
- SetUID는 {{4000}}, SetGID는 {{2000}}, Sticky Bit는 {{1000}}이다.
- 로그인 실패 기록을 보는 명령은 {{lastb}}다.

> [!FLASHCARD]
> Q: /etc/passwd 7개 필드를 순서대로 쓰시오.
> A: 사용자 이름 : 비밀번호(x) : UID : GID : GECOS(설명) : 홈 디렉터리 : 로그인 셸.

> [!FLASHCARD]
> Q: /etc/shadow 9개 필드를 순서대로 쓰시오.
> A: 사용자 이름 : 암호화된 비밀번호 : 마지막 변경일 : 최소 사용 기간 : 최대 사용 기간 : 경고 기간 : 비활성 기간 : 계정 만료일 : 예약.

> [!FLASHCARD]
> Q: useradd의 -g와 -G, usermod의 -G와 -aG 차이는?
> A: -g는 기본 그룹, -G는 보조 그룹. usermod -G는 보조 그룹 목록을 교체하고, -aG는 기존 목록에 추가한다.

> [!FLASHCARD]
> Q: su와 su -의 차이는?
> A: su는 사용자만 바꾸고 현재 환경을 유지한다. su -는 대상 사용자의 로그인 셸로 시작해 홈 디렉터리와 환경 변수까지 바꾼다.

> [!FLASHCARD]
> Q: umask 027일 때 새 파일·디렉터리 권한은?
> A: 파일 640(rw-r-----), 디렉터리 750(rwxr-x---).

> [!FLASHCARD]
> Q: SetUID·SetGID·Sticky Bit의 숫자와 대표 예는?
> A: SetUID 4000 — /usr/bin/passwd, SetGID 2000 — 공유 디렉터리(그룹 상속), Sticky 1000 — /tmp(자기 파일만 삭제).

> [!FLASHCARD]
> Q: ls -l에서 s와 S, t와 T의 차이는?
> A: 소문자는 특수 권한과 실행 권한(x)이 모두 있음, 대문자는 특수 권한만 있고 x가 없음.

**다음으로 갈 기준:** `ls -l` 한 줄을 보고 4자리 숫자로 바꾸고, umask 값으로 새 파일 권한을 바로 계산할 수 있으면 다음 편으로 간다: [4편 · 디렉터리·파일 조작과 기타 필수 명령어](/lectures/grade-mukhnzii/semester-certificate/subject-linux-master-2/lecture-04).

> [!PAGEBREAK]

## 정답과 해설

1. shadow 5번째 = **최대 사용 기간(MAX)**, passwd 5번째 = **GECOS(사용자 설명)**.
2. `usermod -aG docker kim` (또는 `gpasswd -a kim docker`). -a 없이 -G만 쓰면 기존 보조 그룹이 사라진다.
3. **/etc/skel** — useradd -m으로 홈을 만들 때 이 안의 파일이 복사된다.
4. `chage -M 60 kim` (passwd로는 `passwd -x 60 kim`).
5. 둘 다 비밀번호 상태·기간 정보를 보여 준다. passwd -S는 한 줄 요약(상태 L/P/NP, 변경일, MIN, MAX, WARN, INACTIVE), chage -l은 항목별로 날짜를 풀어서 보여 준다.
6. `whoami`는 **root**(현재 유효 사용자), `who am i`는 **kim**(처음 로그인한 사용자, 터미널 기준).
7. `-rw-r-----` = **640**, 그룹 쓰기 추가는 `chmod g+w 파일` → 660.
8. 777에서 077을 끄면 700 → **rwx------**.
9. **1777**, 대표 디렉터리는 **/tmp** (그리고 /var/tmp).
10. SetUID는 설정되었지만 **소유자 실행 권한(x)이 없음**. 4644처럼 x 없이 4000을 더하면 이렇게 표시된다.
