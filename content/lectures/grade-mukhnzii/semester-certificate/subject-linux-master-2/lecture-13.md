---
title: "13편 · 인터넷 활용 (2) 네트워크 서비스와 인터페이스"
description: "3과목 2장 뒷부분. 메일(SMTP·POP3·IMAP, MTA·MUA·MDA), FTP 능동·수동 모드, DNS 레코드와 조회 명령, 원격 접속, NFS·Samba 파일 공유, 잘 알려진 포트, ifconfig·ip·nmcli·route·ss 등 네트워크 인터페이스 명령과 설정 파일을 정리합니다."
order: 13
published: true
duration: 100
tags: [리눅스마스터 2급, 자격증, 3과목, 네트워크 서비스, DNS, FTP, NFS, Samba, 포트 번호, ip 명령]
objectives:
  - 메일 프로토콜(SMTP·POP3·IMAP)과 MTA·MUA·MDA의 역할, 대표 프로그램을 짝짓는다.
  - FTP 능동·수동 모드의 연결 방향과 포트를 설명하고 SFTP·scp와 구분한다.
  - DNS 레코드 종류, /etc/hosts·/etc/resolv.conf, nslookup·dig·host의 쓰임을 말한다.
  - NFS(/etc/exports)·Samba(smb.conf) 설정과 잘 알려진 포트, ip·ifconfig·nmcli·route·ss 명령과 설정 파일을 읽고 쓴다.
---

## 학습 경로 · 3과목 2장 (2)

[← 12편 · 인터넷 활용 (1) 네트워크 기초](/lectures/grade-mukhnzii/semester-certificate/subject-linux-master-2/lecture-12) · [다음: 14편 · 응용분야 →](/lectures/grade-mukhnzii/semester-certificate/subject-linux-master-2/lecture-14)

**범위:** 3과목 2장 "인터넷 활용" 중 메일 서비스, 파일 전송 서비스, 도메인 서비스, 원격 서비스, 파일 공유 서비스, 네트워크 인터페이스. 계층·IP·서브넷은 12편에서 다뤘다.

**형광펜 읽는 법:** ==yellow:노랑== 핵심 정의·결론 · ==red:빨강== 시험에서 헷갈리는 구분·함정 · ==blue:파랑== 외워야 할 순서·목록

> [!EXAM]
> **이 장의 핵심 질문:** 리눅스 서버가 메일·파일·이름 풀이·원격 접속·파일 공유를 어떤 프로토콜과 포트로 제공하고, 그 서버의 네트워크 카드는 어떤 명령과 파일로 설정하는가?
>
> **전체 흐름:** ==blue:메일(SMTP·POP3·IMAP) → 파일 전송(FTP·SFTP) → 이름(DNS) → 원격(telnet·ssh·VNC) → 공유(NFS·Samba) → 포트 번호표 → 인터페이스 명령·설정 파일==

---

## 단원 도입

| 출제 포인트 | 빈도 | 이렇게 나온다 |
|---|:---:|---|
| 잘 알려진 포트 번호 | ★★★ | "POP3의 기본 포트", "포트 연결이 틀린 것" |
| 네트워크 명령어(ip, ifconfig, route, netstat, ss, ping, nmcli) | ★★★ | 출력 → 명령, 옵션 의미, 기본 게이트웨이 추가 |
| DNS 레코드·조회 명령, /etc/resolv.conf | ★★★ | "메일 서버를 지정하는 레코드", "네임서버를 적는 파일" |
| 메일 프로토콜과 MTA·MUA·MDA | ★★ | sendmail은 무엇인가, 메일을 받아 오는 프로토콜 |
| FTP 능동·수동 모드 | ★★ | 데이터 연결을 누가 여는가, 20·21번 포트 |
| NFS /etc/exports·Samba smb.conf | ★★ | 옵션 의미(root_squash), 설정 파일 이름 |
| 원격 접속(telnet·ssh·r-계열·VNC) | ★★ | 암호화 여부, 포트 |
| 인터페이스 설정 파일(ifcfg-, interfaces, netplan) | ★ | 배포판별 경로, BOOTPROTO 값 |

> [!PAGEBREAK]

## PART 1 · 인터넷 서비스

## 1. 메일 서비스

### 핵심 필기

| 구성 요소 | 하는 일 | 대표 프로그램 |
|---|---|---|
| **MUA** (Mail User Agent) | 사용자가 메일을 쓰고 읽는 **클라이언트** | Thunderbird, Outlook, Evolution, mutt, pine, `mail` |
| **MTA** (Mail Transfer Agent) | 메일을 **다른 서버로 전송·중계**하는 서버 | ==sendmail, postfix, qmail, exim== |
| **MDA** (Mail Delivery Agent) | MTA가 받은 메일을 사용자 **메일함에 배달** | procmail, maildrop |
| MRA (Mail Retrieval Agent) | 메일함의 메일을 POP3·IMAP으로 **꺼내 주는** 서버 | dovecot, fetchmail(클라이언트 측 수집) |

| 프로토콜 | 포트 (보안) | 방향 | 특징 |
|---|---|---|---|
| **SMTP** | 25 (SMTPS 465, 제출 587) | 보내기 · 서버 간 전달 | MUA → MTA → MTA |
| **POP3** | 110 (POP3S 995) | 받기 | 메일을 ==내려받고 서버에서 삭제==(기본), 단일 기기 |
| **IMAP** | 143 (IMAPS 993) | 받기 | 메일을 ==서버에 두고 동기화==, 폴더·여러 기기 |

