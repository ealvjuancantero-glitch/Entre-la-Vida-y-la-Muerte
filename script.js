/* ============================================================
   PROYECTO: LA MUERTE, ENTRE LA MITOLOGÍA Y LA CIENCIA
   JavaScript básico:
   1. Menú para celulares
   2. Barra de progreso y botón para volver arriba
   3. Indicador de la sección que se está visitando
   4. Animaciones sencillas al aparecer
   ============================================================ */

// Esta clase activa las animaciones. Si el JavaScript falla,
// el contenido sigue visible porque el CSS solo oculta .reveal
// cuando existe la clase "js-enabled".
document.documentElement.classList.add("js-enabled");

document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  var cabecera = document.getElementById("cabecera");
  var botonMenu = document.getElementById("botonMenu");
  var menu = document.getElementById("menuPrincipal").closest(".main-nav");
  var enlacesMenu = document.querySelectorAll(".nav-link");
  var botonArriba = document.getElementById("botonArriba");
  var barraProgreso = document.getElementById("barraProgreso");
  var enlacesInternos = document.querySelectorAll('a[href^="#"]');

  /* ----------------------------------------------------------
     1. MENÚ PARA CELULARES
     ---------------------------------------------------------- */
  function cerrarMenu() {
    menu.classList.remove("open");
    botonMenu.classList.remove("open");
    botonMenu.setAttribute("aria-expanded", "false");
    botonMenu.setAttribute("aria-label", "Abrir menú de navegación");
  }

  botonMenu.addEventListener("click", function () {
    var abierto = menu.classList.toggle("open");

    botonMenu.classList.toggle("open", abierto);
    botonMenu.setAttribute("aria-expanded", abierto ? "true" : "false");
    botonMenu.setAttribute(
      "aria-label",
      abierto ? "Cerrar menú de navegación" : "Abrir menú de navegación"
    );
  });

  // Al hacer clic en cualquier enlace interno, el menú se cierra.
  enlacesInternos.forEach(function (enlace) {
    enlace.addEventListener("click", cerrarMenu);
  });

  // También se cierra con la tecla Escape.
  document.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape") {
      cerrarMenu();
    }
  });

  // Si la pantalla vuelve a ser grande, se cierra el menú móvil.
  window.addEventListener("resize", function () {
    if (window.innerWidth > 900) {
      cerrarMenu();
    }
  });

  /* ----------------------------------------------------------
     2. SECCIONES DEL MENÚ
     Solo se toman las secciones que tienen un enlace arriba.
     ---------------------------------------------------------- */
  var secciones = [];

  enlacesMenu.forEach(function (enlace) {
    var id = enlace.getAttribute("href").replace("#", "");
    var seccion = document.getElementById(id);

    if (seccion) {
      secciones.push(seccion);
    }
  });

  /* ----------------------------------------------------------
     3. INDICADOR DE LA SECCIÓN ACTUAL
     ---------------------------------------------------------- */
  function actualizarEnlaceActivo() {
    var posicion = window.scrollY + 150;
    var idActual = secciones.length > 0 ? secciones[0].id : "inicio";

    secciones.forEach(function (seccion) {
      var inicioSeccion = seccion.getBoundingClientRect().top + window.scrollY;

      if (inicioSeccion <= posicion) {
        idActual = seccion.id;
      }
    });

    // Cuando llegamos al final de la página, se marca "Abstract".
    var alFinal =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 8;

    if (alFinal) {
      idActual = "abstract";
    }

    enlacesMenu.forEach(function (enlace) {
      var activo = enlace.getAttribute("href") === "#" + idActual;

      enlace.classList.toggle("active", activo);

      if (activo) {
        enlace.setAttribute("aria-current", "true");
      } else {
        enlace.removeAttribute("aria-current");
      }
    });
  }

  /* ----------------------------------------------------------
     4. BARRA DE PROGRESO, CABECERA Y BOTÓN "ARRIBA"
     ---------------------------------------------------------- */
  var pendiente = false;

  function actualizarScroll() {
    var recorrido = window.scrollY;
    var alturaTotal = document.documentElement.scrollHeight - window.innerHeight;
    var porcentaje = alturaTotal > 0 ? (recorrido / alturaTotal) * 100 : 0;

    barraProgreso.style.width = porcentaje + "%";
    cabecera.classList.toggle("scrolled", recorrido > 40);
    botonArriba.classList.toggle("show", recorrido > 600);

    actualizarEnlaceActivo();
    pendiente = false;
  }

  window.addEventListener(
    "scroll",
    function () {
      if (!pendiente) {
        window.requestAnimationFrame(actualizarScroll);
        pendiente = true;
      }
    },
    { passive: true }
  );

  actualizarScroll();

  botonArriba.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ----------------------------------------------------------
     5. ANIMACIONES AL APARECER
     IntersectionObserver avisa cuando un elemento entra en
     pantalla. Si el navegador es muy antiguo, todo se muestra.
     ---------------------------------------------------------- */
  var elementos = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    var observador = new IntersectionObserver(
      function (entradas, observer) {
        entradas.forEach(function (entrada) {
          if (entrada.isIntersecting) {
            entrada.target.classList.add("is-visible");
            observer.unobserve(entrada.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    elementos.forEach(function (elemento) {
      observador.observe(elemento);
    });
  } else {
    elementos.forEach(function (elemento) {
      elemento.classList.add("is-visible");
    });
  }
});
