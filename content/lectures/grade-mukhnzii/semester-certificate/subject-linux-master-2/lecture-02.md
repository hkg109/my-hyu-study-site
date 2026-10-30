---
title: "2편 · 리눅스 설치 — 설치 유형·장치 식별자·파티션·파일 시스템·부트매니저"
description: "1과목 2장. 설치 매체와 설치 방식, /dev/sda·nvme0n1p1·UUID·LABEL 같은 저장 장치 식별자, MBR·GPT 파티션과 스왑·LVM, ext2/3/4·xfs·btrfs 파일 시스템과 저널링, LILO·GRUB·GRUB2와 BIOS/UEFI 부팅 과정, 런레벨과 systemd 타깃까지 정리합니다."
order: 2
published: true
duration: 90
tags: [리눅스마스터 2급, 자격증, 1과목, 리눅스 설치, 파티션, 파일 시스템, 부트로더]
objectives:
  - 설치 매체와 설치 방식(그래픽·텍스트·네트워크·킥스타트)을 구분하고 설치 전에 정할 항목을 말한다.
  - 장치 파일 이름(/dev/sda, nvme0n1p1 등)과 UUID·LABEL을 읽고, MBR과 GPT의 구조·한계를 비교한다.
  - 주·확장·논리 파티션, 스왑, LVM과 주요 파일 시스템(ext2/3/4, xfs, btrfs, vfat)의 특징을 설명한다.
  - BIOS/UEFI → 부트로더 → 커널 → systemd 순의 부팅 과정과 LILO·GRUB·GRUB2 설정, 런레벨·타깃을 연결한다.
---

## 학습 경로 · 1과목 2장

[← 1편 · 리눅스의 이해](/lectures/grade-mukhnzii/semester-certificate/subject-linux-master-2/lecture-01) · [다음: 3편 · 기본 명령어 (1) 사용자 계정과 권한 →](/lectures/grade-mukhnzii/semester-certificate/subject-linux-master-2/lecture-03)

**범위:** 1과목 리눅스 일반 · 2장 "리눅스 설치" — 설치 유형, 저장 장치 식별자, 파티션, 파일 시스템, 부트매니저.

**형광펜 읽는 법:** ==yellow:노랑== 핵심 정의·결론 · ==red:빨강== 시험에서 헷갈리는 구분·함정 · ==blue:파랑== 외워야 할 순서·목록

> [!EXAM]
> **이 장의 핵심 질문:** 빈 디스크에 리눅스를 깔아 전원을 켰을 때 로그인 화면이 뜨기까지, 디스크는 어떻게 나뉘고 어떤 형식으로 포맷되며 누가 커널을 메모리에 올리는가?
>
> **전체 흐름:** ==blue:설치 방식 고르기 → 디스크 이름 읽기(장치 식별자) → 디스크 나누기(파티션·스왑·LVM) → 포맷하기(파일 시스템) → 부팅 순서(BIOS/UEFI → 부트로더 → 커널 → systemd) → 런레벨·타깃==

---

## 단원 도입

| 출제 포인트 | 빈도 | 이렇게 나온다 |
|---|:---:|---|
| MBR vs GPT (주 파티션 4개, 2TB, 128개) | ★★★ | 수치 비교, "MBR의 특징이 아닌 것은?" |
| 장치 파일 이름 (`/dev/sda3`, `/dev/hdb`, `nvme0n1p2`) | ★★★ | 이름 → 몇 번째 디스크의 몇 번째 파티션인지 |
| 부팅 순서와 런레벨·타깃 | ★★★ | 순서 배열, 런레벨 번호 ↔ 의미 ↔ target |
| GRUB2 설정 파일과 명령 | ★★★ | `/etc/default/grub` 수정 후 `grub2-mkconfig` |
| 파일 시스템 특징 (저널링, ext4 최대 크기, xfs) | ★★ | "저널링을 지원하지 않는 것은?" |
| 논리 파티션 번호(5번부터), 파티션 ID(83·82·8e·5) | ★★ | fdisk 출력 해석 |
| LILO vs GRUB | ★★ | "설정 변경 후 명령을 다시 실행해야 하는 것" |
| 스왑, LVM(PV·VG·LV) | ★★ | 개념·순서 |
| 설치 방식 (킥스타트, PXE, 텍스트 모드) | ★ | 자동 설치 파일 이름 |

> [!PAGEBREAK]

## PART 1 · 설치 준비

## 1. 리눅스의 설치 유형

### 핵심 필기

**설치 전에 정할 것:** 하드웨어 사양·호환성(CPU 아키텍처, 메모리, 디스크) → 설치 매체 → 파티션 계획 → 네트워크 정보(IP, 게이트웨이, DNS, 호스트명) → 설치할 소프트웨어 구성 → root 암호와 일반 사용자.

| 구분 | 방식 | 설명 |
| --- | --- | --- |
| 설치 매체 | **DVD/USB** | 배포판 ISO 이미지를 굽거나 USB에 기록(`dd`, Rufus 등)해 부팅 |
| 설치 매체 | **네트워크 설치** | ==PXE(Preboot eXecution Environment)== 로 네트워크 부팅 → DHCP·TFTP로 설치 이미지를 받고, HTTP·FTP·NFS 저장소에서 패키지를 내려받음 |
| 설치 매체 | **하드 디스크 설치** | 디스크에 복사해 둔 ISO 이미지로 설치 |
| 설치 화면 | **그래픽(GUI) 설치** | 마우스로 진행, 기본값 |
| 설치 화면 | **텍스트 모드 설치** | 메모리가 적거나 그래픽 카드가 지원되지 않을 때 (Red Hat 계열 부팅 옵션 `inst.text`) |
| 자동화 | **킥스타트(Kickstart)** | Red Hat 계열의 ==무인(자동) 설치 응답 파일==. 설치가 끝나면 그 설정이 `/root/anaconda-ks.cfg`로 남아 다른 서버 설치에 재사용 |
| 자동화 | **preseed / autoinstall** | Debian·Ubuntu 계열의 자동 설치 방식 |
| 환경 | **가상 머신 설치** | VirtualBox, VMware, KVM 위에 ISO로 설치 (14편) |
| 환경 | **멀티 부팅(듀얼 부팅)** | 한 컴퓨터에 Windows와 리눅스 등 여러 OS를 설치하고 부트로더로 골라 부팅 |
| 체험 | **라이브(Live) CD/USB** | 설치하지 않고 매체에서 바로 실행 |

