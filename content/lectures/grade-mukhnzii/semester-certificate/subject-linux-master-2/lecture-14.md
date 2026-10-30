---
title: "14편 · 응용분야 — 클러스터·임베디드·가상화·클라우드·빅데이터"
description: "3과목 3장. 리눅스 클러스터(HPC·LVS·HA·하트비트), 임베디드 리눅스와 안드로이드·타이젠·AGL, 전가상화·반가상화와 하이퍼바이저·KVM·Xen·Docker, IaaS·PaaS·SaaS와 배포 모델, 5대 핵심 플랫폼, 빅데이터 3V·5V와 하둡 에코시스템을 정리합니다."
order: 14
published: true
duration: 90
tags: [리눅스마스터 2급, 자격증, 3과목, 클러스터, 임베디드, 가상화, 클라우드, 빅데이터, 하둡]
objectives:
  - 고계산(HPC)·부하 분산(LVS)·고가용성(HA) 클러스터를 구분하고 하트비트·페일오버를 설명한다.
  - 임베디드 리눅스의 특징과 안드로이드·타이젠·webOS·AGL 같은 리눅스 기반 플랫폼을 짝짓는다.
  - 전가상화·반가상화, 하이퍼바이저 타입 1·2, KVM·Xen·VirtualBox·Docker를 구분한다.
  - IaaS·PaaS·SaaS와 배포 모델, 빅데이터 3V·5V, 하둡의 HDFS·MapReduce·YARN과 에코시스템을 말한다.
---

## 학습 경로 · 3과목 3장

[← 13편 · 인터넷 활용 (2) 네트워크 서비스와 인터페이스](/lectures/grade-mukhnzii/semester-certificate/subject-linux-master-2/lecture-13) · [처음으로: 0 · 시험 지도](/lectures/grade-mukhnzii/semester-certificate/subject-linux-master-2/lecture-00)

**범위:** 3과목 3장 "응용분야" — 리눅스 클러스터링, 임베디드 리눅스, 리눅스 가상화, 클라우드 서비스 모델, 5대 핵심 플랫폼, 빅데이터, 하둡, 리눅스 기반 임베디드 및 특화 시스템.

**형광펜 읽는 법:** ==yellow:노랑== 핵심 정의·결론 · ==red:빨강== 시험에서 헷갈리는 구분·함정 · ==blue:파랑== 외워야 할 순서·목록

> [!EXAM]
> **이 장의 핵심 질문:** 리눅스는 서버 여러 대를 하나처럼 묶고(클러스터), 작은 기기 안에 들어가고(임베디드), 한 대를 여러 대처럼 쪼개고(가상화), 그 자원을 빌려 주고(클라우드), 거대한 데이터를 나눠 처리하는(하둡) 데 어떻게 쓰이는가?
>
> **전체 흐름:** ==blue:묶기(클러스터) → 작게(임베디드) → 쪼개기(가상화·컨테이너) → 빌려 주기(클라우드) → 큰 데이터(빅데이터·하둡) → 특화 시스템(TV·자동차·IoT)==

---

## 단원 도입

| 출제 포인트 | 빈도 | 이렇게 나온다 |
|---|:---:|---|
| 클러스터 종류(HPC·LB·HA), LVS, 하트비트 | ★★★ | 설명 → 클러스터 유형, "장애 시 대기 서버가 넘겨받음" |
| 전가상화 vs 반가상화, 하이퍼바이저 타입 | ★★★ | "게스트 OS 수정이 필요한 방식", "호스트 OS 위에서 동작하는 것" |
| IaaS·PaaS·SaaS | ★★★ | 예시 서비스 → 모델 이름 |
| 하둡 구성(HDFS·MapReduce·YARN)과 에코시스템 | ★★★ | "SQL과 비슷한 질의 도구", "분산 코디네이터" |
| 빅데이터 3V·5V | ★★ | 특징이 아닌 것 고르기 |
| KVM·Xen·VirtualBox·Docker 특징 | ★★ | 커널 모듈 기반, 컨테이너 vs VM |
| 임베디드 리눅스 특징, 안드로이드·타이젠·AGL | ★★ | 리눅스 기반이 아닌 것 고르기 |
| 클라우드 배포 모델, 오픈스택 | ★ | 퍼블릭·프라이빗·하이브리드 |

> [!PAGEBREAK]

## PART 1 · 클러스터와 임베디드

## 1. 리눅스 클러스터링

### 핵심 필기

> [!CONCEPT]
> **클러스터(Cluster)** — 여러 대의 컴퓨터(노드)를 고속 네트워크로 묶어 ==하나의 시스템처럼== 동작하게 하는 구성. 성능(계산), 확장성(분산), 가용성(무중단)을 얻는다.

| 유형 | 목적 | 동작 | 대표 기술 |
|---|---|---|---|
| **고계산 클러스터 (HPC)** | 계산 성능 | 큰 계산을 여러 노드가 ==병렬로== 나눠 처리 | ==베오울프(Beowulf)==, MPI, PVM, 슈퍼컴퓨터 |
| **부하 분산 클러스터 (Load Balancing)** | 처리량·확장성 | 앞단의 로드밸런서가 요청을 여러 서버에 ==나눠 줌== | ==LVS(Linux Virtual Server)==, ipvsadm, HAProxy, L4 스위치 |
| **고가용성 클러스터 (HA)** | 무중단 | 주(Active) 서버가 죽으면 대기(Standby) 서버가 ==넘겨받음(Fail-over)== | ==Heartbeat==, Pacemaker, Corosync, keepalived(VRRP) |

