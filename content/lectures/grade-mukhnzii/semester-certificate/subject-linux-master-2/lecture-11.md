---
title: "11편 · X 윈도우 — 구조·윈도우 매니저·원격 보안·응용 프로그램"
description: "3과목 1장. X 윈도우의 역사와 서버·클라이언트 구조, X11·Xorg 설정, 디스플레이 매니저와 윈도우 매니저·데스크톱 환경, startx·xinit, DISPLAY 변수와 xhost·xauth 원격 보안, X 응용 프로그램의 종류까지 정리합니다."
order: 11
published: true
duration: 80
tags: [리눅스마스터 2급, 자격증, 3과목, X 윈도우, GNOME, KDE, xhost, xauth]
objectives:
  - X 서버와 X 클라이언트의 역할을 원격 실행 예로 설명하고 DISPLAY 값을 해석한다.
  - 디스플레이 매니저·윈도우 매니저·데스크톱 환경을 구분하고 대표 이름을 짝짓는다.
  - xhost와 xauth(.Xauthority)의 접근 제어 방식 차이를 설명한다.
  - 오피스·그래픽·멀티미디어·브라우저 등 X 응용 프로그램을 용도별로 분류한다.
---

## 학습 경로 · 3과목 1장

[← 10편 · 장치 설정](/lectures/grade-mukhnzii/semester-certificate/subject-linux-master-2/lecture-10) · [다음: 12편 · 인터넷 활용 (1) 네트워크 기초 →](/lectures/grade-mukhnzii/semester-certificate/subject-linux-master-2/lecture-12)

**범위:** 3과목 1장 "X 윈도우" — 리눅스 X 윈도우(역사, 특징, 구성, 설정·실행), X 윈도우 매니저와 데스크톱 환경, X 윈도우 원격 접속 보안 제어(DISPLAY, xhost, xauth), X 윈도우 응용 프로그램의 종류와 특징.

**형광펜 읽는 법:** ==yellow:노랑== 핵심 정의·결론 · ==red:빨강== 시험에서 헷갈리는 구분·함정 · ==blue:파랑== 외워야 할 순서·목록

> [!EXAM]
> **이 장의 핵심 질문:** 리눅스의 그래픽 화면은 누가 그리고(서버), 누가 요청하며(클라이언트), 다른 컴퓨터의 프로그램 창을 내 화면에 띄울 때 누구를 어떻게 허락하는가?
>
> **전체 흐름:** ==blue:X 윈도우의 역사·특징 → 서버/클라이언트 구조 → 설정(xorg.conf)과 실행(startx, 디스플레이 매니저) → 윈도우 매니저·데스크톱 환경 → 원격 실행(DISPLAY)과 보안(xhost, xauth) → 응용 프로그램==

---

## 단원 도입

| 출제 포인트 | 빈도 | 이렇게 나온다 |
|---|:---:|---|
| X 서버 / X 클라이언트 역할 | ★★★ | "모니터·키보드를 관리하는 쪽은?" → X 서버 |
| xhost / xauth 명령과 .Xauthority | ★★★ | 특정 호스트 허용 명령, 쿠키 파일 이름 |
| DISPLAY 변수 형식 | ★★★ | `호스트:디스플레이.스크린` 해석, export 명령 |
| 데스크톱 환경 ↔ 툴킷 (GNOME-GTK, KDE-Qt) | ★★★ | 짝이 틀린 보기 고르기 |
| X 응용 프로그램 분류 | ★★★ | 그래픽·오피스·멀티미디어 프로그램 고르기 |
| 디스플레이 매니저 (xdm, gdm, kdm, lightdm) | ★★ | 그래픽 로그인 화면 제공 프로그램 |
| 윈도우 매니저 종류 | ★★ | 윈도우 매니저가 아닌 것 |
| X 윈도우 역사 (MIT, X11, XFree86 → X.Org) | ★★ | 개발 기관, 버전 |
| startx / xinit / .xinitrc | ★ | X 실행 순서 |

> [!PAGEBREAK]

## PART 1 · 리눅스 X 윈도우

## 1. X 윈도우의 역사와 특징

### 핵심 필기

- **X 윈도우(X Window System, X11, 줄여서 X):** 유닉스·리눅스의 ==GUI 환경을 제공하는 네트워크 기반 그래픽 시스템==. 창을 그리고 키보드·마우스 입력을 처리하는 기반만 제공한다.

| 시기 | 사건 |
|---|---|
| 1984 | ==MIT의 아테나 프로젝트(Project Athena)== 에서 개발 시작 (DEC 등 참여). 스탠퍼드의 W 윈도우 시스템 다음이라 "X" |
| 1987 | ==X11(버전 11)== 발표 — 이후 지금까지 프로토콜 버전은 11 |
| 1988~ | MIT X 컨소시엄 → X 컨소시엄(1993) → Open Group이 관리 |
| 1990년대 | ==XFree86== — 인텔 x86 PC용 X 서버 구현, 리눅스의 표준 X로 쓰임 |
| 2004 | XFree86 4.4의 라이선스 변경을 계기로 ==X.Org 재단이 X.Org 서버(Xorg)== 를 만들어 대부분 배포판이 전환 |
| 현재 | X11R7.x 계열. 후속 디스플레이 서버 프로토콜 ==Wayland==(참조 구현 Weston)가 확산 중, XWayland로 X 프로그램 호환 |

