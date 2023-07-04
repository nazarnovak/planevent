import { useState, useEffect } from "react";

import { DonateButton } from "./DonateButton/DonateButton";

interface Props {
  sharedLineupID: string;
  following: boolean;
  viewingOwnSchedule: boolean;
}

export const SharedTopButtons = (props: Props) => {
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    setFollowing(props.following);
  }, [props.following]);

  const handleMyLineupClick = () => {
    let url = window.location.protocol + "//" + window.location.hostname + "/";
    if (process.env.REACT_APP_STAGE === "dev") {
      url =
        window.location.protocol +
        "//" +
        window.location.hostname +
        ":" +
        window.location.port +
        "/";
    }
    window.location.href = url;
  };

  // TODO: How to see if I follow this person or not the first time I load this page?

  const handleFollowLineup = (follow: boolean) => {
    let url =
      "https://planevent.me/api/follow?publicId=" + props.sharedLineupID;
    if (!follow) {
      url =
        "https://planevent.me/api/unfollow?publicId=" + props.sharedLineupID;
    }

    fetch(url, {
      method: "POST",
      credentials: "include",
    }).then((response) => {
      if (!response.ok) {
        throw new Error("Something went wrong when updating attendance");
      }

      setFollowing(follow);
    });
  };

  return (
    <div id="top-buttons-container">
      <div id="top-buttons">
        <div className="top-button-container">
          <button
            id="my-schedule"
            className="button-black"
            onClick={handleMyLineupClick}
          >
            <img src="/my-page.png" alt="Create my lineup" />
          </button>
          <div className="top-button-description">Create my lineup</div>
        </div>
        {!props.viewingOwnSchedule && (
          <div className="top-button-container">
            {!following && (
              <>
                <button
                  id="my-schedule"
                  className="button-black"
                  onClick={() => handleFollowLineup(true)}
                >
                  <img src="/plus.png" alt="Follow this lineup" />
                </button>
                <div className="top-button-description">Follow this lineup</div>
              </>
            )}
            {following && (
              <>
                <button
                  id="my-schedule"
                  className="button-black minus-button"
                  onClick={() => handleFollowLineup(false)}
                >
                  <img
                    id="minus-image"
                    src="/minus.png"
                    alt="Stop follow this lineup"
                  />
                </button>
                <div className="top-button-description">
                  Stop following this lineup
                </div>
              </>
            )}
          </div>
        )}
        <DonateButton />
      </div>
    </div>
  );
};
