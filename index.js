const fs = require("fs").promises;
const path = require("path");
const axios = require("axios");

async function updateReadmeQuote() {
  const readmePath = path.join(__dirname, "README.md");
  const archivePath = path.join(__dirname, "quotes-archive.txt");
  try {
    const response = await axios.get(
      "https://random-quotes-freeapi.vercel.app/api/random"
    );
    const quote = `"${response.data.quote}" — ${response.data.author}`;
    // Template for replacing inside README
    const markerStart = "<!-- QUOTE-START -->";
    const markerEnd = "<!-- QUOTE-END -->";
    const date = new Date().toISOString().split("T")[0];
    const readmeContent = `**Today's Quote**  \n> ${quote}  \n*Updated on ${date}*\n\nSee past quotes in [quotes-archive.txt](quotes-archive.txt).`;
    let readme = await fs.readFile(readmePath, "utf-8");

    // Replace the section between markers
    const newReadme = readme.replace(
      new RegExp(`${markerStart}[\\s\\S]*${markerEnd}`),
      `${markerStart}\n${readmeContent}\n${markerEnd}`
    );
    await fs.writeFile(readmePath, newReadme);
    await fs.appendFile(archivePath, `${date}: ${quote}\n`);
    console.log("Quote updated successfully");
  } catch (error) {
    console.error("Error updating quote:", error);
    process.exit(1);
  }
}

updateReadmeQuote();
