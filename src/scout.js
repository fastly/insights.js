/* global config */
import hasProp from "./util/has";

const cutsTheMustard = (config.ctm =
  hasProp(window, "Promise") &&
  hasProp(window, "Set") &&
  hasProp(window, "fetch") &&
  hasProp(window, "performance.getEntries"));

function isWithinSample(sample) {
  const seed = parseFloat(Math.random().toFixed(2));
  return seed <= sample;
}

function loadWhenReady(fn) {
  if (document.readyState !== "complete") {
    document.addEventListener("readystatechange", () => {
      if (document.readyState === "complete") {
        fn();
      }
    });
  } else {
    fn();
  }
}

function init() {
  const baseScript = document.getElementsByTagName("script")[0];
  const script = document.createElement("script");
  script.src = config.build;

  script.onload = () => {
    if (typeof window.FASTLY.init === "function") {
      window.FASTLY.init(config);
    }
  };

  baseScript.parentNode.insertBefore(script, baseScript);
}

if (cutsTheMustard && isWithinSample(config.settings.sample)) {
  loadWhenReady(() => setTimeout(init, config.settings.delay || 0));
}

window.FASTLY = window.FASTLY || {};
window.FASTLY.ctm = cutsTheMustard;
window.FASTLY.config = config;
