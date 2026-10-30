---
title: "0 · 리눅스마스터 2급 시험 지도와 암기 코드"
description: "리눅스마스터 2급 1차 시험 세 과목의 범위와 노트 14편의 대응 관계, 공부 순서를 한 장에 정리하고, 시험 직전에 꺼내 볼 암기 코드와 자주 나오는 명령어·파일 경로를 모은 길잡이 노트입니다."
order: 0
published: true
duration: 40
tags: [리눅스마스터 2급, 자격증, 시험 개요, 암기 코드, 명령어 총정리]
objectives:
  - 리눅스마스터 2급 1차 시험의 세 과목 구성과 합격 기준을 말하고 과목별 공부 비중을 정한다.
  - 노트 14편이 출제 범위의 어느 과목·장에 대응하는지 찾는다.
  - 자주 나오는 목록·순서·번호를 암기 코드로 떠올린다.
  - 자주 나오는 명령어와 설정 파일 경로를 기능별로 묶어 말한다.
---

## 학습 경로 · 리눅스마스터 2급 노트 사용법

[1편 · 리눅스의 이해 →](/lectures/grade-mukhnzii/semester-certificate/subject-linux-master-2/lecture-01)

**리눅스마스터(Linux Master)** 는 한국정보통신진흥협회(KAIT)가 시행하는 국가공인 리눅스 자격이다. 2급은 리눅스 시스템을 설치하고, 기본 명령으로 사용자·파일·프로세스·패키지를 다루고, 네트워크와 응용 분야를 이해하는지를 묻는다. 시험은 1차(필기)와 2차(실기)로 나뉘며, 이 노트는 ==1차 필기 시험 범위==를 다룬다.

**이 노트의 구성 기준:** KAIT가 공개한 리눅스마스터 2급 1차 출제 범위(3과목·장 구성)를 따라 14편으로 나눴다. 명령어 예시는 실제 리눅스에서 실행해 확인한 출력을 우선 실었고, 문장·표·예시는 학습용으로 새로 작성했다.

**형광펜 읽는 법:** ==yellow:노랑== 핵심 정의·결론 · ==red:빨강== 시험에서 헷갈리는 구분·함정 · ==blue:파랑== 외워야 할 순서·목록

> [!CAUTION]
> 시험 방식(문항 수, 시험 시간, 과락 기준, 출제 범위 개정, 접수 일정)은 바뀔 수 있다. 아래 수치는 널리 알려진 기준을 정리한 것이므로 ==응시 전 KAIT 자격검정 사이트(ihd.or.kr)의 최신 공고를 반드시 확인==한다.

## 시험 한눈에 보기

| 과목 | 장 구성 | 문항 (공식 공고 확인) |
| --- | --- | :---: |
| **1과목 리눅스 일반** | 1장 리눅스의 이해 · 2장 리눅스 설치 · 3장 기본 명령어 | 20 |
| **2과목 리눅스 운영 및 관리** | 1장 파일 시스템 관리 · 2장 셸 · 3장 프로세스 관리 · 4장 에디터 · 5장 소프트웨어 설치 · 6장 장치 설정 | 20 |
| **3과목 리눅스 활용** | 1장 X 윈도우 · 2장 인터넷 활용 · 3장 리눅스 응용분야 | 20 |

- 1차: 객관식 4지선다 ==60문항, 100분==으로 알려져 있다 (응시 전 공식 공고 확인).
- ==blue:합격: 평균 60점 이상 + 어느 과목도 40점 미만 과락 없음== (100점 만점 환산 기준, 응시 전 공식 공고 확인).
- 1차에 합격하면 일정 기간 안에 2차(실기)에 응시할 수 있다. 2차의 형식과 1차 합격 유효 기간도 공식 공고로 확인한다.
- ==red:세 과목이 같은 비중이다.== 한 과목이라도 과락이면 떨어지므로, 약한 과목(보통 3과목 네트워크·응용분야)을 버리지 않는다.

