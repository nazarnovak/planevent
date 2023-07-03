import React from "react";
import { useEffect, useState } from "react";
import { Artist, Day } from "../Dto";
import "./Timeline.css";

interface TimelineProps {
  day: Day;
  currentWeek: number;
  currentDay: number;
}

export function Timeline(props: TimelineProps) {
  const [days, setDays] = useState<TimelineEvent[] | null>(null);

  useEffect(() => {
    setDays(parseEvents(props.day));
  }, [props.day]);

  if (!days || !days.length) {
    return (
      <div className="not-going-today">
        Not going to any artists on this day
      </div>
    );
  }

  return (
    <div id="shared-timeline">
      {days.map((e, i, es) => EventComponent(e, i === 0 ? null : es[i - 1]))}
    </div>
  );
}

function EventComponent(
  timelineEvent: TimelineEvent,
  previous: TimelineEvent | null = null
) {
  const newLocation = previous?.location !== timelineEvent.location;
  return (
    <React.Fragment key={timelineEvent.info.id}>
      {newLocation && (
        <div className="timeline_location">{timelineEvent.location}</div>
      )}
      <div className="timeline_event">
        <div className="timeline_artist">{timelineEvent.info.artist}</div>
        {/* <GoingWithComponent event={timelineEvent} /> */}
        <div className="timeline_time">
          {formatTime(timelineEvent.info.timeStart, timelineEvent.info.timeEnd)}
        </div>
      </div>
    </React.Fragment>
  );
}

function formatTime(start: string, end: string) {
  const startDate = new Date(Date.parse(start));
  const endDate = new Date(Date.parse(end));

  return (
    `${padTime(startDate.getHours())}:${padTime(startDate.getMinutes())} - ` +
    `${padTime(endDate.getHours())}:${padTime(endDate.getMinutes())}`
  );
}

function padTime(timeUnit: number) {
  if (timeUnit < 10) {
    return "0" + timeUnit;
  } else {
    return timeUnit.toString();
  }
}

function parseEvents(day: Day) {
  if (!day) {
    return null;
  }

  const dayDate = Date.parse(day.date);
  const dayName = day.weekDay;
  const dayEvents: TimelineEvent[] = [];
  for (let stage of day.stages) {
    const stageName = stage.stage;
    for (let event of stage.artists) {
      if (!event.attending) continue;

      const start = Date.parse(event.timeStart);
      const end = Date.parse(event.timeEnd);

      const timelineEvent = {
        info: event,
        location: stageName,
        startTs: start,
        endTs: end,
        dayDate: dayDate,
        dayName: dayName,
      };

      dayEvents.push(timelineEvent);
    }
  }

  dayEvents.sort((a, b) => {
    const startDiff = a.startTs - b.startTs;
    if (startDiff < 100) {
      return a.endTs - b.endTs;
    }
    return startDiff;
  });

  return dayEvents;
}

interface TimelineEvent {
  info: Artist;
  startTs: number;
  endTs: number;
  location: string;
  dayDate: number;
  dayName: string;
}