**특징**

- ==네트워크 기반 클라이언트/서버 구조== — 원격 호스트의 프로그램을 내 화면에 띄울 수 있다(네트워크 투명성).
- ==하드웨어·운영체제에 독립적== — X 프로토콜만 지키면 어떤 장비·OS에서도 동작.
- ==정책이 아닌 메커니즘만 제공== — 창 모양·배치·조작 방식은 정하지 않고 윈도우 매니저에 맡긴다. 그래서 다양한 윈도우 매니저·데스크톱 환경을 골라 쓸 수 있다.
- 리눅스에서 X 윈도우는 ==커널과 별개의 응용 프로그램(사용자 공간)== 이다. GUI 없이도 시스템은 동작한다.

> [!TRAP]
> ==red:X 윈도우는 MIT에서 개발됐다== (버클리·AT&T 아님). 또 "X 윈도우는 커널에 포함된 그래픽 모듈이다"는 틀린 설명이다 — 사용자 공간에서 실행되는 프로그램이다.

## 2. X 서버와 X 클라이언트

### 핵심 필기

| 구성 | 하는 일 | 예 |
|---|---|---|
| **X 서버** | ==디스플레이(모니터)·키보드·마우스를 관리==하고, 클라이언트 요청대로 화면에 그린다. 입력 이벤트를 클라이언트에 전달 | Xorg, XFree86, Xvfb(가상), XQuartz(macOS), XWayland |
| **X 클라이언트** | X 서버에 "창을 만들어 그려 달라"고 요청하는 ==응용 프로그램== | xterm, xclock, firefox, gimp, 윈도우 매니저도 클라이언트 |
| **X 프로토콜** | 서버와 클라이언트 사이의 통신 규약. 로컬은 유닉스 소켓, 원격은 ==TCP 6000 + 디스플레이 번호== | `:0` → 6000, `:1` → 6001 |
| **Xlib / XCB** | 클라이언트가 X 프로토콜을 쓰도록 돕는 C 라이브러리 | |
| **툴킷(위젯 라이브러리)** | 버튼·메뉴 같은 위젯을 제공 | ==GTK+(GNOME, Xfce), Qt(KDE)==, Motif(CDE), Xt·Xaw |

[![사용자 앞의 로컬 PC에서 X 서버 Xorg가 모니터·키보드·마우스를 관리하고, 원격 서버에서 실행된 xclock·firefox 같은 X 클라이언트가 DISPLAY=192.168.0.10:0 으로 TCP 6000 포트의 X 프로토콜로 그리기를 요청하는 구조. 로컬 X 서버 앞에는 xhost 호스트 허용과 xauth .Xauthority 쿠키 확인이라는 두 관문이 있다](/materials/diagrams/lm2-l11a-x-client-server.svg)](/materials/diagrams/lm2-l11a-x-client-server.svg)

*그림 11-1 · X 서버는 화면이 있는 쪽이다 — 누르면 원본 크기로 열린다.*

> [!NOTE]
> - **읽는 순서:** 오른쪽 원격 서버에서 실행된 클라이언트가 DISPLAY 값을 보고 왼쪽 로컬 PC의 X 서버로 요청을 보낸다. 가운데 두 관문(xhost, xauth)을 통과해야 화면에 창이 뜬다.
> - **핵심:** ==X 서버는 사용자 앞(화면·키보드가 있는 쪽), 클라이언트는 프로그램이 실행되는 쪽==이다. 웹(서버가 멀리 있음)과 방향이 반대처럼 보인다.
> - **시험 포인트:** ==red:"원격 호스트에서 실행되는 프로그램이 X 서버"라는 보기는 틀렸다.== 디스플레이 번호 0 → TCP 6000.

> [!TRAP]
> ==red:윈도우 매니저도 X 클라이언트의 하나다.== X 서버는 창 테두리·이동·크기 조절을 직접 하지 않는다. 그 일을 하는 특별한 클라이언트가 윈도우 매니저다.

## 3. X 윈도우 설정과 실행

### 핵심 필기

**설정 파일 — `/etc/X11/xorg.conf`** (요즘은 대부분 자동 감지, 필요한 부분만 `/etc/X11/xorg.conf.d/*.conf`)

| Section | 내용 |
|---|---|
| `Files` | 글꼴·모듈 경로 |
| `Module` | 불러올 X 서버 모듈 |
| `InputDevice` | 키보드·마우스 |
| `Monitor` | 모니터 주파수 등 |
| `Device` | ==그래픽 카드와 드라이버== |
| `Screen` | Device + Monitor 조합, 해상도·색 깊이 |
| `ServerLayout` | Screen과 InputDevice를 묶은 전체 구성 |

- 설정 파일 만들기: `Xorg -configure` (→ `xorg.conf.new`). XFree86 시절에는 `XF86Config` 파일과 `xf86config`, `xf86cfg`, `Xconfigurator` 같은 도구를 썼다.
- 해상도 바꾸기: `xrandr`, 화면 정보: `xdpyinfo`, 창 정보: `xwininfo`, 창 강제 종료: `xkill`.

