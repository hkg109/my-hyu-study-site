---
title: "4편 · 기본 명령어 (2) 디렉터리·파일 조작과 기타 필수 명령어"
description: "1과목 3장 후반부. ls·cd·cp·mv·rm·ln으로 파일을 다루고, cat·less·head·tail로 읽고, find·locate·which·whereis로 찾고, 리다이렉션·파이프와 grep·wc·sort·uniq·cut·tr로 가공하며, date·cal·man·shutdown까지 시험에 나오는 옵션 중심으로 정리합니다."
order: 4
published: true
duration: 90
tags: [리눅스마스터 2급, 자격증, 1과목, 기본 명령어, 링크, find, 리다이렉션, grep]
objectives:
  - ls·cp·mv·rm·mkdir·touch의 주요 옵션과 절대·상대 경로를 구분해 쓴다.
  - 하드 링크와 심볼릭 링크의 차이를 아이노드 번호와 원본 삭제 결과로 설명한다.
  - find의 검색 조건(-name, -type, -perm, -size, -mtime, -user, -exec)과 locate·which·whereis의 차이를 말한다.
  - 리다이렉션·파이프와 grep·wc·sort·uniq·cut·tr을 엮어 출력 결과를 예측한다.
---

## 학습 경로 · 1과목 3장

[← 3편 · 사용자 계정과 권한](/lectures/grade-mukhnzii/semester-certificate/subject-linux-master-2/lecture-03) · [다음: 5편 · 파일 시스템 명령어와 물리 구조 →](/lectures/grade-mukhnzii/semester-certificate/subject-linux-master-2/lecture-05)

**범위:** 1과목 3장 "리눅스 기본 명령어" 중 디렉터리·파일 조작, 파일 내용 보기, 파일 찾기, 입출력 재지정과 텍스트 가공, 날짜·도움말·시스템 종료 등 기타 필수 명령어.

**형광펜 읽는 법:** ==yellow:노랑== 핵심 정의·결론 · ==red:빨강== 시험에서 헷갈리는 구분·함정 · ==blue:파랑== 외워야 할 순서·목록

> [!EXAM]
> **이 장의 핵심 질문:** 셸 한 줄로 파일을 만들고·옮기고·찾고, 그 결과를 다음 명령으로 흘려 원하는 줄만 뽑아내려면 어떤 명령과 옵션을 이어 붙이는가?
>
> **전체 흐름:** ==blue:위치 이동(pwd·cd·ls) → 만들고 옮기고 지우기(mkdir·cp·mv·rm·touch) → 링크(ln) → 내용 보기(cat·less·head·tail) → 찾기(find·locate·which·whereis) → 흐름 바꾸기(리다이렉션·파이프) → 가공(grep·wc·sort·uniq·cut·tr) → 기타(date·cal·man·shutdown)==

---

## 단원 도입

| 출제 포인트 | 빈도 | 이렇게 나온다 |
|---|:---:|---|
| 하드 링크 vs 심볼릭 링크 | ★★★ | 아이노드 번호, 원본 삭제 후 결과, `ln -s` |
| find 조건 (-name, -type, -perm, -size, -mtime, -user, -exec) | ★★★ | 조건에 맞는 명령 완성 |
| 리다이렉션 (>, >>, 2>, 2>&1, <<) | ★★★ | 표준 에러만 파일로 보내는 명령 |
| 파이프 조합 (grep·wc·sort·uniq·cut) | ★★★ | 명령 결과 예측 |
| cp·mv·rm·mkdir 옵션 (-r, -i, -f, -p) | ★★ | 하위 디렉터리까지 복사, 부모 디렉터리 생성 |
| head·tail (-n, -f) | ★★ | 실시간 로그 보기 |
| which·whereis·locate 차이 | ★★ | 매뉴얼 위치까지 보여 주는 명령 |
| man 섹션 번호, man -k / -f | ★★ | 설정 파일 형식은 몇 번 섹션인가 |
| shutdown 옵션 (-h, -r, -c, -k, +분) | ★★ | 10분 뒤 재부팅 명령 |
| date·cal | ★ | 출력 형식 |

> [!PAGEBREAK]

## PART 1 · 디렉터리와 파일 다루기

## 1. 경로와 이동 — pwd · cd · ls

### 핵심 필기

- **절대 경로:** `/`(루트)부터 시작 — `/home/kim/docs`
- **상대 경로:** 현재 위치 기준 — `docs`, `./docs`, `../lee`
- 특수 기호: `.` 현재 디렉터리, `..` 상위 디렉터리, `~` 홈 디렉터리, `~lee` lee의 홈, `-` 직전 디렉터리(cd에서)

| 명령 | 뜻 |
|---|---|
| `pwd` | 현재 작업 디렉터리의 절대 경로 출력 (Print Working Directory) |
| `cd` / `cd ~` | 홈 디렉터리로 |
| `cd ..` | 상위로 |
| `cd -` | ==yellow:직전 디렉터리로 되돌아가기== |