[![보내는 사람의 MUA에서 SMTP로 MTA를 거쳐 받는 쪽 MTA로 전달되고, MDA가 메일함에 넣은 뒤 받는 사람의 MUA가 POP3 또는 IMAP으로 가져가는 흐름도](/materials/diagrams/lm2-l13b-mail-flow.svg)](/materials/diagrams/lm2-l13b-mail-flow.svg)

*그림 13-1 · 메일이 전달되는 길 — 누르면 원본 크기로 열린다.*

> [!NOTE]
> - **읽는 순서:** 왼쪽 위 보내는 사람의 MUA에서 시작해 화살표를 따라 SMTP 구간 → 배달(MDA) → 받기(POP3·IMAP) 구간으로 내려간다.
> - **핵심:** ==보내기와 서버 간 전달은 SMTP 하나==, 받아 오기만 POP3·IMAP이다. 검은 상자 MTA가 sendmail·postfix 자리다.
> - **시험 포인트:** ==red:sendmail·postfix는 MTA, Thunderbird는 MUA, procmail은 MDA==. "메일을 받는 프로토콜이 아닌 것 = SMTP"로 잘 나온다.

**sendmail 관련 파일·명령**

| 파일·명령 | 쓰임 |
|---|---|
| `/etc/mail/sendmail.cf` | sendmail 주 설정 파일 (m4로 `sendmail.mc`에서 생성) |
| `/etc/mail/access` | 릴레이 허용·거부 (`makemap hash`로 DB 생성) |
| `/etc/mail/local-host-names` | 이 서버가 메일을 받을 도메인 목록 |
| `/etc/aliases` | 메일 별칭, 수정 후 `newaliases` 실행 |
| `/etc/mail/virtusertable` | 가상 사용자·도메인 매핑 |
| `/var/spool/mail/사용자` | 사용자 메일함(mbox) |
| `mailq` | 전송 대기열(큐) 확인 |
| `/etc/postfix/main.cf` | postfix 주 설정 파일 |

> [!TRAP]
> ==red:POP3는 내려받고 서버에서 지우는 방식(기본), IMAP은 서버에 남겨 두는 방식==이다. 포트 110과 143을 바꿔서 묻는다. /etc/aliases를 고친 뒤 실행하는 명령은 `newaliases`다.

## 2. 파일 전송 서비스 — FTP·SFTP·scp

### 핵심 필기

- **FTP**(File Transfer Protocol)는 ==제어 연결 21번==과 ==데이터 연결==을 따로 쓴다.
- **능동 모드(Active):** 클라이언트가 `PORT`로 자기 포트를 알려 주면 ==서버가 20번 포트에서 클라이언트 쪽으로 데이터 연결을 연다==. 클라이언트 방화벽에 막히기 쉽다.
- **수동 모드(Passive):** 클라이언트가 `PASV`를 보내면 서버가 임의의 높은 포트를 알려 주고, ==클라이언트가 그 포트로 데이터 연결을 연다==. 방화벽·NAT 환경에서 주로 쓴다.

[![FTP 능동 모드와 수동 모드를 위아래로 비교한 그림. 두 모드 모두 클라이언트가 서버 21번으로 제어 연결을 열고, 능동 모드는 서버 20번이 클라이언트로 데이터 연결을 열며, 수동 모드는 클라이언트가 서버의 임의 높은 포트로 데이터 연결을 연다](/materials/diagrams/lm2-l13a-ftp-modes.svg)](/materials/diagrams/lm2-l13a-ftp-modes.svg)

*그림 13-2 · FTP 능동 모드와 수동 모드 — 누르면 원본 크기로 열린다.*

> [!NOTE]
> - **읽는 순서:** 위 칸(능동)과 아래 칸(수동)에서 먼저 ①제어 연결을 보고, ②데이터 연결 화살표가 어느 쪽에서 출발하는지 비교한다.
> - **핵심:** 제어는 항상 클라이언트 → 서버 21번. ==데이터 연결을 여는 쪽이 능동은 서버(20번), 수동은 클라이언트==다.
> - **시험 포인트:** "서버가 20번 포트로 접속" = 능동, "PASV, 1024 이상 임의 포트" = 수동.

| 서비스 | 포트 | 암호화 | 비고 |
|---|---|---|---|
| FTP | 20(데이터, 능동), 21(제어) | 없음(평문) | vsftpd, proftpd, wu-ftpd. 익명 FTP는 `anonymous` 계정 |
| FTPS | 990(암묵적) 등 | SSL/TLS | FTP + TLS |
| **SFTP** | 22 | SSH | ==SSH 위에서 동작==하는 파일 전송 (FTP와 별개 프로토콜) |
| **scp** | 22 | SSH | `scp 파일 사용자@호스트:경로` 복사 |
| TFTP | **UDP** 69 | 없음 | 인증 없음, 네트워크 부팅·장비 펌웨어 |

