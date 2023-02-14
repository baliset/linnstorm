import { useState } from 'react'
import './App.css'
import {Btn} from './Btn'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <div className="card">
        <Btn onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </Btn>
      </div>
    </div>
  )
}

export default App
