/**
 *
 * @param a  array to reduce
 * @param f  function that returns a map entry, returned key value pair will be added to a map
 * @param o  optional starter object, defaults to empty object
 * @returns object with the key value pairs created by the function passed into oreduce
 */
export function oReduce(a,f,o={})
{
  return a.reduce((accum,v)=>{
    const [k,nv]=f(v, accum);
    accum[k]= nv;
    return accum;
  }, o);
}