**LVS(Linux Virtual Server) 구성**

- **로드밸런서(Director)**: 가상 IP(VIP)로 요청을 받아 실제 서버로 넘긴다. 커널의 IPVS 모듈, 관리 명령 `ipvsadm`.
- **실제 서버(Real Server)**: 요청을 처리하는 서버들.
- 전달 방식: **LVS-NAT**(디렉터가 주소 변환, 응답도 디렉터 경유), **LVS-DR**(Direct Routing, 응답은 실제 서버가 클라이언트로 직접), **LVS-TUN**(IP 터널링, 원격지 서버).
- 스케줄링: 라운드 로빈(rr), 가중 라운드 로빈(wrr), 최소 연결(lc), 가중 최소 연결(wlc), 해시 방식(sh·dh) 등.

**HA 용어**

| 용어 | 뜻 |
|---|---|
| **하트비트(Heartbeat)** | 노드끼리 주기적으로 주고받는 ==살아 있음 신호==. 끊기면 장애로 판단 |
| **페일오버(Fail-over)** | 장애 시 서비스(가상 IP·디스크)를 대기 노드로 넘김 |
| **페일백(Fail-back)** | 원래 서버가 복구되면 서비스를 되돌림 |
| **스플릿 브레인(Split-brain)** | 하트비트 선만 끊겨 두 노드가 서로 죽었다고 보고 ==동시에 주 노드가 되는== 사고 → 공유 디스크 손상 위험. STONITH(문제 노드 강제 차단)로 막는다 |
| 공유 스토리지 | SAN·NAS·DRBD(네트워크 기반 RAID 1 복제)로 두 노드가 같은 데이터를 봄 |

> [!TRAP]
> ==red:HPC는 "빠르게 계산", 부하 분산은 "많이 처리", HA는 "멈추지 않게"==다. 베오울프 = HPC, LVS = 부하 분산, 하트비트 = HA로 짝지어 외운다. 하트비트는 부하를 나누는 기술이 아니다.

> [!EXAMPLE]
> **쇼핑몰 서버 구성 (학습용 예시)**
>
> 접속이 폭주하는 웹 서버 4대 앞에 LVS 디렉터를 두고 wlc로 요청을 나눈다(부하 분산). 디렉터가 하나뿐이면 그게 고장 났을 때 전체가 멈추므로, 디렉터를 두 대로 만들고 하트비트로 서로 감시해 주 디렉터가 죽으면 대기 디렉터가 VIP를 넘겨받게 한다(고가용성). 두 유형은 이렇게 함께 쓰인다.

## 2. 임베디드 리눅스

### 핵심 필기

- **임베디드 시스템:** 특정 목적의 기능을 수행하도록 하드웨어와 소프트웨어를 묶어 기기 안에 넣은 시스템(셋톱박스, 공유기, 스마트TV, 차량 인포테인먼트…).

| 장점 | 단점 |
|---|---|
| 커널·소스가 공개되어 ==로열티 없이== 수정·배포 가능 (GPL 준수 필요) | 범용 RTOS(VxWorks 등)보다 ==실시간성이 약함== (RT 패치 PREEMPT_RT로 보완) |
| ==다양한 CPU 아키텍처== 지원 (ARM, MIPS, PowerPC, x86…) | 상용 RTOS보다 커널·메모리 요구량이 큰 편 |
| 안정적이고 강력한 ==네트워킹== 스택 | 개발 도구·지원이 업체마다 제각각 |
| 모듈식 커널이라 필요한 기능만 넣어 작게 만들 수 있음 | |

**구성과 개발 도구**

| 요소 | 설명 |
|---|---|
| 부트로더 | **U-Boot**(가장 널리 씀), RedBoot |
| 커널 | 대상 보드에 맞춰 설정·빌드한 리눅스 커널 |
| 루트 파일 시스템 | **BusyBox**(ls·sh 등 수많은 유닉스 명령을 ==하나의 작은 실행 파일==에 담음) |
| 툴체인 | 개발 PC(x86)에서 대상 CPU(ARM)용 바이너리를 만드는 ==크로스 컴파일러== |
| 빌드 시스템 | **Yocto Project**·OpenEmbedded(리눅스 재단 주도, 맞춤 배포판 생성), **Buildroot** |

**리눅스 기반 모바일·임베디드 플랫폼**

| 플랫폼 | 주도 | 쓰임 |
|---|---|---|
| **안드로이드(Android)** | 구글 (OHA) | 스마트폰·태블릿·TV·자동차. ==리눅스 커널== 위에 ART 런타임·자바/코틀린 프레임워크 |
| **타이젠(Tizen)** | 삼성·인텔, 리눅스 재단 | 삼성 스마트TV, 웨어러블, 가전 |
| **webOS** | 팜 → HP → ==LG== | LG 스마트TV |
| **AGL**(Automotive Grade Linux) | 리눅스 재단 (토요타 등) | ==자동차== 인포테인먼트(IVI)·계기판 |
| GENIVI | 자동차 업계 연합 | 차량 IVI 미들웨어 표준 |
| MeeGo·Maemo·Moblin | 노키아·인텔 | 타이젠의 전신 계보 |
| Ubuntu Core·Raspberry Pi OS | 캐노니컬·라즈베리파이 재단 | IoT·교육용 보드 |
| OpenWrt | 커뮤니티 | 공유기(라우터) 펌웨어 |