**설치 프로그램 이름:** Red Hat 계열 ==Anaconda==, Debian은 debian-installer, Ubuntu 서버는 Subiquity.

**소프트웨어 선택(RHEL·Rocky 9 기준 기본 환경):** Server with GUI · Server · Minimal Install · Workstation · Custom Operating System · Virtualization Host.

> [!TRAP]
> 킥스타트 결과 파일은 `/root/anaconda-ks.cfg`이다. ==red:"킥스타트는 Debian 계열의 자동 설치 방식"은 오답(Debian은 preseed).== 또 PXE 부팅에는 네트워크 카드의 PXE 지원과 DHCP·TFTP 서버가 필요하다.

> [!PAGEBREAK]

## PART 2 · 저장 장치 식별자와 파티션

## 2. 저장 장치 식별자

### 핵심 필기

리눅스는 디스크도 `/dev` 아래의 장치 파일로 다룬다. 이름만 보고 "어떤 종류의 몇 번째 디스크, 몇 번째 파티션"인지 읽어야 한다.

| 장치 | 이름 규칙 | 예 | 읽는 법 |
| --- | --- | --- | --- |
| IDE(PATA) 디스크 (옛 방식) | `/dev/hd` + 문자 | `/dev/hda`, `/dev/hdb`, `/dev/hdc`, `/dev/hdd` | ==hda 1차 마스터, hdb 1차 슬레이브, hdc 2차 마스터, hdd 2차 슬레이브== |
| SCSI·SATA·SAS·USB 디스크 | `/dev/sd` + 문자 + 파티션 번호 | `/dev/sda1`, `/dev/sdb3` | sdb3 = 두 번째 디스크의 세 번째 파티션 |
| NVMe SSD | `/dev/nvme<컨트롤러>n<네임스페이스>p<파티션>` | `/dev/nvme0n1p1` | ==0번 컨트롤러, 1번 네임스페이스, 1번 파티션== |
| 가상 디스크(virtio) | `/dev/vd` + 문자 | `/dev/vda1` | KVM 가상 머신의 첫 디스크 |
| SD·eMMC | `/dev/mmcblk<n>p<파티션>` | `/dev/mmcblk0p1` | 라즈베리 파이 등 |
| CD/DVD | `/dev/sr0` (`/dev/cdrom` 링크) | — | SCSI 광학 드라이브 |
| 플로피 | `/dev/fd0` | — | 첫 플로피 드라이브 |

> [!TRAP]
> ==red:디스크 문자는 a부터, 파티션 번호는 1부터 센다.== `/dev/sdc2`는 "세 번째 디스크의 두 번째 파티션"이다. 반면 NVMe의 컨트롤러 번호는 0부터(`nvme0`), 네임스페이스·파티션은 1부터(`n1p1`)다.

**장치 이름은 바뀔 수 있다.** USB를 꽂는 순서나 디스크 추가에 따라 sdb가 sdc가 될 수 있다. 그래서 `/etc/fstab`(5편)에는 바뀌지 않는 식별자를 쓴다.

| 식별자 | 뜻 | 확인·지정 |
| --- | --- | --- |
| **UUID** | 파일 시스템을 만들 때(포맷 시) 생성되는 ==128비트 고유 식별자== | `blkid`, `lsblk -f`, `/dev/disk/by-uuid/` |
| **LABEL** | 사람이 붙인 파일 시스템 이름 | `mkfs.ext4 -L`, `e2label`, `xfs_admin -L` |
| **PARTUUID** | GPT 파티션 자체의 GUID (포맷과 무관) | `blkid`, `/dev/disk/by-partuuid/` |

```bash
# mkfs로 만든 파일 시스템의 식별자 확인 (실습 이미지)
$ mkfs.ext4 -q -L DATA disk.img
$ blkid disk.img
disk.img: LABEL="DATA" UUID="c35faad9-274c-4477-acf4-d04bb6fb560c" BLOCK_SIZE="4096" TYPE="ext4"
$ mkswap -L SWAP1 sw.img
Setting up swapspace version 1, size = 32 MiB (33550336 bytes)
LABEL=SWAP1, UUID=9c13944a-41ba-4ff8-9243-010db9fa2371
```

```text
# /etc/fstab에서 장치를 가리키는 세 가지 방법
/dev/sda1                                  /boot  ext4  defaults  1 2
UUID=c35faad9-274c-4477-acf4-d04bb6fb560c  /data  ext4  defaults  0 2
LABEL=SWAP1                                swap   swap  defaults  0 0
```

## 3. 파티션 — MBR과 GPT

### 핵심 필기

> [!CONCEPT]
> **파티션(Partition)** — 하나의 물리 디스크를 ==논리적으로 나눈 독립 영역==. 파티션마다 다른 파일 시스템을 만들고 다른 디렉터리에 마운트할 수 있다. 디스크 맨 앞의 **파티션 테이블**이 각 파티션의 시작·끝·종류를 기록하며, 그 형식이 MBR 또는 GPT다.

| 구분 | **MBR** (Master Boot Record, DOS 방식) | **GPT** (GUID Partition Table) |
| --- | --- | --- |
| 위치·구조 | 디스크 ==첫 섹터 512바이트== = 부트 코드 446 + 파티션 테이블 64(16바이트 × 4) + 부트 시그니처 2(`0x55AA`) | LBA 0 보호 MBR → LBA 1 GPT 헤더 → 파티션 항목 → … → 디스크 끝에 ==백업 GPT== |
| 파티션 수 | ==주 파티션 최대 4개==, 더 필요하면 주 3개 + 확장 1개 안에 논리 파티션 | 기본 ==128개==, 주·확장·논리 구분 없음 |
| 디스크 최대 크기 | ==2TiB== (32비트 섹터 주소 × 512바이트) | 약 8ZiB (64비트 LBA) — 사실상 제한 없음 |
| 무결성 | 테이블 하나뿐, 손상되면 복구 어려움 | CRC32 검사, 앞뒤 이중 저장 |
| 펌웨어 | BIOS와 짝 (UEFI에서도 레거시 모드로 사용) | ==UEFI 표준==의 일부 (BIOS에서도 GRUB2로 부팅 가능) |
| 도구 | `fdisk` | `gdisk`, `parted` (최신 `fdisk`도 GPT 지원) |

