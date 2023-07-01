export const DonateButton = () => {
  const handleDonateClick = () => {
    window.open("https://buy.stripe.com/6oE7tu7UM3235dCeUU", "_blank");
  };

  return (
    <div className="top-button-container">
      <button id="donate" onClick={handleDonateClick}>
        <img src="/heart.png" alt="Donate" />
      </button>
      <div className="top-button-description">Donate</div>
    </div>
  );
};
