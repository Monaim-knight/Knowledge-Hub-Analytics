import { inferMimeType } from "@/lib/allowed-file-types";

/**
 * Read a browser File as a data URL, fixing missing/generic MIME types
 * so the backend can store the correct extension (Rmd, PDF, HTML, etc.).
 */
export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      let result = String(reader.result || "");
      if (!result.startsWith("data:")) {
        reject(new Error("Failed to read file"));
        return;
      }

      const inferred = inferMimeType(file.name, file.type);
      const reported = (file.type || "").trim().toLowerCase();
      const needsFix =
        !reported ||
        reported === "application/octet-stream" ||
        (inferred !== "application/octet-stream" && inferred !== reported);

      if (needsFix && inferred !== "application/octet-stream") {
        const comma = result.indexOf(",");
        if (comma !== -1) {
          result = `data:${inferred};base64,${result.slice(comma + 1)}`;
        }
      }

      resolve(result);
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}
