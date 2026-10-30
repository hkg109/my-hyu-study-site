---
title: "5편 · 파일 시스템 명령어와 물리 구조"
description: "2과목 1장. mount·umount와 /etc/fstab 6개 필드, fdisk·parted·mkfs·mke2fs·fsck·e2fsck·tune2fs·df·du·blkid·lsblk, 디스크 쿼터, 부트 블록·슈퍼 블록·아이노드·데이터 블록과 블록 그룹, FHS 디렉터리 계층까지 시험 포인트 중심으로 정리합니다."
order: 5
published: true
duration: 90
tags: [리눅스마스터 2급, 자격증, 2과목, 파일 시스템, mount, fstab, 아이노드, FHS]
objectives:
  - mount·umount 옵션과 /etc/fstab의 6개 필드를 순서대로 설명한다.
  - 파티션 생성(fdisk·parted)부터 파일 시스템 생성(mkfs)·점검(fsck)·조정(tune2fs)·사용량 확인(df·du)까지 명령을 고른다.
  - 디스크 쿼터의 설정 절차와 soft·hard limit, 유예 기간을 설명한다.
  - 부트 블록·슈퍼 블록·아이노드·데이터 블록의 역할과 FHS 주요 디렉터리의 용도를 말한다.
---

## 학습 경로 · 2과목 1장

[← 4편 · 디렉터리·파일 조작과 기타 필수 명령어](/lectures/grade-mukhnzii/semester-certificate/subject-linux-master-2/lecture-04) · [다음: 6편 · 셸 — 개념·환경 변수·히스토리·프롬프트 →](/lectures/grade-mukhnzii/semester-certificate/subject-linux-master-2/lecture-06)

**범위:** 2과목 1장 "파일 시스템" — 마운트와 /etc/fstab, 파티션·파일 시스템 생성과 점검 명령, 디스크 사용량, 디스크 쿼터, 파일 시스템의 물리적 구조, 디렉터리 계층 구조(FHS).

**형광펜 읽는 법:** ==yellow:노랑== 핵심 정의·결론 · ==red:빨강== 시험에서 헷갈리는 구분·함정 · ==blue:파랑== 외워야 할 순서·목록

> [!EXAM]
> **이 장의 핵심 질문:** 새 디스크 한 장을 꽂았을 때, 어떤 순서로 나누고·포맷하고·붙여야 쓸 수 있고, 그 안에서 파일 하나는 실제로 어떤 블록에 어떻게 기록되는가?
>
> **전체 흐름:** ==blue:파티션 나누기(fdisk·parted) → 파일 시스템 만들기(mkfs·mke2fs) → 붙이기(mount, /etc/fstab) → 점검·조정(fsck·e2fsck·tune2fs) → 사용량·제한(df·du·quota) → 안쪽 구조(부트·슈퍼 블록·아이노드·데이터 블록) → 디렉터리 지도(FHS)==

---

## 단원 도입

| 출제 포인트 | 빈도 | 이렇게 나온다 |
|---|:---:|---|
| /etc/fstab 6개 필드와 dump·pass 값 | ★★★ | "5번째 필드 의미", 루트의 pass 값 |
| mount 옵션 (-t, -o ro·remount·loop, -a) | ★★★ | ISO 이미지 마운트, 읽기 전용 재마운트 |
| 슈퍼 블록·아이노드에 들어 있는 정보 | ★★★ | 아이노드에 "없는" 정보(파일 이름) 고르기 |
| FHS 디렉터리 용도 (/etc /var /proc /boot /dev …) | ★★★ | 로그 파일 위치, 가상 파일 시스템 |
| df vs du, 옵션 (-h, -T, -i, -s) | ★★ | 파일 시스템 형식까지 표시 |
| fsck·e2fsck 옵션 (-f, -y, -n, -b) | ★★ | 백업 슈퍼 블록으로 복구 |
| tune2fs (-j, -l, -c, -i, -L) | ★★ | ext2 → ext3 변환 |
| 디스크 쿼터 절차와 명령 | ★★ | quotacheck → edquota → quotaon 순서 |
| fdisk 내부 명령과 파티션 ID (83, 82, 8e) | ★★ | 스왑 파티션 ID |
| blkid·lsblk·mkswap·swapon | ★ | UUID 확인 명령 |

> [!PAGEBREAK]

## PART 1 · 마운트와 /etc/fstab

## 1. mount · umount

### 핵심 필기

- **마운트(mount):** 장치(파티션, CD, USB, 이미지 파일, 원격 공유)의 파일 시스템을 ==yellow:디렉터리 트리의 한 지점(마운트 포인트)에 붙이는 것==. 리눅스는 드라이브 문자 없이 하나의 트리만 쓴다.
- 현재 마운트 상태: `mount`(인자 없이), `/proc/mounts`, `/etc/mtab`, `findmnt`, `df`.