[![디스크 앞부분을 확대해 MBR 512바이트가 446바이트 부트 코드, 16바이트씩 네 칸인 64바이트 파티션 테이블, 2바이트 서명 0x55AA로 나뉘는 모습과, GPT 디스크가 보호 MBR, GPT 헤더, 128개 파티션 항목, 파티션들, 디스크 끝의 백업 헤더로 이루어진 모습을 위아래로 비교한 그림](/materials/diagrams/lm2-l02b-mbr-gpt.svg)](/materials/diagrams/lm2-l02b-mbr-gpt.svg)

*그림 2-1 · MBR과 GPT의 구조 — 누르면 원본 크기로 열린다.*

> [!NOTE]
> - **읽는 순서:** 위 MBR 띠를 왼쪽부터 446 → 64 → 2바이트로 읽고, 아래 GPT 띠를 LBA 0부터 디스크 끝까지 읽는다.
> - **핵심:** MBR은 ==파티션 칸이 16바이트짜리 네 개뿐==이라 주 파티션이 4개로 묶인다. GPT는 앞뒤에 테이블을 두 벌 두고 칸이 128개다.
> - **시험 포인트:** ==red:446 + 64 + 2 = 512==, 주 파티션 4개, 2TiB. GPT 맨 앞의 "보호 MBR"(타입 `ee`)은 옛 도구가 디스크를 빈 디스크로 오해하지 않게 막는 장치다.

### 주 · 확장 · 논리 파티션 (MBR)

| 종류 | 뜻 | 번호 |
| --- | --- | --- |
| **주(Primary) 파티션** | 파티션 테이블에 직접 기록, 부팅 가능 | 1–4 |
| **확장(Extended) 파티션** | 논리 파티션을 담는 "그릇". ==디스크당 1개만==, 그 자체에는 파일 시스템을 만들지 않음 | 1–4 중 하나 |
| **논리(Logical) 파티션** | 확장 파티션 안에 만드는 파티션 | ==항상 5번부터== |

```bash
# 주 파티션 3개 + 확장 1개 + 논리 2개로 나눈 4GiB 디스크 (실습 이미지를 /dev/sdb로 보면)
$ fdisk -l /dev/sdb
Disk /dev/sdb: 4 GiB, 4294967296 bytes, 8388608 sectors
Units: sectors of 1 * 512 = 512 bytes
Disklabel type: dos

Device     Boot   Start     End Sectors  Size Id Type
/dev/sdb1  *       2048 2099199 2097152    1G 83 Linux
/dev/sdb2       2099200 3147775 1048576  512M 82 Linux swap / Solaris
/dev/sdb3       3147776 5244927 2097152    1G 8e Linux LVM
/dev/sdb4       5244928 8388607 3143680  1.5G  5 Extended
/dev/sdb5       5246976 6295551 1048576  512M 83 Linux
/dev/sdb6       6297600 8388607 2091008 1021M 83 Linux
```

`Disklabel type: dos`가 MBR이다. `Boot`의 `*`는 부팅 가능(active) 표시, `Id`는 파티션 종류 번호다.

| fdisk ID | 종류 | | fdisk ID | 종류 |
| :---: | --- | --- | :---: | --- |
| ==83== | Linux (ext2/3/4, xfs 등) | | ==5== | Extended |
| ==82== | Linux swap | | ==8e== | Linux LVM |
| fd | Linux raid autodetect | | 7 | HPFS/NTFS/exFAT |
| b · c | W95 FAT32 | | ef | EFI (FAT-12/16/32) |

> [!TRAP]
> ==red:논리 파티션은 확장 파티션 번호와 관계없이 5번부터 시작한다.== 주 파티션을 2개만 만들고 확장을 3번에 만들어도 첫 논리 파티션은 `sdb5`다(4번은 비어 있음). 또 ==확장 파티션은 디스크당 하나==뿐이다.

**fdisk 대화형 명령 (자주 나오는 것):** `m` 도움말 · `p` 테이블 출력 · `n` 새 파티션 · `d` 삭제 · `t` 종류(ID) 변경 · `l` 종류 목록 · `a` 부팅 플래그 · `w` 저장 후 종료 · `q` 저장 안 하고 종료. `fdisk -l`은 목록 보기다.

```bash
# GPT 디스크: parted로 만들고 fdisk로 확인
$ parted -s /dev/sdc mklabel gpt mkpart ESP fat32 1MiB 601MiB set 1 esp on \
    mkpart boot ext4 601MiB 1625MiB mkpart root xfs 1625MiB 100%
$ fdisk -l /dev/sdc
Disklabel type: gpt
Device       Start     End Sectors  Size Type
/dev/sdc1     2048 1230847 1228800  600M EFI System
/dev/sdc2  1230848 3327999 2097152    1G Linux filesystem
/dev/sdc3  3328000 8386559 5058560  2.4G Linux filesystem
```

## 4. 마운트 포인트 계획 · 스왑 · LVM

### 핵심 필기

**설치 시 나누는 대표 파티션**

| 마운트 포인트 | 용도 | 비고 |
| --- | --- | --- |
| `/` (루트) | 모든 디렉터리의 꼭대기 | ==반드시 필요== |
| **swap** | 메모리가 부족할 때 쓰는 디스크 영역, 마운트 포인트 없음 | 전통적으로 필수로 함께 만든다 |
| `/boot` | 커널(`vmlinuz`)·initramfs·부트로더 설정 | LVM·암호화 루트를 쓸 때 따로 둠 |
| `/boot/efi` | ==UEFI의 EFI 시스템 파티션(ESP)==, FAT32(vfat) | UEFI 부팅 시 필수 |
| `/home` | 사용자 홈 디렉터리 | 재설치 때 사용자 자료 보존 |
| `/var` | 로그·메일·스풀 등 계속 커지는 자료 | 로그 폭주가 `/`를 채우지 않게 분리 |
| `/tmp` | 임시 파일 | — |
| `/usr` | 프로그램·라이브러리 | — |

