// Generic (schema-agnostic) tabular data shape shared by General XML Mode
// and by Invoice Mode's CSV/PDF exports.

export interface TabularData {
  headers: string[];
  rows: (string | number)[][];
  /** Local element name that was detected as the repeating "record" boundary, if any. */
  recordElementName?: string;
  /** Files that failed to parse or contained no detectable record structure. */
  unsupportedFiles: string[];
}