> [!TRAP]
> ==red:iOS(애플), 윈도우 CE·Windows IoT, VxWorks, 아두이노 펌웨어는 리눅스 기반이 아니다.== "리눅스 기반이 아닌 것"으로 자주 섞인다. 아두이노는 운영체제 없는 마이크로컨트롤러 보드, 라즈베리파이는 리눅스를 올리는 싱글 보드 컴퓨터다.

> [!CHECK]
> **1.** 주 서버의 장애를 하트비트로 감지해 대기 서버가 서비스를 넘겨받는 클러스터 유형은?
>
> **2.** 수많은 유닉스 명령을 하나의 작은 실행 파일로 제공해 임베디드 루트 파일 시스템에 쓰는 프로그램은?
>
> **3.** LG 스마트TV에 쓰이는 리눅스 기반 플랫폼은?

> [!PAGEBREAK]

## PART 2 · 가상화와 클라우드

## 3. 리눅스 가상화

### 핵심 필기

> [!CONCEPT]
> **가상화(Virtualization)** — 한 대의 물리 자원(CPU·메모리·디스크·네트워크)을 ==여러 개의 논리적 자원처럼== 나눠 쓰거나, 여러 자원을 하나처럼 묶는 기술. 서버 통합, 자원 활용률 향상, 격리, 빠른 배포가 목적이다.

**전가상화 vs 반가상화**

| 구분 | **전가상화 (Full Virtualization)** | **반가상화 (Para-virtualization)** |
|---|---|---|
| 게스트 OS | ==수정 없이== 그대로 설치 (윈도우도 가능) | 게스트 커널을 ==수정==해야 함 |
| 방식 | 하드웨어 전체를 가상화. 특권 명령은 하이퍼바이저가 가로채 처리(바이너리 번역) 또는 CPU 지원(Intel VT-x, AMD-V) 이용 | 게스트가 하이퍼바이저에 직접 요청(==하이퍼콜, Hypercall==) |
| 성능 | 전통적으로 느림 (CPU 지원으로 많이 개선) | 오버헤드가 적어 빠름 |
| 예 | VMware, VirtualBox, KVM, Xen의 HVM 모드 | ==Xen== (PV 모드) |

**하이퍼바이저(Hypervisor, VMM) 유형**

| 유형 | 위치 | 특징 | 예 |
|---|---|---|---|
| **타입 1 (Native, Bare-metal)** | ==하드웨어 바로 위== | 호스트 OS가 없어 오버헤드 적음, 서버용 | Xen, ==KVM==, VMware ESXi, Microsoft Hyper-V |
| **타입 2 (Hosted)** | ==호스트 OS 위==의 응용 프로그램 | 설치가 쉬움, 데스크톱·테스트용, 느림 | ==VirtualBox==, VMware Workstation·Player, Parallels, QEMU(에뮬레이터) |

[![왼쪽부터 타입 1 하이퍼바이저, 타입 2 하이퍼바이저, 컨테이너 세 개의 쌓기 그림. 타입 1은 하드웨어 위에 하이퍼바이저와 게스트 OS, 타입 2는 하드웨어와 호스트 OS 위에 하이퍼바이저와 게스트 OS, 컨테이너는 하드웨어와 호스트 OS 커널 위에 컨테이너 엔진과 앱이 있고 게스트 OS가 없다](/materials/diagrams/lm2-l14a-hypervisor.svg)](/materials/diagrams/lm2-l14a-hypervisor.svg)

*그림 14-1 · 하이퍼바이저 타입 1·2와 컨테이너 — 누르면 원본 크기로 열린다.*

> [!NOTE]
> - **읽는 순서:** 세 기둥 모두 맨 아래 하드웨어에서 위로 읽는다. 검은 칸(하이퍼바이저·컨테이너 엔진)이 어디에 끼어 있는지 비교한다.
> - **핵심:** 타입 1은 하드웨어 바로 위, 타입 2는 호스트 OS 위. 컨테이너는 ==게스트 OS 층이 없고 호스트 커널을 공유==한다.
> - **시험 포인트:** ==red:VirtualBox = 타입 2, Xen·ESXi·KVM = 타입 1==, 컨테이너는 가볍고 빠르지만 호스트와 다른 커널(예: 리눅스 위 윈도우)은 못 돌린다.

**대표 가상화 솔루션**

| 솔루션 | 특징 |
|---|---|
| **KVM** (Kernel-based Virtual Machine) | ==리눅스 커널 모듈==(`kvm.ko` + `kvm-intel` 또는 `kvm-amd`)로 커널 자체를 하이퍼바이저로 만든다. ==커널 2.6.20부터 포함==. CPU 가상화 지원(VT-x·AMD-V) ==필수==. 장치 에뮬레이션은 QEMU, 관리는 libvirt(`virsh`, `virt-manager`) |
| **Xen** | 케임브리지 대학에서 시작한 타입 1. 관리용 ==Dom0==와 게스트 ==DomU==. 반가상화(PV)와 전가상화(HVM) 모두 지원 |
| **VirtualBox** | 오라클(이노텍 → 썬 → 오라클), 타입 2, 데스크톱용 |
| **VMware** | Workstation·Player(타입 2), ESXi(타입 1), vSphere(관리) |
| **QEMU** | 다른 CPU 아키텍처도 흉내 내는 ==에뮬레이터==. KVM과 결합하면 하드웨어 가속 |

```bash
$ grep -c -E 'vmx|svm' /proc/cpuinfo    # 0보다 크면 CPU가 VT-x(vmx)·AMD-V(svm) 지원
8
$ lsmod | grep kvm                       # KVM 모듈 적재 확인 (출력 예시)
kvm_intel             409600  0
kvm                  1368064  1 kvm_intel
$ virsh list --all                       # libvirt로 가상 머신 목록
 Id   Name     State
-------------------------
 1    web01    running
 -    db01     shut off
```

