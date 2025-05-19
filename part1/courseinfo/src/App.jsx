const Header = (props) => {
  return <h1>{props.course}</h1>;
};

const Part = (props) => {
  return (
    <p>
      {props.part} {props.exercises}
    </p>
  );
};

const Content = (props) => {
  const [n1, n2, n3] = props.parts.map((p) => p.name);
  const [ex1, ex2, ex3] = props.parts.map((p) => p.exercises);

  return (
    <>
      <Part part={n1} exercises={ex1} />
      <Part part={n2} exercises={ex2} />
      <Part part={n3} exercises={ex3} />
    </>
  );
};

const Total = (props) => {
  const [ex1, ex2, ex3] = props.parts.map((p) => p.exercises);
  return <p>Number of exericses {ex1 + ex2 + ex3}</p>;
};

const App = () => {
  const course = "Half Stack application development";
  const parts = [
    {
      name: "Fundamentals of React",
      exercises: 10,
    },
    {
      name: "Using props to pass data",
      exercises: 7,
    },
    {
      name: "State of a component",
      exercises: 14,
    },
  ];

  return (
    <div>
      <Header course={course} />
      <Content parts={parts} />
      <Total parts={parts} />
    </div>
  );
};

export default App;
