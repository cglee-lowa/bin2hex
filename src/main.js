const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const output = document.getElementById('output');
const fileNameDisplay = document.getElementById('file-name');
const copyBtn = document.getElementById('copy-btn');
const tabs = document.querySelectorAll('.tab');

let currentFile = null;
let currentLang = 'c';

// --- Hex 변환 로직 ---

const formatHex = (buffer, lang, fileName) => {
  const bytes = new Uint8Array(buffer);
  const hexValues = Array.from(bytes).map(b => `0x${b.toString(16).padStart(2, '0')}`);
  const cleanName = fileName.replace(/[^a-zA-Z0-9]/g, '_');

  switch (lang) {
    case 'c':
      return `// 파일: ${fileName}\nunsigned char ${cleanName}_data[] = {\n  ${wrapLines(hexValues, 12)}\n};`;
    case 'kotlin':
      const ktValues = Array.from(bytes).map(b => `0x${b.toString(16).padStart(2, '0')}.toByte()`);
      return `// 파일: ${fileName}\nval ${cleanName}Data = byteArrayOf(\n  ${wrapLines(ktValues, 6)}\n)`;
    case 'python':
      return `# 파일: ${fileName}\n${cleanName}_data = bytes([\n  ${wrapLines(hexValues, 12)}\n])`;
    default:
      return '';
  }
};

const wrapLines = (items, perLine) => {
  let result = '';
  for (let i = 0; i < items.length; i++) {
    result += items[i];
    if (i < items.length - 1) {
      result += ', ';
      if ((i + 1) % perLine === 0) {
        result += '\n  ';
      }
    }
  }
  return result;
};

// --- 이벤트 핸들러 ---

const processFile = async (file) => {
  if (!file) return;
  currentFile = file;
  fileNameDisplay.textContent = file.name;

  const buffer = await file.arrayBuffer();
  output.value = formatHex(buffer, currentLang, file.name);
};

// 드래그 앤 드롭
dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('dragging');
});

dropZone.addEventListener('dragleave', () => {
  dropZone.classList.remove('dragging');
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('dragging');
  const file = e.dataTransfer.files[0];
  processFile(file);
});

dropZone.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  processFile(file);
});

// 언어 선택 탭
tabs.forEach(tab => {
  tab.addEventListener('click', async () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentLang = tab.dataset.lang;

    if (currentFile) {
      const buffer = await currentFile.arrayBuffer();
      output.value = formatHex(buffer, currentLang, currentFile.name);
    }
  });
});

// 클립보드 복사
copyBtn.addEventListener('click', () => {
  if (!output.value) return;

  navigator.clipboard.writeText(output.value).then(() => {
    const originalText = copyBtn.textContent;
    copyBtn.textContent = '복사 완료!';
    copyBtn.style.background = 'var(--success)';

    setTimeout(() => {
      copyBtn.textContent = originalText;
      copyBtn.style.background = 'var(--primary)';
    }, 2000);
  });
});
