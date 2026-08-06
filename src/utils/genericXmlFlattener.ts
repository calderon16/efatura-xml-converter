import type { TabularData } from '../types/generic';

/**
 * Schema-agnostic XML -> table flattener for General XML Mode. Unlike xmlParser.ts (which knows
 * the UBL-TR shape up front), this has no prior knowledge of the document's structure, so it has
 * to guess where one "row" ends and the next begins.
 */

interface RecordCandidate {
  name: string;
  count: number;
}

/** Finds the element local-name that repeats most often anywhere in the document - our best guess
 *  at the "one element = one row" record boundary. Falls back to the root's direct children when
 *  no tag repeats (e.g. a single flat record with no obvious list wrapper). */
function detectRecordElement(root: Element): { name: string; elements: Element[] } {
  const counts = new Map<string, Element[]>();
  const all = root.getElementsByTagName('*');

  for (let i = 0; i < all.length; i++) {
    const el = all[i];
    const name = el.localName || el.tagName;
    const list = counts.get(name);
    if (list) {
      list.push(el);
    } else {
      counts.set(name, [el]);
    }
  }

  let best: RecordCandidate | null = null;
  for (const [name, elements] of counts) {
    if (elements.length > 1 && (!best || elements.length > best.count)) {
      best = { name, count: elements.length };
    }
  }

  if (best) {
    return { name: best.name, elements: counts.get(best.name)! };
  }

  // No repeating tag anywhere - treat each direct child of the root as one record.
  const directChildren = Array.from(root.children);
  return { name: root.localName || root.tagName, elements: directChildren.length > 0 ? directChildren : [root] };
}

/** Flattens one record element into a column-key -> value map, using dot-paths for nested
 *  elements (rooted at the record's own tag name) and `[n]` suffixes to disambiguate repeated
 *  sibling tags. */
function flattenRecord(record: Element): Map<string, string> {
  const values = new Map<string, string>();
  const siblingIndex = new Map<string, number>();

  function keyFor(path: string): string {
    const n = (siblingIndex.get(path) || 0) + 1;
    siblingIndex.set(path, n);
    return n === 1 ? path : `${path}[${n}]`;
  }

  function walk(el: Element, path: string) {
    for (let i = 0; i < el.attributes.length; i++) {
      const attr = el.attributes[i];
      values.set(keyFor(`${path}.@${attr.name}`), attr.value.trim());
    }

    const childElements = Array.from(el.children);
    if (childElements.length === 0) {
      const text = el.textContent?.trim() || '';
      if (text) values.set(keyFor(path), text);
      return;
    }

    for (const child of childElements) {
      const childName = child.localName || child.tagName;
      walk(child, `${path}.${childName}`);
    }
  }

  const recordName = record.localName || record.tagName;
  walk(record, recordName);

  return values;
}

function flattenOneFile(xmlString: string): { headers: string[]; rows: (string | number)[][]; recordElementName: string } | null {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, 'text/xml');
  if (doc.getElementsByTagName('parsererror').length > 0) {
    return null;
  }

  const { name, elements } = detectRecordElement(doc.documentElement);
  if (elements.length === 0) return null;

  const recordMaps = elements.map(flattenRecord);

  const headerOrder: string[] = [];
  const headerSet = new Set<string>();
  for (const map of recordMaps) {
    for (const key of map.keys()) {
      if (!headerSet.has(key)) {
        headerSet.add(key);
        headerOrder.push(key);
      }
    }
  }

  const rows = recordMaps.map((map) => headerOrder.map((h) => map.get(h) ?? ''));

  return { headers: headerOrder, rows, recordElementName: name };
}

export function flattenXmlFiles(files: { name: string; content: string }[]): TabularData {
  const unsupportedFiles: string[] = [];
  const headerOrder: string[] = [];
  const headerSet = new Set<string>();
  const perFileRows: { headers: string[]; rows: (string | number)[][] }[] = [];
  let recordElementName: string | undefined;

  for (const file of files) {
    const result = flattenOneFile(file.content);
    if (!result || result.headers.length === 0) {
      unsupportedFiles.push(file.name);
      continue;
    }

    if (!recordElementName) recordElementName = result.recordElementName;

    for (const h of result.headers) {
      if (!headerSet.has(h)) {
        headerSet.add(h);
        headerOrder.push(h);
      }
    }

    perFileRows.push(result);
  }

  // Re-align every file's rows against the final, unioned header order (a column discovered in a
  // later file must still line up correctly for rows collected from an earlier one).
  const rows: (string | number)[][] = [];
  for (const file of perFileRows) {
    const indexInFile = new Map(file.headers.map((h, i) => [h, i]));
    for (const row of file.rows) {
      rows.push(headerOrder.map((h) => {
        const i = indexInFile.get(h);
        return i === undefined ? '' : row[i];
      }));
    }
  }

  return {
    headers: headerOrder,
    rows,
    recordElementName,
    unsupportedFiles,
  };
}
