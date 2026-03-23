const SHARE_URL = "https://lovecheck.us/";

const SHARE_STRINGS = {
  title: "LoveCheck",
  text: (score) =>
    `I just did the LoveCheck quiz — do it too so we can compare 👀${score != null ? `\nMy result: ${score}%` : ""}`,
};

export { SHARE_URL, SHARE_STRINGS };