```bash
$ ftp ftp.example.com          # 접속 후 ftp> 프롬프트
ftp> bin                        # 바이너리 모드 (ascii는 텍스트 모드)
ftp> get report.tar.gz          # 하나 받기 (mget: 여러 개)
ftp> put notes.txt              # 하나 올리기 (mput: 여러 개)
ftp> lcd /tmp                   # 로컬 디렉터리 이동 (cd는 서버 쪽)
ftp> passive                    # 수동 모드 전환
ftp> bye                        # 종료 (quit도 가능)

$ scp backup.tar.gz kim@192.168.1.20:/data/        # 로컬 → 원격
$ scp -r kim@192.168.1.20:/var/www ./www-copy      # 원격 디렉터리 → 로컬 (-r 재귀)
$ scp -P 2222 a.txt kim@server:                    # 포트 지정은 대문자 -P
$ sftp kim@192.168.1.20                            # sftp> get / put / ls / bye
```

- vsftpd 설정 파일: `/etc/vsftpd/vsftpd.conf`(Red Hat 계열) 또는 `/etc/vsftpd.conf`(Debian 계열). `anonymous_enable`, `local_enable`, `write_enable`, `chroot_local_user` 등. 접속 거부 사용자 목록은 `/etc/vsftpd/ftpusers`, `user_list`.

> [!TRAP]
> scp의 포트 옵션은 ==red:대문자 P==(`-P`), ssh는 ==red:소문자 p==(`-p`)다. SFTP는 "FTP over SSL"이 아니라 SSH 기반이다(SSL 기반은 FTPS). TFTP는 TCP가 아니라 UDP다.

> [!CHECK]
> **1.** 메일을 서버에 남겨 둔 채 여러 기기에서 동기화해 읽는 프로토콜과 그 기본 포트는?
>
> **2.** FTP 수동 모드에서 데이터 연결을 여는 쪽은?

## 3. 도메인 서비스 — DNS

### 핵심 필기

- **DNS**(Domain Name System): 도메인 이름 ↔ IP 주소를 바꿔 주는 분산 데이터베이스. 포트 ==53== (일반 질의 UDP, 영역 전송(zone transfer)·큰 응답은 TCP). 리눅스 서버 프로그램은 **BIND**(데몬 `named`, 설정 `/etc/named.conf`).
- 도메인 구조: 루트(`.`) → 최상위 도메인 TLD(`com`, `kr`) → 2차 도메인 → 호스트. 끝까지 다 쓴 이름이 **FQDN**(`www.example.com.`).
- **정방향 조회**: 이름 → IP / **역방향 조회**: IP → 이름 (PTR, `in-addr.arpa`).

| 레코드 | 뜻 |
|---|---|
| **A** | 이름 → ==IPv4== 주소 |
| **AAAA** | 이름 → ==IPv6== 주소 |
| **CNAME** | 별칭 → 정식 이름 (`www` → `web01.example.com`) |
| **MX** | ==메일 서버== 지정 (우선순위 숫자가 작을수록 먼저) |
| **NS** | 그 영역을 맡은 ==네임 서버== |
| **PTR** | IP → 이름 (역방향) |
| **SOA** | 영역의 시작·권한 정보 (주 네임서버, 관리자, 일련번호, 갱신 주기) |
| TXT | 임의 문자열 (SPF 등) |
| SRV | 서비스 위치(서비스·프로토콜·포트) |

**이름 풀이 관련 파일**

| 파일 | 역할 | 예 |
|---|---|---|
| `/etc/hosts` | 이름-IP를 ==직접 적는 로컬 표== (DNS보다 먼저 보는 것이 기본) | `192.168.1.20  web01 web01.example.com` |
| `/etc/resolv.conf` | 질의할 ==네임서버==와 검색 도메인 | `nameserver 8.8.8.8` / `search example.com` |
| `/etc/nsswitch.conf` | 조회 순서 | `hosts: files dns` (files = /etc/hosts) |
| `/etc/host.conf` | 옛 방식 조회 순서 | `order hosts,bind` |

```bash
$ cat /etc/resolv.conf
nameserver 8.8.8.8
nameserver 8.8.4.4
options timeout:2 attempts:3
```

**조회 명령** (출력은 형식 예시, 주소는 문서용 대역)

```bash
$ nslookup www.example.com          # 대화형·비대화형 모두 가능
Server:         8.8.8.8
Address:        8.8.8.8#53

Non-authoritative answer:
Name:   www.example.com
Address: 192.0.2.10

$ nslookup -type=mx example.com     # 레코드 종류 지정
$ dig example.com MX                 # 상세 출력 (QUESTION/ANSWER SECTION)
$ dig @8.8.8.8 www.example.com A +short
192.0.2.10
$ dig -x 192.0.2.10                  # 역방향(PTR) 조회
$ host www.example.com               # 간단한 출력
www.example.com has address 192.0.2.10
$ host -t ns example.com             # -t 로 레코드 종류 지정
```

> [!TRAP]
> ==red:네임서버 주소는 /etc/resolv.conf, 이름-IP 직접 대응은 /etc/hosts==다. 둘을 바꿔 묻는다. 메일 서버는 MX, 별칭은 CNAME, 역방향은 PTR. `dig`에서 특정 서버에 묻기는 `@서버`, 역방향은 `-x`.

> [!CHECK]
> **3.** 도메인의 메일 서버를 지정하는 DNS 레코드는?
>
> **4.** 시스템이 질의할 DNS 서버 주소를 적는 파일은?

