/* ----------------------------------------
   One OS – Reusable UI Components
   Keep this file dumb & generic.
---------------------------------------- */

window.OneOSComponents = {
  /**
   * Create a generic tile/card for modules/fields.
   * Use this for hub modules, fields, or apps.
   */
  createCard({ title, summary, meta, buttonLabel, onOpen }) {
    const card = document.createElement("article");
    card.className = "card";

    const t = document.createElement("div");
    t.className = "card-title";
    t.textContent = title;
    card.appendChild(t);

    if (summary) {
      const s = document.createElement("div");
      s.className = "card-summary";
      s.textContent = summary;
      card.appendChild(s);
    }

    if (meta) {
      const m = document.createElement("div");
      m.className = "card-meta";
      m.textContent = meta;
      card.appendChild(m);
    }

    const footer = document.createElement("div");
    footer.className = "card-footer";

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "card-button";
    btn.textContent = buttonLabel || "Open";
    btn.onclick = () => {
      if (typeof onOpen === "function") onOpen();
    };

    footer.appendChild(btn);
    card.appendChild(footer);

    return card;
  },

  /**
   * Simple "fake" toggle display:
   * This is purely visual; wiring logic is optional.
   */
  createToggle(label, isOn) {
    const row = document.createElement("div");
    row.className = "settings-item";

    const span = document.createElement("span");
    span.textContent = label;
    row.appendChild(span);

    const pill = document.createElement("div");
    pill.className = "toggle-pill";

    const knob = document.createElement("div");
    knob.className = "toggle-knob";
    if (isOn) {
      knob.style.transform = "translateX(16px)";
    }

    pill.appendChild(knob);
    row.appendChild(pill);

    return row;
  },
};