**ls 주요 옵션**

| 옵션 | 뜻 |
|---|---|
| `-a` | ==yellow:숨김 파일(.으로 시작) 포함== 전부 (. 과 .. 포함) |
| `-A` | . 과 .. 를 뺀 전부 |
| `-l` | 자세히(long) — 권한, 링크 수, 소유자, 크기, 시각 |
| `-d` | 디렉터리 자체의 정보 (안의 내용이 아니라) |
| `-h` | 크기를 K, M, G로 (-l과 함께) |
| `-i` | 아이노드 번호 |
| `-R` | 하위 디렉터리까지 재귀 |
| `-t` / `-S` / `-r` | 시간순 / 크기순 / 역순 |
| `-F` | 종류 표시 기호: `/` 디렉터리, `*` 실행 파일, `@` 심볼릭 링크, `\|` 파이프, `=` 소켓 |

```bash
$ ls -ld /etc
drwxr-xr-x 98 root root 4096 Oct 30 09:12 /etc
$ ls -a
.  ..  .bashrc  .profile  docs
```

> [!TRAP]
> ==red:ls -R(대문자)은 재귀, ls -r(소문자)은 역순 정렬이다.== 반대로 cp·rm·chmod에서는 -r과 -R이 둘 다 재귀다. 또 `ls -l 디렉터리`는 안의 목록을 보여 주므로 디렉터리 자체의 권한을 보려면 `-d`를 함께 쓴다.

## 2. 만들기 · 복사 · 이동 · 삭제

### 핵심 필기

| 명령 | 주요 옵션 | 예 |
|---|---|---|
| `mkdir` | `-p` 부모 디렉터리까지 함께 생성, `-m` 권한 지정 | `mkdir -p a/b/c`, `mkdir -m 700 secret` |
| `rmdir` | ==red:빈 디렉터리만== 삭제, `-p` 부모까지 | `rmdir -p a/b/c` |
| `cp` | `-r`/`-R` 디렉터리 재귀, `-i` 덮어쓰기 확인, `-f` 강제, `-p` 권한·소유자·시간 보존, `-a` 보관(-dR --preserve=all), `-u` 더 새로울 때만, `-b` 백업, `-l`/`-s` 복사 대신 하드/심볼릭 링크 | `cp -r dir1 dir2` |
| `mv` | `-i` 확인, `-f` 강제, `-n` 덮어쓰지 않음, `-u`, `-b` | `mv a.txt b.txt` (이름 변경) |
| `rm` | `-r` 재귀, `-f` 묻지 않고 강제, `-i` 하나씩 확인, `-d` 빈 디렉터리 | `rm -rf old/` |
| `touch` | 빈 파일 생성 또는 ==yellow:시간 정보 갱신==, `-a` 접근 시간만, `-m` 수정 시간만, `-t [[CC]YY]MMDDhhmm[.ss]` 시각 지정, `-r 파일` 그 파일의 시각으로, `-c` 없으면 만들지 않음 | `touch -t 202601011200 old.txt` |

```bash
$ mkdir -p a/b/c
$ rmdir a
rmdir: failed to remove 'a': Directory not empty
$ rmdir -p a/b/c          # c → b → a 순서로 지운다
$ touch -t 202601011200 old.txt
$ ls -l old.txt
-rw-r--r-- 1 root root 0 Jan  1  2026 old.txt
```

> [!TRAP]
> ==red:mv는 같은 파일 시스템 안에서 "이동"과 "이름 변경"을 모두 한다.== 별도 rename 명령을 묻는 보기에 속지 않는다. 또 cp로 디렉터리를 복사할 때 `-r` 없이 쓰면 "omitting directory" 오류가 난다.

## 3. 링크 — 하드 링크와 심볼릭 링크

### 핵심 필기

| 구분 | 하드 링크 `ln 원본 링크` | 심볼릭 링크 `ln -s 원본 링크` |
|---|---|---|
| 아이노드 | ==yellow:원본과 같은 번호== | 새 아이노드(자기만의 파일) |
| 내용 | 같은 데이터를 가리키는 또 하나의 이름 | 원본의 **경로 문자열을** 저장 |
| ls -l 표시 | 일반 파일 `-`, 링크 수 증가 | `l`, `링크 -> 원본`, 권한 rwxrwxrwx |
| 원본 삭제·이동 | ==yellow:그대로 읽힘== (링크 수만 감소) | ==red:깨진 링크(dangling)== |
| 디렉터리 대상 | 불가 | 가능 |
| 다른 파일 시스템 | 불가 | 가능 |
| 크기 | 원본과 같음 | 경로 길이(바이트) |

