import * as fs from "fs";
import * as path from "path";

import { generateRandomFilename } from "./lib/utils";
import { IMG_FORMAT, PORT } from "./lib/constants";

import { cors } from "@elysiajs/cors";
import { Elysia, t } from "elysia";

const app = new Elysia();
app.use(cors());

app.get("/", () => {
  return new Response(
    `A custom screenshot uploader, made with <a href="https://elysiajs.com/" target="_blank">Elysia</a>.`,
    {
      headers: {
        "Content-Type": "text/html",
      },
    }
  );
});

app.get("/:filename", async ({ params: { filename } }: any) => {
  const ssFolder = process.env.SS_FOLDER as string;

  let filePath = "";

  // Find the file in the screenshots directory
  for (const userDir of await fs.promises.readdir(ssFolder)) {
    const potentialPath = path.join(ssFolder, userDir, filename);

    if (fs.existsSync(potentialPath)) {
      filePath = potentialPath;
      break;
    }
  }

  if (!filePath) {
    return new Response("File not found", { status: 404 });
  }

  const fileContents = Bun.file(filePath);
  return new Response(fileContents, {
    headers: {
      "Content-Type": `image/${process.env.IMG_FORMAT}`,
    },
  });
});

app.post("/sharex", async ({ body, headers }: any) => {
  const apiKey = headers["x-api-key"];

  if (!apiKey || apiKey !== process.env.API_KEY) {
    return Response.json(
      { error: "Unauthorized" },
      {
        status: 401,
      }
    );
  }

  const image = body.image;
  const user = body.user;

  if (!image) throw new Error("Must upload an image.");
  if (!user) throw new Error("`user` (folder name) must be specified.");

  console.log(`Received screenshot from ${user}`);

  const randomFilename = generateRandomFilename({
    format: IMG_FORMAT,
  });

  const ssFolder = process.env.SS_FOLDER;
  const targetDir = `${ssFolder}/${user}`;

  // Write screenshot to disk using the user's name as the folder name
  console.log(`Writing ${randomFilename} to ${targetDir}`);

  await Bun.write(`${targetDir}/${randomFilename}`, image);
  return new Response(randomFilename);
});

app.listen(PORT);

console.log(`Custom uploader running on port ${PORT}`);