| 형식 / 옵션 | 뜻 |
|---|---|
| `mount [-t 형식] [-o 옵션] 장치 디렉터리` | 기본 형식 |
| `-t` | 파일 시스템 종류: ext4, xfs, vfat(FAT32), ntfs, iso9660(CD·DVD), nfs, cifs |
| `-o` | 마운트 옵션(아래 표), 쉼표로 여러 개 |
| `-a` | ==yellow:/etc/fstab에 있는 것을 모두 마운트== (noauto 제외) |
| `-r` / `-w` | 읽기 전용(-o ro) / 읽기·쓰기 |
| `-L 라벨` / `-U UUID` | 라벨·UUID로 장치 지정 |
| `umount 장치 또는 디렉터리` | 해제. `-f` 강제(응답 없는 NFS), `-l` lazy(사용이 끝나면 해제), `-a` 모두 |

**-o 마운트 옵션**

| 옵션 | 뜻 |
|---|---|
| `defaults` | ==blue:rw, suid, dev, exec, auto, nouser, async== 를 한꺼번에 |
| `ro` / `rw` | 읽기 전용 / 읽기·쓰기 |
| `remount` | ==yellow:해제하지 않고 옵션만 바꿔 다시 마운트== |
| `loop` | 이미지 파일(ISO 등)을 장치처럼 마운트 |
| `noexec` / `exec` | 실행 파일 실행 금지 / 허용 |
| `nosuid` / `suid` | SetUID·SetGID 무시 / 허용 |
| `nodev` | 장치 파일 해석 안 함 |
| `auto` / `noauto` | `mount -a`(부팅 시) 자동 마운트 여부 |
| `user` / `nouser` | 일반 사용자 마운트 허용 / root만 |
| `usrquota` / `grpquota` | 사용자 / 그룹 쿼터 사용 |
| `sync` / `async` | 동기 / 비동기 쓰기 |

```bash
# mount -t ext4 /dev/sdb1 /data
# mount -t iso9660 -o loop,ro rocky.iso /mnt/iso
# mount -t vfat /dev/sdc1 /media/usb
# mount -o remount,ro /data
# mount | grep /data
/dev/sdb1 on /data type ext4 (ro,relatime)
# umount /data
umount: /data: target is busy.        # 누군가 그 안에서 작업 중
# fuser -km /data; umount /data       # 사용 중인 프로세스를 끝내고 해제
```

> [!TRAP]
> ==red:마운트 포인트 디렉터리에 원래 파일이 있었다면 마운트하는 동안 가려져 보이지 않는다(삭제되는 것이 아님).== 해제하면 다시 보인다. 또 해제 명령은 unmount가 아니라 ==red:umount==(n이 없다). 사용 중이면 "target is busy"로 실패하므로 그 디렉터리에서 cd로 빠져나온다.

## 2. /etc/fstab — 부팅 때 자동 마운트할 목록

### 핵심 필기

```bash
$ cat /etc/fstab
UUID=8e2c...  /           xfs     defaults                    0 0
UUID=4a1f...  /boot       xfs     defaults                    0 0
/dev/mapper/rl-swap none  swap    defaults                    0 0
/dev/sdb1     /data       ext4    defaults,usrquota,grpquota  1 2
LABEL=BACKUP  /backup     ext4    defaults,noauto             0 0
```

| 순서 | 필드 | 예 | 뜻 |
|:---:|---|---|---|
| 1 | 장치 | /dev/sdb1, UUID=…, LABEL=… | 마운트할 장치 |
| 2 | 마운트 포인트 | /data | 붙일 디렉터리 (스왑은 none 또는 swap) |
| 3 | 파일 시스템 종류 | ext4, xfs, swap, vfat, nfs | |
| 4 | 옵션 | defaults,usrquota | mount -o와 같은 옵션 |
| 5 | ==yellow:dump== | 0 또는 1 | dump 백업 대상 여부 (1 = 백업, 0 = 안 함) |
| 6 | ==yellow:fsck 순서(pass)== | 0, 1, 2 | 부팅 시 점검 순서: ==red:1 = 루트(/), 2 = 그 밖, 0 = 점검 안 함== |

- 장치 이름(/dev/sdb1)은 디스크 순서가 바뀌면 달라질 수 있어 요즘은 **UUID**나 **LABEL**을 주로 쓴다. 확인은 `blkid`, `lsblk -f`.
- fstab을 고친 뒤 `mount -a`로 오류 없이 붙는지 확인한다(오타가 있으면 부팅 실패 가능).

> [!TRAP]
> ==red:5번째 필드는 dump(백업), 6번째 필드가 fsck 순서다.== 루트 파일 시스템의 6번째 값은 1, 나머지 점검 대상은 2. 순서를 "장치 → 어디에 → 무엇으로 → 어떻게 → 백업 → 점검"으로 외운다.

> [!CHECK]
> **1.** ISO 이미지 파일 /root/a.iso를 /mnt/cd에 읽기 전용으로 마운트하는 명령을 쓰시오.
>
> **2.** /etc/fstab에서 부팅 시 fsck 점검 순서를 정하는 필드는 몇 번째이고, 루트 파일 시스템의 값은?

> [!PAGEBREAK]

## PART 2 · 파티션과 파일 시스템 관리 명령

## 3. 파티션 나누기 — fdisk · parted

### 핵심 필기

- **fdisk:** 주로 MBR(dos) 파티션 편집, 대화형. 최근 버전은 GPT도 다룬다. `fdisk -l`로 전체 디스크·파티션 목록.
- **parted / gdisk:** ==yellow:2TB 이상 디스크·GPT==에 쓴다. parted는 `mklabel gpt`, `mkpart`, `print`, `rm` 등.

