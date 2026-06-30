# Email Summarizer

A simple, fast email summarizer that runs entirely in your browser. Paste any email, pick how many sentences you want, and get an instant summary — no server, no API key, no data ever leaves your device.

## Features

- Instant extractive summarization (frequency-based, no AI API required)
- Adjustable summary length (1–10 sentences) via slider
- Dark mode toggle with saved preference
- Live character counter
- "Try sample" button to demo with a pre-loaded email
- Copy-to-clipboard with toast confirmation
- "% shorter" badge showing how much the text was condensed
- Loading spinner and smooth animations
- Keyboard shortcut: Ctrl + Enter to summarize
- Fully responsive (works on mobile)

## Files

email-summarizer/
├── index.html   # Page structure
├── style.css    # Styling, theming, animations
└── script.js    # Summarization logic and interactivity


## How to use

1. Download all three files ("index.html", "style.css", "script.js") into the same folder.
2. Open "index.html" in any modern web browser (Chrome, Firefox, Safari, Edge).
3. Paste an email into the text box.
4. Adjust the summary length slider if needed.
5. Click **Summarize** (or press "Ctrl + Enter").
6. Click **Copy** to copy the summary to your clipboard.

No installation, build step, or internet connection required.

## How it works

The summarizer uses a simple **extractive** algorithm:

1. The email is split into individual sentences.
2. Word frequency is calculated across the whole text, ignoring common filler words (e.g. "the," "please," "regards").
3. Each sentence is scored by the combined frequency of its meaningful words.
4. The highest-scoring sentences are selected and returned in their original order.

This means the summary is always made up of real sentences taken directly from your email — nothing is rewritten or invented.

## Limitations

- Works best on longer, well-structured emails (a few paragraphs or more).
- Since it's extractive, it won't paraphrase or generate new sentences — it only selects existing ones.
- Very short emails may return the full text since there's nothing meaningful to trim.

## Customization

- **Stop words**: edit the "STOP_WORDS" list in "script.js" to change which words are ignored when scoring.
- **Colors/theme**: edit the CSS variables at the top of "style.css" (":root" and "[data-theme="dark"]").
- **Default summary length**: change the "value" attribute on the "#sentCount" slider in "index.html".

