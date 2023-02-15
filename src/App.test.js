import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  // todo this test is broken until is the useSelector hook is step to work with it also
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});
