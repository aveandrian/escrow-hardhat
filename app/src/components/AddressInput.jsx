import { ethers } from 'ethers';
import { useState } from 'react';

export default function AddressInput(props) {
  const [error, setError] = useState(false);
  const [userInput, setUserInput] = useState("");

  const handleChange = (event) => {
    setUserInput(event.target.value);
  };
  
  const handleBlur = (event) => {
    if (event.target.validity.patternMismatch) {
      setError(true); 
    } else {
      if(!ethers.utils.isAddress(event.target.value))
        setError(true)
      else setError(false)
    } 
  };

  function style(error) {
    if (error) {
      return {
        backgroundColor: "rgba(200, 0, 0, 0.5)"
        // Or any other style you prefer
      };
    }
  }

  return (
    
    <>
    <label>
    {props.name}
    <input 
      type="text" 
      id={props.id} 
      placeholder='0x000...' 
      pattern='0x[A-Fa-f0-9]{40}' 
      onBlur={handleBlur} 
      style={style(error)}   
      onChange={handleChange}
      value={userInput}
    />
    {error && (
      <p role="alert" className='alert' style={{ color: "rgb(255, 0, 0)"}}>
        Please make sure you've entered a valid address
      </p>
    )}
    </label>
    </>
  );
}
