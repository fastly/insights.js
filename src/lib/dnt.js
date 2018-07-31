const getDNT = () => {
  const hasWindowDNT = "doNotTrack" in window;
  const hasNavigatorDNT = "doNotTrack" in navigator;

  let val;

  if (hasNavigatorDNT) {
    val = navigator.doNotTrack;
  } else if (hasWindowDNT) {
    val = window.doNotTrack;
  } else {
    val = "0";
  }

  return ["yes", "1"].includes(val);
};

const hasDNT = getDNT();

export default hasDNT;