> [!CONCEPT]
> **스왑(Swap)** — 물리 메모리(RAM)가 부족할 때 ==덜 쓰는 메모리 페이지를 디스크로 내보내는 가상 메모리 영역==. 전통적 권장 크기는 ==RAM의 1–2배==(메모리가 큰 서버는 그보다 작게)이며, 파티션(ID 82) 또는 스왑 파일로 만든다. 만들기 `mkswap`, 켜기 `swapon`, 끄기 `swapoff`, 확인 `swapon -s`·`free`.

> [!CONCEPT]
> **LVM(Logical Volume Manager)** — 여러 디스크·파티션을 하나의 저장 풀로 묶고, 거기서 ==크기를 자유롭게 늘리고 줄일 수 있는 논리 볼륨==을 잘라 쓰는 방식.
>
> ==blue:PV(물리 볼륨) → VG(볼륨 그룹) → LV(논리 볼륨)== 순서로 만든다. VG는 **PE(Physical Extent, 기본 4MiB)** 단위로 공간을 나눠 LV에 준다.

```bash
pvcreate /dev/sdb3 /dev/sdc1          # 1) 파티션을 PV로 초기화 (파티션 ID 8e)
vgcreate datavg /dev/sdb3 /dev/sdc1   # 2) PV들을 묶어 VG 생성
lvcreate -L 10G -n datalv datavg      # 3) VG에서 10GiB짜리 LV 생성
mkfs.xfs /dev/datavg/datalv           # 4) LV에 파일 시스템 생성
lvextend -L +5G /dev/datavg/datalv    # 나중에 5GiB 늘리기
```

> [!TRAP]
> ==red:LVM 순서는 PV → VG → LV.== "VG를 먼저 만들고 PV를 추가한다"는 틀렸다. 또 LV의 장치 경로는 `/dev/VG이름/LV이름` 또는 `/dev/mapper/VG이름-LV이름`이다.

> [!CHECK]
> **1.** `/dev/hdc`는 어느 위치의 IDE 디스크인가?
>
> **2.** MBR의 512바이트는 어떻게 나뉘는가?
>
> **3.** MBR 디스크에 주 파티션 2개와 확장 파티션 1개를 만들었다. 첫 논리 파티션의 번호는?
>
> **4.** LVM을 만드는 순서를 쓰시오.

> [!PAGEBREAK]

## PART 3 · 파일 시스템

## 5. 리눅스 파일 시스템의 종류

### 핵심 필기

> [!CONCEPT]
> **저널링(Journaling)** — 파일 시스템을 바꾸기 전에 ==어떤 변경을 할지 먼저 저널(로그) 영역에 기록==해 두는 방식. 전원이 갑자기 꺼져도 저널만 다시 적용·취소하면 되므로 ==디스크 전체를 검사하는 fsck 시간이 크게 줄고 일관성이 유지==된다.

| 파일 시스템 | 저널링 | 특징 |
| --- | :---: | --- |
| **ext** | X | 1992, 최초의 리눅스 전용 FS (최대 2GB) |
| **ext2** | ==X== | 1993, 오랫동안 표준. 저널이 없어 비정상 종료 후 fsck가 오래 걸림 |
| **ext3** | O | 2001, ==ext2에 저널링 추가==, ext2와 호환 (`tune2fs -j`로 ext2 → ext3 변환) |
| **ext4** | O | 2008, ==extent 기반==, 지연 할당, 볼륨 최대 1EiB·파일 최대 16TiB(4KiB 블록), ext3와 하위 호환 |
| **xfs** | O | SGI가 IRIX용으로 개발(1993), 대용량·병렬 입출력에 강한 64비트 FS. ==RHEL 7 이후 기본 FS==. 크기를 늘릴 수는 있지만 줄일 수 없음 |
| **btrfs** | O(CoW) | B-tree FS, ==스냅샷·서브볼륨·CoW(쓰기 시 복사)·체크섬==. SUSE 기본, Fedora 데스크톱 기본 |
| **JFS** | O | IBM의 저널링 FS (AIX에서 이식) |
| **ReiserFS** | O | 한스 라이저, 리눅스 커널에 처음 들어간 저널링 FS(2.4.1), 작은 파일에 강함 |
| **vfat** | X | FAT16/32에 긴 파일 이름 지원 — USB 메모리, ==UEFI ESP== |
| **NTFS·exFAT** | NTFS O | Windows 파일 시스템 |
| **iso9660 · UDF** | — | CD-ROM / DVD 파일 시스템 |
| **swap** | — | 스왑 영역 전용 형식 |
| **NFS · SMB/CIFS** | — | 네트워크 파일 시스템 (13편) |
| **proc · sysfs · tmpfs** | — | 메모리에만 있는 가상 FS (`/proc`, `/sys`, `/dev/shm`) |

```bash
# ext2에 저널을 추가하면 ext3이 된다 (실습 이미지)
$ mkfs.ext2 -q e2.img && blkid e2.img
e2.img: UUID="d91dcf75-9a44-424f-b0f9-03f9c71b669e" BLOCK_SIZE="4096" TYPE="ext2"
$ tune2fs -j e2.img
tune2fs 1.47.0 (5-Feb-2023)
Creating journal inode: done
$ blkid e2.img
e2.img: UUID="d91dcf75-9a44-424f-b0f9-03f9c71b669e" SEC_TYPE="ext2" BLOCK_SIZE="4096" TYPE="ext3"

# ext4의 기능 목록에서 저널(has_journal)과 extent 확인
$ tune2fs -l disk.img | grep features
Filesystem features:      has_journal ext_attr resize_inode dir_index filetype extent 64bit flex_bg sparse_super large_file huge_file dir_nlink extra_isize metadata_csum
```

> [!TRAP]
> ==red:ext2와 vfat(FAT)은 저널링을 지원하지 않는다.== ext3·ext4·xfs·btrfs·JFS·ReiserFS는 저널링(btrfs는 CoW 방식) 파일 시스템이다. "ext3은 ext2와 호환되지 않는다"도 오답 — ext3은 ext2에 저널만 더한 것이라 ext2로도 마운트할 수 있다.

**ext3·ext4의 저널링 모드 (마운트 옵션 `data=`)**

| 모드 | 저널에 기록하는 것 | 성격 |
| --- | --- | --- |
| `journal` | 메타데이터 + 데이터 모두 | 가장 안전, 가장 느림 |
| `ordered` | 메타데이터만, 단 데이터를 먼저 디스크에 쓴 뒤 기록 | ==기본값==, 안전성과 속도 균형 |
| `writeback` | 메타데이터만, 데이터 쓰기 순서 보장 없음 | 가장 빠름, 비정상 종료 시 옛 데이터가 보일 수 있음 |

