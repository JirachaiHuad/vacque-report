const puppeteer = require("puppeteer");
const line = require("@line/bot-sdk");
const path = require("path");
const { channelAccessToken, groupId, baseUrl, serverUrl } = require("./configs");

// --------------------- Utils -----------------------
const getCurrentTimeParts = () => {
  const offsetBangkok = (420 + new Date().getTimezoneOffset()) * 60 * 1000;
  const now = new Date(Date.now() + offsetBangkok);
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
  const browser = await puppeteer.launch({ defaultViewport: { width: 800, height: 800 } });
  const page = await browser.newPage();

  return { browser, page };
};

const getResultPage = async (page, id) => {
  if (id.length !== 13) {
    return;
  }

  await page.goto(baseUrl, { waitUntil: "networkidle2" });
  await page.type("input#mat-input-3", id, { delay: 500 });

  const [, submitButton] = await page.$$("button[type=submit]");

  // TODO: check if button disabled

  await submitButton.click({ delay: 1000 });

  // TODO: check of invalid ID card no.

  await page.waitForNavigation();

  if (page.url() !== `${baseUrl}register`) {
    return;
  }

  return page;
};

const waitForPageReady = async (page) => {
  await page.waitForSelector("div.p-4");
};

// --------------------- Line ----------------------
const client = new line.Client({ channelAccessToken });

const sendMessage = async (text, imageUrl) => {
  await client.pushMessage(groupId, { type: "text", text });

  if (imageUrl) {
    await client.pushMessage(groupId, {
      type: "image",
      previewImageUrl: imageUrl,
      originalContentUrl: imageUrl,
    });
  }
};

// --------------------- Main -----------------------
const report = async (id) => {
  const { page, browser } = await setupPage();

  const resultPage = await getResultPage(page, id);

  if (!resultPage) {
    await browser.close();
    return;
  }

  await waitForPageReady(resultPage);

  const { date, month, year, hours, minutes, unix } = getCurrentTimeParts();

  const imageName = `ss__${year}-${month}-${date}__${hours}-${minutes}__no${unix}.jpeg`;
  const imagePath = path.join(__dirname, "screenshots", `${imageName}`);
  await resultPage.screenshot({ path: imagePath });

  await browser.close();

  const updatedAt = `[อัพเดทล่าสุดเมื่อวันที่ ${date}/${month}/${year} เวลา ${hours}:${minutes}]`;
  const imageUrl = `${serverUrl}${imageName}`;
  await sendMessage(updatedAt, imageUrl);

  console.log("++++++++++++ REPORT SUCCEEDED ++++++++++++");
  console.log(`> ID: ${id}`);
  console.log(`> timestamp: ${date}/${month}/${year} - ${hours}:${minutes}`);
  console.log("++++++++++++++++++++++++++++++++++++++++++");
};

module.exports = report;
