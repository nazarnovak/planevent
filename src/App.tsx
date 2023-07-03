import { useEffect, useState } from "react";
import { Artist, Schedule, ScheduleAPIResponse, User } from "./Dto";

import { Loader } from "./Loader";
import { SharedTopButtons } from "./components/TopButtons/SharedTopButtons";

import { Timeline } from "./timeline/Timeline";

import { MyTopButtons } from "./components/TopButtons/MyTopButtons";

import X from "./images/x.svg";

const App = () => {
  const [me, setMe] = useState<User>({ id: "", name: "", following: [] });
  const [owner, setOwner] = useState<User>({ id: "", name: "", following: [] });

  const [secretId, setSecretId] = useState("");
  const [sharedLineupID, setSharedLineupID] = useState("");

  const [showShareError, setShowShareError] = useState(false);
  const [title, setTitle] = useState("Your name");

  const [currentWeek, setCurrentWeek] = useState(0);
  const [currentDay, setCurrentDay] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);

  const [modalArtistInfo, setModalArtistInfo] = useState({} as Artist);
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
        }
        if (data?.owner) {
          setOwner(data.owner);
        }
        if (sharedLineupID && data?.owner?.name) {
          setTitle(data.owner.name);
        } else if (data?.owner?.name) {
          setTitle(data.me.name);
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
    })
      .then((response) => response.json())
      .then((body: User) => {
        setMe(body);
      });
  };

  if (schedule.length === 0) {
    return <Loader />;
  }

  return (
    <div>
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
        {sharedLineupID && (
          <SharedTopButtons
            sharedLineupID={sharedLineupID}
            following={!!me.following.find((id) => id === owner.id)}
          />
        )}
      </div>
      <div id="title-and-edit-button">
        <Title
          warningFont={showShareError}
          title={title}
          handleTitleChange={handleTitleChange}
          handleTitleSubmit={handleTitleSubmit}
          sharedSchedule={!!sharedLineupID}
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
        sharedLineup={!!sharedLineupID}
      />
      <FollowingModal
        modalArtistInfo={modalArtistInfo}
        onClose={() => {
          // Hack to hide scrollbar
          document.body.style.overflow = "auto";
          setModalArtistInfo({} as Artist);
        }}
        currentStage={
          schedule[currentWeek]?.days[currentDay]?.stages[currentStage]
            ?.stage || ""
        }
      />
      {!!sharedLineupID && (
        <Timeline
          day={schedule[currentWeek]?.days[currentDay]}
          currentWeek={currentWeek}
          currentDay={currentDay}
        />
      )}
      {!sharedLineupID && (
        <TodaysSchedule
          schedule={
            schedule[currentWeek]?.days[currentDay]?.stages[currentStage]
              ?.artists || []
          }
          updateAttendanceStatus={updateAttendanceStatus}
          setModalArtistInfo={setModalArtistInfo}
        />
      )}
    </div>
  );
};

interface FollowingModalProps {
  modalArtistInfo: Artist;
  onClose: () => void;
  currentStage: string;
}

const FollowingModal = (props: FollowingModalProps) => {
  if (!Object.keys(props.modalArtistInfo).length) {
    return null;
  }

  // Hack to hide scrollbar
  document.body.style.overflow = "hidden";

  const hourStart = new Date(Date.parse(props.modalArtistInfo.timeStart));
  const hourEnd = new Date(Date.parse(props.modalArtistInfo.timeEnd));

  const timeStart =
    (hourStart.getHours() < 10 ? "0" : "") +
    hourStart.getHours() +
    ":" +
    (hourStart.getMinutes() < 10 ? "0" : "") +
    hourStart.getMinutes();
  const timeEnd =
    (hourEnd.getHours() < 10 ? "0" : "") +
    hourEnd.getHours() +
    ":" +
    (hourEnd.getMinutes() < 10 ? "0" : "") +
    hourEnd.getMinutes();

  return (
    <div className="backdrop" onClick={props.onClose}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-header-side"></div>
          <div className="modal-header-title">
            {props.modalArtistInfo.artist}
          </div>
          <div className="modal-header-side">
            <img
              src={X}
              className="modal-x"
              alt="Close"
              onClick={props.onClose}
            ></img>
          </div>
        </div>
        <div className="modal-body">
          You are{" "}
          {props.modalArtistInfo.attending ? (
            <span className="going">going</span>
          ) : (
            <span className="not-going">not going</span>
          )}{" "}
          to
          <br />
          {props.modalArtistInfo.artist}
          <br />
          {timeStart} - {timeEnd} @ {props.currentStage}
          <br />
          <br />
          {props.modalArtistInfo.attending
            ? `People you follow joining you:`
            : `People you follow going:`}
          <br />
          <ul>
            {props.modalArtistInfo?.attendees?.map((attender) => {
              return <li>{attender.name}</li>;
            })}
          </ul>
        </div>
        <div className="modal-footer" onClick={props.onClose}>
          Close
        </div>
      </div>
    </div>
  );
};

interface TitleProps {
  warningFont: boolean;
  title: string;
  handleTitleChange: (title: string) => void;
  handleTitleSubmit: (title: string) => void;
  sharedSchedule: boolean;
}

const Title = (props: TitleProps) => {
  let titleClass = "";
  if (props.warningFont) {
    titleClass = "text-orange";
  } else if (props.sharedSchedule) {
    titleClass = "text-gray";
  } else {
    titleClass = "text-white";
  }

  return (
    <input
      style={{ width: "100%" }}
      id="title"
      className={titleClass}
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
      disabled={props.sharedSchedule ? true : false}
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
  sharedLineup: boolean;
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
      {!props.sharedLineup && (
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
      )}
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
  setModalArtistInfo: (artist: Artist) => void;
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

        const timeStart =
          (hourStart.getHours() < 10 ? "0" : "") +
          hourStart.getHours() +
          ":" +
          (hourStart.getMinutes() < 10 ? "0" : "") +
          hourStart.getMinutes();
        const timeEnd =
          (hourEnd.getHours() < 10 ? "0" : "") +
          hourEnd.getHours() +
          ":" +
          (hourEnd.getMinutes() < 10 ? "0" : "") +
          hourEnd.getMinutes();

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
                {timeStart}
                <br />
                {timeEnd}
              </div>
              <div className="timeslot-artist">{slot.artist}</div>
            </div>
            <div
              className="timeslot-followers"
              onClick={() => {
                if (slot.attendees.length === 0) {
                  return null;
                }

                props.setModalArtistInfo(slot);
              }}
            >
              {slot.attendees.length}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default App;
