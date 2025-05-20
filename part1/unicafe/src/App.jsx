import { useState } from "react";

const Title = (props) => <h2>{props.name}</h2>;

const Button = (props) => <button onClick={props.onClick}>{props.text}</button>;

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const incrementGood = () => {
    setGood(good + 1);
  };

  const incrementNeutral = () => {
    setNeutral(neutral + 1);
  };

  const incrementBad = () => {
    setBad(bad + 1);
  };

  const total = () => {
    return good + neutral + bad;
  };

  const average = () => {
    if (total() === 0) return 0;
    return (good * 1 + neutral * 0 + bad * -1) / total();
  };

  const positivePercent = () => {
    if (total() === 0) return 0;
    return (good / total()) * 100;
  };

  return (
    <div>
      <Title name="give feedback" />
      <Button onClick={incrementGood} text="good" />
      <Button onClick={incrementNeutral} text="neutral" />
      <Button onClick={incrementBad} text="bad" />
      <Title name="statistics" />
      <div>good {good}</div>
      <div>neutral {neutral}</div>
      <div>bad {bad}</div>
      <div>all {total()}</div>
      <div>average {average()}</div>
      <div>positive {positivePercent()} %</div>
    </div>
  );
};

export default App;
