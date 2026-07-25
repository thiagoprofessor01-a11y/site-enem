"use client";

import { useEffect, useRef, useState } from "react";

// Renderiza um HTML arbitrário (uma questão interativa, por exemplo) dentro de
// um iframe isolado. Assim os <style>/<script> do HTML colado funcionam de
// verdade (o aluno clica, o próprio HTML mostra a correção) sem vazar estilos
// nem acessar a sessão do site — o iframe roda em origem isolada (sandbox sem
// allow-same-origin). A altura se ajusta sozinha ao conteúdo via postMessage.

const REPORTER = `<script>(function(){
  function h(){var b=document.body;return Math.max(document.documentElement.scrollHeight, b?b.scrollHeight:0, b?b.offsetHeight:0);}
  function send(){try{parent.postMessage({__embedId:window.__embedId,__embedHeight:h()},"*");}catch(e){}}
  if(window.ResizeObserver&&document.body){new ResizeObserver(send).observe(document.body);}
  document.addEventListener("click",function(){setTimeout(send,60);});
  window.addEventListener("load",send);setTimeout(send,50);send();
})();<\/script>`;

export default function HtmlEmbed({ html, minHeight = 80 }) {
  const idRef = useRef("emb_" + Math.random().toString(36).slice(2));
  const [altura, setAltura] = useState(minHeight);

  useEffect(() => {
    function onMsg(e) {
      const d = e.data;
      if (d && d.__embedId === idRef.current && typeof d.__embedHeight === "number") {
        setAltura(Math.max(minHeight, Math.ceil(d.__embedHeight) + 4));
      }
    }
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [minHeight]);

  const srcDoc =
    `<!doctype html><html><head><meta charset="utf-8">` +
    `<meta name="viewport" content="width=device-width, initial-scale=1">` +
    `<style>body{margin:0;padding:2px;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#0f172a;line-height:1.5;}img{max-width:100%;height:auto;}</style>` +
    `</head><body>` +
    `<script>window.__embedId=${JSON.stringify(idRef.current)}<\/script>` +
    (html || "") +
    REPORTER +
    `</body></html>`;

  return (
    <iframe
      srcDoc={srcDoc}
      sandbox="allow-scripts allow-popups allow-forms allow-modals"
      style={{ width: "100%", height: altura, border: 0, display: "block" }}
      title="Questão"
      loading="lazy"
    />
  );
}
