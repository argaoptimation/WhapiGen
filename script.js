// ===== ARS / USD Toggle =====
let blueRate = null;
let currMode = 'USD';

async function fetchBlue() {
  try {
    const r = await fetch('https://dolarapi.com/v1/dolares/blue');
    if (!r.ok) return;
    const d = await r.json();
    blueRate = parseFloat(d.venta);
    const info = document.getElementById('blue-rate-info');
    if (info) info.textContent = `USD Blue Venta: $${blueRate.toLocaleString('es-AR')}`;
    const wrap = document.getElementById('currency-toggle-wrap');
    if (wrap) wrap.style.visibility = 'visible';
  } catch { /* silently fail */ }
}

function toARS(usdStr) {
  const isDesde = /desde/i.test(String(usdStr));
  const num = parseFloat(String(usdStr).replace(/[^0-9.]/g, ''));
  if (isNaN(num)) return usdStr;
  const rounded = Math.floor((num * blueRate) / 500) * 500;
  const ars = rounded.toLocaleString('es-AR');
  return isDesde ? `Desde $${ars}` : ars;
}

function refreshPrices() {
  const isYearly = document.getElementById('billingToggle')?.checked;
  const key = isYearly ? 'yearly' : 'monthly';
  document.querySelectorAll('.value').forEach(el => {
    const usd = el.getAttribute(`data-${key}`);
    if (!usd) return;
    el.textContent = (currMode === 'ARS' && blueRate) ? toARS(usd) : usd;
  });
  document.querySelectorAll('.period').forEach(el => {
    const raw = el.getAttribute(`data-${key}`) || el.getAttribute('data-monthly') || '';
    el.textContent = (currMode === 'ARS') ? raw.replace('USD', 'ARS') : raw;
  });
}

// ===== EmailJS config (si usás EmailJS) =====
const EMAILJS_PUBLIC_KEY = "TU_PUBLIC_KEY";
const EMAILJS_SERVICE_ID = "TU_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "TU_TEMPLATE_ID";
const DESTINO = "arga.optimation@gmail.com";

const industryToggle = document.getElementById('industryToggle');
const esteticaElements = document.querySelectorAll('.type-estetica');
const empresaElements = document.querySelectorAll('.type-empresa');
const labelEstetica = document.getElementById('label-estetica');
const labelEmpresa = document.getElementById('label-empresa');

industryToggle.addEventListener('change', () => {
    if (industryToggle.checked) {
        // MODO EMPRESA
        esteticaElements.forEach(el => el.style.display = 'none');
        empresaElements.forEach(el => el.style.display = 'block');
        labelEmpresa.style.fontWeight = '700'; // Bold
        labelEmpresa.style.color = 'var(--primary)';
        labelEstetica.style.fontWeight = '400'; // Normal
        labelEstetica.style.color = 'inherit';
    } else {
        // MODO ESTÉTICA
        esteticaElements.forEach(el => el.style.display = 'block');
        empresaElements.forEach(el => el.style.display = 'none');
        labelEstetica.style.fontWeight = '700';
        labelEstetica.style.color = 'var(--primary)';
        labelEmpresa.style.fontWeight = '400';
        labelEmpresa.style.color = 'inherit';
    }
});

// Utils
const $  = (s, ctx=document) => ctx.querySelector(s);
const $$ = (s, ctx=document) => Array.from(ctx.querySelectorAll(s));



// Año footer
$("#year").textContent = new Date().getFullYear();

// Nav mobile
const navToggle = $("#navtoggle");
const navLinks  = $("#navlinks");
navToggle?.addEventListener("click", () => {
  const show = navLinks.classList.toggle("show");
  navToggle.setAttribute("aria-expanded", String(show));
});

// Tema
(() => {
  const stored = localStorage.getItem("theme");
  // Si no hay nada guardado, elegimos "dark" por defecto sin preguntar al sistema
  const initial = stored || "dark"; 
  document.documentElement.setAttribute("data-theme", initial);
})();

