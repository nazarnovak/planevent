import { useEffect, useState } from "react";

interface Artist {
  id: string;
  artist: string;
  attendees: string[];
  attending: boolean;
  timeStart: string;
  timeEnd: string;
}

interface Stage {
  stage: string;
  artists: Artist[];
}

interface Day {
  date: string;
  weekDay: string;
  stages: Stage[];
}

interface Schedule {
  weekName: string;
  weekNumber: number;
  days: Day[];
}

interface ScheduleAPIResponse {
  me: string;
  owner: string;
  schedule: Schedule[];
}

const App = () => {
  const [schedule, setSchedule] = useState([] as Schedule[]);

  const [currentWeek, setCurrentWeek] = useState(0);
  const [currentDay, setCurrentDay] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);

  const fetchLatestSchedule = () => {
    fetch("https://walrus-app-9mwix.ondigitalocean.app/api/schedule")
      .then((response) => response.json())
      .then((data: ScheduleAPIResponse) => {
        setSchedule(data.schedule);
      });
  };

  useEffect(() => {
    fetchLatestSchedule();
  }, []);

  const changeWeek = (changedWeek: number) => {
    setCurrentWeek(changedWeek);
  };

  const changeDay = (changedDay: number) => {
    setCurrentDay(changedDay);
  };

  const changeStage = (changedStage: number) => {
    const currentDayStageCount =
      schedule[currentWeek].days[currentDay].stages.length;

    // If we change from stage 0 back - loop around from first stage
    if (changedStage === -1) {
      changedStage = currentDayStageCount - 1;
    }

    // If we change from last stage + 1 - loop around from last stage
    if (changedStage >= currentDayStageCount) {
      changedStage = 0;
    }

    setCurrentStage(changedStage);
  };

  const updateAttendanceStatus = (
    slotId: string,
    newAttendingStatus: boolean
  ) => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId: slotId, attending: newAttendingStatus }),
    };
    fetch(
      "https://walrus-app-9mwix.ondigitalocean.app/api/attend",
      requestOptions
    ).then((response) => {
      if (!response.ok)
        throw new Error("Something went wrong when updating attendance");
    });
  };

  // The idea is to maybe take all the keys on a specific layer:
  // week1 week2
  // friday, saturday, sunday
  // mainstage, freedom, etc
  // and from that, take the first key as the "default" state, so week1, friday, mainstage
  // but then how do you select next entries? how do I know I'm in position 0,0,0 now, and that I want to show arrows to the right now,
  // but when I am in position 1,1,1, you show left arrows + right arrows if there's an array index 2 in the respectful array

  // const keys1 = Object.keys(this.state.items);
  // const keys2 = Object.keys(this.state.items[keys1[0]]);
  // const keys3 = Object.keys(this.state.items[keys1[0]][keys2[0]]);
  // return (
  //   <div>
  //     <h1>{keys1[0]}</h1>
  //     <h2>{keys2[0]}</h2>
  //     <h3>{keys3[0]}</h3>
  //   </div>
  // )

  return (
    <div>
      <div id="top-buttons-container">
        <div id="top-buttons">
          <div className="top-button-container">
            <button id="move-schedule">
              <img
                src="/device.png"
                alt="Move schedule to a different device"
              />
            </button>
            <div className="top-button-description">
              Move schedule to a different device
            </div>
          </div>
          <div className="top-button-container">
            <button id="share-schedule">
              <img src="/share.png" alt="Share schedule with others" />
            </button>
            <div className="top-button-description">
              Share schedule with others
            </div>
          </div>
          <div className="top-button-container">
            <button id="donate">
              <img src="/heart.png" alt="Donate" />
            </button>
            <div className="top-button-description">Donate</div>
          </div>
        </div>
      </div>
      <h1>Unnamed schedule</h1>
      <DaySelector
        schedule={schedule}
        currentWeek={currentWeek}
        currentDay={currentDay}
        currentStage={currentStage}
        changeWeek={changeWeek}
        changeDay={changeDay}
        changeStage={changeStage}
      />
      <TodaysSchedule
        schedule={
          schedule[currentWeek]?.days[currentDay]?.stages[currentStage]
            ?.artists || []
        }
        updateAttendanceStatus={updateAttendanceStatus}
      />
    </div>
  );
};

interface DaySelectorProps {
  schedule: Schedule[];
  currentWeek: number;
  currentDay: number;
  currentStage: number;
  changeWeek: (weekNumber: number) => void;
  changeDay: (weekNumber: number) => void;
  changeStage: (weekNumber: number) => void;
}

const DaySelector = (props: DaySelectorProps) => {
  if (props.schedule.length === 0) {
    return <div>Loading dates...</div>;
  }

  return (
    <div>
      <div id="week-selector">
        {props.schedule.map((slot, i) => {
          return (
            <div
              key={i}
              className={
                `week-day-stage-item week` +
                (i === props.currentWeek ? " active" : "")
              }
              onClick={() => props.changeWeek(i)}
            >
              {slot.weekName}
            </div>
          );
        })}
      </div>
      <div id="day-selector">
        {props.schedule[props.currentWeek]?.days.map((slot, i) => {
          return (
            <div
              key={i}
              className={
                `week-day-stage-item day` +
                (i === props.currentDay ? " active" : "")
              }
              onClick={() => props.changeDay(i)}
            >
              {slot.weekDay}
            </div>
          );
        })}
      </div>
      <div id="stage-selector">
        <div
          className="week-day-stage-item stage-item stage-previous-next"
          onClick={() => {
            props.changeStage(props.currentStage - 1);
          }}
        >
          &lt;
        </div>
        <div id="stage" className="week-day-stage-item stage-item active">
          {
            props.schedule[props.currentWeek]?.days[props.currentDay]?.stages[
              props.currentStage
            ]?.stage
          }
        </div>
        <div
          className="week-day-stage-item stage-item stage-previous-next"
          onClick={() => props.changeStage(props.currentStage + 1)}
        >
          &gt;
        </div>
      </div>
    </div>
  );
};

interface TodaysScheduleProps {
  schedule: Artist[];
  updateAttendanceStatus: (slotId: string, newAttendingStatus: boolean) => void;
}

const TodaysSchedule = (props: TodaysScheduleProps) => {
  if (props.schedule.length === 0) {
    return <div>Loading artists...</div>;
  }

  return (
    <div id="schedule">
      <div id="timeslot-header">
        <div>Time</div>
        <div>Artist</div>
        <div>Attendees</div>
      </div>
      {props.schedule.map((slot: Artist, i: number) => {
        const hourStart = new Date(Date.parse(slot.timeStart));
        const hourEnd = new Date(Date.parse(slot.timeEnd));

        return (
          <div
            key={slot.id}
            className="timeslot"
            onClick={() =>
              props.updateAttendanceStatus(slot.id, !slot.attending)
            }
          >
            <div className="timeslot-sides">
              {(hourStart.getHours() < 10 ? "0" : "") + hourStart.getHours()}:
              {(hourStart.getMinutes() < 10 ? "0" : "") +
                hourStart.getMinutes()}
              -{(hourEnd.getHours() < 10 ? "0" : "") + hourEnd.getHours()}:
              {(hourEnd.getMinutes() < 10 ? "0" : "") + hourEnd.getMinutes()}{" "}
            </div>
            <div className="timeslot-artist">{slot.artist}</div>
            <div className="timeslot-sides">4</div>
          </div>
        );
      })}
    </div>
  );
};

export default App;