| fdisk 내부 명령 | 뜻 |
|:---:|---|
| m | 도움말 |
| p | 파티션 테이블 출력 |
| n | 새 파티션 (primary / extended) |
| d | 파티션 삭제 |
| t | 파티션 타입(ID) 변경 |
| l | 타입 목록 |
| a | 부팅 가능 표시 |
| w | ==yellow:저장하고 종료== |
| q | ==red:저장하지 않고 종료== |

| 파티션 ID | 종류 |
|:---:|---|
| 83 | ==blue:Linux== |
| 82 | ==blue:Linux swap== |
| 8e | ==blue:Linux LVM== |
| fd | Linux raid autodetect |
| 5 | Extended (확장) |
| 7 | HPFS/NTFS/exFAT |
| b, c | W95 FAT32 |
| ee | GPT 보호 MBR |

```bash
# fdisk -l /dev/sdb
Disk /dev/sdb: 10 GiB, 10737418240 bytes, 20971520 sectors
Units: sectors of 1 * 512 = 512 bytes
Disklabel type: dos

Device     Boot    Start      End  Sectors Size Id Type
/dev/sdb1           2048 10487807 10485760   5G 83 Linux
/dev/sdb2       10487808 12584959  2097152   1G 82 Linux swap / Solaris
```

## 4. 파일 시스템 만들기 — mkfs · mke2fs · mkswap

| 명령 | 뜻 |
|---|---|
| `mkfs -t ext4 /dev/sdb1` | ext4 생성 (형식 생략 시 ext2) |
| `mkfs.ext4 /dev/sdb1` | 위와 같음 (mkfs.xfs, mkfs.vfat …) |
| `mke2fs -t ext4 /dev/sdb1` | ext 계열 전용 생성 명령, `-j` 저널 추가(ext3), `-b` 블록 크기, `-L` 라벨 |
| `mkswap /dev/sdb2` | 스왑 영역 생성 → `swapon /dev/sdb2`로 사용, `swapoff`로 중지, `swapon -s` 또는 `free`로 확인 |

```bash
# truncate -s 64M disk.img           # 실습용 이미지 파일
# mke2fs -t ext4 -L DATA disk.img
mke2fs 1.47.0 (5-Feb-2023)
Creating filesystem with 16384 4k blocks and 16384 inodes
Allocating group tables: done
Writing inode tables: done
Creating journal (1024 blocks): done
Writing superblocks and filesystem accounting information: done
# blkid disk.img
disk.img: LABEL="DATA" UUID="2933c660-98da-4d3f-b0b0-08d36e66129e" BLOCK_SIZE="4096" TYPE="ext4"
```

> [!TRAP]
> ==red:mkfs에 -t를 빼면 기본은 ext2다.== 그리고 파일 시스템을 만드는(포맷) 순간 그 파티션의 기존 데이터는 사라진다. 순서는 항상 ==blue:파티션(fdisk) → 포맷(mkfs) → 마운트(mount) → 자동화(fstab)==.

## 5. 점검과 조정 — fsck · e2fsck · tune2fs · dumpe2fs

**fsck / e2fsck** — 파일 시스템 무결성 점검·복구. ==red:반드시 마운트 해제(또는 읽기 전용) 상태==에서 한다.

| 옵션 (e2fsck) | 뜻 |
|---|---|
| `-f` | 깨끗(clean)하다고 표시되어 있어도 ==강제 점검== |
| `-y` | 모든 질문에 yes (자동 복구) |
| `-n` | 모든 질문에 no — 고치지 않고 점검만 |
| `-p` | 안전한 문제는 묻지 않고 자동 복구 |
| `-b 블록` | ==yellow:백업 슈퍼 블록==으로 복구 |
| `-c` | 배드 블록 검사 |

- `fsck -t ext4 /dev/sdb1`은 내부적으로 fsck.ext4(=e2fsck)를 호출한다. 점검 중 발견한, 이름을 잃은 파일 조각은 ==yellow:/lost+found==에 놓인다.
- XFS는 `xfs_repair`를 쓴다.

```bash
# e2fsck -f -n big.img
e2fsck 1.47.0 (5-Feb-2023)
Pass 1: Checking inodes, blocks, and sizes
Pass 2: Checking directory structure
Pass 3: Checking directory connectivity
Pass 4: Checking reference counts
Pass 5: Checking group summary information
BACKUP: 11/32768 files (0.0% non-contiguous), 6262/131072 blocks
```

**tune2fs** — ext 계열의 설정값 조정 (포맷 없이)

| 옵션 | 뜻 |
|---|---|
| `-l` | 슈퍼 블록 정보 출력 (dumpe2fs -h와 비슷) |
| `-j` | ==yellow:저널 추가 → ext2를 ext3로== |
| `-c 횟수` | 몇 번 마운트하면 강제 점검할지 |
| `-i 기간` | 점검 주기 (d 일, w 주, m 월) |
| `-L 라벨` | 볼륨 라벨 변경 (e2label과 같은 효과) |
| `-m %` | root 예약 블록 비율 (기본 5%) |
| `-O 기능` | 파일 시스템 기능 켜기·끄기 |

