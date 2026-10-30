---
title: "9편 · 소프트웨어 설치 — rpm·yum/dnf·dpkg·apt·아카이브"
description: "2과목 5장. 레드햇 계열 rpm·yum·dnf, 데비안 계열 dpkg·apt-get·apt-cache, tar 아카이브와 gzip·bzip2·xz 압축, 소스 컴파일 설치까지 시험에 나오는 옵션 중심으로 정리합니다."
order: 9
published: true
duration: 90
tags: [리눅스마스터 2급, 자격증, 2과목, 소프트웨어 설치, rpm, yum, dpkg, apt, tar]
objectives:
  - rpm과 dpkg의 설치·삭제·질의 옵션을 문자 하나까지 구분해 쓴다.
  - yum·dnf와 apt-get·apt-cache의 하위 명령이 하는 일을 설명한다.
  - tar 옵션 조합과 gzip·bzip2·xz의 확장자·해제 명령을 짝지어 말한다.
  - 소스 설치 ./configure → make → make install 의 각 단계가 만드는 결과를 설명한다.
---

## 학습 경로 · 2과목 5장

[← 8편 · 에디터 — vi/vim](/lectures/grade-mukhnzii/semester-certificate/subject-linux-master-2/lecture-08) · [다음: 10편 · 장치 설정 →](/lectures/grade-mukhnzii/semester-certificate/subject-linux-master-2/lecture-10)

**범위:** 2과목 5장 "소프트웨어 설치" — 레드햇 계열 패키지 관리(rpm, yum, dnf), 데비안 계열 패키지 관리(dpkg, apt), 아카이브와 압축(tar, gzip, bzip2, xz, zip), 소스 파일 설치.

**형광펜 읽는 법:** ==yellow:노랑== 핵심 정의·결론 · ==red:빨강== 시험에서 헷갈리는 구분·함정 · ==blue:파랑== 외워야 할 순서·목록

> [!EXAM]
> **이 장의 핵심 질문:** 같은 "프로그램 설치"를 레드햇과 데비안은 어떤 도구로, 어떤 옵션으로 하며, 패키지가 없을 때는 소스를 어떻게 묶고 풀어 설치하는가?
>
> **전체 흐름:** ==blue:패키지 개념 → 레드햇 계열(rpm → yum/dnf) → 데비안 계열(dpkg → apt-get/apt-cache/apt) → 아카이브·압축(tar, gzip/bzip2/xz) → 소스 설치(configure → make → make install)==

---

## 단원 도입

| 출제 포인트 | 빈도 | 이렇게 나온다 |
|---|:---:|---|
| rpm 옵션 (-i -U -F -e, -q 계열, -V) | ★★★ | "설치된 패키지에만 업그레이드하는 옵션", "파일이 속한 패키지 찾기" |
| tar 옵션 조합과 압축 형식 | ★★★ | `tar ( ) backup.tar.bz2 /home` 빈칸 채우기 |
| yum 하위 명령 | ★★★ | "파일을 제공하는 패키지 검색" → provides |
| dpkg 옵션 (-i -r -P -l -L -s -S) | ★★★ | 설정 파일까지 지우는 옵션 → -P |
| apt-get / apt-cache 하위 명령 | ★★ | update와 upgrade의 차이, 의존성 보기 |
| 압축 도구·확장자·해제 명령 | ★★ | .bz2 → bunzip2, .xz → unxz |
| 소스 설치 3단계 | ★★ | 순서 배열, Makefile 생성 단계 |
| 패키지 파일 이름 구조 | ★ | 버전·릴리스·아키텍처 구분 |

> [!PAGEBREAK]

## PART 1 · 패키지 관리의 큰 그림

## 1. 패키지와 패키지 관리 도구

### 핵심 필기

- **패키지(package):** 실행 파일·라이브러리·설정 파일·문서와 함께 ==이름, 버전, 의존성 정보(메타데이터)를 한 파일로 묶은 설치 단위==.
- **의존성(dependency):** 어떤 패키지가 동작하려면 먼저 있어야 하는 다른 패키지. 저수준 도구는 의존성을 ==검사만 하고 자동으로 받아 주지 않는다==.
- 패키지 도구는 두 층으로 나뉜다.

| 계열 | 패키지 형식 | 저수준 도구 (파일 하나 설치) | 고수준 도구 (저장소 + 의존성 자동 해결) | 대표 배포판 |
|---|---|---|---|---|
| 레드햇 | `.rpm` | **rpm** | **yum**, **dnf** | RHEL, CentOS, Rocky, Fedora |
| 데비안 | `.deb` | **dpkg** | **apt-get**, **apt-cache**, **apt**, aptitude | Debian, Ubuntu, Linux Mint |
| 수세 | `.rpm` | rpm | **zypper**, YaST | openSUSE, SLES |

[![레드햇 계열은 rpm 위에 yum과 dnf, 데비안 계열은 dpkg 위에 apt-get·apt-cache·apt가 올라가고, 고수준 도구만 인터넷 저장소에서 의존 패키지를 받아 오는 구조를 비교한 그림](/materials/diagrams/lm2-l09a-package-layers.svg)](/materials/diagrams/lm2-l09a-package-layers.svg)

*그림 9-1 · 패키지 관리 도구의 두 층 — 누르면 원본 크기로 열린다.*