**실행 방법 두 가지**

| 방법 | 흐름 |
|---|---|
| 텍스트 로그인 후 수동 실행 | ==blue:startx → xinit → X 서버 + ~/.xinitrc 실행== |
| 그래픽 로그인 | 부팅 시 ==디스플레이 매니저==가 X 서버를 띄우고 로그인 창 제공 (systemd `graphical.target`, 예전 런레벨 5) |

- **startx:** xinit의 ==셸 스크립트 프런트엔드==. 사용자 `~/.xinitrc`(없으면 `/etc/X11/xinit/xinitrc`)와 서버 옵션 `~/.xserverrc`를 읽는다. `startx -- :1`은 디스플레이 1번에 두 번째 X를 띄운다.
- **xinit:** X 서버를 띄우고 첫 클라이언트(.xinitrc)를 실행. `.xinitrc`의 마지막 명령이 끝나면 X도 끝난다.

```bash
# ~/.xinitrc 예 — 마지막 줄이 세션 본체
xsetroot -solid gray &
xterm &
exec startxfce4
```

**디스플레이 매니저(Display Manager)** — 그래픽 로그인 화면을 제공하고 세션을 시작하는 프로그램. 원격 그래픽 로그인 프로토콜 ==XDMCP(UDP 177)== 를 지원한다.

| 디스플레이 매니저 | 소속 |
|---|---|
| **XDM** | X 윈도우 기본 |
| **GDM** | ==GNOME== |
| **KDM** → **SDDM** | ==KDE== (Plasma 5부터 SDDM) |
| **LightDM** | 가벼운 범용 (Xfce, 우분투 Unity 등에서 사용) |

> [!TRAP]
> ==red:디스플레이 매니저(xdm, gdm, kdm, lightdm)는 로그인 화면, 윈도우 매니저(twm, metacity, kwin…)는 창 관리==다. 이름이 비슷해 보기에서 섞인다. gdm·kdm은 "dm" = display manager로 기억한다.

> [!CHECK]
> **1.** 모니터·키보드·마우스를 관리하며 클라이언트의 요청을 받아 화면에 그리는 쪽은 X 서버인가, X 클라이언트인가?
>
> **2.** startx 실행 시 사용자별로 실행할 클라이언트를 적어 두는 파일은?
>
> **3.** GNOME과 KDE의 디스플레이 매니저 이름은?

> [!PAGEBREAK]

## PART 2 · 윈도우 매니저와 데스크톱 환경

## 4. 윈도우 매니저와 데스크톱 환경

### 핵심 필기

- **윈도우 매니저(Window Manager):** X 클라이언트의 하나로, ==창의 테두리·제목 표시줄·이동·크기 조절·최소화·포커스==처럼 창의 모양과 동작을 관리한다.
- **데스크톱 환경(Desktop Environment):** 윈도우 매니저 + 패널·파일 관리자·설정 도구·기본 응용 프로그램을 ==하나의 통일된 환경으로 묶은 것==.

[![아래부터 하드웨어, X 서버 Xorg, 툴킷 GTK·Qt, 윈도우 매니저, 데스크톱 환경 GNOME·KDE·Xfce, 응용 프로그램이 쌓인 층 구조. 옆에 디스플레이 매니저가 X 서버를 띄우고 로그인 뒤 데스크톱 세션을 시작한다고 적은 그림](/materials/diagrams/lm2-l11b-x-stack.svg)](/materials/diagrams/lm2-l11b-x-stack.svg)

*그림 11-2 · X 윈도우 GUI의 층 — 누르면 원본 크기로 열린다.*

> [!NOTE]
> - **읽는 순서:** 아래 하드웨어에서 위 응용 프로그램으로 올라간다. 오른쪽 디스플레이 매니저는 "부팅 후 X 서버를 띄우고 로그인 받는" 문지기다.
> - **핵심:** ==X 서버는 그리기만, 윈도우 매니저는 창 관리만, 데스크톱 환경은 그 위의 묶음==이다. 툴킷이 GTK인지 Qt인지가 데스크톱 환경의 "가족"을 가른다.
> - **시험 포인트:** ==red:GNOME = GTK, KDE = Qt== 짝을 바꿔 내는 보기가 단골이다.

**대표 윈도우 매니저**

| 윈도우 매니저 | 특징 |
|---|---|
| **twm** (Tab Window Manager) | X에 기본 포함된 가장 단순한 표준 WM |
| **fvwm** | twm 기반, 가볍고 가상 데스크톱 지원 |
| **Metacity → Mutter** | ==GNOME== 의 WM (GNOME 3부터 Mutter) |
| **KWin** | ==KDE== 의 WM |
| **Xfwm** | Xfce의 WM |
| **Openbox** | LXDE의 WM, 가볍고 설정이 쉬움 |
| **Enlightenment** | 화려한 그래픽 효과, 자체 환경(E) 발전 |
| **Window Maker**, **AfterStep** | NeXTSTEP 모양을 본뜸 |
| **Fluxbox**, **Blackbox**, **IceWM** | 가벼운 WM |
| **Compiz** | 3D 합성(컴포지팅) 효과 WM |