```bash
# tune2fs -j big.img
Creating journal inode: done
# blkid big.img
big.img: UUID="490398c7-..." SEC_TYPE="ext2" BLOCK_SIZE="4096" TYPE="ext3"
# tune2fs -c 20 -i 1m -L BACKUP big.img
Setting maximal mount count to 20
Setting interval between checks to 2592000 seconds
```

- **dumpe2fs:** 슈퍼 블록과 블록 그룹 정보를 자세히 출력(백업 슈퍼 블록 위치 확인).

> [!TRAP]
> ==red:ext2 → ext3 변환은 다시 포맷하는 것이 아니라 tune2fs -j==(데이터 유지). 또 e2fsck -n은 "아무것도 고치지 않는다", -y는 "전부 고친다". 마운트된 상태에서 쓰기 점검을 하면 파일 시스템이 손상될 수 있다.

## 6. 장치 확인과 사용량 — blkid · lsblk · df · du

| 명령 | 뜻 / 옵션 |
|---|---|
| `blkid` | 장치의 ==UUID·LABEL·TYPE== |
| `lsblk` | 블록 장치를 트리로, `-f` 파일 시스템·UUID까지 |
| `df` | ==yellow:파일 시스템(파티션) 단위== 전체·사용·남은 용량. `-h` 읽기 쉬운 단위, `-T` 파일 시스템 종류, `-i` 아이노드 사용량, `-k`·`-m` 단위 |
| `du` | ==yellow:디렉터리·파일 단위== 사용량. `-s` 합계만, `-h`, `-a` 파일까지, `-c` 총합 줄, `-d n`(`--max-depth`) 깊이 |

```bash
$ df -hT /
Filesystem     Type  Size  Used Avail Use% Mounted on
/dev/vda       ext4  252G   13G   27G  32% /
$ df -i /
Filesystem       Inodes  IUsed    IFree IUse% Mounted on
/dev/vda       16777216 265528 16511688    2% /
$ du -sh docs
5.1M	docs
$ lsblk
NAME   MAJ:MIN RM  SIZE RO TYPE MOUNTPOINTS
sda      8:0    0   20G  0 disk
├─sda1   8:1    0    1G  0 part /boot
└─sda2   8:2    0   19G  0 part /
sdb      8:16   0   10G  0 disk
└─sdb1   8:17   0    5G  0 part /data
```

> [!TRAP]
> ==red:df는 "disk free"(파일 시스템 전체 여유), du는 "disk usage"(특정 디렉터리가 차지한 양).== "/home 디렉터리가 차지하는 총 용량"은 `du -sh /home`, "마운트된 파티션별 남은 공간"은 `df -h`. 용량이 남았는데 파일을 못 만들면 `df -i`로 아이노드 고갈을 확인한다.

> [!CHECK]
> **3.** ext2 파일 시스템 /dev/sdb1을 데이터를 지우지 않고 ext3로 바꾸는 명령은?
>
> **4.** 주 슈퍼 블록이 손상된 ext4를 32768번 블록의 백업 슈퍼 블록으로 점검하는 명령은?
>
> **5.** 각 파일 시스템의 종류(Type)까지 함께 보여 주는 df 옵션은?

## 7. 디스크 쿼터 (Disk Quota)

### 핵심 필기

- 사용자·그룹별로 ==yellow:쓸 수 있는 용량(블록)과 파일 개수(아이노드)를 제한==하는 기능.
- **soft limit:** 넘으면 경고, ==유예 기간(grace period, 기본 7일)== 동안은 허용. **hard limit:** 절대 넘을 수 없는 한도.

**설정 절차**

==blue:① fstab에 usrquota·grpquota 추가 → ② remount → ③ quotacheck로 DB 생성 → ④ quotaon → ⑤ edquota로 한도 지정 → ⑥ repquota로 확인==

```bash
# vi /etc/fstab
/dev/sdb1  /data  ext4  defaults,usrquota,grpquota  1 2
# mount -o remount /data
# quotacheck -avugm          # /data/aquota.user, aquota.group 생성
# quotaon -avug
# edquota -u kim
Disk quotas for user kim (uid 1000):
  Filesystem   blocks   soft    hard   inodes  soft  hard
  /dev/sdb1        24  51200   61440        6     0     0
# edquota -p kim lee         # kim의 설정을 lee에게 복사
# edquota -t                 # 유예 기간 변경
# repquota -a                # 전체 사용자 쿼터 보고서
# quota -u kim               # 한 사용자 확인
```

| 명령 | 뜻 |
|---|---|
| quotacheck | 사용량을 조사해 쿼터 파일(aquota.user, aquota.group) 생성·갱신. `-a` 전체, `-u` 사용자, `-g` 그룹, `-m` 재마운트 없이, `-v` 자세히 |
| quotaon / quotaoff | 쿼터 켜기 / 끄기 |
| edquota | 한도 편집 (`-u` 사용자, `-g` 그룹, `-p` 복사, `-t` 유예 기간) |
| setquota | 명령 한 줄로 한도 지정 (스크립트용) |
| quota | 사용자의 쿼터 현황 |
| repquota | 파일 시스템 전체 쿼터 보고서 |

> [!TRAP]
> ==red:edquota에서 blocks 단위는 KB(1K 블록)==다. 51200 = 50MB. 또 soft·hard 값이 0이면 "제한 없음"이다. 쿼터는 파일 시스템(파티션) 단위로 걸린다.