**포맷 명령:** `mkfs -t ext4 /dev/sdb1` = `mkfs.ext4 /dev/sdb1` = `mke2fs -t ext4 /dev/sdb1`, xfs는 `mkfs.xfs`, FAT은 `mkfs.vfat`, 스왑은 `mkswap`. 자세한 옵션과 `fsck`·`tune2fs`·`df`는 5편.

> [!CHECK]
> **5.** 저널링 기능이 없는 리눅스 파일 시스템 하나와 그 파일 시스템을 저널링 FS로 바꾸는 명령은?
>
> **6.** ext3·ext4의 기본 저널링 모드는?
>
> **7.** UEFI 시스템에서 `/boot/efi`에 마운트하는 파티션의 파일 시스템은?

> [!PAGEBREAK]

## PART 4 · 부트매니저와 부팅 과정

## 6. 부팅 과정

### 핵심 필기

==blue:전원 → BIOS/UEFI(POST) → 부트로더(GRUB2) → 커널 + initramfs → systemd(init, PID 1) → 기본 타깃(런레벨) → 로그인==

| 단계 | 하는 일 |
| --- | --- |
| ① **BIOS/UEFI** | ==POST(Power-On Self Test)== 로 하드웨어 점검, 부팅 장치 순서에 따라 부팅 장치 선택 |
| ② **부트로더 1단계** | BIOS: 디스크 MBR의 446바이트 부트 코드 실행 / UEFI: ESP의 `.efi` 파일(예 `grubx64.efi`) 실행 |
| ③ **부트로더(GRUB2)** | 메뉴 표시, 선택한 커널 이미지(`/boot/vmlinuz-…`)와 initramfs(`/boot/initramfs-…`, 옛 이름 initrd)를 메모리에 적재 |
| ④ **커널** | 압축 해제, 하드웨어 초기화·드라이버 적재, initramfs로 루트 파일 시스템을 찾아 마운트 |
| ⑤ **systemd (또는 init)** | ==첫 사용자 공간 프로세스, PID 1==. 기본 타깃(런레벨)에 맞는 서비스 시작 |
| ⑥ **로그인** | getty(텍스트 로그인) 또는 디스플레이 매니저(GUI 로그인, 11편) |

[![전원에서 BIOS 또는 UEFI의 POST, MBR 또는 ESP의 부트로더, GRUB2 메뉴, 커널과 initramfs 적재, PID 1 systemd, 기본 타깃, 로그인 화면까지 위에서 아래로 이어지는 부팅 흐름도와 각 단계에서 쓰는 파일 이름](/materials/diagrams/lm2-l02a-boot.svg)](/materials/diagrams/lm2-l02a-boot.svg)

*그림 2-2 · 리눅스 부팅 과정 — 누르면 원본 크기로 열린다.*

> [!NOTE]
> - **읽는 순서:** 위에서 아래로 단계를 따라가고, 오른쪽 회색 글씨로 각 단계가 읽는 파일을 함께 본다.
> - **핵심:** 펌웨어는 ==부트로더만== 찾고, 부트로더는 ==커널과 initramfs만== 올린다. 서비스를 띄우는 것은 PID 1인 systemd다.
> - **시험 포인트:** ==red:순서 배열 문제에서 "커널 → 부트로더"처럼 뒤바꾼 보기==가 나온다. initramfs는 커널이 진짜 루트를 마운트하기 전에 쓰는 임시 루트다.

**BIOS vs UEFI**

| 구분 | BIOS (Legacy) | UEFI |
| --- | --- | --- |
| 파티션 테이블 | MBR | GPT |
| 부트 코드 위치 | MBR의 446바이트 | ==ESP(EFI System Partition, FAT32)== 안의 `.efi` 파일 |
| 부팅 디스크 한계 | 2TiB | 사실상 없음 |
| 기타 | 16비트 리얼 모드, 텍스트 화면 | ==Secure Boot==(서명된 부트로더만 실행), 마우스 GUI 설정, 빠른 부팅 |

부팅 메시지는 `dmesg`(커널 링 버퍼)와 `journalctl -b`(이번 부팅의 로그)로 확인한다.

## 7. 부트로더 — LILO · GRUB · GRUB2

### 핵심 필기

| 구분 | **LILO** (LInux LOader) | **GRUB Legacy** (0.9x) | **GRUB2** |
| --- | --- | --- | --- |
| 설정 파일 | `/etc/lilo.conf` | `/boot/grub/grub.conf` (또는 `menu.lst`) | `/boot/grub2/grub.cfg` (Debian·Ubuntu는 `/boot/grub/grub.cfg`) — 직접 편집하지 않음 |
| 설정 반영 | 수정 후 `lilo` 명령을 다시 실행해야 MBR에 반영 | 파일 수정만으로 다음 부팅에 반영 | `/etc/default/grub` 수정 → `grub2-mkconfig -o /boot/grub2/grub.cfg` (Ubuntu `update-grub`) |
| 디스크·파티션 표기 | `/dev/sda1` | `(hd0,0)` — 디스크·파티션 모두 0부터 | `(hd0,1)` — 디스크 0부터, 파티션 1부터 (`(hd0,msdos1)`, `(hd0,gpt2)`) |
| 부팅 중 편집 | 제한적 (부트 프롬프트에 옵션 입력) | 메뉴에서 `e` 편집, `b` 부팅, `c` 명령 셸 | 메뉴에서 `e` 편집, `Ctrl+x`(또는 F10) 부팅, `c` 명령 셸 |
| 기타 | 1024 실린더 제한(옛 BIOS), 파일 시스템을 이해하지 못함 | 여러 FS를 직접 읽음, 대화형 셸 | 모듈 구조, UEFI·GPT·LVM·RAID 지원, 스크립트 |

```text
# /etc/lilo.conf (LILO)
boot=/dev/sda           # 부트로더를 설치할 위치 (MBR)
prompt
timeout=50              # 0.1초 단위 → 5초
default=linux
image=/boot/vmlinuz
    label=linux
    root=/dev/sda1
    read-only
```

