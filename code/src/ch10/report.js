// const report = (content: string) => {
//   const header = "=== Header ===";
//   const footer = "=== Footer ===";
//
//   return [header, content, footer].join("\n");
// };
//
var report = function (content, transformer) {
    if (transformer === void 0) { transformer = function (s) { return s; }; }
    var header = "=== Header ===";
    var footer = "=== Footer ===";
    return [header, transformer(content), footer].join("\n");
};
console.log(report("hello world"));
console.log(report("hello world", function (s) { return s.toUpperCase(); }));
