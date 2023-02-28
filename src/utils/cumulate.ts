// given an array of numbers, return a new array whose values are arr[0], arr[0]+arr[1], arr[0]+arr[1]+arr[2], etc.
export function cumulate(arr:number[]):number[]
{
  return arr.reduce((accum,v,i)=>{
    accum[i] += (i? accum[i-1]:0);
    return accum;
  },arr)

}
