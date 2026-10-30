---
title: "10편 · 장치 설정 — 장치 관리·프린터·스캐너"
description: "2과목 6장. 블록·문자 장치 파일, lsusb·lspci·lsmod·modprobe 같은 장치 확인·모듈 명령, udev, System V·BSD 계열 인쇄 명령과 CUPS, SANE·XSANE 스캐너, ALSA·OSS 사운드를 시험 포인트 중심으로 정리합니다."
order: 10
published: true
duration: 80
tags: [리눅스마스터 2급, 자격증, 2과목, 장치 설정, 프린터, CUPS, SANE, 커널 모듈]
objectives:
  - 블록 장치와 문자 장치를 구분하고 주요 장치 파일 이름을 말한다.
  - lsusb·lspci·lsmod·modprobe·insmod·rmmod의 역할과 차이를 설명한다.
  - System V 계열(lp, lpstat, cancel)과 BSD 계열(lpr, lpq, lprm, lpc) 인쇄 명령을 짝지어 쓰고, CUPS의 특징을 말한다.
  - SANE의 구조와 scanimage·sane-find-scanner·XSANE의 쓰임을 설명한다.
---

## 학습 경로 · 2과목 6장

[← 9편 · 소프트웨어 설치](/lectures/grade-mukhnzii/semester-certificate/subject-linux-master-2/lecture-09) · [다음: 11편 · X 윈도우 →](/lectures/grade-mukhnzii/semester-certificate/subject-linux-master-2/lecture-11)

**범위:** 2과목 6장 "장치 설정" — 리눅스 장치 연결 및 관리(장치 파일, 하드웨어 확인 명령, 커널 모듈, udev), 사운드(ALSA·OSS), System V 계열 프린터, BSD 계열 프린터, CUPS, SANE·XSANE 스캐너 제어.

**형광펜 읽는 법:** ==yellow:노랑== 핵심 정의·결론 · ==red:빨강== 시험에서 헷갈리는 구분·함정 · ==blue:파랑== 외워야 할 순서·목록

> [!EXAM]
> **이 장의 핵심 질문:** 리눅스는 프린터·스캐너·사운드카드 같은 장치를 어떻게 "파일"로 다루고, 그 장치를 쓰는 명령은 계열마다 어떻게 다른가?
>
> **전체 흐름:** ==blue:장치 파일(블록/문자) → 하드웨어 확인(lsusb, lspci) → 드라이버 = 커널 모듈(lsmod, modprobe) → udev 자동 인식 → 사운드(ALSA) → 프린터(System V / BSD / CUPS) → 스캐너(SANE, XSANE)==

---

## 단원 도입