> [!NOTE]
> - **읽는 순서:** 왼쪽 레드햇, 오른쪽 데비안 기둥을 아래(패키지 파일)에서 위(저장소)로 읽는다.
> - **핵심:** ==저수준 도구(rpm, dpkg)는 손에 쥔 파일 하나를 설치==하고, 고수준 도구(yum/dnf, apt)는 저장소에서 의존 패키지까지 받아 와 결국 저수준 도구로 설치한다.
> - **시험 포인트:** ==red:"의존성을 자동으로 해결한다"는 설명은 yum·dnf·apt 쪽이다.== rpm·dpkg는 의존성이 빠지면 오류를 내고 멈춘다.

### 패키지 파일 이름 읽기

```text
httpd-2.4.57-5.el9.x86_64.rpm
└name┘ └ver─┘ └rel──┘ └arch┘

apache2_2.4.58-1ubuntu8_amd64.deb
└name─┘ └ver─┘ └rev────┘ └arch┘
```

| 항목 | rpm | deb |
|---|---|---|
| 구분 기호 | 이름-버전-릴리스.아키텍처.rpm (하이픈과 점) | 이름_버전-리비전_아키텍처.deb (밑줄) |
| 64비트 PC | `x86_64` | `amd64` |
| 아키텍처 무관 | `noarch` | `all` |
| 소스 패키지 | `.src.rpm` (SRPM) | `.dsc` + `.orig.tar.gz` |

> [!TRAP]
> ==red:같은 64비트 인텔/AMD라도 rpm은 x86_64, deb는 amd64라고 쓴다.== 32비트는 rpm에서 `i386`·`i686`, deb에서 `i386`이다. 아키텍처를 가리지 않는 스크립트·문서 패키지는 rpm `noarch`, deb `all`.

> [!PAGEBREAK]

## PART 2 · 레드햇 계열 — rpm · yum · dnf

## 2. rpm (Red Hat Package Manager)

### 핵심 필기

