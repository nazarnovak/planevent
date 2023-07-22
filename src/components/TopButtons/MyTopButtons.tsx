import { useState } from "react";

import { SuccessButton } from "./SuccessButton/SuccessButton";

interface Props {
  secretId: string;
  shareId: string;
  title: string;
  showShareError: boolean;
  shareOverlayOpen: boolean;
  closeShareOverlayOpen: () => void;
  handleMoveShareClick: () => void;
  setShowShareError: (show: boolean) => void;
  editMode: boolean;
  handleLineupToggleClick: () => void;
  contactUsSubmittedSuccess: boolean;
  handleContactUs: () => void;
  contactUsModalOpen: boolean;
}

export const MyTopButtons = (props: Props) => {
  const [linkCopiedSuccess, setLinkCopiedSuccess] = useState(false);

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

    props.closeShareOverlayOpen();
    setLinkCopiedSuccess(true);
    await timeout(2000);
    setLinkCopiedSuccess(false);
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

    props.closeShareOverlayOpen();
    setLinkCopiedSuccess(true);
    await timeout(2000);
    setLinkCopiedSuccess(false);
  };

  return (
    <>
      {props.shareOverlayOpen && (
        <div id="share-buttons-overlay">
          <div className="top-button-container">
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
          </div>
          <div className="top-button-container">
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
          </div>
        </div>
      )}
      <div id="top-buttons" className={props.shareOverlayOpen ? "tinted" : ""}>
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
          {!props.showShareError && !linkCopiedSuccess && (
            <>
              <button
                className={
                  props.shareOverlayOpen ? "button-white" : "button-black"
                }
                onClick={props.handleMoveShareClick}
              >
                <img
                  src={
                    props.shareOverlayOpen
                      ? "/chain-black.png"
                      : "/chain-white.png"
                  }
                  alt="move/share lineup"
                />
              </button>
              <div className="top-button-description">Move/share lineup</div>
            </>
          )}
          {!props.showShareError && linkCopiedSuccess && (
            <SuccessButton text="Link copied to clipboard" />
          )}
        </div>
        <ToggleLineupView
          editMode={props.editMode}
          handleLineupToggleClick={props.handleLineupToggleClick}
        />
        <div className="top-button-container">
          {!props.contactUsSubmittedSuccess && (
            <>
              <button
                id="contact-us"
                className={
                  props.contactUsModalOpen ? "button-white" : "button-black"
                }
                onClick={props.handleContactUs}
              >
                <img
                  src={
                    props.contactUsModalOpen
                      ? "/contact-us-black.png"
                      : "/contact-us-white.png"
                  }
                  alt="Contact us"
                />
              </button>
              <div className="top-button-description">Contact us</div>
            </>
          )}
          {props.contactUsSubmittedSuccess && (
            <SuccessButton text="Thank you for your feedback" />
          )}
        </div>
      </div>
    </>
  );
};

interface ToggleLineupViewProps {
  editMode: boolean;
  handleLineupToggleClick: () => void;
}

const ToggleLineupView = (props: ToggleLineupViewProps) => {
  return (
    <div className="top-button-container">
      <button
        id="toggle-lineup-view"
        className={props.editMode ? "button-black" : "button-white"}
        onClick={props.handleLineupToggleClick}
      >
        <img
          src={props.editMode ? "/clipboard-white.png" : "/clipboard-black.png"}
          alt="Show only artists I'm going to"
        />
      </button>
      <div className="top-button-description">
        {props.editMode ? "View my schedule" : "Edit my schedule"}
      </div>
    </div>
  );
};