## 4. 원격 접속 서비스

| 서비스 | 포트 | 암호화 | 특징 |
|---|---|---|---|
| **telnet** | 23 | ==없음(평문)== | 계정·비밀번호까지 평문 전송, 현재는 비권장 |
| **ssh** | 22 | 있음 | telnet·r-계열 대체. 서버 OpenSSH(`sshd`), 설정 `/etc/ssh/sshd_config` |
| **rlogin / rsh / rexec** | 513 / 514 / 512 | 없음 | r-계열. `~/.rhosts`, `/etc/hosts.equiv`로 ==비밀번호 없이== 신뢰 접속 → 보안 취약 |
| **VNC** | 5900 + 디스플레이 번호 (웹 5800) | 기본 약함 | GUI 화면 공유(RFB 프로토콜), `vncserver`, `vncviewer` |
| RDP | 3389 | 있음 | Windows 원격 데스크톱 (리눅스에서는 xrdp·rdesktop) |

```bash
$ ssh kim@192.168.1.20                 # = ssh -l kim 192.168.1.20
$ ssh -p 2222 kim@192.168.1.20         # 포트 지정 (소문자 -p)
$ ssh kim@192.168.1.20 'df -h /'       # 원격에서 명령 하나만 실행
$ ssh-keygen -t ed25519                # 키 쌍 생성 → ~/.ssh/id_ed25519(.pub)
$ ssh-copy-id kim@192.168.1.20         # 공개키를 원격 ~/.ssh/authorized_keys에 추가
```

- `sshd_config` 주요 항목: `Port 22`, `PermitRootLogin no`, `PasswordAuthentication no`. 처음 접속한 서버의 호스트 키는 `~/.ssh/known_hosts`에 저장된다.

> [!TRAP]
> ==red:telnet과 r-계열은 평문, ssh는 암호화==다. VNC는 디스플레이 :1이면 5901번을 쓴다. 공개키를 넣는 파일은 `authorized_keys`, 접속했던 서버 키 목록은 `known_hosts`.

## 5. 파일 공유 서비스 — NFS와 Samba

### NFS (Network File System)

- 유닉스·리눅스끼리 디렉터리를 네트워크로 공유. 포트 ==2049==, RPC를 쓰므로 **rpcbind**(portmap, 111번)가 필요하다.
- 서버 설정 파일 `/etc/exports`: `공유디렉터리  허용호스트(옵션,옵션)`

```bash
# /etc/exports
/data/share   192.168.1.0/24(rw,sync,no_root_squash)
/data/pub     *(ro,all_squash)
/home/kim     server2.example.com(rw)
```

| 옵션 | 뜻 |
|---|---|
| `rw` / `ro` | 읽기·쓰기 / 읽기 전용 |
| `sync` / `async` | 변경을 디스크에 바로 기록 / 나중에 기록 |
| `root_squash` (기본값) | 클라이언트의 root를 ==nobody(익명)로 바꿔== 권한 제한 |
| `no_root_squash` | 클라이언트 root를 서버에서도 root로 인정 |
| `all_squash` | 모든 사용자를 익명 사용자로 매핑 |
| `anonuid=`, `anongid=` | 익명 사용자로 쓸 UID·GID 지정 |

```bash
# exportfs -ra                         # /etc/exports 다시 읽어 적용 (-a 전체, -r 재공유)
# exportfs -v                          # 현재 공유 목록과 옵션
$ showmount -e 192.168.1.10            # 서버가 공유 중인 목록 확인
# mount -t nfs 192.168.1.10:/data/share /mnt/share
# /etc/fstab 에 영구 등록
192.168.1.10:/data/share  /mnt/share  nfs  defaults  0 0
```

> [!TRAP]
> `192.168.1.0/24(rw)`와 `192.168.1.0/24 (rw)`는 ==red:괄호 앞 공백 하나로 뜻이 달라진다.== 괄호 앞에 공백이 있으면 옵션이 "모든 호스트"에 붙어 버린다. 기본값은 root_squash다.

### Samba (SMB/CIFS)

- 리눅스와 ==Windows 사이== 파일·프린터 공유. 프로토콜 SMB/CIFS, 포트 ==137·138(UDP), 139, 445(TCP)==.
- 데몬: **smbd**(파일·프린터 공유), **nmbd**(NetBIOS 이름 서비스). 설정 파일 `/etc/samba/smb.conf`.

```ini
[global]
   workgroup = WORKGROUP
   server string = Linux Samba Server
   security = user

[share]
   comment = 팀 공유 폴더
   path = /data/samba
   writable = yes
   valid users = kim, lee
```

```bash
# smbpasswd -a kim                       # Samba 사용자 추가(시스템 계정이 있어야 함)
$ testparm                               # smb.conf 문법 검사
$ smbclient -L //192.168.1.10 -U kim     # 공유 목록 보기
$ smbclient //192.168.1.10/share -U kim  # FTP처럼 접속
# mount -t cifs //192.168.1.10/share /mnt/smb -o username=kim
```

> [!TRAP]
> ==red:NFS는 리눅스·유닉스끼리(/etc/exports), Samba는 Windows와(smb.conf)==. Samba 비밀번호는 시스템 `passwd`가 아니라 `smbpasswd`로 따로 등록한다.