**대표 데스크톱 환경**

| 데스크톱 환경 | 툴킷 | 특징 |
|---|---|---|
| **GNOME** | ==GTK+== | GNU 프로젝트, 1997년 미겔 데 이카사·페데리코 메나. 파일 관리자 Nautilus(파일), WM Mutter. 레드햇·페도라·우분투 기본 |
| **KDE (Plasma)** | ==Qt== | 1996년 마티아스 에트리히. 파일 관리자 Dolphin(예전 Konqueror), WM KWin. 기능·설정이 풍부 |
| **Xfce** | GTK | ==가볍고 빠름==. 파일 관리자 Thunar, WM Xfwm |
| **LXDE / LXQt** | GTK / Qt | 매우 가벼움. 저사양 PC용 |
| **Cinnamon** | GTK | 리눅스 민트, GNOME 3 기반 |
| **MATE** | GTK | ==GNOME 2를 이어 가는 포크== |
| **CDE** | Motif | 상용 유닉스(Solaris, HP-UX)의 표준 데스크톱 |
| **Unity** | GTK | 우분투 11.04~17.04의 기본 셸 |

> [!TRAP]
> ==red:Qt는 KDE, GTK+는 GNOME·Xfce·LXDE·Cinnamon·MATE==의 툴킷이다. GTK의 원래 이름은 ==GIMP Toolkit==(그래픽 프로그램 GIMP를 만들려고 개발)이다. KWin·Metacity·Mutter는 윈도우 매니저이지 데스크톱 환경이 아니다.

> [!CHECK]
> **4.** 창의 테두리·이동·크기 조절을 담당하는 X 클라이언트를 무엇이라 하는가?
>
> **5.** Qt 라이브러리를 기반으로 하는 데스크톱 환경은?

> [!PAGEBREAK]

## PART 3 · X 윈도우 원격 접속 보안 제어

## 5. DISPLAY 환경 변수

### 핵심 필기

- X 클라이언트는 ==DISPLAY 환경 변수를 보고 어느 X 서버에 그릴지== 정한다. 실행 시 `-display` 옵션으로도 줄 수 있다.
- 형식: **`호스트이름:디스플레이번호.스크린번호`**
  - 호스트를 생략하면 로컬(유닉스 소켓): `:0`
  - 디스플레이 번호 n → TCP ==6000 + n== 포트
  - 스크린 번호는 한 디스플레이의 여러 모니터 구분(보통 0, 생략 가능)

| 값 | 뜻 |
|---|---|
| `:0` 또는 `:0.0` | 로컬 첫 번째 디스플레이의 첫 스크린 |
| `192.168.0.10:0` | 192.168.0.10의 디스플레이 0번 (TCP 6000) |
| `pc1.example.com:1.0` | pc1의 디스플레이 1번(TCP 6001), 스크린 0번 |
| `localhost:10.0` | ==ssh -X 포워딩이 자동 설정하는 값== |

```bash
# 원격 서버(192.168.0.20)에서 실행 → 내 PC(192.168.0.10)의 화면에 xclock 띄우기
export DISPLAY=192.168.0.10:0.0      # bash
setenv DISPLAY 192.168.0.10:0.0      # csh / tcsh
xclock &
xterm -display 192.168.0.10:0 &      # 옵션으로 직접 지정
```

## 6. xhost — 호스트 단위 허용

### 핵심 필기

- X 서버 쪽(화면이 있는 내 PC)에서 실행해 ==어떤 호스트의 클라이언트가 접속할 수 있는지==를 정한다. 호스트 기반이라 그 호스트의 ==모든 사용자==가 허용된다.

| 명령 | 뜻 |
|---|---|
| `xhost` | 현재 접근 제어 상태와 허용 목록 |
| `xhost +192.168.0.20` | 그 호스트 허용 (목록에 추가) |
| `xhost -192.168.0.20` | 그 호스트 제거 |
| `xhost +` | ==접근 제어 해제 — 모든 호스트 허용 (위험)== |
| `xhost -` | 접근 제어 사용 — 목록에 있는 호스트만 허용 |

```text
$ xhost +192.168.0.20
192.168.0.20 being added to access control list
$ xhost
access control enabled, only authorized clients can connect
INET:192.168.0.20
$ xhost +
access control disabled, clients can connect from any host
$ xhost -
access control enabled, only authorized clients can connect
```

> [!TRAP]
> ==red:xhost는 X 클라이언트가 실행되는 원격 서버가 아니라 X 서버(화면이 있는 쪽)에서 실행한다.== `xhost +`(호스트 이름 없음)는 전부 허용이다. 반대로 `xhost -`(이름 없음)는 "아무도 허용 안 함"이 아니라 "목록 기반 제어를 켠다"는 뜻이다.

## 7. xauth와 .Xauthority — 사용자 단위 쿠키 인증

### 핵심 필기

