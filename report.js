const puppeteer = require("puppeteer");
const line = require("@line/bot-sdk");
const path = require("path");
const { channelAccessToken, groupId } = require("./configs");

// --------------------- Utils -----------------------
const getCurrentTimeParts = () => {
  const now = new Date();
  const unix = now.getTime().toString();
  const date = ("0" + now.getDate()).slice(-2);
  const month = ("0" + (now.getMonth() + 1)).slice(-2);
  const year = now.getFullYear();
  const hours = now.getHours();
  const minutes = ("0" + now.getMinutes()).slice(-2);

  return { date, month, year, hours, minutes, unix };
};

// --------------------- Puppeteer --------------------
const setupPage = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  return { browser, page };
};

const getResultPage = async (page, id) => {
  if (id.length !== 13) {
    return;
  }

  await page.goto("https://kps.udh.go.th/vaccine/", { waitUntil: "networkidle2" });
  await page.type("input#mat-input-3", id, { delay: 500 });

  const [, submitButton] = await page.$$("button[type=submit]");

  // TODO: check if button disabled

  await submitButton.click({ delay: 1000 });

  // TODO: check of invalid ID card no.

  await page.waitForNavigation();

  if (page.url() !== "https://kps.udh.go.th/vaccine/register") {
    return;
  }

  return page;
};

const getResultText = async (page) => {
  await page.waitForSelector("div.p-4");

  const texts = await page.$$eval("mat-label > b", (bs) => bs.map((b) => b.textContent));
  const [resultPart1, resultPart2, , , fullName] = texts.map((t) => t.trim());
  const { date, month, year, hours, minutes } = getCurrentTimeParts();
  const updatedAt = `[อัพเดทล่าสุดเมื่อวันที่ ${date}/${month}/${year} เวลา ${hours}:${minutes}]`;

  return `${updatedAt}\n\n${fullName}\n\n${resultPart1}${resultPart2}`;
};

// --------------------- Line ----------------------
const client = new line.Client({ channelAccessToken });

const sendMessage = async (text, imageUrl) => {
  await client.pushMessage(groupId, { type: "text", text });
  // await client.pushMessage(groupId, { type: "image", previewImageUrl: imageUrl, originalContentUrl: imageUrl });
};

// --------------------- Main -----------------------
const report = async (id) => {
  const { page, browser } = await setupPage();

  const resultPage = await getResultPage(page, id);

  if (!resultPage) {
    await browser.close();
    return;
  }

  const text = await getResultText(resultPage);

  // const { date, month, year, hours, minutes, unix } = getCurrentTimeParts();
  // const imageName = `ss__${year}-${month}-${date}__${hours}-${minutes}__no${unix}.jpeg`;
  // const imagePath = path.join(__dirname, "screenshots", `${imageName}`);
  // await resultPage.screenshot({ path: imagePath });

  await browser.close();

  console.log("============= RESULT =================");
  console.log(text);
  console.log("======================================");

  // const imageUrl = `HTTPS${imageName}`;
  await sendMessage(text);
};

module.exports = report;
