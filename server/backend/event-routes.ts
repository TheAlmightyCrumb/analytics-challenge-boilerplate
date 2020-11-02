///<reference path="types.ts" />

import express from "express";
import { Request, Response } from "express";

// some useful database functions in here:
import {
  postEvent,
  getAllEvents,
  sortEvents,
  searchValue
} from "./database";
import { Event, weeklyRetentionObject } from "../../client/src/models/event";
import { ensureAuthenticated, validateMiddleware } from "./helpers";

import {
  shortIdValidation,
  searchValidation,
  userFieldsValidator,
  isUserValidator,
} from "./validators";
import { bindAll } from "lodash";
const router = express.Router();

// Routes

interface Filter {
  sorting: string;
  type?: string;
  browser?: string;
  search?: string;
  offset?: number;
}

interface sessionCount {
  date: string;
  count: number;
}

router.get('/all', (req: Request, res: Response) => {
  res.status(200).json(getAllEvents());
});

router.get('/all-filtered', (req: Request, res: Response) => {
  const { sorting, type, browser, search, offset }: Filter = req.query;
  let more = false;
  console.log("sorting: ", sorting);
  let sortedArray:Event[] = sortEvents(getAllEvents(), sorting);
  if (type) sortedArray = sortedArray.filter(event => type === event.name);
  if (browser) sortedArray = sortedArray.filter(event => browser === event.browser);
  if (search) sortedArray = sortedArray.filter(event => searchValue(event, search))
  if (offset) {
    more = true;
    sortedArray = sortedArray.slice(0, offset); 
  }
  res.status(200).json({ events: sortedArray, more })
});

router.get('/by-days/:offset', (req: Request, res: Response) => {
  const eventsArray = getAllEvents();
  const today: Date = new Date();
  const parsedDate: Date = new Date(today.toDateString());
  console.log(parsedDate + " BAAAAA");
  const lastDay: number = today.setDate(today.getDate() - parseInt(req.params.offset));
  const firstDay: number = parsedDate.setDate(parsedDate.getDate() - (parseInt(req.params.offset) + 6));
  const filteredEvents: Event[] = eventsArray.filter(event => event.date <= lastDay && event.date >= firstDay);
  // const countSessions:sessionCount[] = [];
  // for (let i = 0; i < eventsArray.length; i++) {
  //   // if (countSessions)
  // }
  console.log("Today: ", today, " Parsed: ", parsedDate);
  console.log('First Date: ', new Date(firstDay), ' Last Date: ', new Date(lastDay));
  res.status(200).json(filteredEvents);
});

router.get('/by-hours/:offset', (req: Request, res: Response) => {
  res.send('/by-hours/:offset')
});

router.get('/today', (req: Request, res: Response) => {
  res.send('/today')
});

router.get('/week', (req: Request, res: Response) => {
  res.send('/week')
});

router.get('/retention', (req: Request, res: Response) => {
  const {dayZero} = req.query
  res.send('/retention')
});
router.get('/:eventId',(req : Request, res : Response) => {
  res.send('/:eventId')
});

router.post('/', (req: Request, res: Response) => {
  try {
    const event:Event = req.body;
    postEvent(event);
    res.status(200).json({ message: "event added successfully" });
  }
  catch(e) {
    res.status(500).json({ message: "post event failed" });
  }
});

router.get('/chart/os/:time',(req: Request, res: Response) => {
  res.send('/chart/os/:time')
})

  
router.get('/chart/pageview/:time',(req: Request, res: Response) => {
  res.send('/chart/pageview/:time')
})

router.get('/chart/timeonurl/:time',(req: Request, res: Response) => {
  res.send('/chart/timeonurl/:time')
})

router.get('/chart/geolocation/:time',(req: Request, res: Response) => {
  res.send('/chart/geolocation/:time')
})


export default router;
