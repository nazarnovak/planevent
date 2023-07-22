interface SuccessButtonProps {
  text: string;
}

export const SuccessButton = (props: SuccessButtonProps) => {
  return (
    <>
      <button className="button-green">
        <img src="/checkmark.png" alt={props.text} />
      </button>
      <div className="top-button-description text-green">
        {props.text}
        <br />
      </div>
    </>
  );
};