```bash
$ echo hello > orig.txt
$ ln orig.txt hard.txt
$ ln -s orig.txt soft.txt
$ ls -li orig.txt hard.txt soft.txt
1729015 -rw-r--r-- 2 root root 6 Oct 30 17:20 hard.txt
1729015 -rw-r--r-- 2 root root 6 Oct 30 17:20 orig.txt
1729016 lrwxrwxrwx 1 root root 8 Oct 30 17:20 soft.txt -> orig.txt
$ mv orig.txt moved.txt
$ cat hard.txt
hello
$ cat soft.txt
cat: soft.txt: No such file or directory
```

[![같은 아이노드를 orig.txt와 hard.txt 두 이름이 가리키는 하드 링크와, 자기 아이노드에 원본 경로 문자열만 담은 심볼릭 링크를 나란히 놓고 원본을 지웠을 때의 결과를 비교한 그림](/materials/diagrams/lm2-l04a-links.svg)](/materials/diagrams/lm2-l04a-links.svg)

*그림 4-1 · 하드 링크와 심볼릭 링크 — 누르면 원본 크기로 열린다.*

> [!NOTE]
> - **읽는 순서:** 왼쪽 하드 링크는 두 이름 → 같은 아이노드 → 같은 데이터. 오른쪽 심볼릭 링크는 링크 이름 → 자기 아이노드 → "orig.txt"라는 글자 → 다시 원본 이름을 찾아간다.
> - **핵심:** 하드 링크는 ==이름을 하나 더 붙인 것==, 심볼릭 링크는 ==바로가기(경로 메모)==다.
> - **시험 포인트:** 원본을 지우면 하드 링크는 살아 있고 심볼릭 링크는 깨진다. 디렉터리·다른 파일 시스템에는 심볼릭만 된다.

> [!TRAP]
> ==red:ln의 인자 순서는 cp와 같다 — "원본 먼저, 새 이름 나중".== `ln -s 대상 링크이름`. 또 하드 링크를 만들면 원본의 ls -l 두 번째 열(링크 수)이 1 → 2로 늘어난다. 심볼릭 링크는 원본의 링크 수를 바꾸지 않는다.

> [!CHECK]
> **1.** `mkdir a/b/c`가 "No such file or directory"로 실패했다. 한 번에 만들려면 어떤 옵션을 붙이는가?
>
> **2.** 하드 링크와 원본의 `ls -i` 결과는 어떤 관계인가? 원본을 지운 뒤 하드 링크를 cat하면?

## 4. 파일 내용 보기

| 명령 | 뜻 / 옵션 |
|---|---|
| `cat` | 내용 전체 출력·파일 합치기, `-n` 모든 줄 번호, `-b` 빈 줄 제외 번호, `-s` 연속 빈 줄 하나로 |
| `tac` | 거꾸로(마지막 줄부터) 출력 |
| `nl` | 줄 번호 붙여 출력 |
| `more` | 한 화면씩, ==red:앞으로만== (Space 다음 화면, Enter 한 줄, b 뒤로 일부, q 종료) |
| `less` | 한 화면씩, ==yellow:앞뒤 자유 이동== (b·PageUp 뒤로, `/문자열` 검색, n·N 다음·이전, g·G 처음·끝, q 종료) |
| `head` | 앞부분, 기본 10줄, `-n 숫자` 또는 `-숫자`, `-c` 바이트 |
| `tail` | 뒷부분, 기본 10줄, `-n 숫자`, `-n +숫자`(그 줄부터 끝까지), `-f` ==yellow:내용이 추가되는 대로 계속 출력== |
| `file` | 파일 종류 판별 |

```bash
$ seq 1 20 > n.txt
$ head -3 n.txt
1
2
3
$ tail -n +19 n.txt
19
20
$ tail -f /var/log/messages      # 로그 실시간 감시, Ctrl+C로 종료
$ file orig.txt soft.txt /etc /dev/null
orig.txt:    ASCII text
soft.txt:    symbolic link to orig.txt
/etc:        directory
/dev/null:   character special (1/3)
```

> [!TRAP]
> ==red:"less is more"== — less가 more보다 기능이 많다(뒤로 이동, 검색). 실시간 로그 감시는 `tail -f`이지 `head -f`가 아니다.

## 5. 파일 찾기 — find · locate · which · whereis

### 핵심 필기

**find 경로 조건 동작** — 실제 디렉터리를 뒤져서 찾는다(느리지만 정확).