```text
# /boot/grub/grub.conf (GRUB Legacy)
default=0                         # 첫 번째 title(0부터)을 기본으로
timeout=5                         # 초 단위
splashimage=(hd0,0)/grub/splash.xpm.gz
title CentOS (2.6.32-754.el6.x86_64)
        root (hd0,0)
        kernel /vmlinuz-2.6.32-754.el6.x86_64 ro root=/dev/sda2 rhgb quiet
        initrd /initramfs-2.6.32-754.el6.x86_64.img
```

```bash
# GRUB2: 손으로 고치는 파일은 /etc/default/grub
$ cat /etc/default/grub
GRUB_TIMEOUT=5
GRUB_DEFAULT=saved
GRUB_DISABLE_SUBMENU=true
GRUB_TERMINAL_OUTPUT="console"
GRUB_CMDLINE_LINUX="resume=/dev/mapper/rl-swap rd.lvm.lv=rl/root rd.lvm.lv=rl/swap rhgb quiet"
GRUB_DISABLE_RECOVERY="true"

# 수정 후 grub.cfg를 다시 생성 (Red Hat 계열)
$ sudo grub2-mkconfig -o /boot/grub2/grub.cfg
# Debian·Ubuntu 계열
$ sudo update-grub

# 부트로더를 디스크 MBR에 다시 설치
$ sudo grub2-install /dev/sda
```

| GRUB2 관련 파일 | 역할 |
| --- | --- |
| `/etc/default/grub` | ==사용자가 편집하는 기본 설정== (`GRUB_TIMEOUT`, `GRUB_DEFAULT`, `GRUB_CMDLINE_LINUX`) |
| `/etc/grub.d/` | grub.cfg를 만드는 스크립트 (`00_header`, `10_linux`, `40_custom` 등) |
| `/boot/grub2/grub.cfg` | 위 두 가지로부터 ==자동 생성되는 최종 설정== — 직접 수정 금지 |

> [!TRAP]
> GRUB Legacy는 `(hd0,0)`, GRUB2는 `(hd0,1)`이 첫 디스크의 첫 파티션이다. ==red:디스크 번호는 둘 다 0부터지만 GRUB2부터 파티션 번호가 1부터다.== 또 LILO는 설정을 바꾼 뒤 `lilo`를 실행해야 반영되고 GRUB은 그럴 필요가 없다는 점이 단골 비교다.

**부트로더 보안·복구**

- 부팅 메뉴에서 `e`로 커널 줄을 고칠 수 있으므로, 누구나 단일 사용자 모드로 들어가 root 암호를 바꿀 수 있다 → 부트로더 암호를 건다. GRUB Legacy `password --md5`(`grub-md5-crypt`로 생성), GRUB2 `grub2-setpassword` 또는 `grub2-mkpasswd-pbkdf2`.
- root 암호 분실 시: 메뉴에서 `e` → `linux`(GRUB Legacy는 `kernel`) 줄 끝에 `single` 또는 `1`(SysV), systemd에서는 `systemd.unit=rescue.target`이나 `rd.break`를 붙여 부팅한다.

## 8. 런레벨과 systemd 타깃

### 핵심 필기

| 런레벨 | 의미 (SysV init) | systemd 타깃 |
| :---: | --- | --- |
| ==0== | 시스템 종료(halt) | `poweroff.target` |
| ==1== | 단일 사용자 모드(복구, root만, 네트워크 없음) | `rescue.target` |
| 2 | 다중 사용자 모드 (NFS 없음) | `multi-user.target` |
| ==3== | 다중 사용자 모드, ==텍스트(CLI) 로그인== | `multi-user.target` |
| 4 | 사용하지 않음(사용자 정의) | `multi-user.target` |
| ==5== | 다중 사용자 + ==X 윈도우(GUI) 로그인== | `graphical.target` |
| ==6== | 재부팅 | `reboot.target` |

```bash
# systemd 시스템에서 런레벨 이름은 타깃의 별칭(링크)이다
$ ls -l /usr/lib/systemd/system/runlevel*.target
... runlevel0.target -> poweroff.target
... runlevel1.target -> rescue.target
... runlevel2.target -> multi-user.target
... runlevel3.target -> multi-user.target
... runlevel4.target -> multi-user.target
... runlevel5.target -> graphical.target
... runlevel6.target -> reboot.target

$ systemctl get-default                      # 기본 타깃 확인
graphical.target
$ sudo systemctl set-default multi-user.target   # 부팅 시 텍스트 모드로
$ sudo systemctl isolate rescue.target           # 지금 바로 전환
$ runlevel                                   # 이전·현재 런레벨 (N = 이전 없음)
N 5
```

| SysV 방식 | systemd 방식 |
| --- | --- |
| 기본 런레벨: `/etc/inittab`의 `id:5:initdefault:` | 기본 타깃: `systemctl set-default`, 링크 `/etc/systemd/system/default.target` |
| 바꾸기: `init 3`, `telinit 3` | `systemctl isolate multi-user.target` |
| 종료·재부팅: `init 0`, `init 6` | `systemctl poweroff`, `systemctl reboot` (`shutdown -h now`, `shutdown -r now`, `reboot`도 사용) |
| 서비스 스크립트: `/etc/rc.d/init.d/`, `/etc/rc.d/rc3.d/` | 유닛 파일: `/usr/lib/systemd/system/`, `/etc/systemd/system/` |

> [!TRAP]
> ==red:런레벨 3은 텍스트 다중 사용자, 5는 그래픽 로그인, 1은 단일 사용자, 0은 종료, 6은 재부팅.== `/etc/inittab`의 initdefault를 0이나 6으로 두면 부팅하자마자 꺼지거나 계속 재부팅한다. systemd의 PID 1은 `systemd`이지만 호환을 위해 `/sbin/init`도 systemd를 가리킨다.

> [!CHECK]
> **8.** 부팅 순서를 쓰시오: 커널, BIOS/UEFI, systemd, 부트로더.
>
> **9.** GRUB2 설정을 바꾸려면 어떤 파일을 고치고 어떤 명령을 실행하는가? (Red Hat 계열)
>
> **10.** LILO에서 `timeout=100`은 몇 초인가?
>
> **11.** 런레벨 3과 5에 해당하는 systemd 타깃은?

> [!PAGEBREAK]