> [!PAGEBREAK]

## PART 3 · 파일 시스템의 물리 구조와 디렉터리 계층

## 8. 블록 구조 — 부트 블록 · 슈퍼 블록 · 아이노드 · 데이터 블록

### 핵심 필기

| 영역 | 들어 있는 것 |
|---|---|
| **부트 블록(Boot block)** | 파일 시스템 맨 앞. ==yellow:부팅에 필요한 부트 로더 코드== |
| **슈퍼 블록(Super block)** | ==yellow:파일 시스템 전체 정보== — 블록 크기, 전체·빈 블록 수, 전체·빈 아이노드 수, 블록 그룹당 블록·아이노드 수, 마운트 횟수, 마지막 점검 시각, 매직 넘버. 손상 대비 ==여러 블록 그룹에 백업 사본== |
| **아이노드(Inode)** | ==yellow:파일 하나의 메타데이터== — 파일 종류·권한, 소유자 UID·GID, 크기, 시간(atime·mtime·ctime), 하드 링크 수, 데이터 블록 주소(포인터) |
| **데이터 블록(Data block)** | 실제 파일 내용. 디렉터리의 경우 "이름 → 아이노드 번호" 목록 |

- **아이노드의 블록 포인터(ext2/3):** 직접 블록 12개 + 단일 간접 + 이중 간접 + 삼중 간접 블록. (ext4는 extent 방식)
- **파일 이름은 아이노드에 없다.** 이름은 ==red:디렉터리의 데이터 블록(디렉터리 엔트리)==에 아이노드 번호와 짝지어 저장된다. 그래서 하드 링크(이름 하나 더)가 가능하다.
- 루트 디렉터리(/)의 아이노드 번호는 ==2==, ext 계열의 lost+found는 보통 11이다.

```bash
$ stat hard.txt
  File: hard.txt
  Size: 6               Blocks: 8          IO Block: 4096   regular file
Device: 254,0   Inode: 1729015     Links: 2
Access: (0644/-rw-r--r--)  Uid: (    0/    root)   Gid: (    0/    root)
Access: 2026-10-30 17:20:40.454747095 +0000
Modify: 2026-10-30 17:20:40.421192034 +0000
Change: 2026-10-30 17:20:40.436968594 +0000
$ stat -c '%i %n' /
2 /
```

**블록 그룹(ext2/3/4)** — 디스크를 여러 그룹으로 나눠 관련 데이터를 가까이 둔다.

==blue:슈퍼 블록(사본) → 그룹 디스크립터 → 블록 비트맵 → 아이노드 비트맵 → 아이노드 테이블 → 데이터 블록==

| 구성 | 역할 |
|---|---|
| 그룹 디스크립터 | 각 그룹의 비트맵·아이노드 테이블 위치, 빈 블록·아이노드 수 |
| 블록 비트맵 | 데이터 블록 사용 여부를 1비트씩 표시 |
| 아이노드 비트맵 | 아이노드 사용 여부를 1비트씩 표시 |
| 아이노드 테이블 | 아이노드들이 실제로 저장된 곳 |

```bash
# dumpe2fs big.img | grep -E '^Group [0-3]|superblock at'
Group 0: (Blocks 0-32767)
  Primary superblock at 0, Group descriptors at 1-1
Group 1: (Blocks 32768-65535)
  Backup superblock at 32768, Group descriptors at 32769-32769
Group 2: (Blocks 65536-98303)
Group 3: (Blocks 98304-131071)
  Backup superblock at 98304, Group descriptors at 98305-98305
```

[![ext 파일 시스템을 부트 블록과 블록 그룹 0·1·…로 나누고, 한 블록 그룹 안의 슈퍼 블록·그룹 디스크립터·블록 비트맵·아이노드 비트맵·아이노드 테이블·데이터 블록을 펼친 뒤, 디렉터리 엔트리의 이름이 아이노드 번호를 거쳐 데이터 블록을 찾아가는 경로를 그린 그림](/materials/diagrams/lm2-l05a-fs-structure.svg)](/materials/diagrams/lm2-l05a-fs-structure.svg)

*그림 5-1 · ext 파일 시스템의 물리 구조와 파일 찾아가기 — 누르면 원본 크기로 열린다.*

> [!NOTE]
> - **읽는 순서:** 맨 위 띠(디스크 전체) → 블록 그룹 하나를 확대한 둘째 띠 → 아래 흐름(이름 → 아이노드 → 데이터)을 따라간다.
> - **핵심:** 슈퍼 블록은 ==파일 시스템 전체==, 아이노드는 ==파일 하나==의 정보다. 이름은 디렉터리에만 있다.
> - **시험 포인트:** "아이노드에 저장되지 않는 것" = 파일 이름. 백업 슈퍼 블록은 `e2fsck -b`로 쓴다.

**주요 파일 시스템 한 줄 정리** (2편 내용 복습)

| 종류 | 특징 |
|---|---|
| ext2 | 저널링 없음 |
| ext3 | ext2 + ==저널링== |
| ext4 | 대용량(최대 1EB 볼륨, 16TB 파일), extent, 지연 할당 |
| xfs | 고성능 64비트 저널링, RHEL 7 이후 기본 |
| btrfs | 스냅샷·서브볼륨·체크섬 (B-tree, CoW) |
| vfat | FAT32 호환(USB) |
| iso9660 | CD-ROM |
| swap | 가상 메모리 |
| proc, sysfs, tmpfs | 디스크에 없는 가상 파일 시스템 |

