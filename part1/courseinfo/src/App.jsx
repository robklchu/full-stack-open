const Header = (props) => {
  return (
    <>
      <h1>{props.course}</h1>
    </>
  );
};

const Part = (props) => {
  return (
    <>
      <p>
        {props.part} {props.exercises}
      </p>
    </>
  );
};

const Content = (props) => {
  const [p1, p2, p3] = props.parts;
  const [ex1, ex2, ex3] = props.exercises;

  return (
    <>
      <Part part={p1} exercises={ex1} />
      <Part part={p2} exercises={ex2} />
      <Part part={p3} exercises={ex3} />
    </>
  );
};

const Total = (props) => {
  const [ex1, ex2, ex3] = props.exercises;
  return (
    <>
      <p>Number of exericses {ex1 + ex2 + ex3}</p>
    </>
  );
};

const App = () => {
  const course = "Half Stack application development";
  const part1 = {
    name: "Fundamentals of React",
    exercises: 10,
  };
  const part2 = {
    name: "Using props to pass data",
    exercises: 7,
  };
  const part3 = {
    name: "State of a component",
    exercises: 14,
  };

  const parts = [part1, part2, part3].map((p) => p.name);
  const exercises = [part1, part2, part3].map((p) => p.exercises);

  return (
    <div>
      <Header course={course} />
      <Content parts={parts} exercises={exercises} />
      <Total exercises={exercises} />
    </div>
  );
};

export default App;