- **MIT-MAGIC-COOKIE-1:** X 서버가 시작될 때 만든 ==비밀 값(쿠키)을 아는 클라이언트만 접속을 허용==하는 방식. 쿠키는 사용자 홈의 **`~/.Xauthority`** 파일에 저장된다(환경 변수 `XAUTHORITY`로 다른 경로 지정 가능).
- **xauth:** .Xauthority의 쿠키를 보고·추가하고·옮기는 명령. ==사용자 단위==로 허용하므로 xhost보다 안전하다.

| xauth 하위 명령 | 뜻 |
|---|---|
| `list [디스플레이]` | 쿠키 목록 |
| `add 디스플레이 프로토콜 16진키` | 쿠키 추가 |
| `remove 디스플레이` | 쿠키 삭제 |
| `extract 파일 디스플레이` | 쿠키를 파일로 뽑아 내기 |
| `merge 파일` | 파일의 쿠키를 합치기 |
| `generate 디스플레이 프로토콜` | X 서버에 새 쿠키 생성 요청 |

실습 환경에서 임시 파일로 실행한 결과:

```text
$ xauth add myhost/unix:0 MIT-MAGIC-COOKIE-1 4f1c2a9be3d07a6c51e8b2f09d3c7a11
$ xauth add 192.168.0.10:0 . 4f1c2a9be3d07a6c51e8b2f09d3c7a11
$ xauth list
myhost/unix:0  MIT-MAGIC-COOKIE-1  4f1c2a9be3d07a6c51e8b2f09d3c7a11
192.168.0.10:0  MIT-MAGIC-COOKIE-1  4f1c2a9be3d07a6c51e8b2f09d3c7a11
```

*(프로토콜 자리의 `.`은 MIT-MAGIC-COOKIE-1의 줄임이다.)*

```bash
# 내 PC(X 서버)의 쿠키를 원격 서버로 옮겨 그쪽 클라이언트가 접속하게 하기
xauth extract - $DISPLAY | ssh user@192.168.0.20 xauth merge -
```

## 8. 더 안전한 방법 — SSH X11 포워딩

### 핵심 필기

- `ssh -X 사용자@원격` 으로 접속하면 X 프로토콜이 ==SSH 암호화 터널로 전달==되고, 원격 쪽 DISPLAY(`localhost:10.0` 등)와 xauth 쿠키가 ==자동 설정==된다. xhost를 열 필요가 없다.
- 서버 설정: `/etc/ssh/sshd_config`의 **`X11Forwarding yes`**. `-Y`는 신뢰(trusted) 포워딩.
- 그 밖의 원격 그래픽: VNC(TCP 5900 + n), XDMCP(UDP 177), RDP(xrdp).
- 요즘 Xorg는 기본적으로 TCP 6000을 열지 않는다(`-nolisten tcp`). 그래서 원격 X는 사실상 ssh -X가 표준이다.

```bash
ssh -X admin@192.168.0.20
echo $DISPLAY          # localhost:10.0 처럼 자동 설정됨
xclock &               # 창은 내 PC 화면에 뜬다
```

| 방식 | 허용 단위 | 보안 |
|---|---|---|
| `xhost +호스트` | 호스트 전체 | 낮음 (평문, 그 호스트 모든 사용자) |
| `xauth` 쿠키 | 쿠키를 가진 사용자 | 중간 (평문 전송) |
| `ssh -X` | SSH 인증 사용자 | ==높음 (암호화 터널)== |

> [!CHECK]
> **6.** `DISPLAY=server1:2.0`일 때 X 클라이언트가 접속하는 TCP 포트 번호는?
>
> **7.** 모든 호스트의 X 클라이언트 접속을 허용하는 xhost 명령은?
>
> **8.** MIT-MAGIC-COOKIE-1 쿠키가 저장되는 사용자 홈의 파일 이름은?

> [!PAGEBREAK]

## PART 4 · X 윈도우 응용 프로그램

## 9. 응용 프로그램의 종류와 특징

### 핵심 필기

**오피스**

| 프로그램 | 내용 |
|---|---|
| **LibreOffice** | OpenOffice.org에서 갈라진 ==대표 오피스 제품군==. Writer(워드), ==Calc(스프레드시트)==, ==Impress(프레젠테이션)==, Draw(드로잉), Base(데이터베이스), Math(수식) |
| **Apache OpenOffice** | 썬 → 오라클 → 아파치로 넘어간 OpenOffice.org |
| **Calligra Suite** (옛 KOffice) | KDE용 오피스: Words, Sheets, Stage, Karbon(벡터), Krita(페인팅) |
| **AbiWord**, **Gnumeric** | GNOME 계열의 가벼운 워드·스프레드시트 |

**그래픽**

| 프로그램 | 내용 |
|---|---|
| **GIMP** | ==래스터(비트맵) 이미지 편집기==. 포토샵 대응, 레이어·필터·플러그인. 형식 XCF |
| **Inkscape** | ==벡터 드로잉==, SVG가 기본 형식. 일러스트레이터 대응 |
| **Krita** | 디지털 페인팅 |
| **Blender** | ==3D 모델링·애니메이션==·렌더링 |
| **Eye of GNOME (eog)**, **gThumb**, **Shotwell** | GNOME 계열 이미지 뷰어·사진 관리 |
| **Gwenview**, **KolourPaint** | KDE 이미지 뷰어 / 간단한 그림판 |
| **ImageMagick** | 명령행 이미지 처리: `display`(보기), `convert`(형식 변환·크기 조정), `import`(화면 캡처) |
| **xv**, **Xpaint** | 옛 X용 이미지 뷰어·그림판 |