## 기출 유형 연습

> [!QUIZ]
> MBR 방식 파티션에 대한 설명으로 옳지 않은 것은?
>
> **A.** 디스크 첫 섹터 512바이트 중 64바이트가 파티션 테이블이다.
>
> **B.** 주 파티션은 최대 4개까지 만들 수 있다.
>
> **C.** 논리 파티션은 확장 파티션 안에 만들며 번호는 5번부터 붙는다.
>
> **D.** 최대 128개의 파티션을 만들 수 있고 2TB 이상의 디스크를 지원한다.

> [!HINT 1]
> 128개와 2TB 초과는 MBR의 한계를 넘어선 다른 방식의 특징이다.

> [!ANSWER]
> **D.** 128개 파티션·대용량 디스크는 ==GPT==의 특징이다. MBR은 주 파티션 4개, 최대 2TiB다.

> [!QUIZ]
> 장치 파일 `/dev/sdb3`에 대한 설명으로 옳은 것은?
>
> **A.** 첫 번째 IDE 디스크의 세 번째 파티션
>
> **B.** 두 번째 SCSI(SATA) 디스크의 세 번째 파티션
>
> **C.** 세 번째 SCSI 디스크의 두 번째 파티션
>
> **D.** 두 번째 NVMe 컨트롤러의 세 번째 네임스페이스

> [!HINT 1]
> `sd`는 SCSI 방식 디스크, 문자는 a부터, 숫자는 1부터 센다.

> [!ANSWER]
> **B.** `sd` = SCSI·SATA·USB 디스크, `b` = 두 번째 디스크, `3` = 세 번째 파티션. IDE라면 `/dev/hd*`, NVMe라면 `/dev/nvme1n3` 같은 형태다.

> [!QUIZ]
> 다음 중 저널링 기능을 지원하지 않는 파일 시스템은?
>
> **A.** ext2
>
> **B.** ext3
>
> **C.** xfs
>
> **D.** ReiserFS

> [!HINT 1]
> ext3은 이 파일 시스템에 저널을 붙여 만든 것이다.

> [!ANSWER]
> **A. ext2**. ext3은 ext2에 저널링을 추가한 것(`tune2fs -j`), xfs·ReiserFS도 저널링 파일 시스템이다.

> [!QUIZ]
> GRUB2의 설정을 변경하는 올바른 방법은? (Red Hat 계열 기준)
>
> **A.** `/boot/grub2/grub.cfg`를 직접 수정한 뒤 재부팅한다.
>
> **B.** `/etc/lilo.conf`를 수정한 뒤 `lilo` 명령을 실행한다.
>
> **C.** `/etc/default/grub`를 수정한 뒤 `grub2-mkconfig -o /boot/grub2/grub.cfg`를 실행한다.
>
> **D.** `/etc/inittab`을 수정한 뒤 `telinit q`를 실행한다.

> [!HINT 1]
> grub.cfg는 "자동 생성되는" 파일이다.

> [!ANSWER]
> **C.** grub.cfg는 `/etc/default/grub`와 `/etc/grub.d/` 스크립트로부터 생성되므로 직접 고치면 다음 생성 때 덮어써진다. B는 LILO, D는 SysV 런레벨 설정이다.

> [!QUIZ]
> 리눅스 부팅 과정을 순서대로 바르게 나열한 것은?
>
> **A.** BIOS/UEFI → 커널 → 부트로더 → systemd
>
> **B.** BIOS/UEFI → 부트로더 → 커널 → systemd
>
> **C.** 부트로더 → BIOS/UEFI → systemd → 커널
>
> **D.** BIOS/UEFI → systemd → 부트로더 → 커널

> [!HINT 1]
> 커널을 메모리에 올리는 것이 부트로더의 일이다.

> [!ANSWER]
> **B.** 펌웨어(POST) → 부트로더(GRUB2)가 커널·initramfs 적재 → 커널 초기화 → PID 1 systemd가 서비스 시작.

> [!QUIZ]
> 시스템을 부팅할 때 그래픽 로그인 대신 텍스트 모드 다중 사용자 환경으로 시작하도록 바꾸는 명령은?
>
> **A.** `systemctl set-default multi-user.target`
>
> **B.** `systemctl set-default graphical.target`
>
> **C.** `systemctl isolate rescue.target`
>
> **D.** `systemctl get-default`

> [!HINT 1]
> 런레벨 3에 해당하는 타깃을 "기본값"으로 저장해야 한다.

> [!ANSWER]
> **A.** `multi-user.target`이 런레벨 3이다. B는 런레벨 5, C는 지금 바로 단일 사용자(복구) 모드로 전환, D는 확인만 한다.

> [!QUIZ]
> GRUB Legacy 설정에서 `root (hd0,0)`이 가리키는 것은?
>
> **A.** 첫 번째 디스크의 첫 번째 파티션
>
> **B.** 첫 번째 디스크 전체
>
> **C.** 두 번째 디스크의 첫 번째 파티션
>
> **D.** 첫 번째 디스크의 두 번째 파티션

> [!HINT 1]
> GRUB Legacy는 디스크와 파티션을 모두 0부터 센다.

> [!ANSWER]
> **A.** GRUB Legacy의 `(hd0,0)`은 `/dev/sda1`에 해당한다. GRUB2에서는 같은 파티션을 `(hd0,1)`로 쓴다.

> [!PAGEBREAK]

## 단원 마무리

| 주제 | 꼭 기억할 것 |
| --- | --- |
| 설치 유형 | DVD/USB, 네트워크(PXE), 킥스타트 = Red Hat 자동 설치(`/root/anaconda-ks.cfg`), 텍스트 모드, 듀얼 부팅 |
| 장치 이름 | ==hda 1차 마스터 · hdb 1차 슬레이브 · hdc 2차 마스터==, sdb3, nvme0n1p1, vda, UUID·LABEL(`blkid`) |
| MBR | ==blue:446 + 64 + 2 = 512바이트==, 주 파티션 4개, 확장 1개, 논리 5번부터, 2TiB |
| GPT | 128개, 보호 MBR + 헤더 + 백업 헤더, UEFI, 대용량 |
| 파티션 ID | 83 Linux · 82 swap · 8e LVM · 5 Extended · fd RAID |
| 스왑·LVM | 스왑 RAM 1–2배(전통적), ==blue:PV → VG → LV==, PE 4MiB |
| 파일 시스템 | ==red:ext2·vfat 저널링 X==, ext3 = ext2 + 저널, ext4 extent·1EiB/16TiB, xfs RHEL 기본, btrfs 스냅샷 |
| 부팅 | ==blue:BIOS/UEFI(POST) → 부트로더 → 커널+initramfs → systemd(PID 1) → 타깃 → 로그인== |
| 부트로더 | LILO `/etc/lilo.conf` + `lilo` 재실행 · GRUB `(hd0,0)` · GRUB2 `/etc/default/grub` → `grub2-mkconfig`, `(hd0,1)` |
| 런레벨 | ==blue:0 종료 · 1 단일 · 3 텍스트 · 5 그래픽 · 6 재부팅==, multi-user.target / graphical.target |

