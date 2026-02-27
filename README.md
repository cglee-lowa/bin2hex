# Bin2Hex 변환기 (Bin2Hex Converter)

파일의 내용을 프로그래밍 언어(C, Kotlin, Python)에서 즉시 사용할 수 있는 16진수(Hex) 배열로 변환해주는 프리미엄 웹 도구입니다.

## 주요 기능

- **다양한 언어 지원**: 
  - **C**: `unsigned char` 배열 형식
  - **Kotlin**: `byteArrayOf()` 형식
  - **Python**: `bytes([])` 형식
- **반응형 디자인**: 데스크탑, 태블릿, 모바일 등 모든 기기 해상도 최적화 지원
- **프리미엄 UI/UX**: 글래스모피즘(Glassmorphism) 효과와 세련된 다크 모드 디자인
- **사용 편의성**: 
  - 드래그 앤 드롭 파일 업로드
  - 원클릭 클립보드 복사
  - 파일 버퍼 캐싱을 통한 빠른 탭 전환

## 설치 및 실행 방법

이 프로젝트는 [Vite](https://vitejs.dev/)를 사용하여 구축되었습니다.

### 1. 의존성 설치
```bash
npm install
```

### 2. 로컬 개발 서버 실행
```bash
npm run dev
```

### 3. 프로덕션 빌드
```bash
npm run build
```

## 사용 방법

1. 브라우저에서 페이지를 엽니다.
2. 변환하고자 하는 파일을 업로드 영역에 드래그하거나 클릭하여 선택합니다.
3. 원하는 프로그래밍 언어(C, Kotlin, Python) 탭을 선택합니다.
4. '클립보드 복사' 버튼을 눌러 생성된 코드를 복사합니다.

## 기술 스택

- **Core**: Vanilla JavaScript
- **Build Tool**: Vite
- **Styling**: Vanilla CSS (CSS3 Media Queries, Glassmorphism)
- **Design Concepts**: Modern Dark Mode, High Fidelity UI

---
Developed with ❤️ by cglee-lowa