> [!CHECK]
> **5.** NFS 서버에서 클라이언트의 root 사용자를 익명 사용자로 바꾸는 기본 옵션은?
>
> **6.** Samba 설정 파일의 경로와 문법 검사 명령은?

## 6. 잘 알려진 포트 번호표

0–1023이 **잘 알려진 포트(well-known)**, 1024–49151이 등록 포트, 49152–65535가 동적 포트다. 리눅스에서는 `/etc/services`에 서비스 이름과 포트가 적혀 있다.

| 포트 | 서비스 | 포트 | 서비스 |
|---|---|---|---|
| **20 / 21** | FTP 데이터 / 제어 | **143** | IMAP |
| **22** | SSH, SFTP, scp | 161 / 162 | SNMP / SNMP trap (UDP) |
| **23** | Telnet | 389 | LDAP |
| **25** | SMTP | **443** | HTTPS |
| **53** | DNS | 445 | SMB (Samba) |
| 67 / 68 | DHCP 서버 / 클라이언트 (UDP) | 465 / 587 | SMTPS / 메일 제출 |
| 69 | TFTP (UDP) | 514 | syslog(UDP) · rsh(TCP) |
| **80** | HTTP | 993 / 995 | IMAPS / POP3S |
| **110** | POP3 | **2049** | NFS |
| 111 | rpcbind(portmap) | 3306 | MySQL·MariaDB |
| 123 | NTP (UDP) | 3389 | RDP |
| 137–139 | NetBIOS (Samba) | 5900 | VNC |

```bash
$ grep -E '^(ftp|ssh|telnet|smtp|domain|http|pop3|imap2|https|nfs)\s' /etc/services
ftp             21/tcp
ssh             22/tcp                          # SSH Remote Login Protocol
telnet          23/tcp
smtp            25/tcp          mail
domain          53/tcp                          # Domain Name Server
domain          53/udp
http            80/tcp          www             # WorldWideWeb HTTP
pop3            110/tcp         pop-3           # POP version 3
imap2           143/tcp         imap            # Interim Mail Access P 2 and 4
https           443/tcp                         # http protocol over TLS/SSL
https           443/udp                         # HTTP/3
nfs             2049/tcp                        # Network File System
nfs             2049/udp                        # Network File System
```

> [!CONCEPT]
> **포트 외우기 묶음** — ==blue:20·21 FTP → 22 SSH → 23 Telnet → 25 SMTP== (20번대는 오래된 기본 서비스 순서대로), 53 DNS, 80 HTTP, ==blue:110 POP3 < 143 IMAP==, 443 HTTPS, 2049 NFS. "보안 버전"은 POP3S 995 · IMAPS 993처럼 900번대.

> [!PAGEBREAK]

## PART 2 · 네트워크 인터페이스

## 7. 인터페이스 확인과 설정 명령

### 핵심 필기

- 인터페이스 이름: `lo`(루프백), `eth0`(전통적 이더넷), `enp0s3`·`ens33`(예측 가능한 이름), `wlan0`(무선).
- 오래된 **net-tools** 패키지(`ifconfig`, `route`, `netstat`, `arp`)는 **iproute2**(`ip`, `ss`)로 대체되는 중이다. 시험은 둘 다 묻는다.

| 할 일 | net-tools (옛) | iproute2 (새) |
|---|---|---|
| 주소 보기 | `ifconfig -a` | `ip addr show` (`ip a`) |
| 주소 지정 | `ifconfig eth0 192.168.1.10 netmask 255.255.255.0 up` | `ip addr add 192.168.1.10/24 dev eth0` |
| 인터페이스 켜기·끄기 | `ifconfig eth0 up` / `down` (`ifup`·`ifdown eth0`) | `ip link set eth0 up` / `down` |
| 라우팅 표 | `route -n`, `netstat -r` | `ip route` (`ip r`) |
| 기본 게이트웨이 추가 | `route add default gw 192.168.1.1` | `ip route add default via 192.168.1.1` |
| ARP 표 | `arp -a`, `arp -n` | `ip neigh` |
| 소켓·포트 | `netstat -tuln` | `ss -tuln` |

실제 리눅스에서 본 출력:

```bash
$ ip addr show eth0
4: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1400 qdisc pfifo_fast state UP group default qlen 1000
    link/ether 02:fc:00:00:00:01 brd ff:ff:ff:ff:ff:ff
    inet 192.0.2.2/24 brd 192.0.2.255 scope global eth0
       valid_lft forever preferred_lft forever

$ ifconfig eth0
eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1400
        inet 192.0.2.2  netmask 255.255.255.0  broadcast 192.0.2.255
        ether 02:fc:00:00:00:01  txqueuelen 1000  (Ethernet)
        RX packets 36437  bytes 43491761 (43.4 MB)
        TX packets 36482  bytes 70540667 (70.5 MB)

$ ip route
default via 192.0.2.1 dev eth0
192.0.2.0/24 dev eth0 proto kernel scope link src 192.0.2.2

$ route -n
Kernel IP routing table
Destination     Gateway         Genmask         Flags Metric Ref    Use Iface
0.0.0.0         192.0.2.1       0.0.0.0         UG    0      0        0 eth0
192.0.2.0       0.0.0.0         255.255.255.0   U     0      0        0 eth0
```

