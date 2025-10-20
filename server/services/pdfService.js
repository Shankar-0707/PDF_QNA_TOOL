import { PDFParse } from 'pdf-parse';
import fs from 'fs';

/**
 * Extracts text from a PDF file path.
 * @param {string} filePath - The temporary path of the uploaded file.
 * @returns {Promise<string>} The extracted text.
 */
export async function extractTextFromPDF(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const parser = new PDFParse({ data: dataBuffer });
        const textResult = await parser.getText();
    return textResult.text;
  } catch (error) {
    console.error("Error parsing PDF file:", error);
    throw new Error("PDF processing failed. Could not extract text.");
  }
}