> [!TRAP]
> ==red:슈퍼 블록 = 파일 시스템 전체 정보, 아이노드 = 개별 파일 정보.== 보기에서 "파일 시스템의 전체 블록 수"를 아이노드에, "파일 소유자"를 슈퍼 블록에 넣어 섞는다. 그리고 아이노드에는 파일 이름이 없다.

> [!CHECK]
> **6.** 다음 중 아이노드에 저장되지 않는 정보를 고르시오: 파일 크기, 파일 이름, 소유자 UID, 링크 수, 수정 시간.
>
> **7.** 슈퍼 블록의 백업 사본이 여러 블록 그룹에 있는 이유는?

## 9. 디렉터리 계층 구조 — FHS

### 핵심 필기

**FHS(Filesystem Hierarchy Standard)** — 리눅스 배포판들이 따르는 디렉터리 배치 표준.

| 디렉터리 | 용도 |
|---|---|
| / | 루트, 모든 디렉터리의 시작 |
| /bin | 모든 사용자가 쓰는 ==기본 명령== (ls, cp, cat) |
| /sbin | ==시스템 관리 명령== (fdisk, mkfs, shutdown) |
| /boot | ==부팅 파일== — 커널(vmlinuz), initramfs, GRUB 설정 |
| /dev | ==장치 파일== (/dev/sda, /dev/null, /dev/tty) |
| /etc | ==설정 파일== (passwd, fstab, hosts) |
| /home | 일반 사용자 홈 디렉터리 |
| /root | ==root의 홈== 디렉터리 (/home 아래가 아님) |
| /lib, /lib64 | 공유 라이브러리, 커널 모듈(/lib/modules) |
| /media | USB·CD 등 이동식 장치 자동 마운트 |
| /mnt | 임시 마운트 포인트 |
| /opt | 추가(서드파티) 응용 프로그램 |
| /proc | ==커널·프로세스 정보를 보여 주는 가상 파일 시스템== (/proc/cpuinfo, /proc/meminfo, /proc/숫자) |
| /sys | 장치·드라이버 정보 가상 파일 시스템 (sysfs) |
| /run | 부팅 이후 실행 중 정보(PID 파일 등), tmpfs |
| /srv | 서비스(웹·FTP)가 제공하는 데이터 |
| /tmp | 임시 파일, Sticky Bit(1777) |
| /usr | 사용자 프로그램·라이브러리·문서 (/usr/bin, /usr/sbin, /usr/lib, /usr/share/man, /usr/local) |
| /var | ==자주 바뀌는 데이터== — /var/log(로그), /var/spool(메일·인쇄 대기열), /var/cache, /var/lib |
| /lost+found | fsck가 찾아낸 이름 잃은 파일 조각 (각 ext 파일 시스템 최상위) |

- 최근 배포판(RHEL 7 이후, Ubuntu 등)은 /bin, /sbin, /lib가 /usr 아래로 합쳐져 **심볼릭 링크**로 남아 있다(usrmerge).

```bash
$ ls -ld /bin
lrwxrwxrwx 1 root root 7 Apr 22  2024 /bin -> usr/bin
$ ls -ld /proc
dr-xr-xr-x 95 root root 0 Oct 28 23:08 /proc
$ head -3 /proc/meminfo
MemTotal:       16477352 kB
MemFree:        15020312 kB
MemAvailable:   15736544 kB
```

[![루트 디렉터리 아래 bin·sbin·boot·dev·etc·home·root·lib·media·mnt·opt·proc·sys·run·srv·tmp·usr·var를 실행 파일·설정·장치·사용자·가상 파일 시스템·변하는 데이터 묶음으로 나누어 용도를 붙인 FHS 지도](/materials/diagrams/lm2-l05b-fhs.svg)](/materials/diagrams/lm2-l05b-fhs.svg)

*그림 5-2 · FHS 디렉터리 지도 — 누르면 원본 크기로 열린다.*

> [!NOTE]
> - **읽는 순서:** 위의 / 에서 내려와 왼쪽 열(실행·장치·사용자)과 오른쪽 열(설정·변하는 데이터·가상) 묶음을 차례로 읽는다.
> - **핵심:** 설정은 /etc, 로그는 /var/log, 장치는 /dev, 커널 정보는 /proc. ==디스크에 실제로 없는 것==(proc, sys, run)은 따로 묶었다.
> - **시험 포인트:** root의 홈은 /root, 부팅 커널은 /boot, 이동식 매체는 /media, 임시 마운트는 /mnt.

> [!TRAP]
> ==red:/proc은 디스크 공간을 차지하지 않는 가상 파일 시스템==이다(크기 0으로 보인다). 로그는 /var/log(/etc가 아님), 관리자 홈은 /root(/home/root가 아님), 장치 파일은 /dev(/device가 아님).

> [!CHECK]
> **8.** 시스템 로그 파일과 메일 스풀이 위치하는 상위 디렉터리는?
>
> **9.** CPU 정보를 텍스트로 보여 주는 가상 파일의 경로를 쓰시오.