$("#themeToggle")?.addEventListener("click", () => {
  const cur = document.documentElement.getAttribute("data-theme") || "light";
  const next = cur === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
});

// Scroll progress
window.addEventListener("scroll", () => {
  const sc = window.scrollY / (document.body.scrollHeight - window.innerHeight);
  $("#scroll-progress").style.width = `${Math.min(100, sc * 100)}%`;
});

window.addEventListener("DOMContentLoaded", () => {

  /* === DETECTOR DE INSTAGRAM / FACEBOOK === */
  const ua = navigator.userAgent || navigator.vendor || window.opera;
  // Detectamos palabras clave de los navegadores in-app
  const isInApp = (ua.indexOf("Instagram") > -1) || (ua.indexOf("FBAN") > -1) || (ua.indexOf("FBAV") > -1);

  if (isInApp) {
    const alertBox = document.getElementById("insta-alert");
    const closeBtn = document.getElementById("close-alert");
    
    // Mostramos el alerta
    if (alertBox) alertBox.classList.add("show");
    
    // Opción para cerrar el alerta si el usuario quiere sufrir igual
    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            alertBox.classList.remove("show");
        });
    }
  }
  
  // Smooth scroll (Lenis)
  if (window.Lenis) {
    const lenis = new Lenis({ duration: 0.95, smoothWheel: true });
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }

  // Hero: chat en vivo
  const live = $("#live-chat");
  const typing = $("#typing");
  if (live && typing) {
    const msgs = [
      { t:"out", s:"Hola, quiero saber cómo funciona." },
      { t:"in",  s:"Automatizamos tus mensajes de WhatsApp con IA 🤖." },
      { t:"out", s:"¿Que se puede automatizar?" },
      { t:"in",  s:"El pedido de productos, agendar citas, asesoramiento técnico y mucho más!" },
      { t:"in",  s:"Todo personalizado en base a tu negocio y tus preferencias." },
      { t:"out", s:"Muy bueno, como puedo saber si sirve en mi caso." },
      { t:"in",  s:"Agendá una breve llamada de diagnóstico para ver tu caso💬👇" },
      { t:"in",  html:`<a href="agendar.html" target="_blank" rel="noopener noreferrer">Agendar</a>` },
    ];
    let i = 0;
    const delay = 1600;
    const push = () => {
      if (i >= msgs.length) { typing.style.display = "none"; return; }
      const el = document.createElement("div");
      el.className = `msg msg-${msgs[i].t}`;
      if (msgs[i].html) {
        el.innerHTML = msgs[i].html;     // link clickeable
      } else {
        el.textContent = msgs[i].s;      // texto normal
      }
      live.appendChild(el);
      live.scrollTop = live.scrollHeight;
      typing.style.visibility = "visible";
      setTimeout(() => { typing.style.visibility = "hidden"; i++; setTimeout(push, 500); }, delay);
    };
    setTimeout(push, 800);
  }

  // Swipers
  if (window.Swiper) {
    new Swiper(".cases-swiper", {
      slidesPerView: "auto",
      spaceBetween: 12,
      freeMode: true,
      loop: true,
      autoplay: { delay: 1, disableOnInteraction: false },
      speed: 4500,
    });
    new Swiper(".reviews-swiper", {
      loop: true, centeredSlides: true,
      slidesPerView: 1.1, spaceBetween: 14,
      breakpoints: { 768:{slidesPerView:2.2}, 1024:{slidesPerView:3} },
      autoplay: { delay: 3200, disableOnInteraction:false },
      speed: 650,
    });
  }

  // Tabs demo (fundamental para que NO se vean todos)
  $$(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      // botones
      $$(".tab-btn").forEach(b => { b.classList.remove("active"); b.setAttribute("aria-selected","false"); });
      btn.classList.add("active"); btn.setAttribute("aria-selected","true");
      // panels
      const target = btn.getAttribute("data-target");
      $$(".panel").forEach(p => p.classList.remove("active"));
      $(target)?.classList.add("active");
    });
  });

  // Toggle precios (mensual / anual) — usa refreshPrices para respetar el modo ARS
  document.getElementById('billingToggle')?.addEventListener('change', refreshPrices);

  // Toggle USD / ARS
  const currencyToggle = document.getElementById('currencyToggle');
  currencyToggle?.addEventListener('change', () => {
    currMode = currencyToggle.checked ? 'ARS' : 'USD';
    document.getElementById('curr-usd-btn')?.classList.toggle('active', !currencyToggle.checked);
    document.getElementById('curr-ars-btn')?.classList.toggle('active',  currencyToggle.checked);
    refreshPrices();
  });
  
  // Tilt
  if (window.VanillaTilt) {
    VanillaTilt.init($$(".tilt"), { max: 10, speed: 400, glare: true, "max-glare": 0.15 });
  }

  // --- Magnetic Buttons ---
  $$('.btn.primary, .btn.ghost, .btn.contrast').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const dx = (e.clientX - (rect.left + rect.width  / 2)) * 0.28;
      const dy = (e.clientY - (rect.top  + rect.height / 2)) * 0.28;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
      btn.style.transition = 'transform 0.1s ease';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      btn.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    });
  });

  // Typed
  if (window.Typed) {
    new Typed("#typed", {
      strings: ["pet shops","barberias","centros estéticos","pymes de distintos rubros"],
      typeSpeed: 36, backSpeed: 18, backDelay: 1300, loop: true,
    });
  }

  // Scroll reveal bidireccional — IntersectionObserver
  (() => {
    const SEL = '.section-title,.section-subtitle,.card,.case,.review,.phone,.why-item,.process-step';
    document.querySelectorAll('.section:not(.hero)').forEach(sec => {
      sec.querySelectorAll(SEL).forEach((el, i) => {
        el.style.setProperty('--sr-d', `${Math.min(i, 5) * 0.09}s`);
      });
    });
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => e.target.classList.toggle('in-view', e.isIntersecting));
    }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });
    const fullSel = SEL.split(',').map(s => `.section:not(.hero) ${s}`).join(',');
    document.querySelectorAll(fullSel).forEach(el => obs.observe(el));
  })();

  /* === Lógica del Formulario a WhatsApp === */
  const contactForm = document.getElementById('contactForm');
  const formMsg = document.getElementById('formMsg');

  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault(); // ESTO evita que la página se recargue

      // 1. Anti-spam
      const honeyPot = contactForm.querySelector('input[name="empresa"]');
      if (honeyPot && honeyPot.value) return;

      // 2. Captura de datos
      const formData = new FormData(contactForm);
      const name = formData.get('name');      
      const phone = formData.get('phone');    
      const business = formData.get('business'); 
      const message = formData.get('message'); 

      // 3. Validación
      if (!name || !phone || !business || !message) {
        if (formMsg) {
          formMsg.textContent = "Por favor, completá todos los campos.";
          formMsg.style.color = "red";
        }
        return;
      }

      // 4. Armado del mensaje
      const text = `Hola, quiero que me contacten:%0A` +
                   `*Nombre:* ${name}%0A` +
                   `*Empresa:* ${business}%0A` +
                   `*Número de contacto:* ${phone}%0A` +
                   `*Consulta:* ${message}`;

      // 5. Redirección
      const myPhone = '5492664405019';
      window.open(`https://wa.me/${myPhone}?text=${text}`, '_blank');

      if (formMsg) {
        formMsg.textContent = "✅ Abriendo WhatsApp...";
        formMsg.style.color = "var(--primary)";
      }
      
      contactForm.reset();
    });
  }
});

window.addEventListener('load', () => {
    setTimeout(() => {
        const fab = document.querySelector('.floating-cta');
        if (fab) fab.classList.add('visible');
    }, 2000);
    fetchBlue();
});