> [!EXAM]
> **출제 경향 세 줄 요약**
>
> 1. **명령어 옵션·결과 고르기**가 가장 많다. "다음 중 ○○를 하는 명령으로 알맞은 것은?", "실행 결과로 옳은 것은?"처럼 옵션 한 글자(`-r`/`-R`, `-z`/`-j`/`-J`)로 오답을 만든다.
> 2. **번호·필드 암기형**이 고정 출제된다 — 권한 8진수(755, 4755), umask, 시그널 번호, crontab 다섯 필드, `/etc/passwd` 일곱 필드, `/etc/fstab` 여섯 필드, 런레벨, 포트 번호, IP 클래스.
> 3. **짝 개념 비교**에서 함정이 나온다 — MBR vs GPT, 하드 링크 vs 심볼릭 링크, rpm vs dpkg, System V vs BSD 프린터 명령, 타입 1 vs 타입 2 하이퍼바이저, IaaS vs PaaS vs SaaS.

## 노트 지도

| 노트 | 시험 범위 | 핵심 키워드 |
| --- | --- | --- |
| [1편](/lectures/grade-mukhnzii/semester-certificate/subject-linux-master-2/lecture-01) | 1과목 1장 리눅스의 이해 | 커널·셸, 특징, 유닉스·GNU·토르발스, GPL·LGPL·BSD·Apache·MPL, 배포판 계열 |
| [2편](/lectures/grade-mukhnzii/semester-certificate/subject-linux-master-2/lecture-02) | 1과목 2장 리눅스 설치 | 장치 이름·UUID, MBR·GPT, 스왑·LVM, ext4·xfs·저널링, GRUB2, 부팅 순서, 런레벨 |
| [3편](/lectures/grade-mukhnzii/semester-certificate/subject-linux-master-2/lecture-03) | 1과목 3장 기본 명령어 (1) | useradd·passwd·chage, /etc/passwd·shadow, su·sudo, chmod·chown·umask, SetUID·Sticky |
| [4편](/lectures/grade-mukhnzii/semester-certificate/subject-linux-master-2/lecture-04) | 1과목 3장 기본 명령어 (2) | ls·cp·mv·rm·ln·find, 리다이렉션·파이프, grep·sort·cut, shutdown |
| [5편](/lectures/grade-mukhnzii/semester-certificate/subject-linux-master-2/lecture-05) | 2과목 1장 파일 시스템 관리 | mount·/etc/fstab, fdisk·mkfs·fsck, df·du, quota, 슈퍼 블록·아이노드, FHS |
| [6편](/lectures/grade-mukhnzii/semester-certificate/subject-linux-master-2/lecture-06) | 2과목 2장 셸 | bash·csh·chsh, export·env·set, 설정 파일 순서, alias, history, PS1 |
| [7편](/lectures/grade-mukhnzii/semester-certificate/subject-linux-master-2/lecture-07) | 2과목 3장 프로세스 관리 | ps·top·pstree, nice·renice, kill과 시그널, jobs·fg·bg, nohup, at·cron |
| [8편](/lectures/grade-mukhnzii/semester-certificate/subject-linux-master-2/lecture-08) | 2과목 4장 에디터 | vi 세 모드, 이동·편집·검색·치환, set 옵션, vim 실행 옵션 |
| [9편](/lectures/grade-mukhnzii/semester-certificate/subject-linux-master-2/lecture-09) | 2과목 5장 소프트웨어 설치 | rpm·yum·dnf, dpkg·apt, tar·gzip·bzip2·xz, configure → make → make install |
| [10편](/lectures/grade-mukhnzii/semester-certificate/subject-linux-master-2/lecture-10) | 2과목 6장 장치 설정 | 블록·문자 장치, lsmod·modprobe, lp·lpr 계열, CUPS, SANE |
| [11편](/lectures/grade-mukhnzii/semester-certificate/subject-linux-master-2/lecture-11) | 3과목 1장 X 윈도우 | X 서버·클라이언트, 디스플레이 매니저, GNOME·KDE, DISPLAY, xhost·xauth |
| [12편](/lectures/grade-mukhnzii/semester-certificate/subject-linux-master-2/lecture-12) | 3과목 2장 인터넷 활용 (1) | LAN·WAN, 네트워크 장비, OSI 7계층·TCP/IP, IP 클래스, 서브네팅, IPv6 |
| [13편](/lectures/grade-mukhnzii/semester-certificate/subject-linux-master-2/lecture-13) | 3과목 2장 인터넷 활용 (2) | SMTP·POP3·IMAP, FTP, DNS, SSH, NFS·Samba, 포트 번호, ip·ss·ping |
| [14편](/lectures/grade-mukhnzii/semester-certificate/subject-linux-master-2/lecture-14) | 3과목 3장 응용분야 | 클러스터(HPC·LVS·HA), 임베디드, 가상화·하이퍼바이저, 클라우드, 하둡 |

