import { useEffect, useState } from "react";
import { Artist, Schedule, ScheduleAPIResponse, User } from "./Dto";

import { Loader } from "./Loader";
import { Timeline } from "./timeline/Timeline";

const App = () => {
  const [me, setMe] = useState<User>({ id: "", name: "" });

  const [secretUUID, setSecretUUID] = useState("");

  const [sharedLineupID, setSharedLineupID] = useState("");
  const [following, setFollowing] = useState(false);

  const [showMoveCopiedToClipboard, setShowMoveCopiedToClipboard] =
    useState(false);
  const [showShareError, setShowShareError] = useState(false);
  const [showShareCopiedToClipboard, setShareCopiedToClipboard] =
    useState(false);

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
        setMe(data.me);
        setSchedule(data.schedule);
      });
  };

  const fetchSecret = () => {
    fetch("https://planevent.me/api/secret", {
      credentials: "include",
    })
      .then((response) => response.text())
      .then((body: string) => {
        setSecretUUID(body);
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
    });
    fetchLatestSchedule("");
  };

  function timeout(delay: number) {
    return new Promise((res) => setTimeout(res, delay));
  }

  const handleMoveLineup = async () => {
    navigator.clipboard.writeText(
      window.location.protocol +
        "//" +
        window.location.hostname +
        "/move/" +
        secretUUID
    );

    setShowMoveCopiedToClipboard(true);
    await timeout(2000);
    setShowMoveCopiedToClipboard(false);
  };

  const handleShareLineup = async () => {
    if (title === "Your name") {
      setShowShareError(true);
      return;
    }

    navigator.clipboard.writeText(
      window.location.protocol +
        "//" +
        window.location.hostname +
        "/shared/" +
        me.id
    );

    setShareCopiedToClipboard(true);
    await timeout(2000);
    setShareCopiedToClipboard(false);
  };

  const handleDonateClick = () => {
    window.open("https://buy.stripe.com/6oE7tu7UM3235dCeUU", "_blank");
  };

  const handleTitleChange = (newTitle: string) => {
    setShowShareError(false);
    setTitle(newTitle);
  };

  const handleMyLineup = () => {
    window.location.href =
      window.location.protocol + "//" + window.location.hostname + "/";
  };

  const handleFollowLineup = () => {
    fetch("https://planevent.me/api/follow?publicId=" + sharedLineupID, {
      method: "POST",
      credentials: "include",
    }).then((response) => {
      if (!response.ok) {
        throw new Error("Something went wrong when updating attendance");
      }

      setFollowing(true);
    });
  };

  const showUsersList = (users: User[]) => {
    // TODO implement
    console.log(users);
  };

  if (schedule.length === 0) {
    return <Loader />;
  }

  return (
    <div>
      <Timeline schedule={schedule} onEventClick={showUsersList} />
      <div id="top-buttons-container">
        <div id="top-buttons">
          <div className="top-button-container">
            {sharedLineupID !== "" && (
              <>
                <button
                  id="my-schedule"
                  className="button-black"
                  onClick={handleMyLineup}
                >
                  <img src="/my-page.png" alt="My lineup" />
                </button>
                <div className="top-button-description">My lineup</div>
              </>
            )}
            {sharedLineupID === "" && !showMoveCopiedToClipboard && (
              <>
                <button
                  id="move-lineup"
                  className="button-black"
                  onClick={handleMoveLineup}
                >
                  <img
                    src="/device.png"
                    alt="Move lineup to a different device"
                  />
                </button>
                <div className="top-button-description">
                  Move lineup to a new device
                </div>
              </>
            )}
            {sharedLineupID === "" && showMoveCopiedToClipboard && (
              <>
                <button className="success-checkmark-button button-green">
                  <img
                    src="/checkmark.png"
                    alt="Copied move link to clipboard"
                  />
                </button>
                <div className="top-button-description text-green">
                  Link copied to clipboard
                  <br />
                </div>
              </>
            )}
          </div>
          <div className="top-button-container">
            {sharedLineupID !== "" && (
              <>
                <button
                  id="my-schedule"
                  className="button-black"
                  onClick={handleFollowLineup}
                >
                  <img src="/plus.png" alt="Follow this lineup" />
                </button>
                {!following && (
                  <div className="top-button-description">
                    Follow this lineup
                  </div>
                )}
                {following && (
                  <div className="top-button-description">
                    Unfollow this lineup
                  </div>
                )}
              </>
            )}
            {sharedLineupID === "" && showShareError && (
              <>
                <button id="share-error" className="button-orange">
                  <img src="/exclamation.png" alt="Please enter your name" />
                </button>
                <div className="top-button-description text-orange">
                  Please enter your name
                </div>
              </>
            )}
            {sharedLineupID === "" &&
              !showShareError &&
              !showShareCopiedToClipboard && (
                <>
                  <button
                    id="share-lineup"
                    className="button-black"
                    onClick={handleShareLineup}
                  >
                    <img src="/share.png" alt="Share lineup with others" />
                  </button>
                  <div className="top-button-description">
                    Share lineup with others
                  </div>
                </>
              )}
            {sharedLineupID === "" &&
              !showShareError &&
              showShareCopiedToClipboard && (
                <>
                  <button className="success-checkmark-button button-green">
                    <img
                      src="/checkmark.png"
                      alt="Copied share link to clipboard"
                    />
                  </button>
                  <div className="top-button-description text-green">
                    Link copied to clipboard
                  </div>
                </>
              )}
          </div>
          <div className="top-button-container">
            <button id="donate" onClick={handleDonateClick}>
              <img src="/heart.png" alt="Donate" />
            </button>
            <div className="top-button-description">Donate</div>
          </div>
        </div>
      </div>
      <div id="title-and-edit-button">
        <Title
          warningFont={showShareError}
          title={title}
          handleTitleChange={handleTitleChange}
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
  updateAttendanceStatus: (slotId: string, newAttendingStatus: boolean) => void;
}

const TodaysSchedule = (props: TodaysScheduleProps) => {
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
            className={`timeslot` + (slot.attending ? " attending" : "")}
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
