/* ----------------------------------------
   One OS – Core Engine
   All knobs for theme + behaviour live in OneOSSettings.
---------------------------------------- */

const OneOSSettings = {
  /* ---------- THEME / SKINS ---------- */
  // Change `activeSkin` to swap global look.
  activeSkin: "default",
  skins: {
    default: {
      bg: "#070b10",
      bgElevated: "#0d1118",
      bgSoft: "#141a24",
      accent: "#f4b86f",
      accentSoft: "rgba(244, 184, 111, 0.18)",
      accentStrong: "#ffce85",
      accentMuted: "#8c6b3c",
      textMain: "#f5f7fb",
      textSoft: "#a7b0c8",
      borderSoft: "rgba(255, 255, 255, 0.06)",
    },
    dusk: {
      bg: "#05070b",
      bgElevated: "#121322",
      bgSoft: "#191a2a",
      accent: "#6fe4f4",
      accentSoft: "rgba(111, 228, 244, 0.18)",
      accentStrong: "#b5f1ff",
      accentMuted: "#4b8690",
      textMain: "#f6fbff",
      textSoft: "#a9bbd4",
      borderSoft: "rgba(255, 255, 255, 0.08)",
    },
  },

  /* ---------- GLOBAL BEHAVIOUR ---------- */
  behaviour: {
    // Scroll down hides nav, scroll up reveals.
    navAutoHide: true,

    // How many pixels you need to scroll before nav starts reacting.
    navHideThreshold: 80,
  },

  /* ---------- PAGES (per-view config) ---------- */
  pages: {
    home: {
      key: "home",
      label: "Hub",
      showIntroPanel: true, // turn intro panel on/off here
      introTitle: "Hub Overview",
      introBody:
        "This hub can host your fields, modules, or apps. Duplicate or remove this panel by editing OneOSSettings.pages.home.",
    },
    modes: {
      key: "modes",
      label: "Modes",
      showIntroPanel: true,
      introTitle: "Mode Field",
      introBody:
        "Here you can eventually switch between Creation, Guidance, Observation and other Lucen modes.",
    },
    settings: {
      key: "settings",
      label: "Settings",
      showIntroPanel: true,
      introTitle: "System Settings",
      introBody:
        "These placeholders show where you’ll surface toggles and skins. All controlled from OneOSSettings.",
    },
  },

  /* ---------- SUPPORT / ABOUT ---------- */
  support: {
    // Label for the button under the home orb.
    // Change to "About", "Contact", etc.
    label: "Support",
    title: "Support / About",
    body: "This is placeholder text for Support/About. In a real build, link this to a contact flow, onboarding, or an explainer about how this OS works.",
  },

  /* ---------- MODE / STATE LABELS ---------- */
  topModeLabel: "Guidance",
};

