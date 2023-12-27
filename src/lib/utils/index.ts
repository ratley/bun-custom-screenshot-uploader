import { v4 as uuidv4 } from "uuid";
import { IMG_FORMAT as DEFAULT_IMG_FORMAT } from "../constants";

export function generateRandomFilename({
  prefix = "",
  format = DEFAULT_IMG_FORMAT,
}): string {
  const chars = uuidv4().replace(/-/g, "");
  const length = Math.random() < 0.5 ? 4 : 5; // Randomly choose between 4 and 5
  let filename = chars.substring(0, length);

  return `${prefix ? `${prefix}-` : ""}${filename}.${format}`;
}
