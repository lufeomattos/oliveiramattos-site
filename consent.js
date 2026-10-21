/*
 * Consentimento de cookies — Oliveira Mattos & Moraes e Silva Advogados Associados
 *
 * O Google Analytics só é carregado depois que o visitante clica em "Aceitar".
 * Sem escolha registrada, ou com recusa, nenhum script do Google é carregado.
 * A escolha fica salva neste navegador e pode ser alterada a qualquer momento
 * pelo link "Preferências de cookies" do rodapé (qualquer elemento com o
 * atributo data-cookie-preferences abre o aviso de novo).
 *
 * Base legal: consentimento (LGPD, art. 7º, I) e, para a transferência
 * internacional ao Google, consentimento específico e em destaque (art. 33, VIII).
 */
(function () {
  'use strict';

  var GA_ID = 'G-4VKHF1RCF3';
  var CHAVE = 'om_consentimento_cookies';
  var VERSAO = '2026-10-21';
  var POLITICA = '/privacidade.html#cookies';

  function lerEscolha() {
    try {
      var bruto = window.localStorage.getItem(CHAVE);
      if (!bruto) return null;
      var dado = JSON.parse(bruto);
      // Uma nova versão do aviso pede a escolha de novo.
      return dado && dado.versao === VERSAO ? dado.escolha : null;
    } catch (e) {
      return null;
    }
  }

  function salvarEscolha(escolha) {
    try {
      window.localStorage.setItem(CHAVE, JSON.stringify({
        escolha: escolha,
        versao: VERSAO,
        data: new Date().toISOString()
      }));
    } catch (e) { /* navegador sem armazenamento: a escolha vale só para esta página */ }
  }

  var analyticsCarregado = false;
  function carregarAnalytics() {
    if (analyticsCarregado) return;
    analyticsCarregado = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID, { anonymize_ip: true });
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
  }

  // Ao recusar depois de ter aceitado, apaga os cookies do Analytics já gravados.
  function apagarCookiesAnalytics() {
    var host = window.location.hostname;
    var dominios = ['', host, '.' + host, '.' + host.replace(/^www\./, '')];
    document.cookie.split(';').forEach(function (c) {
      var nome = c.split('=')[0].trim();
      if (nome === '_ga' || nome.indexOf('_ga_') === 0 || nome === '_gid' || nome === '_gat') {
        dominios.forEach(function (d) {
          document.cookie = nome + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + (d ? '; domain=' + d : '');
        });
      }
    });
  }

  function injetarEstilos() {
    if (document.getElementById('om-cookies-estilo')) return;
    var css = '' +
      '#om-cookies{position:fixed;left:16px;right:16px;bottom:16px;z-index:10000;max-width:760px;margin:0 auto;' +
      'background:#fff;color:#1f2937;border:1px solid #d1d5db;border-top:4px solid #003d7a;border-radius:8px;' +
      'box-shadow:0 8px 24px rgba(0,0,0,.18);padding:18px 20px;font-family:Calibri,"Segoe UI",Tahoma,sans-serif;' +
      'font-size:15px;line-height:1.5}' +
      '#om-cookies h2{font-family:Georgia,"Times New Roman",serif;font-size:17px;color:#003d7a;margin:0 0 6px}' +
      '#om-cookies p{margin:0 0 14px}' +
      '#om-cookies a{color:#003d7a;text-decoration:underline}' +
      '#om-cookies .om-acoes{display:flex;gap:10px;flex-wrap:wrap;justify-content:flex-end}' +
      '#om-cookies button{min-width:140px;padding:10px 18px;border-radius:6px;font:inherit;font-weight:600;cursor:pointer;' +
      'border:2px solid #003d7a}' +
      '#om-cookies .om-recusar{background:#fff;color:#003d7a}' +
      '#om-cookies .om-aceitar{background:#003d7a;color:#fff}' +
      '#om-cookies button:focus-visible{outline:3px solid #d4af37;outline-offset:2px}' +
      '@media (max-width:520px){#om-cookies button{flex:1 1 100%}}';
    var el = document.createElement('style');
    el.id = 'om-cookies-estilo';
    el.textContent = css;
    document.head.appendChild(el);
  }

  function fecharAviso() {
    var aviso = document.getElementById('om-cookies');
    if (aviso) aviso.parentNode.removeChild(aviso);
  }

  function mostrarAviso() {
    if (document.getElementById('om-cookies')) return;
    injetarEstilos();
    var aviso = document.createElement('div');
    aviso.id = 'om-cookies';
    aviso.setAttribute('role', 'dialog');
    aviso.setAttribute('aria-live', 'polite');
    aviso.setAttribute('aria-labelledby', 'om-cookies-titulo');
    aviso.innerHTML =
      '<h2 id="om-cookies-titulo">Cookies de estatística</h2>' +
      '<p>Com a sua autorização, usamos o Google Analytics para contar visitas e entender como o site é usado. ' +
      'O Google é sediado nos Estados Unidos, por isso os dados de navegação são transferidos para fora do Brasil. ' +
      'Se você recusar, o site funciona normalmente e nada é enviado ao Google. ' +
      'Você pode mudar de ideia a qualquer momento pelo link "Preferências de cookies" no rodapé. ' +
      '<a href="' + POLITICA + '">Saiba mais na Política de Privacidade</a>.</p>' +
      '<div class="om-acoes">' +
      '<button type="button" class="om-recusar">Recusar</button>' +
      '<button type="button" class="om-aceitar">Aceitar</button>' +
      '</div>';
    document.body.appendChild(aviso);

    aviso.querySelector('.om-aceitar').addEventListener('click', function () {
      salvarEscolha('aceito');
      fecharAviso();
      carregarAnalytics();
    });
    aviso.querySelector('.om-recusar').addEventListener('click', function () {
      var tinhaAceitado = analyticsCarregado;
      salvarEscolha('recusado');
      apagarCookiesAnalytics();
      fecharAviso();
      // O script do Google já carregado só sai da página com um recarregamento.
      if (tinhaAceitado) window.location.reload();
    });
  }

  function iniciar() {
    var escolha = lerEscolha();
    if (escolha === 'aceito') carregarAnalytics();
    else if (escolha !== 'recusado') mostrarAviso();

    document.addEventListener('click', function (ev) {
      var alvo = ev.target.closest ? ev.target.closest('[data-cookie-preferences]') : null;
      if (!alvo) return;
      ev.preventDefault();
      mostrarAviso();
    });
  }

  window.omAbrirPreferenciasCookies = mostrarAviso;

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