| 출제 포인트 | 빈도 | 이렇게 나온다 |
|---|:---:|---|
| System V vs BSD 인쇄 명령 짝짓기 | ★★★ | "lpq와 같은 기능의 System V 명령은?" → lpstat |
| lpr·lpq·lprm 옵션 (-P, -#) | ★★★ | 프린터 지정·매수 지정 옵션 |
| CUPS 특징 (IPP, 631 포트, 웹 관리) | ★★★ | CUPS 설명으로 틀린 것 |
| SANE / XSANE / scanimage / sane-find-scanner | ★★★ | 스캐너 관련 명령·프로그램 고르기 |
| 커널 모듈 명령 (lsmod, modprobe, insmod, rmmod) | ★★ | 의존성을 자동 처리하는 명령 → modprobe |
| 장치 정보 명령 (lsusb, lspci) | ★★ | USB 장치 확인 명령 |
| 블록 / 문자 장치 구분 | ★★ | ls -l 첫 글자 b, c |
| ALSA vs OSS | ★ | 커널 2.6 이후 기본 사운드 구조 |

> [!PAGEBREAK]

## PART 1 · 리눅스 장치 연결 및 관리

## 1. 장치 파일 — 모든 장치는 /dev 아래 파일이다

### 핵심 필기

- 리눅스는 장치를 ==/dev 디렉터리 아래의 특수 파일(장치 파일)로 다룬다==. 프로그램은 일반 파일처럼 열고 읽고 쓰면 커널의 드라이버가 실제 장치에 전달한다.
- **블록 장치(block, `b`):** 일정 크기 블록 단위로 ==임의 접근==. 디스크, CD-ROM, USB 메모리.
- **문자 장치(character, `c`):** 바이트(문자) 단위로 ==순차 접근==. 터미널, 직렬 포트, 프린터 포트, 마우스, 사운드.
- **주 번호(major):** 어떤 드라이버인가 / **부 번호(minor):** 그 드라이버의 몇 번째 장치인가. `ls -l`에서 크기 자리에 `주, 부`로 보인다.

실습 환경에서 실행한 결과:

```text
$ ls -l /dev/loop0 /dev/null /dev/zero /dev/tty /dev/random
brw------- 1 root root 7, 0 Oct 28 23:08 /dev/loop0
crw-rw-rw- 1 root root 1, 3 Oct 28 23:08 /dev/null
crw-rw-rw- 1 root root 1, 8 Oct 28 23:08 /dev/random
crw-rw-rw- 1 root root 5, 0 Oct 28 23:08 /dev/tty
crw-rw-rw- 1 root root 1, 5 Oct 28 23:08 /dev/zero
$ stat -c '%n %F' /dev/null /dev/loop0
/dev/null character special file
/dev/loop0 block special file
$ sed -n '/Block/,$p' /proc/devices      # 커널에 등록된 블록 장치 주 번호
Block devices:
  7 loop
253 zram
254 virtblk
259 blkext
```

| 장치 파일 | 종류 | 뜻 |
|---|:---:|---|
| `/dev/sda`, `/dev/sdb1` | b | SATA·SCSI·USB 디스크와 그 파티션 |
| `/dev/hda` | b | 옛 IDE(PATA) 디스크 |
| `/dev/nvme0n1p1` | b | NVMe SSD의 파티션 |
| `/dev/sr0` (`/dev/cdrom`) | b | CD/DVD 드라이브 |
| `/dev/fd0` | b | 플로피 디스크 |
| `/dev/st0` | c | SCSI 테이프 |
| `/dev/lp0` | c | ==병렬 포트 프린터== (`/dev/usb/lp0`은 USB 프린터) |
| `/dev/ttyS0` | c | 직렬 포트 COM1 |
| `/dev/tty1`, `/dev/pts/0` | c | 가상 콘솔, 가상 터미널(원격·터미널 창) |
| `/dev/null` | c | 쓰면 버려지는 장치("블랙홀") |
| `/dev/zero` | c | 읽으면 0이 끝없이 나오는 장치 |
| `/dev/random`, `/dev/urandom` | c | 난수 |
| `/dev/dsp`, `/dev/snd/` | c | 사운드 (OSS / ALSA) |
| `/dev/input/mice` | c | 마우스 |

- 장치 파일을 직접 만드는 명령: `mknod 이름 b|c 주번호 부번호` (예: `mknod /dev/mylp c 6 0`). 요즘은 udev가 자동으로 만든다.

> [!TRAP]
> ==red:디스크·CD-ROM은 블록(b), 터미널·프린터 포트·사운드·마우스는 문자(c) 장치다.== 프린터는 "종이에 블록으로 찍는다"는 느낌 때문에 블록으로 고르기 쉽지만 문자 장치다.

## 2. 하드웨어 확인 명령과 /proc

### 핵심 필기

| 명령 | 하는 일 | 자주 쓰는 옵션 |
|---|---|---|
| `lsusb` | ==USB 버스와 연결된 장치== 목록 | `-v` 자세히, `-t` 트리 |
| `lspci` | ==PCI 버스 장치== (그래픽·네트워크·사운드 카드) | `-v` 자세히, `-k` 사용 중인 커널 드라이버 |
| `lsblk` | 블록 장치와 파티션 트리 | `-f` 파일 시스템·UUID |
| `lscpu` | CPU 정보 | |
| `lshw` | 하드웨어 전체 요약 | `-short` |
| `dmesg` | 커널 링 버퍼 메시지 (장치 인식 기록) | `dmesg \| grep -i usb` |

```text
$ lsusb
Bus 002 Device 001: ID 1d6b:0003 Linux Foundation 3.0 root hub
Bus 001 Device 003: ID 04a9:1912 Canon, Inc. LiDE 400
Bus 001 Device 002: ID 03f0:2b17 HP, Inc LaserJet 1020
Bus 001 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub
$ lspci | grep -i -E 'vga|audio|ethernet'
00:02.0 VGA compatible controller: Intel Corporation UHD Graphics 620
00:1f.3 Audio device: Intel Corporation Sunrise Point-LP HD Audio
00:1f.6 Ethernet controller: Intel Corporation Ethernet Connection I219-V
```

*(위 lsusb·lspci 출력은 USB 프린터·스캐너가 연결된 데스크톱을 가정한 예시다. ID 형식은 `제조사ID:제품ID`.)*

**장치 정보를 담은 가상 파일(/proc)**

| 파일 | 내용 |
|---|---|
| `/proc/cpuinfo` | CPU 정보 |
| `/proc/meminfo` | 메모리 정보 |
| `/proc/devices` | 등록된 문자·블록 장치와 주 번호 |
| `/proc/interrupts` | IRQ(인터럽트) 사용 현황 |
| `/proc/ioports` | I/O 포트 주소 |
| `/proc/dma` | DMA 채널 |
| `/proc/modules` | 적재된 커널 모듈 (lsmod가 읽는 곳) |
| `/proc/partitions` | 파티션 정보 |

## 3. 커널 모듈 — 드라이버를 넣고 빼기

### 핵심 필기

- 리눅스 드라이버는 대부분 ==커널 모듈(.ko 파일)==로, 필요할 때 커널에 적재(load)하고 빼낼 수 있다. 위치: `/lib/modules/$(uname -r)/`.

| 명령 | 하는 일 | 의존성 처리 |
|---|---|:---:|
| `lsmod` | 현재 적재된 모듈 목록 (Module, Size, Used by) | — |
| `modinfo 모듈` | 모듈 정보 (파일 경로, 설명, 라이선스, 매개변수) | — |
| `insmod 경로/모듈.ko` | 모듈 적재 | ==✗ (직접 다 넣어야)== |
| `rmmod 모듈` | 모듈 제거 | ✗ |
| `modprobe 모듈` | 모듈 적재 | ==✓ 의존 모듈까지 자동== |
| `modprobe -r 모듈` | 모듈 제거 (의존 모듈 포함) | ✓ |
| `depmod -a` | 모듈 의존성 파일 `modules.dep` 생성 | — |

```text
$ lsmod | head -4
Module                  Size  Used by
snd_hda_intel          57344  3
snd_hda_codec         188416  2 snd_hda_intel,snd_hda_codec_realtek
usblp                  28672  0
$ sudo modprobe usblp          # USB 프린터 드라이버 적재
$ sudo modprobe -r usblp       # 제거
```

*(lsmod 출력은 사운드·USB 프린터가 있는 데스크톱의 예시. 실습 컨테이너는 모듈을 쓰지 않는 커널이라 lsmod가 없다.)*

- 설정: `/etc/modprobe.d/*.conf` — `blacklist 모듈`(자동 적재 막기), `options 모듈 매개변수=값`, `alias`.

> [!TRAP]
> ==red:insmod는 의존성을 처리하지 않고 모듈 파일 경로를 직접 주며, modprobe는 modules.dep를 보고 의존 모듈까지 자동 적재한다.== "의존성을 고려해 적재·제거"를 묻는다면 modprobe(-r)다.

## 4. udev — 장치를 꽂으면 /dev가 생긴다

### 핵심 필기

- **udev:** 사용자 공간(user space)의 ==동적 장치 관리자==. 커널이 장치 추가·제거를 알리면(uevent), `/sys`(sysfs)의 정보를 보고 규칙에 따라 ==/dev 아래 장치 파일을 자동 생성·삭제==한다. 예전의 정적 /dev, devfs를 대체했다. **핫플러그(hotplug)** 를 가능하게 한다.
- 규칙 파일: `/etc/udev/rules.d/` (관리자), `/lib/udev/rules.d/` (패키지 기본). 데몬은 `systemd-udevd`.
- 관리 명령: `udevadm info`(장치 속성), `udevadm monitor`(이벤트 실시간 보기), `udevadm trigger`(규칙 다시 적용).

```bash
# USB 장치를 꽂을 때 커널·udev 이벤트 지켜보기
udevadm monitor
# /dev/sdb 장치의 속성 보기
udevadm info --query=all --name=/dev/sdb
```

> [!CHECK]
> **1.** `ls -l` 결과 맨 앞 글자가 `c`인 장치 파일은 어떤 종류인가? `/dev/sda`는 어떤 종류인가?
>
> **2.** 의존 관계에 있는 모듈까지 자동으로 적재하는 명령은?
>
> **3.** USB 장치를 꽂았을 때 /dev 아래에 장치 파일을 자동으로 만들어 주는 사용자 공간 장치 관리자는?

## 5. 사운드 — OSS와 ALSA

### 핵심 필기

| 구분 | OSS (Open Sound System) | ALSA (Advanced Linux Sound Architecture) |
|---|---|---|
| 시기 | 초기 리눅스·유닉스 사운드 표준 | ==커널 2.6부터 기본== 사운드 구조 |
| 장치 파일 | `/dev/dsp`, `/dev/mixer`, `/dev/audio` | `/dev/snd/…` |
| 특징 | 단순, 이후 상용화(4Front) | 다중 사운드카드·MIDI·소프트웨어 믹싱, ==OSS 에뮬레이션 지원==, GPL |
| 도구 | — | `alsamixer`(텍스트 믹서), `amixer`(명령형 믹서), `aplay`·`arecord`(재생·녹음), `alsactl store/restore`(설정 저장·복원) |

- 그 위에서 동작하는 사운드 서버: PulseAudio, 최근 배포판의 PipeWire. 예전 설정 도구: `sndconfig`(레드햇), `alsaconf`.
- 사운드 카드 정보: `/proc/asound/cards`, `aplay -l`.

> [!TRAP]
> ==red:ALSA가 OSS를 대체한 쪽이다== (반대 아님). ALSA는 OSS 호환 계층을 제공하므로 OSS용 옛 프로그램도 돌아간다.

> [!PAGEBREAK]

## PART 2 · 프린터

## 6. 리눅스 인쇄 시스템의 흐름

### 핵심 필기

- 인쇄 요청은 바로 프린터로 가지 않고 ==스풀(spool) 디렉터리의 대기열(queue)에 작업(job)으로 쌓인 뒤==, 인쇄 데몬이 하나씩 꺼내 필터(형식 변환)를 거쳐 프린터로 보낸다.
- 리눅스 인쇄 시스템의 세 갈래:

| 시스템 | 데몬 | 특징 |
|---|---|---|
| **LPD / LPRng** | `lpd` | ==BSD 계열==. 설정 `/etc/printcap`, 스풀 `/var/spool/lpd`, 포트 515. LPRng는 개선판 |
| **System V 인쇄** | `lpsched` | 유닉스 System V 계열 명령(lp, lpstat, cancel) |
| **CUPS** | `cupsd` | 현재 표준. ==IPP 기반==, BSD·System V 명령을 모두 지원 |

[![사용자가 System V 계열 lp나 BSD 계열 lpr로 인쇄를 요청하면 CUPS 데몬 cupsd가 스풀 대기열에 작업을 쌓고, PPD와 Ghostscript 필터로 프린터 언어로 바꾼 뒤 USB·병렬·네트워크 백엔드로 프린터에 보내는 흐름. 옆에 확인·취소 명령 lpstat·lpq, cancel·lprm과 웹 관리 631 포트를 붙인 그림](/materials/diagrams/lm2-l10a-print-flow.svg)](/materials/diagrams/lm2-l10a-print-flow.svg)

*그림 10-1 · 인쇄 요청이 프린터에 닿기까지 — 누르면 원본 크기로 열린다.*

> [!NOTE]
> - **읽는 순서:** 위의 두 명령 계열(System V, BSD)에서 시작해 cupsd → 스풀 대기열 → 필터 → 백엔드 → 프린터로 내려간다.
> - **핵심:** CUPS는 ==어느 계열 명령으로 요청하든 같은 대기열로 받아 준다==. 확인·취소 명령도 계열마다 짝이 있다.
> - **시험 포인트:** ==red:lp ↔ lpr, lpstat ↔ lpq, cancel ↔ lprm== 짝을 바꿔 묻는다. lpc는 BSD 쪽 프린터 제어 명령이다.

## 7. System V 계열 인쇄 명령

### 핵심 필기

| 명령 | 하는 일 | 주요 옵션 |
|---|---|---|
| `lp 파일` | 인쇄 요청 | **`-d 프린터`** (destination), **`-n 매수`**, `-o 옵션` (예: `-o landscape`) |
| `lpstat` | 프린터·대기열 상태 | `-t` 모든 정보, `-p` 프린터 상태, `-d` 기본 프린터, `-a` 요청 수락 여부, `-o` 작업 목록, `-r` 스케줄러 동작 여부 |
| `cancel 작업ID` | 인쇄 작업 취소 | `cancel -a 프린터` 그 프린터의 작업 전부 |
| `lpadmin` | 프린터 추가·삭제·기본 지정 | `-p 프린터`(추가·수정), `-x 프린터`(삭제), `-d 프린터`(기본 지정) |
| `accept` / `reject` | 대기열이 ==요청을 받을지== 결정 | |
| `enable` / `disable` (`cupsenable` / `cupsdisable`) | 프린터가 ==실제로 출력할지== 결정 | |
| `lpmove` | 작업을 다른 프린터로 옮김 | |

```text
$ lp -d hp1020 -n 2 report.txt
request id is hp1020-15 (1 file(s))
$ lpstat -o
hp1020-15               user              2048   Fri 30 Oct 2026 05:20:11 PM KST
$ cancel hp1020-15
$ lpstat -d
system default destination: hp1020
```

## 8. BSD 계열 인쇄 명령

### 핵심 필기

| 명령 | 하는 일 | 주요 옵션 |
|---|---|---|
| `lpr 파일` | 인쇄 요청 | **`-P 프린터`** (대문자 P), **`-# 매수`**, `-m` 끝나면 메일 알림, `-r` 스풀 후 원본 파일 삭제 |
| `lpq` | 대기열의 작업 목록 | `-P 프린터`, `-a` 모든 프린터, `-l` 자세히 |
| `lprm 작업번호` | 작업 삭제 | `-P 프린터`, `lprm -` 내 작업 전부 |
| `lpc` | 프린터·대기열 제어(line printer control) | `status`, `start`, `stop`, `enable`, `disable`, `up`, `down`, `topq` |

```text
$ lpr -P hp1020 -#3 report.txt
$ lpq -P hp1020
hp1020 is ready and printing
Rank    Owner   Job     File(s)                         Total Size
active  user    16      report.txt                      2048 bytes
$ lprm -P hp1020 16
$ lpc status
hp1020:
        printer is on device 'usb' speed -1
        queuing is enabled
        printing is enabled
        no entries
        daemon present
```

| 하는 일 | System V | BSD |
|---|---|---|
| 인쇄 요청 | `lp` | `lpr` |
| 프린터 지정 | `-d` | `-P` |
| 매수 지정 | `-n` | `-#` |
| 대기열·상태 확인 | `lpstat` | `lpq` (`lpc status`) |
| 작업 취소 | `cancel` | `lprm` |
| 프린터 관리 | `lpadmin`, `accept`/`reject`, `enable`/`disable` | `lpc` |

> [!TRAP]
> ==red:프린터 지정은 lp -d, lpr -P(대문자)==, 매수는 ==lp -n, lpr -#==이다. `lpr -p`(소문자)는 pr 형식으로 페이지 머리말을 붙이는 다른 옵션이다.

> [!CHECK]
> **4.** BSD 계열의 lpq와 같은 역할을 하는 System V 계열 명령은?
>
> **5.** `report.txt`를 `laser` 프린터로 3부 인쇄하는 명령을 System V 방식과 BSD 방식으로 각각 쓰시오.

## 9. CUPS (Common UNIX Printing System)

### 핵심 필기

- Easy Software Products(Michael Sweet)가 개발, ==2007년 애플이 인수==한 인쇄 시스템. macOS와 대부분의 리눅스 배포판의 표준.
- ==IPP(Internet Printing Protocol) 기반==, 기본 ==TCP 631 포트==. 웹 브라우저로 `http://localhost:631`에 접속해 프린터를 추가·관리한다.
- ==BSD 계열(lpr, lpq, lprm)과 System V 계열(lp, lpstat, cancel) 명령을 모두 지원==한다.
- **PPD(PostScript Printer Description):** 프린터 기능을 기술한 드라이버 파일. 필터가 문서를 PostScript로 바꾸고, ==Ghostscript==가 PostScript를 프린터 언어로 변환한다.
- 네트워크 프린터 자동 탐색(브라우징), 접근 제어, 인증 기능.

| 경로 | 내용 |
|---|---|
| `/etc/cups/cupsd.conf` | ==cupsd 데몬의 주 설정== (Listen, 접근 제어) |
| `/etc/cups/printers.conf` | 등록된 프린터 목록 |
| `/etc/cups/ppd/` | 프린터별 PPD 파일 |
| `/var/spool/cups/` | 스풀 디렉터리 |
| `/var/log/cups/` | access_log, error_log, page_log |

```bash
systemctl status cups               # 데몬 이름 cupsd, 서비스 이름 cups
lpadmin -p laser -E -v ipp://192.168.0.50/ipp/print -m everywhere
lpadmin -d laser                     # 기본 프린터 지정
```

- GUI 설정 도구: `system-config-printer`(레드햇·우분투), GNOME·KDE 설정 앱. 예전 레드햇의 `printconf`, `printtool`도 같은 역할.

> [!TRAP]
> ==red:CUPS 포트는 631(IPP), LPD 포트는 515다.== "CUPS는 BSD 계열 명령만 지원한다", "CUPS 설정은 /etc/printcap"은 틀린 보기다(printcap은 LPD 방식).

> [!CHECK]
> **6.** CUPS가 사용하는 인쇄 프로토콜과 기본 포트 번호는?
>
> **7.** CUPS 데몬의 주 설정 파일 경로는?

> [!PAGEBREAK]

## PART 3 · 스캐너

## 10. SANE과 XSANE

### 핵심 필기

- **SANE (Scanner Access Now Easy):** 리눅스·유닉스에서 ==스캐너·디지털카메라 같은 이미지 입력 장치에 접근하는 표준 API==. 오픈 소스.
- 구조가 ==백엔드(backend) / 프런트엔드(frontend)==로 나뉜다.
  - **백엔드:** 스캐너 기종별 드라이버 (예: `epson2`, `genesys`, `pixma`, `hpaio`).
  - **프런트엔드:** 사용자가 쓰는 프로그램. 명령형 `scanimage`, 그래픽 ==XSANE==, `xscanimage`, Simple Scan, KDE의 Skanlite·Kooka, gscan2pdf 등.
  - 둘 사이가 표준 API로 분리돼 있어 ==어느 프런트엔드든 어느 백엔드와도 동작==하고, `saned` 데몬으로 네트워크 너머 스캐너도 공유한다(TCP 6566).
- **XSANE:** GTK 기반 ==SANE의 그래픽 프런트엔드==. 미리보기·해상도·색 조정, 복사·팩스·메일 모드, ==GIMP 플러그인==으로도 동작.

| 명령 | 하는 일 |
|---|---|
| `sane-find-scanner` | ==USB·SCSI 버스에서 스캐너 하드웨어를 찾음== (드라이버 지원 여부와 무관) |
| `scanimage -L` | SANE이 ==사용할 수 있는 스캐너 장치 목록== (--list-devices) |
| `scanimage -d 장치 --format=png > a.png` | 스캔해 파일로 저장 (기본 형식 pnm, 결과는 표준 출력) |
| `scanimage --resolution 300` | 해상도 지정 (dpi) |
| `scanimage -T` | 스캐너 테스트 |
| `scanadf` | 자동 급지(ADF) 다중 페이지 스캔 |
| `xsane` | 그래픽 스캔 프로그램 실행 |

```text
$ sane-find-scanner -q
found USB scanner (vendor=0x04a9, product=0x1912) at libusb:001:003
$ scanimage -L
device `pixma:04A91912' is a CANON CanoScan LiDE 400 multi-function peripheral
$ scanimage -d 'pixma:04A91912' --resolution 300 --format=png > page1.png
```

*(위 출력은 USB 스캐너가 연결된 데스크톱을 가정한 예시다.)*

| 설정 경로 | 내용 |
|---|---|
| `/etc/sane.d/` | SANE 설정 디렉터리 |
| `/etc/sane.d/dll.conf` | 사용할 백엔드 목록 (주석 처리하면 비활성) |
| `/etc/sane.d/saned.conf` | 네트워크 스캔 허용 호스트 |
| `/etc/sane.d/<백엔드>.conf` | 백엔드별 장치 설정 (예: `epson2.conf`) |

> [!TRAP]
> ==red:sane-find-scanner는 "하드웨어 탐지", scanimage -L은 "SANE이 쓸 수 있는 장치 목록"이다.== 스캐너가 sane-find-scanner에는 보이지만 scanimage -L에 안 보이면 백엔드(드라이버)가 없거나 권한 문제다. 또 ==XSANE은 그래픽, scanimage는 명령형== 프런트엔드다.

> [!EXAMPLE]
> **스캐너가 인식되지 않을 때 확인 순서 (학습용 흐름)**
>
> 1. `lsusb` — USB에 장치가 보이는가?
> 2. `sane-find-scanner` — 스캐너로 탐지되는가?
> 3. `/etc/sane.d/dll.conf` — 해당 백엔드가 켜져 있는가?
> 4. `scanimage -L` — SANE이 장치로 인식하는가? 그다음 `xsane`이나 `scanimage`로 스캔.

> [!CHECK]
> **8.** 스캐너 장치 목록을 출력하는 scanimage 옵션은?
>
> **9.** SANE의 그래픽 프런트엔드로, GIMP 플러그인으로도 쓸 수 있는 프로그램은?

> [!PAGEBREAK]

## 실전 문제

> [!QUIZ]
> 다음 중 BSD 계열 인쇄 명령과 System V 계열 인쇄 명령의 대응이 옳지 **않은** 것은?
>
> **A.** lpr — lp
>
> **B.** lpq — lpstat
>
> **C.** lprm — cancel
>
> **D.** lpc — lpr

> [!HINT 1]
> 왼쪽은 BSD, 오른쪽은 System V여야 한다. lpr은 어느 쪽인가?

> [!ANSWER]
> **D.** lpc(프린터 제어)는 BSD 계열이고, lpr도 BSD 계열 인쇄 요청 명령이다. System V 쪽에서 비슷한 관리 역할은 lpadmin, accept/reject, enable/disable이 나눠 맡는다.

> [!QUIZ]
> `lpr` 명령으로 `doc.txt` 파일을 `color` 프린터에 2부 출력하려고 한다. 알맞은 것은?
>
> **A.** `lpr -d color -n 2 doc.txt`
>
> **B.** `lpr -P color -#2 doc.txt`
>
> **C.** `lpr -p color -c 2 doc.txt`
>
> **D.** `lpr -P color -n 2 doc.txt`

> [!HINT 1]
> -d와 -n은 System V lp의 옵션이다.

> [!ANSWER]
> **B.** BSD 계열 lpr은 프린터 `-P`(대문자), 매수 `-#`. A는 lp에 맞는 옵션이다.

> [!QUIZ]
> CUPS에 대한 설명으로 옳지 **않은** 것은?
>
> **A.** IPP를 기반으로 하며 기본 포트는 631이다.
>
> **B.** 웹 브라우저로 프린터를 관리할 수 있다.
>
> **C.** BSD 계열 명령만 지원하고 System V 계열 명령은 지원하지 않는다.
>
> **D.** 주 설정 파일은 /etc/cups/cupsd.conf다.

> [!HINT 1]
> CUPS 위에서 lp도, lpr도 동작한다.

> [!ANSWER]
> **C.** CUPS는 BSD(lpr, lpq, lprm)와 System V(lp, lpstat, cancel) 명령을 모두 지원한다.

> [!QUIZ]
> 다음 설명에 해당하는 것은?
>
> "스캐너에 접근하기 위한 표준 API로, 장치별 드라이버인 백엔드와 사용자 프로그램인 프런트엔드로 구성된다."
>
> **A.** CUPS
>
> **B.** ALSA
>
> **C.** SANE
>
> **D.** udev

> [!HINT 1]
> 이름이 "스캐너 접근을 쉽게(Easy)"라는 뜻이다.

> [!ANSWER]
> **C.** SANE(Scanner Access Now Easy). CUPS는 인쇄, ALSA는 사운드, udev는 장치 파일 관리다.

> [!QUIZ]
> 모듈 의존성을 고려해 커널 모듈을 적재하는 명령은?
>
> **A.** insmod
>
> **B.** modprobe
>
> **C.** lsmod
>
> **D.** rmmod

> [!HINT 1]
> modules.dep 파일을 읽는 명령이다.

> [!ANSWER]
> **B.** modprobe는 `modules.dep`를 참고해 의존 모듈까지 함께 적재한다(`-r`은 함께 제거). insmod는 지정한 파일 하나만 넣는다.

> [!QUIZ]
> 다음 중 문자(character) 장치 파일이 **아닌** 것은?
>
> **A.** /dev/null
>
> **B.** /dev/tty1
>
> **C.** /dev/lp0
>
> **D.** /dev/sda1

> [!HINT 1]
> 파일 시스템을 만들고 마운트할 수 있는 장치는?

> [!ANSWER]
> **D.** /dev/sda1은 디스크 파티션으로 블록 장치다. 나머지는 모두 문자 장치다.

> [!PAGEBREAK]

## 단원 마무리

### 장 요약

| 주제 | 꼭 기억할 것 |
|---|---|
| 장치 파일 | /dev 아래. ==b 블록(디스크, CD) · c 문자(터미널, 프린터 포트, 사운드)==, 주 번호 = 드라이버, 부 번호 = 장치 |
| 확인 명령 | lsusb(USB), lspci(PCI), lsblk, dmesg, /proc/cpuinfo·interrupts·ioports·dma |
| 모듈 | lsmod · modinfo · insmod(의존성 ✗) · rmmod · ==modprobe(의존성 ✓, -r 제거)== · depmod |
| udev | 사용자 공간 동적 장치 관리자, /sys 정보 + /etc/udev/rules.d 규칙 → /dev 자동 생성 |
| 사운드 | OSS(옛 표준, /dev/dsp) → ==ALSA(커널 2.6부터 기본)==, alsamixer·aplay |
| System V 인쇄 | ==lp(-d, -n) · lpstat(-t) · cancel==, lpadmin, accept/reject, enable/disable |
| BSD 인쇄 | ==lpr(-P, -#) · lpq · lprm · lpc==, /etc/printcap, lpd |
| CUPS | IPP · ==631== · 웹 관리 · 두 계열 명령 모두 지원 · /etc/cups/cupsd.conf · PPD |
| 스캐너 | ==SANE(백엔드/프런트엔드) · XSANE(GUI) · scanimage(-L) · sane-find-scanner== · /etc/sane.d |

### 단답형 연습

답은 맨 끝 **정답과 해설**에서 확인한다.

1. 쓰면 내용이 버려지는 문자 장치 파일은? ______________
2. PCI 버스에 연결된 장치 목록을 보는 명령은? ______________
3. 현재 적재된 커널 모듈 목록을 보는 명령과, 그 명령이 읽는 /proc 파일은? ______________
4. 모듈 의존성 파일 modules.dep를 만드는 명령은? ______________
5. 커널 2.6부터 기본이 된 리눅스 사운드 구조는? ______________
6. System V 계열에서 인쇄 작업을 취소하는 명령은? ______________
7. BSD 계열에서 프린터 상태를 보고 시작·정지하는 제어 명령은? ______________
8. BSD LPD 방식에서 프린터를 정의하는 설정 파일은? ______________
9. PostScript를 프린터 언어로 변환하는 인터프리터는? ______________
10. USB·SCSI 스캐너 하드웨어를 탐지하는 SANE 명령은? ______________

## 책을 덮고 꺼내 보기

- 디스크 파티션 /dev/sda1은 {{블록}} 장치, 터미널 /dev/tty1은 {{문자}} 장치다.
- USB 장치 목록은 {{lsusb}}, PCI 장치 목록은 {{lspci}}로 본다.
- System V의 lp에서 프린터를 지정하는 옵션은 {{-d}}, BSD의 lpr에서는 {{-P}}다.
- CUPS의 기본 포트는 {{631}}번이다.
- SANE에서 기종별 드라이버를 {{백엔드}}, 사용자 프로그램을 {{프런트엔드}}라 한다.

> [!FLASHCARD]
> Q: 블록 장치와 문자 장치의 차이와 예는?
> A: 블록 장치는 블록 단위 임의 접근(디스크, CD-ROM, USB 메모리), 문자 장치는 바이트 단위 순차 접근(터미널, 직렬 포트, 프린터 포트, 사운드, /dev/null).

> [!FLASHCARD]
> Q: insmod와 modprobe의 차이는?
> A: insmod는 모듈 파일 경로를 직접 주고 의존성을 처리하지 않는다. modprobe는 modules.dep를 보고 의존 모듈까지 적재하며, -r로 함께 제거한다.

> [!FLASHCARD]
> Q: udev가 하는 일은?
> A: 커널의 장치 이벤트를 받아 sysfs(/sys) 정보와 규칙(/etc/udev/rules.d)에 따라 /dev 장치 파일을 동적으로 만들고 지운다(핫플러그).

> [!FLASHCARD]
> Q: System V와 BSD 인쇄 명령 짝은?
> A: 요청 lp ↔ lpr, 상태 lpstat ↔ lpq, 취소 cancel ↔ lprm. 관리는 System V lpadmin·accept/reject·enable/disable, BSD lpc.

> [!FLASHCARD]
> Q: lp와 lpr의 프린터·매수 지정 옵션은?
> A: lp는 -d 프린터, -n 매수. lpr은 -P 프린터, -# 매수.

> [!FLASHCARD]
> Q: CUPS의 핵심 특징은?
> A: IPP 기반(631 포트), 웹 관리 화면, BSD·System V 명령 모두 지원, PPD 드라이버, 설정 /etc/cups/cupsd.conf, 2007년 애플 인수.

> [!FLASHCARD]
> Q: sane-find-scanner와 scanimage -L의 차이는?
> A: sane-find-scanner는 USB·SCSI 버스에서 스캐너 하드웨어를 탐지하고, scanimage -L은 SANE 백엔드가 실제로 사용할 수 있는 장치 목록을 보여 준다.

**다음으로 갈 기준:** 인쇄 명령 짝표(요청·상태·취소·지정 옵션)와 SANE 구조를 보지 않고 다시 그릴 수 있으면 다음 편으로 간다: [11편 · X 윈도우 — 구조·윈도우 매니저·원격 보안·응용 프로그램](/lectures/grade-mukhnzii/semester-certificate/subject-linux-master-2/lecture-11).

> [!PAGEBREAK]

## 정답과 해설

### 확인 문제 정답

1. `c`는 **문자(character) 장치**, `/dev/sda`는 **블록(block) 장치**(디스크).
2. **`modprobe`** — `modules.dep`를 참고한다.
3. **udev** (데몬 `systemd-udevd`).
4. **`lpstat`** — 대기열 작업은 `lpstat -o`, 전체 정보는 `lpstat -t`.
5. System V: **`lp -d laser -n 3 report.txt`** / BSD: **`lpr -P laser -#3 report.txt`**.
6. **IPP(Internet Printing Protocol)**, **TCP 631**.
7. **`/etc/cups/cupsd.conf`**.
8. **`-L`** (`--list-devices`).
9. **XSANE**.

### 단답형 정답

1. **`/dev/null`**
2. **`lspci`**
3. **`lsmod`**, **`/proc/modules`**
4. **`depmod`** (`depmod -a`)
5. **ALSA**
6. **`cancel`**
7. **`lpc`**
8. **`/etc/printcap`**
9. **Ghostscript**
10. **`sane-find-scanner`**
