const ANTI_FLASH_SCRIPT = `(function(){try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark'){if(t==='dark')document.documentElement.classList.add('dark')}else if(window.matchMedia('(prefers-color-scheme:dark)').matches){document.documentElement.classList.add('dark')}}catch(e){document.documentElement.classList.add('dark')}})();`;

const THEME_TOGGLE_SCRIPT = `(function(){
var btn=document.getElementById('theme-toggle');
if(!btn)return;
var sun=btn.querySelector('.icon-sun');
var moon=btn.querySelector('.icon-moon');
function update(){
var d=document.documentElement.classList.contains('dark');
sun.style.display=d?'block':'none';
moon.style.display=d?'none':'block';
btn.title='Switch to '+(d?'light':'dark')+' mode';
}
btn.addEventListener('click',function(){
var d=document.documentElement.classList.toggle('dark');
try{localStorage.setItem('theme',d?'dark':'light')}catch(e){}
update();
});
update();
})();`;

const SUN_ICON = `<svg class="icon-sun" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`;

const MOON_ICON = `<svg class="icon-moon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`;

function renderHeader(): string {
  return `<header class="site-header">
  <a href="/" class="wordmark">
    <img src="/favicon.svg" alt="" width="20" height="20" />
    tokenrip
  </a>
  <div class="header-right">
    <nav class="header-nav">
      <a href="/about">About</a>
      <a href="/faq">FAQ</a>
      <a href="https://docs.tokenrip.com">Docs</a>
      <a href="/blog">Blog</a>
    </nav>
    <a href="/login" class="header-login">Login</a>
    <button id="theme-toggle" class="theme-toggle" type="button" title="Toggle theme">
      ${SUN_ICON}
      ${MOON_ICON}
    </button>
  </div>
</header>`;
}

function renderFooter(): string {
  return `<footer class="site-footer">
  <div class="site-footer-inner">
    <nav>
      <a href="/about">About</a>
      <a href="/faq">FAQ</a>
      <a href="https://docs.tokenrip.com">Docs</a>
      <a href="/blog">Blog</a>
      <a href="https://github.com/tokenrip/tokenrip-cli" target="_blank" rel="noopener noreferrer">GitHub</a>
    </nav>
    <span class="copyright">&copy; 2026 Tokenrip</span>
  </div>
</footer>`;
}

const GA_ID = process.env.GA_MEASUREMENT_ID;

function renderGASnippet(): string {
  if (!GA_ID) return '';
  return `<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');</script>`;
}

export function renderLayout(head: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<script>${ANTI_FLASH_SCRIPT}</script>
${head}
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="icon" type="image/x-icon" href="/favicon.ico" sizes="16x16 32x32 48x48">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Geist+Mono:wght@100..900&family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&display=swap">
<link rel="stylesheet" href="/blog/_assets/blog.css">
${renderGASnippet()}
</head>
<body>
<div class="site-wrapper">
${renderHeader()}
${body}
${renderFooter()}
</div>
<script>${THEME_TOGGLE_SCRIPT}</script>
<script type="module" src="/blog/_assets/blog.js"></script>
</body>
</html>`;
}
