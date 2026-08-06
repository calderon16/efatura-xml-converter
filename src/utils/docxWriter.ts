import { saveOrShareFile } from './nativeDownload';

// Generates a .docx file from extracted PDF page text, entirely client-side. Dynamically imported
// so the docx library never ships in the main bundle, matching this project's established
// heavy-lib convention (see excelGenerator.ts/pdfGenerator.ts).
export async function exportPagesToDocx(pages: string[], fileName: string): Promise<void> {
  const { Document, Packer, Paragraph, HeadingLevel } = await import('docx');

  const doc = new Document({
    sections: [
      {
        children: pages.flatMap((pageText, i) => [
          new Paragraph({ text: `Page ${i + 1}`, heading: HeadingLevel.HEADING_2 }),
          ...pageText
            .split('\n')
            .filter((line) => line.trim().length > 0)
            .map((line) => new Paragraph({ text: line })),
        ]),
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  await saveOrShareFile(
    blob,
    fileName,
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  );
}