| 조건 | 뜻 | 예 |
|---|---|---|
| `-name` / `-iname` | 이름(와일드카드 가능) / 대소문자 무시 | `find / -name '*.conf'` |
| `-type` | `f` 파일, `d` 디렉터리, `l` 심볼릭 링크, `b` `c` 장치 | `find . -type l` |
| `-user` / `-group` | 소유자 / 그룹 | `find /home -user kim` |
| `-nouser` / `-nogroup` | 소유자·그룹이 없는(삭제된 계정의) 파일 | |
| `-perm` | `-perm 644` 정확히 일치, `-perm -4000` ==yellow:해당 비트를 포함== | `find / -perm -4000` |
| `-size` | `+10M` 초과, `-10k` 미만, `c` 바이트 `k` `M` `G` | `find / -size +100M` |
| `-mtime` / `-atime` / `-ctime` | 수정 / 접근 / 상태 변경 후 n일. `+7` 7일 초과 전, `-1` 1일 이내 | `find . -mtime -1` |
| `-newer 파일` | 그 파일보다 최근에 수정된 것 | |
| `-empty` | 빈 파일·디렉터리 | |
| `-maxdepth n` | 검색 깊이 제한 | |
| `-exec 명령 {} \;` | 찾은 파일마다 명령 실행 (`{}` 자리에 파일 이름) | `find . -name '*.tmp' -exec rm {} \;` |
| `-ok 명령 {} \;` | -exec와 같지만 ==하나씩 확인== 질문 | |

```bash
$ find . -name '*.txt' -type f
./hard.txt
./n.txt
./orig.txt
$ find . -type l
./soft.txt
$ find . -name 't1' -exec ls -l {} \;
-rw-r--r-- 1 root root 3 Oct 30 17:20 ./t1
$ find / -perm -4000 -type f 2>/dev/null | head -3
/usr/bin/sudo
/usr/bin/chfn
/usr/bin/chsh
```

| 명령 | 찾는 방식 | 결과 |
|---|---|---|
| `locate 이름` | ==yellow:미리 만든 DB==에서 검색 → 매우 빠름. DB 갱신은 `updatedb`(보통 하루 한 번 cron) | 방금 만든 파일은 updatedb 전까지 안 나옴 |
| `which 명령` | ==yellow:PATH== 환경 변수에 있는 디렉터리에서 실행 파일 위치 | `/usr/bin/ls` |
| `whereis 명령` | 실행 파일 + ==yellow:소스 + 매뉴얼== 위치 | |
| `type 명령` | 셸 내장 명령·alias·외부 명령 구분 | `cd is a shell builtin` |

```bash
$ which ls
/usr/bin/ls
$ whereis passwd
passwd: /usr/bin/passwd /etc/passwd /usr/share/man/man1/passwd.1.gz /usr/share/man/man5/passwd.5.gz
$ type cd
cd is a shell builtin
```

> [!TRAP]
> ==red:-perm 644는 "정확히 644", -perm -644는 "최소한 644의 비트를 모두 가짐"이다.== SetUID 파일 점검은 `-perm -4000`(또는 `-perm -u+s`). 또 `-mtime +7`은 "7일보다 더 오래 전", `-mtime -7`은 "7일 이내"다.

> [!CHECK]
> **3.** /home 아래에서 소유자가 lee인 일반 파일만 찾는 find 명령을 쓰시오.
>
> **4.** 실행 파일의 경로와 함께 매뉴얼 페이지 위치까지 보여 주는 명령은?

> [!PAGEBREAK]

## PART 2 · 입출력 재지정과 텍스트 가공

## 6. 리다이렉션과 파이프

### 핵심 필기

| 번호 | 스트림 | 기본 장치 |
|:---:|---|---|
| 0 | 표준 입력 (stdin) | 키보드 |
| 1 | 표준 출력 (stdout) | 화면 |
| 2 | 표준 에러 (stderr) | 화면 |

| 기호 | 뜻 | 예 |
|---|---|---|
| `>` | 표준 출력을 파일로 (==red:덮어쓰기==) | `ls > list.txt` |
| `>>` | 표준 출력을 파일 끝에 ==yellow:추가== | `echo two >> f` |
| `<` | 파일을 표준 입력으로 | `wc -l < f` |
| `<< 끝문자` | here document — 끝문자가 나올 때까지를 입력으로 | `cat << EOF` |
| `2>` | 표준 에러를 파일로 | `ls nofile 2> err.txt` |
| `2>>` | 표준 에러를 파일 끝에 추가 | |
| `2>&1` | 표준 에러를 표준 출력이 가는 곳으로 | `cmd > out.txt 2>&1` |
| `&>` | 표준 출력과 에러를 함께 (bash) | `cmd &> all.txt` |
| `\|` | 앞 명령의 출력을 뒤 명령의 입력으로 (파이프) | `ps -ef \| grep sshd` |
| `tee 파일` | 화면에도 출력하면서 파일에도 저장 | `ls \| tee list.txt` |
| `/dev/null` | 버리는 곳 | `cmd 2> /dev/null` |

```bash
$ echo one > f
$ echo two >> f
$ cat f
one
two
$ wc -l < f
2
$ ls orig.txt nofile > out.txt 2>&1
$ cat out.txt
ls: cannot access 'nofile': No such file or directory
orig.txt
$ ls orig.txt nofile 2>&1 > o2.txt     # 순서를 바꾸면
ls: cannot access 'nofile': No such file or directory
$ cat o2.txt
orig.txt
```