**추천 순서:** 1과목(1 → 2 → 3 → 4편)을 먼저 끝낸다. 3·4편의 명령어가 뒤의 모든 편에서 다시 쓰이기 때문이다. 2과목은 5 → 7 → 6 → 8 → 9 → 10편 순으로, 손으로 실행해 볼 수 있는 것부터 간다. 3과목은 계산이 있는 12편을 먼저 하고 13 → 11 → 14편 순으로 암기형을 몰아서 본다. 시험 일주일 전부터는 이 페이지의 암기 코드와 명령어 표만 반복한다.

[![60문항을 과목별 20문항 세 덩어리로 나누고, 과목 아래에 장과 노트 1편부터 14편을 묶은 뒤, 과락 기준과 합격 기준, 추천 공부 순서를 정리한 시험 지도](/materials/diagrams/lm2-l00a-exam-map.svg)](/materials/diagrams/lm2-l00a-exam-map.svg)

*그림 0-1 · 리눅스마스터 2급 1차 시험 지도 — 누르면 원본 크기로 열린다.*

> [!NOTE]
> - **읽는 순서:** 맨 위 띠(과목별 20문항) → 과목 묶음 안의 장·노트 → 검은 합격 기준 → 맨 아래 추천 순서.
> - **핵심:** 세 과목이 같은 무게다. 문항당 5점으로 환산하면 ==과목마다 8문항 이상(40점)== 맞혀야 과락을 피하고, 합계로는 36문항 이상(평균 60점)이 필요하다 (응시 전 공식 공고 확인).
> - **시험 포인트:** ==red:2과목은 장이 여섯 개라 범위가 가장 넓다.== 명령어 옵션을 실제로 실행해 보며 익히는 것이 가장 빠르다.

> [!PAGEBREAK]

## 암기 코드 모음

시험 직전에 "펼치면" 칸을 가리고 말해 본다. 코드 자체보다 ==각 글자가 무엇인지 끝까지 펼쳐 말할 수 있는지==가 중요하다. 각 편에서 자세히 다룬다.

### 1과목 리눅스 일반

| 코드 | 펼치면 | 노트 |
| --- | --- | --- |
| **프메파디네** | 커널의 5대 기능: 프로세스·메모리·파일 시스템·디바이스·네트워크 관리 | 1편 |
| **69·73·83·91** | 1969 유닉스 → 1973 C로 재작성 → 1983 GNU 프로젝트 → 1991 리눅스 커널 0.01 | 1편 |
| **GLM 공개, BAM 침묵** | 소스 공개 의무 O: GPL·LGPL·MPL / X: BSD·Apache·MIT | 1편 |
| **레·데·슬** | 배포판 3대 계열: Red Hat(rpm·yum/dnf) · Debian(dpkg·apt) · Slackware(pkgtool) | 1편 |
| **446-64-2** | MBR 512바이트 = 부트 코드 446 + 파티션 테이블 64(16×4) + 시그니처 2 | 2편 |
| **주4 논5** | MBR 주 파티션 최대 4개, 논리 파티션은 5번부터 (GPT는 128개) | 2편 |
| **83·82·8e·5** | fdisk ID: 83 Linux · 82 swap · 8e LVM · 5 Extended (fdisk -l의 Id 열) | 2편 |
| **PV → VG → LV** | LVM 생성 순서: 물리 볼륨 → 볼륨 그룹 → 논리 볼륨 | 2편 |
| **바부커시** | 부팅: BIOS/UEFI → 부트로더 → 커널(+initramfs) → systemd(PID 1) | 2편 |
| **0끄 1혼 3글 5그 6재** | 런레벨: 0 종료 · 1 단일 사용자 · 3 텍스트(글자) 다중 사용자 · 5 그래픽 · 6 재부팅 | 2편 |
| **레거시 00, 투 01** | GRUB Legacy `(hd0,0)` / GRUB2 `(hd0,1)` = 첫 디스크 첫 파티션 | 2편 |
| **이패유그코홈셸** | `/etc/passwd` 7필드: 이름·패스워드(x)·UID·GID·코멘트·홈·셸 | 3편 |
| **읽4 쓰2 실1** | r=4, w=2, x=1 → rwxr-xr-x = 755 | 3편 |
| **파666 디777 빼기 umask** | 기본 권한 = 파일 666, 디렉터리 777에서 umask를 뺀 값 (umask 022 → 644·755) | 3편 |
| **4유 2그 1스** | 특수 권한: 4 SetUID · 2 SetGID · 1 Sticky (4755 → `rwsr-xr-x`, 1777 → `rwxrwxrwt`) | 3편 |
| **하같 심다** | 하드 링크는 원본과 같은 아이노드, 심볼릭 링크는 다른 아이노드(경로를 가리킴) | 4편 |
| **하나 덮고 둘 붙이고** | `>` 하나는 덮어쓰기 · `>>` 둘은 이어 붙이기 · `2>` 오류만 · `2>&1` 오류를 출력과 합치기 | 4편 |

