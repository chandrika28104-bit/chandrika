/**
 * Client-side file parser supporting PDF, TXT, and Markdown files
 */

declare global {
  interface Window {
    pdfjsLib?: any;
  }
}

export async function extractTextFromFile(file: File): Promise<string> {
  const fileType = file.type;
  const fileName = file.name.toLowerCase();

  // If plain text or markdown
  if (
    fileType === 'text/plain' ||
    fileType === 'text/markdown' ||
    fileName.endsWith('.txt') ||
    fileName.endsWith('.md')
  ) {
    return await file.text();
  }

  // If PDF
  if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
    return await extractTextFromPDF(file);
  }

  // Fallback try text
  try {
    const text = await file.text();
    if (text && text.trim().length > 20) {
      return text;
    }
  } catch (err) {
    // Continue
  }

  throw new Error(
    `Unsupported file format (${file.name}). Please upload a .pdf, .txt, or .md file, or paste your text directly.`
  );
}

async function extractTextFromPDF(file: File): Promise<string> {
  if (!window.pdfjsLib) {
    await new Promise((resolve) => setTimeout(resolve, 800));
  }

  if (!window.pdfjsLib) {
    throw new Error(
      'PDF parser library is still initializing. Please wait a moment or paste your resume text directly.'
    );
  }

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = window.pdfjsLib.getDocument({ data: arrayBuffer });
  const pdfDoc = await loadingTask.promise;

  let fullText = '';
  const numPages = pdfDoc.numPages;

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdfDoc.getPage(pageNum);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ');
    fullText += `--- Page ${pageNum} ---\n${pageText}\n\n`;
  }

  const cleanText = fullText.trim();
  if (!cleanText) {
    throw new Error(
      'Could not extract text from this PDF. It might be a scanned image. Please copy-paste the resume text directly.'
    );
  }

  return cleanText;
}
