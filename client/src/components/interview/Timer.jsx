import React from "react";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

function Timer({ timeLeft, totalTime }) {
  const percentage = (timeLeft / totalTime) * 100;

  return (
    <div className="w-20 h-20">
      <CircularProgressbar
        value={percentage}
        text={`${timeLeft}s`}
        styles={buildStyles({
          textSize: '28px',
          pathColor: '#10b981', // emerald-500
          textColor: '#065f46', // emerald-800
          trailColor: '#ecfdf5', // emerald-50
          pathTransitionDuration: 0.5,
          strokeLinecap: 'round',
        })}
      />
    </div>
  );
}

export default Timer;