### 2과목 리눅스 운영 및 관리

| 코드 | 펼치면 | 노트 |
| --- | --- | --- |
| **장마종옵덤체** | `/etc/fstab` 6필드: 장치 · 마운트 포인트 · 파일 시스템 종류 · 옵션 · dump · fsck 순서 | 5편 |
| **부슈아데** | 파일 시스템 물리 구조: 부트 블록 · 슈퍼 블록 · 아이노드(테이블) · 데이터 블록 | 5편 |
| **프베로시** | 로그인 셸 설정 파일 순서: `/etc/profile` → `~/.bash_profile` → `~/.bashrc` → `/etc/bashrc` | 6편 |
| **느낌표 셋** | `!!` 직전 명령 · `!n` n번 명령 · `!문자열` 그 문자열로 시작하는 최근 명령 | 6편 |
| **유호와더** | PS1: `\u` 사용자 · `\h` 호스트 · `\w` 전체 경로(`\W` 마지막 디렉터리) · `\$` 일반 $ / root # | 6편 |
| **1·2·9·15·18·19·20** | 시그널: HUP · INT · KILL · TERM · CONT · STOP · TSTP ("헙인킬텀 콘스톱 티스톱") | 7편 |
| **분시일월요** | crontab 5필드: 분 · 시 · 일 · 월 · 요일 (그다음 명령) | 7편 |
| **-20 높고 19 낮다** | nice 값 범위 -20(우선순위 가장 높음) – 19(가장 낮음), 기본 0 | 7편 |
| **명입콜** | vi 세 모드: 명령 모드 · 입력 모드 · 콜론(ex, 마지막 행) 모드 | 8편 |
| **아이 앞, 에이 뒤, 오 아래** | `i` 커서 앞 · `a` 커서 뒤 · `o` 아래 새 줄 (대문자 `I`·`A`·`O`는 줄 처음·끝·위 줄) | 8편 |
| **에스 퍼센트 지** | `:%s/old/new/g` — 파일 전체에서 모든 old를 new로 치환 | 8편 |
| **이유에프 이큐** | rpm: `-i` 설치 · `-U` 업그레이드(없으면 설치) · `-F` 설치된 것만 업그레이드 · `-e` 삭제 · `-q` 질의 | 9편 |
| **씨엑스티 브이에프, 지제이대J** | tar: `c` 묶기 · `x` 풀기 · `t` 목록 · `v` 과정 · `f` 파일 / `z` gzip · `j` bzip2 · `J` xz | 9편 |
| **컨메인** | 소스 설치: `./configure` → `make` → `make install` | 9편 |
| **브 블 씨 문** | `ls -l` 첫 글자 `b` 블록 장치(디스크) · `c` 문자 장치(터미널·키보드) | 10편 |
| **오 엘피, 버클리 알** | System V 프린터 `lp`·`lpstat`·`cancel` / BSD `lpr`·`lpq`·`lprm`·`lpc` | 10편 |

### 3과목 리눅스 활용

