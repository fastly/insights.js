// Get the arguments passed to the script via src query string

const hasSource = s => s.hasAttribute("src");
const isFastlyJs = s => /\/fastly.js\?/.test(s.getAttribute("src"));

function parse() {
  const scripts = Array.apply(null, document.getElementsByTagName("script"));
  const script = scripts.filter(hasSource).filter(isFastlyJs);

  if (!script.length) return {};

  const urlAndQuery = script[0].getAttribute("src").split("?");
  let args = {};

  if (urlAndQuery.length === 2 && urlAndQuery[1] !== "") {
    const queryParts = urlAndQuery[1].split("&");
    args = queryParts.reduce((data, part) => {
      const pair = part.split("=");
      if (typeof pair[1] !== "undefined") {
        data[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
      } else {
        data[decodeURIComponent(pair[0])] = pair[1];
      }
      return data;
    }, {});
  }

  return args;
}

export { parse };
