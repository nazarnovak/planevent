import { useState } from "react";

// UTC time is Belgian time - 2
// GET from BE
const schedule = [
  {
    weekNumber: 1,
    weekName: "Week 1",
    days: [
      {
        weekDay: "friday",
        stages: [
          {
            stage: "mainstage",
            artists: [
              {
                id: 1,
                timeStart: "2023-07-21T12:00+02:00",
                timeEnd: "2023-07-21T14:30+02:00",
                artist: "Daybreak session: Claptone",
              },
              {
                id: 2,
                timeStart: "2023-07-21T14:30+02:00",
                timeEnd: "2023-07-21T15:30+02:00",
                artist: "Anfisa Letyago",
              },
              {
                id: 3,
                timeStart: "2023-07-21T15:30+02:00",
                timeEnd: "2023-07-21T16:30+02:00",
                artist: "Andromedik",
              },
              {
                id: 4,
                timeStart: "2023-07-21T16:30+02:00",
                timeEnd: "2023-07-21T17:30+02:00",
                artist: "Henri PFR",
              },
              {
                id: 5,
                timeStart: "2023-07-21T17:35+02:00",
                timeEnd: "2023-07-21T18:35+02:00",
                artist: "Mattn",
              },
              {
                id: 6,
                timeStart: "2023-07-21T18:40+02:00",
                timeEnd: "2023-07-21T19:40+02:00",
                artist: "Vini vici",
              },
              {
                id: 7,
                timeStart: "2023-07-21T19:40+02:00",
                timeEnd: "2023-07-21T20:40+02:00",
                artist: "Amelie Lens",
              },
              {
                id: 8,
                timeStart: "2023-07-21T20:40+02:00",
                timeEnd: "2023-07-21T21:40+02:00",
                artist: "Sunnery James & Ryan Marciano",
              },
              {
                id: 9,
                timeStart: "2023-07-21T21:45+02:00",
                timeEnd: "2023-07-21T22:45+02:00",
                artist: "Steve Angello",
              },
              {
                id: 10,
                timeStart: "2023-07-21T22:50+02:00",
                timeEnd: "2023-07-21T23:50+02:00",
                artist: "The Chainsmokers",
              },
              {
                id: 11,
                timeStart: "2023-07-21T23:50+02:00",
                timeEnd: "2023-07-21T00:50+02:00",
                artist: "Tiësto",
              },
            ],
          },
          {
            stage: "freedom",
            artists: [
              {
                id: 1,
                timeStart: "2023-07-21T12:00+02:00",
                timeEnd: "2023-07-21T13:30+02:00",
                artist: "Maxi Meraki",
              },
            ],
          },
          {
            stage: "theRoseGarden",
            artists: [
              {
                id: 1,
                timeStart: "2023-07-21T12:00+02:00",
                timeEnd: "2023-07-21T13:30+02:00",
                artist: "Maze",
              },
            ],
          },
          {
            stage: "elixir",
            artists: [
              {
                id: 1,
                timeStart: "2023-07-21T13:00+02:00",
                timeEnd: "2023-07-21T14:30+02:00",
                artist: "Milinguap",
              },
            ],
          },
          {
            stage: "cage",
            artists: [
              {
                id: 1,
                timeStart: "2023-07-21T12:00+02:00",
                timeEnd: "2023-07-21T14:00+02:00",
                artist: "Wanton",
              },
            ],
          },
          {
            stage: "theRaveCave",
            artists: [
              {
                id: 1,
                timeStart: "2023-07-21T13:00+02:00",
                timeEnd: "2023-07-21T14:30+02:00",
                artist: "Lexi",
              },
            ],
          },
          {
            stage: "youphoria",
            artists: [
              {
                id: 1,
                timeStart: "2023-07-21T12:30+02:00",
                timeEnd: "2023-07-21T14:00+02:00",
                artist: "Demi Kanon",
              },
            ],
          },
          {
            stage: "terraSolis",
            artists: [
              {
                id: 1,
                timeStart: "2023-07-21T12:00+02:00",
                timeEnd: "2023-07-21T13:30+02:00",
                artist: "Kap's",
              },
            ],
          },
          {
            stage: "rise",
            artists: [
              {
                id: 1,
                timeStart: "2023-07-21T12:30+02:00",
                timeEnd: "2023-07-21T17:00+02:00",
                artist: "To be announced",
              },
            ],
          },
          {
            stage: "atmosphere",
            artists: [
              {
                id: 1,
                timeStart: "2023-07-21T12:00+02:00",
                timeEnd: "2023-07-21T14:00+02:00",
                artist: "SHDDR",
              },
            ],
          },
          {
            stage: "core",
            artists: [
              {
                id: 1,
                timeStart: "2023-07-21T12:30+02:00",
                timeEnd: "2023-07-21T14:30+02:00",
                artist: "Asian Sal",
              },
            ],
          },
          {
            stage: "crystalGarden",
            artists: [
              {
                id: 1,
                timeStart: "2023-07-21T12:00+02:00",
                timeEnd: "2023-07-21T13:30+02:00",
                artist: "D&W",
              },
            ],
          },
          {
            stage: "theLibrary",
            artists: [
              {
                id: 1,
                timeStart: "2023-07-21T12:00+02:00",
                timeEnd: "2023-07-21T13:00+02:00",
                artist: "AdamK",
              },
            ],
          },
          {
            stage: "mooseBar",
            artists: [
              {
                id: 1,
                timeStart: "2023-07-21T12:00+02:00",
                timeEnd: "2023-07-21T16:00+02:00",
                artist: "Jelle DK",
              },
            ],
          },
        ],
      },
      {
        weekDay: "saturday",
        stages: [
          {
            stage: "mainstage",
            artists: [
              {
                id: 1,
                timeStart: "2023-07-21T12:00+02:00",
                timeEnd: "2023-07-21T14:30+02:00",
                artist: "Daybreak session: Laidback Luke presents Wayback Luke",
              },
            ],
          },
          {
            stage: "freedom",
            artists: [
              {
                id: 1,
                timeStart: "2023-07-21T12:00+02:00",
                timeEnd: "2023-07-21T13:30+02:00",
                artist: "Axel Haube",
              },
            ],
          },
          {
            stage: "theRoseGarden",
            artists: [
              {
                id: 1,
                timeStart: "2023-07-21T13:00+02:00",
                timeEnd: "2023-07-21T14:00+02:00",
                artist: "DJ Fire",
              },
            ],
          },
          {
            stage: "elixir",
            artists: [
              {
                id: 1,
                timeStart: "2023-07-21T14:00+02:00",
                timeEnd: "2023-07-21T14:30+02:00",
                artist: "Bennie Disko",
              },
            ],
          },
          {
            stage: "cage",
            artists: [
              {
                id: 1,
                timeStart: "2023-07-21T12:00+02:00",
                timeEnd: "2023-07-21T13:00+02:00",
                artist: "Revenja",
              },
            ],
          },
          {
            stage: "theRaveCave",
            artists: [
              {
                id: 1,
                timeStart: "2023-07-21T13:00+02:00",
                timeEnd: "2023-07-21T14:00+02:00",
                artist: "Bridgeman",
              },
            ],
          },
          {
            stage: "youphoria",
            artists: [
              {
                id: 1,
                timeStart: "2023-07-21T13:00+02:00",
                timeEnd: "2023-07-21T15:00+02:00",
                artist: "To be announced",
              },
            ],
          },
          {
            stage: "terraSolis",
            artists: [
              {
                id: 1,
                timeStart: "2023-07-21T12:30+02:00",
                timeEnd: "2023-07-21T14:30+02:00",
                artist: "Charlotte De Cock",
              },
            ],
          },
          {
            stage: "rise",
            artists: [
              {
                id: 1,
                timeStart: "2023-07-21T12:30+02:00",
                timeEnd: "2023-07-21T18:30+02:00",
                artist: "To be announced",
              },
            ],
          },
          {
            stage: "atmosphere",
            artists: [
              {
                id: 1,
                timeStart: "2023-07-21T12:00+02:00",
                timeEnd: "2023-07-21T14:00+02:00",
                artist: "To be announced",
              },
            ],
          },
          {
            stage: "core",
            artists: [
              {
                id: 1,
                timeStart: "2023-07-21T12:30+02:00",
                timeEnd: "2023-07-21T14:30+02:00",
                artist: "Unruly Phoenix",
              },
            ],
          },
          {
            stage: "crystalGarden",
            artists: [
              {
                id: 1,
                timeStart: "2023-07-21T12:30+02:00",
                timeEnd: "2023-07-21T14:00+02:00",
                artist: "Ben Malone",
              },
            ],
          },
          {
            stage: "theLibrary",
            artists: [
              {
                id: 1,
                timeStart: "2023-07-21T12:00+02:00",
                timeEnd: "2023-07-21T13:00+02:00",
                artist: "Peter Luts",
              },
            ],
          },
          {
            stage: "mooseBar",
            artists: [
              {
                id: 1,
                timeStart: "2023-07-21T12:00+02:00",
                timeEnd: "2023-07-21T15:00+02:00",
                artist: "Jan V",
              },
            ],
          },
        ],
      },
      {
        weekDay: "sunday",
        stages: [
          {
            stage: "mainstage",
            artists: [
              {
                id: 1,
                timeStart: "2023-07-21T12:00+02:00",
                timeEnd: "2023-07-21T14:30+02:00",
                artist: "Daybreak session: Franky Rizardo",
              },
            ],
          },
          {
            stage: "freedom",
            artists: [
              {
                id: 1,
                timeStart: "2023-07-21T12:00+02:00",
                timeEnd: "2023-07-21T13:00+02:00",
                artist: "Refuzion",
              },
            ],
          },
          {
            stage: "theRoseGarden",
            artists: [
              {
                id: 1,
                timeStart: "2023-07-21T13:00+02:00",
                timeEnd: "2023-07-21T14:30+02:00",
                artist: "Mystique",
              },
            ],
          },
          {
            stage: "elixir",
            artists: [
              {
                id: 1,
                timeStart: "2023-07-21T13:00+02:00",
                timeEnd: "2023-07-21T14:30+02:00",
                artist: "Bubba",
              },
            ],
          },
          {
            stage: "cage",
            artists: [
              {
                id: 1,
                timeStart: "2023-07-21T14:00+02:00",
                timeEnd: "2023-07-21T15:00+02:00",
                artist: "Farflow",
              },
            ],
          },
          {
            stage: "theRaveCave",
            artists: [
              {
                id: 1,
                timeStart: "2023-07-21T13:00+02:00",
                timeEnd: "2023-07-21T14:00+02:00",
                artist: "Jackless & The Fox",
              },
            ],
          },
          {
            stage: "youphoria",
            artists: [
              {
                id: 1,
                timeStart: "2023-07-21T13:00+02:00",
                timeEnd: "2023-07-21T14:30+02:00",
                artist: "Fred Baker",
              },
            ],
          },
          {
            stage: "terraSolis",
            artists: [
              {
                id: 1,
                timeStart: "2023-07-21T12:30+02:00",
                timeEnd: "2023-07-21T13:30+02:00",
                artist: "Justin Wilkes",
              },
            ],
          },
          {
            stage: "rise",
            artists: [
              {
                id: 1,
                timeStart: "2023-07-21T12:30+02:00",
                timeEnd: "2023-07-21T16:30+02:00",
                artist: "To be announced",
              },
            ],
          },
          {
            stage: "atmosphere",
            artists: [
              {
                id: 1,
                timeStart: "2023-07-21T12:30+02:00",
                timeEnd: "2023-07-21T14:30+02:00",
                artist: "Rick Baguette",
              },
            ],
          },
          {
            stage: "core",
            artists: [
              {
                id: 1,
                timeStart: "2023-07-21T13:00+02:00",
                timeEnd: "2023-07-21T15:00+02:00",
                artist: "A Local Hero",
              },
            ],
          },
          {
            stage: "crystalGarden",
            artists: [
              {
                id: 1,
                timeStart: "2023-07-21T12:00+02:00",
                timeEnd: "2023-07-21T14:00+02:00",
                artist: "Loub",
              },
            ],
          },
          {
            stage: "theLibrary",
            artists: [
              {
                id: 1,
                timeStart: "2023-07-21T12:00+02:00",
                timeEnd: "2023-07-21T13:00+02:00",
                artist: "D-Wayne",
              },
            ],
          },
          {
            stage: "mooseBar",
            artists: [
              {
                id: 1,
                timeStart: "2023-07-21T12:00+02:00",
                timeEnd: "2023-07-21T16:00+02:00",
                artist: "Mr E",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    weekNumber: 2,
    weekName: "Week 2",
    days: [
      {
        weekDay: "friday",
        stages: [
          {
            stage: "mainstage",
            artists: [
              {
                id: 1,
                timeStart: "2023-07-21T12:00+02:00",
                timeEnd: "2023-07-21T14:30+02:00",
                artist: "Daybreak session: Claptone",
              },
            ],
          },
          {
            stage: "freedom",
            artists: [
              {
                id: 1,
                timeStart: "2023-07-21T12:00+02:00",
                timeEnd: "2023-07-21T13:30+02:00",
                artist: "Goldfox",
              },
            ],
          },
          {
            stage: "theRoseGarden",
            artists: [
              {
                id: 1,
                timeStart: "2023-07-21T12:00+02:00",
                timeEnd: "2023-07-21T13:00+02:00",
                artist: "Primate",
              },
            ],
          },
          {
            stage: "elixir",
            artists: [
              {
                id: 1,
                timeStart: "2023-07-21T12:00+02:00",
                timeEnd: "2023-07-21T13:00+02:00",
                artist: "Primate",
              },
            ],
          },
          {
            stage: "cage",
            artists: [
              {
                id: 1,
                timeStart: "2023-07-21T12:00+02:00",
                timeEnd: "2023-07-21T13:00+02:00",
                artist: "Ender vs. Massive Disorder",
              },
            ],
          },
          {
            stage: "theRaveCave",
            artists: [
              {
                id: 1,
                timeStart: "2023-07-21T13:00+02:00",
                timeEnd: "2023-07-21T14:00+02:00",
                artist: "Structure",
              },
            ],
          },
          {
            stage: "youphoria",
            artists: [
              {
                id: 1,
                timeStart: "2023-07-21T13:00+02:00",
                timeEnd: "2023-07-21T14:30+02:00",
                artist: "Rdeem",
              },
            ],
          },
          {
            stage: "terraSolis",
            artists: [
              {
                id: 1,
                timeStart: "2023-07-21T12:30+02:00",
                timeEnd: "2023-07-21T14:30+02:00",
                artist: "Calao",
              },
            ],
          },
          {
            stage: "rise",
            artists: [
              {
                id: 1,
                timeStart: "2023-07-21T12:30+02:00",
                timeEnd: "2023-07-21T15:30+02:00",
                artist: "To be announced",
              },
            ],
          },
          {
            stage: "atmosphere",
            artists: [
              {
                id: 1,
                timeStart: "2023-07-21T12:00+02:00",
                timeEnd: "2023-07-21T13:30+02:00",
                artist: "Amekmar",
              },
            ],
          },
          {
            stage: "core",
            artists: [
              {
                id: 1,
                timeStart: "2023-07-21T12:30+02:00",
                timeEnd: "2023-07-21T14:30+02:00",
                artist: "Olympe",
              },
            ],
          },
          {
            stage: "crystalGarden",
            artists: [
              {
                id: 1,
                timeStart: "2023-07-21T12:00+02:00",
                timeEnd: "2023-07-21T13:00+02:00",
                artist: "Neon",
              },
            ],
          },
          {
            stage: "theLibrary",
            artists: [
              {
                id: 1,
                timeStart: "2023-07-21T12:00+02:00",
                timeEnd: "2023-07-21T13:00+02:00",
                artist: "Meaghan",
              },
            ],
          },
          {
            stage: "mooseBar",
            artists: [
              {
                id: 1,
                timeStart: "2023-07-21T12:00+02:00",
                timeEnd: "2023-07-21T16:00+02:00",
                artist: "Filip",
              },
            ],
          },
        ],
      },
      {
        weekDay: "saturday",
        stages: [
          {
            stage: "mainstage",
            artists: [],
          },
          {
            stage: "freedom",
            artists: [],
          },
          {
            stage: "theRoseGarden",
            artists: [],
          },
          {
            stage: "elixir",
            artists: [],
          },
          {
            stage: "cage",
            artists: [],
          },
          {
            stage: "theRaveCave",
            artists: [],
          },
          {
            stage: "youphoria",
            artists: [],
          },
          {
            stage: "terraSolis",
            artists: [],
          },
          {
            stage: "rise",
            artists: [],
          },
          {
            stage: "atmosphere",
            artists: [],
          },
          {
            stage: "core",
            artists: [],
          },
          {
            stage: "crystalGarden",
            artists: [],
          },
          {
            stage: "theLibrary",
            artists: [],
          },
          {
            stage: "mooseBar",
            artists: [],
          },
        ],
      },
      {
        weekDay: "sunday",
        stages: [
          {
            stage: "mainstage",
            artists: [],
          },
          {
            stage: "freedom",
            artists: [],
          },
          {
            stage: "theRoseGarden",
            artists: [],
          },
          {
            stage: "elixir",
            artists: [],
          },
          {
            stage: "cage",
            artists: [],
          },
          {
            stage: "theRaveCave",
            artists: [],
          },
          {
            stage: "youphoria",
            artists: [],
          },
          {
            stage: "terraSolis",
            artists: [],
          },
          {
            stage: "rise",
            artists: [],
          },
          {
            stage: "atmosphere",
            artists: [],
          },
          {
            stage: "core",
            artists: [],
          },
          {
            stage: "crystalGarden",
            artists: [],
          },
          {
            stage: "theLibrary",
            artists: [],
          },
          {
            stage: "mooseBar",
            artists: [],
          },
        ],
      },
    ],
  },
];

function App() {
  const [shareOverlayVisible, setShareOverlayVisible] = useState(false);

  const [currentWeek, setCurrentWeek] = useState(0);
  const [currentDay, setCurrentDay] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);

  const weeksCount = Object.keys(schedule).length;
  const daysCount = Object.keys(schedule[0].days).length;
  const stagesCount = Object.keys(schedule[0].days[0].stages).length;

  //   useEffect(() => {
  //     fetch("https://walrus-app-9mwix.ondigitalocean.app/api/schedule")
  //       .then((response) => response.json())
  //       .then((data) => console.log(data));
  //   }, []);

  const stageSchedule =
    schedule[currentWeek].days[currentDay].stages[currentStage].artists;

  const changeWeek = (changedWeek: number) => {
    setCurrentWeek(changedWeek);
  };

  const changeDay = (changedDay: number) => {
    setCurrentDay(changedDay);
  };

  const changeStage = (changedStage: number) => {
    setCurrentStage(changedStage);
  };

  const updateSlotStatus = (slotId: number) => {
    alert("Sending to BE. Slot ID:" + slotId);
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

  const openShareOverlay = () => {
    setShareOverlayVisible(true);
  };

  const closeShareOverlay = () => {
    setShareOverlayVisible(false);
  };

  return (
    <div>
      <div id="top-buttons-container">
        <div
          id="share-buttons-overlay"
          className={shareOverlayVisible ? "flex" : "hidden"}
        >
          <div className="top-button-container">
            <button id="share" onClick={closeShareOverlay}></button>
            <div className="top-button-description">Share</div>
          </div>
          <div className="top-button-container">
            <button id="donate"></button>
            <div className="top-button-description">Donate</div>
          </div>
        </div>
        <div id="top-buttons" className={shareOverlayVisible ? "tinted" : ""}>
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
            <button id="share-schedule" onClick={openShareOverlay}>
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
      {/* Week > Day > Stage selector  */}
      <div>
        <div id="week-selector">
          <div className="week active">Week 1</div>
          <div className="week">Week 2</div>
        </div>
        <div id="day-selector">
          <div className="day active">Friday</div>
          <div className="day">Saturday</div>
          <div className="day">Sunday</div>
        </div>
        <div id="stage-selector">
          <div className="stage-item stage-previous-next">&lt;</div>
          <div id="stage" className="stage-item active">
            Mainstage
          </div>
          <div className="stage-item stage-previous-next">&gt;</div>
        </div>
      </div>
      {/* Current stage schedule  */}
      <div id="schedule">
        {stageSchedule.map((slot, i) => {
          const hourStart = new Date(Date.parse(slot.timeStart));
          const hourEnd = new Date(Date.parse(slot.timeEnd));

          return (
            <div key={slot.id} onClick={() => updateSlotStatus(slot.id)}>
              {(hourStart.getHours() < 10 ? "0" : "") + hourStart.getHours()}:
              {(hourStart.getMinutes() < 10 ? "0" : "") +
                hourStart.getMinutes()}
              -{(hourEnd.getHours() < 10 ? "0" : "") + hourEnd.getHours()}:
              {(hourEnd.getMinutes() < 10 ? "0" : "") + hourEnd.getMinutes()}{" "}
              {slot.artist}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
