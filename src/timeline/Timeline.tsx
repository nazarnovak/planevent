import React from "react";
import { useEffect, useState } from "react";
import { Artist, Schedule, User } from "../Dto";
import "./Timeline.css";
type ClickListener = (attendees:User[]) => void;

export function Timeline(p:{
        schedule:Schedule[],
        onEventClick:ClickListener}) {

    const [days, setDays] = useState<TimelineDay[] | null>(null);

    useEffect(() => {
        setDays(parseEvents(p.schedule));
        const interval = setInterval(() => setDays(parseEvents(p.schedule)), 60 * 1000);
        return () => clearInterval(interval);
    }, [p.schedule]);

    if (!days || !days.length) {
        return (<></>);
    }

    return (<div id="Timeline">
        {days.map((e, i) => DayComponent(e, i, p.onEventClick))}
    </div>);
}

function DayComponent(day:TimelineDay, index:number, onEventClick:ClickListener) {
    return (<div key={index}>
        {day.currentEvent && <h2 className="timeline_title">Currently:</h2>}
        {day.currentEvent && EventComponent(onEventClick, day.currentEvent)}
        <h2 className="timeline_title">{formatCountDown(day, index)}</h2>
        {day.futureEvents.map((e, i, es) => EventComponent(onEventClick, e, i === 0 ? null : es[i-1])) }
    </div>);
}

function EventComponent(onEventClicked:ClickListener, timelineEvent:TimelineEvent, previous:TimelineEvent | null = null) {
    const newLocation = previous?.location !== timelineEvent.location;
    return (
            <React.Fragment key={timelineEvent.info.id}>
                {newLocation && <div className="timeline_location">{timelineEvent.location}</div>}
                <div onClick={() => onEventClicked(timelineEvent.info.attendees)} className="timeline_event">
                    <div className="timeline_artist" >{timelineEvent.info.artist}</div>
                    <GoingWithComponent event={timelineEvent} />
                    <div className="timeline_time">{formatTime(timelineEvent.info.timeStart, timelineEvent.info.timeEnd)}</div>
                </div>
            </React.Fragment>);
}

function GoingWithComponent(p:{event:TimelineEvent}) {
    const attendess = p.event.info.attendees;
    if (!attendess.length) {
        return (<></>);
    }

    if (attendess.length === 1) {
        return (<div className="timeline_with">
            {`with ${attendess[0].name}`}
        </div>);
    }

    return (<div className="timeline_with">
        with {attendess.length} people
    </div>);
}

function formatCountDown(day:TimelineDay, index:number){
    let minutes = day.timeTillFuture / 1000 / 60;
    let hours = minutes / 60;
    let days = hours / 24;

    if (days > 1 || index > 0) {
        return formatDay(day.date, day.name);
    }

    if (hours > 1) {
        const count = Math.round(hours);
        return `In ${count} ${count === 1 ? "hour" : "hours"}:`;
    }

    if (minutes > 1) {
        const count = Math.floor(minutes);
        return `In ${count} ${count === 1 ? "minute" : "minutes"}:`;
    }

    return "";
}

function formatDay(date:Date, dayName:string) {
    return `${dayName} ${padTime(date.getDate())}.${padTime(date.getMonth())}`;
}

function formatTime(start:string, end:string) {
    const startDate = new Date(Date.parse(start));
    const endDate = new Date(Date.parse(end));

    return `${padTime(startDate.getHours())}:${padTime(startDate.getMinutes())} - `
     + `${padTime(endDate.getHours())}:${padTime(endDate.getMinutes())}`;
}

function padTime(timeUnit:number) {
    if (timeUnit < 10) {
        return "0" + timeUnit;
    } else {
        return timeUnit.toString();
    }
}

function parseEvents(schedule:Schedule[]) {

    if (!schedule || !schedule.length) {
        return null;
    }
    const now = Date.now();
    let days:TimelineDay[] = [];
    for (let week of schedule) {
        for (let day of week.days) {
            const dayDate = Date.parse(day.date);
            const dayName = day.weekDay;
            const dayEvents:TimelineEvent[] = [];
            for (let stage of day.stages) {
                const stageName = stage.stage;
                for (let event of stage.artists) {

                    if (!event.attending) continue;

                    const start = Date.parse(event.timeStart);
                    const end = Date.parse(event.timeEnd);
                    if (now > end) continue;

                    const timelineEvent = {
                        info: event,
                        location: stageName,
                        startTs: start,
                        endTs: end,
                        dayDate: dayDate,
                        dayName: dayName
                    };

                    dayEvents.push(timelineEvent);
                }
            }
            if (dayEvents.length) {
                days.push({
                    date:new Date(Date.parse(day.date)),
                    name:day.weekDay,
                    futureEvents:dayEvents,
                    timeTillFuture: 0,
                    currentEvent: undefined
                });
            }
        }
    }

    if (!days.length) {
        return null;
    }

    for(let day of days) {
        day.futureEvents.sort((a, b) => {
            const startDiff = a.startTs - b.startTs;
            if (startDiff < 100) {
                return a.endTs - b.endTs;
            }
            return startDiff;
        });

        const first = day.futureEvents[0];
        if (first.startTs <= now) {
            day.currentEvent = day.futureEvents.shift();
        }

        if (day.futureEvents.length) {
            const nextEvent = day.futureEvents[0];
            day.timeTillFuture = Math.max(nextEvent.startTs - now, first.endTs - now);
        }
    }

    return days;
}

interface TimelineEvent {
    info: Artist;
    startTs: number;
    endTs: number;
    location: string;
    dayDate: number;
    dayName: string;
}

interface TimelineDay {
    date:Date;
    name:string;
    currentEvent: TimelineEvent | undefined;
    timeTillFuture:number;
    futureEvents: TimelineEvent[];
}
