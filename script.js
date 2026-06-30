// ---------- Element references ----------
const emailInput = document.getElementById('emailInput');
const charCount = document.getElementById('charCount');
const sentCount = document.getElementById('sentCount');
const sentValue = document.getElementById('sentValue');
const summarizeBtn = document.getElementById('summarizeBtn');
const clearBtn = document.getElementById('clearBtn');
const sampleBtn = document.getElementById('sampleBtn');
const copyBtn = document.getElementById('copyBtn');
const resultSection = document.getElementById('resultSection');
const summaryBox = document.getElementById('summary');
const reductionStat = document.getElementById('reductionStat');
const themeToggle = document.getElementById('themeToggle');
const toast = document.getElementById('toast');

const SAMPLE_EMAIL = `Hi team,

I wanted to give you a quick update on the Q3 product launch. We have finished the core development work and the engineering team is now focused on bug fixes and performance improvements. QA testing will begin next Monday and is expected to take about a week.

Marketing has confirmed the launch date of October 15th, and the press release is currently being reviewed by legal. We still need final approval on the pricing page copy before it goes live.

On the partnerships side, we are in talks with two potential integration partners, but nothing is signed yet. I will follow up with both of them this week.

Please let me know if you have any questions or concerns before our sync on Thursday. Looking forward to a strong launch.

Best regards,
Sarah`;

// ---------- Theme handling ----------
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('summarizer-theme', theme);
}

const savedTheme = localStorage.getItem('summarizer-theme') ||
  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
applyTheme(savedTheme);

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

// ---------- Character counter ----------
emailInput.addEventListener('input', () => {
  const len = emailInput.value.length;
  charCount.textContent = `${len} character${len === 1 ? '' : 's'}`;
});

// ---------- Slider ----------
sentCount.addEventListener('input', () => {
  sentValue.textContent = sentCount.value;
});

// ---------- Sample button ----------
sampleBtn.addEventListener('click', () => {
  emailInput.value = SAMPLE_EMAIL;
  emailInput.dispatchEvent(new Event('input'));
  emailInput.focus();
});

// ---------- Clear button ----------
clearBtn.addEventListener('click', () => {
  emailInput.value = '';
  emailInput.dispatchEvent(new Event('input'));
  resultSection.classList.add('hidden');
  emailInput.focus();
});

// ---------- Copy button ----------
copyBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(summaryBox.textContent).then(() => {
    showToast('Copied to clipboard!');
  });
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.remove('hidden');
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.classList.add('hidden'), 300);
  }, 2000);
}

// ---------- Stop words ----------
const STOP_WORDS = new Set([
  "the","is","a","an","and","or","but","of","to","in","on","for","with","at","by","from",
  "this","that","it","as","be","are","was","were","i","you","we","they","he","she","will",
  "would","can","could","please","regards","thanks","hi","hello","dear","sincerely","best",
  "if","not","so","there","their","our","your","my","me","us","them","than","then","also"
]);

// ---------- Summarization logic ----------
function summarizeText(text, numSentences) {
  let sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  sentences = sentences.map(s => s.trim()).filter(s => s.length > 0);

  if (sentences.length <= numSentences) {
    return { summary: sentences.join(' '), sentenceCount: sentences.length };
  }

  const wordFreq = {};
  const words = text.toLowerCase().match(/\b[a-z]+\b/g) || [];
  words.forEach(w => {
    if (!STOP_WORDS.has(w)) {
      wordFreq[w] = (wordFreq[w] || 0) + 1;
    }
  });

  const scores = sentences.map(sentence => {
    const sWords = sentence.toLowerCase().match(/\b[a-z]+\b/g) || [];
    let score = 0;
    sWords.forEach(w => { if (wordFreq[w]) score += wordFreq[w]; });
    return score / Math.max(sWords.length, 1);
  });

  const ranked = sentences
    .map((s, i) => ({ s, i, score: scores[i] }))
    .sort((a, b) => b.score - a.score)
    .slice(0, numSentences)
    .sort((a, b) => a.i - b.i);

  return {
    summary: ranked.map(r => r.s).join(' '),
    sentenceCount: sentences.length
  };
}

// ---------- Summarize button ----------
summarizeBtn.addEventListener('click', () => {
  const text = emailInput.value.trim();

  if (!text) {
    emailInput.focus();
    emailInput.style.borderColor = '#ff6b6b';
    setTimeout(() => { emailInput.style.borderColor = ''; }, 800);
    return;
  }

  const btnText = summarizeBtn.querySelector('.btn-text');
  const spinner = summarizeBtn.querySelector('.spinner');
  btnText.classList.add('hidden');
  spinner.classList.remove('hidden');
  summarizeBtn.disabled = true;

  // tiny delay so the spinner is visible, even though the work is instant
  setTimeout(() => {
    const numSentences = parseInt(sentCount.value) || 3;
    const { summary, sentenceCount } = summarizeText(text, numSentences);

    summaryBox.textContent = summary;

    const reduction = sentenceCount > 0
      ? Math.round((1 - Math.min(numSentences, sentenceCount) / sentenceCount) * 100)
      : 0;
    reductionStat.textContent = reduction > 0 ? `${reduction}% shorter` : 'Full text shown';

    resultSection.classList.remove('hidden');
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    btnText.classList.remove('hidden');
    spinner.classList.add('hidden');
    summarizeBtn.disabled = false;
  }, 400);
});

// ---------- Keyboard shortcut: Ctrl/Cmd + Enter to summarize ----------
emailInput.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    summarizeBtn.click();
  }
});
