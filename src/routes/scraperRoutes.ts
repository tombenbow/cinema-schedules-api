import { CronTimeZones, CronTimes } from "../enums/cronEnums";
import { Express } from "express";
import * as cron from "node-cron";
import { invokeScrapers } from "../services/manageScrapers/invokeScrapers";

const sayTheTime = () => {
  console.log(`hello world, the time is: ${new Date()}`);
};

export const scraperRoutes = (app: Express) => {
  cron.schedule(CronTimes.EVERY_MINUTE, sayTheTime, {
    scheduled: true,
    timezone: CronTimeZones.UK_TIME
  });
  cron.schedule(CronTimes.EVERY_FOUR_MINUTES, invokeScrapers, {
    scheduled: true,
    timezone: CronTimeZones.UK_TIME
  });
};