| 코드 | 펼치면 | 노트 |
| --- | --- | --- |
| **서버는 화면 쪽** | X 서버 = 화면·키보드·마우스가 있는 쪽, X 클라이언트 = 그 위에 그려지는 응용 프로그램 | 11편 |
| **호스트:디스플레이.스크린** | `DISPLAY=host:0.0` — 0번 디스플레이의 0번 화면 | 11편 |
| **물데네전세표응** | OSI 7계층(아래부터): 물리 · 데이터 링크 · 네트워크 · 전송 · 세션 · 표현 · 응용 | 12편 |
| **네인전응** | TCP/IP 4계층: 네트워크 인터페이스 · 인터넷 · 전송 · 응용 | 12편 |
| **리허1 브스2 라3** | 장비 계층: 리피터·허브 1계층 · 브리지·스위치 2계층 · 라우터 3계층 (게이트웨이는 상위 계층) | 12편 |
| **0·128·192·224** | IPv4 클래스 시작: A 0–127 · B 128–191 · C 192–223 · D 224–239(멀티캐스트) | 12편 |
| **10·172.16·192.168** | 사설 IP: 10.0.0.0/8 · 172.16.0.0/12 · 192.168.0.0/16 | 12편 |
| **쓰고 나르고 넣고** | MUA(메일 쓰기) → MTA(전달, sendmail·postfix) → MDA(메일함에 배달) | 13편 |
| **2021 22 23 25 53 80 110 143 443** | FTP · SSH · Telnet · SMTP · DNS · HTTP · POP3 · IMAP · HTTPS | 13편 |
| **고부고** | 클러스터 3유형: 고계산(HPC) · 부하 분산(LVS) · 고가용성(HA) | 14편 |
| **1은 맨몸, 2는 얹혀** | 하이퍼바이저 타입 1 베어메탈(Xen, KVM, ESXi) · 타입 2 호스트형(VirtualBox, VMware Workstation) | 14편 |
| **인플소** | 클라우드 서비스 모델: IaaS(인프라) · PaaS(플랫폼) · SaaS(소프트웨어) | 14편 |
| **HMY** | 하둡 핵심: HDFS(저장) · MapReduce(처리) · YARN(자원 관리) | 14편 |
| **3V** | 빅데이터: Volume(규모) · Velocity(속도) · Variety(다양성) (+Veracity · Value = 5V) | 14편 |

> [!PAGEBREAK]

## 자주 나오는 명령어 총정리

명령어 이름만 보고 ==무엇을 하는지, 대표 옵션 하나==를 말할 수 있으면 된다. 자세한 옵션과 실행 결과는 각 편에 있다.

### 사용자·권한 (3편)

| 명령 | 하는 일 | 대표 옵션·예 |
| --- | --- | --- |
| `useradd` | 계정 생성 | `-u` UID · `-g` 기본 그룹 · `-G` 보조 그룹 · `-d` 홈 · `-s` 셸 · `-m` 홈 생성 |
| `usermod` | 계정 정보 변경 | `-aG wheel user` 보조 그룹 추가 · `-L`/`-U` 잠금·해제 |
| `userdel` | 계정 삭제 | `-r` 홈 디렉터리까지 삭제 |
| `passwd` | 암호 변경 | `-l` 잠금 · `-u` 해제 · `-d` 암호 삭제 · `-S` 상태 |
| `chage` | 암호 만료 정책 | `-l` 정보 보기 · `-M` 최대 일수 · `-E` 계정 만료일 |
| `groupadd`·`groupdel`·`gpasswd` | 그룹 관리 | `gpasswd -a user group` |
| `su`·`sudo` | 다른 사용자로 전환·실행 | `su -` 로그인 셸로 root 전환, `sudo` 설정은 `visudo` |
| `chmod` | 권한 변경 | `chmod 755 f`, `chmod u+x,g-w f`, `-R` 하위까지 |
| `chown`·`chgrp` | 소유자·그룹 변경 | `chown user:group f`, `-R` |
| `umask` | 기본 권한 마스크 | `umask 022`, `umask -S` 문자로 보기 |
| `id`·`who`·`w`·`last` | 사용자 정보·접속자·접속 기록 | `last`는 `/var/log/wtmp` 기록 |

### 파일·디렉터리·텍스트 (4편)

