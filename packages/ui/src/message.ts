export type BiuMessageType = "success" | "info" | "warning" | "error";

export interface BiuMessageOptions {
  type?: BiuMessageType;
  duration?: number;
  id?: string;
  closable?: boolean;
}

let sequence = 0;
const activeMessages = new Map<string, { element: HTMLElement; timer?: number }>();

function host() {
  if (typeof document === "undefined") return undefined;
  let element = document.querySelector<HTMLElement>("[data-biu-message-host]");
  if (element) return element;
  element = document.createElement("div");
  element.dataset.biuMessageHost = "true";
  document.body.appendChild(element);
  return element;
}

function removeById(id: string) {
  const record = activeMessages.get(id);
  if (!record) return;
  activeMessages.delete(id);
  record.element.classList.add("biu-message-leaving");
  window.setTimeout(() => record.element.remove(), 160);
}

function show(content: string, options: BiuMessageOptions = {}) {
  const container = host();
  if (!container) return "";
  const type = options.type || "info";
  const id = options.id || `biu-message-${Date.now()}-${sequence++}`;
  const existing = activeMessages.get(id);
  if (existing) {
    existing.element.querySelector<HTMLElement>("[data-biu-message-content]")!.textContent = content;
    existing.element.className = `biu-message biu-message-${type}`;
    if (existing.timer) window.clearTimeout(existing.timer);
    const duration = options.duration ?? 3200;
    existing.timer = duration > 0 ? window.setTimeout(() => removeById(id), duration) : undefined;
    return id;
  }
  const element = document.createElement("div");
  element.className = `biu-message biu-message-${type}`;
  element.dataset.messageId = id;
  element.setAttribute("role", type === "error" ? "alert" : "status");
  const icon = document.createElement("span");
  icon.className = "biu-message-icon";
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = type === "success" ? "✓" : type === "warning" ? "!" : type === "error" ? "×" : "i";
  const text = document.createElement("span");
  text.dataset.biuMessageContent = "true";
  text.textContent = content;
  element.append(icon, text);
  if (options.closable !== false) {
    const close = document.createElement("button");
    close.type = "button";
    close.className = "biu-message-close";
    close.setAttribute("aria-label", "Close");
    close.textContent = "×";
    close.addEventListener("click", () => removeById(id));
    element.appendChild(close);
  }
  container.appendChild(element);
  const duration = options.duration ?? 3200;
  activeMessages.set(id, {
    element,
    timer: duration > 0 ? window.setTimeout(() => removeById(id), duration) : undefined,
  });
  return id;
}

export const biuMessage = {
  show,
  success: (content: string, options?: Omit<BiuMessageOptions, "type">) =>
    show(content, { ...options, type: "success" }),
  info: (content: string, options?: Omit<BiuMessageOptions, "type">) => show(content, { ...options, type: "info" }),
  warning: (content: string, options?: Omit<BiuMessageOptions, "type">) =>
    show(content, { ...options, type: "warning" }),
  error: (content: string, options?: Omit<BiuMessageOptions, "type">) => show(content, { ...options, type: "error" }),
  close: (id: string) => removeById(id),
  clear: () => [...activeMessages.keys()].forEach(removeById),
};