### 컨테이너 — OS 수준 가상화

| 구분 | 가상 머신(VM) | **컨테이너** |
|---|---|---|
| 가상화 대상 | 하드웨어 | ==운영체제(커널 공유)== |
| 게스트 OS | 각 VM마다 있음 | 없음 (앱 + 라이브러리만) |
| 크기·시작 속도 | GB 단위, 분 단위 | MB 단위, 초 단위 |
| 격리 | 강함 | 상대적으로 약함 (커널 공유) |
| 기반 기술 | 하이퍼바이저 | 리눅스 커널의 ==cgroups(자원 제한)·namespaces(격리)== |
| 예 | KVM, Xen, VirtualBox | LXC, ==Docker==, Podman |

- **Docker:** 이미지(읽기 전용 템플릿) → 컨테이너(실행 인스턴스). 이미지는 `Dockerfile`로 만들고 Docker Hub(레지스트리)에서 받는다. 여러 컨테이너를 배치·관리하는 오케스트레이션 도구는 **쿠버네티스(Kubernetes)**.

```bash
$ docker pull nginx                     # 이미지 내려받기
$ docker images                         # 로컬 이미지 목록
$ docker run -d -p 8080:80 --name web nginx   # 백그라운드(-d) 실행, 호스트 8080 → 컨테이너 80
$ docker ps                             # 실행 중 컨테이너 (-a: 멈춘 것 포함)
$ docker exec -it web /bin/bash         # 실행 중 컨테이너 안에서 셸
$ docker stop web && docker rm web      # 중지 후 삭제 (이미지 삭제는 docker rmi)
```

> [!TRAP]
> ==red:반가상화는 게스트 OS를 수정해야 하고, 전가상화는 수정하지 않는다.== 반대로 묻는 문장이 단골이다. KVM은 "리눅스 커널에 포함된 모듈"이라는 점, 컨테이너는 "게스트 OS가 없다"는 점도 자주 나온다.

> [!CHECK]
> **4.** 게스트 OS 커널을 수정해 하이퍼콜로 하이퍼바이저와 통신하는 가상화 방식과 대표 솔루션은?
>
> **5.** 호스트 OS 위에 응용 프로그램처럼 설치하는 하이퍼바이저 유형과 예 하나는?
>
> **6.** 컨테이너가 자원 제한과 격리에 쓰는 리눅스 커널 기능 두 가지는?

## 4. 클라우드 서비스 모델

### 핵심 필기

> [!CONCEPT]
> **클라우드 컴퓨팅** — 서버·스토리지·플랫폼·소프트웨어를 인터넷으로 ==필요한 만큼 빌려 쓰고 쓴 만큼 내는== 서비스. NIST가 꼽는 5대 특징: ==blue:주문형 셀프서비스 · 광대역 네트워크 접근 · 자원 풀링 · 신속한 탄력성 · 측정 가능한 서비스==.

| 모델 | 제공하는 것 | 사용자가 관리하는 것 | 예 |
|---|---|---|---|
| **IaaS** (Infrastructure) | 서버·스토리지·네트워크 등 ==인프라(가상 머신)== | OS, 미들웨어, 런타임, 앱, 데이터 | AWS EC2, Google Compute Engine, ==OpenStack== |
| **PaaS** (Platform) | OS·런타임·DB 등 ==개발·실행 플랫폼== | 앱과 데이터 | Google App Engine, Heroku, Cloud Foundry, Red Hat OpenShift |
| **SaaS** (Software) | 완성된 ==소프트웨어== | (설정·데이터 정도) | Gmail, Google Docs, Microsoft 365, Salesforce, Dropbox |

[![온프레미스, IaaS, PaaS, SaaS 네 기둥에 네트워크·스토리지·서버·가상화·OS·미들웨어·런타임·데이터·애플리케이션 층을 쌓고, 사용자가 관리하는 층과 제공자가 관리하는 층을 색으로 나눈 그림](/materials/diagrams/lm2-l14b-cloud-models.svg)](/materials/diagrams/lm2-l14b-cloud-models.svg)

*그림 14-2 · 누가 어디까지 관리하나 — IaaS·PaaS·SaaS — 누르면 원본 크기로 열린다.*

> [!NOTE]
> - **읽는 순서:** 왼쪽 온프레미스(전부 내가 관리)에서 오른쪽 SaaS로 갈수록 검은 칸(제공자 관리)이 아래에서 위로 차오른다.
> - **핵심:** IaaS는 ==가상화까지==, PaaS는 ==런타임까지==, SaaS는 ==애플리케이션까지== 제공자가 맡는다.
> - **시험 포인트:** "개발자가 코드만 올리면 실행 환경은 제공" = PaaS, "가상 서버를 빌려 OS를 직접 설치" = IaaS.

**배포 모델**

| 모델 | 뜻 |
|---|---|
| **퍼블릭(Public)** | 클라우드 업체가 여러 고객에게 공개적으로 제공 (AWS, Azure, GCP) |
| **프라이빗(Private)** | 한 기관이 자체 전용으로 구축·운영 (예: 사내 OpenStack) |
| **하이브리드(Hybrid)** | 퍼블릭 + 프라이빗(또는 온프레미스)을 연동 |
| 커뮤니티(Community) | 목적이 같은 여러 기관이 공동으로 사용 |

