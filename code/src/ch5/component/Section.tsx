type SectionProps = {
  heading: string;
  content: string;
};
const Section = ({ heading, content }: SectionProps) => {
  return (
    <article>
      <h1>{heading}</h1>
      <p>{content}</p>
    </article>
  );
};

export { Section };
