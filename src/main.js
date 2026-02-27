const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const output = document.getElementById('output');
const fileNameDisplay = document.getElementById('file-name');
const copyBtn = document.getElementById('copy-btn');
const tabs = document.querySelectorAll('.tab');

let currentFile = null;
let currentBuffer = null;
let currentLang = 'c';

/**
 * 언어별 포맷 구성
 */
const LANG_CONFIG = {
  c: {
    comment: '//',
    template: (name, hex) => `unsigned char ${name}_data[] = {\n  ${hex}\n};`,
    perLine: 12,
    transform: b => `0x${b.toString(16).padStart(2, '0')}`
  },
  kotlin: {
    comment: '//',
    template: (name, hex) => `val ${name}Data = byteArrayOf(\n  ${hex}\n)`,
    perLine: 6,
    transform: b => `0x${b.toString(16).padStart(2, '0')}.toByte()`
  },
  python: {
    comment: '#',
    template: (name, hex) => `${name}_data = bytes([\n  ${hex}\n])`,
    perLine: 12,
    transform: b => `0x${b.toString(16).padStart(2, '0')}`
  }
};

/**
 * 바이트 배열을 포맷된 문자열로 변환 (최적화 버전)
 */
const formatHex = (buffer, lang, fileName) => {
  if (!buffer) return '';

  const config = LANG_CONFIG[lang];
  const bytes = new Uint8Array(buffer);
  const cleanName = fileName.replace(/[^a-zA-Z0-9]/g, '_');

  let hexBody = '';
  for (let i = 0; i < bytes.length; i++) {
    hexBody += config.transform(bytes[i]);

    if (i < bytes.length - 1) {
      hexBody += ', ';
      if ((i + 1) % config.perLine === 0) {
        hexBody += '\n  ';
      }
    }
  }

  return `${config.comment} 파일: ${fileName}\n${config.template(cleanName, hexBody)}`;
};

/**
 * 파일 처리 및 결과 출력
 */
const updateOutput = () => {
  if (!currentBuffer || !currentFile) return;
  output.value = formatHex(currentBuffer, currentLang, currentFile.name);
};

const processFile = async (file) => {
  if (!file) return;
  currentFile = file;
  fileNameDisplay.textContent = file.name;

  // 버퍼 캐싱으로 탭 전환 시 중복 로드 방지
  currentBuffer = await file.arrayBuffer();
  updateOutput();
};

// --- 이벤트 핸들러 ---

// 드래그 앤 드롭 시각적 피드백 통합 제어
const toggleDragState = (isDragging) => {
  dropZone.classList.toggle('dragging', isDragging);
};

dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  toggleDragState(true);
});

['dragleave', 'drop'].forEach(evt => {
  dropZone.addEventListener(evt, () => toggleDragState(false));
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  processFile(file);
});

dropZone.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', (e) => {
  processFile(e.target.files[0]);
});

// 언어 선택 탭 (이벤트 위임 고려 가능하나 현재는 개별 등록 유지)
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    if (tab.classList.contains('active')) return;

    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentLang = tab.dataset.lang;
    updateOutput();
  });
});

// 클립보드 복사
copyBtn.addEventListener('click', async () => {
  const text = output.value;
  if (!text) return;

  try {
    await navigator.clipboard.writeText(text);
    const originalText = copyBtn.textContent;
    copyBtn.textContent = '복사 완료!';
    copyBtn.classList.add('success-state'); // CSS 스타일 추가 권장
    copyBtn.style.background = 'var(--success)';

    setTimeout(() => {
      copyBtn.textContent = originalText;
      copyBtn.style.background = ''; // 기존 CSS로 복구
    }, 2000);
  } catch (err) {
    console.error('클립보드 복사 실패:', err);
  }
});
