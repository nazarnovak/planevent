import { useEffect, useState } from "react";
import { Artist, Schedule, ScheduleAPIResponse, User } from "./Dto";

import { Loader } from "./Loader";
import { SharedTopButtons } from "./components/TopButtons/SharedTopButtons";

// import { Timeline } from "./timeline/Timeline";

import { MyTopButtons } from "./components/TopButtons/MyTopButtons";

const App = () => {
  const [me, setMe] = useState<User>({ id: "", name: "" });

  const [secretId, setSecretId] = useState("");
  const [sharedLineupID, setSharedLineupID] = useState("");

  const [showShareError, setShowShareError] = useState(false);
  const [title, setTitle] = useState("Your name");

  const [currentWeek, setCurrentWeek] = useState(0);
  const [currentDay, setCurrentDay] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);

  const [schedule, setSchedule] = useState([] as Schedule[]);

  const fetchLatestSchedule = (sharedLineupID: string) => {
    fetch(
      "https://planevent.me/api/schedule" +
        (sharedLineupID ? "/" + sharedLineupID : ""),
      {
        credentials: "include",
      }
    )
      .then((response) => response.json())
      .then((data: ScheduleAPIResponse) => {
        if (data?.me) {
          setMe(data.me);
          if (data?.me?.name) {
            setTitle(data.me.name);
          }
        }
        setSchedule(data.schedule);
      });
  };

  const fetchSecret = () => {
    fetch("https://planevent.me/api/secret", {
      credentials: "include",
    })
      .then((response) => response.text())
      .then((body: string) => {
        setSecretId(body);
      });
  };

  const postLogin = (secretId: string) => {
    return fetch("https://planevent.me/api/login?secretId=" + secretId, {
      method: "POST",
      credentials: "include",
    }).then((response) => {
      if (!response.ok)
        throw new Error("Something went wrong when logging user in");
    });
  };

  useEffect(() => {
    const fetchAPI = async () => {
      const subPaths = window.location.pathname.split("/");
      if (subPaths[1] === "move" && !!subPaths[2]) {
        await postLogin(subPaths[2]);
        window.history.replaceState({}, "Home", "/");
      }

      if (subPaths[1] === "shared" && !!subPaths[2]) {
        setSharedLineupID(subPaths[2]);
        fetchLatestSchedule(subPaths[2]);
        // We don't need to fetch latest schedule or secret as when you view your own lineup
        return;
      }

      fetchLatestSchedule("");
      fetchSecret();
    };

    fetchAPI();
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
    key: number,
    slotId: string,
    newAttendingStatus: boolean
  ) => {
    fetch(
      "https://planevent.me/api/attend?eventId=" +
        slotId +
        "&attending=" +
        newAttendingStatus,
      {
        method: "POST",
        credentials: "include",
      }
    ).then((response) => {
      if (!response.ok)
        throw new Error("Something went wrong when updating attendance");
      // Weird hack to rewrite the schedule in state in the specific artist key :/
      let tempSchedule = [...schedule];
      if (
        tempSchedule[currentWeek] &&
        tempSchedule[currentWeek]?.days[currentDay] &&
        tempSchedule[currentWeek]?.days[currentDay]?.stages[currentStage] &&
        tempSchedule[currentWeek]?.days[currentDay]?.stages[currentStage]
          .artists[key]
      ) {
        tempSchedule[currentWeek].days[currentDay].stages[currentStage].artists[
          key
        ].attending = newAttendingStatus;
        setSchedule(tempSchedule);
      }
    });
  };

  const handleTitleChange = (newTitle: string) => {
    setShowShareError(false);
    setTitle(newTitle);
  };

  const handleTitleSubmit = (newTitle: string) => {
    fetch("https://planevent.me/api/name?name=" + newTitle, {
      method: "POST",
      credentials: "include",
    }).then((response) => {
      if (!response.ok)
        throw new Error("Something went wrong when updating user name");
      setTitle(newTitle);
    });
  };

  //   const showUsersList = (users: User[]) => {
  //     // TODO implement
  //     console.log(users);
  //   };

  if (schedule.length === 0) {
    return <Loader />;
  }

  return (
    <div>
      {/* <Timeline schedule={schedule} onEventClick={showUsersList} /> */}
      <div id="top-buttons-container">
        {!sharedLineupID && (
          <MyTopButtons
            secretId={secretId}
            shareId={me.id}
            title={title}
            showShareError={showShareError}
            setShowShareError={setShowShareError}
          />
        )}
        {sharedLineupID && <SharedTopButtons sharedLineupID={sharedLineupID} />}
      </div>
      <div id="title-and-edit-button">
        <Title
          warningFont={showShareError}
          title={title}
          handleTitleChange={handleTitleChange}
          handleTitleSubmit={handleTitleSubmit}
        />
      </div>
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

interface TitleProps {
  warningFont: boolean;
  title: string;
  handleTitleChange: (title: string) => void;
  handleTitleSubmit: (title: string) => void;
}

const Title = (props: TitleProps) => {
  return (
    <input
      style={{ width: "100%" }}
      id="title"
      className={props.warningFont ? "text-orange" : "text-white"}
      type="text"
      maxLength={32}
      onChange={(e) => {
        props.handleTitleChange(e.target.value as string);
      }}
      onBlur={(e) => props.handleTitleSubmit(e.target.value as string)}
      onKeyUp={(e) => {
        if (e.key === "Enter") {
          const target = e.target as HTMLInputElement;
          e.preventDefault();
          target.blur();
        }
      }}
      value={props.title}
    />
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
  updateAttendanceStatus: (
    key: number,
    slotId: string,
    newAttendingStatus: boolean
  ) => void;
}

const TodaysSchedule = (props: TodaysScheduleProps) => {
  return (
    <div id="schedule">
      <div id="timeslot-header">
        <div className="timeslot-time-artist">
          <div className="timeslot-time">Time</div>
          <div className="timeslot-artist">Artist</div>
        </div>
        <div className="timeslot-followers">Followers</div>
      </div>
      {props.schedule.map((slot: Artist, i: number) => {
        const hourStart = new Date(Date.parse(slot.timeStart));
        const hourEnd = new Date(Date.parse(slot.timeEnd));

        return (
          <div key={slot.id} className="timeslot">
            <div
              className={
                "timeslot-time-artist" + (slot.attending ? " attending" : "")
              }
              onClick={() =>
                props.updateAttendanceStatus(i, slot.id, !slot.attending)
              }
            >
              <div className="timeslot-time">
                {(hourStart.getHours() < 10 ? "0" : "") + hourStart.getHours()}:
                {(hourStart.getMinutes() < 10 ? "0" : "") +
                  hourStart.getMinutes()}
                <br />
                {(hourEnd.getHours() < 10 ? "0" : "") + hourEnd.getHours()}:
                {(hourEnd.getMinutes() < 10 ? "0" : "") + hourEnd.getMinutes()}{" "}
              </div>
              <div className="timeslot-artist">{slot.artist}</div>
            </div>
            <div
              className="timeslot-followers"
              onClick={() => {
                alert("Followers:" + slot.attendees);
              }}
            >
              4
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default App;
