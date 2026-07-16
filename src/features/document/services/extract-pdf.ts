import PDFParser from "pdf2json";

function safeDecode(text: string): string {
  try {
    return decodeURIComponent(text);
  } catch {
    return text;
  }
}

export async function extractPdf(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser(undefined, true);

    pdfParser.on("pdfParser_dataError", (error: unknown) => {
      if (
        typeof error === "object" &&
        error !== null &&
        "parserError" in error
      ) {
        reject((error as { parserError: Error }).parserError);
        return;
      }

      if (error instanceof Error) {
        reject(error);
        return;
      }

      reject(new Error("Unknown PDF parsing error."));
    });

    pdfParser.on("pdfParser_dataReady", (pdfData) => {
      try {
        const pages = pdfData.Pages ?? [];

        const text = pages
          .map((page) =>
            (page.Texts ?? [])
              .flatMap((textItem) =>
                (textItem.R ?? []).map((run) => {
                  const value = run.T ?? "";

                  // รองรับทั้งข้อความที่ encode และไม่ encode
                  return safeDecode(value).replace(/\+/g, " ");
                }),
              )
              .join(" "),
          )
          .join("\n\n")
          .replace(/\s+/g, " ")
          .trim();

        resolve(text);
      } catch (error) {
        reject(error);
      }
    });

    pdfParser.parseBuffer(buffer);
  });
}