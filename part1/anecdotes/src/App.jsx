import { useState } from "react";

const Title = ({ name }) => <h2>{name}</h2>;

const Anecdote = ({ text }) => <div>{text}</div>;

const Count = ({ num }) => {
  if (num === 1) return <div>has {num} vote</div>;
  return <div>has {num} votes</div>;
};

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>;

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
    "The only way to go fast, is to go well.",
  ];

  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0));
  const [votingStarted, startVoting] = useState(false);

  const selectIndex = () => {
    const randomIndex = Math.floor(Math.random() * anecdotes.length);
    setSelected(randomIndex);
  };

  const incrementVote = () => {
    const copy = [...votes];
    copy[selected]++;
    setVotes(copy);
    startVoting(true);
  };

  const mostVote = Math.max(...votes);
  const mostVoteIndex = votes.indexOf(mostVote);

  return (
    <div>
      <Title name="Anecdote of the day" />
      <Anecdote text={anecdotes[selected]} />
      <Count num={votes[selected]} />
      <Button onClick={incrementVote} text="vote" />
      <Button onClick={selectIndex} text="next anecdote" />
      {votingStarted && <Title name="Anecdote with most votes" />}
      {votingStarted && <Anecdote text={anecdotes[mostVoteIndex]} />}
      {votingStarted && <Count num={mostVote} />}
    </div>
  );
};

export default App;