- 명령 연결: `;` 앞뒤 순서대로 실행, `&&` 앞이 ==성공==했을 때만 뒤 실행, `||` 앞이 ==실패==했을 때만 뒤 실행.
- `set -o noclobber`를 켜면 `>`가 기존 파일을 덮어쓰지 않는다(`>|`로 강제).

> [!TRAP]
> `> out 2>&1`과 `2>&1 > out`은 ==red:리다이렉션 순서에 따라 결과가 다르다.== 왼쪽부터 처리하므로, 뒤쪽 형태는 에러를 "아직 화면인" 표준 출력으로 먼저 보낸 뒤 표준 출력만 파일로 옮긴다. 위 실습처럼 에러는 화면에 남는다.

## 7. 텍스트 가공 — grep · wc · sort · uniq · cut · tr

### 핵심 필기

**grep 패턴 파일** — 패턴이 들어 있는 줄 출력

| 옵션 | 뜻 |
|---|---|
| `-i` | 대소문자 무시 |
| `-v` | ==yellow:일치하지 않는== 줄 |
| `-n` | 줄 번호 표시 |
| `-c` | 일치하는 ==줄 수==만 |
| `-l` | 일치하는 파일 이름만 |
| `-w` / `-x` | 단어 단위 / 줄 전체 일치 |
| `-r` | 하위 디렉터리까지 |
| `-E` | 확장 정규식 (egrep) — `\|`, `+`, `?`, `{n}` |
| `-F` | 정규식 없이 고정 문자열 (fgrep) |
| `-o` | 일치한 부분만 |

정규식 기본: `^` 줄 시작, `$` 줄 끝, `.` 아무 한 글자, `*` 앞 글자 0회 이상, `[abc]` 그중 하나, `[^abc]` 그 외.

| 명령 | 옵션 |
|---|---|
| `wc` | `-l` 줄 수, `-w` 단어 수, `-c` 바이트 수, `-m` 문자 수. 옵션 없으면 ==blue:줄 · 단어 · 바이트== 순 |
| `sort` | `-r` 역순, `-n` 숫자 크기순, `-t 구분자`, `-k 필드`, `-u` 중복 제거, `-f` 대소문자 무시, `-o 파일` 결과 저장 |
| `uniq` | ==red:인접한== 중복 줄을 하나로, `-c` 개수, `-d` 중복된 것만, `-u` 중복 없는 것만 |
| `cut` | `-d 구분자 -f 필드`, `-c 문자 위치`, `-b 바이트` |
| `tr` | 문자 바꾸기 `tr 'a-z' 'A-Z'`, `-d` 삭제, `-s` 연속된 같은 문자 하나로 — ==red:파일 인자를 받지 않고 표준 입력만== |

```bash
$ cat users.txt
kim:x:1001:1001::/home/kim:/bin/bash
lee:x:1002:1002::/home/lee:/bin/sh
park:x:1003:1003::/home/park:/bin/bash
choi:x:1004:1004::/home/choi:/bin/bash
$ wc users.txt
  4   4 150 users.txt
$ grep -c bash users.txt
3
$ grep -v bash users.txt
lee:x:1002:1002::/home/lee:/bin/sh
$ grep -n '^p' users.txt
3:park:x:1003:1003::/home/park:/bin/bash
$ cut -d: -f1,7 users.txt
kim:/bin/bash
lee:/bin/sh
park:/bin/bash
choi:/bin/bash
$ cut -d: -f7 users.txt | sort | uniq -c
      3 /bin/bash
      1 /bin/sh
$ sort -t: -k3 -nr users.txt | head -2
choi:x:1004:1004::/home/choi:/bin/bash
park:x:1003:1003::/home/park:/bin/bash
$ echo "Hello Linux" | tr 'a-z' 'A-Z'
HELLO LINUX
$ echo "a  b   c" | tr -s ' '
a b c
```

> [!TRAP]
> ==red:uniq는 "붙어 있는" 중복만 지운다.== 정렬되지 않은 apple, banana, apple을 uniq에 넣으면 그대로 세 줄이다. 그래서 거의 항상 `sort | uniq`로 쓴다(또는 `sort -u`). 또 `sort -n` 없이 숫자를 정렬하면 문자 순서라 10이 2보다 앞에 온다.

> [!EXAMPLE]
> **문제 상황:** 접속 로그에서 IP별 접속 횟수를 많은 순으로 상위 3개만 보고 싶다(IP가 첫 번째 칸, 공백 구분).
>
> ```bash
> $ cut -d' ' -f1 access.log | sort | uniq -c | sort -rn | head -3
> ```
>
> 자르기(cut) → 같은 IP끼리 모으기(sort) → 개수 세기(uniq -c) → 숫자 역순(sort -rn) → 앞 3줄(head).

