const SHARE_URL = "https://baddiecheck.com/";

const SHARE_STRINGS = {
  title: "BaddieMagnet",
  text: (score) =>
    `I just took the BaddieMagnet test — try it and let's compare pull game 👀${score != null ? `\nMy score: ${score}/100` : ""}`,
};

export { SHARE_URL, SHARE_STRINGS };
