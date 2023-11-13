function Quotes(quotes: string[]) {
  return (
    <ul>
      {quotes.map((quote, index) => (
        <li key={index}>{quote}</li>
      ))}
    </ul>
  );
}

export default Quotes;
