// Utils
const $ = (s, ctx = document) => ctx.querySelector(s);
const $$ = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));

// ===== Loader con fade secuencial =====
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if (!loader) return;

  // 1️⃣ Espera 1.8s (barra de carga)
  setTimeout(() => loader.classList.add("fade-logo"), 1800);
  // 2️⃣ Luego de 2.6s desaparece el fondo
  setTimeout(() => loader.classList.add("hide"), 2600);
});


// Año footer
const yearSpan = $("#year");
if (yearSpan) yearSpan.textContent = new Date().getFullYear();

// Nav mobile
const navToggle = $("#navtoggle");
const navLinks = $("#navlinks");
if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const show = navLinks.classList.toggle("show");
    navToggle.setAttribute("aria-expanded", String(show));
  });
}

// Tema (Dark/Light Mode)
(() => {
  const stored = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initial = stored || (prefersDark ? "dark" : "light");
  document.documentElement.setAttribute("data-theme", initial);
})();

const themeBtn = $("#themeToggle");
if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    const cur = document.documentElement.getAttribute("data-theme") || "light";
    const next = cur === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  });
}

// Scroll progress bar
window.addEventListener("scroll", () => {
  const scrollContainer = $("#scroll-progress");
  if (scrollContainer) {
    const sc = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    scrollContainer.style.width = `${Math.min(100, sc * 100)}%`;
  }
});

