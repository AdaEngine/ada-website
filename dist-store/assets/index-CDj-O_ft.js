const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/store-BVbJnx0R.js","assets/store-2FOLT5Bp.css","assets/cloud-CvdvMZdn.js","assets/cloud-CeJ0Xkfw.css"])))=>i.map(i=>d[i]);
(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))a(o);new MutationObserver(o=>{for(const r of o)if(r.type==="childList")for(const s of r.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&a(s)}).observe(document,{childList:!0,subtree:!0});function n(o){const r={};return o.integrity&&(r.integrity=o.integrity),o.referrerPolicy&&(r.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?r.credentials="include":o.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function a(o){if(o.ep)return;o.ep=!0;const r=n(o);fetch(o.href,r)}})();const Sn="modulepreload",_n=function(e){return"/"+e},gt={},mt=function(t,n,a){let o=Promise.resolve();if(n&&n.length>0){document.getElementsByTagName("link");const s=document.querySelector("meta[property=csp-nonce]"),i=(s==null?void 0:s.nonce)||(s==null?void 0:s.getAttribute("nonce"));o=Promise.allSettled(n.map(c=>{if(c=_n(c),c in gt)return;gt[c]=!0;const l=c.endsWith(".css"),d=l?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${d}`))return;const p=document.createElement("link");if(p.rel=l?"stylesheet":Sn,l||(p.as="script"),p.crossOrigin="",p.href=c,i&&p.setAttribute("nonce",i),document.head.appendChild(p),l)return new Promise((b,y)=>{p.addEventListener("load",b),p.addEventListener("error",()=>y(new Error(`Unable to preload CSS for ${c}`)))})}))}function r(s){const i=new Event("vite:preloadError",{cancelable:!0});if(i.payload=s,window.dispatchEvent(i),!i.defaultPrevented)throw s}return o.then(s=>{for(const i of s||[])i.status==="rejected"&&r(i.reason);return t().catch(r)})},at="https://apps.apple.com/app/id6809145006",se={version:"1.0",url:"https://github.com/AdaEngine/AdaEngine/releases/tag/editor-v1.0-1",assets:[{name:"AdaEngine-1.0-1-macOS.zip",url:"https://github.com/AdaEngine/AdaEngine/releases/download/editor-v1.0-1/AdaEngine-1.0-1-macOS.zip"}]};function ht(e){if(typeof e=="string")try{const t=new URL(e);return t.protocol==="https:"&&t.hostname==="github.com"&&!t.username&&!t.password&&t.pathname.startsWith("/AdaEngine/AdaEngine/releases/")?t.href:void 0}catch{return}}function Tn(e){var s;if(!e||typeof e!="object")return;const t=e,n=ht(t.html_url);if(t.draft||t.prerelease||typeof t.tag_name!="string"||!n)return;const o=((s=t.tag_name.match(/^editor-v(\d+\.\d+(?:\.\d+)?)-\d+$/))==null?void 0:s[1])??t.tag_name.replace(/^(?:editor-)?v/,"");if(!/^\d+\.\d+(?:\.\d+)?(?:[-.][a-zA-Z0-9]+)*$/.test(o))return;const r=[];if(Array.isArray(t.assets))for(const i of t.assets){if(!i||typeof i!="object")continue;const c=ht(i.browser_download_url);typeof i.name=="string"&&c&&r.push({name:i.name,url:c})}return{version:o,url:n,assets:r}}function Rt(e,t){return t.assets.filter(({name:n})=>/\.(?:sha\d*|sig|asc|blockmap)$/i.test(n)?!1:e==="windows"?/\.(?:exe|msi)$/i.test(n)||/(?:windows|win32|win64).*\.zip$/i.test(n):e==="macos"?/\.(?:dmg|pkg)$/i.test(n)||/(?:macos|mac|darwin|osx).*\.zip$/i.test(n):/\.appimage$/i.test(n)||/linux.*\.(?:zip|tar\.gz|tar\.xz|deb|rpm)$/i.test(n))}function kn(e){return/(?:arm64|aarch64|apple-silicon)/i.test(e.name)?"Download · ARM64":/(?:x86_64|amd64|x64|intel)/i.test(e.name)?"Download · Intel / AMD":"Download"}function xn(e){if(!Array.isArray(e))return se;const t=e.map(Tn).filter(n=>n!==void 0);return t.find(n=>["macos","windows","linux"].some(a=>Rt(a,n).length>0))??(se.assets.length?se:t[0]??se)}async function $n(){try{const e=await fetch("https://api.github.com/repos/AdaEngine/AdaEngine/releases?per_page=20",{headers:{Accept:"application/vnd.github+json"},signal:AbortSignal.timeout(5e3)});if(!e.ok)return se;const t=await e.json();return xn(t)}catch{}return se}function j(e){return`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${{desktop:'<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 21h8m-4-5v5"/>',phone:'<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M11 18h2"/>',scene:'<path d="m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5"/>',code:'<path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-14-2 18"/>',agent:'<path d="m12 3 2.4 6.6L21 12l-6.6 2.4L12 21l-2.4-6.6L3 12l6.6-2.4L12 3Z"/>',arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>'}[e]}</svg>`}function In(e,t){return`
    <main class="studio-page">
      <section class="studio-hero container content-restriction" aria-labelledby="studio-title">
        <p class="studio-eyebrow"><img src="${t("images/ae_logo~dark.svg")}" alt="" width="22" height="22" /> Ada Studio</p>
        <h1 id="studio-title">Your next game.<br /><span>Starts here.</span></h1>
        <p class="studio-lead">A home for your ideas, scenes, and code.<br class="studio-desktop-break" /> Create with Ada on your desktop, iPad, or phone.</p>
        <nav class="studio-platform-links" aria-label="Explore Ada Studio platforms">
          <a href="#desktop-ipad">${j("desktop")}<span>Desktop / iPad</span>${j("arrow")}</a>
          <a href="#mobile">${j("phone")}<span>Mobile</span>${j("arrow")}</a>
        </nav>
        <figure class="studio-hero-media">
          <div class="studio-editor-frame">
            <img src="${t("images/studio/desktop.png")}" alt="Ada Studio desktop workspace with project files, Swift code, and build output" width="2000" height="1139" fetchpriority="high" />
          </div>
          <div class="studio-hero-phone studio-phone-frame">
            <img src="${t("images/studio/mobile-projects.jpg")}" alt="Ada mobile project library with a Foxwood game preview" width="368" height="800" />
          </div>
          <figcaption><span>More room to build. More ways to create.</span><span>Powered by Ada</span></figcaption>
        </figure>
      </section>

      <section id="desktop-ipad" class="studio-section container content-restriction" aria-labelledby="studio-desktop-title">
        <div class="studio-section-heading">
          <p class="studio-eyebrow">${j("desktop")} Desktop / iPad</p>
          <h2 id="studio-desktop-title">Space for your<br /><span>big ideas.</span></h2>
          <p>A focused workspace for the whole picture. Shape your scene, find the right file, and keep your code close to the world you’re building.</p>
          <div class="studio-actions">
            <a class="studio-button studio-button-primary" href="${e("/download")}">Get Ada Studio ${j("arrow")}</a>
            <a class="studio-text-link" href="${at}">Get it for iPad ${j("arrow")}</a>
          </div>
        </div>
        <div class="studio-workspace-grid">
          <article class="studio-scene-card">
            <div class="studio-card-copy"><span class="studio-feature-icon">${j("scene")}</span><h3>Build a world. Make it yours.</h3><p>Work with scenes, entities, and components. Turn a collection of assets into the start of something playable.</p></div>
            <div class="studio-scene-art"><img src="${t("images/main/tilemap.png")}" alt="A colorful 2D tilemap world built with Ada" width="1824" height="1480" loading="lazy" /></div>
            <span class="studio-media-label">Made with Ada</span>
          </article>
          <div class="studio-workspace-details">
            <article class="studio-code-card">
              <div class="studio-card-copy"><span class="studio-feature-icon">${j("code")}</span><h3>Your code. Your creative flow.</h3><p>Write in Swift and AdaScript. Keep gameplay logic, project files, and tools together.</p></div>
              <div class="studio-file-tabs" aria-hidden="true"><span>Player.swift</span><span>game.ada</span></div>
              <pre class="studio-code-sample" aria-label="Swift component example"><code><span class="studio-code-purple">@Component</span>
<span class="studio-code-blue">struct</span> Player {
    <span class="studio-code-blue">var</span> speed: <span class="studio-code-mint">Float</span> = <span class="studio-code-peach">240</span>
}</code></pre>
            </article>
            <article class="studio-agent-card"><span class="studio-feature-icon">${j("agent")}</span><div><h3>A little help. A lot of possibility.</h3><p>Work with an AI agent inside your project. Explore an idea, ask about code, and shape your next change.</p></div></article>
          </div>
        </div>
        <div class="studio-ipad-note">${j("desktop")}<p><strong>A bigger canvas. A familiar workspace.</strong> Desktop and iPad put your project at the center, with room for scenes, code, and the tools around them.</p></div>
      </section>

      <section id="mobile" class="studio-section studio-mobile-section container content-restriction" aria-labelledby="studio-mobile-title">
        <div class="studio-mobile-copy">
          <p class="studio-eyebrow">${j("phone")} Mobile</p>
          <h2 id="studio-mobile-title">Small screen.<br /><span>Big imagination.</span></h2>
          <p class="studio-section-lead">An idea can happen anywhere. Give it a place to grow, right on your phone.</p>
          <ol class="studio-mobile-steps">
            <li><span>01</span><div><h3>Start with an idea.</h3><p>Describe the game you have in mind. Work with an agent to build it into an Ada project.</p></div></li>
            <li><span>02</span><div><h3>Go from build to play.</h3><p>Open your game on the same device. Try it, feel it, and find your next idea.</p></div></li>
            <li><span>03</span><div><h3>Show what you mean.</h3><p>Capture a game frame, mark the part you want to change, and send your feedback to the agent.</p></div></li>
          </ol>
          <a class="studio-button studio-button-primary" href="${at}">Get Ada for iPhone ${j("arrow")}</a>
        </div>
        <figure class="studio-mobile-media">
          <div class="studio-phone-pair">
            <div class="studio-phone-frame studio-phone-build"><img src="${t("images/studio/mobile-build.jpg")}" alt="Mobile interface preview: describe a fox platformer idea in the Build screen" width="368" height="800" loading="lazy" /><span class="studio-phone-caption">Build</span></div>
            <div class="studio-phone-frame studio-phone-play"><img src="${t("images/studio/mobile-play.jpg")}" alt="Mobile interface preview: a fox platformer scene and feedback prompt in the Play screen" width="368" height="800" loading="lazy" /><span class="studio-phone-caption">Play</span></div>
          </div>
          <figcaption>Mobile interface previews</figcaption>
        </figure>
      </section>

      <section class="studio-final container content-restriction" aria-labelledby="studio-final-title">
        <div class="studio-final-inner">
          <img class="studio-final-logo" src="${t("images/ae_logo~dark.svg")}" alt="" width="64" height="64" loading="lazy" />
          <p class="studio-eyebrow">Make something only you could make.</p>
          <h2 id="studio-final-title">An idea is a great start.<br />Let’s make it a game.</h2>
          <div class="studio-actions">
            <a class="studio-button studio-button-primary" href="${e("/download")}">Get Ada Studio ${j("arrow")}</a>
            <a class="studio-button studio-button-secondary" href="${e("/demos")}">Explore Ada demos ${j("arrow")}</a>
          </div>
          <a class="studio-source-link" href="https://github.com/AdaEngine/AdaEngine/tree/main/Editor">Explore the editor on GitHub ↗</a>
        </div>
      </section>
    </main>
  `}function Nn(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}function Lt(e){return e instanceof Map?e.clear=e.delete=e.set=function(){throw new Error("map is read-only")}:e instanceof Set&&(e.add=e.clear=e.delete=function(){throw new Error("set is read-only")}),Object.freeze(e),Object.getOwnPropertyNames(e).forEach(t=>{const n=e[t],a=typeof n;(a==="object"||a==="function")&&!Object.isFrozen(n)&&Lt(n)}),e}class ft{constructor(t){t.data===void 0&&(t.data={}),this.data=t.data,this.isMatchIgnored=!1}ignoreMatch(){this.isMatchIgnored=!0}}function Ot(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function me(e,...t){const n=Object.create(null);for(const a in e)n[a]=e[a];return t.forEach(function(a){for(const o in a)n[o]=a[o]}),n}const Cn="</span>",bt=e=>!!e.scope,Mn=(e,{prefix:t})=>{if(e.startsWith("language:"))return e.replace("language:","language-");if(e.includes(".")){const n=e.split(".");return[`${t}${n.shift()}`,...n.map((a,o)=>`${a}${"_".repeat(o+1)}`)].join(" ")}return`${t}${e}`};class Rn{constructor(t,n){this.buffer="",this.classPrefix=n.classPrefix,t.walk(this)}addText(t){this.buffer+=Ot(t)}openNode(t){if(!bt(t))return;const n=Mn(t.scope,{prefix:this.classPrefix});this.span(n)}closeNode(t){bt(t)&&(this.buffer+=Cn)}value(){return this.buffer}span(t){this.buffer+=`<span class="${t}">`}}const yt=(e={})=>{const t={children:[]};return Object.assign(t,e),t};class it{constructor(){this.rootNode=yt(),this.stack=[this.rootNode]}get top(){return this.stack[this.stack.length-1]}get root(){return this.rootNode}add(t){this.top.children.push(t)}openNode(t){const n=yt({scope:t});this.add(n),this.stack.push(n)}closeNode(){if(this.stack.length>1)return this.stack.pop()}closeAllNodes(){for(;this.closeNode(););}toJSON(){return JSON.stringify(this.rootNode,null,4)}walk(t){return this.constructor._walk(t,this.rootNode)}static _walk(t,n){return typeof n=="string"?t.addText(n):n.children&&(t.openNode(n),n.children.forEach(a=>this._walk(t,a)),t.closeNode(n)),t}static _collapse(t){typeof t!="string"&&t.children&&(t.children.every(n=>typeof n=="string")?t.children=[t.children.join("")]:t.children.forEach(n=>{it._collapse(n)}))}}class Ln extends it{constructor(t){super(),this.options=t}addText(t){t!==""&&this.add(t)}startScope(t){this.openNode(t)}endScope(){this.closeNode()}__addSublanguage(t,n){const a=t.root;n&&(a.scope=`language:${n}`),this.add(a)}toHTML(){return new Rn(this,this.options).value()}finalize(){return this.closeAllNodes(),!0}}function Ne(e){return e?typeof e=="string"?e:e.source:null}function Dt(e){return ve("(?=",e,")")}function On(e){return ve("(?:",e,")*")}function Dn(e){return ve("(?:",e,")?")}function ve(...e){return e.map(n=>Ne(n)).join("")}function Pn(e){const t=e[e.length-1];return typeof t=="object"&&t.constructor===Object?(e.splice(e.length-1,1),t):{}}function ot(...e){return"("+(Pn(e).capture?"":"?:")+e.map(a=>Ne(a)).join("|")+")"}function Pt(e){return new RegExp(e.toString()+"|").exec("").length-1}function Bn(e,t){const n=e&&e.exec(t);return n&&n.index===0}const Un=/\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;function rt(e,{joinWith:t}){let n=0;return e.map(a=>{n+=1;const o=n;let r=Ne(a),s="";for(;r.length>0;){const i=Un.exec(r);if(!i){s+=r;break}s+=r.substring(0,i.index),r=r.substring(i.index+i[0].length),i[0][0]==="\\"&&i[1]?s+="\\"+String(Number(i[1])+o):(s+=i[0],i[0]==="("&&n++)}return s}).map(a=>`(${a})`).join(t)}const Fn=/\b\B/,Bt="[a-zA-Z]\\w*",ct="[a-zA-Z_]\\w*",Ut="\\b\\d+(\\.\\d+)?",Ft="(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",Ht="\\b(0b[01]+)",Hn="!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",Gn=(e={})=>{const t=/^#![ ]*\//;return e.binary&&(e.begin=ve(t,/.*\b/,e.binary,/\b.*/)),me({scope:"meta",begin:t,end:/$/,relevance:0,"on:begin":(n,a)=>{n.index!==0&&a.ignoreMatch()}},e)},Ce={begin:"\\\\[\\s\\S]",relevance:0},zn={scope:"string",begin:"'",end:"'",illegal:"\\n",contains:[Ce]},Wn={scope:"string",begin:'"',end:'"',illegal:"\\n",contains:[Ce]},qn={begin:/\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/},ze=function(e,t,n={}){const a=me({scope:"comment",begin:e,end:t,contains:[]},n);a.contains.push({scope:"doctag",begin:"[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",end:/(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,excludeBegin:!0,relevance:0});const o=ot("I","a","is","so","us","to","at","if","in","it","on",/[A-Za-z]+['](d|ve|re|ll|t|s|n)/,/[A-Za-z]+[-][a-z]+/,/[A-Za-z][a-z]{2,}/);return a.contains.push({begin:ve(/[ ]+/,"(",o,/[.]?[:]?([.][ ]|[ ])/,"){3}")}),a},jn=ze("//","$"),Vn=ze("/\\*","\\*/"),Kn=ze("#","$"),Zn={scope:"number",begin:Ut,relevance:0},Yn={scope:"number",begin:Ft,relevance:0},Xn={scope:"number",begin:Ht,relevance:0},Jn={scope:"regexp",begin:/\/(?=[^/\n]*\/)/,end:/\/[gimuy]*/,contains:[Ce,{begin:/\[/,end:/\]/,relevance:0,contains:[Ce]}]},Qn={scope:"title",begin:Bt,relevance:0},ea={scope:"title",begin:ct,relevance:0},ta={begin:"\\.\\s*"+ct,relevance:0},na=function(e){return Object.assign(e,{"on:begin":(t,n)=>{n.data._beginMatch=t[1]},"on:end":(t,n)=>{n.data._beginMatch!==t[1]&&n.ignoreMatch()}})};var De=Object.freeze({__proto__:null,APOS_STRING_MODE:zn,BACKSLASH_ESCAPE:Ce,BINARY_NUMBER_MODE:Xn,BINARY_NUMBER_RE:Ht,COMMENT:ze,C_BLOCK_COMMENT_MODE:Vn,C_LINE_COMMENT_MODE:jn,C_NUMBER_MODE:Yn,C_NUMBER_RE:Ft,END_SAME_AS_BEGIN:na,HASH_COMMENT_MODE:Kn,IDENT_RE:Bt,MATCH_NOTHING_RE:Fn,METHOD_GUARD:ta,NUMBER_MODE:Zn,NUMBER_RE:Ut,PHRASAL_WORDS_MODE:qn,QUOTE_STRING_MODE:Wn,REGEXP_MODE:Jn,RE_STARTERS_RE:Hn,SHEBANG:Gn,TITLE_MODE:Qn,UNDERSCORE_IDENT_RE:ct,UNDERSCORE_TITLE_MODE:ea});function aa(e,t){e.input[e.index-1]==="."&&t.ignoreMatch()}function sa(e,t){e.className!==void 0&&(e.scope=e.className,delete e.className)}function ia(e,t){t&&e.beginKeywords&&(e.begin="\\b("+e.beginKeywords.split(" ").join("|")+")(?!\\.)(?=\\b|\\s)",e.__beforeBegin=aa,e.keywords=e.keywords||e.beginKeywords,delete e.beginKeywords,e.relevance===void 0&&(e.relevance=0))}function oa(e,t){Array.isArray(e.illegal)&&(e.illegal=ot(...e.illegal))}function ra(e,t){if(e.match){if(e.begin||e.end)throw new Error("begin & end are not supported with match");e.begin=e.match,delete e.match}}function ca(e,t){e.relevance===void 0&&(e.relevance=1)}const la=(e,t)=>{if(!e.beforeMatch)return;if(e.starts)throw new Error("beforeMatch cannot be used with starts");const n=Object.assign({},e);Object.keys(e).forEach(a=>{delete e[a]}),e.keywords=n.keywords,e.begin=ve(n.beforeMatch,Dt(n.begin)),e.starts={relevance:0,contains:[Object.assign(n,{endsParent:!0})]},e.relevance=0,delete n.beforeMatch},da=["of","and","for","in","not","or","if","then","parent","list","value"],ua="keyword";function Gt(e,t,n=ua){const a=Object.create(null);return typeof e=="string"?o(n,e.split(" ")):Array.isArray(e)?o(n,e):Object.keys(e).forEach(function(r){Object.assign(a,Gt(e[r],t,r))}),a;function o(r,s){t&&(s=s.map(i=>i.toLowerCase())),s.forEach(function(i){const c=i.split("|");a[c[0]]=[r,pa(c[0],c[1])]})}}function pa(e,t){return t?Number(t):ga(e)?0:1}function ga(e){return da.includes(e.toLowerCase())}const wt={},we=e=>{console.error(e)},vt=(e,...t)=>{console.log(`WARN: ${e}`,...t)},Se=(e,t)=>{wt[`${e}/${t}`]||(console.log(`Deprecated as of ${e}. ${t}`),wt[`${e}/${t}`]=!0)},Fe=new Error;function zt(e,t,{key:n}){let a=0;const o=e[n],r={},s={};for(let i=1;i<=t.length;i++)s[i+a]=o[i],r[i+a]=!0,a+=Pt(t[i-1]);e[n]=s,e[n]._emit=r,e[n]._multi=!0}function ma(e){if(Array.isArray(e.begin)){if(e.skip||e.excludeBegin||e.returnBegin)throw we("skip, excludeBegin, returnBegin not compatible with beginScope: {}"),Fe;if(typeof e.beginScope!="object"||e.beginScope===null)throw we("beginScope must be object"),Fe;zt(e,e.begin,{key:"beginScope"}),e.begin=rt(e.begin,{joinWith:""})}}function ha(e){if(Array.isArray(e.end)){if(e.skip||e.excludeEnd||e.returnEnd)throw we("skip, excludeEnd, returnEnd not compatible with endScope: {}"),Fe;if(typeof e.endScope!="object"||e.endScope===null)throw we("endScope must be object"),Fe;zt(e,e.end,{key:"endScope"}),e.end=rt(e.end,{joinWith:""})}}function fa(e){e.scope&&typeof e.scope=="object"&&e.scope!==null&&(e.beginScope=e.scope,delete e.scope)}function ba(e){fa(e),typeof e.beginScope=="string"&&(e.beginScope={_wrap:e.beginScope}),typeof e.endScope=="string"&&(e.endScope={_wrap:e.endScope}),ma(e),ha(e)}function ya(e){function t(s,i){return new RegExp(Ne(s),"m"+(e.case_insensitive?"i":"")+(e.unicodeRegex?"u":"")+(i?"g":""))}class n{constructor(){this.matchIndexes={},this.regexes=[],this.matchAt=1,this.position=0}addRule(i,c){c.position=this.position++,this.matchIndexes[this.matchAt]=c,this.regexes.push([c,i]),this.matchAt+=Pt(i)+1}compile(){this.regexes.length===0&&(this.exec=()=>null);const i=this.regexes.map(c=>c[1]);this.matcherRe=t(rt(i,{joinWith:"|"}),!0),this.lastIndex=0}exec(i){this.matcherRe.lastIndex=this.lastIndex;const c=this.matcherRe.exec(i);if(!c)return null;const l=c.findIndex((p,b)=>b>0&&p!==void 0),d=this.matchIndexes[l];return c.splice(0,l),Object.assign(c,d)}}class a{constructor(){this.rules=[],this.multiRegexes=[],this.count=0,this.lastIndex=0,this.regexIndex=0}getMatcher(i){if(this.multiRegexes[i])return this.multiRegexes[i];const c=new n;return this.rules.slice(i).forEach(([l,d])=>c.addRule(l,d)),c.compile(),this.multiRegexes[i]=c,c}resumingScanAtSamePosition(){return this.regexIndex!==0}considerAll(){this.regexIndex=0}addRule(i,c){this.rules.push([i,c]),c.type==="begin"&&this.count++}exec(i){const c=this.getMatcher(this.regexIndex);c.lastIndex=this.lastIndex;let l=c.exec(i);if(this.resumingScanAtSamePosition()&&!(l&&l.index===this.lastIndex)){const d=this.getMatcher(0);d.lastIndex=this.lastIndex+1,l=d.exec(i)}return l&&(this.regexIndex+=l.position+1,this.regexIndex===this.count&&this.considerAll()),l}}function o(s){const i=new a;return s.contains.forEach(c=>i.addRule(c.begin,{rule:c,type:"begin"})),s.terminatorEnd&&i.addRule(s.terminatorEnd,{type:"end"}),s.illegal&&i.addRule(s.illegal,{type:"illegal"}),i}function r(s,i){const c=s;if(s.isCompiled)return c;[sa,ra,ba,la].forEach(d=>d(s,i)),e.compilerExtensions.forEach(d=>d(s,i)),s.__beforeBegin=null,[ia,oa,ca].forEach(d=>d(s,i)),s.isCompiled=!0;let l=null;return typeof s.keywords=="object"&&s.keywords.$pattern&&(s.keywords=Object.assign({},s.keywords),l=s.keywords.$pattern,delete s.keywords.$pattern),l=l||/\w+/,s.keywords&&(s.keywords=Gt(s.keywords,e.case_insensitive)),c.keywordPatternRe=t(l,!0),i&&(s.begin||(s.begin=/\B|\b/),c.beginRe=t(c.begin),!s.end&&!s.endsWithParent&&(s.end=/\B|\b/),s.end&&(c.endRe=t(c.end)),c.terminatorEnd=Ne(c.end)||"",s.endsWithParent&&i.terminatorEnd&&(c.terminatorEnd+=(s.end?"|":"")+i.terminatorEnd)),s.illegal&&(c.illegalRe=t(s.illegal)),s.contains||(s.contains=[]),s.contains=[].concat(...s.contains.map(function(d){return wa(d==="self"?s:d)})),s.contains.forEach(function(d){r(d,c)}),s.starts&&r(s.starts,i),c.matcher=o(c),c}if(e.compilerExtensions||(e.compilerExtensions=[]),e.contains&&e.contains.includes("self"))throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");return e.classNameAliases=me(e.classNameAliases||{}),r(e)}function Wt(e){return e?e.endsWithParent||Wt(e.starts):!1}function wa(e){return e.variants&&!e.cachedVariants&&(e.cachedVariants=e.variants.map(function(t){return me(e,{variants:null},t)})),e.cachedVariants?e.cachedVariants:Wt(e)?me(e,{starts:e.starts?me(e.starts):null}):Object.isFrozen(e)?me(e):e}var va="11.11.1";class Ea extends Error{constructor(t,n){super(t),this.name="HTMLInjectionError",this.html=n}}const Xe=Ot,Et=me,At=Symbol("nomatch"),Aa=7,qt=function(e){const t=Object.create(null),n=Object.create(null),a=[];let o=!0;const r="Could not find the language '{}', did you forget to load/include a language module?",s={disableAutodetect:!0,name:"Plain text",contains:[]};let i={ignoreUnescapedHTML:!1,throwUnescapedHTML:!1,noHighlightRe:/^(no-?highlight)$/i,languageDetectRe:/\blang(?:uage)?-([\w-]+)\b/i,classPrefix:"hljs-",cssSelector:"pre code",languages:null,__emitter:Ln};function c(u){return i.noHighlightRe.test(u)}function l(u){let h=u.className+" ";h+=u.parentNode?u.parentNode.className:"";const m=i.languageDetectRe.exec(h);if(m){const A=H(m[1]);return A||(vt(r.replace("{}",m[1])),vt("Falling back to no-highlight mode for this block.",u)),A?m[1]:"no-highlight"}return h.split(/\s+/).find(A=>c(A)||H(A))}function d(u,h,m){let A="",x="";typeof h=="object"?(A=u,m=h.ignoreIllegals,x=h.language):(Se("10.7.0","highlight(lang, code, ...args) has been deprecated."),Se("10.7.0",`Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`),x=u,A=h),m===void 0&&(m=!0);const D={code:A,language:x};ne("before:highlight",D);const F=D.result?D.result:p(D.language,D.code,m);return F.code=D.code,ne("after:highlight",F),F}function p(u,h,m,A){const x=Object.create(null);function D(g,f){return g.keywords[f]}function F(){if(!E.keywords){G.addText(P);return}let g=0;E.keywordPatternRe.lastIndex=0;let f=E.keywordPatternRe.exec(P),k="";for(;f;){k+=P.substring(g,f.index);const N=ee.case_insensitive?f[0].toLowerCase():f[0],W=D(E,N);if(W){const[de,En]=W;if(G.addText(k),k="",x[N]=(x[N]||0)+1,x[N]<=Aa&&(Oe+=En),de.startsWith("_"))k+=f[0];else{const An=ee.classNameAliases[de]||de;Y(f[0],An)}}else k+=f[0];g=E.keywordPatternRe.lastIndex,f=E.keywordPatternRe.exec(P)}k+=P.substring(g),G.addText(k)}function Q(){if(P==="")return;let g=null;if(typeof E.subLanguage=="string"){if(!t[E.subLanguage]){G.addText(P);return}g=p(E.subLanguage,P,!0,Le[E.subLanguage]),Le[E.subLanguage]=g._top}else g=y(P,E.subLanguage.length?E.subLanguage:null);E.relevance>0&&(Oe+=g.relevance),G.__addSublanguage(g._emitter,g.language)}function q(){E.subLanguage!=null?Q():F(),P=""}function Y(g,f){g!==""&&(G.startScope(f),G.addText(g),G.endScope())}function Ee(g,f){let k=1;const N=f.length-1;for(;k<=N;){if(!g._emit[k]){k++;continue}const W=ee.classNameAliases[g[k]]||g[k],de=f[k];W?Y(de,W):(P=de,F(),P=""),k++}}function Me(g,f){return g.scope&&typeof g.scope=="string"&&G.openNode(ee.classNameAliases[g.scope]||g.scope),g.beginScope&&(g.beginScope._wrap?(Y(P,ee.classNameAliases[g.beginScope._wrap]||g.beginScope._wrap),P=""):g.beginScope._multi&&(Ee(g.beginScope,f),P="")),E=Object.create(g,{parent:{value:E}}),E}function xe(g,f,k){let N=Bn(g.endRe,k);if(N){if(g["on:end"]){const W=new ft(g);g["on:end"](f,W),W.isMatchIgnored&&(N=!1)}if(N){for(;g.endsParent&&g.parent;)g=g.parent;return g}}if(g.endsWithParent)return xe(g.parent,f,k)}function qe(g){return E.matcher.regexIndex===0?(P+=g[0],1):(Ye=!0,0)}function je(g){const f=g[0],k=g.rule,N=new ft(k),W=[k.__beforeBegin,k["on:begin"]];for(const de of W)if(de&&(de(g,N),N.isMatchIgnored))return qe(f);return k.skip?P+=f:(k.excludeBegin&&(P+=f),q(),!k.returnBegin&&!k.excludeBegin&&(P=f)),Me(k,g),k.returnBegin?0:f.length}function Ve(g){const f=g[0],k=h.substring(g.index),N=xe(E,g,k);if(!N)return At;const W=E;E.endScope&&E.endScope._wrap?(q(),Y(f,E.endScope._wrap)):E.endScope&&E.endScope._multi?(q(),Ee(E.endScope,g)):W.skip?P+=f:(W.returnEnd||W.excludeEnd||(P+=f),q(),W.excludeEnd&&(P=f));do E.scope&&G.closeNode(),!E.skip&&!E.subLanguage&&(Oe+=E.relevance),E=E.parent;while(E!==N.parent);return N.starts&&Me(N.starts,g),W.returnEnd?0:f.length}function Ke(){const g=[];for(let f=E;f!==ee;f=f.parent)f.scope&&g.unshift(f.scope);g.forEach(f=>G.openNode(f))}let Ae={};function Re(g,f){const k=f&&f[0];if(P+=g,k==null)return q(),0;if(Ae.type==="begin"&&f.type==="end"&&Ae.index===f.index&&k===""){if(P+=h.slice(f.index,f.index+1),!o){const N=new Error(`0 width match regex (${u})`);throw N.languageName=u,N.badRule=Ae.rule,N}return 1}if(Ae=f,f.type==="begin")return je(f);if(f.type==="illegal"&&!m){const N=new Error('Illegal lexeme "'+k+'" for mode "'+(E.scope||"<unnamed>")+'"');throw N.mode=E,N}else if(f.type==="end"){const N=Ve(f);if(N!==At)return N}if(f.type==="illegal"&&k==="")return P+=`
`,1;if(Ze>1e5&&Ze>f.index*3)throw new Error("potential infinite loop, way more iterations than matches");return P+=k,k.length}const ee=H(u);if(!ee)throw we(r.replace("{}",u)),new Error('Unknown language: "'+u+'"');const M=ya(ee);let ge="",E=A||M;const Le={},G=new i.__emitter(i);Ke();let P="",Oe=0,ye=0,Ze=0,Ye=!1;try{if(ee.__emitTokens)ee.__emitTokens(h,G);else{for(E.matcher.considerAll();;){Ze++,Ye?Ye=!1:E.matcher.considerAll(),E.matcher.lastIndex=ye;const g=E.matcher.exec(h);if(!g)break;const f=h.substring(ye,g.index),k=Re(f,g);ye=g.index+k}Re(h.substring(ye))}return G.finalize(),ge=G.toHTML(),{language:u,value:ge,relevance:Oe,illegal:!1,_emitter:G,_top:E}}catch(g){if(g.message&&g.message.includes("Illegal"))return{language:u,value:Xe(h),illegal:!0,relevance:0,_illegalBy:{message:g.message,index:ye,context:h.slice(ye-100,ye+100),mode:g.mode,resultSoFar:ge},_emitter:G};if(o)return{language:u,value:Xe(h),illegal:!1,relevance:0,errorRaised:g,_emitter:G,_top:E};throw g}}function b(u){const h={value:Xe(u),illegal:!1,relevance:0,_top:s,_emitter:new i.__emitter(i)};return h._emitter.addText(u),h}function y(u,h){h=h||i.languages||Object.keys(t);const m=b(u),A=h.filter(H).filter(Z).map(q=>p(q,u,!1));A.unshift(m);const x=A.sort((q,Y)=>{if(q.relevance!==Y.relevance)return Y.relevance-q.relevance;if(q.language&&Y.language){if(H(q.language).supersetOf===Y.language)return 1;if(H(Y.language).supersetOf===q.language)return-1}return 0}),[D,F]=x,Q=D;return Q.secondBest=F,Q}function w(u,h,m){const A=h&&n[h]||m;u.classList.add("hljs"),u.classList.add(`language-${A}`)}function v(u){let h=null;const m=l(u);if(c(m))return;if(ne("before:highlightElement",{el:u,language:m}),u.dataset.highlighted){console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.",u);return}if(u.children.length>0&&(i.ignoreUnescapedHTML||(console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."),console.warn("https://github.com/highlightjs/highlight.js/wiki/security"),console.warn("The element with unescaped HTML:"),console.warn(u)),i.throwUnescapedHTML))throw new Ea("One of your code blocks includes unescaped HTML.",u.innerHTML);h=u;const A=h.textContent,x=m?d(A,{language:m,ignoreIllegals:!0}):y(A);u.innerHTML=x.value,u.dataset.highlighted="yes",w(u,m,x.language),u.result={language:x.language,re:x.relevance,relevance:x.relevance},x.secondBest&&(u.secondBest={language:x.secondBest.language,relevance:x.secondBest.relevance}),ne("after:highlightElement",{el:u,result:x,text:A})}function S(u){i=Et(i,u)}const _=()=>{U(),Se("10.6.0","initHighlighting() deprecated.  Use highlightAll() now.")};function T(){U(),Se("10.6.0","initHighlightingOnLoad() deprecated.  Use highlightAll() now.")}let $=!1;function U(){function u(){U()}if(document.readyState==="loading"){$||window.addEventListener("DOMContentLoaded",u,!1),$=!0;return}document.querySelectorAll(i.cssSelector).forEach(v)}function C(u,h){let m=null;try{m=h(e)}catch(A){if(we("Language definition for '{}' could not be registered.".replace("{}",u)),o)we(A);else throw A;m=s}m.name||(m.name=u),t[u]=m,m.rawDefinition=h.bind(null,e),m.aliases&&O(m.aliases,{languageName:u})}function L(u){delete t[u];for(const h of Object.keys(n))n[h]===u&&delete n[h]}function J(){return Object.keys(t)}function H(u){return u=(u||"").toLowerCase(),t[u]||t[n[u]]}function O(u,{languageName:h}){typeof u=="string"&&(u=[u]),u.forEach(m=>{n[m.toLowerCase()]=h})}function Z(u){const h=H(u);return h&&!h.disableAutodetect}function fe(u){u["before:highlightBlock"]&&!u["before:highlightElement"]&&(u["before:highlightElement"]=h=>{u["before:highlightBlock"](Object.assign({block:h.el},h))}),u["after:highlightBlock"]&&!u["after:highlightElement"]&&(u["after:highlightElement"]=h=>{u["after:highlightBlock"](Object.assign({block:h.el},h))})}function le(u){fe(u),a.push(u)}function pe(u){const h=a.indexOf(u);h!==-1&&a.splice(h,1)}function ne(u,h){const m=u;a.forEach(function(A){A[m]&&A[m](h)})}function be(u){return Se("10.7.0","highlightBlock will be removed entirely in v12.0"),Se("10.7.0","Please use highlightElement now."),v(u)}Object.assign(e,{highlight:d,highlightAuto:y,highlightAll:U,highlightElement:v,highlightBlock:be,configure:S,initHighlighting:_,initHighlightingOnLoad:T,registerLanguage:C,unregisterLanguage:L,listLanguages:J,getLanguage:H,registerAliases:O,autoDetection:Z,inherit:Et,addPlugin:le,removePlugin:pe}),e.debugMode=function(){o=!1},e.safeMode=function(){o=!0},e.versionString=va,e.regex={concat:ve,lookahead:Dt,either:ot,optional:Dn,anyNumberOfTimes:On};for(const u in De)typeof De[u]=="object"&&Lt(De[u]);return Object.assign(e,De),e},ke=qt({});ke.newInstance=()=>qt({});var Sa=ke;ke.HighlightJS=ke;ke.default=ke;const ce=Nn(Sa);function _a(e){const t=e.regex,n={},a={begin:/\$\{/,end:/\}/,contains:["self",{begin:/:-/,contains:[n]}]};Object.assign(n,{className:"variable",variants:[{begin:t.concat(/\$[\w\d#@][\w\d_]*/,"(?![\\w\\d])(?![$])")},a]});const o={className:"subst",begin:/\$\(/,end:/\)/,contains:[e.BACKSLASH_ESCAPE]},r=e.inherit(e.COMMENT(),{match:[/(^|\s)/,/#.*$/],scope:{2:"comment"}}),s={begin:/<<-?\s*(?=\w+)/,starts:{contains:[e.END_SAME_AS_BEGIN({begin:/(\w+)/,end:/(\w+)/,className:"string"})]}},i={className:"string",begin:/"/,end:/"/,contains:[e.BACKSLASH_ESCAPE,n,o]};o.contains.push(i);const c={match:/\\"/},l={className:"string",begin:/'/,end:/'/},d={match:/\\'/},p={begin:/\$?\(\(/,end:/\)\)/,contains:[{begin:/\d+#[0-9a-f]+/,className:"number"},e.NUMBER_MODE,n]},b=["fish","bash","zsh","sh","csh","ksh","tcsh","dash","scsh"],y=e.SHEBANG({binary:`(${b.join("|")})`,relevance:10}),w={className:"function",begin:/\w[\w\d_]*\s*\(\s*\)\s*\{/,returnBegin:!0,contains:[e.inherit(e.TITLE_MODE,{begin:/\w[\w\d_]*/})],relevance:0},v=["if","then","else","elif","fi","time","for","while","until","in","do","done","case","esac","coproc","function","select"],S=["true","false"],_={match:/(\/[a-z._-]+)+/},T=["break","cd","continue","eval","exec","exit","export","getopts","hash","pwd","readonly","return","shift","test","times","trap","umask","unset"],$=["alias","bind","builtin","caller","command","declare","echo","enable","help","let","local","logout","mapfile","printf","read","readarray","source","sudo","type","typeset","ulimit","unalias"],U=["autoload","bg","bindkey","bye","cap","chdir","clone","comparguments","compcall","compctl","compdescribe","compfiles","compgroups","compquote","comptags","comptry","compvalues","dirs","disable","disown","echotc","echoti","emulate","fc","fg","float","functions","getcap","getln","history","integer","jobs","kill","limit","log","noglob","popd","print","pushd","pushln","rehash","sched","setcap","setopt","stat","suspend","ttyctl","unfunction","unhash","unlimit","unsetopt","vared","wait","whence","where","which","zcompile","zformat","zftp","zle","zmodload","zparseopts","zprof","zpty","zregexparse","zsocket","zstyle","ztcp"],C=["chcon","chgrp","chown","chmod","cp","dd","df","dir","dircolors","ln","ls","mkdir","mkfifo","mknod","mktemp","mv","realpath","rm","rmdir","shred","sync","touch","truncate","vdir","b2sum","base32","base64","cat","cksum","comm","csplit","cut","expand","fmt","fold","head","join","md5sum","nl","numfmt","od","paste","ptx","pr","sha1sum","sha224sum","sha256sum","sha384sum","sha512sum","shuf","sort","split","sum","tac","tail","tr","tsort","unexpand","uniq","wc","arch","basename","chroot","date","dirname","du","echo","env","expr","factor","groups","hostid","id","link","logname","nice","nohup","nproc","pathchk","pinky","printenv","printf","pwd","readlink","runcon","seq","sleep","stat","stdbuf","stty","tee","test","timeout","tty","uname","unlink","uptime","users","who","whoami","yes"];return{name:"Bash",aliases:["sh","zsh"],keywords:{$pattern:/\b[a-z][a-z0-9._-]+\b/,keyword:v,literal:S,built_in:[...T,...$,"set","shopt",...U,...C]},contains:[y,e.SHEBANG(),w,p,r,s,_,i,c,l,d,n]}}const St="[A-Za-z$_][0-9A-Za-z$_]*",Ta=["as","in","of","if","for","while","finally","var","new","function","do","return","void","else","break","catch","instanceof","with","throw","case","default","try","switch","continue","typeof","delete","let","yield","const","class","debugger","async","await","static","import","from","export","extends","using"],ka=["true","false","null","undefined","NaN","Infinity"],jt=["Object","Function","Boolean","Symbol","Math","Date","Number","BigInt","String","RegExp","Array","Float32Array","Float64Array","Int8Array","Uint8Array","Uint8ClampedArray","Int16Array","Int32Array","Uint16Array","Uint32Array","BigInt64Array","BigUint64Array","Set","Map","WeakSet","WeakMap","ArrayBuffer","SharedArrayBuffer","Atomics","DataView","JSON","Promise","Generator","GeneratorFunction","AsyncFunction","Reflect","Proxy","Intl","WebAssembly"],Vt=["Error","EvalError","InternalError","RangeError","ReferenceError","SyntaxError","TypeError","URIError"],Kt=["setInterval","setTimeout","clearInterval","clearTimeout","require","exports","eval","isFinite","isNaN","parseFloat","parseInt","decodeURI","decodeURIComponent","encodeURI","encodeURIComponent","escape","unescape"],xa=["arguments","this","super","console","window","document","localStorage","sessionStorage","module","global"],$a=[].concat(Kt,jt,Vt);function Ia(e){const t=e.regex,n=(m,{after:A})=>{const x="</"+m[0].slice(1);return m.input.indexOf(x,A)!==-1},a=St,o={begin:"<>",end:"</>"},r=/<[A-Za-z0-9\\._:-]+\s*\/>/,s={begin:/<[A-Za-z0-9\\._:-]+/,end:/\/[A-Za-z0-9\\._:-]+>|\/>/,isTrulyOpeningTag:(m,A)=>{const x=m[0].length+m.index,D=m.input[x];if(D==="<"||D===","){A.ignoreMatch();return}D===">"&&(n(m,{after:x})||A.ignoreMatch());let F;const Q=m.input.substring(x);if(F=Q.match(/^\s*=/)){A.ignoreMatch();return}if((F=Q.match(/^\s+extends\s+/))&&F.index===0){A.ignoreMatch();return}}},i={$pattern:St,keyword:Ta,literal:ka,built_in:$a,"variable.language":xa},c="[0-9](_?[0-9])*",l=`\\.(${c})`,d="0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*",p={className:"number",variants:[{begin:`(\\b(${d})((${l})|\\.)?|(${l}))[eE][+-]?(${c})\\b`},{begin:`\\b(${d})\\b((${l})\\b|\\.)?|(${l})\\b`},{begin:"\\b(0|[1-9](_?[0-9])*)n\\b"},{begin:"\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b"},{begin:"\\b0[bB][0-1](_?[0-1])*n?\\b"},{begin:"\\b0[oO][0-7](_?[0-7])*n?\\b"},{begin:"\\b0[0-7]+n?\\b"}],relevance:0},b={className:"subst",begin:"\\$\\{",end:"\\}",keywords:i,contains:[]},y={begin:".?html`",end:"",starts:{end:"`",returnEnd:!1,contains:[e.BACKSLASH_ESCAPE,b],subLanguage:"xml"}},w={begin:".?css`",end:"",starts:{end:"`",returnEnd:!1,contains:[e.BACKSLASH_ESCAPE,b],subLanguage:"css"}},v={begin:".?gql`",end:"",starts:{end:"`",returnEnd:!1,contains:[e.BACKSLASH_ESCAPE,b],subLanguage:"graphql"}},S={className:"string",begin:"`",end:"`",contains:[e.BACKSLASH_ESCAPE,b]},T={className:"comment",variants:[e.COMMENT(/\/\*\*(?!\/)/,"\\*/",{relevance:0,contains:[{begin:"(?=@[A-Za-z]+)",relevance:0,contains:[{className:"doctag",begin:"@[A-Za-z]+"},{className:"type",begin:"\\{",end:"\\}",excludeEnd:!0,excludeBegin:!0,relevance:0},{className:"variable",begin:a+"(?=\\s*(-)|$)",endsParent:!0,relevance:0},{begin:/(?=[^\n])\s/,relevance:0}]}]}),e.C_BLOCK_COMMENT_MODE,e.C_LINE_COMMENT_MODE]},$=[e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,y,w,v,S,{match:/\$\d+/},p];b.contains=$.concat({begin:/\{/,end:/\}/,keywords:i,contains:["self"].concat($)});const U=[].concat(T,b.contains),C=U.concat([{begin:/(\s*)\(/,end:/\)/,keywords:i,contains:["self"].concat(U)}]),L={className:"params",begin:/(\s*)\(/,end:/\)/,excludeBegin:!0,excludeEnd:!0,keywords:i,contains:C},J={variants:[{match:[/class/,/\s+/,a,/\s+/,/extends/,/\s+/,t.concat(a,"(",t.concat(/\./,a),")*")],scope:{1:"keyword",3:"title.class",5:"keyword",7:"title.class.inherited"}},{match:[/class/,/\s+/,a],scope:{1:"keyword",3:"title.class"}}]},H={relevance:0,match:t.either(/\bJSON/,/\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/,/\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/,/\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/),className:"title.class",keywords:{_:[...jt,...Vt]}},O={label:"use_strict",className:"meta",relevance:10,begin:/^\s*['"]use (strict|asm)['"]/},Z={variants:[{match:[/function/,/\s+/,a,/(?=\s*\()/]},{match:[/function/,/\s*(?=\()/]}],className:{1:"keyword",3:"title.function"},label:"func.def",contains:[L],illegal:/%/},fe={relevance:0,match:/\b[A-Z][A-Z_0-9]+\b/,className:"variable.constant"};function le(m){return t.concat("(?!",m.join("|"),")")}const pe={match:t.concat(/\b/,le([...Kt,"super","import"].map(m=>`${m}\\s*\\(`)),a,t.lookahead(/\s*\(/)),className:"title.function",relevance:0},ne={begin:t.concat(/\./,t.lookahead(t.concat(a,/(?![0-9A-Za-z$_(])/))),end:a,excludeBegin:!0,keywords:"prototype",className:"property",relevance:0},be={match:[/get|set/,/\s+/,a,/(?=\()/],className:{1:"keyword",3:"title.function"},contains:[{begin:/\(\)/},L]},u="(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|"+e.UNDERSCORE_IDENT_RE+")\\s*=>",h={match:[/const|var|let/,/\s+/,a,/\s*/,/=\s*/,/(async\s*)?/,t.lookahead(u)],keywords:"async",className:{1:"keyword",3:"title.function"},contains:[L]};return{name:"JavaScript",aliases:["js","jsx","mjs","cjs"],keywords:i,exports:{PARAMS_CONTAINS:C,CLASS_REFERENCE:H},illegal:/#(?![$_A-z])/,contains:[e.SHEBANG({label:"shebang",binary:"node",relevance:5}),O,e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,y,w,v,S,T,{match:/\$\d+/},p,H,{scope:"attr",match:a+t.lookahead(":"),relevance:0},h,{begin:"("+e.RE_STARTERS_RE+"|\\b(case|return|throw)\\b)\\s*",keywords:"return throw case",relevance:0,contains:[T,e.REGEXP_MODE,{className:"function",begin:u,returnBegin:!0,end:"\\s*=>",contains:[{className:"params",variants:[{begin:e.UNDERSCORE_IDENT_RE,relevance:0},{className:null,begin:/\(\s*\)/,skip:!0},{begin:/(\s*)\(/,end:/\)/,excludeBegin:!0,excludeEnd:!0,keywords:i,contains:C}]}]},{begin:/,/,relevance:0},{match:/\s+/,relevance:0},{variants:[{begin:o.begin,end:o.end},{match:r},{begin:s.begin,"on:begin":s.isTrulyOpeningTag,end:s.end}],subLanguage:"xml",contains:[{begin:s.begin,end:s.end,skip:!0,contains:["self"]}]}]},Z,{beginKeywords:"while if switch catch for"},{begin:"\\b(?!function)"+e.UNDERSCORE_IDENT_RE+"\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{",returnBegin:!0,label:"func.def",contains:[L,e.inherit(e.TITLE_MODE,{begin:a,className:"title.function"})]},{match:/\.\.\./,relevance:0},ne,{match:"\\$"+a,relevance:0},{match:[/\bconstructor(?=\s*\()/],className:{1:"title.function"},contains:[L]},pe,fe,J,be,{match:/\$[(.]/}]}}function Na(e){const t={className:"attr",begin:/"(\\.|[^\\"\r\n])*"(?=\s*:)/,relevance:1.01},n={match:/[{}[\],:]/,className:"punctuation",relevance:0},a=["true","false","null"],o={scope:"literal",beginKeywords:a.join(" ")};return{name:"JSON",aliases:["jsonc"],keywords:{literal:a},contains:[t,n,e.QUOTE_STRING_MODE,o,e.C_NUMBER_MODE,e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE],illegal:"\\S"}}function Ca(e){const t=e.regex,n={begin:/<\/?[A-Za-z_]/,end:">",subLanguage:"xml",relevance:0},a={begin:"^[-\\*]{3,}",end:"$"},o={className:"code",variants:[{begin:"(`{3,})[^`](.|\\n)*?\\1`*[ ]*"},{begin:"(~{3,})[^~](.|\\n)*?\\1~*[ ]*"},{begin:"```",end:"```+[ ]*$"},{begin:"~~~",end:"~~~+[ ]*$"},{begin:"`.+?`"},{begin:"(?=^( {4}|\\t))",contains:[{begin:"^( {4}|\\t)",end:"(\\n)$"}],relevance:0}]},r={className:"bullet",begin:"^[ 	]*([*+-]|(\\d+\\.))(?=\\s+)",end:"\\s+",excludeEnd:!0},s={begin:/^\[[^\n]+\]:/,returnBegin:!0,contains:[{className:"symbol",begin:/\[/,end:/\]/,excludeBegin:!0,excludeEnd:!0},{className:"link",begin:/:\s*/,end:/$/,excludeBegin:!0}]},i=/[A-Za-z][A-Za-z0-9+.-]*/,c={variants:[{begin:/\[.+?\]\[.*?\]/,relevance:0},{begin:/\[.+?\]\(((data|javascript|mailto):|(?:http|ftp)s?:\/\/).*?\)/,relevance:2},{begin:t.concat(/\[.+?\]\(/,i,/:\/\/.*?\)/),relevance:2},{begin:/\[.+?\]\([./?&#].*?\)/,relevance:1},{begin:/\[.*?\]\(.*?\)/,relevance:0}],returnBegin:!0,contains:[{match:/\[(?=\])/},{className:"string",relevance:0,begin:"\\[",end:"\\]",excludeBegin:!0,returnEnd:!0},{className:"link",relevance:0,begin:"\\]\\(",end:"\\)",excludeBegin:!0,excludeEnd:!0},{className:"symbol",relevance:0,begin:"\\]\\[",end:"\\]",excludeBegin:!0,excludeEnd:!0}]},l={className:"strong",contains:[],variants:[{begin:/_{2}(?!\s)/,end:/_{2}/},{begin:/\*{2}(?!\s)/,end:/\*{2}/}]},d={className:"emphasis",contains:[],variants:[{begin:/\*(?![*\s])/,end:/\*/},{begin:/_(?![_\s])/,end:/_/,relevance:0}]},p=e.inherit(l,{contains:[]}),b=e.inherit(d,{contains:[]});l.contains.push(b),d.contains.push(p);let y=[n,c];return[l,d,p,b].forEach(_=>{_.contains=_.contains.concat(y)}),y=y.concat(l,d),{name:"Markdown",aliases:["md","mkdown","mkd"],contains:[{className:"section",variants:[{begin:"^#{1,6}",end:"$",contains:y},{begin:"(?=^.+?\\n[=-]{2,}$)",contains:[{begin:"^[=-]*$"},{begin:"^",end:"\\n",contains:y}]}]},n,r,l,d,{className:"quote",begin:"^>\\s+",contains:y,end:"$"},o,a,c,s,{scope:"literal",match:/&([a-zA-Z0-9]+|#[0-9]{1,7}|#[Xx][0-9a-fA-F]{1,6});/}]}}function Zt(e){return e?typeof e=="string"?e:e.source:null}function $e(e){return R("(?=",e,")")}function R(...e){return e.map(n=>Zt(n)).join("")}function Ma(e){const t=e[e.length-1];return typeof t=="object"&&t.constructor===Object?(e.splice(e.length-1,1),t):{}}function V(...e){return"("+(Ma(e).capture?"":"?:")+e.map(a=>Zt(a)).join("|")+")"}const lt=e=>R(/\b/,e,/\w$/.test(e)?/\b/:/\B/),Ra=["Protocol","Type"].map(lt),_t=["init","self"].map(lt),La=["Any","Self"],Je=["actor","any","associatedtype","async","await",/as\?/,/as!/,"as","borrowing","break","case","catch","class","consume","consuming","continue","convenience","copy","default","defer","deinit","didSet","distributed","do","dynamic","each","else","enum","extension","fallthrough",/fileprivate\(set\)/,"fileprivate","final","for","func","get","guard","if","import","indirect","infix",/init\?/,/init!/,"inout",/internal\(set\)/,"internal","in","is","isolated","nonisolated","lazy","let","macro","mutating","nonmutating",/open\(set\)/,"open","operator","optional","override","package","postfix","precedencegroup","prefix",/private\(set\)/,"private","protocol",/public\(set\)/,"public","repeat","required","rethrows","return","set","some","static","struct","subscript","super","switch","throws","throw",/try\?/,/try!/,"try","typealias",/unowned\(safe\)/,/unowned\(unsafe\)/,"unowned","var","weak","where","while","willSet"],Tt=["false","nil","true"],Oa=["assignment","associativity","higherThan","left","lowerThan","none","right"],Da=["#colorLiteral","#column","#dsohandle","#else","#elseif","#endif","#error","#file","#fileID","#fileLiteral","#filePath","#function","#if","#imageLiteral","#keyPath","#line","#selector","#sourceLocation","#warning"],kt=["abs","all","any","assert","assertionFailure","debugPrint","dump","fatalError","getVaList","isKnownUniquelyReferenced","max","min","numericCast","pointwiseMax","pointwiseMin","precondition","preconditionFailure","print","readLine","repeatElement","sequence","stride","swap","swift_unboxFromSwiftValueWithType","transcode","type","unsafeBitCast","unsafeDowncast","withExtendedLifetime","withUnsafeMutablePointer","withUnsafePointer","withVaList","withoutActuallyEscaping","zip"],Yt=V(/[/=\-+!*%<>&|^~?]/,/[\u00A1-\u00A7]/,/[\u00A9\u00AB]/,/[\u00AC\u00AE]/,/[\u00B0\u00B1]/,/[\u00B6\u00BB\u00BF\u00D7\u00F7]/,/[\u2016-\u2017]/,/[\u2020-\u2027]/,/[\u2030-\u203E]/,/[\u2041-\u2053]/,/[\u2055-\u205E]/,/[\u2190-\u23FF]/,/[\u2500-\u2775]/,/[\u2794-\u2BFF]/,/[\u2E00-\u2E7F]/,/[\u3001-\u3003]/,/[\u3008-\u3020]/,/[\u3030]/),Xt=V(Yt,/[\u0300-\u036F]/,/[\u1DC0-\u1DFF]/,/[\u20D0-\u20FF]/,/[\uFE00-\uFE0F]/,/[\uFE20-\uFE2F]/),Qe=R(Yt,Xt,"*"),Jt=V(/[a-zA-Z_]/,/[\u00A8\u00AA\u00AD\u00AF\u00B2-\u00B5\u00B7-\u00BA]/,/[\u00BC-\u00BE\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF]/,/[\u0100-\u02FF\u0370-\u167F\u1681-\u180D\u180F-\u1DBF]/,/[\u1E00-\u1FFF]/,/[\u200B-\u200D\u202A-\u202E\u203F-\u2040\u2054\u2060-\u206F]/,/[\u2070-\u20CF\u2100-\u218F\u2460-\u24FF\u2776-\u2793]/,/[\u2C00-\u2DFF\u2E80-\u2FFF]/,/[\u3004-\u3007\u3021-\u302F\u3031-\u303F\u3040-\uD7FF]/,/[\uF900-\uFD3D\uFD40-\uFDCF\uFDF0-\uFE1F\uFE30-\uFE44]/,/[\uFE47-\uFEFE\uFF00-\uFFFD]/),He=V(Jt,/\d/,/[\u0300-\u036F\u1DC0-\u1DFF\u20D0-\u20FF\uFE20-\uFE2F]/),oe=R(Jt,He,"*"),Pe=R(/[A-Z]/,He,"*"),Pa=["attached","autoclosure",R(/convention\(/,V("swift","block","c"),/\)/),"discardableResult","dynamicCallable","dynamicMemberLookup","escaping","freestanding","frozen","GKInspectable","IBAction","IBDesignable","IBInspectable","IBOutlet","IBSegueAction","inlinable","main","nonobjc","NSApplicationMain","NSCopying","NSManaged",R(/objc\(/,oe,/\)/),"objc","objcMembers","propertyWrapper","requires_stored_property_inits","resultBuilder","Sendable","testable","UIApplicationMain","unchecked","unknown","usableFromInline","warn_unqualified_access"],Ba=["iOS","iOSApplicationExtension","macOS","macOSApplicationExtension","macCatalyst","macCatalystApplicationExtension","watchOS","watchOSApplicationExtension","tvOS","tvOSApplicationExtension","swift"];function Ua(e){const t={match:/\s+/,relevance:0},n=e.COMMENT("/\\*","\\*/",{contains:["self"]}),a=[e.C_LINE_COMMENT_MODE,n],o={match:[/\./,V(...Ra,..._t)],className:{2:"keyword"}},r={match:R(/\./,V(...Je)),relevance:0},s=Je.filter(M=>typeof M=="string").concat(["_|0"]),i=Je.filter(M=>typeof M!="string").concat(La).map(lt),c={variants:[{className:"keyword",match:V(...i,..._t)}]},l={$pattern:V(/\b\w+/,/#\w+/),keyword:s.concat(Da),literal:Tt},d=[o,r,c],p={match:R(/\./,V(...kt)),relevance:0},b={className:"built_in",match:R(/\b/,V(...kt),/(?=\()/)},y=[p,b],w={match:/->/,relevance:0},v={className:"operator",relevance:0,variants:[{match:Qe},{match:`\\.(\\.|${Xt})+`}]},S=[w,v],_="([0-9]_*)+",T="([0-9a-fA-F]_*)+",$={className:"number",relevance:0,variants:[{match:`\\b(${_})(\\.(${_}))?([eE][+-]?(${_}))?\\b`},{match:`\\b0x(${T})(\\.(${T}))?([pP][+-]?(${_}))?\\b`},{match:/\b0o([0-7]_*)+\b/},{match:/\b0b([01]_*)+\b/}]},U=(M="")=>({className:"subst",variants:[{match:R(/\\/,M,/[0\\tnr"']/)},{match:R(/\\/,M,/u\{[0-9a-fA-F]{1,8}\}/)}]}),C=(M="")=>({className:"subst",match:R(/\\/,M,/[\t ]*(?:[\r\n]|\r\n)/)}),L=(M="")=>({className:"subst",label:"interpol",begin:R(/\\/,M,/\(/),end:/\)/}),J=(M="")=>({begin:R(M,/"""/),end:R(/"""/,M),contains:[U(M),C(M),L(M)]}),H=(M="")=>({begin:R(M,/"/),end:R(/"/,M),contains:[U(M),L(M)]}),O={className:"string",variants:[J(),J("#"),J("##"),J("###"),H(),H("#"),H("##"),H("###")]},Z=[e.BACKSLASH_ESCAPE,{begin:/\[/,end:/\]/,relevance:0,contains:[e.BACKSLASH_ESCAPE]}],fe={begin:/\/[^\s](?=[^/\n]*\/)/,end:/\//,contains:Z},le=M=>{const ge=R(M,/\//),E=R(/\//,M);return{begin:ge,end:E,contains:[...Z,{scope:"comment",begin:`#(?!.*${E})`,end:/$/}]}},pe={scope:"regexp",variants:[le("###"),le("##"),le("#"),fe]},ne={match:R(/`/,oe,/`/)},be={className:"variable",match:/\$\d+/},u={className:"variable",match:`\\$${He}+`},h=[ne,be,u],m={match:/(@|#(un)?)available/,scope:"keyword",starts:{contains:[{begin:/\(/,end:/\)/,keywords:Ba,contains:[...S,$,O]}]}},A={scope:"keyword",match:R(/@/,V(...Pa),$e(V(/\(/,/\s+/)))},x={scope:"meta",match:R(/@/,oe)},D=[m,A,x],F={match:$e(/\b[A-Z]/),relevance:0,contains:[{className:"type",match:R(/(AV|CA|CF|CG|CI|CL|CM|CN|CT|MK|MP|MTK|MTL|NS|SCN|SK|UI|WK|XC)/,He,"+")},{className:"type",match:Pe,relevance:0},{match:/[?!]+/,relevance:0},{match:/\.\.\./,relevance:0},{match:R(/\s+&\s+/,$e(Pe)),relevance:0}]},Q={begin:/</,end:/>/,keywords:l,contains:[...a,...d,...D,w,F]};F.contains.push(Q);const q={match:R(oe,/\s*:/),keywords:"_|0",relevance:0},Y={begin:/\(/,end:/\)/,relevance:0,keywords:l,contains:["self",q,...a,pe,...d,...y,...S,$,O,...h,...D,F]},Ee={begin:/</,end:/>/,keywords:"repeat each",contains:[...a,F]},Me={begin:V($e(R(oe,/\s*:/)),$e(R(oe,/\s+/,oe,/\s*:/))),end:/:/,relevance:0,contains:[{className:"keyword",match:/\b_\b/},{className:"params",match:oe}]},xe={begin:/\(/,end:/\)/,keywords:l,contains:[Me,...a,...d,...S,$,O,...D,F,Y],endsParent:!0,illegal:/["']/},qe={match:[/(func|macro)/,/\s+/,V(ne.match,oe,Qe)],className:{1:"keyword",3:"title.function"},contains:[Ee,xe,t],illegal:[/\[/,/%/]},je={match:[/\b(?:subscript|init[?!]?)/,/\s*(?=[<(])/],className:{1:"keyword"},contains:[Ee,xe,t],illegal:/\[|%/},Ve={match:[/operator/,/\s+/,Qe],className:{1:"keyword",3:"title"}},Ke={begin:[/precedencegroup/,/\s+/,Pe],className:{1:"keyword",3:"title"},contains:[F],keywords:[...Oa,...Tt],end:/}/},Ae={match:[/class\b/,/\s+/,/func\b/,/\s+/,/\b[A-Za-z_][A-Za-z0-9_]*\b/],scope:{1:"keyword",3:"keyword",5:"title.function"}},Re={match:[/class\b/,/\s+/,/var\b/],scope:{1:"keyword",3:"keyword"}},ee={begin:[/(struct|protocol|class|extension|enum|actor)/,/\s+/,oe,/\s*/],beginScope:{1:"keyword",3:"title.class"},keywords:l,contains:[Ee,...d,{begin:/:/,end:/\{/,keywords:l,contains:[{scope:"title.class.inherited",match:Pe},...d],relevance:0}]};for(const M of O.variants){const ge=M.contains.find(Le=>Le.label==="interpol");ge.keywords=l;const E=[...d,...y,...S,$,O,...h];ge.contains=[...E,{begin:/\(/,end:/\)/,contains:["self",...E]}]}return{name:"Swift",keywords:l,contains:[...a,qe,je,Ae,Re,ee,Ve,Ke,{beginKeywords:"import",end:/$/,contains:[...a],relevance:0},pe,...d,...y,...S,$,O,...h,...D,F,Y]}}const Ge="[A-Za-z$_][0-9A-Za-z$_]*",Qt=["as","in","of","if","for","while","finally","var","new","function","do","return","void","else","break","catch","instanceof","with","throw","case","default","try","switch","continue","typeof","delete","let","yield","const","class","debugger","async","await","static","import","from","export","extends","using"],en=["true","false","null","undefined","NaN","Infinity"],tn=["Object","Function","Boolean","Symbol","Math","Date","Number","BigInt","String","RegExp","Array","Float32Array","Float64Array","Int8Array","Uint8Array","Uint8ClampedArray","Int16Array","Int32Array","Uint16Array","Uint32Array","BigInt64Array","BigUint64Array","Set","Map","WeakSet","WeakMap","ArrayBuffer","SharedArrayBuffer","Atomics","DataView","JSON","Promise","Generator","GeneratorFunction","AsyncFunction","Reflect","Proxy","Intl","WebAssembly"],nn=["Error","EvalError","InternalError","RangeError","ReferenceError","SyntaxError","TypeError","URIError"],an=["setInterval","setTimeout","clearInterval","clearTimeout","require","exports","eval","isFinite","isNaN","parseFloat","parseInt","decodeURI","decodeURIComponent","encodeURI","encodeURIComponent","escape","unescape"],sn=["arguments","this","super","console","window","document","localStorage","sessionStorage","module","global"],on=[].concat(an,tn,nn);function Fa(e){const t=e.regex,n=(m,{after:A})=>{const x="</"+m[0].slice(1);return m.input.indexOf(x,A)!==-1},a=Ge,o={begin:"<>",end:"</>"},r=/<[A-Za-z0-9\\._:-]+\s*\/>/,s={begin:/<[A-Za-z0-9\\._:-]+/,end:/\/[A-Za-z0-9\\._:-]+>|\/>/,isTrulyOpeningTag:(m,A)=>{const x=m[0].length+m.index,D=m.input[x];if(D==="<"||D===","){A.ignoreMatch();return}D===">"&&(n(m,{after:x})||A.ignoreMatch());let F;const Q=m.input.substring(x);if(F=Q.match(/^\s*=/)){A.ignoreMatch();return}if((F=Q.match(/^\s+extends\s+/))&&F.index===0){A.ignoreMatch();return}}},i={$pattern:Ge,keyword:Qt,literal:en,built_in:on,"variable.language":sn},c="[0-9](_?[0-9])*",l=`\\.(${c})`,d="0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*",p={className:"number",variants:[{begin:`(\\b(${d})((${l})|\\.)?|(${l}))[eE][+-]?(${c})\\b`},{begin:`\\b(${d})\\b((${l})\\b|\\.)?|(${l})\\b`},{begin:"\\b(0|[1-9](_?[0-9])*)n\\b"},{begin:"\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b"},{begin:"\\b0[bB][0-1](_?[0-1])*n?\\b"},{begin:"\\b0[oO][0-7](_?[0-7])*n?\\b"},{begin:"\\b0[0-7]+n?\\b"}],relevance:0},b={className:"subst",begin:"\\$\\{",end:"\\}",keywords:i,contains:[]},y={begin:".?html`",end:"",starts:{end:"`",returnEnd:!1,contains:[e.BACKSLASH_ESCAPE,b],subLanguage:"xml"}},w={begin:".?css`",end:"",starts:{end:"`",returnEnd:!1,contains:[e.BACKSLASH_ESCAPE,b],subLanguage:"css"}},v={begin:".?gql`",end:"",starts:{end:"`",returnEnd:!1,contains:[e.BACKSLASH_ESCAPE,b],subLanguage:"graphql"}},S={className:"string",begin:"`",end:"`",contains:[e.BACKSLASH_ESCAPE,b]},T={className:"comment",variants:[e.COMMENT(/\/\*\*(?!\/)/,"\\*/",{relevance:0,contains:[{begin:"(?=@[A-Za-z]+)",relevance:0,contains:[{className:"doctag",begin:"@[A-Za-z]+"},{className:"type",begin:"\\{",end:"\\}",excludeEnd:!0,excludeBegin:!0,relevance:0},{className:"variable",begin:a+"(?=\\s*(-)|$)",endsParent:!0,relevance:0},{begin:/(?=[^\n])\s/,relevance:0}]}]}),e.C_BLOCK_COMMENT_MODE,e.C_LINE_COMMENT_MODE]},$=[e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,y,w,v,S,{match:/\$\d+/},p];b.contains=$.concat({begin:/\{/,end:/\}/,keywords:i,contains:["self"].concat($)});const U=[].concat(T,b.contains),C=U.concat([{begin:/(\s*)\(/,end:/\)/,keywords:i,contains:["self"].concat(U)}]),L={className:"params",begin:/(\s*)\(/,end:/\)/,excludeBegin:!0,excludeEnd:!0,keywords:i,contains:C},J={variants:[{match:[/class/,/\s+/,a,/\s+/,/extends/,/\s+/,t.concat(a,"(",t.concat(/\./,a),")*")],scope:{1:"keyword",3:"title.class",5:"keyword",7:"title.class.inherited"}},{match:[/class/,/\s+/,a],scope:{1:"keyword",3:"title.class"}}]},H={relevance:0,match:t.either(/\bJSON/,/\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/,/\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/,/\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/),className:"title.class",keywords:{_:[...tn,...nn]}},O={label:"use_strict",className:"meta",relevance:10,begin:/^\s*['"]use (strict|asm)['"]/},Z={variants:[{match:[/function/,/\s+/,a,/(?=\s*\()/]},{match:[/function/,/\s*(?=\()/]}],className:{1:"keyword",3:"title.function"},label:"func.def",contains:[L],illegal:/%/},fe={relevance:0,match:/\b[A-Z][A-Z_0-9]+\b/,className:"variable.constant"};function le(m){return t.concat("(?!",m.join("|"),")")}const pe={match:t.concat(/\b/,le([...an,"super","import"].map(m=>`${m}\\s*\\(`)),a,t.lookahead(/\s*\(/)),className:"title.function",relevance:0},ne={begin:t.concat(/\./,t.lookahead(t.concat(a,/(?![0-9A-Za-z$_(])/))),end:a,excludeBegin:!0,keywords:"prototype",className:"property",relevance:0},be={match:[/get|set/,/\s+/,a,/(?=\()/],className:{1:"keyword",3:"title.function"},contains:[{begin:/\(\)/},L]},u="(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|"+e.UNDERSCORE_IDENT_RE+")\\s*=>",h={match:[/const|var|let/,/\s+/,a,/\s*/,/=\s*/,/(async\s*)?/,t.lookahead(u)],keywords:"async",className:{1:"keyword",3:"title.function"},contains:[L]};return{name:"JavaScript",aliases:["js","jsx","mjs","cjs"],keywords:i,exports:{PARAMS_CONTAINS:C,CLASS_REFERENCE:H},illegal:/#(?![$_A-z])/,contains:[e.SHEBANG({label:"shebang",binary:"node",relevance:5}),O,e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,y,w,v,S,T,{match:/\$\d+/},p,H,{scope:"attr",match:a+t.lookahead(":"),relevance:0},h,{begin:"("+e.RE_STARTERS_RE+"|\\b(case|return|throw)\\b)\\s*",keywords:"return throw case",relevance:0,contains:[T,e.REGEXP_MODE,{className:"function",begin:u,returnBegin:!0,end:"\\s*=>",contains:[{className:"params",variants:[{begin:e.UNDERSCORE_IDENT_RE,relevance:0},{className:null,begin:/\(\s*\)/,skip:!0},{begin:/(\s*)\(/,end:/\)/,excludeBegin:!0,excludeEnd:!0,keywords:i,contains:C}]}]},{begin:/,/,relevance:0},{match:/\s+/,relevance:0},{variants:[{begin:o.begin,end:o.end},{match:r},{begin:s.begin,"on:begin":s.isTrulyOpeningTag,end:s.end}],subLanguage:"xml",contains:[{begin:s.begin,end:s.end,skip:!0,contains:["self"]}]}]},Z,{beginKeywords:"while if switch catch for"},{begin:"\\b(?!function)"+e.UNDERSCORE_IDENT_RE+"\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{",returnBegin:!0,label:"func.def",contains:[L,e.inherit(e.TITLE_MODE,{begin:a,className:"title.function"})]},{match:/\.\.\./,relevance:0},ne,{match:"\\$"+a,relevance:0},{match:[/\bconstructor(?=\s*\()/],className:{1:"title.function"},contains:[L]},pe,fe,J,be,{match:/\$[(.]/}]}}function Ha(e){const t=e.regex,n=Fa(e),a=Ge,o=["any","void","number","boolean","string","object","never","symbol","bigint","unknown"],r={begin:[/namespace/,/\s+/,e.IDENT_RE],beginScope:{1:"keyword",3:"title.class"}},s={beginKeywords:"interface",end:/\{/,excludeEnd:!0,keywords:{keyword:"interface extends",built_in:o},contains:[n.exports.CLASS_REFERENCE]},i={className:"meta",relevance:10,begin:/^\s*['"]use strict['"]/},c=["type","interface","public","private","protected","implements","declare","abstract","readonly","enum","override","satisfies"],l={$pattern:Ge,keyword:Qt.concat(c),literal:en,built_in:on.concat(o),"variable.language":sn},d={className:"meta",begin:"@"+a},p=(v,S,_)=>{const T=v.contains.findIndex($=>$.label===S);if(T===-1)throw new Error("can not find mode to replace");v.contains.splice(T,1,_)};Object.assign(n.keywords,l),n.exports.PARAMS_CONTAINS.push(d);const b=n.contains.find(v=>v.scope==="attr"),y=Object.assign({},b,{match:t.concat(a,t.lookahead(/\s*\?:/))});n.exports.PARAMS_CONTAINS.push([n.exports.CLASS_REFERENCE,b,y]),n.contains=n.contains.concat([d,r,s,y]),p(n,"shebang",e.SHEBANG()),p(n,"use_strict",i);const w=n.contains.find(v=>v.label==="func.def");return w.relevance=0,Object.assign(n,{name:"TypeScript",aliases:["ts","tsx","mts","cts"]}),n}function Ga(e){const t=e.regex,n=t.concat(/[\p{L}_]/u,t.optional(/[\p{L}0-9_.-]*:/u),/[\p{L}0-9_.-]*/u),a=/[\p{L}0-9._:-]+/u,o={className:"symbol",begin:/&[a-z]+;|&#[0-9]+;|&#x[a-f0-9]+;/},r={begin:/\s/,contains:[{className:"keyword",begin:/#?[a-z_][a-z1-9_-]+/,illegal:/\n/}]},s=e.inherit(r,{begin:/\(/,end:/\)/}),i=e.inherit(e.APOS_STRING_MODE,{className:"string"}),c=e.inherit(e.QUOTE_STRING_MODE,{className:"string"}),l={endsWithParent:!0,illegal:/</,relevance:0,contains:[{className:"attr",begin:a,relevance:0},{begin:/=\s*/,relevance:0,contains:[{className:"string",endsParent:!0,variants:[{begin:/"/,end:/"/,contains:[o]},{begin:/'/,end:/'/,contains:[o]},{begin:/[^\s"'=<>`]+/}]}]}]};return{name:"HTML, XML",aliases:["html","xhtml","rss","atom","xjb","xsd","xsl","plist","wsf","svg"],case_insensitive:!0,unicodeRegex:!0,contains:[{className:"meta",begin:/<![a-z]/,end:/>/,relevance:10,contains:[r,c,i,s,{begin:/\[/,end:/\]/,contains:[{className:"meta",begin:/<![a-z]/,end:/>/,contains:[r,s,c,i]}]}]},e.COMMENT(/<!--/,/-->/,{relevance:10}),{begin:/<!\[CDATA\[/,end:/\]\]>/,relevance:10},o,{className:"meta",end:/\?>/,variants:[{begin:/<\?xml/,relevance:10,contains:[c]},{begin:/<\?[a-z][a-z0-9]+/}]},{className:"tag",begin:/<style(?=\s|>)/,end:/>/,keywords:{name:"style"},contains:[l],starts:{end:/<\/style>/,returnEnd:!0,subLanguage:["css","xml"]}},{className:"tag",begin:/<script(?=\s|>)/,end:/>/,keywords:{name:"script"},contains:[l],starts:{end:/<\/script>/,returnEnd:!0,subLanguage:["javascript","handlebars","xml"]}},{className:"tag",begin:/<>|<\/>/},{className:"tag",begin:t.concat(/</,t.lookahead(t.concat(n,t.either(/\/>/,/>/,/\s/)))),end:/\/?>/,contains:[{className:"name",begin:n,relevance:0,starts:l}]},{className:"tag",begin:t.concat(/<\//,t.lookahead(t.concat(n,/>/))),contains:[{className:"name",begin:n,relevance:0},{begin:/>/,relevance:0,endsParent:!0}]}]}}function za(e){const t="true false yes no null",n="[\\w#;/?:@&=+$,.~*'()[\\]]+",a={className:"attr",variants:[{begin:/[\w*@][\w*@ :()\./-]*:(?=[ \t]|$)/},{begin:/"[\w*@][\w*@ :()\./-]*":(?=[ \t]|$)/},{begin:/'[\w*@][\w*@ :()\./-]*':(?=[ \t]|$)/}]},o={className:"template-variable",variants:[{begin:/\{\{/,end:/\}\}/},{begin:/%\{/,end:/\}/}]},r={className:"string",relevance:0,begin:/'/,end:/'/,contains:[{match:/''/,scope:"char.escape",relevance:0}]},s={className:"string",relevance:0,variants:[{begin:/"/,end:/"/},{begin:/\S+/}],contains:[e.BACKSLASH_ESCAPE,o]},i=e.inherit(s,{variants:[{begin:/'/,end:/'/,contains:[{begin:/''/,relevance:0}]},{begin:/"/,end:/"/},{begin:/[^\s,{}[\]]+/}]}),b={className:"number",begin:"\\b"+"[0-9]{4}(-[0-9][0-9]){0,2}"+"([Tt \\t][0-9][0-9]?(:[0-9][0-9]){2})?"+"(\\.[0-9]*)?"+"([ \\t])*(Z|[-+][0-9][0-9]?(:[0-9][0-9])?)?"+"\\b"},y={end:",",endsWithParent:!0,excludeEnd:!0,keywords:t,relevance:0},w={begin:/\{/,end:/\}/,contains:[y],illegal:"\\n",relevance:0},v={begin:"\\[",end:"\\]",contains:[y],illegal:"\\n",relevance:0},S=[a,{className:"meta",begin:"^---\\s*$",relevance:10},{className:"string",begin:"[\\|>]([1-9]?[+-])?[ ]*\\n( +)[^ ][^\\n]*\\n(\\2[^\\n]+\\n?)*"},{begin:"<%[%=-]?",end:"[%-]?%>",subLanguage:"ruby",excludeBegin:!0,excludeEnd:!0,relevance:0},{className:"type",begin:"!\\w+!"+n},{className:"type",begin:"!<"+n+">"},{className:"type",begin:"!"+n},{className:"type",begin:"!!"+n},{className:"meta",begin:"&"+e.UNDERSCORE_IDENT_RE+"$"},{className:"meta",begin:"\\*"+e.UNDERSCORE_IDENT_RE+"$"},{className:"bullet",begin:"-(?=[ ]|$)",relevance:0},e.HASH_COMMENT_MODE,{beginKeywords:t,keywords:{literal:t}},b,{className:"number",begin:e.C_NUMBER_RE+"\\b",relevance:0},w,v,r,s],_=[...S];return _.pop(),_.push(i),y.contains=_,{name:"YAML",case_insensitive:!0,aliases:["yml"],contains:S}}ce.registerLanguage("bash",_a);ce.registerLanguage("javascript",Ia);ce.registerLanguage("json",Na);ce.registerLanguage("markdown",Ca);ce.registerLanguage("swift",e=>{const t=Ua(e);return t.contains=[{scope:"property",begin:/\.[A-Za-z_]\w*/},...t.contains??[]],t});ce.registerLanguage("typescript",Ha);ce.registerLanguage("xml",Ga);ce.registerLanguage("yaml",za);const Wa={html:"xml",js:"javascript",md:"markdown",sh:"bash",shell:"bash",ts:"typescript",txt:"plaintext",yml:"yaml"};function rn(e){const t=e.trim().toLowerCase();return Wa[t]??t}function cn(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function ln(e){const t=rn(e);return t?`language-${cn(t)}`:"language-plaintext"}function dn(e,t){const n=rn(t);return!n||n==="plaintext"||!ce.getLanguage(n)?cn(e):ce.highlight(e,{language:n,ignoreIllegals:!0}).value}function qa(e,t){const n=e.replace(/\r\n?/g,`
`).split(`
`);return n.length>1&&n[n.length-1]===""&&n.pop(),n.map((a,o)=>`<span class="code-line"><span class="code-line-number" aria-hidden="true">${o+1}</span><span class="code-line-content">${dn(a,t)}</span></span>`).join("")}const ja=`---
title: "Introducing Ada 0.1.0"
slug: "introducing-adaengine-0-1-0"
description: "Ada 0.1.0 is the first public milestone for a Swift-first, data-driven game engine and app framework."
date: "2026-06-1 13:36"
author: "SpectralDragon"
tags:
  - release
image: images/main/tilemap.png
published: true
featured: true
---

# Introducing Ada 0.1.0

![Ada Editor workspace](images/main/ada-editor.png "Ada Editor workspace with Swift source, scene preview, SwiftPM commands, and the output console.")

After a long road, I am excited to introduce **Ada 0.1.0**: a free and open source game engine and app framework written in Swift.

Ada is built around a simple idea: Swift should be a great language for making games, interactive apps, tools, and creative software — not only apps for Apple platforms. Swift is expressive, safe, fast, and comfortable to write. Ada tries to bring those strengths into game development with a modular engine, a data-driven architecture, and APIs that feel natural to Swift developers.

Ada is available on GitHub under the [MIT license](https://github.com/AdaEngine/AdaEngine). This first release is still early, but it is already a real milestone: the engine can open windows, run an ECS-driven game loop, render sprites and UI, load assets and scenes, play audio, handle input, run physics, and build examples across the engine modules.

:::warning Early release
Ada 0.1.0 is an early release. APIs will change, some features are incomplete, documentation is still growing, and you should expect rough edges. I do not recommend using it for serious production projects yet unless you are comfortable with instability and want to help shape the engine.
:::

If that sounds exciting, you can jump straight into the [tutorials](https://docs.adaengine.org/tutorials/adaengine/) or explore the [GitHub repository](https://github.com/AdaEngine/AdaEngine).

:::info
This article includes links to Ada documentation and source code where possible. The docs are generated from the codebase, so they will continue improving together with the engine.
:::

## What is Ada?

Ada is a data-driven game engine and app framework for Swift. Its core design goals are:

- **Simple**: easy to learn for newcomers, but still flexible enough for experienced users.
- **Modular**: most engine features are delivered as plugins, so you can choose what your app needs.
- **Data-driven**: the heart of Ada is an Entity Component System.
- **Fast iteration**: the engine is designed for quick builds and quick feedback.
- **Capable**: the first focus is a complete 2D workflow, with 3D support already present and planned to grow.
- **Cross-platform by design**: Ada currently targets Apple platforms and is actively moving toward broader support including Windows, Linux, Android, and WebAssembly/WebGPU.

The current feature set includes:

- **Sprites**: render many textures with batching; use individual textures, sprite sheets, and animated textures.
- **Scenes**: save and load ECS worlds from human-readable scene files.
- **Tilemaps**: build levels with [LDtk](https://ldtk.io) or integrate another editor with the provided APIs.
- **2D physics**: built-in support powered by [Box2D v3](https://box2d.io).
- **Assets**: load and save game assets, with async loading and asset handles.
- **Hot asset reloading**: reload changed assets at runtime and stay in the flow.
- **Audio**: load and play sound resources, including spatial playback attached to entities.
- **Plugins**: rendering, audio, input, UI, events, physics, scenes, sprites, and other systems are composed through plugins.
- **Events and observation**: communicate across your game with global events or ECS-style frame events.
- **Parent/child relationships**: build entity hierarchies and propagate transforms through them.
- **Multiple render backends**: Metal on Apple platforms and WebGPU/Dawn where enabled.
- **Render graphs**: control how rendering work is scheduled and composed.
- **AdaUI**: build game and app UI with a SwiftUI-inspired API.
- **Gamepads**: access connected gamepads on supported platforms.
- **Examples**: a growing set of demos for sprites, UI, input, events, scenes, tilemaps, and 3D.

## A Swift-native app entry point

Ada apps start with an API that should feel familiar if you have used SwiftUI:

\`\`\`swift
import AdaEngine

@main
struct AdaApp: App {
    var body: some AppScene {
        DefaultAppWindow()
            .windowMode(.windowed)
            .windowTitle("Ada App")
    }
}
\`\`\`

That is enough to create a window and install the default engine plugins.

The core philosophy is customization through plugins. Rendering, audio, input, events, UI, physics, scenes, sprites, and other features are added to an application through plugin composition. You can start with sensible defaults or build a smaller runtime by selecting only the parts you need.

For more control, use [\`EmptyWindow\`](https://docs.adaengine.org/documentation/adaapp/emptywindow) and add plugins manually:

\`\`\`swift
import AdaEngine

@main
struct AdaApp: App {
    var body: some AppScene {
        EmptyWindow()
            .addPlugins(DefaultPlugins())
            .windowMode(.windowed)
            .windowTitle("Ada App")
    }
}
\`\`\`

[\`DefaultPlugins\`](https://docs.adaengine.org/documentation/adaengine/defaultplugins/) is the bundle most users should start with. When you need a lighter runtime, you can disable parts of the bundle with [\`disable(_:)\`](https://docs.adaengine.org/documentation/adaengine/defaultplugins/disable(_:)).

## Entity Component System

Ada's heart is its ECS framework. It is inspired by engines and frameworks such as Bevy and RealityKit, but it is designed to feel natural in Swift.

In an Entity Component System:

- **Entities** are unique identifiers.
- **Components** are pieces of data attached to entities.
- **Systems** are logic that reads and writes components.
- **Resources** are unique world-level values.

This approach keeps game data separate from game logic. It also makes it easier to scale a game from a few objects to many systems and many entities.

AdaECS uses normal Swift types and adds macros to reduce boilerplate:

\`\`\`swift
import AdaEngine

@Component
struct Position {
    var value: Float
}

@Component
struct Velocity {
    var value: Float
}

@System
func Movement(
    _ query: Query<
        Ref<Position>, // read-write access
        Velocity       // read-only access
    >
) {
    query.forEach { position, velocity in
        position.value += velocity.value
    }
}

struct ExamplePlugin: Plugin {
    func setup(in app: AppWorlds) {
        app.spawn {
            Position(value: 0)
            Velocity(value: 1)
        }

        app.spawn {
            Position(value: 1)
            Velocity(value: 2)
        }

        app.addSystem(MovementSystem.self, on: .update)
    }
}

@main
struct AdaApp: App {
    var body: some AppScene {
        DefaultAppWindow()
            .addPlugins(ExamplePlugin())
    }
}
\`\`\`

The \`@System\` macro generates the concrete system type for you. You write the logic as a Swift function; Ada turns it into a registered ECS system.

### Queries

Queries fetch components from the world:

\`\`\`swift
@System
func Movement(_ query: Query<Entity, Transform>) {
    query.forEach { entity, transform in
        // Iterate over every entity with a Transform.
    }
}
\`\`\`

### Filter queries

Filters restrict the set of matching entities:

\`\`\`swift
@System
func PlayerMovement(
    _ query: FilterQuery<Entity, Transform, With<Player>>
) {
    query.forEach { entity, transform in
        // Iterate only over entities that also have Player.
    }
}
\`\`\`

### Change detection

Change detection lets a system react only when relevant data changes:

\`\`\`swift
@System
func EnemyHealthBar(
    _ query: FilterQuery<Enemy, Changed<Health>>
) {
    query.forEach { enemy in
        // Run when Health has been added or changed.
    }
}
\`\`\`

### Resources

Resources store unique world-level data:

\`\`\`swift
struct GameScore: Resource {
    var score: Int
    var bulletFireCount: Int
}

world.insertResource(GameScore(score: 0, bulletFireCount: 0))

@System
func UpdateScore(score: ResMut<GameScore>) {
    score.score += 1
}
\`\`\`

Delta time is also exposed as a resource:

\`\`\`swift
@System
func Movement(
    time: Res<DeltaTime>,
    query: Query<Ref<Position>>
) {
    query.forEach {
        $0.value += 20 * time.deltaTime
    }
}
\`\`\`

### Commands

When a system needs to spawn or delete entities, or insert components, it can use [\`Commands\`](https://docs.adaengine.org/documentation/adaecs/commands). Commands are collected and then applied after the system finishes, which keeps system execution safe.

\`\`\`swift
@System
func GameStartup(_ commands: Commands) {
    commands.spawn("Player") {
        Player()
        Transform()
    }
}
\`\`\`

### Local values

Systems can keep local state with [\`Local\`](https://docs.adaengine.org/documentation/adaecs/local):

\`\`\`swift
@System
func UpdateData(isUpdated: Local<Bool> = false) {
    if !isUpdated.wrappedValue {
        // Perform one-time work.
        isUpdated.wrappedValue = true
    }
}
\`\`\`

### Struct systems

For more control, AdaECS also supports struct-based systems with [\`@PlainSystem\`](https://docs.adaengine.org/documentation/adaecs/plainsystem(dependencies:)):

\`\`\`swift
@PlainSystem(dependencies: [
    .after(EnemyMovement.self),
    .before(PhysicsSystem.self)
])
struct MovementSystem {
    @Query<Player, Transform>
    private var playerQuery

    init(world: World) {}

    func update(context: UpdateContext) {
        playerQuery.forEach {
            // Update player movement here.
        }
    }
}
\`\`\`

### Schedulers

Systems run in schedulers. Ada includes common stages such as startup, pre-update, update, fixed update, and others:

\`\`\`swift
world
    .addSystem(StartupSystem.self, on: .startup)
    .addSystem(MovementSystem.self, on: .fixedUpdate)
    .addSystem(UpdateEnemySystem.self, on: .preUpdate)
    .addSystem(UpdateScoreSystem.self, on: .update)
\`\`\`

\`.startup\` runs once when the app launches. You can also build custom schedulers when your game needs its own execution model.

:::warning Early release
Be careful with system dependencies. If a system depends on another system that is not registered in the same scheduler, the app can fail at runtime.
:::

### Bundles

Bundles combine several components into one reusable unit. The \`@Bundle\` macro generates the code needed to unpack the bundle into components:

\`\`\`swift
@Bundle
struct EnemyBundle {
    let enemy = Enemy()
    let transform: Transform
    let health: Health
}

world.spawn(
    "Enemy",
    bundle: EnemyBundle(
        transform: Transform(),
        health: Health(30)
    )
)
\`\`\`

### Scriptable objects

If you prefer a Unity-like workflow for some gameplay code, Ada provides [\`ScriptableObject\`](https://docs.adaengine.org/documentation/adascene/scriptableobject) and [\`ScriptableComponents\`](https://docs.adaengine.org/documentation/adascene/scriptablecomponents):

\`\`\`swift
final class Player: ScriptableObject {
    func update(_ deltaTime: TimeInterval) {
        if input.isKeyPressed(.w) {
            // Move player.
        }
    }
}

world.spawn("Player") {
    ScriptableComponents(
        components: [
            Player()
        ]
    )
}
\`\`\`

This gives you a familiar object-style escape hatch while the engine remains ECS-first.

## AdaUI

Ada includes a UI framework called AdaUI. It is inspired by SwiftUI and is designed for both games and editor-like tools.

SwiftUI proved how productive declarative UI can be. AdaUI brings a similar style into the engine, so UI code can be written directly in Swift and rendered inside an Ada scene.

![AdaUI and SwiftUI layout diff for a media card stack](images/main/adaui_example_1.jpg "AdaUI and SwiftUI layout comparison for a media review card stack.")

![AdaUI and SwiftUI layout diff for a chat composer shell](images/main/adaui_example_2.jpg "AdaUI and SwiftUI layout comparison for a chat composer shell.")

### Views

A view implements the [\`View\`](https://docs.adaengine.org/documentation/adaui/view) protocol:

\`\`\`swift
struct GameOverView: View {
    var body: some View {
        Text("Game Over")
    }
}
\`\`\`

### Layout

AdaUI includes familiar stack layout primitives:

\`\`\`swift
struct GameOverView: View {
    var body: some View {
        VStack(spacing: 20) {
            Text("Game Over")
            Text("Try again")
        }
    }
}
\`\`\`

### Interactive elements

Buttons and other interactive controls can be composed in the same style:

\`\`\`swift
struct MenuView: View {
    var body: some View {
        Button("Start Game") {
            // Start game.
        }

        Button(action: {
            // Open settings.
        }, label: {
            Text("Settings")
                .foregroundColor(.red)
        })
    }
}
\`\`\`

### Modifiers

Modifiers apply style and behavior:

\`\`\`swift
struct GameOverView: View {
    var body: some View {
        VStack(spacing: 20) {
            Text("Game Over")
                .font(.system(size: 50))
                .foregroundColor(.red)
        }
    }
}
\`\`\`

### State and bindings

Views can store state and update when that state changes:

\`\`\`swift
struct GameOverView: View {
    @State private var isDead = false

    var body: some View {
        VStack(spacing: 20) {
            if isDead {
                Text("Game Over")
                    .font(.system(size: 50))
                    .foregroundColor(.red)
            }
        }
        .onEvent(YourGameEvent.UserDied) {
            self.isDead = true
        }
    }
}
\`\`\`

Bindings pass state between views:

\`\`\`swift
struct ParentView: View {
    @State private var isDead = false

    var body: some View {
        SubView(isDead: $isDead)
    }
}

struct SubView: View {
    @Binding var isDead: Bool

    var body: some View {
        if isDead {
            Text("Game Over")
        }
    }
}
\`\`\`

### Attaching UI to an entity

To show a view in the world, attach it with [\`UIComponent\`](https://docs.adaengine.org/documentation/adaui/uicomponent):

\`\`\`swift
let gameOverView = GameOverView()

world.spawn("GameOverView") {
    UIComponent(view: gameOverView)
}
\`\`\`

### Environment access

AdaUI views can read values from the environment. For example, a view attached to an entity can access the ECS world:

\`\`\`swift
struct DebugView: View {
    @Environment(\\.world)
    private var world

    var body: some View {
        Button("Spawn Enemy") {
            world.spawn("Enemy", bundle: EnemyBundle())
        }
    }
}
\`\`\`

### Images

Images can be used directly in UI:

\`\`\`swift
struct UserAvatarView: View {
    var body: some View {
        Image("@res://avatar.png")
    }
}
\`\`\`

AdaUI is especially important for the future of Ada because the editor is planned to be built on top of the same UI system that games can use.

![Ada Editor UI](images/main/ada-editor.png "The editor is planned around the same AdaUI foundations available to games and tools.")

## 2D features

Ada 0.1.0 is focused on building a strong 2D foundation.

### Sprites

Sprites are a core building block for many 2D games. Ada can render sprites from [\`Texture2D\`](https://docs.adaengine.org/documentation/adarender/texture2d) and other texture resources:

\`\`\`swift
let texture = try await AssetsManager.load(Texture2D.self, at: "@res://sprite.png")

world.spawn {
    Sprite(texture: texture)
    Transform()
}
\`\`\`

### Texture atlases and sprite sheets

Texture atlases can be used for animation, tile sets, and optimized rendering:

\`\`\`swift
let image = try await AssetsManager.load(Image.self, at: "@res://characters.png")
let textureAtlas = TextureAtlas(from: image, size: Vector2(16, 16))

world.spawn {
    Sprite(
        texture: textureAtlas[0, 1],
        size: Size(width: 16, height: 16)
    )
    Transform()
}
\`\`\`

If sprite size is not specified, Ada can infer it from the texture.

### Tilemaps

Ada includes a dedicated \`AdaTilemap\` module. The built-in demos include both custom tilemap examples and LDtk-based tilemap loading. This makes it possible to build levels visually and then load them into an ECS world.

The goal is to support practical 2D workflows: draw levels in an editor, load them as data, attach physics, and iterate quickly.

![Tilemap demo](images/main/tilemap.png "A tilemap scene rendered by Ada.")

### 2D physics

Ada includes \`AdaPhysics\`, backed by Box2D. You can attach collision components to entities and receive collision events through the event system.

Physics is integrated into the ECS world, so gameplay code can combine transforms, sprites, collision components, and systems in the same data-driven model.

## Scenes

A scene is a collection of entities, components, and resources that can be saved, loaded, and spawned into a world.

You can think about a scene as a prefab or level file: it describes a piece of your game that can be loaded when needed.

### Scene files

Scenes are saved as human-readable YAML. A scene file can include entities, component data, transforms, sprites, physics components, and resources:

\`\`\`yaml
version: 1.0.0
scene: Scene
world:
  entities:
  - name: Ground
    id: 122210699653662020
    components:
      AdaSprite.Sprite:
        tintColor:
          red: 1.0
          green: 1.0
          blue: 1.0
          alpha: 1.0
        flipX: false
        flipY: false
      AdaTransform.Transform:
        rotation:
          x: 0.0
          y: 0.0
          z: 0.0
          w: 1.0
        scale:
          x: 3.0
          y: 0.19
          z: 0.19
        position:
          x: 0.0
          y: -1.0
          z: 0.0
      AdaPhysics.Collision2DComponent:
        shapes:
        - fixture:
            box:
              _0:
                halfWidth: 0.5
                halfHeight: 0.5
                offset:
                  x: 0.0
                  y: 0.0
        mode:
          default: {}
  resources: {}
\`\`\`

### Loading scenes

Scenes are assets, so they can be loaded through the asset system:

\`\`\`swift
let scene = try await AssetsManager.load(Scene.self, at: "@res://game_scene.ascn")

world.spawn("Spawned scene") {
    DynamicScene(scene: scene)
}
\`\`\`

The spawned scene can attach its entities and resources under a parent entity.

### Hot reloading scenes

Scene hot reloading is one of the most important iteration features. When a scene file changes, Ada can apply those changes to a running scene without requiring a restart or a full rebuild. This makes level editing and gameplay tuning much faster.

:::info
Hot reload is an early feature, but the direction is clear: edit data, see the result immediately, and stay focused on the game instead of the build loop.
:::

## Events

Games and apps need to communicate constantly: collisions begin, buttons are pressed, UI opens, enemies spawn, players connect, and systems need to react.

Ada supports both global event-style messaging and ECS frame events.

### EventManager

You can subscribe to an event and store the cancellable token:

\`\`\`swift
let cancellable = world.subscribe(
    on: CollisionEvents.Began.self
) { payload in
    // Handle collision.
}

world.eventManager.sendEvent(SomeEvent())

// Or send globally:
EventManager.default.sendEvent(SomeEvent())
\`\`\`

### ECS events

For ECS-native workflows, Ada provides \`Events\` and \`EventSender\`:

\`\`\`swift
@System
func HostConnection(_ events: Events<OnConnect>) {
    for event in events {
        print("User connected", event.userId)
    }
}

@System
func ConnectionUpdate(_ sender: EventSender<OnConnect>) {
    sender(OnConnect(userId: "player#123"))
}
\`\`\`

:::note
ECS events are frame events: they are stored only for the current frame.
:::

## Assets

The asset system lets you load and save game data. Assets are referenced through handles, which makes hot reloading possible.

For example, loading a texture looks like this:

\`\`\`swift
let texture: AssetHandle<Texture2D> = try await AssetsManager.load(
    Texture2D.self,
    at: "@res://my_texture.png"
)
\`\`\`

The \`@res://\` prefix points to your app resource directory. By default, Ada looks for an \`Assets\` or \`Resources\` folder in your target. You can also set the resource directory manually.

To load from a specific bundle:

\`\`\`swift
let texture: AssetHandle<Texture2D> = try await AssetsManager.load(
    Texture2D.self,
    at: "my_texture.png",
    from: Foundation.Bundle(path: "")
)
\`\`\`

To enable hot reloading for an asset, pass \`handleChanges: true\`:

\`\`\`swift
let texture: AssetHandle<Texture2D> = try await AssetsManager.load(
    Texture2D.self,
    at: "@res://my_texture.png",
    handleChanges: true
)
\`\`\`

### Adding a new asset type

You can add support for custom assets by implementing the [\`Asset\`](https://docs.adaengine.org/documentation/adaassets/asset) protocol:

\`\`\`swift
struct MyAsset: Asset {
    init(asset decoder: AssetDecoder) async throws {
        // Decode asset contents.
    }

    func encodeContents(with encoder: AssetEncoder) async throws {
        // Encode asset contents.
    }

    static func extensions() -> [String] {
        ["txt"]
    }
}
\`\`\`

This makes the asset available to the same loading pipeline as built-in textures, sounds, scenes, and other resources.

## Audio

Ada includes an \`AdaAudio\` module backed by miniaudio. You can load an audio resource and play it from an entity:

\`\`\`swift
let backgroundSound = try await AssetsManager.load(
    AudioResource.self,
    at: "@res://background.wav"
)

let player = world.spawn {
    Player()
}

player.prepareAudio(backgroundSound)
    .setLoop(true)
    .play()
\`\`\`

Audio can be attached to entities, which opens the door for spatial sound and gameplay-driven playback.

## Rendering

Rendering in Ada is split into modules and plugins. The current codebase includes:

- \`AdaRender\` for render abstractions, cameras, materials, meshes, textures, render pipelines, and render graphs.
- \`AdaSprite\` for 2D sprite rendering.
- \`AdaCorePipelines\` for built-in rendering pipelines and shaders.
- Metal support on Apple platforms.
- WebGPU support through Dawn/Swan where enabled.
- Shader compilation and transpilation infrastructure built around SPIR-V tooling.

This release already includes the foundation for both 2D and 3D rendering. The 2D path is the most mature today. 3D exists — including meshes, cameras, materials, and a cube demo — but it needs more work before it feels complete.

Render graphs are an important part of the future direction. They make rendering work explicit and composable, which should help the engine grow from simple sprite scenes to more advanced pipelines.

## Platforms and tooling

Ada is a Swift Package using Swift 6.2. The package currently declares Apple platform targets such as macOS 15, iOS 18, tvOS 18, and visionOS 2. It also contains conditional compilation and platform backends for Linux, Windows, Android, WASI/WebAssembly, Metal, WebGPU, X11, and browser runtimes.

Not every platform is equally mature yet. Apple platforms are the most ready today, while Windows, Linux, Android, and Web are part of the active cross-platform direction.

The repository also includes SwiftPM plugins and tools, including:

- an Ada web export plugin,
- WebGPU/Tint related build tooling,
- a texture atlas builder tool and plugins,
- shader transpilation tooling,
- generated documentation support through DocC.

## Examples

The repository includes examples under [\`Demos\`](https://github.com/AdaEngine/AdaEngine/tree/main/Demos), including:

- sprite rendering,
- many sprites / stress examples,
- custom materials,
- 2D lighting,
- transparency,
- text rendering,
- gamepad input,
- scene loading,
- LDtk tilemaps,
- scriptable components,
- collision events,
- UI examples such as buttons, text fields, scene views, animated text, and a Kanban board,
- a simple 3D cube example,
- small game demos such as Snowman Attacks.

Examples are important because they show what the engine can already do and also act as practical tests for engine workflows.

![Duck Hunt demo](images/main/duck_hunt.png "A small Duck Hunt style demo running with Ada.")

![Space Invaders demo](images/main/space_invaders.jpeg "A Space Invaders style demo from the Ada examples.")

## Why I built Ada

Making games was my childhood dream. I started learning Java because I wanted to make Minecraft mods. Later I became an iOS engineer, but the dream of building games never disappeared.

I spent a lot of free time learning Godot, exploring the game development community, and trying to understand how engines work internally. I started with a small Metal project, kept experimenting, and after years of work reached this milestone: the first Ada release.

I love open source. I love Swift. I have built many open source Swift projects, and I wanted to see what would happen if Swift was used not only for apps, but also for a full game engine.

Swift has a lot to offer: value types, protocol-oriented design, macros, structured concurrency, memory safety, strong tooling, and a syntax that is pleasant to write. The biggest problem is not the language — it is the idea that Swift belongs only to macOS and iOS development.

I do not believe that is true. Swift can be more than that. Ada is my attempt to help prove it.

## What's next?

Ada 0.1.0 is a beginning, not a finish line. The next phase is about expanding the engine, polishing the experience, and growing the community.

### More platforms

The long-term goal is to support as many platforms as possible. Swift is a safe and powerful language, and I believe it can be a great fit for cross-platform game development.

The next important platform work includes WebAssembly/WebGPU, Linux, Android, and continued Windows support.

### The editor

Game developers want to prototype faster and write less boilerplate. AdaUI gives us the foundation to build an editor with the same UI framework that games can use.

Building the Ada Editor in AdaUI is an important goal: it will improve the UI framework, validate the engine tooling, and make Ada more approachable for users who prefer visual workflows.

### 3D rendering and polish

The 2D feature set is the main focus of this release, but 3D support is already present and will continue improving. There is a lot of work to do: better materials, more complete rendering features, MSAA, richer scene tooling, model workflows, and more.

The engine also needs polish across many systems: asset workflows, hot reloading, editor integration, diagnostics, examples, and API design.

### Documentation and tutorials

The API is still unstable and documentation is sparse in places. In the near future, Ada needs more tutorials, better guides, and more examples that show complete workflows from project setup to finished game mechanics.

Good documentation is not optional. It is part of the engine.

## Join Ada

If any of this sounds interesting, please check out [Ada on GitHub](https://github.com/AdaEngine/AdaEngine), read the [tutorial series](https://docs.adaengine.org/tutorials/adaengine/), explore the examples, and join the discussion.

Ada is currently built by volunteers. If you want to help build a Swift game engine — with code, documentation, examples, testing, design feedback, or ideas — you are very welcome.

This is only version 0.1.0, but it is the start of something I have wanted to build for a long time.

Let's make games with Swift.
`,Va=[{name:"Vladislav Prusakov",description:"AdaEngine Founder, iOS Engineer",username:"SpectralDragon",avatar:"authors/spectraldragon.jpg",socials:[{username:"SpectralDragon",social:"github"},{username:"SpectralDragon_",social:"twitter"}]}],Ka={},Za=Va,Ya=Ka?Object.assign({"./content/articles/introducing-adaengine-0-1-0.md":ja}):{};function Xa(e){const t=e.replace(/\r\n/g,`
`);if(!t.startsWith(`---
`))return{frontmatter:{},body:t.trim()};const n=t.indexOf(`
---
`,4);if(n===-1)return{frontmatter:{},body:t.trim()};const a=t.slice(4,n),o=t.slice(n+5).trim(),r={};let s=null;for(const i of a.split(`
`)){const c=i.trim();if(!c){s=null;continue}if(c.startsWith("- ")&&s){const b=r[s],y=xt(c.slice(2).trim()),w=Array.isArray(b)?b:[];w.push(y),r[s]=w;continue}const l=i.indexOf(":");if(l===-1){s=null;continue}const d=i.slice(0,l).trim(),p=i.slice(l+1).trim();if(!p){r[d]=[],s=d;continue}r[d]=xt(p),s=null}return{frontmatter:r,body:o}}function xt(e){return e.startsWith("[")&&e.endsWith("]")?e.slice(1,-1).split(",").map(t=>t.trim().replace(/^['"]|['"]$/g,"")).filter(Boolean):e==="true"?!0:e==="false"?!1:e.replace(/^['"]|['"]$/g,"")}function re(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Ja(e){return/^(https?:|data:|blob:|\/)/.test(e)?e:`${"/".endsWith("/")?"/":"//"}${e.replace(/^\/+/,"")}`}function un(e){return/^https?:\/\//.test(e)}function et(e){return e.trim().replace(/^@/,"").toLowerCase()}function Qa(e){var n;if(typeof e.url=="string")return e.url;if(typeof e.profileUrl=="string")return e.profileUrl;const t=(n=e.socials)==null?void 0:n.find(a=>a.social==="github");if(typeof(t==null?void 0:t.url)=="string")return t.url;if(typeof(t==null?void 0:t.username)=="string")return`https://github.com/${t.username.replace(/^@/,"")}`;if(typeof e.username=="string")return`https://github.com/${e.username.replace(/^@/,"")}`}function es(e,t){if(typeof e!="string"||!e.trim())throw new Error(`Invalid article author in ${t}`);const n=et(e),a=Za.find(o=>et(o.username??o.name)===n||et(o.name)===n);return a?{name:a.name,url:Qa(a),avatar:typeof a.avatar=="string"?a.avatar:void 0}:un(e)?{name:e,url:e}:{name:e}}function ts(e,t){if(!/^(https?:\/\/|\/|\.\/|\.\.\/|[A-Za-z0-9/_-])/.test(t))return _e(e);const n=re(t),a=un(t)?' target="_blank" rel="noreferrer"':"";return`<a href="${n}"${a}>${_e(e)}</a>`}function _e(e){return re(e).replace(/`([^`]+)`/g,"<code>$1</code>").replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>").replace(/\*([^*]+)\*/g,"<em>$1</em>")}function ns(e,t){let n=0;for(let a=t;a<e.length;a+=1){const o=e[a];if(o==="("){n+=1;continue}if(o===")"){if(n===0)return a;n-=1}}return-1}function ue(e){let t="",n=0;for(;n<e.length;){const a=e.indexOf("[",n);if(a===-1){t+=_e(e.slice(n));break}const o=e.indexOf("]",a+1);if(o===-1||e[o+1]!=="("){t+=_e(e.slice(n,a+1)),n=a+1;continue}const r=o+2,s=ns(e,r);if(s===-1){t+=_e(e.slice(n,a+1)),n=a+1;continue}t+=_e(e.slice(n,a)),t+=ts(e.slice(a+1,o),e.slice(r,s)),n=s+1}return t}function as(e){const t=e.toLowerCase();return{js:"JavaScript",javascript:"JavaScript",json:"JSON",md:"Markdown",markdown:"Markdown",sh:"Shell",shell:"Shell",swift:"Swift",ts:"TypeScript",typescript:"TypeScript",yaml:"YAML",yml:"YAML"}[t]??(e?e[0].toUpperCase()+e.slice(1):"Code")}function ss(e){var o;const t=e.match(/(?:^|\s)(?:title|filename)=["']([^"']+)["']/),n=((o=e.split(/\s+/)[0])==null?void 0:o.replace(/[^\w#+-]/g,""))??"",a=(t==null?void 0:t[1])??e.replace(n,"").trim().replace(/^["']|["']$/g,"");return{language:n,title:a}}function is(e,t,n){const a=as(t);return`
    <figure class="article-code-block">
      <figcaption>
        <span>${re(n)}</span>
        <span>${re(a)}</span>
      </figcaption>
      <pre><code class="${ln(t)}">${dn(e,t)}</code></pre>
    </figure>
  `}function os(e){const t=e.match(/^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]+)")?\)$/),n=e.match(/^::video\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]+)")?\)$/),a=t??n;if(!a)return null;const[,o,r,s]=a,i=Ja(r),c=s||o,l=!!n||/\.(mp4|webm|ogg|mov)$/i.test(r),d=l?`<video controls playsinline preload="metadata" src="${re(i)}">${re(o)}</video>`:`<img src="${re(i)}" alt="${re(o)}" loading="lazy" role="button" tabindex="0" aria-label="Open image fullscreen" data-article-lightbox-image />`;return`
    <figure class="article-media ${l?"article-media-video":"article-media-image"}">
      ${d}
      ${c?`<figcaption>${ue(c)}</figcaption>`:""}
    </figure>
  `}function rs(e){const t=[];let n=!1;const a=()=>{n&&(t.push("</ul>"),n=!1)};for(const o of e){const r=o.trim();if(!r){a();continue}if(r.startsWith("- ")){n||(t.push("<ul>"),n=!0),t.push(`<li>${ue(r.slice(2))}</li>`);continue}a(),t.push(`<p>${ue(r)}</p>`)}return a(),t.join(`
`)}function cs(e,t,n){const a=["note","tip","warning","danger","info"].includes(e)?e:"note";return`
    <aside class="article-callout article-callout-${a}">
      <span class="article-callout-icon" aria-hidden="true">!</span>
      <div>
        <p class="article-callout-title">${ue(t||{danger:"Important",info:"Info",note:"Note",tip:"Tip",warning:"Warning"}[a])}</p>
        ${rs(n)}
      </div>
    </aside>
  `}function $t(e,t){const n=e.toLowerCase().replace(/`([^`]+)`/g,"$1").replace(/&[a-z]+;/gi,"").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||"section",a=t.get(n)??0;return t.set(n,a+1),a===0?n:`${n}-${a+1}`}function ls(e){const t=e.split(`
`),n=[],a=[],o=new Map;let r=!1,s=!1,i="",c="",l=[],d=!1,p="note",b="",y=[];const w=()=>{r&&(n.push("</ul>"),r=!1)},v=()=>{s&&(n.push(is(l.join(`
`),i,c)),s=!1,i="",c="",l=[])},S=()=>{d&&(n.push(cs(p,b,y)),d=!1,p="note",b="",y=[])};for(const _ of t){if(_.startsWith("```")){if(w(),S(),s)v();else{const C=ss(_.slice(3).trim());i=C.language,c=C.title,s=!0}continue}if(s){l.push(_);continue}if(_.trim()===":::"){w(),S();continue}if(d){y.push(_);continue}const T=_.trim();if(!T){w();continue}if(T.startsWith("- ")){r||(n.push("<ul>"),r=!0),n.push(`<li>${ue(T.slice(2))}</li>`);continue}w();const $=T.match(/^:::(note|tip|warning|danger|info)(?:\s+(.+))?$/i);if($){p=$[1].toLowerCase(),b=$[2]??"",y=[],d=!0;continue}const U=os(T);if(U){n.push(U);continue}if(T.startsWith("### ")){const C=T.slice(4),L=$t(C,o);a.push({id:L,title:C,level:3}),n.push(`<h3 id="${re(L)}">${ue(C)}</h3>`);continue}if(T.startsWith("## ")){const C=T.slice(3),L=$t(C,o);a.push({id:L,title:C,level:2}),n.push(`<h2 id="${re(L)}">${ue(C)}</h2>`);continue}if(T.startsWith("# ")){n.push(`<h1>${ue(T.slice(2))}</h1>`);continue}n.push(`<p>${ue(T)}</p>`)}return w(),v(),S(),{html:n.join(`
`),toc:a}}function pn(e){return e.replace(/^#.*$/gm,"").replace(/```[\s\S]*?```/g,"").replace(/\[([^\]]+)\]\(([^)]+)\)/g,"$1").replace(/[*`_>#-]/g,"").replace(/\s+/g," ").trim()}function ds(e){return pn(e).slice(0,180)}function us(e){const t=pn(e).split(" ").filter(Boolean).length;return Math.max(1,Math.ceil(t/180))}function ps(e,t){const n=e.title,a=e.slug,o=e.description,r=e.date,s=e.author,i=e.tags,c=e.image,l=e.published,d=e.draft,p=e.featured;if(typeof n!="string"||typeof a!="string"||typeof o!="string"||typeof r!="string")throw new Error(`Invalid article frontmatter in ${t}`);return{title:n,slug:a,description:o,date:r,author:es(s,t),tags:Array.isArray(i)?i.filter(b=>typeof b=="string"):[],image:typeof c=="string"?c:void 0,published:typeof l=="boolean"?l:!0,draft:typeof d=="boolean"?d:!1,featured:typeof p=="boolean"?p:!1}}const he=Object.entries(Ya).map(([e,t])=>{const{frontmatter:n,body:a}=Xa(t),o=ps(n,e),r=ls(a);return{...o,excerpt:ds(a),html:r.html,readingTime:us(a),toc:r.toc}}).filter(e=>e.published&&!e.draft).sort((e,t)=>new Date(t.date).getTime()-new Date(e.date).getTime());he.filter(e=>e.featured);function gs(e){return he.find(t=>t.slug===e)}const tt={schemaVersion:1,generatedAt:"",repository:"AdaEngine/AdaEngine",commit:null,demos:[]};let It=null;const nt=new Map;function gn(e){return/^(https?:|data:|blob:|\/)/.test(e)?e:`${"/".endsWith("/")?"/":"//"}${e.replace(/^\/+/,"")}`}async function mn(){return It??(It=fetch(gn("demos/manifest.json"),{headers:{Accept:"application/json"}}).then(e=>e.ok?e.json():tt).then(e=>({...tt,...e,demos:[...e.demos??[]].sort((t,n)=>t.tag.localeCompare(n.tag)||t.title.localeCompare(n.title))})).catch(()=>tt)),It}async function ms(e){const t=gn(e.source);return nt.set(t,nt.get(t)??fetch(t).then(n=>{if(!n.ok)throw new Error(`Failed to load ${e.source}`);return n.text()}).catch(()=>"")),nt.get(t)??""}function hs(e,t){return e.demos.find(n=>n.slug===t)}function fs(e){const t=new Map;for(const n of e){const a=t.get(n.tag)??{tag:n.tag,title:n.tagTitle,demos:[]};a.demos.push(n),t.set(n.tag,a)}return[...t.values()]}function hn(e){const t=e.trim().replace(/\/$/,"");return!t||t==="."||t==="/"?"":t.startsWith("/")?t:`/${t}`}function bs(e,t){const n=hn(t);let a=e||"/";return a.startsWith("/")||(a=`/${a}`),n&&(a===n||a.startsWith(`${n}/`))&&(a=a.slice(n.length)||"/"),a=a.replace(/\/$/,"")||"/",a.startsWith("/")?a:`/${a}`}function ys(e,t){const n=hn(t),a=e.startsWith("/")?e:`/${e}`;return n?`${n}${a==="/"?"/":a}`:a}const ws=["learn","community","donate"];function fn(e,t){const n=bs(e,t);if(n==="/")return{name:"home"};if(n==="/download")return{name:"download"};if(n==="/studio")return{name:"studio"};if(n==="/blog")return{name:"blog"};if(n==="/demos")return{name:"demos"};const a=n.match(/^\/demos\/([^/]+)$/);if(a)return{name:"demo",slug:decodeURIComponent(a[1])};const o=ws.find(s=>n===`/${s}`);if(o)return{name:"static-page",page:o};const r=n.match(/^\/articles\/([^/]+)$/);return r?{name:"article",slug:decodeURIComponent(r[1])}:{name:"not-found",path:n}}const Te="https://adaengine.org",Ie="Ada",ae=`${Te}/images/main/tilemap.png`,vs={learn:{title:"Learn Ada - Swift Game Engine Tutorials and Examples",description:"Learn Ada with Swift game development guides, ECS fundamentals, rendering notes, physics examples, and links to source code.",path:"/learn",image:ae,type:"website"},community:{title:"Ada Community - Swift Game Development Contributors",description:"Join the Ada community, follow development, discuss Swift game engine ideas, and contribute to the open-source project.",path:"/community",image:ae,type:"website"},donate:{title:"Support Ada - Open-Source Swift Game Engine",description:"Support Ada development through donations, code contributions, examples, bug reports, and documentation improvements.",path:"/donate",image:ae,type:"website"}};function dt(e){if(/^https?:\/\//.test(e))return e;const t=e.startsWith("/")?e:`/${e}`;return`${Te}${t==="/"?"/":t.replace(/\/$/,"")}`}function Es(e){return e.name==="home"?{title:"Ada - Open-Source Swift Game Engine",description:"Ada is an open-source game engine for Swift developers, with ECS, 2D and 3D rendering, physics, UI, editor tooling, and WebAssembly demos.",path:"/",image:ae,type:"website"}:e.name==="download"?{title:"Download Ada — Mac, Windows, Linux and iOS",description:"Download Ada for your platform. Find desktop releases, source code and the iOS app on the App Store.",path:"/download",image:ae,type:"website"}:e.name==="studio"?{title:"Ada Studio - Game Creation on Desktop, iPad and Mobile",description:"Meet Ada Studio. Build scenes, write Swift and AdaScript, and work with an AI agent on desktop and iPad. Bring your game ideas to life on mobile.",path:"/studio",image:`${Te}/images/studio/desktop.png`,type:"website"}:e.name==="blog"?{title:"Ada News - Swift Game Engine Updates",description:"Read Ada updates, release notes, engineering deep dives, and Swift game development articles from the project team.",path:"/blog",image:ae,type:"website"}:e.name==="demos"?{title:"Ada Demos - Swift WebAssembly Game Examples",description:"Explore Ada WebAssembly demos built from Swift source files, including 2D rendering, UI, physics, and scene examples.",path:"/demos",image:ae,type:"website"}:e.name==="static-page"?vs[e.page]:e.name==="demo"?{title:"Ada Demo - Swift WebAssembly Example",description:"This Ada demo page lists a Swift WebAssembly example when the demo is available.",path:`/demos/${e.slug}`,image:ae,type:"website",robots:"noindex, follow"}:e.name==="article"?{title:"Ada Article",description:"This Ada article page is available when the requested article has been published.",path:`/articles/${e.slug}`,image:ae,type:"article",robots:"noindex, follow"}:{title:"Page Not Found - Ada",description:"This Ada page could not be found. Return to the open-source Swift game engine homepage.",path:e.name==="not-found"?e.path:"/",image:ae,type:"website",robots:"noindex, follow"}}function As(e){return{title:`${e.title} - Ada News`,description:e.description,path:`/articles/${e.slug}`,image:dt(e.image??"images/main/tilemap.png"),type:"article"}}function Ss(e){return{title:`${e.title} - Ada WebAssembly Demo`,description:`${e.description} View the Swift source and run the WebAssembly build for this Ada demo.`,path:`/demos/${e.slug}`,image:ae,type:"website"}}function _s(e){const t=dt(e.path),n={"@context":"https://schema.org","@type":"WebSite",name:Ie,url:Te,description:"Ada is an open-source Swift game engine for 2D and 3D games, ECS architecture, rendering, physics, UI, and demos."};return e.path==="/"?[n,{"@context":"https://schema.org","@type":"SoftwareSourceCode",name:Ie,codeRepository:"https://github.com/AdaEngine/AdaEngine",programmingLanguage:"Swift",license:"https://github.com/AdaEngine/AdaEngine/blob/main/LICENSE",url:t,description:e.description}]:e.type==="article"?[n,{"@context":"https://schema.org","@type":"BlogPosting",headline:e.title,description:e.description,image:e.image,mainEntityOfPage:t,publisher:{"@type":"Organization",name:Ie,url:Te}}]:[n,{"@context":"https://schema.org","@type":"WebPage",name:e.title,description:e.description,url:t,isPartOf:{"@type":"WebSite",name:Ie,url:Te}}]}const K=document.querySelector("#app")??Ts(),Be="/";function Ts(){throw new Error("Root app container #app was not found")}const ks="Ada",bn="images/main/tilemap.png",Nt=["images/main/tilemap.png","images/main/space_invaders.jpeg","images/main/duck_hunt.png"],yn="AdaEngine/AdaEngine",xs={learn:{title:"Learn Ada",lead:"Master game development in Swift. From your first sprite to advanced Metal rendering techniques.",sections:[{title:"Documentation",body:"Read guides, API notes and examples for the engine core, ECS, renderer, physics and UI systems.",links:[{label:"Open documentation",href:"https://docs.adaengine.org/"}]},{title:"Examples",body:"Explore sample projects such as tilemaps, arcade games and Swift-first game prototypes.",links:[{label:"Browse examples",href:"https://github.com/AdaEngine/AdaEngine/tree/main/Examples"}]},{title:"Features",body:"Return to the home page feature overview for a quick summary of what Ada can do.",links:[{label:"View features",href:`${B("/")}#features`}]}]}},$s=[{title:"Getting Started",cards:[{title:"Get Started",body:"Install the engine and create your first window in under 5 minutes.",href:"https://docs.adaengine.org/tutorials/adaengine",icon:"book"},{title:"ECS",body:"Understand the Entity-Component-System architecture that powers Ada.",href:"https://docs.adaengine.org/documentation/adaecs/",icon:"play"},{title:"2D Physics Tutorial",body:"Add rigid bodies, collision shapes, and handle physics callbacks.",href:"https://docs.adaengine.org/documentation/adaphysics/",icon:"layout"}]},{title:"API Reference & Documentation",cards:[{title:"Core Framework",body:"Math, Collections, and basic Engine systems.",href:"https://docs.adaengine.org/documentation/adaengine/"},{title:"Rendering Pipeline",body:"Materials, Shaders, Render Graphs, and Metal integration.",href:"https://docs.adaengine.org/documentation/adarender/"},{title:"Audio System",body:"Spatial audio, sound effects, and music streaming.",href:"https://docs.adaengine.org/documentation/adaaudio/"}]}],Is=[{title:"GitHub",subtitle:"Contribute to source code",href:"https://github.com/AdaEngine/AdaEngine",icon:"images/socials/github.svg"},{title:"Discord",subtitle:"Live chat & support",href:"https://discord.gg/JkEPE7nwDu",icon:"images/socials/discord.svg"},{title:"Reddit",subtitle:"r/AdaEngine discussions",href:"https://www.reddit.com/r/AdaEngine/",icon:"images/socials/reddit.svg"},{title:"Telegram",subtitle:"Announcements channel",href:"https://t.me/adaengine",iconClass:"community-link-icon-telegram",iconMarkup:'<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M42.2 8.7 35.8 39c-.5 2.1-1.8 2.6-3.6 1.6l-9.9-7.3-4.8 4.6c-.5.5-1 .9-2 .9l.7-10.1L34.6 12c.8-.7-.2-1.1-1.2-.4L10.6 25.9.8 22.8c-2.1-.7-2.2-2.1.4-3.1L39.5 4.9c1.8-.7 3.4.4 2.7 3.8Z"/></svg>'},{title:"X (Twitter)",subtitle:"Follow @ada_engine",href:"https://x.com/ada_engine",iconClass:"community-link-icon-x",iconMarkup:'<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M28.4 20.6 43.1 4h-3.5L26.9 18.4 16.7 4H5l15.5 21.9L5 43.4h3.5L22 28.1l10.8 15.3h11.7L28.4 20.6Zm-4.8 5.4-1.6-2.2L9.6 6.5H15l10 14 1.6 2.2 13 18.2h-5.4L23.6 26Z"/></svg>'}],Ns=[{title:"Boosty",subtitle:"Monthly Sponsorship",body:"Become a backer on Boosty to get early access to updates, exclusive tutorials, and your name in the engine credits.",href:"https://boosty.to/adaengine",action:"Support on Boosty",icon:"images/icons/ic_boosty.svg",tone:"boosty"},{title:"DonationAlerts",subtitle:"One-time Donation",body:"Prefer to make a one-time contribution? You can support us via DonationAlerts with various payment methods.",href:"https://www.donationalerts.com/r/adaengine",action:"Donate via DA",icon:"images/donation_alerts_logo.svg",tone:"donation-alerts"}],Ue=[{title:"Data Driven",description:"Ada build around custom Entity Component System. Simple to use, fast and cache-friendly for your game architecture.",details:"Ada is built around a custom, data-oriented Entity Component System inspired by modern Swift APIs. Components keep game state small and explicit, while systems operate through typed queries, resources, schedules and macros such as @Component and @System. This makes gameplay code modular, cache-friendly and easier to scale from a tiny prototype to a full scene with input, animation, physics and rendering working together.",code:`@Component
struct Player: Entity { }

struct PlayerSystem: System {
    func update(context: UpdateSceneContext) { }
}`,gif:"images/features/data-driven.gif"},{title:"2D Renderer",description:"Supports real-time 2D rendering for your games and apps. Write custom shaders, materials and render pipelines.",details:"Ada ships with a high-level 2D rendering stack for sprites, text, tilemaps, cameras and custom materials. The demos cover sprite animation, transparency, lighting, text rendering, WGSL experiments and stress scenes, while the renderer still leaves room for lower-level control when you need custom shaders or pipeline work. It is designed for Swift-first game code where drawing a scene should feel direct, but not boxed in.",image:"images/icons/ic_duck.png",gif:"images/features/2d-renderer.gif"},{title:"2D Physics",description:"Ada supports Box2D v3 physics with parallel calculations, lightweight memory usage and fast simulation.",details:"The Physics2D plugin integrates Box2D with Ada entities through components such as PhysicsBody2DComponent and Collision2DComponent. Simulation runs on the fixed-update schedule, then syncs transforms back into the scene so gameplay systems can react through the same ECS flow as the rest of the engine. It includes collision events, debug drawing support and world resources for direct access when a game needs deeper physics control.",image:"images/icons/ic_box2d.svg",gif:"images/features/2d-physics.gif"},{title:"Render Graphs",description:"Construct your own render pipeline using powerful render graphs.",details:"Rendering is organized around RenderGraph resources, nodes, slots, subgraphs and an executor that runs the graph each frame. Core 2D and 3D pipelines are assembled as graphs, and cameras can point at specific render subgraphs for flexible composition. Diagnostics can snapshot nodes, edges, subgraphs and frame records, which makes custom pipelines easier to reason about when you add post-processing, offscreen passes or specialized rendering stages.",image:"images/icons/ic_render_graph.svg",gif:"images/features/render-graphs.gif"},{title:"Custom UI Engine",description:"Create your own UI using a SwiftUI-like approach that fits naturally into Ada scenes.",details:"AdaUI brings a SwiftUI-like declarative layer into Ada with views, result builders, environment values, layout containers, gestures, animation, text fields, scroll views and navigation primitives. UI can live naturally beside game scenes, and the engine includes tooling such as a 3D AdaUI debug view for inspecting live UI trees. The goal is to make editor panels, HUDs and in-game interfaces feel native to the same Swift codebase as your gameplay.",code:`struct MainView: View {
    @Environment(\\.scene) var scene

    var body: some View {
        Text("Hello, World!")
    }
}`,gif:"images/features/custom-ui.gif"},{title:"Free and Open Source",description:"Ada is 100% free for you. Licensed by MIT. Learn, modify or use without royalties or runtime fees.",details:"Ada is MIT licensed and developed in the open, with source, tutorials, generated API documentation, demos and build guides available from the repository. You can study the engine internals, modify them for your project, ship without royalties or runtime fees, and contribute fixes, examples or documentation back to the community. The project is still evolving, so the roadmap is visible where the code actually lives.",image:"images/icons/ic_opensource.svg",gif:"images/features/open-source.gif"},{title:"AdaScript",description:"Write gameplay scripts with AdaScript, powered by the Gravity language runtime and integrated with Ada ECS.",details:"AdaScript brings the Gravity scripting runtime into Ada for fast gameplay iteration. Scripts declare their component queries and use capability-scoped access to read or update reflected ECS fields, so scripted systems participate in the same scheduling and access rules as native Swift systems. Keep performance-critical code in Swift and move tuning, behaviours and gameplay logic into reloadable scripts.",gif:"images/features/adascript.gif"},{title:"3D Rendering",description:"Build 3D scenes with cameras, materials, lighting, skyboxes and extensible render pipelines.",details:"Ada’s 3D stack is built around the same render-graph architecture as its core renderer. Compose camera views, materials, meshes, lights, environment settings and skyboxes into a Swift-first scene, then extend the pipeline with your own passes and subgraphs when a project needs custom post-processing or rendering techniques.",gif:"images/features/3d-rendering.gif"},{title:"3D Physics",description:"Simulate rigid bodies, collisions and constraints in 3D with the integrated Box3D physics engine.",details:"Ada includes a Box3D-backed 3D physics path for rigid body simulation, collision queries and joint constraints. It is designed to work alongside Ada entities and transforms, with a dedicated example target for validating 3D physics scenes. Box3D brings a C17 rigid-body simulation core while Ada keeps the scene-facing API in Swift.",gif:"images/features/3d-physics.gif"}];function I(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Cs(e){return/^https?:\/\//.test(e)}function Ms(e){return e.details}function ut(e){return new Intl.DateTimeFormat("en-US",{month:"short",day:"numeric",year:"numeric"}).format(new Date(e))}function B(e){if(/^store(?:-test)?\./.test(window.location.hostname)&&/^\/cloud(\/|$)/.test(e))return new URL(e,window.location.hostname.startsWith("store-test.")?"https://cloud-test.adaengine.org":"https://cloud.adaengine.org").href;const t=/^store(?:-test)?\./.test(window.location.hostname)?"https://adaengine.org":void 0;return t&&!/^\/(cloud|games|legal|store)(\/|$)/.test(e)?new URL(e,t).href:ys(e,Be)}function z(e){const t=Be.endsWith("/")?Be:`${Be}/`,n=e.replace(/^\/+/,"");return`${t}${n}`}function te(e,t,n){let a=document.head.querySelector(`meta[${e}="${t}"]`);a||(a=document.createElement("meta"),a.setAttribute(e,t),document.head.appendChild(a)),a.content=n}function Rs(e,t){var n;(n=document.head.querySelector(`meta[${e}="${t}"]`))==null||n.remove()}function pt(e){const t=dt(e.path);let n=document.head.querySelector('link[rel="canonical"]');n||(n=document.createElement("link"),n.rel="canonical",document.head.appendChild(n)),document.title=e.title,n.href=t,te("name","description",e.description),te("property","og:site_name",Ie),te("property","og:title",e.title),te("property","og:description",e.description),te("property","og:type",e.type),te("property","og:url",t),te("property","og:image",e.image),te("name","twitter:card","summary_large_image"),te("name","twitter:title",e.title),te("name","twitter:description",e.description),te("name","twitter:image",e.image),e.robots?te("name","robots",e.robots):Rs("name","robots");for(const a of document.head.querySelectorAll("script[data-seo-structured-data]"))a.remove();for(const a of _s(e)){const o=document.createElement("script");o.type="application/ld+json",o.dataset.seoStructuredData="true",o.textContent=JSON.stringify(a),document.head.appendChild(o)}}function Ls(e){return e<1e3?String(e):e<1e6?`${(e/1e3).toFixed(e<1e4?1:0)}k`:`${(e/1e6).toFixed(1)}m`}async function Os(){const e=document.querySelector("[data-github-stars]"),t=document.querySelector("[data-github-stars-value]");if(t)try{const n=await fetch(`https://api.github.com/repos/${yn}`,{headers:{Accept:"application/vnd.github+json"}});if(!n.ok)return;const a=await n.json();if(typeof a.stargazers_count!="number")return;const o=Ls(a.stargazers_count);t.textContent=o,e==null||e.setAttribute("aria-label",`${o} GitHub stars`)}catch{}}function X(){const e=fn(window.location.pathname,"/"),t=/^\/store(\/|$)/.test(window.location.pathname)||/^store(?:-test)?\./.test(window.location.hostname)&&window.location.pathname==="/",n=t?"store":e.name==="static-page"?e.page:e.name==="demo"?"demos":e.name,a=[{label:"Home",href:B("/"),active:n==="home"},{label:"Studio",href:B("/studio"),active:n==="studio"},...he.length?[{label:"News",href:B("/blog"),active:n==="blog"}]:[],{label:"Demos",href:B("/demos"),active:n==="demos"},{label:"Learn",href:B("/learn"),active:n==="learn"},{label:"Socials",href:B("/community"),active:n==="community",secondary:!0},{label:"Store",href:t?B("/store"):"https://store.adaengine.org",active:t,secondary:!0},{label:"Cloud",href:B("/cloud"),active:/^\/(cloud|games|legal)(\/|$)/.test(window.location.pathname),secondary:!0},{label:"Donate",href:B("/donate"),active:n==="donate",secondary:!0}];return`
    <header class="header${n==="learn"?" header-learn":""}">
      <section class="container content-restriction header-container">
        <a class="header-logo" href="${B("/")}" aria-label="Ada home">
          <picture class="header-logo-picture">
            <source srcset="${z("images/ae_logo~dark.svg")}" media="(prefers-color-scheme: dark)" />
            <img src="${z("images/ae_logo.svg")}" alt="Ada" />
          </picture>
          <h2>${ks}</h2>
        </a>
        <button class="burger-container" type="button" aria-label="Open menu" aria-expanded="false">
          <span id="burger" aria-hidden="true"><span class="bar topBar"></span><span class="bar bottomBar"></span></span>
        </button>
        <nav aria-label="Main navigation">
          <ul class="navigation">
            ${a.map(r=>`<li class="navigation-item${"secondary"in r&&r.secondary?" navigation-item-secondary":""}"><a class="navigation-item-link${r.active?" is-active":""}"${r.active?' aria-current="page"':""} href="${r.href}">${r.label}</a></li>`).join("")}
            <li class="navigation-item download-button"><a class="navigation-item-link" href="${B("/download")}">Download <span class="download-version" data-download-version>v${se.version}</span></a></li>
          </ul>
        </nav>
      </section>
    </header>
  `}function Ds(){return`
    <section class="hero-section safe-area-insets">
      <div class="hero-copy">
        <p class="hero-eyebrow">Swift Game Engine is here</p>
        <h1 class="ae-header-title">The Open-Source Engine for Swift Developers</h1>
        <p class="hero-subtitle">Build high-performance 2D and 3D games using modern Swift. Clean architecture, native feeling, and developer-first tooling.</p>
        <div class="hero-actions">
          <a class="header-buttons" href="${B("/download")}">Download <span class="download-version" data-download-version>v${se.version}</span></a>
          <a class="header-buttons-github" href="https://github.com/${yn}" aria-label="Ada on GitHub">
            <span class="github-button-label">
              <svg class="github-button-icon" viewBox="0 0 438.549 438.549" aria-hidden="true" focusable="false"><path d="M409.132 114.573c-19.608-33.596-46.205-60.194-79.798-79.8C295.736 15.166 259.057 5.365 219.27 5.365c-39.78 0-76.47 9.804-110.062 29.408-33.596 19.605-60.192 46.204-79.8 79.8C9.803 148.168 0 184.853 0 224.63c0 47.78 13.94 90.745 41.827 128.906 27.884 38.164 63.906 64.572 108.063 79.227 5.14.954 8.945.283 11.42-1.996 2.474-2.282 3.71-5.14 3.71-8.562 0-.57-.05-5.708-.144-15.417-.098-9.71-.144-18.18-.144-25.406l-6.567 1.136c-4.187.767-9.47 1.092-15.846 1-6.375-.09-12.992-.757-19.843-2-6.854-1.23-13.23-4.085-19.13-8.558-5.898-4.473-10.085-10.328-12.56-17.556l-2.855-6.57c-1.903-4.374-4.9-9.233-8.992-14.56-4.093-5.33-8.232-8.944-12.42-10.847l-1.998-1.43c-1.332-.952-2.568-2.1-3.71-3.43-1.143-1.33-1.998-2.663-2.57-3.997-.57-1.335-.097-2.43 1.428-3.29 1.525-.858 4.28-1.275 8.28-1.275l5.708.853c3.807.763 8.516 3.042 14.133 6.85 5.615 3.807 10.23 8.755 13.847 14.843 4.38 7.807 9.657 13.755 15.846 17.848 6.184 4.093 12.42 6.136 18.7 6.136 6.28 0 11.703-.476 16.273-1.423 4.565-.95 8.848-2.382 12.847-4.284 1.713-12.758 6.377-22.56 13.988-29.41-10.847-1.14-20.6-2.857-29.263-5.14-8.658-2.286-17.605-5.996-26.835-11.14-9.235-5.137-16.896-11.516-22.985-19.126-6.09-7.614-11.088-17.61-14.987-29.98-3.9-12.373-5.852-26.647-5.852-42.825 0-23.035 7.52-42.637 22.557-58.817-7.044-17.318-6.38-36.732 1.997-58.24 5.52-1.715 13.706-.428 24.554 3.853 10.85 4.284 18.794 7.953 23.84 10.995 5.046 3.04 9.09 5.618 12.135 7.708 17.706-4.947 35.977-7.42 54.82-7.42s37.116 2.473 54.822 7.42l10.85-6.85c7.418-4.57 16.18-8.757 26.26-12.564 10.09-3.806 17.803-4.854 23.135-3.14 8.562 21.51 9.325 40.923 2.28 58.24 15.035 16.18 22.558 35.788 22.558 58.818 0 16.178-1.958 30.497-5.853 42.966-3.9 12.47-8.94 22.457-15.125 29.98-6.19 7.52-13.9 13.85-23.13 18.985-9.233 5.14-18.183 8.85-26.84 11.135-8.663 2.286-18.416 4.004-29.264 5.146 9.894 8.563 14.842 22.078 14.842 40.54v60.237c0 3.422 1.19 6.28 3.572 8.562 2.38 2.278 6.136 2.95 11.276 1.994 44.163-14.653 80.185-41.062 108.068-79.226 27.88-38.16 41.826-81.126 41.826-128.906-.01-39.77-9.818-76.454-29.414-110.05z"/></svg>
              GitHub
            </span>
            <span class="github-stars" data-github-stars aria-label="Loading GitHub stars">
              <svg class="github-star-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m12 2.6 2.92 5.92 6.53.95-4.72 4.6 1.11 6.5L12 17.5l-5.84 3.07 1.11-6.5-4.72-4.6 6.53-.95L12 2.6z"/></svg>
              <span data-github-stars-value>...</span>
            </span>
          </a>
        </div>
      </div>
      <div class="hero-visual" aria-hidden="true" data-hero-gif-src="${z("images/main/adaengine-hero.gif")}">
        <picture class="ae-logo-header"><source srcset="${z("images/ae_logo~dark.svg")}" media="(prefers-color-scheme: dark)" /><img src="${z("images/ae_logo.svg")}" alt="" /></picture>
        <div class="hero-orbit hero-orbit-one"></div>
        <div class="hero-orbit hero-orbit-two"></div>
      </div>
    </section>
  `}function Ps(e=[]){return e.length?`<ul class="tags">${e.map(t=>`<li>${t}</li>`).join("")}</ul>`:""}function Bs(){return he.length?`
    <section id="latest-news" class="latest-news safe-area-insets">
      <h2 class="section-title">Latest News</h2>
      <div class="home-articles-grid">
        ${he.slice(0,4).map(e=>`
              <article class="home-article-preview">
                <a href="${B(`/articles/${e.slug}`)}">
                  <div class="article-preview-image">
                    <img class="background_image" src="${z(bn)}" alt="${I(e.title)}" />
                    <div class="background_image_overlay"></div>
                    <div class="article-preview-content">
                      <p class="article-date">${ut(e.date)}</p>
                      ${Ps(e.tags)}
                      <h3>${e.title}</h3>
                      <p>${I(e.author.name)}</p>
                    </div>
                  </div>
                </a>
              </article>
            `).join("")}
      </div>
    </section>
  `:""}function wn(e=[]){const t=e[0]??"News";return`<span class="blog-entry-tag blog-entry-tag-${["release","tutorial","engineering","markdown","frontmatter","vite"].find(a=>t.toLowerCase().includes(a))??"default"}">${I(t)}</span>`}function Us(e,t){return e.image??Nt[t%Nt.length]??bn}function Fs(){K.innerHTML=`
    ${X()}
    <main class="page-shell blog-page-shell">
      <section class="container content-restriction blog-page">
        <header class="blog-page-hero">
          <h1>Engine News</h1>
          <p>Updates, release notes, and engineering deep dives from the Ada team.</p>
        </header>
        ${he.length?`<div class="blog-timeline">
                ${he.map((e,t)=>`
                      <article class="blog-entry">
                        <aside class="blog-entry-meta" aria-label="Article metadata">
                          <time datetime="${e.date}">${ut(e.date)}</time>
                          ${wn(e.tags)}
                        </aside>
                        <a class="blog-entry-card" href="${B(`/articles/${e.slug}`)}">
                          <img class="blog-entry-cover" src="${z(Us(e,t))}" alt="" loading="lazy" />
                          <span class="blog-entry-cover-overlay" aria-hidden="true"></span>
                          <span class="blog-entry-content">
                            <h2>${I(e.title)}</h2>
                            <p>${I(e.description)}</p>
                            <span class="blog-entry-action">Read full article →</span>
                          </span>
                        </a>
                      </article>
                    `).join("")}
              </div>`:`<div class="blog-empty">
                <h2>No articles yet</h2>
                <p>Fresh Ada updates will appear here soon.</p>
              </div>`}
      </section>
    </main>
    ${ie()}
  `}function Hs(e){const t=fs(e.demos),n=t.map(a=>`
        <a class="article-toc-link demo-category-link" href="#demo-group-${I(a.tag)}" data-demo-category-link="demo-group-${I(a.tag)}">
          <span>${I(a.title)}</span>
          <small>${a.demos.length}</small>
        </a>
      `).join("");K.innerHTML=`
    ${X()}
    <main class="page-shell demos-page-shell">
      <section class="container content-restriction demos-page">
        <header class="demos-hero">
          <p class="eyebrow">Live WebAssembly examples</p>
          <h1>Ada Demos</h1>
          <p>Explore browser builds generated from the Swift files in the Ada repository. Each demo page includes the embedded build and the source that produced it.</p>
        </header>
        ${t.length?`<div class="demos-browse-layout">
                <aside class="demo-category-nav" aria-label="Demo categories">
                  <div class="article-toc-panel demo-category-panel">
                    <p class="article-toc-title">Categories</p>
                    <nav class="article-toc-list demo-category-list">${n}</nav>
                  </div>
                </aside>
                <div class="demo-groups">
                  ${t.map(a=>`
                        <section class="demo-group" aria-labelledby="demo-group-${I(a.tag)}">
                          <div class="demo-group-heading">
                            <h2 id="demo-group-${I(a.tag)}">${I(a.title)}</h2>
                            <span>${a.demos.length} ${a.demos.length===1?"demo":"demos"}</span>
                          </div>
                          <div class="demo-card-grid">
                            ${a.demos.map(Gs).join("")}
                          </div>
                        </section>
                      `).join("")}
                </div>
              </div>`:`<div class="demo-empty">
                <h2>No demos published yet</h2>
                <p>The website will show demos after the Ada export workflow publishes the first manifest.</p>
              </div>`}
      </section>
    </main>
    ${ie()}
  `}function Gs(e){return`
    <a class="demo-card" href="${B(`/demos/${e.slug}`)}">
      <span class="demo-card-tag">${I(e.tagTitle)}</span>
      <h3>${I(e.title)}</h3>
      <p>${I(e.description)}</p>
      <span class="demo-card-meta">${I(e.sourcePath)}</span>
      ${e.hasBuild?'<span class="demo-card-action">Open demo</span>':'<span class="demo-card-action demo-card-action-muted">Source only</span>'}
    </a>
  `}async function zs(e){const t=await mn(),n=hs(t,e);if(!n){We("Demo not found","Check the address or return to the demos page.");return}pt(Ss(n));const a=await ms(n),o=t.commit??"main",r=`https://github.com/${t.repository}/blob/${o}/${n.sourcePath}`;K.innerHTML=`
    ${X()}
    <main class="page-shell demo-detail-shell">
      <article class="container content-restriction demo-detail-page">
        <header class="demo-detail-hero">
          <a class="article-back-link" href="${B("/demos")}">Back to Demos</a>
          <span class="demo-card-tag">${I(n.tagTitle)}</span>
          <h1>${I(n.title)}</h1>
          <p>${I(n.description)}</p>
          <a class="demo-source-link" href="${r}" target="_blank" rel="noreferrer">${I(n.sourcePath)}</a>
        </header>
        ${n.hasBuild?`<section class="demo-player" aria-label="${I(n.title)} embedded demo">
                <button class="demo-player-fullscreen" type="button" aria-label="Open demo fullscreen" title="Open fullscreen" data-demo-fullscreen>
                  <svg class="demo-player-fullscreen-enter-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M8 3H3v5M16 3h5v5M3 16v5h5M21 16v5h-5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <svg class="demo-player-fullscreen-exit-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M9 3v6H3M15 3v6h6M9 21v-6H3M15 21v-6h6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
                <iframe title="${I(n.title)}" src="${z(n.embed)}" allow="fullscreen; gamepad; keyboard-map; clipboard-read; clipboard-write; webgpu" allowfullscreen webkitallowfullscreen></iframe>
              </section>`:`<section class="demo-player demo-player-empty">
                <h2>Build artifact is not available</h2>
                <p>This demo is listed in the manifest, but the WebAssembly export was not published.</p>
              </section>`}
        <section class="demo-source-section" aria-labelledby="demo-source-title">
          <div class="demo-source-heading">
            <h2 id="demo-source-title">Source</h2>
            <a class="demo-source-github-link" href="${r}" target="_blank" rel="noreferrer">
              <svg class="demo-source-github-icon" viewBox="0 0 438.549 438.549" aria-hidden="true" focusable="false"><path d="M409.132 114.573c-19.608-33.596-46.205-60.194-79.798-79.8C295.736 15.166 259.057 5.365 219.27 5.365c-39.78 0-76.47 9.804-110.062 29.408-33.596 19.605-60.192 46.204-79.8 79.8C9.803 148.168 0 184.853 0 224.63c0 47.78 13.94 90.745 41.827 128.906 27.884 38.164 63.906 64.572 108.063 79.227 5.14.954 8.945.283 11.42-1.996 2.474-2.282 3.71-5.14 3.71-8.562 0-.57-.05-5.708-.144-15.417-.098-9.71-.144-18.18-.144-25.406l-6.567 1.136c-4.187.767-9.47 1.092-15.846 1-6.375-.09-12.992-.757-19.843-2-6.854-1.23-13.23-4.085-19.13-8.558-5.898-4.473-10.085-10.328-12.56-17.556l-2.855-6.57c-1.903-4.374-4.9-9.233-8.992-14.56-4.093-5.33-8.232-8.944-12.42-10.847l-1.998-1.43c-1.332-.952-2.568-2.1-3.71-3.43-1.143-1.33-1.998-2.663-2.57-3.997-.57-1.335-.097-2.43 1.428-3.29 1.525-.858 4.28-1.275 8.28-1.275l5.708.853c3.807.763 8.516 3.042 14.133 6.85 5.615 3.807 10.23 8.755 13.847 14.843 4.38 7.807 9.657 13.755 15.846 17.848 6.184 4.093 12.42 6.136 18.7 6.136 6.28 0 11.703-.476 16.273-1.423 4.565-.95 8.848-2.382 12.847-4.284 1.713-12.758 6.377-22.56 13.988-29.41-10.847-1.14-20.6-2.857-29.263-5.14-8.658-2.286-17.605-5.996-26.835-11.14-9.235-5.137-16.896-11.516-22.985-19.126-6.09-7.614-11.088-17.61-14.987-29.98-3.9-12.373-5.852-26.647-5.852-42.825 0-23.035 7.52-42.637 22.557-58.817-7.044-17.318-6.38-36.732 1.997-58.24 5.52-1.715 13.706-.428 24.554 3.853 10.85 4.284 18.794 7.953 23.84 10.995 5.046 3.04 9.09 5.618 12.135 7.708 17.706-4.947 35.977-7.42 54.82-7.42s37.116 2.473 54.822 7.42l10.85-6.85c7.418-4.57 16.18-8.757 26.26-12.564 10.09-3.806 17.803-4.854 23.135-3.14 8.562 21.51 9.325 40.923 2.28 58.24 15.035 16.18 22.558 35.788 22.558 58.818 0 16.178-1.958 30.497-5.853 42.966-3.9 12.47-8.94 22.457-15.125 29.98-6.19 7.52-13.9 13.85-23.13 18.985-9.233 5.14-18.183 8.85-26.84 11.135-8.663 2.286-18.416 4.004-29.264 5.146 9.894 8.563 14.842 22.078 14.842 40.54v60.237c0 3.422 1.19 6.28 3.572 8.562 2.38 2.278 6.136 2.95 11.276 1.994 44.163-14.653 80.185-41.062 108.068-79.226 27.88-38.16 41.826-81.126 41.826-128.906-.01-39.77-9.818-76.454-29.414-110.05z"/></svg>
              <span>Open on GitHub</span>
              <svg class="demo-source-external-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 17 17 7M9 7h8v8" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </a>
          </div>
          <figure class="article-code-block demo-source-code">
            <figcaption>
              <span>${I(n.sourcePath)}</span>
              <span>Swift</span>
            </figcaption>
            <pre class="code-with-line-numbers"><code class="${ln("swift")}">${qa(a,"swift")}</code></pre>
          </figure>
        </section>
      </article>
    </main>
    ${ie()}
  `}function Ws(){return`
    <section id="features" class="features-container safe-area-insets">
      <div class="section-heading">
        <p class="eyebrow">Capabilities</p>
        <h2 class="section-title">Features</h2>
      </div>
      <div class="features-grid">
        ${[...Ue.slice(-3),...Ue.slice(0,-3)].map((t,n)=>`
              <button class="engine-info-item-container feature-card feature-card-${n+1}" type="button" data-feature-index="${Ue.indexOf(t)}" data-feature-position="${n+1}" aria-haspopup="dialog">
                ${qs(t)}
                <div class="engine-info-item-text">
                  <span class="feature-number">0${n+1}</span>
                  <h3>${t.title}</h3>
                  <p>${t.description}</p>
                </div>
                <span class="feature-card-action">Learn more</span>
              </button>
            `).join("")}
      </div>
    </section>
  `}function qs(e){const t=e.gif?z(e.gif):"";return`
    <div class="engine-info-item-content feature-media-slot" data-feature-preview>
      ${t?`<img class="feature-media-gif" src="${t}" alt="" loading="lazy" decoding="async" />`:""}
      <span class="feature-media-loader" aria-label="Loading animated feature preview">
        <span class="feature-media-spinner" aria-hidden="true"></span>
        <span>Loading preview</span>
      </span>
    </div>
  `}function js(){return`
    <div class="feature-modal" role="dialog" aria-modal="true" aria-labelledby="feature-modal-title" hidden>
      <div class="feature-modal-backdrop" data-modal-close></div>
      <section class="feature-modal-panel">
        <button class="feature-modal-close" type="button" aria-label="Close feature details" title="Close" data-modal-close>
          <span class="feature-modal-close-label">Close</span>
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
          </svg>
        </button>
        <div class="feature-modal-layout">
          <div class="feature-modal-visual" id="feature-modal-visual"></div>
          <div class="feature-modal-copy">
            <p class="eyebrow" id="feature-modal-kicker">Feature</p>
            <h2 id="feature-modal-title"></h2>
            <p id="feature-modal-description"></p>
          </div>
        </div>
      </section>
    </div>
  `}function Vs(){return`
    <nav class="footer-social-links" aria-label="Social links">
      <a class="footer-social-link" href="https://github.com/AdaEngine/AdaEngine" target="_blank" rel="noreferrer" aria-label="Ada on GitHub"><svg viewBox="0 0 438.549 438.549" aria-hidden="true" focusable="false"><path d="M409.132 114.573c-19.608-33.596-46.205-60.194-79.798-79.8C295.736 15.166 259.057 5.365 219.27 5.365c-39.78 0-76.47 9.804-110.062 29.408-33.596 19.605-60.192 46.204-79.8 79.8C9.803 148.168 0 184.853 0 224.63c0 47.78 13.94 90.745 41.827 128.906 27.884 38.164 63.906 64.572 108.063 79.227 5.14.954 8.945.283 11.42-1.996 2.474-2.282 3.71-5.14 3.71-8.562 0-.57-.05-5.708-.144-15.417-.098-9.71-.144-18.18-.144-25.406l-6.567 1.136c-4.187.767-9.47 1.092-15.846 1-6.375-.09-12.992-.757-19.843-2-6.854-1.23-13.23-4.085-19.13-8.558-5.898-4.473-10.085-10.328-12.56-17.556l-2.855-6.57c-1.903-4.374-4.9-9.233-8.992-14.56-4.093-5.33-8.232-8.944-12.42-10.847l-1.998-1.43c-1.332-.952-2.568-2.1-3.71-3.43-1.143-1.33-1.998-2.663-2.57-3.997-.57-1.335-.097-2.43 1.428-3.29 1.525-.858 4.28-1.275 8.28-1.275l5.708.853c3.807.763 8.516 3.042 14.133 6.85 5.615 3.807 10.23 8.755 13.847 14.843 4.38 7.807 9.657 13.755 15.846 17.848 6.184 4.093 12.42 6.136 18.7 6.136 6.28 0 11.703-.476 16.273-1.423 4.565-.95 8.848-2.382 12.847-4.284 1.713-12.758 6.377-22.56 13.988-29.41-10.847-1.14-20.6-2.857-29.263-5.14-8.658-2.286-17.605-5.996-26.835-11.14-9.235-5.137-16.896-11.516-22.985-19.126-6.09-7.614-11.088-17.61-14.987-29.98-3.9-12.373-5.852-26.647-5.852-42.825 0-23.035 7.52-42.637 22.557-58.817-7.044-17.318-6.38-36.732 1.997-58.24 5.52-1.715 13.706-.428 24.554 3.853 10.85 4.284 18.794 7.953 23.84 10.995 5.046 3.04 9.09 5.618 12.135 7.708 17.706-4.947 35.977-7.42 54.82-7.42s37.116 2.473 54.822 7.42l10.85-6.85c7.418-4.57 16.18-8.757 26.26-12.564 10.09-3.806 17.803-4.854 23.135-3.14 8.562 21.51 9.325 40.923 2.28 58.24 15.035 16.18 22.558 35.788 22.558 58.818 0 16.178-1.958 30.497-5.853 42.966-3.9 12.47-8.94 22.457-15.125 29.98-6.19 7.52-13.9 13.85-23.13 18.985-9.233 5.14-18.183 8.85-26.84 11.135-8.663 2.286-18.416 4.004-29.264 5.146 9.894 8.563 14.842 22.078 14.842 40.54v60.237c0 3.422 1.19 6.28 3.572 8.562 2.38 2.278 6.136 2.95 11.276 1.994 44.163-14.653 80.185-41.062 108.068-79.226 27.88-38.16 41.826-81.126 41.826-128.906-.01-39.77-9.818-76.454-29.414-110.05z"/></svg></a>
      <a class="footer-social-link" href="https://discord.gg/JkEPE7nwDu" target="_blank" rel="noreferrer" aria-label="Ada on Discord"><svg viewBox="0 0 127.14 96.36" aria-hidden="true" focusable="false"><path d="M107.7 8.07A105.15 105.15 0 0 0 81.47 0a72.06 72.06 0 0 0-3.36 6.83A97.68 97.68 0 0 0 49 6.83 72.37 72.37 0 0 0 45.64 0a105.89 105.89 0 0 0-26.25 8.09C2.79 32.65-1.71 56.6.54 80.21a105.73 105.73 0 0 0 32.17 16.15 77.7 77.7 0 0 0 6.89-11.11 68.42 68.42 0 0 1-10.85-5.18c.91-.66 1.8-1.34 2.66-2a75.57 75.57 0 0 0 64.32 0c.87.71 1.76 1.39 2.66 2a68.68 68.68 0 0 1-10.87 5.19 77 77 0 0 0 6.89 11.1 105.25 105.25 0 0 0 32.19-16.14c2.64-27.38-4.51-51.11-18.9-72.15ZM42.45 65.69C36.18 65.69 31 60 31 53s5-12.74 11.43-12.74S54 46 53.89 53s-5.05 12.69-11.44 12.69Zm42.24 0C78.41 65.69 73.25 60 73.25 53s5-12.74 11.44-12.74S96.23 46 96.12 53s-5.04 12.69-11.43 12.69Z"/></svg></a>
      <a class="footer-social-link" href="https://x.com/ada_engine" target="_blank" rel="noreferrer" aria-label="Ada on Twitter"><svg viewBox="0 0 512 512" aria-hidden="true" focusable="false"><path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"/></svg></a>
      <a class="footer-social-link" href="https://t.me/adaengine" target="_blank" rel="noreferrer" aria-label="Ada on Telegram"><svg viewBox="0 0 48 48" aria-hidden="true" focusable="false"><path d="M42.2 8.7 35.8 39c-.5 2.1-1.8 2.6-3.6 1.6l-9.9-7.3-4.8 4.6c-.5.5-1 .9-2 .9l.7-10.1L34.6 12c.8-.7-.2-1.1-1.2-.4L10.6 25.9.8 22.8c-2.1-.7-2.2-2.1.4-3.1L39.5 4.9c1.8-.7 3.4.4 2.7 3.8Z"/></svg></a>
    </nav>
  `}function ie(){return`
    <footer class="footer">
      <div class="footer-dot-field" aria-hidden="true"></div>
      <div class="footer-container">
        <div class="footer-columns">
          <section>
            <h3>Ada</h3>
            <a href="${B("/studio")}">Studio</a>
            <a href="${B("/download")}">Download</a>
            <a href="https://github.com/AdaEngine/AdaEngine">Source code<span class="footer-external-mark" aria-hidden="true">↗</span></a>
          </section>
          <section>
            <h3>Project</h3>
            ${he.length?`<a href="${B("/blog")}">Blog</a>`:""}
            <a href="${B("/learn")}">Learn</a>
            <a href="${B("/community")}">Community</a>
          </section>
          <section>
            <h3>Foundation</h3>
            <a href="${B("/donate")}">Donate</a>
            <a href="https://github.com/AdaEngine/AdaEngine/blob/main/LICENSE">License<span class="footer-external-mark" aria-hidden="true">↗</span></a>
          </section>
        </div>
        <div class="footer-bottom">
          <p>© 2021-2026 Vladislav Prusakov and contributors. All rights reserved.</p>
          ${Vs()}
        </div>
        <div class="footer-blueprint-mark" aria-hidden="true">Ada</div>
      </div>
    </footer>
  `}function Ks(e){return e?`
    <span class="learn-card-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">
        ${{book:'<path d="M7 5.5h8.5a2.5 2.5 0 0 1 2.5 2.5v11H9.5A2.5 2.5 0 0 0 7 21.5V5.5Z"/><path d="M7 5.5A2.5 2.5 0 0 1 9.5 3H18v16"/>',play:'<circle cx="12" cy="12" r="9"/><path d="m10.5 8.5 5 3.5-5 3.5v-7Z"/>',layout:'<rect x="4" y="5" width="16" height="14" rx="1.5"/><path d="M9 5v14"/><path d="M4 10h16"/>'}[e]}
      </svg>
    </span>
  `:""}function Zs(){const e=xs.learn;K.innerHTML=`
    ${X()}
    <main class="page-shell learn-page-shell">
      <section class="container content-restriction learn-page">
        <header class="learn-hero">
          <h1>${e.title}</h1>
          <p>${e.lead}</p>
        </header>
        ${$s.map(t=>{const n=t.title.replace(/\W+/g,"-").toLowerCase();return`
              <section class="learn-section" aria-labelledby="${n}">
                <h2 id="${n}">${t.title}</h2>
                <div class="learn-grid">
                  ${t.cards.map(a=>`
                        <a class="learn-card" href="${a.href}">
                          ${Ks(a.icon)}
                          <h3>${a.title}</h3>
                          <p>${a.body}</p>
                        </a>
                      `).join("")}
                </div>
              </section>
            `}).join("")}
      </section>
    </main>
    ${ie()}
  `}function Ys(e){if(e==="learn"){Zs();return}if(e==="community"){Js();return}if(e==="donate"){Xs();return}}function Xs(){K.innerHTML=`
    ${X()}
    <main class="page-shell donation-page-shell">
      <section class="container content-restriction donation-page">
        <header class="donation-hero">
          <h1>Support Ada</h1>
          <p>Ada is an independent open-source project. Your support helps us dedicate more time to development and tooling.</p>
        </header>
        <div class="donation-options" aria-label="Donation options">
          ${Ns.map(e=>`
                <article class="donation-card donation-card-${e.tone}">
                  <span class="donation-card-logo" aria-hidden="true">
                    <img src="${z(e.icon)}" alt="" loading="lazy" />
                  </span>
                  <div class="donation-card-brand">${e.title}</div>
                  <h2>${e.subtitle}</h2>
                  <p>${e.body}</p>
                  <a class="donation-card-action" href="${e.href}" target="_blank" rel="noreferrer">${e.action}</a>
                </article>
              `).join("")}
        </div>
        <section class="donation-contribute" aria-labelledby="donation-contribute-title">
          <h2 id="donation-contribute-title">Code Contributions</h2>
          <p>
            Can't support financially? Code contributions are equally valuable! Check out our
            <a href="https://github.com/AdaEngine/AdaEngine/issues?q=is%3Aissue%20state%3Aopen%20label%3A%22good%20first%20issue%22" target="_blank" rel="noreferrer">good first issues</a>
            on GitHub to get started.
          </p>
        </section>
      </section>
    </main>
    ${ie()}
  `}function Js(){K.innerHTML=`
    ${X()}
    <main class="page-shell community-page-shell">
      <section class="container content-restriction community-page">
        <header class="community-hero">
          <h1>Join the Community</h1>
          <p>Connect with other developers, share your projects, and contribute to the engine.</p>
        </header>
        <div class="community-link-grid" aria-label="Ada community links">
          ${Is.map(e=>`
                <a class="community-link-card" href="${e.href}" target="_blank" rel="noreferrer">
                  <span class="community-link-icon ${e.iconClass??""}">
                    ${e.iconMarkup??`<img src="${z(e.icon??"")}" alt="" width="42" height="42" loading="lazy" />`}
                  </span>
                  <span class="community-link-copy">
                    <strong>${e.title}</strong>
                    <span>${e.subtitle}</span>
                  </span>
                </a>
              `).join("")}
        </div>
      </section>
    </main>
    ${ie()}
  `}function Qs(){K.innerHTML=`
    ${X()}
    <main class="page-shell">
      <div class="container content-restriction">
        ${Ds()}
        
        ${Bs()}
        ${Ws()}
      </div>
    </main>
    ${ie()}
    ${js()}
  `}function ei(e){const t=gs(e);if(!t){We("Article not found","Check the address or return to the blog.");return}pt(As(t)),K.innerHTML=`
    ${X()}
    <main class="page-shell article-page-shell">
      <div class="container article-reading-layout">
        <article class="safe-area-insets article-page">
          <header class="article-hero">
            <a class="article-back-link" href="${B("/blog")}">Back to News</a>
            ${wn(t.tags)}
            <h1>${t.title}</h1>
            <div class="article_info">
              ${ni(t.author)}
              <span aria-hidden="true">•</span>
              <time datetime="${t.date}">${ut(t.date)}</time>
              <span aria-hidden="true">•</span>
              <span>${t.readingTime} min read</span>
            </div>
            <p class="article-item-description">${t.description}</p>
          </header>
          <div class="article-content">${t.html}</div>
        </article>
        ${si(t.toc)}
      </div>
    </main>
    ${ti()}
    ${ie()}
  `}function ti(){return`
    <div class="article-image-lightbox" role="dialog" aria-modal="true" aria-label="Fullscreen article image" hidden data-article-lightbox>
      <button class="article-image-lightbox-backdrop" type="button" aria-label="Close fullscreen image" data-article-lightbox-close></button>
      <figure class="article-image-lightbox-frame">
        <button class="article-image-lightbox-close demo-player-fullscreen" type="button" aria-label="Close fullscreen image" title="Close" data-article-lightbox-close>
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="m6 6 12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"/>
          </svg>
        </button>
        <img src="" alt="" data-article-lightbox-preview />
        <figcaption data-article-lightbox-caption hidden></figcaption>
      </figure>
    </div>
  `}function ni(e){const t=`By ${e.name}`,a=`
    ${e.avatar?`<img class="article-author-avatar" src="${I(ai(e.avatar))}" alt="${I(`${e.name} avatar`)}" loading="lazy" />`:""}
    <span class="article-author-label">${I(t)}</span>
  `;return!e.url||!Cs(e.url)?`<span class="article-author">${a}</span>`:`
    <a class="article-author article-author-link" href="${I(e.url)}" target="_blank" rel="author noreferrer">
      ${a}
      <svg class="article-author-arrow" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        <path d="M5 3.5h7.5V11M12.25 3.75 4 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </a>
  `}function ai(e){return/^(https?:|data:|blob:|\/)/.test(e)||e.startsWith("images/")?z(e):z(`images/${e}`)}function Ct(e,t){return e.map(n=>`
        <a class="article-toc-link article-toc-link-level-${n.level}" href="#${n.id}" data-article-toc-link="${n.id}" data-toc-context="${t}">
          <span>${I(n.title)}</span>
        </a>
      `).join("")}function si(e){var o;if(!e.length)return"";const t=Ct(e,"desktop"),n=Ct(e,"mobile"),a=((o=e[0])==null?void 0:o.title)??"Start";return`
    <aside class="article-toc" aria-label="On this page">
      <div class="article-toc-panel">
        <p class="article-toc-title">On this page</p>
        <div class="article-toc-progress" aria-hidden="true">
          <span data-article-progress-fill></span>
        </div>
        <p class="article-toc-progress-label"><span data-article-progress-label>0%</span> read</p>
        <nav class="article-toc-list">${t}</nav>
      </div>
    </aside>
    <div class="article-mobile-reader-nav" data-mobile-reader-nav>
      <button class="article-mobile-reader-button" type="button" data-mobile-toc-toggle aria-expanded="false" aria-controls="article-mobile-toc-sheet" aria-label="Open article sections">
        <span class="article-mobile-progress" aria-hidden="true">
          <span data-article-progress-fill></span>
        </span>
        <span class="article-mobile-reader-copy">
          <span data-article-progress-label>0%</span>
          <strong data-current-section>${I(a)}</strong>
        </span>
        <span class="article-mobile-reader-action" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>
      <div class="article-mobile-toc-sheet" id="article-mobile-toc-sheet" data-mobile-toc-sheet hidden>
        <div class="article-mobile-toc-header">
          <span>On this page</span>
          <span><span data-article-progress-label>0%</span> read</span>
        </div>
        <nav class="article-mobile-toc-list">${n}</nav>
      </div>
    </div>
  `}function We(e="Page not found",t="This route does not exist yet."){K.innerHTML=`
    ${X()}
    <main class="page-shell">
      <section class="container content-restriction safe-area-insets status-page">
        <h1>${e}</h1>
        <p>${t}</p>
        <a class="header-buttons" href="${B("/")}">Home</a>
      </section>
    </main>
    ${ie()}
  `}function ii(){const e=document.querySelector(".article-content"),t=document.querySelector("[data-mobile-reader-nav]"),n=document.querySelector("[data-mobile-toc-toggle]"),a=document.querySelector("[data-mobile-toc-sheet]"),o=Array.from(document.querySelectorAll(".article-content h2[id], .article-content h3[id]")),r=Array.from(document.querySelectorAll("[data-article-toc-link]")),s=Array.from(document.querySelectorAll("[data-article-progress-fill]")),i=Array.from(document.querySelectorAll("[data-article-progress-label]")),c=Array.from(document.querySelectorAll("[data-current-section]"));if(!e||!o.length||!r.length)return;let l,d;const p=v=>{if(!(!n||!a||!t)){if(window.clearTimeout(l),n.setAttribute("aria-expanded",String(v)),v){a.hidden=!1,t.classList.remove("is-closing"),t.classList.add("is-open");return}t.classList.remove("is-open"),t.classList.add("is-closing"),l=window.setTimeout(()=>{a.hidden=!0,t.classList.remove("is-closing")},520)}},b=v=>{const S=document.getElementById(v);S&&(S.scrollIntoView({behavior:"smooth",block:"start"}),p(!1))},y=v=>{const S=v.closest(".article-toc-list, .article-mobile-toc-list");if(!S)return;const _=S.getBoundingClientRect(),T=v.getBoundingClientRect(),$=16,U=T.top<_.top+$,C=T.bottom>_.bottom-$;if(!U&&!C)return;const L=U?T.top-_.top-$:T.bottom-_.bottom+$;S.scrollTo({top:S.scrollTop+L,behavior:"smooth"})};r.forEach(v=>{v.addEventListener("click",S=>{const _=v.dataset.articleTocLink;_&&(S.preventDefault(),history.replaceState(null,"",`${window.location.pathname}${window.location.search}#${_}`),b(_))})}),n==null||n.addEventListener("click",()=>{const v=n.getAttribute("aria-expanded")==="true";p(!v)}),document.addEventListener("keydown",v=>{v.key==="Escape"&&p(!1)}),document.addEventListener("click",v=>{!t||!v.target||t.contains(v.target)||p(!1)});const w=()=>{var H;const v=window.scrollY+Math.min(180,window.innerHeight*.28),S=o.slice().reverse().find(O=>O.getBoundingClientRect().top+window.scrollY<=v)??o[0],_=S.id,T=e.offsetTop,$=e.offsetTop+e.scrollHeight-window.innerHeight,U=$<=T?1:Math.min(1,Math.max(0,(window.scrollY-T)/($-T))),C=`${Math.round(U*100)}%`,L=((H=S.textContent)==null?void 0:H.trim())||"Start",J=_!==d;d=_,s.forEach(O=>{O.style.transform=`scaleX(${U})`}),i.forEach(O=>{O.textContent=C}),c.forEach(O=>{O.textContent=L}),r.forEach(O=>{const Z=O.dataset.articleTocLink===_;O.classList.toggle("is-active",Z),O.setAttribute("aria-current",Z?"true":"false"),Z&&J&&y(O)})};window.addEventListener("scroll",w,{passive:!0}),window.addEventListener("resize",w),w()}function oi(){const e=Array.from(document.querySelectorAll("[data-demo-category-link]")),t=e.map(r=>{var s;return(s=document.getElementById(r.dataset.demoCategoryLink??""))==null?void 0:s.closest(".demo-group")}).filter(r=>!!r);if(!e.length||!t.length)return;let n;const a=r=>{const s=r.closest(".demo-category-list");if(!s||s.scrollWidth<=s.clientWidth)return;const i=s.getBoundingClientRect(),c=r.getBoundingClientRect(),l=12,d=c.left<i.left+l,p=c.right>i.right-l;if(!d&&!p)return;const b=d?c.left-i.left-l:c.right-i.right+l;s.scrollTo({left:s.scrollLeft+b,behavior:"smooth"})},o=()=>{var l;const r=window.scrollY+Math.min(180,window.innerHeight*.28),i=(l=(t.slice().reverse().find(d=>d.getBoundingClientRect().top+window.scrollY<=r)??t[0]).querySelector("h2[id]"))==null?void 0:l.id,c=i!==n;n=i,e.forEach(d=>{const p=d.dataset.demoCategoryLink===i;d.classList.toggle("is-active",p),p?d.setAttribute("aria-current","location"):d.removeAttribute("aria-current"),p&&c&&a(d)})};e.forEach(r=>{r.addEventListener("click",s=>{const i=r.dataset.demoCategoryLink,c=i?document.getElementById(i):null;!c||!i||(s.preventDefault(),history.replaceState(null,"",`${window.location.pathname}${window.location.search}#${i}`),c.scrollIntoView({behavior:"smooth",block:"start"}))})}),window.addEventListener("scroll",o,{passive:!0}),window.addEventListener("resize",o),o()}function vn(e){return[{id:"macos",title:"Mac",description:"The native editor for your Mac. Build with AdaScript and Swift."},{id:"windows",title:"Windows",description:"Create Ada games on your Windows PC."},{id:"linux",title:"Linux",description:"Build with the open-source engine on Linux."}].map(({id:n,title:a,description:o})=>{const r=Rt(n,e);return`<article class="platform-download" aria-labelledby="download-${n}">
      <span class="platform-symbol platform-symbol-image" aria-hidden="true" style="--platform-icon: url('${z(`images/downloads/${n}.svg`)}')"></span>
      <h2 id="download-${n}">${a}</h2><p>${o}</p>
      <div class="platform-download-actions">${r.length?r.map(s=>`<a class="header-buttons" href="${I(s.url)}">${kn(s)}</a>`).join(""):`<span class="download-status">Installer coming soon</span><a class="download-source-link" href="${I(e.url)}">Get the source code ↗</a>`}</div>
    </article>`}).join("")+`<article class="platform-download platform-download-ios" aria-labelledby="download-ios">
    <span class="platform-symbol" aria-hidden="true">▯</span>
    <h2 id="download-ios">iOS</h2><p>Create and run AdaScript projects on iPad.</p>
    <div class="platform-download-actions"><a class="app-store-badge" href="${at}" aria-label="Download on the App Store"><img src="${z("images/downloads/app-store.svg")}" alt="Download on the App Store" width="120" height="40" /></a></div>
  </article>`}function ri(){K.innerHTML=`${X()}
    <main class="page-shell download-page-shell"><section class="container content-restriction download-page">
      <header class="download-hero"><p class="hero-eyebrow">Make something of your own</p>
        <h1>Download Ada</h1><p>Choose your platform. Start building.</p>
        <a class="download-release" data-release-link href="${se.url}">Release notes · <span data-download-version>v${se.version}</span> ↗</a>
      </header>
      <div class="download-grid" data-download-cards>${vn(se)}</div>
      <p class="download-footnote">Ada is free and open source. Desktop downloads appear here as installers are released.</p>
    </section></main>${ie()}`}async function ci(){const e=await $n();document.querySelectorAll("[data-download-version]").forEach(n=>{n.textContent=`v${e.version}`}),document.querySelectorAll("[data-release-link]").forEach(n=>{n.href=e.url});const t=document.querySelector("[data-download-cards]");t&&(t.innerHTML=vn(e))}async function li(){if(K.classList.remove("store-app"),/^\/store(\/|$)/.test(window.location.pathname)||(window.location.hostname.startsWith("store.")||window.location.hostname.startsWith("store-test."))&&window.location.pathname==="/"){const{renderStore:t}=await mt(async()=>{const{renderStore:n}=await import("./store-BVbJnx0R.js");return{renderStore:n}},__vite__mapDeps([0,1]));await t(K,X,st);return}if(/^\/(cloud|games|legal)(\/|$)/.test(window.location.pathname)){const{renderCloud:t}=await mt(async()=>{const{renderCloud:n}=await import("./cloud-CvdvMZdn.js");return{renderCloud:n}},__vite__mapDeps([2,3]));await t(K,X,st);return}const e=fn(window.location.pathname,"/");if(pt(Es(e)),e.name==="studio"){K.innerHTML=`${X()}${In(B,z)}${ie()}`;return}if(e.name==="download"){ri();return}if(e.name==="home"){Qs();return}if(e.name==="blog"){Fs();return}if(e.name==="demos"){Hs(await mn());return}if(e.name==="demo"){await zs(e.slug);return}if(e.name==="static-page"){Ys(e.page);return}if(e.name==="article"){ei(e.slug);return}We()}function st(){const e=document.querySelector(".header"),t=document.querySelector(".burger-container");if(!e||e.dataset.navigationReady==="true")return;e.dataset.navigationReady="true";let n,a;const o=r=>{if(!(!e||!t)){if(window.clearTimeout(n),window.clearTimeout(a),e.classList.toggle("menu-opened",r),document.body.classList.toggle("menu-opened",r),t.setAttribute("aria-expanded",String(r)),t.setAttribute("aria-label",r?"Close menu":"Open menu"),r){e.classList.remove("menu-closing"),e.classList.add("menu-opening"),n=window.setTimeout(()=>{e.classList.remove("menu-opening")},620);return}e.classList.remove("menu-opening"),e.classList.add("menu-closing"),a=window.setTimeout(()=>{e.classList.remove("menu-closing")},760)}};t==null||t.addEventListener("click",()=>{o(!(e!=null&&e.classList.contains("menu-opened")))}),document.querySelectorAll(".navigation-item-link").forEach(r=>{r.addEventListener("click",()=>{o(!1)})})}function di(){st(),Mt();const e=document.querySelector(".feature-modal"),t=document.querySelector("#feature-modal-title"),n=document.querySelector("#feature-modal-description"),a=document.querySelector("#feature-modal-kicker"),o=document.querySelector("#feature-modal-visual"),r=()=>{e&&(e.hidden=!0,document.body.classList.remove("modal-opened"))};document.querySelectorAll("[data-feature-index]").forEach(s=>{s.addEventListener("click",()=>{const i=Number(s.dataset.featureIndex),c=Ue[i];!c||!e||!t||!n||!a||!o||(t.textContent=c.title,n.textContent=Ms(c),a.textContent=`Feature ${String(Number(s.dataset.featurePosition)||i+1).padStart(2,"0")}`,e.hidden=!1,document.body.classList.add("modal-opened"),o.innerHTML=pi(c),Mt())})}),document.querySelectorAll("[data-modal-close]").forEach(s=>s.addEventListener("click",r)),document.addEventListener("keydown",s=>{s.key==="Escape"&&r()}),fi(),ui(),mi(),hi(),oi(),ii(),gi()}function Mt(){document.querySelectorAll("[data-feature-preview]:not([data-preview-listeners-ready])").forEach(e=>{const t=e.querySelector(".feature-media-gif");if(!t)return;e.dataset.previewListenersReady="true";const n=()=>e.classList.add("is-loaded");t.addEventListener("load",n,{once:!0}),t.addEventListener("error",()=>e.classList.add("has-load-error"),{once:!0}),t.complete&&t.naturalWidth>0&&n()})}function ui(){const e=document.querySelector("[data-hero-gif-src]"),t=e==null?void 0:e.dataset.heroGifSrc;if(!e||!t)return;const n=new Image;n.onload=()=>{var i;n.className="hero-gif",n.alt="",n.decoding="async",(i=e.querySelector(".ae-logo-header"))==null||i.replaceWith(n);const a=document.createElement("canvas");a.width=1,a.height=1;const o=a.getContext("2d",{willReadFrequently:!0});if(!o)return;let r={red:34,green:148,blue:255};const s=()=>{try{o.clearRect(0,0,1,1),o.drawImage(n,0,0,1,1);const[c,l,d,p]=o.getImageData(0,0,1,1).data;p>0&&c+l+d>8&&(r={red:Math.round(r.red*.7+c*.3),green:Math.round(r.green*.7+l*.3),blue:Math.round(r.blue*.7+d*.3)},e.style.setProperty("--hero-ambient",`${r.red} ${r.green} ${r.blue}`),e.classList.add("has-ambient-light"))}catch{}window.setTimeout(s,600)};s()},n.src=t}function pi(e){const t=e.gif?z(e.gif):"";return`
    <div class="feature-modal-media feature-media-slot" data-feature-preview>
      ${t?`<img class="feature-media-gif" src="${t}" alt="" decoding="async" />`:""}
      <span class="feature-media-loader" aria-label="Loading animated feature preview">
        <span class="feature-media-spinner" aria-hidden="true"></span>
        <span>Loading preview</span>
      </span>
    </div>
  `}function gi(){const e=document.querySelector("[data-article-lightbox]"),t=e==null?void 0:e.querySelector("[data-article-lightbox-preview]"),n=e==null?void 0:e.querySelector("[data-article-lightbox-caption]"),a=e==null?void 0:e.querySelector(".article-image-lightbox-close");let o=null;if(!e||!t||!n)return;const r=()=>{e.hidden=!0,t.removeAttribute("src"),document.body.classList.remove("article-lightbox-open"),o instanceof HTMLElement&&o.focus()},s=i=>{var d,p;const c=i.closest("figure"),l=((p=(d=c==null?void 0:c.querySelector("figcaption"))==null?void 0:d.textContent)==null?void 0:p.trim())??"";o=document.activeElement,t.src=i.currentSrc||i.src,t.alt=i.alt,n.textContent=l,n.hidden=!l,e.hidden=!1,document.body.classList.add("article-lightbox-open"),a==null||a.focus()};document.querySelectorAll("[data-article-lightbox-image]").forEach(i=>{i.addEventListener("click",()=>s(i)),i.addEventListener("keydown",c=>{c.key!=="Enter"&&c.key!==" "||(c.preventDefault(),s(i))})}),e.querySelectorAll("[data-article-lightbox-close]").forEach(i=>{i.addEventListener("click",r)}),document.addEventListener("keydown",i=>{i.key==="Escape"&&!e.hidden&&r()})}function mi(){const e=document.querySelector(".demo-player:not(.demo-player-empty)"),t=e==null?void 0:e.querySelector("[data-demo-fullscreen]");if(!e||!t)return;const n=document,a=e,o=document.fullscreenEnabled||n.webkitFullscreenEnabled||typeof e.requestFullscreen=="function"||typeof a.webkitRequestFullscreen=="function",r=()=>document.fullscreenElement??n.webkitFullscreenElement??null,s=()=>r()===e;let i=!1;const c=()=>{i=!0,e.classList.add("is-viewport-fullscreen"),document.body.classList.add("demo-viewport-fullscreen-open"),y()},l=()=>{i=!1,e.classList.remove("is-viewport-fullscreen"),document.body.classList.remove("demo-viewport-fullscreen-open"),y()},d=async()=>o?typeof e.requestFullscreen=="function"?(await e.requestFullscreen(),!0):typeof a.webkitRequestFullscreen=="function"?(await a.webkitRequestFullscreen(),!0):!1:!1,p=async()=>{try{if(await d())return}catch(w){console.warn("Native fullscreen is unavailable, using viewport fullscreen fallback",w)}c()},b=async()=>{var w;if(i){l();return}if(typeof document.exitFullscreen=="function"){await document.exitFullscreen();return}await((w=n.webkitExitFullscreen)==null?void 0:w.call(n))},y=()=>{const w=s()||i;e.classList.toggle("is-fullscreen",w),t.setAttribute("aria-label",w?"Exit demo fullscreen":"Open demo fullscreen"),t.title=w?"Exit fullscreen":"Open fullscreen"};t.addEventListener("click",async()=>{try{if(s()||i){await b();return}await p()}catch(w){console.error("Failed to toggle demo fullscreen",w)}}),document.addEventListener("fullscreenchange",y),document.addEventListener("webkitfullscreenchange",y),document.addEventListener("keydown",w=>{w.key==="Escape"&&i&&l()}),y()}function hi(){const e=document.querySelector(".demo-player:not(.demo-player-empty)"),t=e==null?void 0:e.querySelector("iframe");if(!e||!t)return;const n=document.createElement("canvas");n.width=1,n.height=1;const a=n.getContext("2d",{willReadFrequently:!0});if(!a)return;let o=0,r=0,s={red:34,green:211,blue:238};const i=(d,p,b)=>{s={red:Math.round(s.red*.7+d*.3),green:Math.round(s.green*.7+p*.3),blue:Math.round(s.blue*.7+b*.3)},e.style.setProperty("--demo-ambient",`${s.red} ${s.green} ${s.blue}`),e.classList.add("has-ambient-light")},c=d=>{if(d.origin!==window.location.origin)return;const p=d.data;if(!p||typeof p!="object"||p.type!=="ada-demo-ambient"||!Array.isArray(p.color)||p.color.length<3)return;const[b,y,w]=p.color.map(Number);[b,y,w].every(Number.isFinite)&&i(b,y,w)},l=()=>{var d;try{const p=(d=t.contentDocument)==null?void 0:d.querySelector("canvas");if(!p||p.width<=0||p.height<=0){r+=1,o=window.setTimeout(l,r<120?250:1e3);return}const b=Math.max(0,Math.floor(p.width*.5)),y=Math.max(0,Math.floor(p.height*.42));a.clearRect(0,0,1,1),a.drawImage(p,b,y,1,1,0,0,1,1);const[w,v,S,_]=a.getImageData(0,0,1,1).data;_>0&&w+v+S>8&&i(w,v,S),r=0,o=window.setTimeout(l,450)}catch{r+=1,o=window.setTimeout(l,r<12?450:1200)}};t.addEventListener("load",()=>{window.clearTimeout(o),r=0,o=window.setTimeout(l,500)}),window.addEventListener("message",c),o=window.setTimeout(l,500)}function fi(){const e=document.querySelector(".showcase-carousel"),t=Array.from(document.querySelectorAll(".showcase-slide")),n=Array.from(document.querySelectorAll(".showcase-carousel-dot"));if(!e||t.length<2)return;let a=0,o;const r=i=>{a=(i+t.length)%t.length,t.forEach((c,l)=>{const d=l===a;c.classList.toggle("is-active",d),c.setAttribute("aria-hidden",String(!d)),c.querySelectorAll("a").forEach(p=>{p.tabIndex=d?0:-1})}),n.forEach((c,l)=>{c.classList.toggle("is-active",l===a),c.setAttribute("aria-current",l===a?"true":"false")})},s=()=>{window.clearInterval(o),o=window.setInterval(()=>{r(a+1)},5e3)};n.forEach((i,c)=>{i.addEventListener("click",()=>{r(c),s()})}),e.addEventListener("mouseenter",()=>window.clearInterval(o)),e.addEventListener("mouseleave",s),e.addEventListener("focusin",()=>window.clearInterval(o)),e.addEventListener("focusout",s),r(0),s()}li().catch(e=>{console.error(e),We("Page failed to load","Refresh the page or try again in a moment.")}).then(()=>{try{di()}catch(e){console.error("Failed to initialize page interactions",e)}Os(),ci()});
