/** RFC 6068: mailto body line breaks are CRLF. */
function toMailtoBody(text: string): string {
  return text.replace(/\r\n?/g, "\n").replace(/\n/g, "\r\n");
}

export function buildMailtoHref(subject: string, body: string): string {
  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(toMailtoBody(body))}`;
}

const TRUNCATION_NOTE = "\n\n(The list was shortened so your mail app could open it.)";

function hrefCarriesBody(href: string): boolean {
  try {
    const a = document.createElement("a");
    a.setAttribute("href", href);
    const stored = a.getAttribute("href") ?? "";
    return stored.startsWith("mailto:") && stored.includes("body=");
  } catch {
    return false;
  }
}

function launchMailto(href: string): boolean {
  if (!hrefCarriesBody(href)) return false;
  try {
    const a = document.createElement("a");
    a.setAttribute("href", href);
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    a.remove();
    return true;
  } catch {
    return false;
  }
}

/**
 * Open a draft with the full list in the mailto body. Never copies to the
 * clipboard. Only shortens the body if the browser rejects the full href.
 */
export function openMailto(subject: string, body: string): void {
  const full = buildMailtoHref(subject, body);
  if (launchMailto(full)) return;

  let low = 0;
  let high = body.length;
  let bestHref: string | null = null;

  while (low <= high) {
    const mid = (low + high) >> 1;
    const candidate = `${body.slice(0, mid).replace(/[\s\r\n]+$/, "")}${TRUNCATION_NOTE}`;
    const href = buildMailtoHref(subject, candidate);
    if (hrefCarriesBody(href)) {
      bestHref = href;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  if (bestHref) launchMailto(bestHref);
}
