const errorActionStyle = `
    padding: 2px 8px;
    border: 1px solid black;
    background-color:red;
    color: black;
    `;

let stop = false;
export const fatalMiddleware = store => next => action => {
  if(stop)
    return;
  const aType = action.type || '';

  if(aType === 'notify/fatal') {
    console.error(`%c === INCOMING FATAL NOTIFICATION WILL ACTION BLOCK ANY FURTHER ACTIONS ===`, errorActionStyle);
    stop = true;
  }
  return next(action);
}