> [!CHECK]
> **5.** 표준 에러만 err.log 파일 끝에 추가하는 리다이렉션 기호는?
>
> **6.** `printf 'b\na\nb\n' | uniq | wc -l`의 출력은?

> [!PAGEBREAK]

## PART 3 · 기타 필수 명령어

## 8. 날짜 · 달력 · 화면 · 시스템 정보

| 명령 | 뜻 |
|---|---|
| `date` | 현재 날짜·시간, `+형식`으로 출력 형식 지정 (%Y 연, %m 월, %d 일, %H 시, %M 분, %S 초, %A 요일, %j 연중 일수) |
| `date MMDDhhmm[[CC]YY][.ss]` | (root) 시스템 시각 설정 |
| `cal` | 이번 달 달력, `cal 월 연도`, `cal 연도`(1년치), `-j` 연중 일수 |
| `clear` | 화면 지우기 (Ctrl+L) |
| `uname` | 시스템 정보, `-a` 전부, `-r` 커널 버전, `-s` 커널 이름, `-m` 하드웨어, `-n` 호스트 이름 |
| `hostname` | 호스트 이름 확인·설정 |
| `history` | 명령 기록 (6편에서 자세히) |

```bash
$ date
Fri Oct 30 17:21:33 UTC 2026
$ date '+%Y-%m-%d %H:%M:%S'
2026-10-30 17:21:33
$ cal 10 2026
    October 2026
Su Mo Tu We Th Fr Sa
             1  2  3
 4  5  6  7  8  9 10
11 12 13 14 15 16 17
18 19 20 21 22 23 24
25 26 27 28 29 30 31
$ uname -r
6.18.44-fc-v185
```

## 9. 도움말 — man · info · whatis · apropos

| 명령 | 뜻 |
|---|---|
| `man 명령` | 매뉴얼 페이지 (less로 열림, `/` 검색, q 종료) |
| `man 섹션 이름` | 특정 섹션 — `man 5 passwd`는 /etc/passwd **파일 형식** |
| `man -k 키워드` = `apropos` | ==yellow:키워드가 들어간 매뉴얼 목록 검색== |
| `man -f 이름` = `whatis` | 그 이름의 ==한 줄 설명== |
| `info 명령` | GNU info 문서 (노드 단위, 하이퍼링크 이동) |
| `명령 --help` | 짧은 사용법 |

| 섹션 | 내용 |
|:---:|---|
| 1 | ==blue:일반 사용자 명령== (ls, passwd) |
| 2 | 시스템 콜 (open, fork) |
| 3 | C 라이브러리 함수 (printf) |
| 4 | 장치 파일 (/dev) |
| 5 | ==blue:파일 형식·설정 파일== (/etc/passwd, fstab) |
| 6 | 게임 |
| 7 | 기타 (규약, 매크로) |
| 8 | ==blue:시스템 관리자 명령== (useradd, mount) |

> [!TRAP]
> `man passwd`는 ==red:1번 섹션(passwd 명령)==, `man 5 passwd`가 ==red:/etc/passwd 파일 형식==이다. 같은 이름이 여러 섹션에 있으면 번호가 작은 것이 먼저 열린다.

## 10. 시스템 종료와 재부팅

| 명령 | 뜻 |
|---|---|
| `shutdown -h now` | 지금 종료(전원 끄기) |
| `shutdown -r now` | 지금 재부팅 |
| `shutdown -h +10` | 10분 뒤 종료 |
| `shutdown -r 22:00 "점검"` | 22시에 재부팅, 접속자에게 메시지 |
| `shutdown -c` | ==yellow:예약된 종료 취소== |
| `shutdown -k +5` | ==red:실제로 끄지 않고 경고 메시지만== 보냄 |
| `halt` / `poweroff` | 시스템 정지 / 전원 끄기 |
| `reboot` | 재부팅 |
| `init 0` / `init 6` | 런레벨 0(종료) / 6(재부팅) |
| `systemctl poweroff` / `systemctl reboot` | systemd 방식 |
| `sync` | 메모리 버퍼의 내용을 디스크에 즉시 기록 |

> [!TRAP]
> ==red:shutdown -h는 halt(정지·종료), -r은 reboot, -k는 경고만, -c는 취소==. 시간 인자 `+10`은 "10분 뒤", `now`는 `+0`과 같다. init 0은 종료, init 6은 재부팅(런레벨은 2편 참고).

> [!CHECK]
> **7.** 키워드 "partition"이 들어간 매뉴얼 목록을 찾는 명령 두 가지를 쓰시오.
>
> **8.** 30분 뒤 시스템을 재부팅하도록 예약하는 명령과, 그것을 취소하는 명령을 쓰시오.

> [!PAGEBREAK]

## PART 4 · 기출 유형 연습