> [!PAGEBREAK]

## PART 4 · 기출 유형 연습

> [!QUIZ]
> /etc/fstab의 한 줄이 다음과 같다. 설명으로 옳지 않은 것은?
>
> ```bash
> /dev/sdb1  /data  ext4  defaults,usrquota  1 2
> ```
>
> **A.** /dev/sdb1을 /data에 ext4로 마운트한다.
>
> **B.** 사용자 쿼터를 사용할 수 있다.
>
> **C.** 다섯 번째 필드 1은 부팅 시 가장 먼저 fsck를 수행한다는 뜻이다.
>
> **D.** 여섯 번째 필드 2는 루트 파일 시스템 다음에 점검한다는 뜻이다.

> [!HINT 1]
> 다섯 번째는 dump, 여섯 번째가 pass다.

> [!ANSWER]
> **C.** 다섯 번째 필드 1은 dump 백업 대상이라는 뜻이다. fsck 순서는 여섯 번째 필드이고, 2는 루트(1) 다음에 점검한다.

> [!QUIZ]
> 현재 읽기 전용으로 마운트된 루트 파일 시스템을 해제하지 않고 읽기·쓰기로 바꾸는 명령은?
>
> **A.** `mount -o rw /`
>
> **B.** `mount -o remount,rw /`
>
> **C.** `umount / ; mount /`
>
> **D.** `mount -a rw /`

> [!HINT 1]
> 이미 마운트된 상태에서 옵션만 바꾸는 키워드가 필요하다.

> [!ANSWER]
> **B.** remount 옵션으로 해제 없이 다시 마운트한다. 루트는 사용 중이라 umount할 수 없다.

> [!QUIZ]
> 다음 중 아이노드(inode)에 저장되는 정보가 아닌 것은?
>
> **A.** 파일의 소유자와 그룹
>
> **B.** 파일의 접근 권한
>
> **C.** 파일의 이름
>
> **D.** 데이터 블록의 주소

> [!HINT 1]
> 하드 링크 두 개는 같은 아이노드를 쓰지만 이름은 다르다.

> [!ANSWER]
> **C.** 파일 이름은 디렉터리 엔트리(디렉터리의 데이터 블록)에 아이노드 번호와 함께 저장된다.

> [!QUIZ]
> 디스크 쿼터를 설정하는 과정에서 사용자별 사용량을 조사해 aquota.user 파일을 만드는 명령은?
>
> **A.** `edquota`
>
> **B.** `quotaon`
>
> **C.** `quotacheck`
>
> **D.** `repquota`

> [!HINT 1]
> 쿼터를 켜기(quotaon) 전에 먼저 현재 사용량을 "검사"해야 한다.

> [!ANSWER]
> **C.** quotacheck가 사용량을 조사해 쿼터 파일을 만든다. edquota는 한도 편집, quotaon은 활성화, repquota는 보고서.

> [!QUIZ]
> 다음 중 명령과 기능의 연결이 옳지 않은 것은?
>
> **A.** `du -sh /home` — /home 디렉터리가 사용하는 총 용량
>
> **B.** `df -i` — 파일 시스템별 아이노드 사용량
>
> **C.** `tune2fs -j /dev/sdb1` — ext2 파일 시스템에 저널을 추가
>
> **D.** `blkid` — 파일 시스템의 오류를 점검·복구

> [!HINT 1]
> 점검·복구는 fsck 계열이다.

> [!ANSWER]
> **D.** blkid는 장치의 UUID·LABEL·TYPE을 보여 준다. 점검·복구는 fsck / e2fsck.

> [!QUIZ]
> FHS 기준 디렉터리와 용도의 연결로 옳은 것은?
>
> **A.** /etc — 커널 이미지와 부트 로더 파일
>
> **B.** /var — 로그, 메일·인쇄 스풀처럼 자주 바뀌는 파일
>
> **C.** /proc — 이동식 장치를 마운트하는 디렉터리
>
> **D.** /boot — 시스템 설정 파일

> [!HINT 1]
> var = variable(변하는).

> [!ANSWER]
> **B.** A의 설명은 /boot, C는 /media, D는 /etc의 설명이다. /proc은 커널·프로세스 정보를 보여 주는 가상 파일 시스템.

> [!QUIZ]
> fdisk에서 새 파티션의 타입을 리눅스 스왑으로 바꾸려 한다. 사용하는 내부 명령과 타입 ID로 옳은 것은?
>
> **A.** n, 83
>
> **B.** t, 82
>
> **C.** t, 8e
>
> **D.** a, 82

> [!HINT 1]
> type의 t. 83은 Linux, 8e는 LVM이다.

> [!ANSWER]
> **B.** t로 타입을 바꾸고 82(Linux swap)를 입력한다. 저장하려면 마지막에 w.

> [!PAGEBREAK]

## 단원 마무리

