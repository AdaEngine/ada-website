import './studio.css'
import { appStoreURL } from './downloads'

type UrlFor = (path: string) => string

// Lucide-style outline icons share one size and stroke across the page.
function icon(name: 'desktop' | 'phone' | 'scene' | 'code' | 'agent' | 'arrow'): string {
  const paths = {
    desktop: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 21h8m-4-5v5"/>',
    phone: '<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M11 18h2"/>',
    scene: '<path d="m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5"/>',
    code: '<path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-14-2 18"/>',
    agent: '<path d="m12 3 2.4 6.6L21 12l-6.6 2.4L12 21l-2.4-6.6L3 12l6.6-2.4L12 3Z"/>',
    arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
  }
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`
}

export function renderStudioContent(hrefFor: UrlFor, assetFor: UrlFor): string {
  return `
    <main class="studio-page">
      <section class="studio-hero container content-restriction" aria-labelledby="studio-title">
        <p class="studio-eyebrow"><img src="${assetFor('images/ae_logo~dark.svg')}" alt="" width="22" height="22" /> Ada Studio</p>
        <h1 id="studio-title">Your next game.<br /><span>Starts here.</span></h1>
        <p class="studio-lead">A home for your ideas, scenes, and code.<br class="studio-desktop-break" /> Create with Ada on your desktop, iPad, or phone.</p>
        <nav class="studio-platform-links" aria-label="Explore Ada Studio platforms">
          <a href="#desktop-ipad">${icon('desktop')}<span>Desktop / iPad</span>${icon('arrow')}</a>
          <a href="#mobile">${icon('phone')}<span>Mobile</span>${icon('arrow')}</a>
        </nav>
        <figure class="studio-hero-media">
          <div class="studio-editor-frame">
            <img src="${assetFor('images/studio/desktop.png')}" alt="Ada Studio desktop workspace with project files, Swift code, and build output" width="2000" height="1139" fetchpriority="high" />
          </div>
          <div class="studio-hero-phone studio-phone-frame">
            <img src="${assetFor('images/studio/mobile-projects.jpg')}" alt="Ada mobile project library with a Foxwood game preview" width="368" height="800" />
          </div>
          <figcaption><span>More room to build. More ways to create.</span><span>Powered by Ada</span></figcaption>
        </figure>
      </section>

      <section id="desktop-ipad" class="studio-section container content-restriction" aria-labelledby="studio-desktop-title">
        <div class="studio-section-heading">
          <p class="studio-eyebrow">${icon('desktop')} Desktop / iPad</p>
          <h2 id="studio-desktop-title">Space for your<br /><span>big ideas.</span></h2>
          <p>A focused workspace for the whole picture. Shape your scene, find the right file, and keep your code close to the world you’re building.</p>
          <div class="studio-actions">
            <a class="studio-button studio-button-primary" href="${hrefFor('/download')}">Get Ada Studio ${icon('arrow')}</a>
            <a class="studio-text-link" href="${appStoreURL}">Get it for iPad ${icon('arrow')}</a>
          </div>
        </div>
        <div class="studio-workspace-grid">
          <article class="studio-scene-card">
            <div class="studio-card-copy"><span class="studio-feature-icon">${icon('scene')}</span><h3>Build a world. Make it yours.</h3><p>Work with scenes, entities, and components. Turn a collection of assets into the start of something playable.</p></div>
            <div class="studio-scene-art"><img src="${assetFor('images/main/tilemap.png')}" alt="A colorful 2D tilemap world built with Ada" width="1824" height="1480" loading="lazy" /></div>
            <span class="studio-media-label">Made with Ada</span>
          </article>
          <div class="studio-workspace-details">
            <article class="studio-code-card">
              <div class="studio-card-copy"><span class="studio-feature-icon">${icon('code')}</span><h3>Your code. Your creative flow.</h3><p>Write in Swift and AdaScript. Keep gameplay logic, project files, and tools together.</p></div>
              <div class="studio-file-tabs" aria-hidden="true"><span>Player.swift</span><span>game.ada</span></div>
              <pre class="studio-code-sample" aria-label="Swift component example"><code><span class="studio-code-purple">@Component</span>
<span class="studio-code-blue">struct</span> Player {
    <span class="studio-code-blue">var</span> speed: <span class="studio-code-mint">Float</span> = <span class="studio-code-peach">240</span>
}</code></pre>
            </article>
            <article class="studio-agent-card"><span class="studio-feature-icon">${icon('agent')}</span><div><h3>A little help. A lot of possibility.</h3><p>Work with an AI agent inside your project. Explore an idea, ask about code, and shape your next change.</p></div></article>
          </div>
        </div>
        <div class="studio-ipad-note">${icon('desktop')}<p><strong>A bigger canvas. A familiar workspace.</strong> Desktop and iPad put your project at the center, with room for scenes, code, and the tools around them.</p></div>
      </section>

      <section id="mobile" class="studio-section studio-mobile-section container content-restriction" aria-labelledby="studio-mobile-title">
        <div class="studio-mobile-copy">
          <p class="studio-eyebrow">${icon('phone')} Mobile</p>
          <h2 id="studio-mobile-title">Small screen.<br /><span>Big imagination.</span></h2>
          <p class="studio-section-lead">An idea can happen anywhere. Give it a place to grow, right on your phone.</p>
          <ol class="studio-mobile-steps">
            <li><span>01</span><div><h3>Start with an idea.</h3><p>Describe the game you have in mind. Work with an agent to build it into an Ada project.</p></div></li>
            <li><span>02</span><div><h3>Go from build to play.</h3><p>Open your game on the same device. Try it, feel it, and find your next idea.</p></div></li>
            <li><span>03</span><div><h3>Show what you mean.</h3><p>Capture a game frame, mark the part you want to change, and send your feedback to the agent.</p></div></li>
          </ol>
          <a class="studio-button studio-button-primary" href="${appStoreURL}">Get Ada for iPhone ${icon('arrow')}</a>
        </div>
        <figure class="studio-mobile-media">
          <div class="studio-phone-pair">
            <div class="studio-phone-frame studio-phone-build"><img src="${assetFor('images/studio/mobile-build.jpg')}" alt="Mobile interface preview: describe a fox platformer idea in the Build screen" width="368" height="800" loading="lazy" /><span class="studio-phone-caption">Build</span></div>
            <div class="studio-phone-frame studio-phone-play"><img src="${assetFor('images/studio/mobile-play.jpg')}" alt="Mobile interface preview: a fox platformer scene and feedback prompt in the Play screen" width="368" height="800" loading="lazy" /><span class="studio-phone-caption">Play</span></div>
          </div>
          <figcaption>Mobile interface previews</figcaption>
        </figure>
      </section>

      <section class="studio-final container content-restriction" aria-labelledby="studio-final-title">
        <div class="studio-final-inner">
          <img class="studio-final-logo" src="${assetFor('images/ae_logo~dark.svg')}" alt="" width="64" height="64" loading="lazy" />
          <p class="studio-eyebrow">Make something only you could make.</p>
          <h2 id="studio-final-title">An idea is a great start.<br />Let’s make it a game.</h2>
          <div class="studio-actions">
            <a class="studio-button studio-button-primary" href="${hrefFor('/download')}">Get Ada Studio ${icon('arrow')}</a>
            <a class="studio-button studio-button-secondary" href="${hrefFor('/demos')}">Explore Ada demos ${icon('arrow')}</a>
          </div>
          <a class="studio-source-link" href="https://github.com/AdaEngine/AdaEngine/tree/main/Editor">Explore the editor on GitHub ↗</a>
        </div>
      </section>
    </main>
  `
}
