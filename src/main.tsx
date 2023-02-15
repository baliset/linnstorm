import React from 'react'
import './index.css'
import {render} from 'react-dom';
import {connectRootComponent} from './actions-integration';
import {AboveApp} from './AboveApp';


const RootComponent =  connectRootComponent(AboveApp) as unknown as React.Component;
// @ts-ignore
render(<RootComponent/>,  document.getElementById('root'));