- **오픈스택(OpenStack):** IaaS를 구축하는 대표 오픈소스. 구성 요소 ==Nova==(컴퓨트), ==Swift==(오브젝트 스토리지), ==Cinder==(블록 스토리지), ==Neutron==(네트워크), ==Keystone==(인증), ==Glance==(이미지), ==Horizon==(웹 대시보드). 그 밖에 CloudStack, Eucalyptus.
- 그 밖의 as-a-Service: DaaS(데스크톱), BaaS(백엔드), FaaS(함수 단위, 서버리스 — AWS Lambda).

> [!TRAP]
> ==red:OpenStack은 IaaS 플랫폼, Google App Engine은 PaaS, Gmail은 SaaS.== "IaaS에서 OS는 사용자가 관리"한다. Nova(컴퓨트)와 Swift(스토리지)를 바꿔 묻기도 한다.

## 5. 5대 핵심 플랫폼

> [!CAUTION]
> 교재·강의에 따라 "5대 핵심 플랫폼"의 목록과 이름이 조금씩 다르다. 여기서는 가장 흔히 소개되는 4차 산업혁명 핵심 기술 묶음 ==ICBM + AI==를 정리했다. **확인 필요:** 응시 전 사용하는 교재·공식 출제 기준표의 표현을 대조한다.

| 플랫폼 | 뜻 | 리눅스와의 관계 |
|---|---|---|
| **I · 사물인터넷 (IoT)** | 사물에 센서·통신을 달아 데이터를 주고받음 | 게이트웨이·기기에 임베디드 리눅스(라즈베리파이, Ubuntu Core) |
| **C · 클라우드 (Cloud)** | 인프라·플랫폼·소프트웨어를 서비스로 제공 | 클라우드 서버 OS의 대다수가 리눅스, OpenStack·KVM |
| **B · 빅데이터 (Big Data)** | 대용량·고속·다양한 데이터를 수집·분석 | 하둡·스파크 클러스터가 리눅스 위에서 동작 |
| **M · 모바일 (Mobile)** | 스마트폰·태블릿 중심 서비스 | 안드로이드가 리눅스 커널 기반 |
| **AI · 인공지능** | 학습·추론으로 지능적 판단 | 학습 서버·GPU 클러스터 대부분이 리눅스 |

> [!CHECK]
> **7.** 가상 서버를 빌려 OS부터 직접 설치·관리하는 클라우드 서비스 모델은?
>
> **8.** 오픈스택에서 가상 머신(컴퓨트)을 관리하는 구성 요소와 인증을 맡는 구성 요소는?

> [!PAGEBREAK]

## PART 3 · 빅데이터와 하둡, 특화 시스템

## 6. 빅데이터

### 핵심 필기

| 특징 | 뜻 |
|---|---|
| **Volume (규모)** | 데이터 양이 TB·PB 이상으로 거대 |
| **Velocity (속도)** | 생성·수집·처리 ==속도==가 빠름 (실시간·스트리밍) |
| **Variety (다양성)** | 정형·반정형·==비정형==이 섞임 |
| Veracity (정확성) | 데이터의 품질·신뢰성 |
| Value (가치) | 분석으로 얻는 비즈니스 가치 |

- ==blue:3V = Volume · Velocity · Variety==, 여기에 ==blue:Veracity · Value==를 더하면 5V. (교재에 따라 Variability·Visualization을 넣어 7V로도 말한다.)
- 처리 단계: 수집(Flume, Sqoop, Kafka) → 저장(HDFS, NoSQL) → 처리(MapReduce, Spark) → 분석(Hive, R, 머신러닝) → 시각화.

> [!TRAP]
> ==red:3V는 Volume·Velocity·Variety==다. "Validity", "Virtualization" 같은 비슷한 V 단어를 끼워 넣어 "아닌 것"을 고르게 한다.

## 7. 하둡(Hadoop)

### 핵심 필기

> [!CONCEPT]
> **하둡** — 값싼 서버 여러 대를 묶어 대용량 데이터를 ==분산 저장(HDFS)하고 분산 처리(MapReduce)==하는 아파치 오픈소스 프레임워크. ==자바==로 작성, 더그 커팅(Doug Cutting)이 구글의 GFS·MapReduce 논문을 바탕으로 만들었다.

| 구성 | 역할 |
|---|---|
| **HDFS** (Hadoop Distributed File System) | 분산 파일 시스템. 파일을 큰 ==블록(기본 128MB, 하둡 1은 64MB)==으로 나눠 여러 노드에 ==기본 3개 복제== |
| └ **네임노드(NameNode)** | 마스터. 파일 이름·블록 위치 같은 ==메타데이터== 관리 |
| └ **데이터노드(DataNode)** | 슬레이브. 실제 블록 저장, 네임노드에 하트비트·블록 보고 |
| └ 보조 네임노드(Secondary NameNode) | 메타데이터 체크포인트(병합) 담당 — ==대기 네임노드가 아님== |
| **MapReduce** | 분산 처리 모델: ==blue:Map(키-값으로 쪼개 처리) → Shuffle·Sort → Reduce(모아서 합침)== |
| **YARN** (Yet Another Resource Negotiator) | ==하둡 2부터== 자원 관리·작업 스케줄링 담당. ResourceManager(마스터), NodeManager(노드별), ApplicationMaster(작업별) |

- 하둡 1에서는 MapReduce가 JobTracker·TaskTracker로 자원 관리까지 했지만, 하둡 2에서 그 일을 **YARN**으로 분리해 MapReduce 외의 엔진(Spark 등)도 같은 클러스터에서 돌 수 있게 됐다.

