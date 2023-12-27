import * as fs from "fs";
import * as path from "path";

import { generateRandomFilename } from "./lib/utils";
import { IMG_FORMAT, PORT } from "./lib/constants";

Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);

    if (url.pathname === "/")
      return new Response("A Custom Screenshot Uploader", {
        headers: {
          "Content-Type": "text/html",
        },
      });

    if (url.pathname === "/sharex") {
      const apiKey = req.headers.get("x-api-key");

      if (!apiKey || apiKey !== process.env.API_KEY) {
        return Response.json(
          { error: "Unauthorized" },
          {
            status: 401,
          }
        );
      }

      const formdata = await req.formData();

      const image = formdata.get("image");
      const user = formdata.get("user");

      if (!image) throw new Error("Must upload an image.");
      if (!user) throw new Error("`user` (folder name) must be specified.");

      console.log(`Received screenshot from ${user}`);

      const randomFilename = generateRandomFilename({
        format: IMG_FORMAT,
      });

      const ssFolder = process.env.SS_FOLDER; //
      const targetDir = `${ssFolder}/${user}`;

      // Write screenshot to disk using the user's name as the folder name
      console.log(`Writing ${randomFilename} to ${targetDir}`);

      await Bun.write(`${targetDir}/${randomFilename}`, image);
      return new Response(randomFilename);
    }

    // Handle requests for image files
    if (url.pathname.endsWith(`.${process.env.IMG_FORMAT}`)) {
      const ssFolder = process.env.SS_FOLDER as string;
      const filename = url.pathname.slice(1); // Remove the leading '/'

      // Find the file in the screenshots directory
      let filePath = "";
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
    }

    return new Response("Not Found", { status: 404 });
  },
});

console.log(`Custom uploader running on port ${PORT}`);
