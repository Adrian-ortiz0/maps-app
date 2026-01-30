const { writeFileSync, mkdirSync } = require("fs");

require("dotenv").config();

const targetPath = "./src/environments/environment.ts";
const targetPathDev = "./src/environments/environment.development.ts";

if (!process.env["MAPBOX_KEY"]) {
  throw new Error("MAPBOX_KEY is not set");
}

const envFileContent = `

    export const environment = {
    mapboxKey: "${process.env["MAPBOX_KEY"]}",
};


`;

mkdirSync('./src/environments', {recursive: true});

writeFileSync(targetPath, envFileContent);
writeFileSync(targetPathDev, envFileContent);
