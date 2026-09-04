# partner-bo
중개사 BackOffice

## 프로젝트 개요
이 프로젝트는 중개사용 BackOffice 관리자 페이지로, 홈페이지 설정, 게시판 관리, 프로필 수정 기능을 제공합니다.

## 주요 페이지 구성

### 1. 로그인/인증
- [`App.js`](src/App.js)
- 로그인 화면 표시
- 로컬 스토리지 기반 로그인 상태 관리
- 세션 로그인 처리

### 2. 공통 레이아웃
- [`Header.js`](src/components/Header.js)
- 상단 헤더, 사이드 네비게이션, 라우팅 관리
- 주요 메뉴: 홈페이지 설정, 게시판 관리, 프로필 수정

### 3. 메인 화면
- [`Main.js`](src/components/Main.js)
- 관리자 메인 대시보드 진입 화면
- 기본적으로 /basic 페이지로 이동

### 4. 홈페이지 설정
- [`Basic.js`](src/components/Basic.js)
- 설정 메뉴 탭(기본, 메인페이지, 공지/이벤트, 둘러보기, 이용요금, 이용후기, 홍보영상, 오시는길)
- 각 설정 영역은 setting_page 폴더 하위 컴포넌트로 분리

### 5. 게시판 관리
- [`Board.js`](src/components/Board.js)
- 전체/공지&이벤트/이용요금/이용후기/홍보영상 탭 구성
- 게시글 목록 조회 및 분류

### 6. 게시글 관련 페이지
- [`board_page/Write_brd.js`](src/components/board_page/Write_brd.js): 게시글 작성
- [`board_page/Edit_brd.js`](src/components/board_page/Edit_brd.js): 게시글 수정
- [`board_page/View_brd.js`](src/components/board_page/View_brd.js): 게시글 상세 조회
- [`board_page/Brd_all.js`](src/components/board_page/Brd_all.js): 게시글 목록 렌더링

### 7. 프로필 관리
- [`Edit_profile.js`](src/components/Edit_profile.js)
- 관리자 프로필 수정 화면

## 라우팅 구조
- / : Main
- /edit_profile : 프로필 수정
- /basic : 홈페이지 설정
- /board : 게시판 관리
- /write : 게시글 작성
- /edit : 게시글 수정
- /view : 게시글 상세 보기

## 폴더 구조

- `src/`
  - [`App.js`](src/App.js) - 앱 진입 및 로그인 처리
  - [`store.js`](src/store.js) - Redux 상태 관리
  - [`ajaxs.js`](src/ajaxs.js) - API 관련 유틸리티
  - `components/`
    - [`Header.js`](src/components/Header.js) - 공통 헤더/네비게이션, 경로, 라우트
    - [`Main.js`](src/components/Main.js) - 메인 대시보드
    - [`Edit_profile.js`](src/components/Edit_profile.js) - 프로필 수정(1)
    - [`Basic.js`](src/components/Basic.js) - 홈페이지 설정(2)
    - [`Board.js`](src/components/Board.js) - 게시판 관리(3)
    - `board_page/`
      - [`Brd_all.js`](src/components/board_page/Brd_all.js) - 게시글 목록 컴포넌트(표)
      - [`Write_brd.js`](src/components/board_page/Write_brd.js) - 새 글쓰기(3-0)
      - [`Edit_brd.js`](src/components/board_page/Edit_brd.js) - 글 수정(3-1)
      - [`View_brd.js`](src/components/board_page/View_brd.js) - 글 상세 보기(3-2)
      - [`brd.css`](src/components/board_page/brd.css) - 게시판 스타일
    - `setting_page/`
      - [`Set_header.js`](src/components/setting_page/Set_header.js) - 기본(2-0)
      - [`Set_main.js`](src/components/setting_page/Set_main.js) - 메인페이지(2-1)
      - [`Set_notice.js`](src/components/setting_page/Set_notice.js) - 공지/이벤트(2-2)
      - [`Set_around.js`](src/components/setting_page/Set_around.js) - 둘러보기(2-3)
      - [`Set_charge.js`](src/components/setting_page/Set_charge.js) - 이용요금(2-4)
      - [`Set_review.js`](src/components/setting_page/Set_review.js) - 이용후기(2-5)
      - [`Set_vod.js`](src/components/setting_page/Set_vod.js) - 홍보영상(2-6)
      - [`Set_map.js`](src/components/setting_page/Set_map.js) - 오시는길(2-7)
      - [`setting_page.js`](src/components/setting_page/setting_page.js) - 설정 페이지 모음 export
      - [`set.css`](src/components/setting_page/set.css) - 설정 페이지 스타일

## 개발 실행
```bash
npm install
npm start
```

## 배포 (release+symlink 무중단 배포)
서버에서 `git pull`로 최신 소스를 받은 뒤 [`build.sh`](build.sh)를 실행합니다.

```bash
./build.sh
```

- `npm run build`로 `build/releases/<timestamp>`에 직접 빌드합니다.
- 빌드가 끝나면 `build/current` 심볼릭 링크를 새 release로 원자적으로 전환합니다.
- nginx는 `build/current`를 `root`로 바라보므로, 심볼릭 링크 전환만으로 무중단 배포가 됩니다(별도 reload 불필요).
- `git pull`은 스크립트가 하지 않으므로 실행 전에 미리 받아둬야 하며, 로컬 HEAD가 upstream과 다르면 스크립트가 에러로 중단됩니다.
"# backoffice" 