[![하둡 클러스터 그림. 위쪽 마스터 노드에 네임노드와 YARN 리소스매니저가 있고, 아래 데이터노드 세 대에 블록 A, B, C가 각각 세 번씩 복제되어 흩어져 있으며 각 노드에 노드매니저가 있다. 파일이 128MB 블록으로 쪼개져 들어오는 흐름과 하트비트 점선이 있다](/materials/diagrams/lm2-l14c-hadoop.svg)](/materials/diagrams/lm2-l14c-hadoop.svg)

*그림 14-3 · HDFS와 YARN — 누르면 원본 크기로 열린다.*

> [!NOTE]
> - **읽는 순서:** 왼쪽 위 큰 파일이 블록으로 잘려 들어오고, 마스터(검은 상자)의 네임노드가 위치만 기록한 뒤 블록은 아래 데이터노드 셋에 나뉘어 저장된다.
> - **핵심:** 같은 블록(A·B·C)이 ==서로 다른 노드에 3개씩== 있어 한 대가 죽어도 데이터가 남는다. 처리 자원은 리소스매니저 ↔ 노드매니저(YARN)가 맡는다.
> - **시험 포인트:** ==red:메타데이터 = 네임노드, 실제 데이터 = 데이터노드==, 자원 관리 = YARN.

**하둡 에코시스템**

| 도구 | 한 줄 정리 |
|---|---|
| **Hive** | ==SQL과 비슷한 HiveQL==로 하둡 데이터를 질의 (페이스북 개발) |
| **Pig** | 스크립트 언어 Pig Latin으로 데이터 흐름 처리 (야후 개발) |
| **HBase** | HDFS 위의 ==컬럼 기반 NoSQL DB== (구글 BigTable 모델) |
| **ZooKeeper** | 분산 시스템의 ==코디네이터==(설정·동기화·리더 선출) |
| **Sqoop** | ==RDBMS ↔ HDFS== 데이터 이동 |
| **Flume** | 여러 곳의 ==로그== 수집·전송 |
| **Kafka** | 대용량 실시간 메시지(이벤트) 스트리밍 |
| **Oozie** | 하둡 작업 ==워크플로== 스케줄러 |
| **Mahout** | 하둡 기반 ==머신러닝== 라이브러리 |
| **Spark** | ==인메모리== 분산 처리 엔진 (MapReduce보다 빠름) |
| Ambari | 하둡 클러스터 설치·관리·모니터링 웹 도구 |
| Avro | 데이터 직렬화 |

```bash
$ hdfs dfs -mkdir -p /user/kim/input          # HDFS에 디렉터리 생성
$ hdfs dfs -put access.log /user/kim/input    # 로컬 → HDFS
$ hdfs dfs -ls /user/kim/input                # 목록 (hadoop fs -ls 도 같은 뜻)
$ hdfs dfs -get /user/kim/output/part-r-00000 .   # HDFS → 로컬
```

> [!TRAP]
> ==red:Hive는 SQL 질의, HBase는 NoSQL 저장소, ZooKeeper는 코디네이터, Sqoop은 RDBMS 연동, Flume은 로그 수집.== 이름이 비슷한 Hive·HBase를 바꿔 묻는다. 보조 네임노드는 장애 대비 대기 서버가 아니다.

> [!CHECK]
> **9.** HDFS에서 파일 블록의 위치 같은 메타데이터를 관리하는 노드는?
>
> **10.** 관계형 DB와 HDFS 사이에서 데이터를 가져오고 내보내는 하둡 에코시스템 도구는?

## 8. 리눅스 기반 임베디드·특화 시스템

| 분야 | 리눅스 활용 예 |
|---|---|
| **스마트TV** | LG ==webOS==, 삼성 ==타이젠==, 구글 TV(안드로이드 TV) |
| **자동차** | ==AGL(Automotive Grade Linux)==, GENIVI, 안드로이드 오토모티브 OS — 인포테인먼트(IVI)·계기판 |
| **스마트폰·웨어러블** | 안드로이드, 타이젠(갤럭시 워치 초기 모델), Wear OS(안드로이드 기반) |
| **IoT** | 라즈베리파이 + Raspberry Pi OS, Ubuntu Core, Yocto로 만든 맞춤 리눅스 |
| **네트워크 장비** | OpenWrt(공유기), 리눅스 기반 NAS·방화벽 |
| **드론·로봇** | Dronecode(리눅스 재단 드론 프로젝트), ROS(로봇 운영 미들웨어, 주로 우분투 위) |
| **슈퍼컴퓨터** | TOP500 슈퍼컴퓨터 ==전부==가 리눅스 계열 OS |

> [!NOTE]
> 리눅스 재단(Linux Foundation)은 이런 특화 분야마다 협업 프로젝트를 운영한다 — 자동차는 AGL, 임베디드 빌드는 Yocto, 클라우드 네이티브는 CNCF(쿠버네티스), IoT는 EdgeX Foundry. 시험에서는 "자동차 = AGL", "TV = webOS·타이젠" 짝짓기가 가장 자주 나온다.

> [!PAGEBREAK]

## 실전 문제

> [!QUIZ]
> 다음 설명에 해당하는 클러스터 유형은? "두 대의 서버 중 한 대가 서비스를 하고, 다른 한 대는 하트비트로 상태를 감시하다가 장애가 발생하면 서비스를 넘겨받는다."
>
> **A.** 고계산 클러스터(HPC)
>
> **B.** 부하 분산 클러스터
>
> **C.** 고가용성 클러스터(HA)
>
> **D.** 베오울프 클러스터

