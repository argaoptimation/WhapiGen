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

// ===== Loader INTELIGENTE (Con tiempo mínimo de lectura) =====
const MIN_TIME = 2000; // Tiempo mínimo en milisegundos (2 seg)
const start = Date.now();

function hideLoader() {
  const loader = document.getElementById("loader");
  if (!loader || loader.classList.contains("hide")) return;

  // Calculamos cuánto falta para cumplir los 2 segundos
  const elapsed = Date.now() - start;
  const remaining = Math.max(0, MIN_TIME - elapsed);

  setTimeout(() => {
    loader.classList.add("fade-logo2");
    setTimeout(() => {
        loader.classList.add("hide");
        // IMPORTANTE: Refresca las animaciones cuando se va el loader
        if (window.ScrollTrigger) ScrollTrigger.refresh(); 
    }, 800);
  }, remaining);
}

window.addEventListener("load", hideLoader);
// Plan B (Anti-Instagram): Si a los 4 seg no cargó, forzar salida
setTimeout(hideLoader, 4000);


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
      { t:"in",  s:"Hablame y coordinamos una llamada de 5 minutos para brindarte la mejor solución 💬👇" },
      { t:"in",  html:`<a href="https://wa.me/5492664405019?text=Hola%20Gabriel,%20quiero%20automatizar%20mi%20negocio" target="_blank" rel="noopener noreferrer">Abrir WhatsApp</a>` },
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

  // Toggle precios
  const billingToggle = document.getElementById('billingToggle');
  const values = document.querySelectorAll('.value');
  const periods = document.querySelectorAll('.period');

  billingToggle.addEventListener('change', () => {
      const isYearly = billingToggle.checked;

      // Cambia los números
      values.forEach(val => {
          val.textContent = isYearly ? val.getAttribute('data-yearly') : val.getAttribute('data-monthly');
      });

      // Cambia el texto de USD/mes
      periods.forEach(p => {
          p.textContent = isYearly ? p.getAttribute('data-yearly') : p.getAttribute('data-monthly');
      });
  });
  
  // Tilt
  if (window.VanillaTilt) {
    VanillaTilt.init($$(".tilt"), { max: 10, speed: 400, glare: true, "max-glare": 0.15 });
  }

  // Typed
  if (window.Typed) {
    new Typed("#typed", {
      strings: ["pet shops","barberias","centros estéticos","pymes de distintos rubros"],
      typeSpeed: 36, backSpeed: 18, backDelay: 1300, loop: true,
    });
  }

  // Animaciones GSAP (CON RED DE SEGURIDAD)
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    
    // 1. Configuración de animaciones (Intento normal)
    const titleAnim = $(".title-animated");
    if(titleAnim) {
       gsap.from(titleAnim, { y:18, opacity:1, duration:.8, ease:"power2.out" });
    }

    $$(".section").forEach(sec => {
      const elements = sec.querySelectorAll(".section-title, .section-subtitle, .card, .case, .review, .phone");
      if (elements.length > 0) {
        gsap.from(elements, {
          opacity: 1,       
          y: 30,            
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.1,
          scrollTrigger: { trigger: sec, start: "top 90%" } // "90%" ayuda a que dispare antes en móviles
        });
      }
    });

    // 2. RED DE SEGURIDAD (La Solución Anti-Instagram) 🛡️
    // Si por alguna razón (navegador lento, bug de Instagram) las cosas siguen ocultas
    // después de 1 segundo, las forzamos a aparecer.
    setTimeout(() => {
      const animatableElements = document.querySelectorAll(".section-title, .section-subtitle, .card, .case, .review, .phone, .title-animated");
      
      animatableElements.forEach(el => {
        // Si el elemento sigue invisible (opacity cercano a 0), lo mostramos a la fuerza
        if (getComputedStyle(el).opacity < 0.1) {
          el.style.opacity = "1";
          el.style.transform = "none"; // Quitamos cualquier desplazamiento trabado
          el.style.visibility = "visible";
        }
      });
      
      // Forzamos a GSAP a recalcular una vez más por si acaso
      ScrollTrigger.refresh();
      
    }, 1500); // Se ejecuta a los 1.5 segundos de cargar
  }

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

