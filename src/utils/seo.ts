export interface PageSeoPayload {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article';
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
}

function upsertMeta(attrName: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector(`meta[${attrName}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonical(href: string) {
  let link = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

function resolveAbsoluteUrl(pathOrUrl: string): string {
  if (!pathOrUrl) return window.location.origin;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const clean = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return `${window.location.origin}${clean}`;
}

export function applyPageSeo(payload: PageSeoPayload) {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;

  const title = payload.title.trim();
  const description = payload.description.trim();
  const canonicalUrl = resolveAbsoluteUrl(payload.path || window.location.pathname);
  const imageUrl = resolveAbsoluteUrl(
    payload.image || '/assets/edunexa-logo-og.png'
  );
  const ogType = payload.type || 'website';

  document.title = title;
  upsertMeta('name', 'description', description);
  upsertCanonical(canonicalUrl);

  // Open Graph
  upsertMeta('property', 'og:type', ogType);
  upsertMeta('property', 'og:site_name', 'EDUNEXA AI');
  upsertMeta('property', 'og:locale', 'vi_VN');
  upsertMeta('property', 'og:title', title);
  upsertMeta('property', 'og:description', description);
  upsertMeta('property', 'og:url', canonicalUrl);
  upsertMeta('property', 'og:image', imageUrl);

  // Twitter / X Card
  upsertMeta('name', 'twitter:card', 'summary_large_image');
  upsertMeta('name', 'twitter:title', title);
  upsertMeta('name', 'twitter:description', description);
  upsertMeta('name', 'twitter:image', imageUrl);

  // Dynamic Schema.org JSON-LD
  const scriptId = 'edunexa-dynamic-jsonld';
  const existing = document.getElementById(scriptId);
  if (payload.jsonLd) {
    const script =
      (existing as HTMLScriptElement | null) || document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(payload.jsonLd);
    if (!existing) {
      document.head.appendChild(script);
    }
  } else if (existing) {
    existing.remove();
  }
}