> [!HINT 1]
> 목적이 "빠르게"나 "많이"가 아니라 "멈추지 않게"다.

> [!ANSWER]
> **C.** Active-Standby와 페일오버는 고가용성(HA) 클러스터다. 베오울프는 HPC의 대표 예다.

> [!QUIZ]
> 반가상화(Para-virtualization)에 대한 설명으로 옳은 것은?
>
> **A.** 게스트 OS를 수정하지 않고 그대로 설치한다.
>
> **B.** 게스트 OS 커널을 수정하여 하이퍼콜로 하이퍼바이저와 통신한다.
>
> **C.** 대표적인 솔루션은 VirtualBox다.
>
> **D.** 호스트 OS의 커널을 공유하므로 게스트 OS가 필요 없다.

> [!HINT 1]
> "반"가상화는 게스트가 자기가 가상 환경에 있다는 걸 알고 협조한다.

> [!ANSWER]
> **B.** A는 전가상화, C의 VirtualBox는 타입 2 전가상화 도구, D는 컨테이너 설명이다. 반가상화의 대표는 Xen이다.

> [!QUIZ]
> 다음 중 호스트 운영체제 위에서 응용 프로그램처럼 동작하는 타입 2(Hosted) 하이퍼바이저는?
>
> **A.** VMware ESXi
>
> **B.** Xen
>
> **C.** Microsoft Hyper-V
>
> **D.** VirtualBox

> [!HINT 1]
> 내 노트북 윈도우에 "프로그램 설치"하듯 까는 것.

> [!ANSWER]
> **D.** VirtualBox(와 VMware Workstation)는 타입 2다. ESXi, Xen, Hyper-V는 하드웨어 위에서 직접 동작하는 타입 1이다.

> [!QUIZ]
> KVM에 대한 설명으로 틀린 것은?
>
> **A.** 리눅스 커널 모듈 형태로 동작한다.
>
> **B.** Intel VT-x나 AMD-V 같은 CPU 가상화 지원이 필요하다.
>
> **C.** 장치 에뮬레이션에 QEMU를 함께 사용한다.
>
> **D.** 게스트 OS 커널을 반드시 수정해야 하는 반가상화 전용 솔루션이다.

> [!HINT 1]
> KVM 위에는 윈도우도 수정 없이 설치할 수 있다.

> [!ANSWER]
> **D.** KVM은 CPU 지원을 이용한 전가상화 방식이다. 성능 향상을 위해 virtio 같은 반가상화 드라이버를 쓸 수는 있지만, 게스트 커널 수정이 필수는 아니다.

> [!QUIZ]
> 개발자가 코드만 올리면 운영체제·런타임·미들웨어 같은 실행 환경은 업체가 제공·관리하는 클라우드 서비스 모델은?
>
> **A.** IaaS
>
> **B.** PaaS
>
> **C.** SaaS
>
> **D.** On-premise

> [!HINT 1]
> 제공하는 것이 "플랫폼"이다.

> [!ANSWER]
> **B.** PaaS다(Google App Engine, Heroku). IaaS는 OS부터 사용자가 관리하고, SaaS는 완성된 소프트웨어를 쓴다.

> [!QUIZ]
> 빅데이터의 3V에 해당하지 않는 것은?
>
> **A.** Volume
>
> **B.** Velocity
>
> **C.** Variety
>
> **D.** Virtualization

> [!HINT 1]
> 규모·속도·다양성.

> [!ANSWER]
> **D.** 3V는 Volume·Velocity·Variety다. 5V는 여기에 Veracity·Value를 더한다.

> [!QUIZ]
> 하둡 에코시스템 구성 요소와 설명의 연결이 틀린 것은?
>
> **A.** Hive — SQL과 유사한 언어로 데이터를 질의
>
> **B.** ZooKeeper — 분산 환경의 설정·동기화를 관리하는 코디네이터
>
> **C.** Sqoop — 여러 서버의 로그를 실시간으로 수집
>
> **D.** HBase — HDFS 기반 컬럼형 NoSQL 데이터베이스

> [!HINT 1]
> 로그 수집은 물 흐르듯 — Flume.

> [!ANSWER]
> **C.** Sqoop은 RDBMS와 HDFS 사이 데이터 전송 도구다. 로그 수집은 Flume이다.

> [!QUIZ]
> 다음 중 리눅스 커널 기반이 아닌 플랫폼은?
>
> **A.** Android
>
> **B.** Tizen
>
> **C.** iOS
>
> **D.** AGL(Automotive Grade Linux)

> [!HINT 1]
> 애플의 모바일 OS는 다윈(XNU) 커널을 쓴다.

> [!ANSWER]
> **C.** iOS는 애플의 XNU(다윈) 커널 기반이다. 안드로이드·타이젠·AGL은 모두 리눅스 커널을 쓴다.

> [!PAGEBREAK]

## 단원 마무리

