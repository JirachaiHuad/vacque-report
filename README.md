# Vaccine Schedule Report

> **Automatically check and report an update on a vaccination schedule.**

## Description

Due to postponement of vaccination rollout, it is advised to check on a particular website to see if there is any update.

It is considered to be challenging for my parents to go to the website and check for the update themselve, so I made this to assist them on such tasks.

The purpose of this small application is to automate tasks where it goes to a particular website, fill-in some form, get a result with screenshot and send them via messaging app's bot.

> This application is for personal use and meant to be quick, simple and cost-effective.

> This application is deterministic and configured in a very specific way.

## Technologies

- [Puppepteer](https://github.com/puppeteer/puppeteer)
  - for site crawling and taking screenshots
- [LINE Messaging API SDK for nodejs](https://github.com/line/line-bot-sdk-nodejs)
  - for sending messages via LINE Messaging API (Line Bot)
- [Node Cron](https://github.com/node-cron/node-cron)
  - for scheduling tasks
- [Express](https://github.com/expressjs/express)
  - for serving screenshots via https

## Authors

Jirachai U.
