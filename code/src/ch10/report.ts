// report function without additional transformer
const staticReport = (content: string) => {
  const header = "=== Header ===";
  const footer = "=== Footer ===";

  return [header, content, footer].join("\n");
};

const report = (
  content: string,
  transformer: (s: string) => string = (s) => s
) => {
  const header = "=== Header ===";
  const footer = "=== Footer ===";

  return [header, transformer(content), footer].join("\n");
};

console.log(report("hello world"));
console.log(report("hello world", (s) => s.toUpperCase()));

export { report, staticReport };