| 주제 | 꼭 남길 한 줄 |
|---|---|
| 클러스터 | HPC(베오울프·병렬 계산) · 부하 분산(LVS·ipvsadm) · HA(하트비트·페일오버, 스플릿 브레인 주의) |
| 임베디드 | 로열티 없음·다양한 CPU·강한 네트워킹 / 실시간성 약함, U-Boot·BusyBox·크로스 컴파일·Yocto |
| 플랫폼 | 안드로이드(구글), 타이젠(삼성), webOS(LG TV), AGL(자동차) |
| 가상화 | 전가상화(게스트 수정 없음) vs 반가상화(게스트 수정·하이퍼콜·Xen) |
| 하이퍼바이저 | 타입 1(하드웨어 위: Xen·KVM·ESXi·Hyper-V) vs 타입 2(호스트 OS 위: VirtualBox·Workstation) |
| 컨테이너 | 커널 공유, cgroups·namespaces, Docker·LXC, 쿠버네티스로 관리 |
| 클라우드 | IaaS(인프라·OpenStack·EC2) · PaaS(플랫폼·App Engine) · SaaS(소프트웨어·Gmail), 퍼블릭·프라이빗·하이브리드 |
| 빅데이터 | ==blue:3V Volume·Velocity·Variety + Veracity·Value = 5V== |
| 하둡 | HDFS(네임노드·데이터노드, 128MB 블록·3복제) · MapReduce(Map→Reduce) · YARN(하둡 2) |
| 에코시스템 | Hive(SQL) · HBase(NoSQL) · ZooKeeper(코디네이터) · Sqoop(RDBMS) · Flume(로그) · Spark(인메모리) |

## 책을 덮고 꺼내 보기

- 리눅스 가상 서버 기반 부하 분산 클러스터를 {{LVS}}라 하고, 관리 명령은 {{ipvsadm}}이다.
- 노드끼리 살아 있음을 확인하는 주기 신호를 {{하트비트}}라 한다.
- 게스트 OS를 수정하지 않는 가상화는 {{전가상화}}, 수정하는 가상화는 {{반가상화}}다.
- KVM은 리눅스 {{커널 모듈}}로 동작하며 CPU의 {{VT-x}} 또는 AMD-V 지원이 필요하다.
- 컨테이너는 호스트의 {{커널}}을 공유해 게스트 OS가 없다.
- HDFS에서 메타데이터는 {{네임노드}}가, 실제 블록은 {{데이터노드}}가 맡는다.
- 하둡 2에서 자원 관리를 맡는 구성 요소는 {{YARN}}이다.

> [!FLASHCARD]
> Q: 클러스터 세 유형과 대표 기술은?
> A: 고계산(HPC) — 베오울프·MPI, 부하 분산 — LVS·ipvsadm·HAProxy, 고가용성(HA) — Heartbeat·Pacemaker·keepalived.

> [!FLASHCARD]
> Q: 임베디드 리눅스의 장점과 단점은?
> A: 장점은 로열티 없음, 소스 공개, 다양한 CPU 지원, 강력한 네트워킹, 모듈식 커널. 단점은 상용 RTOS보다 약한 실시간성과 상대적으로 큰 크기.

> [!FLASHCARD]
> Q: 전가상화와 반가상화의 차이는?
> A: 전가상화는 게스트 OS를 수정하지 않고(하드웨어 전체 가상화, CPU 지원 활용), 반가상화는 게스트 커널을 수정해 하이퍼콜로 하이퍼바이저와 직접 통신해 빠르다(Xen).

> [!FLASHCARD]
> Q: 하이퍼바이저 타입 1·2의 예는?
> A: 타입 1(Bare-metal) — Xen, KVM, VMware ESXi, Hyper-V. 타입 2(Hosted) — VirtualBox, VMware Workstation·Player, Parallels.

> [!FLASHCARD]
> Q: IaaS·PaaS·SaaS의 예는?
> A: IaaS — AWS EC2, OpenStack. PaaS — Google App Engine, Heroku, OpenShift. SaaS — Gmail, Google Docs, Microsoft 365, Salesforce.

> [!FLASHCARD]
> Q: 오픈스택의 주요 구성 요소는?
> A: Nova(컴퓨트), Swift(오브젝트 스토리지), Cinder(블록 스토리지), Neutron(네트워크), Keystone(인증), Glance(이미지), Horizon(대시보드).

> [!FLASHCARD]
> Q: 하둡의 세 핵심 구성과 역할은?
> A: HDFS(분산 저장: 네임노드 메타데이터, 데이터노드 블록, 기본 3복제), MapReduce(Map → Shuffle → Reduce 분산 처리), YARN(하둡 2부터 자원 관리·스케줄링).

> [!FLASHCARD]
> Q: 자동차와 스마트TV에 쓰이는 리눅스 기반 플랫폼은?
> A: 자동차 — AGL(Automotive Grade Linux), GENIVI, 안드로이드 오토모티브. 스마트TV — LG webOS, 삼성 타이젠, 안드로이드 TV.

**다음으로 갈 기준:** 클러스터 3유형, 가상화 2방식·하이퍼바이저 2유형, 클라우드 3모델, 하둡 3구성을 표 없이 말할 수 있으면 14편까지 끝이다. 처음으로 돌아가 전체 암기 코드를 복습한다: [0 · 시험 지도](/lectures/grade-mukhnzii/semester-certificate/subject-linux-master-2/lecture-00).

> [!PAGEBREAK]

## 정답과 해설

### 확인 문제 정답

1. **고가용성(HA) 클러스터** — 하트비트로 감시하다 페일오버한다.
2. **BusyBox**.
3. **webOS**.
4. **반가상화(Para-virtualization)**, 대표 솔루션 **Xen**.
5. **타입 2(Hosted) 하이퍼바이저** — 예: VirtualBox, VMware Workstation.
6. **cgroups**(자원 제한)와 **namespaces**(격리).
7. **IaaS**.
8. 컴퓨트 **Nova**, 인증 **Keystone**.
9. **네임노드(NameNode)**.
10. **Sqoop**.
