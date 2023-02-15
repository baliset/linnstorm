const actionStyle = `
    padding: 2px 8px;
    border: 1px solid black;
    background-color:plum;
    color: black;
    `;

const errorActionStyle = `
    padding: 2px 8px;
    border: 1px solid black;
    background-color:red;
    color: black;
    `;

export const loggingMiddleware = store => next => action => {
  const aType = action.type || '';
  const style = aType? actionStyle: errorActionStyle;
  console[aType?'log':'error'](`%c +action - ${action.type}`, style, action);
  return next(action);
}
