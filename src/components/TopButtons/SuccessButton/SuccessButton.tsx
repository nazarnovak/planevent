export const SuccessButton = () => {
  return (
    <>
      <button className="success-checkmark-button button-green">
        <img src="/checkmark.png" alt="Copied to clipboard" />
      </button>
      <div className="top-button-description text-green">
        Link copied to clipboard
        <br />
      </div>
    </>
  );
};
