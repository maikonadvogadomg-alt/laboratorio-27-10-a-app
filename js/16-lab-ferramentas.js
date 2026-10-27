/* =========================================================================
   LABORATÓRIO — 16-lab-ferramentas.js · 🧰 SUAS FERRAMENTAS NUM LUGAR SÓ
   Cada ferramenta abre aqui dentro (e continua guardando os dados dela).
   Versão em módulos: os arquivos ficam em ferramentas/ e kits/.
   Versão de arquivo único: vão embutidos (window.LAB_EMBUTIDO).
   ========================================================================= */
window.LabFerramentas = (function () {
  'use strict';
  const $ = (s) => document.querySelector(s);
  const E = (s) => Lab.esc(s);
  const FERR = [
    { id: 'faxina', icone: '🧹', nome: 'Faxina de Repetidos', arq: 'faxina.html', desc: 'Tira arquivos repetidos de zips e pastas, dá nome pelo título e separa por tipo.' },
    { id: 'arrumador', icone: '🗃', nome: 'Arrumador de Backups', arq: 'arrumador.html', desc: 'Junta backups (Jurídico, Colador, memórias do Mini SK), separa por projeto/data e exporta para o Mini SK.' },
    { id: 'numerador', icone: '🔢', nome: 'Numerador de Códigos', arq: 'numerador.html', desc: 'Junta muitos HTML, tira repetidos e parecidos, e baixa numerados (1.html, 2.html…) com índice.' },
    { id: 'preparador', icone: '🧰', nome: 'Preparador Universal', arq: 'preparador.html', desc: 'Prepara qualquer projeto (até monorepo do Replit) para .exe, APK e Netlify, com a chance de funcionar.' },
    { id: 'colador', icone: '🔗', nome: 'Colador de Links', arq: 'colador.html', desc: 'Guarda e abre os links das suas versões, com dois visores e exportar em MD.' },
  ];
  // os códigos que você trouxe (feitos pelo Claude antigo) — do jeito que vieram
  const SEUS = [
    { id: 'aistudio', icone: '🤖', nome: 'AI Code Studio', arq: 'ai-code-studio.html', desc: 'Chat com várias IAs (Gemini e outras), memória e editor de código. Coloque a sua chave nele.' },
    { id: 'projetolab', icone: '🧪', nome: 'Projeto Lab', arq: 'projeto-lab.html', desc: 'O laboratório antigo do Claude.' },
    { id: 'replicador', icone: '🧬', nome: 'Replicador de Projeto', arq: 'replicador.html', desc: 'Replica a estrutura de um projeto.' },
    { id: 'iara', icone: '🌊', nome: 'Iara Suite', arq: 'iara-suite.html', desc: 'Code Editor · APK Builder · Site Extractor.' },
    { id: 'juntador', icone: '🧷', nome: 'Juntador de Arquivos', arq: 'juntador.html', desc: 'Junta arquivos.' },
  ];
  const KITS = [
    { icone: '📦', nome: 'Kit do Replit', arq: 'kit-replit.cjs', desc: 'Roda dentro do Replit: relatório, pacote limpo, build. Shell: node kit-replit.cjs 5' },
    { icone: '🟢', nome: 'Servidorzinho', arq: 'servir.py', desc: 'Abre qualquer app montado como o Replit abre. PC ou Termux: python servir.py' },
    { icone: '📱', nome: 'Organizador do Celular', arq: 'organizar.py', desc: 'Termux: acha repetidos no celular inteiro; só apaga quando você escreve APAGAR.' },
    { icone: '🧩', nome: 'Juntar', arq: 'juntar.py', desc: 'Transforma um projeto em pedaços (index + css + js) num HTML único.' },
  ];
  let aberta = '';

  function bytes(arq) {
    const b64 = window.LAB_EMBUTIDO && window.LAB_EMBUTIDO[arq];
    if (!b64) return null;
    const bin = atob(b64); const u = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i += 1) u[i] = bin.charCodeAt(i);
    return u;
  }

  function tela() {
    const el = $('#panel-ferramentas'); if (!el) return;
    if (aberta) { abrirAqui(aberta); return; }
    el.innerHTML = `
      <div class="lab-topo"><h2>🧰 Ferramentas</h2>
        <p class="lab-mut">As suas ferramentas, todas aqui dentro. Cada uma guarda os próprios dados.</p></div>
      <div class="ferr-grade">${FERR.map(cartao).join('')}</div>
      <h3 class="lab-h3 ferr-grupo">📂 Seus códigos (do Claude antigo, do jeito que vieram)</h3>
      <div class="ferr-grade">${SEUS.map(cartao).join('')}</div>
      <h3 class="lab-h3">🧳 Kits para baixar (rodam fora do navegador)</h3>
      <div class="ferr-kits">${KITS.map((k) => `<div class="ferr-kit"><span class="ferr-ic">${k.icone}</span><div><b>${E(k.nome)}</b> <code>${E(k.arq)}</code><br><small class="lab-mut">${E(k.desc)}</small></div><button class="btn btn-secondary" onclick="LabFerramentas.kit('${k.arq}')">⬇ Baixar</button></div>`).join('')}</div>`;
  }

  const cartao = (f) => `<button class="ferr-card" onclick="LabFerramentas.abrir('${f.id}')"><span class="ferr-ic">${f.icone}</span><b>${E(f.nome)}</b><small>${E(f.desc)}</small></button>`;
  const achar = (id) => FERR.concat(SEUS).find((x) => x.id === id);
  function abrirAqui(id) {
    const f = achar(id); if (!f) return;
    aberta = id;
    const el = $('#panel-ferramentas');
    el.innerHTML = `<div class="lab-linha ferr-barra"><button class="btn btn-secondary" onclick="LabFerramentas.voltar()">← Ferramentas</button><b>${f.icone} ${E(f.nome)}</b><button class="lab-chip" style="margin-left:auto" onclick="LabFerramentas.telaPropria('${f.id}')">↗ Tela própria</button></div>
      <iframe id="ferr-quadro" class="ferr-quadro" title="${E(f.nome)}" allow="web-share; clipboard-read; clipboard-write"></iframe>`;
    // 🔗 a barra que liga a ferramenta ao Laboratório e às outras ferramentas
    el.insertAdjacentHTML('beforeend', `<div class="ferr-ponte">
        <div class="lab-linha"><b>📥 Entregar à ferramenta:</b><select id="ferr-entrada" class="lab-busca" style="flex:1;min-width:160px"></select><button class="btn btn-primary" id="ferr-entregar">Entregar</button></div>
        <div id="ferr-saidas"></div><div id="ferr-ponte-st" class="lab-mut"></div></div>`);
    $('#ferr-entregar').onclick = () => entregar($('#ferr-entrada').value).catch((e) => pst('⚠ ' + e.message));
    pintarEntradas(); pintarSaidas();
    const q = $('#ferr-quadro');
    q.onload = () => ligar(q);
    const b = bytes(f.arq);
    if (b) q.srcdoc = new TextDecoder().decode(b); else q.src = 'ferramentas/' + f.arq;
  }

  // ── 🔗 ponte entre as ferramentas ──
  // Dentro de cada ferramenta entra um pedacinho que: (1) em vez de só baixar, manda o arquivo gerado para cá;
  // (2) recebe arquivos daqui e coloca no "escolher arquivo" dela, como se você tivesse escolhido.
  let saidas = [], pendente = null;
  const pst = (t) => { const e = $('#ferr-ponte-st'); if (e) e.textContent = t; };
  const PONTE_FERR = '(' + function () {
    if (window.__labPonte) return; window.__labPonte = 1;
    var P = window.parent;
    function b64(buf) { var u = new Uint8Array(buf), s = ''; for (var i = 0; i < u.length; i += 0x8000) s += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000)); return btoa(s); }
    function mandar(href, nome) {
      fetch(href).then(function (r) { return r.blob(); }).then(function (bl) { return bl.arrayBuffer().then(function (ab) { P.postMessage({ labFerr: 'saida', nome: nome || 'arquivo', tipo: bl.type || 'application/octet-stream', b64: b64(ab) }, '*'); }); })
        .catch(function (e) { P.postMessage({ labFerr: 'aviso', texto: 'Não consegui pegar o arquivo: ' + e.message }, '*'); });
    }
    function eDownload(a) { return a && a.tagName === 'A' && a.hasAttribute('download') && /^(blob:|data:)/.test(a.href || ''); }
    var clicar = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function () { if (eDownload(this)) { mandar(this.href, this.getAttribute('download')); this.__labVisto = 1; var r = window.__labSoEntregar ? undefined : clicar.call(this); this.__labVisto = 0; return r; } return clicar.call(this); };
    document.addEventListener('click', function (e) { var a = e.target.closest && e.target.closest('a[download]'); if (eDownload(a) && !a.__labVisto) mandar(a.href, a.getAttribute('download')); }, true);
    window.addEventListener('message', function (e) {
      var d = e.data; if (!d || d.labFerr !== 'entrada') return;
      var arqs = d.arquivos.map(function (x) { var bin = atob(x.b64), u = new Uint8Array(bin.length); for (var i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return new File([u], x.nome, { type: x.tipo || '' }); });
      var ins = Array.prototype.slice.call(document.querySelectorAll('input[type=file]'));
      var tipo = arqs[0] && arqs[0].name.split('.').pop().toLowerCase();
      var alvo = ins.filter(function (i) { var ac = (i.accept || '').toLowerCase(); return !ac || ac.indexOf('.' + tipo) >= 0 || ac.indexOf('*') >= 0 || (tipo === 'zip' && ac.indexOf('zip') >= 0) || (/html?/.test(tipo) && ac.indexOf('html') >= 0); })[0] || ins[0];
      if (!alvo) { P.postMessage({ labFerr: 'aviso', texto: 'Esta ferramenta não tem botão de abrir arquivo. Use o ↗ Tela própria e abra o arquivo por lá.' }, '*'); return; }
      var vai = alvo.multiple ? arqs : arqs.slice(0, 1); var dt = new DataTransfer(); vai.forEach(function (f) { dt.items.add(f); });
      alvo.files = dt.files; alvo.dispatchEvent(new Event('input', { bubbles: true })); alvo.dispatchEvent(new Event('change', { bubbles: true }));
      P.postMessage({ labFerr: 'aviso', texto: '✅ Entreguei ' + vai.length + ' arquivo(s) à ferramenta: ' + vai.map(function (f) { return f.name; }).join(', ') }, '*');
    });
    P.postMessage({ labFerr: 'pronta' }, '*');
  } + ')();';
  function ligar(q) {
    try { const d = q.contentDocument; if (!d) return; const sc = d.createElement('script'); sc.textContent = PONTE_FERR; (d.head || d.documentElement).appendChild(sc); }
    catch (e) { pst('A ponte não entrou nesta ferramenta (' + e.message + '). Ela funciona normal, só sem ligar com as outras.'); }
  }
  window.addEventListener('message', (e) => {
    const d = e.data; if (!d || !d.labFerr) return;
    if (d.labFerr === 'pronta' && pendente) { const p = pendente; pendente = null; setTimeout(() => entregarArquivos(p), 300); }
    if (d.labFerr === 'aviso') { pst(d.texto); Lab.aviso(d.texto, /✅/.test(d.texto) ? 'success' : 'warning'); }
    if (d.labFerr === 'saida') { saidas.unshift({ nome: d.nome, tipo: d.tipo, b64: d.b64, de: aberta, quando: new Date().toLocaleTimeString('pt-BR') }); saidas = saidas.slice(0, 12); pintarSaidas(); pintarEntradas(); }
  });
  function pintarEntradas() {
    const sel = $('#ferr-entrada'); if (!sel) return;
    const lista = Lab.lista ? Lab.lista() : [];
    sel.innerHTML = (lista.length ? '<option value="projeto">📦 O projeto do Laboratório inteiro (.zip)</option>' : '<option value="">(importe um projeto no 📦 Importar)</option>') +
      saidas.map((x, i) => '<option value="saida:' + i + '">🔁 ' + E(x.nome) + ' (feito pelo ' + E((achar(x.de) || {}).nome || x.de) + ')</option>').join('') +
      lista.slice(0, 300).map((p) => '<option value="arq:' + E(p) + '">📄 ' + E(p) + '</option>').join('');
  }
  function pintarSaidas() {
    const el = $('#ferr-saidas'); if (!el) return;
    if (!saidas.length) { el.innerHTML = '<p class="lab-mut" style="margin:4px 0">Quando a ferramenta gerar um arquivo (baixar), ele aparece aqui para você mandar para outra ferramenta ou pôr no projeto.</p>'; return; }
    const outras = FERR.concat(SEUS);
    el.innerHTML = '<b>📤 Arquivos que as ferramentas geraram:</b>' + saidas.map((x, i) => '<div class="lab-linha" style="margin:4px 0"><span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis">📄 ' + E(x.nome) + ' <small class="lab-mut">· ' + E((achar(x.de) || {}).icone || '') + ' ' + x.quando + '</small></span>' +
      '<button class="btn btn-secondary" data-s="baixar" data-i="' + i + '">⬇</button><button class="btn btn-secondary" data-s="projeto" data-i="' + i + '" title="Pôr no projeto do Laboratório">➕ Projeto</button>' +
      '<select class="lab-busca" data-s="para" data-i="' + i + '"><option value="">➡ Mandar para…</option>' + outras.filter((f) => f.id !== aberta).map((f) => '<option value="' + f.id + '">' + f.icone + ' ' + E(f.nome) + '</option>').join('') + '</select></div>').join('');
    el.onclick = (e) => { const b = e.target.closest('button[data-s]'); if (!b) return; const x = saidas[+b.dataset.i];
      if (b.dataset.s === 'baixar') Lab.baixar(blobDe(x), x.nome);
      if (b.dataset.s === 'projeto') noProjeto(x); };
    el.onchange = (e) => { const s = e.target.closest('select[data-s="para"]'); if (!s || !s.value) return; const x = saidas[+s.dataset.i]; pendente = [x]; abrirAqui(s.value); pst('➡ Abrindo ' + (achar(s.value) || {}).nome + ' e entregando ' + x.nome + '…'); };
  }
  function blobDe(x) { const bin = atob(x.b64), u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return new Blob([u], { type: x.tipo }); }
  async function noProjeto(x) {
    const fs = Object.assign({}, Lab.arquivos()); const ehTexto = /\.(html?|css|m?js|cjs|jsx|tsx?|json|md|txt|ya?ml|svg|xml|py|sh|csv)$/i.test(x.nome);
    if (/\.zip$/i.test(x.nome) && window.JSZip) { const z = await JSZip.loadAsync(blobDe(x)); let n = 0; window.LabBin = window.LabBin || {};
      for (const nome of Object.keys(z.files)) { const f = z.files[nome]; if (f.dir) continue; if (/\.(html?|css|m?js|cjs|jsx|tsx?|json|md|txt|ya?ml|svg|xml|py|sh|csv)$/i.test(nome)) fs[nome] = await f.async('string'); else { window.LabBin[nome] = await f.async('blob'); fs[nome] = '[Arquivo binário]'; } n++; }
      Shell.setState('projectFiles', fs); if (Lab.limparCache) Lab.limparCache(); Lab.aviso('➕ ' + n + ' arquivo(s) do zip entraram no projeto', 'success'); return; }
    if (ehTexto) fs[x.nome] = new TextDecoder().decode(new Uint8Array(await blobDe(x).arrayBuffer())); else { window.LabBin = window.LabBin || {}; window.LabBin[x.nome] = blobDe(x); fs[x.nome] = '[Arquivo binário]'; }
    Shell.setState('projectFiles', fs); if (Lab.limparCache) Lab.limparCache(); Lab.aviso('➕ ' + x.nome + ' entrou no projeto do Laboratório', 'success');
  }
  async function b64De(bl) { const u = new Uint8Array(await bl.arrayBuffer()); let s = ''; for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000)); return btoa(s); }
  async function entregar(v) {
    if (!v) throw new Error('Importe um projeto primeiro (📦 Importar).');
    let arqs = [];
    if (v === 'projeto') {
      if (!window.JSZip) throw new Error('falta o JSZip');
      const z = new JSZip(), fs = Lab.arquivos(), bin = Lab.binarios ? Lab.binarios() : {};
      for (const p of Lab.lista()) { if (p in bin) z.file(p, bin[p]); else if (!(Lab.ehBinario && Lab.ehBinario(fs[p]))) z.file(p, fs[p]); }
      const nome = String(Shell.getState('projectName') || 'projeto').replace(/[^\w.\- ]+/g, '_') + '.zip';
      arqs = [{ nome, tipo: 'application/zip', b64: await b64De(await z.generateAsync({ type: 'blob' })) }];
    } else if (v.startsWith('saida:')) { const x = saidas[+v.slice(6)]; arqs = [x]; }
    else if (v.startsWith('arq:')) { const p = v.slice(4), bin = Lab.binarios ? Lab.binarios() : {}; const bl = p in bin ? bin[p] : new Blob([Lab.arquivos()[p] || ''], { type: 'text/plain' }); arqs = [{ nome: p.split('/').pop(), tipo: bl.type, b64: await b64De(bl) }]; }
    entregarArquivos(arqs);
  }
  function entregarArquivos(arqs) { const q = $('#ferr-quadro'); if (!q || !q.contentWindow) return; q.contentWindow.postMessage({ labFerr: 'entrada', arquivos: arqs }, '*'); pst('📥 Entregando ' + arqs.map((a) => a.nome).join(', ') + '…'); }
  function telaPropria(id) {
    const f = achar(id); const b = bytes(f.arq);
    window.open(b ? URL.createObjectURL(new Blob([b], { type: 'text/html' })) : 'ferramentas/' + f.arq, '_blank');
  }
  function kit(arq) {
    const b = bytes(arq);
    if (b) Lab.baixar(new Blob([b], { type: 'application/octet-stream' }), arq);
    else { const a = document.createElement('a'); a.href = 'kits/' + arq; a.download = arq; document.body.appendChild(a); a.click(); a.remove(); }
    Lab.aviso('⬇ ' + arq + ' (pasta Downloads)', 'success');
  }

  window.addEventListener('shell:navigate', (e) => { if (e.detail && e.detail.moduleId === 'ferramentas') tela(); });
  return { tela, abrir: abrirAqui, voltar: () => { aberta = ''; tela(); }, telaPropria, kit, _lista: FERR, _kits: KITS };
})();
