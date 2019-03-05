// Randomly shuffle an array in-place using Fisher–Yates Shuffle
// https://bost.ocks.org/mike/shuffle/
export default function shuffle(array) {
  const a = [...array];
  let m = a.length;
  let t;
  let i;

  while (m) {
    i = Math.floor(Math.random() * m--);

    t = a[m];
    a[m] = a[i];
    a[i] = t;
  }

  return a;
}