- `route -n` 의 `Flags`: **U**(Up, 사용 중), **G**(Gateway를 거침), **H**(Host 경로). 목적지 `0.0.0.0` + 마스크 `0.0.0.0` 줄이 ==기본 게이트웨이==다. `-n`은 이름 대신 숫자로 보여 준다.

**연결 상태 확인 — netstat·ss**

| 옵션 | 뜻 |
|---|---|
| `-t` / `-u` | TCP / UDP |
| `-l` | LISTEN(대기) 중인 소켓만 |
| `-n` | 이름 풀이 없이 숫자 주소·포트 |
| `-a` | 모든 소켓 |
| `-p` | 소켓을 연 프로세스(PID/이름) |
| `-r` (netstat) | 라우팅 테이블 |
| `-i` (netstat) | 인터페이스별 통계 |

```bash
$ ss -tuln
Netid State  Recv-Q Send-Q Local Address:Port  Peer Address:Port Process
tcp   LISTEN 0      128          0.0.0.0:22         0.0.0.0:*
tcp   LISTEN 0      511          0.0.0.0:80         0.0.0.0:*

$ netstat -tuln
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN
tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN
```

**연결 점검 명령**

| 명령 | 쓰임 |
|---|---|
| `ping -c 4 8.8.8.8` | ICMP Echo로 도달 여부·왕복 시간. `-c` 횟수(리눅스 ping은 기본적으로 Ctrl+C까지 계속) |
| `traceroute 8.8.8.8` | 목적지까지 거치는 라우터(홉) 경로. TTL을 1씩 늘려 확인 (`tracepath`도 비슷) |
| `hostname`, `hostnamectl set-hostname web01` | 호스트 이름 보기·영구 변경 (`/etc/hostname`) |
| `ethtool eth0`, `mii-tool` | 랜카드 속도·duplex·링크 상태 |
| `arp -a`, `ip neigh` | IP ↔ MAC 캐시 |

> [!TRAP]
> `ifconfig`·`route`·`netstat`은 ==red:net-tools==, `ip`·`ss`는 ==red:iproute2==다. 기본 게이트웨이는 `route add default gw IP`와 `ip route add default via IP`로 키워드(`gw`·`via`)가 다르다. `ifconfig`나 `ip addr add`로 넣은 설정은 재부팅하면 사라진다(영구 설정은 설정 파일·nmcli).

## 8. NetworkManager와 설정 파일

**nmcli** — NetworkManager를 명령줄에서 다룬다(`nmtui`는 텍스트 메뉴판).

```bash
$ nmcli device status                       # 장치(디바이스)별 상태
$ nmcli connection show                     # 연결 프로파일 목록 (con 으로 줄여도 됨)
# nmcli connection modify eth0 ipv4.method manual \
      ipv4.addresses 192.168.1.10/24 ipv4.gateway 192.168.1.1 ipv4.dns 8.8.8.8
# nmcli connection up eth0                  # 적용 (down 으로 끄기)
# nmcli connection add type ethernet ifname eth1 con-name office
```

**배포판별 설정 파일**

| 계열 | 파일 | 주요 항목 |
|---|---|---|
| Red Hat·CentOS (전통) | `/etc/sysconfig/network-scripts/ifcfg-eth0` | `DEVICE=eth0`, `BOOTPROTO=static` 또는 `dhcp`, `ONBOOT=yes`, `IPADDR=`, `NETMASK=`(또는 `PREFIX=`), `GATEWAY=`, `DNS1=` |
| Red Hat (옛) | `/etc/sysconfig/network` | `NETWORKING=yes`, `HOSTNAME=`, `GATEWAY=` |
| Debian·옛 Ubuntu | `/etc/network/interfaces` | `auto eth0` / `iface eth0 inet static` / `address`, `netmask`, `gateway` |
| Ubuntu 18.04+ | `/etc/netplan/*.yaml` | 적용은 `netplan apply` |
| 공통 | `/etc/hostname`, `/etc/hosts`, `/etc/resolv.conf`, `/etc/services`, `/etc/protocols` | 호스트명, 이름 풀이, 포트·프로토콜 번호 |

```bash
# /etc/sysconfig/network-scripts/ifcfg-eth0  (고정 IP 예)
DEVICE=eth0
BOOTPROTO=static
ONBOOT=yes
IPADDR=192.168.1.10
NETMASK=255.255.255.0
GATEWAY=192.168.1.1
DNS1=8.8.8.8
```

- 적용: `systemctl restart network`(옛 RHEL) 또는 `systemctl restart NetworkManager`, `nmcli connection reload`.
- 최신 RHEL 9 계열은 ifcfg 대신 `/etc/NetworkManager/system-connections/*.nmconnection`(keyfile)을 기본으로 쓴다.

> [!TRAP]
> `BOOTPROTO=dhcp`면 ==red:IPADDR을 적어도 DHCP로 받는다.== 부팅 시 자동 활성화는 `ONBOOT=yes`다. Debian 계열 파일은 `/etc/network/interfaces`(복수형 s)다.

> [!CHECK]
> **7.** `ip` 명령으로 기본 게이트웨이를 192.168.1.1로 추가하는 명령은?
>
> **8.** LISTEN 중인 TCP·UDP 포트를 숫자로 보여 주는 `ss` 명령은?
>
> **9.** Red Hat 계열에서 eth0을 부팅 때 자동으로 켜는 ifcfg 항목은?

