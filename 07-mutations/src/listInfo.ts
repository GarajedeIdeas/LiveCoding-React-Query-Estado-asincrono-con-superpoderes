let id = 0;
let list = [
  "apple",
  "banana",
  "pineapple",
  "grapefruit",
  "dragonfruit",
  "grapes"
].map((d) => ({ id: id++, name: d, notes: "These are some notes" }));

export default {
  list,
  id
};