**멀티미디어**

| 프로그램 | 내용 |
|---|---|
| **Totem** (GNOME 동영상) | ==GNOME 기본 동영상 플레이어== |
| **VLC**, **MPlayer / SMPlayer**, **Kaffeine** | 동영상·음악 플레이어 (VLC는 코덱 내장) |
| **Rhythmbox** | ==GNOME 음악 플레이어== |
| **Amarok** | ==KDE 음악 플레이어== |
| **Audacious**, **XMMS** | 가벼운 음악 플레이어 (XMMS는 윈앰프 모양) |
| **Audacity** | ==오디오 녹음·편집== |
| **Kdenlive**, **OpenShot**, **Pitivi** | 동영상 편집 |
| **Brasero** (GNOME), **K3b** (KDE) | CD/DVD 굽기 |
| **Cheese** | 웹캠 촬영 |

**인터넷·기타**

| 분류 | 프로그램 |
|---|---|
| 웹 브라우저 | ==Firefox==, Chromium/Chrome, ==Konqueror==(KDE 파일 관리자 겸 브라우저), Epiphany(GNOME Web), Opera |
| 메일·일정 | Thunderbird, ==Evolution==(GNOME 메일·일정 PIM), KMail(KDE) |
| 메신저 | Pidgin |
| 문서 뷰어 | Evince(GNOME PDF), Okular(KDE) |
| 텍스트 편집기 | gedit(GNOME), Kate·KWrite(KDE) |
| 터미널 | xterm, gnome-terminal, Konsole(KDE) |
| X 기본 유틸리티 | xclock(시계), xeyes, xcalc(계산기), xlogo, xdpyinfo, xwininfo, xkill, xset, xrandr |

> [!TRAP]
> ==red:GIMP는 래스터(비트맵), Inkscape는 벡터 그래픽 편집기다.== Totem·Rhythmbox는 GNOME, Amarok·K3b·Konqueror·Okular는 KDE다. "그래픽 프로그램이 아닌 것"을 고르는 문제에서 Rhythmbox, Totem, Evolution 같은 이름을 섞어 낸다.

> [!EXAMPLE]
> **이름 끝으로 소속 추측하기 (학습용 요령)**
>
> 이름이 ==K로 시작(Konqueror, Konsole, KMail, Kate, K3b)== 하면 대부분 KDE, ==G로 시작(gedit, GIMP, gThumb, gnome-terminal)== 하면 GNOME·GTK 계열일 가능성이 높다. 예외: Amarok(KDE), Evolution·Totem·Rhythmbox(GNOME).

> [!CHECK]
> **9.** 래스터 이미지 편집기로 포토샵에 대응하는 프로그램과, SVG 형식의 벡터 드로잉 프로그램은?
>
> **10.** LibreOffice에서 스프레드시트 프로그램의 이름은?

> [!PAGEBREAK]

## 실전 문제

> [!QUIZ]
> X 윈도우에 대한 설명으로 옳지 **않은** 것은?
>
> **A.** MIT의 아테나 프로젝트에서 시작되었다.
>
> **B.** 네트워크 기반의 클라이언트/서버 구조를 가진다.
>
> **C.** X 서버는 원격 호스트에서 실행되는 응용 프로그램을 말한다.
>
> **D.** 창의 모양과 동작은 윈도우 매니저가 담당한다.

> [!HINT 1]
> 모니터와 키보드는 어느 쪽에 있는가?

> [!ANSWER]
> **C.** X 서버는 화면·키보드·마우스가 있는 쪽에서 디스플레이를 관리하는 프로그램이다. 원격 호스트에서 실행되는 응용 프로그램은 X 클라이언트다.

> [!QUIZ]
> 원격 서버(192.168.1.20)에서 실행한 X 프로그램을 내 PC(192.168.1.10)의 화면에 띄우려 한다. 내 PC에서 해야 할 작업으로 알맞은 것은?
>
> **A.** `xhost +192.168.1.20`
>
> **B.** `xhost +192.168.1.10`
>
> **C.** `export DISPLAY=192.168.1.20:0`
>
> **D.** `xhost -`

> [!HINT 1]
> xhost는 X 서버 쪽에서 "누가 들어와도 되는지" 정한다. 들어오는 쪽은 누구인가?

> [!ANSWER]
> **A.** 내 PC(X 서버)에서 원격 서버 192.168.1.20을 허용한다. 그다음 원격 서버 쪽에서 `export DISPLAY=192.168.1.10:0`을 설정하고 프로그램을 실행한다. C는 방향이 반대다.

> [!QUIZ]
> 데스크톱 환경과 기반 툴킷의 연결이 옳은 것은?
>
> **A.** GNOME — Qt
>
> **B.** KDE — GTK+
>
> **C.** Xfce — Qt
>
> **D.** KDE — Qt

