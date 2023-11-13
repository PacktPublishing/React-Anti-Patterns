// const Title = () => <div>Title ｜ This is a title</div>;

// const Title = ({ title }: { title: string }) => <div>Title ｜ {title}</div>;

// const Title = ({
//   title,
//   transformer,
// }: {
//   title: string;
//   transformer: (s: string) => string;
// }) => <div>Title ｜ {transformer(title)}</div>;

// const Title = ({
//   title,
//   render,
// }: {
//   title: string;
//   render: (s: string) => React.ReactNode;
// }) => <div>{render(title)}</div>;

const Title = ({
  title,
  children,
}: {
  title: string;
  children: (s: string) => React.ReactNode;
}) => <div>{children(title)}</div>;

const App = () => {
  return (
    <Title title="This is a title">
      {(s: string) => {
        const formatted = s.toUpperCase();
        return <h3>{formatted}</h3>;
      }}
    </Title>
  );
};

export default App;