| 주제 | 꼭 외울 것 |
|---|---|
| mount | -t 형식, -o ro·rw·remount·loop·noexec·nosuid·usrquota, -a(fstab 전부), umount -f -l |
| defaults | rw, suid, dev, exec, auto, nouser, async |
| /etc/fstab | 장치 · 마운트 포인트 · 형식 · 옵션 · dump(0/1) · pass(0, 1 = 루트, 2 = 기타) |
| 파티션 | fdisk(n p d t l w q), ID 83 Linux · 82 swap · 8e LVM · 5 확장, 2TB 이상·GPT는 parted·gdisk |
| 생성 | mkfs -t(기본 ext2), mkfs.ext4, mke2fs -t -j -L, mkswap → swapon |
| 점검·조정 | fsck·e2fsck -f -y -n -p -b(언마운트 상태), tune2fs -l -j -c -i -L -m, dumpe2fs |
| 확인 | blkid(UUID), lsblk -f, df -h -T -i(파일 시스템 단위), du -s -h -a(디렉터리 단위) |
| 쿼터 | fstab usrquota → remount → quotacheck → quotaon → edquota(-u -p -t) → repquota, soft·hard·grace |
| 물리 구조 | 부트 블록 · 슈퍼 블록(전체 정보, 백업) · 아이노드(파일 정보, 이름 없음) · 데이터 블록 |
| FHS | /etc 설정, /var 로그·스풀, /dev 장치, /proc 가상, /boot 커널, /root 관리자 홈, /tmp 1777 |

## 책을 덮고 꺼내 보기

- 부팅 시 자동으로 마운트할 파일 시스템 목록은 {{/etc/fstab}}에 적는다.
- fstab의 다섯 번째 필드는 {{dump}}, 여섯 번째 필드는 {{fsck 순서}}다.
- 마운트 해제 없이 옵션을 바꾸는 mount 옵션은 {{remount}}다.
- ext2에 저널을 추가해 ext3로 바꾸는 명령은 {{tune2fs -j}}다.
- 파일 시스템 전체 정보를 담고 백업 사본이 여러 블록 그룹에 있는 것은 {{슈퍼 블록}}이다.
- 파일 이름은 아이노드가 아니라 {{디렉터리 엔트리}}에 저장된다.
- 커널·프로세스 정보를 보여 주는 가상 파일 시스템은 {{/proc}}이다.

> [!FLASHCARD]
> Q: /etc/fstab의 6개 필드는?
> A: 장치(UUID·LABEL 가능), 마운트 포인트, 파일 시스템 종류, 옵션, dump 여부(0·1), fsck 순서(0 안 함, 1 루트, 2 기타).

> [!FLASHCARD]
> Q: mount의 defaults 옵션에 포함된 것은?
> A: rw, suid, dev, exec, auto, nouser, async.

> [!FLASHCARD]
> Q: e2fsck의 -f, -y, -n, -b 옵션은?
> A: -f 강제 점검, -y 모두 yes(자동 복구), -n 모두 no(점검만), -b 백업 슈퍼 블록 지정.

> [!FLASHCARD]
> Q: df와 du의 차이는?
> A: df는 마운트된 파일 시스템 단위의 전체·사용·여유 공간, du는 지정한 디렉터리·파일이 차지한 용량.

> [!FLASHCARD]
> Q: 디스크 쿼터 설정 순서는?
> A: fstab에 usrquota·grpquota 추가 → remount → quotacheck → quotaon → edquota로 한도 지정 → repquota·quota로 확인.

> [!FLASHCARD]
> Q: 슈퍼 블록과 아이노드에 들어 있는 정보는?
> A: 슈퍼 블록 — 블록 크기, 전체·빈 블록·아이노드 수, 마운트 횟수 등 파일 시스템 전체 정보. 아이노드 — 종류·권한, 소유자, 크기, 시간, 링크 수, 데이터 블록 주소(파일 이름 제외).

> [!FLASHCARD]
> Q: /bin, /sbin, /etc, /var, /proc, /boot의 용도는?
> A: /bin 기본 명령, /sbin 관리 명령, /etc 설정 파일, /var 로그·스풀 등 가변 데이터, /proc 커널·프로세스 가상 파일 시스템, /boot 커널과 부트 로더 파일.

**다음으로 갈 기준:** 새 디스크를 fdisk → mkfs → mount → fstab 순서로 붙이는 명령을 쓰고, fstab 한 줄의 여섯 필드를 설명할 수 있으면 다음 편으로 간다: [6편 · 셸 — 개념·환경 변수·히스토리·프롬프트](/lectures/grade-mukhnzii/semester-certificate/subject-linux-master-2/lecture-06).

> [!PAGEBREAK]

## 정답과 해설

1. `mount -t iso9660 -o loop,ro /root/a.iso /mnt/cd` (`-t iso9660`은 생략해도 대개 자동 인식).
2. **6번째 필드(pass)**, 루트 파일 시스템은 **1**.
3. `tune2fs -j /dev/sdb1` — 저널을 추가하면 ext3가 된다. 이후 fstab의 형식도 ext3로 바꾼다.
4. `e2fsck -b 32768 /dev/sdb1` (언마운트 상태에서).
5. `df -T` (흔히 `df -hT`).
6. **파일 이름** — 이름은 디렉터리 엔트리에 있다.
7. 슈퍼 블록이 손상되면 파일 시스템 전체를 읽을 수 없으므로, 여러 블록 그룹에 사본을 두어 `e2fsck -b`로 복구할 수 있게 하기 위해서다.
8. **/var** — /var/log, /var/spool/mail.
9. **/proc/cpuinfo**
