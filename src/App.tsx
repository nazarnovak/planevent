import { useEffect, useState } from "react";
import { Artist, Schedule, ScheduleAPIResponse, User } from "./Dto";

import { ConsentBanner } from "./components/ConsentBanner/ConsentBanner";
import { Loader } from "./Loader";
import { SharedTopButtons } from "./components/TopButtons/SharedTopButtons";

import { Timeline } from "./timeline/Timeline";

import { FeedbackModal } from "./components/FeedbackModal/FeedbackModal";
import { MyTopButtons } from "./components/TopButtons/MyTopButtons";

import X from "./images/x.svg";

const App = () => {
  const [loading, setLoading] = useState(false);
  const [me, setMe] = useState<User>({ id: "", name: "", following: [] });
  const [owner, setOwner] = useState<User>({ id: "", name: "", following: [] });

  const [secretId, setSecretId] = useState("");
  const [sharedLineupID, setSharedLineupID] = useState("");
  const [shareOverlayOpen, setShareOverlayOpen] = useState(false);

  const [editMode, setEditMode] = useState(true);
  const [showShareError, setShowShareError] = useState(false);

  const [contactUsSubmittedSuccess, setContactUsSubmittedSuccess] =
    useState(false);
  const [contactUsModalOpen, setContactUsModalOpen] = useState(false);

  const [title, setTitle] = useState("Your name");

  const [currentWeek, setCurrentWeek] = useState(1);
  const [currentDay, setCurrentDay] = useState(1);
  const [currentStage, setCurrentStage] = useState(0);

  const [allTodaysStages, setAllTodaysStages] = useState([] as string[]);
  const [stageModalOpen, setStageModalOpen] = useState(false);

  const [modalArtistInfo, setModalArtistInfo] = useState({} as Artist);

  const [schedule, setSchedule] = useState([] as Schedule[]);

  const fetchLatestSchedule = (sharedLineupID: string) => {
    setLoading(true);
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

        let allStageNames =
          data.schedule[currentWeek]?.days[currentDay]?.stages.map(
            (stage) => stage.stage
          ) || [];
        setAllTodaysStages(allStageNames);
      })
      .finally(() => setLoading(false));
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
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!sharedLineupID && editMode) return;

    const changeWeekIfNeeded = () => {
      const weeksAttending: number[] = [];

      schedule.forEach((week, i) => {
        const atLeastOneAttending = week.days.some((day) =>
          day.stages.some((stage) =>
            stage.artists.some((artist) => artist.attending)
          )
        );
        if (atLeastOneAttending) {
          weeksAttending.push(i);
        }
      });

      if (!weeksAttending.length || weeksAttending.includes(currentWeek))
        return;

      setCurrentWeek(weeksAttending[0]);
    };

    const changeDayIfNeeded = () => {
      const daysAttending: number[] = [];

      schedule.forEach((week) => {
        week.days.forEach((day, i) => {
          const atLeastOneAttending = day.stages.some((stage) =>
            stage.artists.some((artist) => artist.attending)
          );
          if (atLeastOneAttending) {
            daysAttending.push(i);
          }
        });
      });

      if (!daysAttending.length || daysAttending.includes(currentDay)) return;

      setCurrentDay(daysAttending[0]);
    };

    changeWeekIfNeeded();
    changeDayIfNeeded();
    // eslint-disable-next-line
  }, [editMode, sharedLineupID, schedule]);

  useEffect(() => {
    if (!shareOverlayOpen) {
      return;
    }

    const timer = setTimeout(() => {
      setShareOverlayOpen(false);
    }, 7000);
    return () => {
      clearTimeout(timer);
    };
  }, [shareOverlayOpen]);

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
    // Rewrite the schedule in state, so it shows new attendance status
    let tempSchedule = [...schedule];

    // We find stageKey and artistKey from the given slotid
    // This way we won't need the key provided to this function, and we can use this function
    // for both edit and view mode!
    let selectedWeekKey = 0;
    let selectedDayKey = 0;
    let selectedStageKey = 0;
    let selectedArtistKey = 0;

    outer: for (const weekKey in tempSchedule) {
      for (const dayKey in tempSchedule[weekKey].days) {
        for (const stageKey in tempSchedule[weekKey]?.days[dayKey]?.stages) {
          for (const artistKey in tempSchedule[weekKey]?.days[dayKey]?.stages[
            stageKey
          ].artists) {
            if (
              tempSchedule[weekKey]?.days[dayKey]?.stages[stageKey]?.artists[
                artistKey
              ].id !== slotId
            )
              continue;
            selectedWeekKey = +weekKey;
            selectedDayKey = +dayKey;
            selectedStageKey = +stageKey;
            selectedArtistKey = +artistKey;
            break outer;
          }
        }
      }
    }

    tempSchedule[selectedWeekKey].days[selectedDayKey].stages[
      selectedStageKey
    ].artists[selectedArtistKey].attending = newAttendingStatus;

    setSchedule(tempSchedule);

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
  };

  const handleTitleChange = (newTitle: string) => {
    setShowShareError(false);
    setTitle(newTitle);
    fetch("https://planevent.me/api/name?name=" + newTitle, {
      method: "POST",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((body: User) => {
        setMe(body);
      });
  };

  const handleStageClick = () => {
    setStageModalOpen(true);
  };

  function timeout(delay: number) {
    return new Promise((res) => setTimeout(res, delay));
  }

  if (loading) {
    return <Loader />;
  }

  // Double wrapper is needed to be able to click anywhere and remove the shared button overlay :shrug:
  return (
    <div
      id="wrapper-outer"
      onClick={(e) => {
        if (shareOverlayOpen) {
          setShareOverlayOpen(false);
        }
      }}
    >
      <div id="wrapper-inner">
        <ConsentBanner />
        <FeedbackModal
          modalOpen={contactUsModalOpen}
          onClose={() => {
            // Hack to hide scrollbar
            document.body.style.overflow = "auto";
            setContactUsModalOpen(false);
          }}
          setFeedbackSubmitted={async () => {
            // Hack to hide scrollbar
            document.body.style.overflow = "auto";

            setContactUsModalOpen(false);
            setContactUsSubmittedSuccess(true);
            await timeout(2000);
            setContactUsSubmittedSuccess(false);
          }}
        />
        <div id="top-buttons-container">
          {!sharedLineupID && (
            <MyTopButtons
              secretId={secretId}
              shareId={me.id}
              title={title}
              showShareError={showShareError}
              setShowShareError={setShowShareError}
              editMode={editMode}
              handleLineupToggleClick={() => setEditMode(!editMode)}
              closeShareOverlayOpen={() => setShareOverlayOpen(false)}
              shareOverlayOpen={shareOverlayOpen}
              handleMoveShareClick={() => setShareOverlayOpen(true)}
              contactUsSubmittedSuccess={contactUsSubmittedSuccess}
              handleContactUs={() => {
                setContactUsModalOpen(true);
              }}
              contactUsModalOpen={contactUsModalOpen}
            />
          )}
          {sharedLineupID && (
            <SharedTopButtons
              sharedLineupID={sharedLineupID}
              following={!!me.following.find((id) => id === owner.id)}
              viewingOwnSchedule={me?.id !== "" && me.id === owner.id}
              contactUsSubmittedSuccess={contactUsSubmittedSuccess}
              handleContactUs={() => {
                setContactUsModalOpen(true);
              }}
              contactUsModalOpen={contactUsModalOpen}
            />
          )}
        </div>
        <div id="title-and-edit-button">
          <Title
            warningFont={showShareError}
            title={title}
            handleTitleChange={handleTitleChange}
            sharedSchedule={!!sharedLineupID}
          />
        </div>
        <StageModal
          stageModalOpen={stageModalOpen}
          currentStage={currentStage}
          allTodaysStages={allTodaysStages}
          onClose={() => {
            // Hack to hide scrollbar
            document.body.style.overflow = "auto";
            setStageModalOpen(false);
          }}
          handleStageClick={(stageNumber: number) => {
            // Hack to hide scrollbar
            document.body.style.overflow = "auto";
            setCurrentStage(stageNumber);
            setStageModalOpen(false);
          }}
        />
        <DaySelector
          schedule={schedule}
          currentWeek={currentWeek}
          currentDay={currentDay}
          currentStage={currentStage}
          changeWeek={changeWeek}
          changeDay={changeDay}
          changeStage={changeStage}
          sharedLineup={!!sharedLineupID}
          handleStageClick={handleStageClick}
          editMode={editMode}
        />
        <FollowingModal
          modalArtistInfo={modalArtistInfo}
          onClose={() => {
            // Hack to hide scrollbar
            document.body.style.overflow = "auto";
            setModalArtistInfo({} as Artist);
          }}
          handleChangeGoing={() => {
            // Hack to hide scrollbar
            document.body.style.overflow = "auto";

            updateAttendanceStatus(
              modalArtistInfo.id,
              !modalArtistInfo.attending
            );
            setModalArtistInfo({} as Artist);
          }}
          currentStage={
            schedule[currentWeek]?.days[currentDay]?.stages[currentStage]
              ?.stage || ""
          }
        />
        {(!!sharedLineupID || !editMode) && (
          <Timeline
            day={schedule[currentWeek]?.days[currentDay]}
            currentDay={currentDay}
            currentWeek={currentWeek}
            viewingOwnSchedule={me?.id !== "" && me.id === owner.id}
            myId={me?.id || ""}
            handleFollowersClick={(artist: Artist) => {
              setModalArtistInfo(artist);
            }}
          />
        )}
        {!sharedLineupID && editMode && (
          <TodaysSchedule
            schedule={
              schedule[currentWeek]?.days[currentDay]?.stages[currentStage]
                ?.artists || []
            }
            updateAttendanceStatus={updateAttendanceStatus}
            handleFollowersClick={(artist: Artist) => {
              setModalArtistInfo(artist);
            }}
          />
        )}
      </div>
    </div>
  );
};

interface StageModalProps {
  stageModalOpen: boolean;
  allTodaysStages: string[];
  currentStage: number;
  onClose: () => void;
  handleStageClick: (stageNumber: number) => void;
}
const StageModal = (props: StageModalProps) => {
  if (!props.stageModalOpen || !props.allTodaysStages) {
    return null;
  }

  // Hack to hide scrollbar
  document.body.style.overflow = "hidden";

  return (
    <div className="backdrop" onClick={props.onClose}>
      <div
        className="modal"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="modal-header">
          <div className="modal-header-side"></div>
          <div className="modal-header-title">Select stage</div>
          <div className="modal-header-side">
            <img
              src={X}
              className="modal-x"
              alt="Close"
              onClick={props.onClose}
            ></img>
          </div>
        </div>
        <div className="stage-modal-body">
          {props.allTodaysStages.map((stageName: string, i: number) => (
            <div
              key={i}
              className={
                "stage-modal-item" + (props.currentStage === i ? " active" : "")
              }
              onClick={() => props.handleStageClick(i)}
            >
              {stageName}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface FollowingModalProps {
  modalArtistInfo: Artist;
  onClose: () => void;
  currentStage: string;
  handleChangeGoing: () => void;
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
    (hourStart.getUTCHours() < 10 ? "0" : "") +
    hourStart.getUTCHours() +
    ":" +
    (hourStart.getUTCMinutes() < 10 ? "0" : "") +
    hourStart.getUTCMinutes();
  const timeEnd =
    (hourEnd.getUTCHours() < 10 ? "0" : "") +
    hourEnd.getUTCHours() +
    ":" +
    (hourEnd.getUTCMinutes() < 10 ? "0" : "") +
    hourEnd.getUTCMinutes();

  return (
    <div className="backdrop" onClick={props.onClose}>
      <div
        className="modal"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
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
          <br />
          <br />
          {timeStart} - {timeEnd} @ {props.currentStage}
          <br />
          <br />
          {props.modalArtistInfo.attending
            ? `People you follow joining you:`
            : `People you follow going:`}
          <br />
          <ul>
            {props.modalArtistInfo?.attendees?.map((attender, i) => {
              return <li key={i}>{attender.name}</li>;
            })}
          </ul>
        </div>
        <div
          className={
            `modal-footer` +
            (props.modalArtistInfo.attending ? " dont-go" : " join")
          }
          onClick={props.handleChangeGoing}
        >
          {props.modalArtistInfo.attending ? "Don't go" : "Join"}
        </div>
      </div>
    </div>
  );
};

interface TitleProps {
  warningFont: boolean;
  title: string;
  handleTitleChange: (title: string) => void;
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

  if (props.sharedSchedule) {
    return (
      <div id="title" className={titleClass} style={{ width: "100%" }}>
        {props.title}'s lineup
      </div>
    );
  }

  return (
    <input
      style={{ width: "100%" }}
      id="title"
      className={titleClass}
      type="text"
      maxLength={32}
      onClick={(e) => {
        const target = e.target as HTMLInputElement;
        target.select();
      }}
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
  handleStageClick: () => void;
  editMode: boolean;
}

const DaySelector = (props: DaySelectorProps) => {
  return (
    <div>
      <div id="week-selector">
        {props.schedule.map((week, i) => {
          if (props.sharedLineup || !props.editMode) {
            const atLeastOneAttending = week.days.some((day) =>
              day.stages.some((stage) =>
                stage.artists.some((artist) => artist.attending)
              )
            );
            if (!atLeastOneAttending) {
              return null;
            }
          }
          return (
            <div
              key={i}
              className={
                `week-day-stage-item week` +
                (i === props.currentWeek ? " active" : "")
              }
              onClick={() => props.changeWeek(i)}
            >
              {week.weekName}
            </div>
          );
        })}
      </div>
      <div id="day-selector">
        {props.schedule[props.currentWeek]?.days.map((day, i) => {
          if (props.sharedLineup || !props.editMode) {
            const atLeastOneAttending = day.stages.some((stage) =>
              stage.artists.some((artist) => artist.attending)
            );
            if (!atLeastOneAttending) {
              return null;
            }
          }

          return (
            <div
              key={i}
              className={
                `week-day-stage-item day` +
                (i === props.currentDay ? " active" : "")
              }
              onClick={() => props.changeDay(i)}
            >
              {day.weekDay}
            </div>
          );
        })}
      </div>
      {!props.sharedLineup && props.editMode && (
        <div id="stage-selector">
          <div
            className="week-day-stage-item stage-item stage-previous-next"
            onClick={() => {
              props.changeStage(props.currentStage - 1);
            }}
          >
            &lt;
          </div>
          <div
            id="stage"
            className="week-day-stage-item stage-item active"
            onClick={props.handleStageClick}
          >
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
  updateAttendanceStatus: (slotId: string, newAttendingStatus: boolean) => void;
  handleFollowersClick: (artist: Artist) => void;
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
      {props.schedule.map((slot: Artist) => {
        const hourStart = new Date(Date.parse(slot.timeStart));
        const hourEnd = new Date(Date.parse(slot.timeEnd));

        const timeStart =
          (hourStart.getUTCHours() < 10 ? "0" : "") +
          hourStart.getUTCHours() +
          ":" +
          (hourStart.getUTCMinutes() < 10 ? "0" : "") +
          hourStart.getUTCMinutes();
        const timeEnd =
          (hourEnd.getUTCHours() < 10 ? "0" : "") +
          hourEnd.getUTCHours() +
          ":" +
          (hourEnd.getUTCMinutes() < 10 ? "0" : "") +
          hourEnd.getUTCMinutes();

        return (
          <div key={slot.id} className="timeslot">
            <div
              className={
                "timeslot-time-artist" + (slot.attending ? " attending" : "")
              }
              onClick={() =>
                props.updateAttendanceStatus(slot.id, !slot.attending)
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

                props.handleFollowersClick(slot);
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
