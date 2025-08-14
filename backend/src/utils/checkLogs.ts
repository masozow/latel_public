import queryLogs from "./queryLog.js";

const logs = await queryLogs(); // All logs
console.log(logs);

// const errorLogs = await queryLogs("ERROR"); // Only ERROR level logs
// console.log(errorLogs);

// Need to perform more queries to filter by generic ID and ensure the message contains
// for example "insert product", and by date, to know who entered the product at
// that specific moment.
