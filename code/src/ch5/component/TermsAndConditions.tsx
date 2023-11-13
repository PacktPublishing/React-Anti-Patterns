import React, {useState} from "react";

const TheLegalContent = () => {
  return (
    <p>
      {/*...*/}
    </p>
  );
};

type CheckBoxProps = {
  label: string;
  isChecked: boolean;
  onCheck: (event: any) => void
}

const CheckBox = ({label, isChecked, onCheck}: CheckBoxProps) => {
  return (
    <label>
      <input
        type="checkbox"
        checked={isChecked}
        onChange={onCheck}
      />
      {label}
    </label>
  )
}

type ButtonProps = {
  type: 'standard' | 'primary' | 'secondary';
  label: string;
  disabled?: boolean;
}

const Button = ({label, disabled = true}: ButtonProps) => {
  return (
    <div style={{margin: '0.5rem 0'}}>
      <button disabled={disabled}>{label}</button>
    </div>
  )
}

const UserConsent = () => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
  };

  return (
    <>
      <CheckBox isChecked={isChecked} onCheck={handleCheckboxChange} label="I accept the terms and conditions" />
      <Button type="primary" label="Next" disabled={!isChecked} />
    </>
  );
};

const TermsAndConditions = () => {
  return (
    <div>
      <h2>Terms and Conditions</h2>
      <TheLegalContent/>
      <UserConsent/>
    </div>
  );
};

export {TermsAndConditions};