// ===== INICIO DE LÓGICA DOM (Todo lo que requiere que el HTML esté listo) =====
window.addEventListener("DOMContentLoaded", () => {
  
  // Smooth scroll (Lenis)
  if (window.Lenis) {
    const lenis = new Lenis({ duration: 0.95, smoothWheel: true });
    const raf = (t) => {
      lenis.raf(t);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }

  // Hero: chat en vivo animado
  const live = $("#live-chat");
  const typing = $("#typing");
  if (live && typing) {
    const msgs = [
      { t: "out", s: "Hola, quiero saber cómo funciona." },
      { t: "in", s: "Automatizamos tus mensajes de WhatsApp con IA 🤖." },
      { t: "out", s: "¿Sirve para agendar turnos?" },
      { t: "in", s: "¡Claro! Confirmamos, reprogramamos y cancelamos citas automáticamente 📅." },
      { t: "out", s: "Perfecto, quiero una demo." },
      { t: "in", s: "Hablame y te paso el contacto para probarlo 💬👇" },
      { t: "in", html: `<a href="https://wa.me/5492664405019?text=Hola%20WHAPIGEN%20quiero%20una%20demo" target="_blank" rel="noopener noreferrer">Abrir WhatsApp</a>` },
    ];
    let i = 0;
    const delay = 1600;
    const push = () => {
      if (i >= msgs.length) {
        typing.style.display = "none";
        return;
      }
      const el = document.createElement("div");
      el.className = `msg msg-${msgs[i].t}`;
      if (msgs[i].html) {
        el.innerHTML = msgs[i].html; // link clickeable
      } else {
        el.textContent = msgs[i].s; // texto normal
      }
      live.appendChild(el);
      live.scrollTop = live.scrollHeight;
      typing.style.visibility = "visible";
      
      // Lógica de tipeo y siguiente mensaje
      setTimeout(() => {
        typing.style.visibility = "hidden";
        i++;
        setTimeout(push, 500);
      }, delay);
    };
    // Inicia la animación del chat un poco después de cargar
    setTimeout(push, 800);
  }

  // Swipers (Carrouseles)
  if (window.Swiper) {
    // Casos de uso
    if ($(".cases-swiper")) {
      new Swiper(".cases-swiper", {
        slidesPerView: "auto",
        spaceBetween: 12,
        freeMode: true,
        loop: true,
        autoplay: { delay: 1, disableOnInteraction: false },
        speed: 4500,
      });
    }
    // Reseñas (si existen)
    if ($(".reviews-swiper")) {
      new Swiper(".reviews-swiper", {
        loop: true,
        centeredSlides: true,
        slidesPerView: 1.1,
        spaceBetween: 14,
        breakpoints: { 768: { slidesPerView: 2.2 }, 1024: { slidesPerView: 3 } },
        autoplay: { delay: 3200, disableOnInteraction: false },
        speed: 650,
      });
    }
  }

  // Tabs demo (Cambio entre Centro Estético / Barbería / PetShop)
  const tabBtns = $$(".tab-btn");
  if (tabBtns.length > 0) {
    tabBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        // Desactivar todos los botones
        tabBtns.forEach(b => {
          b.classList.remove("active");
          b.setAttribute("aria-selected", "false");
        });
        // Activar el botón clickeado
        btn.classList.add("active");
        btn.setAttribute("aria-selected", "true");

        // Mostrar el panel correspondiente
        const target = btn.getAttribute("data-target");
        $$(".panel").forEach(p => p.classList.remove("active"));
        const targetPanel = $(target);
        if (targetPanel) targetPanel.classList.add("active");
      });
    });
  }

  // === LÓGICA DE PRECIOS (Corregida) ===
  const billingToggle = document.getElementById('billingToggle');
  
  if (billingToggle) {
    const values = document.querySelectorAll('.value');
    const periods = document.querySelectorAll('.period');

    billingToggle.addEventListener('change', () => {
      const isYearly = billingToggle.checked;

      // Cambia los números (Precio)
      values.forEach(val => {
        val.textContent = isYearly ? val.getAttribute('data-yearly') : val.getAttribute('data-monthly');
      });

      // Cambia el texto debajo (USD/mes o anual)
      periods.forEach(p => {
        p.textContent = isYearly ? p.getAttribute('data-yearly') : p.getAttribute('data-monthly');
      });
    });
  }

  // Tilt Effect (Movimiento 3D de tarjetas)
  if (window.VanillaTilt) {
    VanillaTilt.init($$(".tilt"), { max: 10, speed: 400, glare: true, "max-glare": 0.15 });
  }

  // Typed.js (Efecto máquina de escribir en el Hero)
  if (window.Typed && $("#typed")) {
    new Typed("#typed", {
      strings: ["pet shops", "barberias", "centros estéticos", "negocios locales"],
      typeSpeed: 36,
      backSpeed: 18,
      backDelay: 1300,
      loop: true,
    });
  }

  // Animaciones GSAP (Scroll reveal)
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    
    // Título principal
    const titleAnim = $(".title-animated");
    if(titleAnim) {
       gsap.from(titleAnim, { y: 18, opacity: 0, duration: 0.8, ease: "power2.out" });
    }

    // Secciones
    $$(".section").forEach(sec => {
      const elementsToAnimate = sec.querySelectorAll(".section-title, .section-subtitle, .card, .case, .review, .phone");
      if (elementsToAnimate.length > 0) {
        gsap.from(elementsToAnimate, {
          opacity: 0,
          y: 26,
          duration: 0.7,
          ease: "power2.out",
          stagger: 0.05,
          scrollTrigger: { trigger: sec, start: "top 80%" }
        });
      }
    });
  }

  // === FORMULARIO A WHATSAPP ===
  const contactForm = document.getElementById('contactForm');
  const formMsg = document.getElementById('formMsg');

  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault(); // IMPORTANTE: Evita que la página se recargue

      // 1. Anti-spam (Honeypot)
      const honeyPot = contactForm.querySelector('input[name="empresa"]');
      if (honeyPot && honeyPot.value) return; // Si el bot llenó esto, paramos.

      // 2. Captura de datos
      const formData = new FormData(contactForm);
      const name = formData.get('name');      // Nombre y Apellido
      const phone = formData.get('phone');    // WhatsApp
      const business = formData.get('business'); // Empresa
      const message = formData.get('message'); // Mensaje

      // 3. Validación
      if (!name || !phone || !business || !message) {
        if (formMsg) {
          formMsg.textContent = "Por favor, completá todos los campos.";
          formMsg.style.color = "red";
        }
        return;
      }

      // 4. Armado del mensaje
      const text = `*Nuevo Lead desde la Web* 🚀%0A%0A` +
                   `👤 *Nombre:* ${name}%0A` +
                   `🏢 *Empresa:* ${business}%0A` +
                   `📱 *WhatsApp:* ${phone}%0A` +
                   `💬 *Consulta:* ${message}`;

      // 5. Redirección
      const myPhone = '5492664405019';
      const url = `https://wa.me/${myPhone}?text=${text}`;

      window.open(url, '_blank');

      // Feedback visual
      if (formMsg) {
        formMsg.textContent = "✅ Abriendo WhatsApp...";
        formMsg.style.color = "var(--primary)";
      }
      
      contactForm.reset();
    });
  }

});