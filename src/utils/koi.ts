/* 获取随机整数 */
export function randomNum(m: number,n: number){
  var num = Math.floor(Math.random()*(m - n) + n);
  return num;
}