> [!QUIZ]
> 하드 링크와 심볼릭 링크에 대한 설명으로 옳지 않은 것은?
>
> **A.** 하드 링크는 원본과 같은 아이노드 번호를 가진다.
>
> **B.** 심볼릭 링크는 원본을 삭제하면 사용할 수 없게 된다.
>
> **C.** 하드 링크는 디렉터리와 다른 파일 시스템의 파일에도 만들 수 있다.
>
> **D.** 심볼릭 링크는 `ln -s` 명령으로 만든다.

> [!HINT 1]
> 아이노드 번호는 파일 시스템 안에서만 의미가 있다.

> [!ANSWER]
> **C.** 하드 링크는 같은 파일 시스템 안의 일반 파일에만 만들 수 있다. 디렉터리나 다른 파일 시스템(파티션)을 가리키려면 심볼릭 링크를 쓴다.

> [!QUIZ]
> 명령의 실행 결과는 화면에 보이게 두고, 에러 메시지만 /dev/null로 버리는 명령은?
>
> **A.** `find / -name core > /dev/null`
>
> **B.** `find / -name core 2> /dev/null`
>
> **C.** `find / -name core &> /dev/null`
>
> **D.** `find / -name core 1> /dev/null`

> [!HINT 1]
> 표준 에러의 번호는 2다.

> [!ANSWER]
> **B.** A·D는 정상 결과를 버리고 에러를 화면에 남긴다. C는 둘 다 버린다.

> [!QUIZ]
> 현재 디렉터리 아래에서 7일 이내에 수정된 일반 파일을 찾는 명령으로 옳은 것은?
>
> **A.** `find . -type f -mtime +7`
>
> **B.** `find . -type d -mtime -7`
>
> **C.** `find . -type f -mtime -7`
>
> **D.** `find . -type f -atime 7`

> [!HINT 1]
> `-`는 "이내", `+`는 "초과(그보다 오래 전)"다.

> [!ANSWER]
> **C.** -type f(일반 파일) + -mtime -7(수정 7일 이내). A는 7일보다 오래된 파일, B는 디렉터리, D는 접근 시간 기준이다.

> [!QUIZ]
> 다음 명령의 결과로 출력되는 숫자는?
>
> ```bash
> $ printf 'apple\nbanana\napple\ncherry\nbanana\napple\n' | sort | uniq | wc -l
> ```
>
> **A.** 6
>
> **B.** 4
>
> **C.** 3
>
> **D.** 1

> [!HINT 1]
> sort로 같은 줄을 붙여 놓은 뒤 uniq가 중복을 지운다.

> [!ANSWER]
> **C.** 정렬 후 중복을 지우면 apple, banana, cherry 세 줄. sort 없이 uniq만 썼다면 인접 중복이 없어 6줄이 그대로 나온다.

> [!QUIZ]
> /etc/passwd에서 사용자 이름과 로그인 셸만 출력하는 명령으로 옳은 것은?
>
> **A.** `cut -d: -f1,7 /etc/passwd`
>
> **B.** `cut -c1,7 /etc/passwd`
>
> **C.** `cut -f1,7 /etc/passwd`
>
> **D.** `tr -d: -f1,7 /etc/passwd`

> [!HINT 1]
> passwd는 콜론으로 구분된 7개 필드다. cut의 기본 구분자는 탭이다.

> [!ANSWER]
> **A.** -d로 구분자 콜론을, -f로 1·7번째 필드를 지정한다. B는 1·7번째 "글자", C는 탭 기준이라 구분이 안 되고, D의 tr은 필드를 자르는 명령이 아니다.

> [!QUIZ]
> 다음 중 명령어와 설명의 연결이 옳지 않은 것은?
>
> **A.** `which` — PATH에서 실행 파일의 위치를 찾는다.
>
> **B.** `locate` — 데이터베이스를 이용해 빠르게 파일을 찾는다.
>
> **C.** `whereis` — 실행 파일, 소스, 매뉴얼 페이지의 위치를 찾는다.
>
> **D.** `whatis` — 키워드가 포함된 모든 매뉴얼 페이지를 검색한다.

> [!HINT 1]
> 키워드 검색은 apropos(man -k), 한 줄 설명은 whatis(man -f)다.

> [!ANSWER]
> **D.** whatis는 정확히 그 이름의 한 줄 설명을 보여 준다. 키워드 검색은 apropos 또는 man -k.

> [!QUIZ]
> 사용자에게 경고 메시지만 보내고 시스템은 실제로 종료하지 않는 명령은?
>
> **A.** `shutdown -c`
>
> **B.** `shutdown -k now`
>
> **C.** `shutdown -h +5`
>
> **D.** `shutdown -r now`

> [!HINT 1]
> 네 옵션 c·k·h·r의 뜻을 각각 떠올린다.

> [!ANSWER]
> **B.** -k는 경고만 보낸다. -c는 예약 취소, -h는 종료, -r은 재부팅.

> [!PAGEBREAK]

