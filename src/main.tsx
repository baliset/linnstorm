import React from 'react'
import './index.css'
import { createRoot } from 'react-dom/client';

import {connectRootComponent} from './actions-integration';
import {AboveApp} from './AboveApp';


const RootComponent =  connectRootComponent(AboveApp) as unknown as React.FunctionComponent;

const container = document.getElementById('root');

const root = createRoot(container!); // createRoot(container!) if you use TypeScript
root.render(<RootComponent />);