| 명령 | 하는 일 | 대표 옵션·예 |
| --- | --- | --- |
| `ls` | 목록 | `-l` 자세히 · `-a` 숨김 포함 · `-R` 하위까지 · `-i` 아이노드 번호 · `-d` 디렉터리 자체 |
| `cp`·`mv`·`rm` | 복사·이동(이름 변경)·삭제 | `cp -r`(`-R`) 디렉터리 · `-i` 확인 · `-f` 강제 · `-p` 속성 보존 |
| `mkdir`·`rmdir` | 디렉터리 생성·삭제 | `mkdir -p a/b/c` 중간 경로까지 · `rmdir`는 빈 디렉터리만 |
| `ln` | 링크 | `ln a b` 하드 링크 · `ln -s a b` 심볼릭 링크 |
| `cat`·`more`·`less`·`head`·`tail` | 내용 보기 | `head -n 5`, `tail -f` 실시간 추적 |
| `find` | 조건 검색 | `-name` · `-type f` · `-perm -4000` · `-size +10M` · `-mtime -7` · `-user` · `-exec … {} \;` |
| `locate`·`which`·`whereis` | 위치 찾기 | `locate`는 DB(`updatedb`) 검색, `which`는 PATH의 실행 파일 |
| `grep` | 패턴 검색 | `-i` 대소문자 무시 · `-v` 반전 · `-n` 줄 번호 · `-r` 재귀 · `-c` 개수 · `-l` 파일 이름 |
| `wc`·`sort`·`uniq`·`cut`·`tr` | 세기·정렬·중복 제거·자르기·바꾸기 | `wc -l`, `sort -n -r`, `cut -d: -f1`, `tr a-z A-Z` |
| `shutdown` | 종료·재부팅 | `-h now` 종료 · `-r +10` 10분 후 재부팅 · `-c` 예약 취소 |

### 파일 시스템 (5편)

| 명령 | 하는 일 | 대표 옵션·예 |
| --- | --- | --- |
| `mount`·`umount` | 마운트·해제 | `mount -t ext4 /dev/sdb1 /data`, `mount -a`(fstab 전체), `-o ro,remount` |
| `fdisk`·`parted` | 파티션 편집 | `fdisk -l` 목록 |
| `mkfs`·`mke2fs` | 파일 시스템 생성 | `mkfs -t ext4`, `mkfs.xfs`, `mke2fs -j`(ext3) |
| `fsck`·`e2fsck` | 파일 시스템 검사·복구 | 마운트 해제 후 실행, `-y` 모두 yes |
| `tune2fs` | ext 계열 설정 변경 | `-j` 저널 추가 · `-l` 정보 · `-L` 라벨 · `-c` 검사 주기 |
| `df`·`du` | 디스크 사용량 | `df -h` 파일 시스템별 · `du -sh dir` 디렉터리별 |
| `blkid`·`lsblk` | UUID·장치 트리 | `lsblk -f` |
| `quota`·`edquota`·`repquota`·`quotacheck` | 디스크 할당량 | `edquota -u user` |

### 셸·프로세스·에디터 (6·7·8편)

| 명령 | 하는 일 | 대표 옵션·예 |
| --- | --- | --- |
| `chsh`·`echo $SHELL` | 로그인 셸 변경·확인 | `chsh -s /bin/zsh`, `chsh -l` 목록(일부 배포판) |
| `export`·`env`·`set`·`unset` | 환경 변수·셸 변수 | `env`는 환경 변수만, `set`은 셸 변수까지 |
| `alias`·`unalias`·`history` | 별칭·명령 기록 | `alias ll='ls -l'`, `history 10` |
| `ps` | 프로세스 목록 | `ps -ef`, `ps aux`, `ps -u user` |
| `top`·`pstree`·`pgrep` | 실시간 보기·트리·이름으로 PID 찾기 | `pstree -p`, `pgrep -u user sshd` |
| `kill`·`killall`·`pkill` | 시그널 보내기 | `kill -9 PID`, `kill -l` 목록, `killall httpd` |
| `nice`·`renice` | 우선순위 | `nice -n 10 cmd`, `renice 5 -p PID` |
| `jobs`·`fg`·`bg`·`&`·`nohup` | 작업 제어 | `fg %1`, `Ctrl+Z` 일시 정지 후 `bg` |
| `at`·`crontab` | 작업 예약 | `crontab -e` 편집 · `-l` 목록 · `-r` 삭제 · `atq`·`atrm` |
| `vi`·`vim` | 편집 | `vim +10 f` 10행에서 열기 · `-R` 읽기 전용 · `-o a b` 수평 분할 |

### 패키지·장치·X 윈도우 (9·10·11편)