> [!PAGEBREAK]

## 실전 문제

> [!QUIZ]
> 다음 중 서비스와 기본 포트의 연결이 틀린 것은?
>
> **A.** SSH — 22
>
> **B.** SMTP — 25
>
> **C.** POP3 — 143
>
> **D.** DNS — 53

> [!HINT 1]
> 메일을 받아 오는 두 프로토콜 중 숫자가 작은 쪽이 POP3다.

> [!ANSWER]
> **C.** POP3는 110번, 143번은 IMAP이다.

> [!QUIZ]
> 다음 중 MTA(Mail Transfer Agent)에 해당하지 않는 것은?
>
> **A.** sendmail
>
> **B.** postfix
>
> **C.** qmail
>
> **D.** Thunderbird

> [!HINT 1]
> 사용자가 직접 메일을 읽고 쓰는 프로그램은 무엇이라 부르는가?

> [!ANSWER]
> **D.** Thunderbird는 MUA(메일 클라이언트)다. sendmail·postfix·qmail은 MTA다.

> [!QUIZ]
> FTP에 대한 설명으로 옳은 것은?
>
> **A.** 능동 모드에서는 클라이언트가 서버의 20번 포트로 데이터 연결을 연다.
>
> **B.** 수동 모드에서는 클라이언트가 서버가 알려 준 포트로 데이터 연결을 연다.
>
> **C.** 제어 연결은 20번, 데이터 연결은 21번 포트를 쓴다.
>
> **D.** SFTP는 FTP에 SSL을 덧씌운 프로토콜이다.

> [!HINT 1]
> 방화벽 뒤 클라이언트에 유리한 모드는 "클라이언트가 바깥으로 연결을 여는" 쪽이다.

> [!ANSWER]
> **B.** 능동 모드는 서버 20번이 클라이언트로 연결을 연다(A 오답). 제어는 21, 데이터는 20(C 오답). SFTP는 SSH 기반이고, SSL 기반은 FTPS다(D 오답).

> [!QUIZ]
> 리눅스 시스템이 이름 풀이를 위해 질의할 DNS 서버(네임서버)의 주소를 설정하는 파일은?
>
> **A.** /etc/hosts
>
> **B.** /etc/resolv.conf
>
> **C.** /etc/services
>
> **D.** /etc/exports

> [!HINT 1]
> 이 파일의 줄은 `nameserver 8.8.8.8`처럼 생겼다.

> [!ANSWER]
> **B.** /etc/hosts는 이름-IP를 직접 적는 표, /etc/services는 포트 번호표, /etc/exports는 NFS 공유 설정이다.

> [!QUIZ]
> /etc/exports에 다음 줄이 있다. 설명으로 옳은 것은?
>
> `/data/share 192.168.1.0/24(rw,sync,no_root_squash)`
>
> **A.** 192.168.1.0/24 대역에 읽기 전용으로 공유한다.
>
> **B.** 클라이언트의 root는 서버에서 nobody로 매핑된다.
>
> **C.** 클라이언트의 root가 서버에서도 root 권한을 갖는다.
>
> **D.** Samba로 Windows에 공유할 때 쓰는 설정이다.

> [!HINT 1]
> squash는 "짓눌러 줄인다"는 뜻이다. no_가 붙으면?

> [!ANSWER]
> **C.** no_root_squash는 root 권한을 그대로 인정한다. rw는 읽기·쓰기, 기본값 root_squash가 nobody 매핑이며, NFS 설정 파일이다.

> [!QUIZ]
> 다음 중 리눅스에서 기본 게이트웨이를 192.168.0.1로 지정하는 명령으로 옳은 것은?
>
> **A.** `route add default gw 192.168.0.1`
>
> **B.** `ip route add default gw 192.168.0.1`
>
> **C.** `ifconfig default gw 192.168.0.1`
>
> **D.** `netstat -r add 192.168.0.1`

> [!HINT 1]
> `ip route`는 `via`, `route`는 `gw` 키워드를 쓴다.

> [!ANSWER]
> **A.** iproute2로 쓰면 `ip route add default via 192.168.0.1`이다. ifconfig·netstat는 경로를 추가하지 않는다.

> [!QUIZ]
> 평문 전송으로 보안에 취약해 SSH로 대체된 원격 접속 서비스와 그 포트로 옳은 것은?
>
> **A.** telnet — 23
>
> **B.** VNC — 5900
>
> **C.** SFTP — 22
>
> **D.** NFS — 2049

> [!HINT 1]
> SSH(22) 바로 다음 번호.

> [!ANSWER]
> **A.** telnet(23)은 계정·비밀번호까지 평문으로 보낸다. r-계열(rlogin·rsh)도 같은 이유로 ssh로 대체됐다.

> [!QUIZ]
> DNS 레코드에 대한 설명으로 틀린 것은?
>
> **A.** A — 도메인 이름을 IPv4 주소로 대응
>
> **B.** CNAME — 도메인의 별칭 지정
>
> **C.** PTR — 도메인의 메일 서버 지정
>
> **D.** NS — 영역을 관리하는 네임 서버 지정

> [!HINT 1]
> PTR은 역방향(in-addr.arpa) 조회에 쓰인다.

