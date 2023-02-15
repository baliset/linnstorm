/*
    A signature adapting function generator: WHY?

    You have logic in an enclosed function that needs to move out its context (classic example is UI)
    to where it belongs, with logical code that has no UI.

    Example: function 'foo' takes a callback, that has TWO parameters x,y  (often it is zero params)
    But your callback also needs values a,b,and c which are enclosed
    Your function isn't trivial, is reused in other contexts, or has no business being embedded with User Interface code

    foo((x,y)=>{do something with x,y and enclosed a, b, c})

    You can locate the function properly if the callback had the signature
    (a,b,c,x,y)=>{}

    We solve this problem by currying arguments onto the callback function, so that it can be extracted

    foo(firstArgs(myfunction, a,b,c));  // firstArgs returns a callback feeding it the *first arguments* from your context

 */

// function syntax and unknown this value are purposely used to preserve correct behavior of the wrapped function

export function firstArgs(f)
{
  const args = Array.from(arguments).filter((v,i)=>i>0);
  return function()
  {
    return f.apply(this, [...args, ...Array.from(arguments)]);
  }
}
