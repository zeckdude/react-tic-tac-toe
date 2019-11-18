export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function getRandomValueInArray(arr) {
  return arr[Math.floor(Math.random()*arr.length)];
}