> [!HINT 1]
> GTK는 GIMP를 만들려고 나온 툴킷이고, GIMP는 GNOME 쪽 프로그램이다.

> [!ANSWER]
> **D.** KDE는 Qt, GNOME·Xfce는 GTK+ 기반이다.

> [!QUIZ]
> 다음 중 디스플레이 매니저가 **아닌** 것은?
>
> **A.** xdm
>
> **B.** gdm
>
> **C.** lightdm
>
> **D.** kwin

> [!HINT 1]
> "dm"으로 끝나는 이름을 찾아라.

> [!ANSWER]
> **D.** kwin은 KDE의 윈도우 매니저다. xdm·gdm·lightdm(그리고 kdm, sddm)은 그래픽 로그인을 제공하는 디스플레이 매니저다.

> [!QUIZ]
> MIT-MAGIC-COOKIE-1 방식의 X 접근 제어에 대한 설명으로 옳은 것은?
>
> **A.** 쿠키는 `/etc/X11/xorg.conf`에 저장된다.
>
> **B.** 쿠키는 사용자 홈의 `.Xauthority` 파일에 저장되며 xauth 명령으로 관리한다.
>
> **C.** 호스트 단위로만 허용하므로 그 호스트의 모든 사용자가 접속할 수 있다.
>
> **D.** `xhost +` 명령으로 쿠키를 생성한다.

> [!HINT 1]
> 호스트 단위 허용은 xhost의 특징이다.

> [!ANSWER]
> **B.** 쿠키는 `~/.Xauthority`에 있고 `xauth list/add/extract/merge`로 다룬다. C는 xhost 설명, D의 `xhost +`는 접근 제어를 끄는 명령이다.

> [!QUIZ]
> 다음 X 응용 프로그램 중 용도가 나머지와 **다른** 것은?
>
> **A.** GIMP
>
> **B.** Inkscape
>
> **C.** Rhythmbox
>
> **D.** Krita

> [!HINT 1]
> 셋은 그림을 만들고, 하나는 소리를 낸다.

> [!ANSWER]
> **C.** Rhythmbox는 GNOME의 음악 플레이어(멀티미디어)다. GIMP(래스터), Inkscape(벡터), Krita(페인팅)는 그래픽 프로그램이다.

> [!QUIZ]
> `DISPLAY=192.168.0.5:1.0`에 대한 해석으로 옳은 것은?
>
> **A.** 192.168.0.5의 디스플레이 0번, 스크린 1번이며 TCP 6000을 사용한다.
>
> **B.** 192.168.0.5의 디스플레이 1번, 스크린 0번이며 TCP 6001을 사용한다.
>
> **C.** 192.168.0.5의 디스플레이 1번이며 TCP 6010을 사용한다.
>
> **D.** 로컬 호스트의 디스플레이 1번이며 유닉스 소켓을 사용한다.

> [!HINT 1]
> 형식은 호스트:디스플레이.스크린, 포트는 6000 + 디스플레이 번호.

> [!ANSWER]
> **B.** 콜론 뒤 첫 숫자가 디스플레이(1 → 6001), 점 뒤가 스크린(0)이다.

> [!PAGEBREAK]

## 단원 마무리

### 장 요약

| 주제 | 꼭 기억할 것 |
|---|---|
| 역사 | ==MIT 아테나 프로젝트(1984) → X11(1987) → XFree86 → X.Org(2004)==, 후속 Wayland |
| 구조 | ==X 서버 = 화면·입력 관리(사용자 앞), X 클라이언트 = 응용 프로그램==, X 프로토콜 TCP 6000+n, Xlib, 툴킷 |
| 설정·실행 | /etc/X11/xorg.conf (Device, Monitor, Screen, InputDevice, ServerLayout), ==startx → xinit → ~/.xinitrc== |
| 디스플레이 매니저 | 그래픽 로그인: xdm, gdm(GNOME), kdm·sddm(KDE), lightdm / XDMCP UDP 177 |
| 윈도우 매니저 | 창 관리 클라이언트: twm, fvwm, Metacity·Mutter, KWin, Xfwm, Openbox, Enlightenment, Compiz |
| 데스크톱 환경 | ==GNOME(GTK) · KDE(Qt)== · Xfce · LXDE · Cinnamon · MATE · CDE |
| DISPLAY | ==호스트:디스플레이.스크린==, export DISPLAY=… |
| 원격 보안 | ==xhost(호스트 단위, X 서버에서 실행) · xauth(~/.Xauthority 쿠키, 사용자 단위) · ssh -X(암호화, X11Forwarding yes)== |
| 응용 | 오피스 LibreOffice, 그래픽 GIMP·Inkscape·Blender, 멀티미디어 Totem·VLC·Rhythmbox·Amarok·Audacity, 브라우저 Firefox·Konqueror |

### 단답형 연습

답은 맨 끝 **정답과 해설**에서 확인한다.

