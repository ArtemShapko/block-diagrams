export const SIZE = 100;

function GET_STATE() {
  return [...Array(0)].map((_, i) => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
  }));
}
export const INITIAL_STATE = GET_STATE();