const OneOS = (() => {
  let currentView = "home";
  let lastScrollY = 0;

  function applySkin() {
    const root = document.documentElement;
    const skin =
      OneOSSettings.skins[OneOSSettings.activeSkin] ||
      OneOSSettings.skins.default;

    root.style.setProperty("--bg", skin.bg);
    root.style.setProperty("--bg-elevated", skin.bgElevated);
    root.style.setProperty("--bg-soft", skin.bgSoft);
    root.style.setProperty("--accent", skin.accent);
    root.style.setProperty("--accent-soft", skin.accentSoft);
    root.style.setProperty("--accent-strong", skin.accentStrong);
    root.style.setProperty("--accent-muted", skin.accentMuted);
    root.style.setProperty("--text-main", skin.textMain);
    root.style.setProperty("--text-soft", skin.textSoft);
    root.style.setProperty("--border-soft", skin.borderSoft);
  }

  function initTopRail() {
    const modeIndicator = document.getElementById("topModeIndicator");
    if (modeIndicator) {
      modeIndicator.textContent = OneOSSettings.topModeLabel;
    }
  }

  function initSupportButton() {
    const supportBtn = document.getElementById("navSupportBtn");
    const supportOverlay = document.getElementById("supportOverlay");
    const titleEl = document.getElementById("supportOverlayTitle");
    const bodyEl = document.getElementById("supportOverlayBody");

    if (!supportBtn || !supportOverlay) return;

    // Apply label + text from settings
    supportBtn.textContent = OneOSSettings.support.label || "Support";
    titleEl.textContent = OneOSSettings.support.title || "Support";
    bodyEl.textContent =
      OneOSSettings.support.body || "Placeholder support/about text.";

    supportBtn.addEventListener("click", () => {
      openOverlay("support");
    });
  }

  function initNav() {
    const navModes = document.getElementById("navModesBtn");
    const navHome = document.getElementById("navHomeBtn");
    const navSettings = document.getElementById("navSettingsBtn");

    if (navModes) {
      navModes.addEventListener("click", () => {
        navigate("modes");
        openOverlay("modes"); // tap modes => also open overlay list
      });
    }

    if (navHome) {
      navHome.addEventListener("click", () => {
        navigate("home");
      });
    }

    if (navSettings) {
      navSettings.addEventListener("click", () => {
        navigate("settings");
        openOverlay("settings");
      });
    }

    updateNavActiveState();
  }

  function updateNavActiveState() {
    const navModes = document.getElementById("navModesBtn");
    const navHome = document.getElementById("navHomeBtn");
    const navSettings = document.getElementById("navSettingsBtn");

    [navModes, navHome, navSettings].forEach((btn) => {
      if (!btn) return;
      btn.classList.remove("nav-btn-active");
    });

    if (currentView === "home" && navHome) {
      navHome.classList.add("nav-btn-active");
    } else if (currentView === "modes" && navModes) {
      navModes.classList.add("nav-btn-active");
    } else if (currentView === "settings" && navSettings) {
      navSettings.classList.add("nav-btn-active");
    }
  }

  function initOverlays() {
    const backdrop = document.getElementById("overlayBackdrop");
    const overlays = document.querySelectorAll(".overlay-panel");
    const closeButtons = document.querySelectorAll("[data-overlay-close]");

    if (!backdrop) return;

    backdrop.addEventListener("click", () => {
      closeAllOverlays();
    });

    closeButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        closeAllOverlays();
      });
    });

    // Ensure they start hidden
    overlays.forEach((panel) => {
      panel.classList.remove("overlay-visible");
    });
    backdrop.classList.remove("overlay-visible");
  }

  function openOverlay(kind) {
    const backdrop = document.getElementById("overlayBackdrop");
    const modesOverlay = document.getElementById("modesOverlay");
    const settingsOverlay = document.getElementById("settingsOverlay");
    const supportOverlay = document.getElementById("supportOverlay");

    if (!backdrop) return;

    closeAllOverlays(false); // close first, but keep backdrop control internal

    let target = null;
    if (kind === "modes") target = modesOverlay;
    if (kind === "settings") target = settingsOverlay;
    if (kind === "support") target = supportOverlay;

    if (target) {
      backdrop.classList.add("overlay-visible");
      target.classList.add("overlay-visible");
    }
  }

  function closeAllOverlays(hideBackdrop = true) {
    const backdrop = document.getElementById("overlayBackdrop");
    const overlays = document.querySelectorAll(".overlay-panel");

    overlays.forEach((panel) =>
      panel.classList.remove("overlay-visible")
    );

    if (hideBackdrop && backdrop) {
      backdrop.classList.remove("overlay-visible");
    }
  }

  function initScrollNavBehaviour() {
    if (!OneOSSettings.behaviour.navAutoHide) return;

    const nav = document.getElementById("globalNav");
    if (!nav) return;

    lastScrollY = window.scrollY;

    window.addEventListener("scroll", () => {
      const current = window.scrollY;
      const goingDown = current > lastScrollY;
      const nearBottom =
        window.innerHeight + current >=
        document.body.offsetHeight - 10;

      if (nearBottom) {
        // When you hit the bottom, make sure nav is visible.
        nav.classList.remove("nav-hidden");
      } else if (goingDown && current > OneOSSettings.behaviour.navHideThreshold) {
        nav.classList.add("nav-hidden");
      } else {
        nav.classList.remove("nav-hidden");
      }

      lastScrollY = current;
    });
  }

  function navigate(viewKey) {
    if (!OneOSSettings.pages[viewKey]) {
      console.warn("Unknown view:", viewKey);
      return;
    }
    currentView = viewKey;
    renderView();
    updateNavActiveState();
  }

  function renderView() {
    const container = document.getElementById("viewContainer");
    const introPanel = document.getElementById("introPanel");
    const introTitle = document.getElementById("introTitle");
    const introBody = document.getElementById("introBody");

    if (!container) return;

    const pageConfig =
      OneOSSettings.pages[currentView] || OneOSSettings.pages.home;

    // Intro panel toggle per page
    if (pageConfig.showIntroPanel) {
      introPanel.classList.remove("intro-panel-hidden");
      introTitle.textContent = pageConfig.introTitle || "";
      introBody.textContent = pageConfig.introBody || "";
    } else {
      introPanel.classList.add("intro-panel-hidden");
    }

    // Clear existing view
    container.innerHTML = "";

    // Build view header
    const header = document.createElement("header");
    header.className = "view-header";

    const title = document.createElement("div");
    title.className = "view-title";
    title.textContent = pageConfig.label || currentView;

    const subtitle = document.createElement("div");
    subtitle.className = "view-subtitle";

    if (currentView === "home") {
      subtitle.textContent = "Unified hub for all fields and modules.";
    } else if (currentView === "modes") {
      subtitle.textContent = "Where state and mode logic will eventually live.";
    } else if (currentView === "settings") {
      subtitle.textContent = "Adjust One OS behaviour, skins, and defaults.";
    }

    header.appendChild(title);
    header.appendChild(subtitle);
    container.appendChild(header);

    // Body of each view
    if (currentView === "home") {
      renderHome(container);
    } else if (currentView === "modes") {
      renderModes(container);
    } else if (currentView === "settings") {
      renderSettings(container);
    }
  }

  function renderHome(container) {
    const { createCard } = window.OneOSComponents;

    const grid = document.createElement("div");
    grid.className = "card-grid";

    const modules = [
      {
        title: "Fieldwright",
        summary: "Your modular field OS – build, tag, and track your worlds.",
        meta: "Module • Core field engine",
      },
      {
        title: "HelpToHeal",
        summary: "Healing tools and maps. A quieter space for tough days.",
        meta: "Module • Care & recovery",
      },
      {
        title: "MindSetFree",
        summary: "Gentle mindset untangling and narrative rewriting.",
        meta: "Module • Inner work",
      },
      {
        title: "Farm OS",
        summary: "Bridge between soil, sky, and system. Physical field mapper.",
        meta: "Module • Sovereign field",
      },
    ];

    modules.forEach((m) => {
      const card = createCard({
        title: m.title,
        summary: m.summary,
        meta: m.meta,
        buttonLabel: "Open",
        onOpen: () => {
          alert(`Placeholder: open ${m.title} here.`);
        },
      });
      grid.appendChild(card);
    });

    container.appendChild(grid);
  }

  function renderModes(container) {
    const { createCard } = window.OneOSComponents;

    const grid = document.createElement("div");
    grid.className = "card-grid";

    const modes = [
      {
        title: "Creation Mode",
        summary:
          "You drive. All dials manual, high sensitivity, immediate feedback.",
        meta: "Manual • High agency",
      },
      {
        title: "Guidance Mode",
        summary:
          "The OS breathes with you. Dials drift from pattern and reflection.",
        meta: "Default • Living state",
      },
      {
        title: "Observation Mode",
        summary:
          "Stillness. Pure archival. No influence, just recording of rhythm.",
        meta: "Passive • Archive",
      },
      {
        title: "Dream Mode",
        summary:
          "Sandbox where future branches and what-ifs can be explored safely.",
        meta: "Sandbox • Simulation",
      },
    ];

    modes.forEach((m) => {
      const card = createCard({
        title: m.title,
        summary: m.summary,
        meta: m.meta,
        buttonLabel: "Details",
        onOpen: () => {
          alert(`Placeholder: configure ${m.title} here.`);
        },
      });
      grid.appendChild(card);
    });

    container.appendChild(grid);
  }

  function renderSettings(container) {
    const { createToggle } = window.OneOSComponents;

    const list = document.createElement("div");
    list.className = "settings-list";

    // These are EXAMPLES showing where toggles will go.
    list.appendChild(
      createToggle("Show intro panel on Hub", OneOSSettings.pages.home.showIntroPanel)
    );
    list.appendChild(
      createToggle(
        "Auto-hide nav on scroll",
        OneOSSettings.behaviour.navAutoHide
      )
    );
    list.appendChild(
      createToggle("Guidance as default mode", true)
    );

    container.appendChild(list);

    const note = document.createElement("p");
    note.className = "view-subtitle";
    note.style.marginTop = "6px";
    note.textContent =
      "Edit settings in OneOSSettings (app.js). Wire real toggles later without rewriting the engine.";
    container.appendChild(note);
  }

  function init() {
    applySkin();
    initTopRail();
    initNav();
    initOverlays();
    initSupportButton();
    initScrollNavBehaviour();
    renderView();
  }

  document.addEventListener("DOMContentLoaded", init);

  return {
    navigate,
    settings: OneOSSettings,
  };
})();