1. 현재 리눅스 배포판 대부분이 쓰는 X 서버 구현의 이름은? ______________
2. X 윈도우의 X 클라이언트가 X 프로토콜을 쓰도록 돕는 C 라이브러리는? ______________
3. xorg.conf에서 그래픽 카드와 드라이버를 정의하는 섹션은? ______________
4. startx가 내부적으로 호출해 X 서버를 띄우는 프로그램은? ______________
5. 원격 그래픽 로그인을 위해 디스플레이 매니저가 쓰는 프로토콜은? ______________
6. GNOME 2를 이어 가는 포크 데스크톱 환경은? ______________
7. X에 기본으로 포함된 가장 단순한 윈도우 매니저는? ______________
8. ssh로 X11 포워딩을 쓰려면 sshd_config에 어떤 설정이 필요한가? ______________
9. 오디오를 녹음·편집하는 X 응용 프로그램은? ______________
10. GNOME의 메일·일정 관리 프로그램은? ______________

## 책을 덮고 꺼내 보기

- X 윈도우는 MIT의 {{아테나}} 프로젝트에서 시작되었다.
- 모니터·키보드·마우스를 관리하는 쪽은 X {{서버}}다.
- DISPLAY 형식은 {{호스트:디스플레이.스크린}}이고, 디스플레이 0번은 TCP {{6000}} 포트다.
- 모든 호스트의 접속을 허용하는 명령은 {{xhost +}}다.
- 쿠키는 사용자 홈의 {{.Xauthority}} 파일에 저장된다.
- KDE의 툴킷은 {{Qt}}, GNOME의 툴킷은 {{GTK+}}다.

> [!FLASHCARD]
> Q: X 서버와 X 클라이언트의 역할은?
> A: X 서버는 사용자 앞에서 디스플레이·키보드·마우스를 관리하고 클라이언트 요청대로 그린다. X 클라이언트는 그리기를 요청하는 응용 프로그램(윈도우 매니저 포함)이며 원격 호스트에서 실행될 수도 있다.

> [!FLASHCARD]
> Q: X 윈도우의 세 가지 특징은?
> A: 네트워크 기반 클라이언트/서버 구조(네트워크 투명성), 하드웨어·OS 독립성, 정책이 아닌 메커니즘만 제공(창 모양은 윈도우 매니저 몫).

> [!FLASHCARD]
> Q: 디스플레이 매니저와 윈도우 매니저의 차이와 예는?
> A: 디스플레이 매니저는 그래픽 로그인 화면과 세션 시작(xdm, gdm, kdm, sddm, lightdm). 윈도우 매니저는 창 테두리·이동·크기 조절 관리(twm, Mutter, KWin, Xfwm, Openbox).

> [!FLASHCARD]
> Q: xhost와 xauth의 차이는?
> A: xhost는 X 서버에서 호스트 단위로 허용(그 호스트의 모든 사용자, `xhost +`는 전체 허용). xauth는 ~/.Xauthority의 MIT-MAGIC-COOKIE-1 쿠키로 사용자 단위 허용.

> [!FLASHCARD]
> Q: ssh -X를 쓰면 무엇이 자동으로 되는가?
> A: X 프로토콜이 SSH 암호화 터널로 전달되고, 원격 쪽 DISPLAY(예: localhost:10.0)와 xauth 쿠키가 자동 설정된다. 서버에 X11Forwarding yes 필요.

> [!FLASHCARD]
> Q: GIMP, Inkscape, Blender의 차이는?
> A: GIMP는 래스터(비트맵) 이미지 편집, Inkscape는 SVG 벡터 드로잉, Blender는 3D 모델링·애니메이션.

> [!FLASHCARD]
> Q: GNOME과 KDE의 대표 멀티미디어 프로그램은?
> A: GNOME — Totem(동영상), Rhythmbox(음악), Brasero(굽기). KDE — Amarok(음악), Kaffeine(동영상), K3b(굽기).

**다음으로 갈 기준:** X 서버·클라이언트 그림과 xhost·xauth 차이를 설명하고, 응용 프로그램 이름을 용도별로 나눌 수 있으면 다음 편으로 간다: [12편 · 인터넷 활용 (1) 네트워크 기초](/lectures/grade-mukhnzii/semester-certificate/subject-linux-master-2/lecture-12).

> [!PAGEBREAK]

## 정답과 해설

### 확인 문제 정답

1. **X 서버** — 사용자 앞(화면이 있는 쪽)에서 실행된다.
2. **`~/.xinitrc`** — 없으면 `/etc/X11/xinit/xinitrc`를 쓴다.
3. GNOME은 **GDM**, KDE는 **KDM**(Plasma 5부터 **SDDM**).
4. **윈도우 매니저(Window Manager)**.
5. **KDE**.
6. **6002** — 6000 + 디스플레이 번호 2.
7. **`xhost +`** — 보안상 위험하므로 시험용으로만 기억한다.
8. **`.Xauthority`** (`~/.Xauthority`).
9. 래스터: **GIMP**, 벡터(SVG): **Inkscape**.
10. **Calc**.

### 단답형 정답

1. **Xorg (X.Org 서버)**
2. **Xlib** (새 구현은 XCB)
3. **Device** 섹션
4. **xinit**
5. **XDMCP** (UDP 177)
6. **MATE**
7. **twm**
8. **`X11Forwarding yes`**
9. **Audacity**
10. **Evolution**
