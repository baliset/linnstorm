export const isEmptyObject = o => {
  for(let p in o)
    return false;
  return true;
}