## 책을 덮고 꺼내 보기

- MBR의 첫 섹터는 부트 코드 {{446}}바이트, 파티션 테이블 {{64}}바이트, 시그니처 {{2}}바이트로 나뉜다.
- MBR에서 논리 파티션 번호는 항상 {{5}}번부터 시작한다.
- `/dev/nvme0n1p2`는 0번 컨트롤러, {{1번 네임스페이스}}, 2번 파티션이다.
- 포맷할 때 만들어지는 128비트 고유 식별자는 {{UUID}}이고 `blkid`로 확인한다.
- LVM은 {{PV}} → {{VG}} → {{LV}} 순서로 만든다.
- ext2를 ext3으로 바꾸는 명령은 {{tune2fs -j}}이다.
- RHEL 7 이후의 기본 파일 시스템은 {{xfs}}이다.
- GRUB2에서 사용자가 편집하는 설정 파일은 {{/etc/default/grub}}이다.
- 설정을 바꾼 뒤 다시 명령을 실행해야 MBR에 반영되는 부트로더는 {{LILO}}다.
- 런레벨 5에 해당하는 systemd 타깃은 {{graphical.target}}이다.

> [!FLASHCARD]
> Q: MBR과 GPT의 핵심 차이 네 가지는?
> A: 파티션 수(MBR 주 4개 / GPT 128개), 최대 디스크(2TiB / 사실상 무제한), 테이블 보관(1벌 / 앞뒤 2벌+CRC), 짝을 이루는 펌웨어(BIOS / UEFI).

> [!FLASHCARD]
> Q: IDE 디스크 hda·hdb·hdc·hdd는 각각 어디에 연결된 것인가?
> A: hda 1차 마스터, hdb 1차 슬레이브, hdc 2차 마스터, hdd 2차 슬레이브.

> [!FLASHCARD]
> Q: fdisk 파티션 ID 83, 82, 8e, 5는?
> A: 83 Linux, 82 Linux swap, 8e Linux LVM, 5 Extended(확장 파티션).

> [!FLASHCARD]
> Q: 저널링이란 무엇이고 어떤 이점이 있는가?
> A: 파일 시스템을 바꾸기 전에 변경 내용을 저널 영역에 먼저 기록하는 방식. 비정상 종료 후 저널만 재적용하면 되므로 복구가 빠르고 일관성이 유지된다.

> [!FLASHCARD]
> Q: ext4와 xfs의 대표 특징은?
> A: ext4 — extent 기반, 지연 할당, 볼륨 최대 1EiB·파일 최대 16TiB, ext3 하위 호환. xfs — SGI 개발 64비트 고성능 FS, RHEL 7 이후 기본, 확장은 되지만 축소 불가.

> [!FLASHCARD]
> Q: 리눅스 부팅 과정은?
> A: 전원 → BIOS/UEFI(POST) → 부트로더(MBR 부트 코드 또는 ESP의 .efi → GRUB2) → 커널과 initramfs 적재 → 커널 초기화·루트 마운트 → systemd(PID 1) → 기본 타깃 → 로그인.

> [!FLASHCARD]
> Q: LILO, GRUB Legacy, GRUB2의 설정 파일은?
> A: LILO /etc/lilo.conf(수정 후 lilo 실행), GRUB Legacy /boot/grub/grub.conf(또는 menu.lst), GRUB2 /etc/default/grub를 고쳐 grub2-mkconfig로 /boot/grub2/grub.cfg 생성.

> [!FLASHCARD]
> Q: 런레벨 0·1·3·5·6과 systemd 타깃은?
> A: 0 poweroff.target(종료), 1 rescue.target(단일 사용자), 3 multi-user.target(텍스트 다중 사용자), 5 graphical.target(GUI), 6 reboot.target(재부팅).

**다음으로 갈 기준:** fdisk 출력 한 장을 보고 파티션 종류·번호를 설명하고, 부팅 순서와 런레벨 표를 빈 종이에 다시 그릴 수 있으면 다음 편으로 간다: [3편 · 기본 명령어 (1) 사용자 계정과 권한](/lectures/grade-mukhnzii/semester-certificate/subject-linux-master-2/lecture-03).

> [!PAGEBREAK]

## 정답과 해설

1. **2차(Secondary) IDE 채널의 마스터** 디스크. (hda 1차 마스터, hdb 1차 슬레이브, hdd 2차 슬레이브)
2. **부트 코드 446바이트 + 파티션 테이블 64바이트(16바이트 × 4) + 부트 시그니처 2바이트(`0x55AA`)**.
3. **5번**. 확장 파티션이 3번이어도 논리 파티션은 항상 5번부터다.
4. **PV(pvcreate) → VG(vgcreate) → LV(lvcreate)**, 그다음 LV에 파일 시스템을 만든다.
5. **ext2** — `tune2fs -j`로 저널을 추가하면 ext3이 된다. (vfat도 저널링이 없다.)
6. **ordered** 모드 — 메타데이터만 저널에 기록하되 데이터를 먼저 디스크에 쓴다.
7. **vfat(FAT32)** — EFI 시스템 파티션(ESP).
8. **BIOS/UEFI → 부트로더 → 커널 → systemd**.
9. **`/etc/default/grub`** 를 고친 뒤 **`grub2-mkconfig -o /boot/grub2/grub.cfg`** 를 실행한다.
10. **10초** — LILO의 timeout은 0.1초 단위다.
11. 런레벨 3은 **multi-user.target**, 5는 **graphical.target**.
