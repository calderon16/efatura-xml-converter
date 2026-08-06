// JSON.stringify does not escape "<", so a value containing a literal "</script>" sequence would
// break out of the <script type="application/ld+json"> tag it's injected into via
// dangerouslySetInnerHTML. Escaping "<" to its unicode form is the standard mitigation — valid JSON
// is unaffected (parsers treat < identically to a literal "<").
export function safeJsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