| 명령 | 하는 일 | 대표 옵션·예 |
| --- | --- | --- |
| `rpm` | RPM 패키지 (Red Hat) | `-ivh` 설치 · `-Uvh` 업그레이드 · `-e` 삭제 · `-qa` 전체 · `-qi` 정보 · `-ql` 파일 목록 · `-qf 파일` 소속 패키지 · `-V` 검증 |
| `yum`·`dnf` | 저장소 + 의존성 (Red Hat) | `install` · `remove` · `update` · `search` · `info` · `list installed` |
| `dpkg` | DEB 패키지 (Debian) | `-i` 설치 · `-r` 삭제 · `-P` 설정까지 삭제 · `-l` 목록 · `-L` 파일 목록 · `-S` 소속 패키지 |
| `apt`·`apt-get`·`apt-cache` | 저장소 + 의존성 (Debian) | `apt update` 목록 갱신 · `apt install` · `apt remove`·`purge` · `apt-cache search` |
| `tar`·`gzip`·`bzip2`·`xz`·`zip` | 묶기·압축 | `tar cvzf a.tar.gz dir`, `tar xvf a.tar`, `gzip -d`, `unzip` |
| `lsmod`·`modprobe`·`insmod`·`rmmod` | 커널 모듈 | `modprobe`는 의존 모듈까지 적재, `-r` 제거 |
| `lsusb`·`lspci` | USB·PCI 장치 목록 | `lspci -v` |
| `lp`·`lpstat`·`cancel` / `lpr`·`lpq`·`lprm`·`lpc` | 프린터 (System V / BSD) | `lp -d 프린터 파일`, `lpr -P 프린터 파일` |
| `scanimage`·`sane-find-scanner` | 스캐너 (SANE) | `scanimage -L` 장치 목록 |
| `startx`·`xinit`·`xhost`·`xauth` | X 시작·접근 제어 | `xhost +192.168.0.10`, `export DISPLAY=host:0` |

### 네트워크 (12·13편)

| 명령 | 하는 일 | 대표 옵션·예 |
| --- | --- | --- |
| `ip`·`ifconfig` | 인터페이스·주소 | `ip addr`, `ip route`, `ip link set eth0 up` / `ifconfig eth0` |
| `nmcli` | NetworkManager 설정 | `nmcli con show`, `nmcli dev status` |
| `route` | 라우팅 테이블 | `route add default gw 192.168.0.1` |
| `netstat`·`ss` | 연결·포트 상태 | `ss -tlnp`, `netstat -antp` |
| `ping`·`traceroute` | 도달 확인·경로 추적 | `ping -c 4 host` |
| `nslookup`·`dig`·`host` | DNS 질의 | `dig example.com MX` |
| `ssh`·`scp`·`sftp`·`telnet` | 원격 접속·파일 복사 | `ssh -p 2222 user@host`, `scp f user@host:/tmp` |

> [!TRAP]
> ==red:대·소문자 하나로 뜻이 바뀌는 옵션==을 모아 두자. `tar -j`(bzip2) vs `-J`(xz) · `rpm -U`(업그레이드) vs `-F`(설치된 것만) · `dpkg -l`(목록) vs `-L`(파일 목록) · `ls -r`(역순) vs `ls -R`(하위까지) · `cp -r`과 `cp -R`은 같다 · `kill -9`(KILL) vs `kill -15`(TERM, 기본값).

## 자주 나오는 파일·디렉터리 경로