rpm은 ==모드 옵션 하나 + 보조 옵션==으로 쓴다. 설치 계열은 거의 항상 `-vh`를 붙여 진행 상황(`v` 자세히, `h` # 해시 막대)을 본다.

| 모드 | 옵션 | 하는 일 |
|---|---|---|
| 설치 | `-i`, `--install` | 새로 설치 (이미 있으면 오류) |
| 업그레이드 | `-U`, `--upgrade` | 있으면 업그레이드, ==없으면 새로 설치== |
| 프레시 | `-F`, `--freshen` | ==이미 설치된 것만== 업그레이드, 없으면 아무것도 안 함 |
| 삭제 | `-e`, `--erase` | 패키지 삭제 (패키지 이름으로) |
| 질의 | `-q`, `--query` | 설치 정보 조회 |
| 검증 | `-V`, `--verify` | 설치 후 파일이 바뀌었는지 검사 |
| 서명 확인 | `-K`, `--checksig` | 패키지 파일의 서명·다이제스트 확인 |
| 키 등록 | `--import` | GPG 공개키 가져오기 |

**질의(-q)와 함께 쓰는 옵션**

| 조합 | 뜻 | 기억 |
|---|---|---|
| `-qa` | 설치된 ==모든(all)== 패키지 목록 | `rpm -qa \| grep httpd` |
| `-qi 패키지` | 상세 정보(information) | 버전, 크기, 라이선스, 설명 |
| `-ql 패키지` | 설치된 파일 목록(list) | |
| `-qf 파일` | 그 ==파일(file)이 속한 패키지== | `rpm -qf /bin/ls` |
| `-qc 패키지` | 설정 파일(config)만 | |
| `-qd 패키지` | 문서 파일(docs)만 | |
| `-qR 패키지` | 필요한 의존성(requires) | |
| `-qp 파일.rpm` | ==설치 전 패키지 파일(package)==에 질의 | `-qpi`, `-qpl`로 조합 |

**보조 옵션**

| 옵션 | 뜻 |
|---|---|
| `-v` / `-h` | 자세히 출력 / 진행 상황을 `#`로 표시 |
| `--nodeps` | 의존성 검사를 하지 않음 |
| `--force` | 이미 설치돼 있거나 파일이 충돌해도 강제로 |
| `--replacepkgs` | 같은 버전을 다시 설치 |
| `--test` | 실제로 설치하지 않고 시험만 |
| `--oldpackage` | 더 낮은 버전으로 되돌리기(다운그레이드) 허용 |

```bash
# 설치·업그레이드 (파일 이름으로)
rpm -ivh httpd-2.4.57-5.el9.x86_64.rpm
rpm -Uvh httpd-2.4.57-8.el9.x86_64.rpm
rpm -Fvh *.rpm            # 디렉터리의 rpm 중 이미 설치된 것만 갱신

# 삭제 (패키지 이름으로)
rpm -e httpd
rpm -e --nodeps httpd     # 의존성 무시하고 삭제

# 질의
rpm -qa | grep httpd
rpm -qi httpd
rpm -ql httpd | head -3
rpm -qf /etc/httpd/conf/httpd.conf
rpm -qpl httpd-2.4.57-8.el9.x86_64.rpm    # 설치 전 파일에 질의
```

```text
$ rpm -qf /etc/httpd/conf/httpd.conf
httpd-2.4.57-5.el9.x86_64
$ rpm -q httpd
httpd-2.4.57-5.el9.x86_64
$ rpm -q nginx
package nginx is not installed
```

> [!TRAP]
> ==red:-U는 "없으면 설치, 있으면 업그레이드", -F는 "있을 때만 업그레이드"다.== 둘 다 업그레이드라서 자주 섞인다. 커널은 이전 버전을 남겨 둬야 하므로 `-U` 대신 `-i`로 새로 설치하는 것이 권장된다.

> [!TRAP]
> ==red:설치(-i, -U)는 파일 이름, 삭제(-e)와 질의(-q)는 패키지 이름을 쓴다.== `rpm -e httpd-2.4.57-5.el9.x86_64.rpm`처럼 파일 이름을 주면 "not installed" 오류가 난다. 설치 전 파일에 질의하려면 반드시 `-p`를 붙인다.

### rpm -V 검증 결과 읽기

`rpm -V 패키지`(모두는 `-Va`)는 설치 당시 정보와 현재 파일을 비교해 ==달라진 항목만== 출력한다. 아무것도 출력되지 않으면 변경 없음.

```text
$ rpm -V httpd
S.5....T.  c /etc/httpd/conf/httpd.conf
```

| 문자 | 바뀐 것 | 문자 | 바뀐 것 |
|---|---|---|---|
| `S` | 크기(Size) | `L` | 심볼릭 링크 경로 |
| `M` | 권한·파일 형식(Mode) | `U` | 소유자(User) |
| `5` | 다이제스트(내용, 예전 MD5) | `G` | 그룹(Group) |
| `D` | 장치 번호(Device) | `T` | 수정 시각(mTime) |
| `.` | 변경 없음 | `c` | 설정 파일(config) 표시 |

> [!CONCEPT]
> 위 예시 `S.5....T.  c`는 "설정 파일 httpd.conf의 크기·내용·수정 시각이 바뀌었다"는 뜻이다. 관리자가 설정을 고쳤다면 정상이고, `/bin/ls` 같은 실행 파일에 `5`가 뜨면 변조를 의심한다.

> [!CHECK]
> **1.** 이미 설치된 패키지만 골라서 업그레이드하고, 설치되지 않은 패키지는 건너뛰는 rpm 옵션은?
>
> **2.** `/usr/bin/vim` 파일이 어느 패키지에 들어 있는지 rpm으로 확인하는 명령을 쓰시오.
>
> **3.** 아직 설치하지 않은 `zsh-5.8-9.el9.x86_64.rpm`이 설치할 파일 목록을 보는 명령은?

## 3. yum과 dnf

### 핵심 필기

- **yum (Yellowdog Updater, Modified):** rpm 기반 고수준 도구. 저장소(repository)에서 받아 ==의존성을 자동으로 해결==한다.
- **dnf (Dandified YUM):** yum의 후속. Fedora 22부터, RHEL/CentOS 8부터 기본. ==명령 형식이 yum과 거의 같다== (RHEL 8 이후의 `yum`은 사실상 dnf를 부르는 이름).
- 설정 파일: `/etc/yum.conf` (dnf는 `/etc/dnf/dnf.conf`), 저장소 정의: **`/etc/yum.repos.d/*.repo`**.

| 하위 명령 | 하는 일 |
|---|---|
| `install 패키지` | 저장소에서 의존성과 함께 설치 |
| `localinstall 파일.rpm` | 로컬 rpm 파일을 설치하면서 의존성은 저장소에서 |
| `update [패키지]` | 지정 패키지(생략 시 전체) 업데이트 |
| `check-update` | 업데이트 가능한 패키지 목록만 확인 |
| `upgrade` | update + 더 이상 쓰지 않는(obsolete) 패키지 정리 |
| `remove` / `erase 패키지` | 삭제 |
| `list` [all / installed / available / updates] | 패키지 목록 |
| `info 패키지` | 상세 정보 |
| `search 키워드` | 이름·요약에서 키워드 검색 |
| `provides` / `whatprovides 파일` | ==그 파일을 제공하는 패키지== 찾기 |
| `deplist 패키지` | 의존성 목록 |
| `grouplist`, `groupinstall`, `groupremove`, `groupinfo` | 패키지 그룹 단위 관리 |
| `repolist` | 활성화된 저장소 목록 |
| `history` | 설치·삭제 이력 (undo 가능) |
| `clean all` | 캐시(받은 패키지·메타데이터) 삭제 |

| 옵션 | 뜻 |
|---|---|
| `-y` | 모든 질문에 yes로 답하기 (자동 설치) |
| `-q` | 조용히 |
| `--enablerepo=`, `--disablerepo=` | 이번 실행에만 저장소 켜고 끄기 |

```bash
yum -y install httpd
yum list installed | grep httpd
yum provides /usr/sbin/ifconfig      # → net-tools 패키지
yum groupinstall "Development Tools"
dnf remove httpd
dnf history
```

```ini
# /etc/yum.repos.d/local.repo
[local-base]
name=Local BaseOS
baseurl=file:///mnt/cdrom/BaseOS
enabled=1
gpgcheck=0
```

> [!TRAP]
> ==red:"어떤 파일(명령)을 제공하는 패키지 찾기"는 yum provides(whatprovides), 이미 설치된 파일의 소속 확인은 rpm -qf==다. search는 이름·요약의 키워드 검색이라 파일 경로로는 찾지 못한다.

> [!EXAMPLE]
> **`ifconfig: command not found`가 뜰 때 (학습용 흐름)**
>
> 1. `yum provides */ifconfig` → `net-tools` 패키지가 제공한다는 결과
> 2. `yum -y install net-tools` → 의존 패키지까지 받아 설치
> 3. `rpm -qf /usr/sbin/ifconfig` → `net-tools-…` 출력으로 확인

> [!CHECK]
> **4.** 레드햇 계열에서 yum이 사용할 저장소 정보 파일을 두는 디렉터리는?
>
> **5.** "Development Tools" 같은 묶음을 한 번에 설치하는 yum 하위 명령은?

> [!PAGEBREAK]

## PART 3 · 데비안 계열 — dpkg · apt

## 4. dpkg

### 핵심 필기

| 옵션 | 긴 형식 | 하는 일 |
|---|---|---|
| `-i` | `--install` | .deb 파일 설치 |
| `-r` | `--remove` | 패키지 삭제, ==설정 파일은 남김== |
| `-P` | `--purge` | ==설정 파일까지 완전 삭제== |
| `-l` | `--list` | 설치된 패키지 목록 (패턴 가능) |
| `-L` | `--listfiles` | 패키지가 설치한 파일 목록 |
| `-s` | `--status` | 패키지 상태·상세 정보 |
| `-S` | `--search` | ==파일이 속한 패키지== 검색 |
| `-c` | `--contents` | .deb 파일 안의 파일 목록 (설치 전) |
| `-I` | `--info` | .deb 파일 정보 (설치 전) |
| `-x` | `--extract` | .deb 내용을 디렉터리에 풀기 |
| | `--configure` | 풀기만 된 패키지 설정 마무리 |
| | `--unpack` | 설정 없이 풀기만 |
| `-R` | `--recursive` | 디렉터리 안 .deb 전부 대상으로 |

아래는 이 강의 실습 환경(Ubuntu 24.04)에서 실제로 실행한 결과다.

```text
$ dpkg -l bash
Desired=Unknown/Install/Remove/Purge/Hold
| Status=Not/Inst/Conf-files/Unpacked/halF-conf/Half-inst/trig-aWait/Trig-pend
|/ Err?=(none)/Reinst-required (Status,Err: uppercase=bad)
||/ Name           Version         Architecture Description
+++-==============-===============-============-=================================
ii  bash           5.2.21-2ubuntu4 amd64        GNU Bourne Again SHell

$ dpkg -S /usr/bin/gzip
gzip: /usr/bin/gzip

$ dpkg -L bash | head -5
/.
/etc
/etc/bash.bashrc
/etc/skel
/etc/skel/.bash_logout

$ dpkg -s bash | head -4
Package: bash
Essential: yes
Status: install ok installed
Priority: required
```

> [!CONCEPT]
> **`dpkg -l` 맨 앞 두 글자** — 첫 글자는 원하는 상태(i 설치, r 삭제, p 완전 삭제, h 보류), 둘째는 현재 상태(i 설치됨, c 설정 파일만 남음, n 없음). ==ii = 정상 설치, rc = 삭제됐지만 설정 파일이 남음(-r 후 상태)==.

> [!TRAP]
> ==red:dpkg -r은 설정 파일을 남기고, -P(purge)가 설정 파일까지 지운다.== 대문자 `-S`는 파일로 패키지 찾기(search), 소문자 `-s`는 상태(status)다. rpm과 대응시키면 `rpm -qf` ≈ `dpkg -S`, `rpm -ql` ≈ `dpkg -L`, `rpm -qa` ≈ `dpkg -l`.

## 5. apt-get · apt-cache · apt

### 핵심 필기

- **APT (Advanced Packaging Tool):** dpkg 위의 고수준 도구. 저장소 목록은 **`/etc/apt/sources.list`와 `/etc/apt/sources.list.d/`**, 받은 .deb 캐시는 `/var/cache/apt/archives/`.

**apt-get — 설치·삭제·갱신**

| 하위 명령 | 하는 일 |
|---|---|
| `update` | ==저장소의 패키지 목록(인덱스)만 새로 받음== — 설치는 안 함 |
| `upgrade` | 설치된 패키지를 새 버전으로 (새 패키지 추가·기존 삭제는 하지 않음) |
| `dist-upgrade` | 의존성 변화까지 처리하며 업그레이드 (필요하면 추가·삭제) |
| `install 패키지` | 의존성과 함께 설치 (`--reinstall` 재설치) |
| `remove 패키지` | 삭제 (설정 파일 남김) |
| `purge 패키지` | 설정 파일까지 삭제 |
| `autoremove` | 더 이상 필요 없는 의존 패키지 자동 삭제 |
| `clean` / `autoclean` | 캐시의 .deb 전부 삭제 / 더 이상 받을 수 없는 오래된 것만 삭제 |
| `source 패키지` | 소스 패키지 받기 |
| `check` | 깨진 의존성 검사 |
| `-y`, `-d` | 자동 yes / 내려받기만(download only) |

**apt-cache — 조회 전용(설치 안 함)**

| 하위 명령 | 하는 일 |
|---|---|
| `search 키워드` | 패키지 이름·설명에서 검색 |
| `show 패키지` | 상세 정보 |
| `showpkg 패키지` | 버전·역의존성 등 자세한 내부 정보 |
| `depends 패키지` | 이 패키지가 필요로 하는 것 |
| `rdepends 패키지` | 이 패키지를 필요로 하는 것(역의존성) |
| `policy 패키지` | 설치 버전과 후보 버전, 저장소 우선순위 |
| `stats` | 캐시 통계 |

```bash
sudo apt-get update            # 목록 갱신이 먼저
sudo apt-get -y install tree
sudo apt-get purge tree
sudo apt-get autoremove
apt-cache search --names-only '^tree$'
apt-cache depends bash
```

```text
$ apt-cache depends bash
bash
  PreDepends: libc6
  PreDepends: libtinfo6
  Depends: base-files
  Depends: debianutils
  Recommends: <bash-completion>
  Suggests: <bash-doc>
```

- **apt:** apt-get과 apt-cache의 자주 쓰는 기능을 합친 사용자용 명령. `apt install`, `apt remove`, `apt update`, `apt upgrade`, `apt full-upgrade`(≈ dist-upgrade), `apt search`, `apt show`, `apt list --installed`.
- 그 밖에: `aptitude`(텍스트 메뉴형 APT 프런트엔드), `dselect`(옛 dpkg 메뉴형 프런트엔드), `alien`(rpm ↔ deb 변환).

> [!TRAP]
> ==red:apt-get update는 목록만 갱신하고, 실제 새 버전 설치는 upgrade다.== "설치된 패키지를 최신으로" → upgrade, "저장소 목록을 최신으로" → update. yum의 `update`는 실제 업데이트를 하므로 의미가 다르다.

> [!CHECK]
> **6.** 데비안 계열에서 패키지를 지우되 설정 파일까지 없애는 dpkg 옵션과 apt-get 하위 명령은?
>
> **7.** apt-get으로 새 패키지를 설치하기 전에 먼저 실행해 저장소 목록을 최신화하는 명령은?
>
> **8.** `/usr/bin/gzip`이 속한 패키지를 데비안 계열에서 찾는 명령은?

> [!PAGEBREAK]

## PART 4 · 아카이브와 압축

## 6. tar — 여러 파일을 하나로 묶기

### 핵심 필기

- **아카이브(archive):** 여러 파일·디렉터리를 ==하나의 파일로 묶는 것==. tar(Tape ARchiver) 자체는 압축하지 않는다.
- 기능 옵션은 ==반드시 하나==, 나머지는 보조 옵션. `-f 파일명`은 맨 뒤에 붙여 바로 다음 인수를 파일명으로 받는다.

| 기능 옵션 | 뜻 | 보조 옵션 | 뜻 |
|---|---|---|---|
| `-c` | 새 아카이브 만들기(create) | `-f` | 아카이브 파일 이름 지정(file) |
| `-x` | 풀기(extract) | `-v` | 처리 과정 출력(verbose) |
| `-t` | 내용 목록 보기(list) | `-z` | ==gzip== 으로 압축/해제 (.tar.gz, .tgz) |
| `-r` | 기존 아카이브 끝에 추가(append) | `-j` | ==bzip2== 로 압축/해제 (.tar.bz2) |
| `-u` | 더 새로운 파일만 추가(update) | `-J` | ==xz== 로 압축/해제 (.tar.xz) |
| `-d` | 아카이브와 파일 시스템 비교(diff) | `-Z` | compress 로 압축/해제 (.tar.Z) |
| `-A` | tar 파일끼리 이어 붙이기 | `-C 디렉터리` | 해당 디렉터리에 풀기 |
| | | `-p` | 권한 그대로 보존 |

아래 명령과 출력은 실습 환경에서 그대로 실행한 결과다.

```text
$ tar -cvf proj.tar proj
proj/
proj/src/
proj/src/a.c
proj/README
$ tar -tvf proj.tar
drwxr-xr-x root/root         0 2026-10-30 17:19 proj/
drwxr-xr-x root/root         0 2026-10-30 17:19 proj/src/
-rw-r--r-- root/root         6 2026-10-30 17:19 proj/src/a.c
-rw-r--r-- root/root         7 2026-10-30 17:19 proj/README
$ tar -czf proj.tar.gz proj
$ tar -cjf proj.tar.bz2 proj
$ tar -cJf proj.tar.xz proj
$ tar -rvf proj.tar r.txt          # 압축 안 된 tar에 파일 추가
r.txt
$ mkdir x && tar -xzvf proj.tar.gz -C x
proj/
proj/src/
proj/src/a.c
proj/README
```

> [!TRAP]
> ==red:-z는 gzip, -j는 bzip2, 대문자 -J는 xz, 대문자 -Z는 compress다.== 소문자·대문자를 바꿔 내는 문제가 단골이다. 또 `-r`·`-u`(추가)는 ==압축되지 않은 tar에만== 쓸 수 있다.

> [!NOTE]
> 요즘 GNU tar는 풀 때(-x, -t) 압축 형식을 스스로 알아내므로 `tar -xvf proj.tar.gz`도 동작한다(실습 환경에서도 확인). 하지만 ==만들 때(-c)는 z/j/J를 직접 지정해야 압축된다==. 시험은 여전히 "확장자에 맞는 옵션"을 묻는다.

## 7. 압축 도구와 확장자

### 핵심 필기

| 도구 | 확장자 | 해제 | 압축 파일 내용 보기 | 특징 |
|---|---|---|---|---|
| `compress` | `.Z` | `uncompress` | `zcat` | 가장 오래됨(LZW), 압축률 낮음 |
| `gzip` | `.gz` | `gunzip`, `gzip -d` | `zcat` | GNU zip. 속도 빠름, 가장 흔함 |
| `bzip2` | `.bz2` | `bunzip2`, `bzip2 -d` | `bzcat` | gzip보다 압축률 높고 느림 |
| `xz` | `.xz` | `unxz`, `xz -d` | `xzcat` | LZMA2. 일반적으로 압축률 가장 높음 |
| `zip` | `.zip` | `unzip` | `unzip -l` | ==묶기 + 압축을 한 번에==, 윈도우와 호환 |

- gzip·bzip2·xz는 ==파일 하나씩만 압축하고, 원본을 지우고 압축 파일로 바꾼다==. 원본을 남기려면 `-k`(keep), 표준 출력으로 내보내려면 `-c`.
- 압축 수준: `-1`(빠름) ~ `-9`(가장 높은 압축). gzip 기본은 `-6`.
- 그래서 디렉터리는 ==tar로 묶고(.tar) → gzip/bzip2/xz로 압축(.tar.gz 등)== 한다.

```text
$ ls -l pkg.txt*                # 같은 텍스트 파일을 세 도구로 압축(-k)
-rw-r--r-- 1 root root 847872 Oct 30 17:20 pkg.txt
-rw-r--r-- 1 root root 144504 Oct 30 17:20 pkg.txt.bz2
-rw-r--r-- 1 root root 194256 Oct 30 17:20 pkg.txt.gz
-rw-r--r-- 1 root root 150208 Oct 30 17:20 pkg.txt.xz
$ gzip r.txt; ls r.txt*
r.txt.gz                        # 원본 r.txt는 사라졌다
$ gzip -l r.txt.gz
         compressed        uncompressed  ratio uncompressed_name
                 33                   7 -28.6% r.txt
$ gunzip r.txt.gz               # 다시 r.txt
$ zip -r proj.zip proj
  adding: proj/ (stored 0%)
  adding: proj/src/ (stored 0%)
  adding: proj/src/a.c (stored 0%)
  adding: proj/README (stored 0%)
```

> [!NOTE]
> 위 실측에서는 텍스트 파일 특성상 bzip2가 xz보다 조금 작게 나왔다. 압축률은 데이터에 따라 달라지며, 교재는 보통 ==compress < gzip < bzip2 < xz== 순으로 압축률이 높다고 정리한다. 아주 작은 파일(7바이트)은 헤더 때문에 오히려 커진다(-28.6%).

> [!TRAP]
> ==red:gzip -r은 "디렉터리 안의 파일을 각각 압축"할 뿐 하나로 묶지 않는다.== 묶기는 tar나 zip의 일이다. `.tgz`는 `.tar.gz`와 같은 형식이다.

> [!CHECK]
> **9.** `/home` 디렉터리를 bzip2로 압축한 `home.tar.bz2`로 만드는 tar 명령을 쓰시오.
>
> **10.** `.xz` 파일의 압축을 푸는 전용 명령과, 풀지 않고 내용을 화면에 출력하는 명령은?

> [!PAGEBREAK]

## PART 5 · 소스 파일 설치

## 8. 소스 컴파일 설치 — configure → make → make install

### 핵심 필기

패키지가 없거나 최신 버전·특정 옵션이 필요할 때 소스 코드(`*.tar.gz` 등)를 받아 직접 컴파일한다.

| 순서 | 명령 | 하는 일 | 결과물 |
|---|---|---|---|
| 0 | `tar -xzvf app-1.0.tar.gz` → `cd app-1.0` | 소스 풀기 | 소스 디렉터리 |
| 1 | `./configure` | ==시스템 환경(컴파일러, 라이브러리) 검사== 하고 설치 옵션 결정 | ==Makefile 생성== |
| 2 | `make` | Makefile대로 컴파일 | 실행 파일·라이브러리 |
| 3 | `make install` | 정해진 경로에 복사 (보통 root 권한) | /usr/local/… 에 설치 |
| 정리 | `make clean` | 컴파일 결과물 삭제 | |

```bash
tar -xzvf hello-2.12.tar.gz
cd hello-2.12
./configure --prefix=/usr/local/hello   # 설치 경로 지정
make
sudo make install
```

- `./configure --prefix=경로` — 설치 위치 지정(기본은 보통 `/usr/local`). `./configure --help`로 옵션 확인.
- 요즘은 `cmake`(CMakeLists.txt → Makefile 생성) 방식도 많다.
- 소스 설치는 ==패키지 DB(rpm, dpkg)에 기록되지 않아== `rpm -qa`나 `dpkg -l`에 나타나지 않고, 삭제도 수동이다(`make uninstall`이 제공될 때만 편함).

> [!TRAP]
> ==red:Makefile을 만드는 것은 make가 아니라 configure다.== 순서 배열 문제에서 ==blue:압축 해제 → ./configure → make → make install== 을 기억한다.

> [!CHECK]
> **11.** 소스 설치에서 시스템 환경을 검사하고 Makefile을 생성하는 단계는?

> [!PAGEBREAK]

## 실전 문제

> [!QUIZ]
> 다음 중 rpm 명령에 대한 설명으로 옳지 **않은** 것은?
>
> **A.** `rpm -Uvh a.rpm` — a 패키지가 없으면 새로 설치한다.
>
> **B.** `rpm -Fvh a.rpm` — a 패키지가 없으면 새로 설치한다.
>
> **C.** `rpm -qf /bin/ls` — /bin/ls 파일이 속한 패키지를 출력한다.
>
> **D.** `rpm -e a` — a 패키지를 삭제한다.

> [!HINT 1]
> freshen은 "신선하게 만들기"다. 없는 것을 신선하게 만들 수는 없다.

> [!ANSWER]
> **B.** `-F`(freshen)는 ==이미 설치된 경우에만== 업그레이드하고, 설치되지 않은 패키지는 건너뛴다. 없으면 설치까지 하는 것은 `-U`다.

> [!QUIZ]
> `backup.tar.xz`로 압축된 아카이브를 `/tmp/restore` 디렉터리에 푸는 명령으로 알맞은 것은?
>
> **A.** `tar -xjvf backup.tar.xz -C /tmp/restore`
>
> **B.** `tar -cJvf backup.tar.xz -C /tmp/restore`
>
> **C.** `tar -xJvf backup.tar.xz -C /tmp/restore`
>
> **D.** `tar -xZvf backup.tar.xz -C /tmp/restore`

> [!HINT 1]
> 풀기는 x, xz는 대문자 하나.

> [!ANSWER]
> **C.** 풀기 `-x` + xz `-J` + 파일 `-f` + 대상 디렉터리 `-C`. `-j`는 bzip2, `-Z`는 compress, `-c`는 만들기다.

> [!QUIZ]
> 데비안 계열에서 패키지를 삭제한 뒤 `dpkg -l`로 보았더니 상태가 `rc`로 표시되었다. 설정 파일까지 완전히 지우려면?
>
> **A.** `dpkg -r 패키지`
>
> **B.** `dpkg -P 패키지`
>
> **C.** `dpkg -S 패키지`
>
> **D.** `apt-get update`

> [!HINT 1]
> rc = Remove 요청됨 + Config 파일만 남음.

> [!ANSWER]
> **B.** `-P`(purge)가 설정 파일까지 지운다. `apt-get purge 패키지`도 같은 효과다. `-r`은 이미 한 삭제(설정 남김), `-S`는 파일로 패키지 찾기다.

> [!QUIZ]
> 레드햇 계열에서 `/usr/sbin/semanage` 명령을 제공하는 패키지를 저장소에서 찾아보려 한다. 알맞은 명령은?
>
> **A.** `yum search /usr/sbin/semanage`
>
> **B.** `yum provides /usr/sbin/semanage`
>
> **C.** `rpm -qa /usr/sbin/semanage`
>
> **D.** `yum info /usr/sbin/semanage`

> [!HINT 1]
> 아직 설치되지 않은 파일이므로 rpm DB에는 없다. 저장소 메타데이터에서 "제공자"를 찾아야 한다.

> [!ANSWER]
> **B.** `yum provides`(= whatprovides)가 파일 경로로 제공 패키지를 찾는다. search는 이름·요약 키워드 검색, info는 패키지 정보다. 이미 설치된 파일이라면 `rpm -qf`도 쓸 수 있다.

> [!QUIZ]
> 압축 도구와 확장자, 해제 명령의 연결이 옳지 **않은** 것은?
>
> **A.** gzip — .gz — gunzip
>
> **B.** bzip2 — .bz2 — bunzip2
>
> **C.** xz — .xz — unxz
>
> **D.** compress — .cmp — uncompress

> [!HINT 1]
> compress 확장자는 대문자 한 글자다.

> [!ANSWER]
> **D.** compress의 확장자는 `.Z`다.

> [!QUIZ]
> 소스 파일을 이용한 프로그램 설치 순서로 옳은 것은?
>
> **A.** make → ./configure → make install
>
> **B.** ./configure → make install → make
>
> **C.** ./configure → make → make install
>
> **D.** make install → ./configure → make

> [!HINT 1]
> make는 Makefile이 있어야 동작한다. Makefile은 누가 만드나?

> [!ANSWER]
> **C.** configure가 Makefile을 만들고, make가 컴파일, make install이 설치한다.

> [!PAGEBREAK]

## 단원 마무리

### 장 요약

| 주제 | 꼭 기억할 것 |
|---|---|
| 도구 층 | 레드햇 rpm → yum/dnf, 데비안 dpkg → apt-get/apt-cache/apt. 고수준만 의존성 자동 해결 |
| rpm | ==-i 설치 · -U 없으면 설치+업그레이드 · -F 있을 때만 · -e 삭제 · -V 검증==, 질의 -qa -qi -ql -qf -qc -qd -qR -qp |
| yum/dnf | install, update, check-update, remove, list, info, search, ==provides==, groupinstall, repolist, history, clean all / 저장소 `/etc/yum.repos.d/` |
| dpkg | -i, ==-r(설정 남김) vs -P(완전 삭제)==, -l, -L, -s, -S, -c, -I |
| apt | ==update = 목록, upgrade = 설치==, dist-upgrade, purge, autoremove / apt-cache search, show, depends, rdepends, policy |
| tar | ==blue:c 만들기 · x 풀기 · t 목록 · r 추가 · f 파일 · v 과정 · z gzip · j bzip2 · J xz · C 대상== |
| 압축 | .Z compress · .gz gzip · .bz2 bzip2 · .xz xz · .zip zip(묶기+압축) |
| 소스 설치 | ==blue:./configure (Makefile 생성) → make → make install== |

### 단답형 연습

답은 맨 끝 **정답과 해설**에서 확인한다.

1. rpm에서 설치된 모든 패키지 목록을 보는 옵션은? ______________
2. rpm에서 패키지의 설정 파일 목록만 보는 질의 옵션은? ______________
3. RHEL 8부터 yum을 대신하는 기본 패키지 도구는? ______________
4. dpkg에서 패키지가 설치한 파일 목록을 보는 옵션은? ______________
5. apt-get에서 쓰지 않게 된 의존 패키지를 자동으로 지우는 하위 명령은? ______________
6. 이 패키지를 필요로 하는 패키지(역의존성)를 보는 apt-cache 하위 명령은? ______________
7. 데비안 계열 저장소 목록을 적는 기본 파일은? ______________
8. 압축된 tar 파일의 내용 목록을 풀지 않고 보는 tar 기능 옵션은? ______________
9. gzip으로 압축하면서 원본 파일을 남기는 옵션은? ______________
10. configure에서 설치 경로를 바꾸는 옵션은? ______________

## 책을 덮고 꺼내 보기

- rpm에서 설치 전 패키지 파일에 질의하려면 {{-p}} 옵션을 붙인다.
- rpm -V 결과에서 내용(다이제스트)이 바뀌었음을 뜻하는 문자는 {{5}}다.
- yum 저장소 설정 파일은 {{/etc/yum.repos.d/}} 디렉터리에 .repo 확장자로 둔다.
- dpkg에서 파일이 속한 패키지를 찾는 옵션은 대문자 {{-S}}다.
- tar에서 xz 압축을 쓰는 옵션은 대문자 {{-J}}다.
- 소스 설치에서 Makefile을 만드는 단계는 {{./configure}}다.

> [!FLASHCARD]
> Q: rpm -i, -U, -F의 차이는?
> A: -i는 새로 설치(있으면 오류), -U는 있으면 업그레이드·없으면 설치, -F는 이미 설치된 것만 업그레이드하고 없으면 건너뛴다.

> [!FLASHCARD]
> Q: rpm 질의 옵션 -qa, -qi, -ql, -qf, -qc, -qd, -qR, -qp는?
> A: 전체 목록, 상세 정보, 파일 목록, 파일이 속한 패키지, 설정 파일, 문서 파일, 의존성, 설치 전 패키지 파일 대상 질의.

> [!FLASHCARD]
> Q: rpm -V 출력의 S, M, 5, T, c는?
> A: 크기, 권한·형식, 내용 다이제스트, 수정 시각이 바뀜. c는 설정 파일 표시.

> [!FLASHCARD]
> Q: yum에서 파일 경로로 그 파일을 제공하는 패키지를 찾는 하위 명령은?
> A: provides (또는 whatprovides).

> [!FLASHCARD]
> Q: dpkg -r과 -P의 차이, dpkg -s와 -S의 차이는?
> A: -r은 설정 파일을 남기는 삭제, -P는 설정 파일까지 지우는 purge. -s는 패키지 상태, -S는 파일로 패키지 검색.

> [!FLASHCARD]
> Q: apt-get update, upgrade, dist-upgrade의 차이는?
> A: update는 저장소 목록 갱신, upgrade는 설치된 패키지를 새 버전으로(추가·삭제 없이), dist-upgrade는 의존성 변화에 맞춰 패키지 추가·삭제까지 하며 업그레이드.

> [!FLASHCARD]
> Q: tar 압축 옵션 z, j, J, Z와 확장자는?
> A: z gzip(.tar.gz/.tgz), j bzip2(.tar.bz2), J xz(.tar.xz), Z compress(.tar.Z).

> [!FLASHCARD]
> Q: gzip·bzip2·xz의 해제 명령과 내용 보기 명령은?
> A: gunzip/zcat, bunzip2/bzcat, unxz/xzcat. 모두 -d로도 해제 가능.

**다음으로 갈 기준:** rpm·dpkg 옵션표와 tar 옵션 조합을 빈칸 없이 다시 쓸 수 있으면 다음 편으로 간다: [10편 · 장치 설정 — 장치 관리·프린터·스캐너](/lectures/grade-mukhnzii/semester-certificate/subject-linux-master-2/lecture-10).

> [!PAGEBREAK]

## 정답과 해설

### 확인 문제 정답

1. **`-F` (`--freshen`)** — 예: `rpm -Fvh *.rpm`. 설치되지 않은 패키지는 건너뛴다.
2. **`rpm -qf /usr/bin/vim`** — 출력 예: `vim-enhanced-…`.
3. **`rpm -qpl zsh-5.8-9.el9.x86_64.rpm`** — 설치 전 파일이므로 `-p`가 필요하다.
4. **`/etc/yum.repos.d/`** — 그 안의 `*.repo` 파일에 저장소를 정의한다.
5. **`yum groupinstall`** — 예: `yum groupinstall "Development Tools"`.
6. **`dpkg -P`(--purge)**, **`apt-get purge`**.
7. **`apt-get update`** (또는 `apt update`).
8. **`dpkg -S /usr/bin/gzip`** — 출력 `gzip: /usr/bin/gzip`.
9. **`tar -cjvf home.tar.bz2 /home`** — v는 생략 가능, f는 파일 이름 바로 앞.
10. **`unxz`**(또는 `xz -d`), 내용 출력은 **`xzcat`**.
11. **`./configure`** 단계.

### 단답형 정답

1. **`-qa`**
2. **`-qc`**
3. **dnf**
4. **`-L`** (`--listfiles`)
5. **`autoremove`**
6. **`rdepends`**
7. **`/etc/apt/sources.list`** (추가 파일은 `/etc/apt/sources.list.d/`)
8. **`-t`** (예: `tar -tzvf a.tar.gz`)
9. **`-k`** (`--keep`) 또는 `-c`로 표준 출력에 내보내기
10. **`--prefix=경로`**
