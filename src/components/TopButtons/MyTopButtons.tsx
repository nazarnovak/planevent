import { useState } from "react";

import { SuccessButton } from "./SuccessButton/SuccessButton";
import { DonateButton } from "./DonateButton/DonateButton";

interface Props {
  secretId: string;
  shareId: string;
  title: string;
  showShareError: boolean;
  setShowShareError: (show: boolean) => void;
}

export const MyTopButtons = (props: Props) => {
  const [showMovedSuccess, setShowMovedSuccess] = useState(false);
  const [showSharedSuccess, setSharedSuccess] = useState(false);

  function timeout(delay: number) {
    return new Promise((res) => setTimeout(res, delay));
  }

  const handleMoveLineup = async () => {
    let url =
      window.location.protocol +
      "//" +
      window.location.hostname +
      "/move/" +
      props.secretId;

    if (process.env.REACT_APP_STAGE === "dev") {
      url =
        window.location.protocol +
        "//" +
        window.location.hostname +
        ":" +
        window.location.port +
        "/move/" +
        props.secretId;
    }

    navigator.clipboard.writeText(url);

    setShowMovedSuccess(true);
    await timeout(2000);
    setShowMovedSuccess(false);
  };

  const handleShareLineup = async () => {
    if (props.title === "Your name") {
      props.setShowShareError(true);
      return;
    }

    let url =
      window.location.protocol +
      "//" +
      window.location.hostname +
      "/shared/" +
      props.shareId;

    if (process.env.REACT_APP_STAGE === "dev") {
      url =
        window.location.protocol +
        "//" +
        window.location.hostname +
        ":" +
        window.location.port +
        "/shared/" +
        props.shareId;
    }

    navigator.clipboard.writeText(url);

    setSharedSuccess(true);
    await timeout(2000);
    setSharedSuccess(false);
  };

  return (
    <div id="top-buttons">
      <div className="top-button-container">
        {!showMovedSuccess && (
          <>
            <button
              id="move-lineup"
              className="button-black"
              onClick={handleMoveLineup}
            >
              <img src="/device.png" alt="Move lineup to a different device" />
            </button>
            <div className="top-button-description">
              Move lineup to a new device
            </div>
          </>
        )}
        {showMovedSuccess && <SuccessButton />}
      </div>
      <div className="top-button-container">
        {props.showShareError && (
          <>
            <button id="share-error" className="button-orange">
              <img src="/exclamation.png" alt="Please enter your name" />
            </button>
            <div className="top-button-description text-orange">
              Please enter your name
            </div>
          </>
        )}
        {!props.showShareError && !showSharedSuccess && (
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
        {!props.showShareError && showSharedSuccess && <SuccessButton />}
      </div>
      <DonateButton />
    </div>
  );
};
