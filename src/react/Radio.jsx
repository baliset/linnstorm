import React, {useCallback, useState} from 'react';


export const Radio = ({name, choices, defaultChoice, setChoice}) => {
  const [v,setv] = useState(defaultChoice);
  const cb = useCallback(e=>(setv(e.target.value), setChoice(e.target.value)),[]);

 const cc = choices?.map(ch=>(<span key={ch}>
     <input type="radio" name={name} id={ch} value={ch} onChange={cb} checked={v===ch}/>
     <label htmlFor={ch}>{ch}</label>
    </span>
     ));
  return (<div>{cc}</div>);

}
