import JSZip from "jszip";
import { parseStringPromise } from "xml2js";

type TextNode = {
  $?: {
    "xml:space"?: string;
  };
  _?: string;
};

function extractText(node: unknown, texts: string[]) {
  if (!node) return;

  if (Array.isArray(node)) {
    node.forEach((item) => extractText(item, texts));
    return;
  }

  if (typeof node !== "object") return;

  const obj = node as Record<string, unknown>;

  for (const [key, value] of Object.entries(obj)) {
    if (key === "a:t") {
      const values = Array.isArray(value) ? value : [value];

      for (const item of values) {
        const text = item as TextNode;

        if (typeof text === "string") {
          texts.push(text);
        } else if (text?._) {
          texts.push(text._);
        }
      }

      continue;
    }

    extractText(value, texts);
  }
}

export async function extractPptx(buffer: Buffer): Promise<string> {
  const zip = await JSZip.loadAsync(buffer);

  const slideFiles = Object.keys(zip.files)
    .filter((file) => file.startsWith("ppt/slides/slide"))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  const output: string[] = [];

  for (const file of slideFiles) {
    const xml = await zip.file(file)?.async("text");

    if (!xml) continue;

    const parsed = await parseStringPromise(xml);

    const texts: string[] = [];

    extractText(parsed, texts);

    if (texts.length > 0) {
      output.push(texts.join(" "));
    }
  }

  return output.join("\n\n").trim();
}