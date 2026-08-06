// Shared shape for bilingual (EN/TR) content fields in src/data/*.ts. Slugs stay single/canonical
// across languages (so a URL works the same regardless of the viewer's language); only the
// displayed text varies. Components read `field[lang]` via useTranslation()'s `lang`.
export interface LocalizedString {
  en: string;
  tr: string;
}