> [!ANSWER]
> **C.** 메일 서버는 MX 레코드다. PTR은 IP 주소를 이름으로 대응한다.

> [!PAGEBREAK]

## 단원 마무리

| 주제 | 꼭 남길 한 줄 |
|---|---|
| 메일 | ==blue:MUA → (SMTP 25) → MTA → MDA → 메일함 → (POP3 110 / IMAP 143) → MUA==, MTA = sendmail·postfix |
| FTP | 제어 21 · 데이터 20, 능동은 서버가·수동은 클라이언트가 데이터 연결을 연다, SFTP·scp는 SSH 22 |
| DNS | 53, A·AAAA·CNAME·MX·NS·PTR·SOA, `/etc/resolv.conf` = 네임서버, `/etc/hosts` = 로컬 표 |
| 원격 | telnet 23·r-계열 평문, ssh 22 암호화, VNC 5900+n |
| NFS | `/etc/exports`, 2049 + rpcbind 111, root_squash 기본, `exportfs -ra`, `showmount -e` |
| Samba | `/etc/samba/smb.conf`, smbd·nmbd, 139·445, `smbpasswd -a`, `testparm` |
| 인터페이스 | `ip addr/link/route`, `ifconfig`, `route -n`, `ss -tuln`, `nmcli`, ifcfg-eth0(BOOTPROTO·ONBOOT) |

## 책을 덮고 꺼내 보기

- 메일을 서버 간에 전송하는 프로토콜은 {{SMTP}}이고 기본 포트는 {{25}}번이다.
- POP3의 포트는 {{110}}, IMAP의 포트는 {{143}}이다.
- FTP 능동 모드에서 서버는 {{20}}번 포트로 데이터 연결을 연다.
- IPv6 주소를 지정하는 DNS 레코드는 {{AAAA}}다.
- NFS 공유 설정 파일은 {{/etc/exports}}, Samba 설정 파일은 {{/etc/samba/smb.conf}}다.
- `ip route add default {{via}} 192.168.1.1` 로 기본 게이트웨이를 추가한다.

> [!FLASHCARD]
> Q: MUA·MTA·MDA를 대표 프로그램과 함께 구분하라.
> A: MUA는 메일 클라이언트(Thunderbird, Outlook, mutt), MTA는 메일 전송 서버(sendmail, postfix, qmail, exim), MDA는 메일함 배달 프로그램(procmail, maildrop).

> [!FLASHCARD]
> Q: POP3와 IMAP의 차이는?
> A: POP3(110)는 메일을 내려받고 기본적으로 서버에서 삭제한다. IMAP(143)은 메일을 서버에 두고 여러 기기에서 폴더 단위로 동기화한다.

> [!FLASHCARD]
> Q: FTP 능동 모드와 수동 모드의 데이터 연결 방향은?
> A: 능동은 서버의 20번 포트가 클라이언트가 알려 준 포트로 연결을 연다. 수동(PASV)은 클라이언트가 서버가 알려 준 임의의 높은 포트로 연결을 연다. 제어 연결은 둘 다 클라이언트 → 서버 21번.

> [!FLASHCARD]
> Q: /etc/hosts, /etc/resolv.conf, /etc/nsswitch.conf의 역할은?
> A: /etc/hosts는 이름-IP 로컬 대응표, /etc/resolv.conf는 질의할 네임서버와 검색 도메인, /etc/nsswitch.conf는 조회 순서(hosts: files dns).

> [!FLASHCARD]
> Q: /etc/exports의 root_squash, no_root_squash, all_squash는?
> A: root_squash(기본)는 클라이언트 root를 nobody로, no_root_squash는 root 권한을 그대로 인정, all_squash는 모든 사용자를 익명으로 매핑한다.

> [!FLASHCARD]
> Q: net-tools와 iproute2의 대응 명령은?
> A: ifconfig ↔ ip addr / ip link, route ↔ ip route, arp ↔ ip neigh, netstat ↔ ss.

> [!FLASHCARD]
> Q: 꼭 외울 포트 번호 열 개는?
> A: FTP 20·21, SSH 22, Telnet 23, SMTP 25, DNS 53, HTTP 80, POP3 110, IMAP 143, HTTPS 443, NFS 2049. 덤으로 Samba 139·445, VNC 5900, DHCP 67·68, SNMP 161.

**다음으로 갈 기준:** 포트 번호표를 빈 종이에 다시 쓸 수 있고, ip·route·ss 출력에서 기본 게이트웨이와 열린 포트를 읽어 낼 수 있으면 다음 편으로 간다: [14편 · 응용분야](/lectures/grade-mukhnzii/semester-certificate/subject-linux-master-2/lecture-14).

> [!PAGEBREAK]

## 정답과 해설

### 확인 문제 정답

1. **IMAP**, 기본 포트 **143** (보안 IMAPS는 993).
2. **클라이언트** — 서버가 PASV 응답으로 알려 준 높은 포트에 클라이언트가 접속한다.
3. **MX** 레코드.
4. **/etc/resolv.conf** (`nameserver` 항목).
5. **root_squash**.
6. **/etc/samba/smb.conf**, 문법 검사는 **testparm**.
7. **`ip route add default via 192.168.1.1`**.
8. **`ss -tuln`** (t: TCP, u: UDP, l: LISTEN, n: 숫자).
9. **`ONBOOT=yes`**.
