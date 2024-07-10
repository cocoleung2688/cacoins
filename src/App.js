import React, { useState } from 'react';
import './App.css';

function NoOfCoins({amountInt, amountDec}){
  const dollarImg = ['100dollars.png', '50dollars.png', '20dollars.png', '10dollars.png', '5dollars.png', '2dollars.png', '1dollar.png', '25cents.png', '10cents.png', '5cents.png'];
  let int = amountInt;
  let dec = amountDec;
  let dollars=[100, 50, 20, 10, 5];
  let coinsInt = [2, 1];
  let coinsDec = [25, 10, 5];
  let neededCoins = [];
  let i = 0;

  dollars.forEach(d => {
    let n = Math.floor(int / d);
    neededCoins.push(n);
    int = int - (n * d);
  });

  coinsInt.forEach(c => {
    let n = Math.floor(int / c);
    neededCoins.push(n);
    int = int - (n * c);
  });
  
  coinsDec.forEach(c => {
    let n = Math.floor(dec / c);
    neededCoins.push(n);
    dec = dec - (n * c);
  });
  
  return(
    <div className='grid grid-rows-5 grid-flow-col gap-4'>
      {dollarImg.map((img, i) => (
        <div key={i} className='flex items-center'>
          <img className='h-20' src={`${process.env.PUBLIC_URL}/${img}`} /> x{neededCoins[i]}
        </div>
      ))} 
    </div>
  );
}

function App() {
  const labelClass = `block text-gray-700 text-sm font-bold mb-2`;
  const inputClass = `shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`;
  const buttonClass = `mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`;
  const [amount, setAmount] = useState(0);
  const [modifiedAmount, setModifiedAmount] = useState(0);
  const [modifiedAmountInt, setmodifiedAmountInt] = useState(0);
  const [modifiedAmountDec, setmodifiedAmountDec] = useState(0);
  const [tips, setTips] = useState(0);
  const [noOfPpl, setNoOfPpl] = useState(1);

  const handleChangeAmount = (e) => {
    const val = e.target.value;
    if (val.match(/^\d*(\.\d{0,2})?$/)) {
      setAmount(val);
    }
  };

  const handleChangeTips = (e) => {
    const val = e.target.value;
    if (val === '' || /^\d+$/.test(val) && (/^\d*$/.test(val))) {
      setTips(val);
    }
  };

  const handleChangeNoOfPpl = (e) => {
    const val = e.target.value;
    if (val === '' || /^\d+$/.test(val) && (/^\d*$/.test(val))) {
      setNoOfPpl(val);
    }
  };

  const payAmount = () => {
    // Total amount with tips per number of people
    const a = parseFloat(amount);
    const t = parseFloat(tips);
    const n = parseFloat(noOfPpl);
    let total = 0;
    if (n != 0){
      total = (a+(a*t/100))/n;
    }

    // Ensure amount is a number
    let payAmount = parseFloat(total);
    if (isNaN(payAmount)) {
      console.error('Invalid number');
      return;
    }

    // Ensure the amount is a number and has two decimal places
    let amountStr = payAmount.toFixed(2);
    let [integerPart, decimalPart] = amountStr.split('.');

    let firstDecimal = parseInt(decimalPart[0]);
    let secondDecimal = parseInt(decimalPart[1]);

    if (secondDecimal === 1 || secondDecimal === 2){
      secondDecimal = 0;
    }else if (secondDecimal === 6 || secondDecimal === 7){
      secondDecimal = 5;
    }else if (secondDecimal === 3 || secondDecimal === 4){
      secondDecimal = 5;
    }else if (secondDecimal === 8 || secondDecimal === 9){
      if (firstDecimal === 9){
        integerPart = parseInt(integerPart) + 1;
        firstDecimal = 0;
        secondDecimal = 0;
      }else{
        firstDecimal += 1;
        secondDecimal = 0;
      }
    }

    setmodifiedAmountInt(integerPart);
    setmodifiedAmountDec(parseInt(`${firstDecimal}${secondDecimal}`));
    // Combine the parts back into a float number
    let modifiedAmountStr = `${integerPart}.${firstDecimal}${secondDecimal}`;

    setModifiedAmount(parseFloat(modifiedAmountStr));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <label htmlFor="numberInput" className={labelClass}>Amount:</label>
        <input
          type="number"
          value={amount}
          onChange={handleChangeAmount}
          className={inputClass}
        />

        <div className='grid grid-cols-2 gap-4 mt-4'>
          <div className='block relative'>
            <label htmlFor="numberInput" className={labelClass}>Tips:</label>
            <div className='flex'>
              <input
                type="text"
                value={tips}
                onChange={handleChangeTips}
                className={inputClass}
              />
              <span className="absolute inset-y-0 right-0 pt-7 pr-3 flex items-center text-gray-700">%</span>
            </div>
          </div>
          
          <div className='block'>
            <label htmlFor="numberInput" className={labelClass}>Number of people:</label>
            <input
              type="text"
              value={noOfPpl}
              onChange={handleChangeNoOfPpl}
              className={inputClass}
            />
          </div>
        </div>
        
        <button onClick={payAmount} className={buttonClass}>Calculate</button>
        
        <p className='mt-2 mb-2'>Payment per person: ${modifiedAmount.toFixed(2)}</p>

        <NoOfCoins amountInt={modifiedAmountInt} amountDec={modifiedAmountDec} />
      </div>
    </div>
  );
}

export default App;