## 단원 마무리

| 주제 | 꼭 외울 것 |
|---|---|
| 이동·목록 | `cd -` 직전 디렉터리, ls -a -l -d -i -R -h -F |
| 만들기·삭제 | mkdir -p, rmdir(빈 디렉터리만), cp -r -p -a -i, mv(이동·이름 변경), rm -r -f -i, touch -t |
| 링크 | 하드: 같은 아이노드, 원본 삭제 후에도 유지, 디렉터리·타 FS 불가 / 심볼릭: ln -s, 경로 저장, 원본 삭제 시 깨짐 |
| 보기 | cat -n, more(앞으로만), less(앞뒤·검색), head/tail -n, tail -f |
| 찾기 | find -name -type -user -perm -size -mtime -exec, locate+updatedb, which(PATH), whereis(실행·소스·매뉴얼) |
| 재지정 | > 덮어쓰기, >> 추가, 2> 에러, 2>&1, << here doc, \| 파이프, tee |
| 가공 | grep -i -v -n -c -l -r -E, wc -l -w -c, sort -n -r -t -k -u, uniq -c -d -u, cut -d -f -c, tr -d -s |
| 도움말 | man 1·5·8 섹션, man -k = apropos, man -f = whatis, info |
| 종료 | shutdown -h -r -c -k +분, halt, poweroff, reboot, init 0/6 |

## 책을 덮고 꺼내 보기

- 직전 작업 디렉터리로 돌아가는 명령은 {{cd -}}다.
- 하드 링크는 원본과 {{아이노드 번호}}가 같다.
- 심볼릭 링크를 만드는 명령은 {{ln -s 원본 링크}}다.
- 표준 출력과 표준 에러를 모두 한 파일로 보내려면 `> 파일` 뒤에 {{2>&1}}을 붙인다.
- uniq는 {{인접한}} 중복 줄만 제거하므로 보통 sort와 함께 쓴다.
- 키워드로 매뉴얼을 검색하는 명령은 {{man -k}} 또는 {{apropos}}다.

> [!FLASHCARD]
> Q: 하드 링크와 심볼릭 링크의 차이 네 가지는?
> A: 아이노드(같음/다름), 원본 삭제 시(유지/깨짐), 디렉터리 대상(불가/가능), 다른 파일 시스템(불가/가능).

> [!FLASHCARD]
> Q: find -perm 644와 -perm -4000의 차이는?
> A: 644는 권한이 정확히 644인 것, -4000은 SetUID 비트를 포함한 모든 것(나머지 비트는 상관없음).

> [!FLASHCARD]
> Q: which, whereis, locate의 차이는?
> A: which는 PATH에서 실행 파일 위치, whereis는 실행 파일·소스·매뉴얼 위치, locate는 updatedb로 만든 DB에서 이름으로 빠르게 검색.

> [!FLASHCARD]
> Q: 표준 입력·출력·에러의 번호와 리다이렉션 기호는?
> A: 0 stdin(<), 1 stdout(>, >>), 2 stderr(2>, 2>>). 둘 다는 `> f 2>&1` 또는 `&> f`.

> [!FLASHCARD]
> Q: wc를 옵션 없이 실행하면 어떤 순서로 출력하는가?
> A: 줄 수, 단어 수, 바이트 수, 파일 이름.

> [!FLASHCARD]
> Q: man 섹션 1, 5, 8은 각각 무엇인가?
> A: 1 일반 사용자 명령, 5 파일 형식·설정 파일, 8 시스템 관리 명령.

> [!FLASHCARD]
> Q: shutdown의 -h, -r, -c, -k는?
> A: -h 종료, -r 재부팅, -c 예약 취소, -k 경고 메시지만(실제 종료 안 함).

**다음으로 갈 기준:** 파이프로 이어진 명령 한 줄을 보고 결과를 예측하고, 링크 두 종류의 차이를 아이노드로 설명할 수 있으면 다음 편으로 간다: [5편 · 파일 시스템 명령어와 물리 구조](/lectures/grade-mukhnzii/semester-certificate/subject-linux-master-2/lecture-05).

> [!PAGEBREAK]

## 정답과 해설

1. `mkdir -p a/b/c` — 없는 부모 디렉터리(a, a/b)까지 함께 만든다.
2. **아이노드 번호가 같다.** 원본을 지워도 같은 아이노드를 가리키는 이름이 남아 있으므로 내용이 **그대로 출력**된다(링크 수만 1 줄어든다).
3. `find /home -user lee -type f`
4. **whereis** (예: `whereis passwd`).
5. `2>>` — 예: `명령 2>> err.log`.
6. **3** — 입력 b, a, b는 인접한 중복이 없으므로 uniq 후에도 세 줄 그대로다.
7. `man -k partition`, `apropos partition`.
8. 예약: `shutdown -r +30`, 취소: `shutdown -c`.