| 경로 | 내용 | 노트 |
| --- | --- | --- |
| `/etc/os-release`, `/proc/version` | 배포판 정보, 커널 버전 | 1편 |
| `/etc/default/grub`, `/boot/grub2/grub.cfg` | GRUB2 설정 / 생성된 최종 설정 | 2편 |
| `/etc/lilo.conf`, `/boot/grub/grub.conf` | LILO 설정, GRUB Legacy 설정 | 2편 |
| `/etc/inittab` | SysV 기본 런레벨 (`id:5:initdefault:`) | 2편 |
| `/root/anaconda-ks.cfg` | 킥스타트 설치 기록 | 2편 |
| `/etc/passwd`, `/etc/shadow`, `/etc/group`, `/etc/gshadow` | 계정·암호·그룹 정보 | 3편 |
| `/etc/login.defs`, `/etc/default/useradd`, `/etc/skel` | 계정 생성 기본값, 새 홈에 복사될 파일 | 3편 |
| `/etc/sudoers` | sudo 권한 (`visudo`로 편집) | 3편 |
| `/etc/fstab`, `/etc/mtab`, `/proc/mounts` | 부팅 시 마운트 목록, 현재 마운트 상태 | 5편 |
| `/etc/shells` | 사용 가능한 로그인 셸 목록 | 6편 |
| `/etc/profile`, `/etc/bashrc`, `~/.bash_profile`, `~/.bashrc`, `~/.bash_logout`, `~/.bash_history` | 셸 설정·기록 | 6편 |
| `/etc/crontab`, `/var/spool/cron/`, `/etc/cron.allow`·`cron.deny`, `/etc/at.allow`·`at.deny` | 작업 예약 | 7편 |
| `~/.vimrc`, `~/.exrc` | vi/vim 설정 | 8편 |
| `/etc/yum.repos.d/`, `/etc/apt/sources.list` | 패키지 저장소 설정 | 9편 |
| `/dev/`, `/proc/devices`, `/etc/udev/rules.d/` | 장치 파일, udev 규칙 | 10편 |
| `/etc/cups/cupsd.conf`, `/etc/printcap` | 프린터 설정 | 10편 |
| `/etc/X11/xorg.conf`, `~/.Xauthority`, `~/.xinitrc` | X 설정, X 인증 쿠키, startx 시작 스크립트 | 11편 |
| `/etc/hosts`, `/etc/resolv.conf`, `/etc/services`, `/etc/hostname` | 이름 해석, DNS 서버, 포트 목록, 호스트명 | 13편 |
| `/etc/sysconfig/network-scripts/ifcfg-*`, `/etc/NetworkManager/system-connections/`, `/etc/netplan/` | 인터페이스 설정 (계열·버전에 따라 다름) | 13편 |
| `/etc/exports`, `/etc/samba/smb.conf`, `/etc/ssh/sshd_config` | NFS 공유, Samba 공유, SSH 서버 설정 | 13편 |
| `/var/log/messages`(Red Hat)·`/var/log/syslog`(Debian), `/var/log/secure`, `/var/log/wtmp` | 시스템 로그, 인증 로그, 로그인 기록 | 3·13편 |

> [!FLASHCARD]
> Q: 리눅스마스터 2급 1차 시험의 세 과목과 각 과목의 장 구성은?
> A: 1과목 리눅스 일반(리눅스의 이해·설치·기본 명령어), 2과목 리눅스 운영 및 관리(파일 시스템·셸·프로세스·에디터·소프트웨어 설치·장치 설정), 3과목 리눅스 활용(X 윈도우·인터넷 활용·응용분야).

> [!FLASHCARD]
> Q: 1차 합격 기준은? (응시 전 공식 공고 확인)
> A: 과목별 20문항씩 60문항, 평균 60점 이상이면서 어느 과목도 40점 미만 과락이 없어야 한다.

> [!FLASHCARD]
> Q: 공부 순서의 원칙은?
> A: 모든 편의 바탕이 되는 1과목 명령어(3·4편)를 먼저 익히고, 2과목은 직접 실행해 보며, 3과목은 계산(서브네팅)을 먼저 한 뒤 암기형을 몰아서 본다. 세 과목이 같은 비중이므로 과락 과목을 만들지 않는다.

> [!FLASHCARD]
> Q: 권한·umask·특수 권한의 숫자 규칙은?
> A: r=4, w=2, x=1. 기본 권한은 파일 666, 디렉터리 777에서 umask를 뺀다(022 → 644·755). 특수 권한은 SetUID 4, SetGID 2, Sticky 1을 앞자리에 붙인다(4755, 2755, 1777).

> [!FLASHCARD]
> Q: 자주 나오는 시그널 번호는?
> A: 1 HUP(재시작·설정 다시 읽기), 2 INT(Ctrl+C), 9 KILL(강제 종료), 15 TERM(kill 기본값), 18 CONT(재개), 19 STOP(정지), 20 TSTP(Ctrl+Z).

> [!FLASHCARD]
> Q: 잘 알려진 포트 번호 아홉 개는?
> A: FTP 20·21, SSH 22, Telnet 23, SMTP 25, DNS 53, HTTP 80, POP3 110, IMAP 143, HTTPS 443.
