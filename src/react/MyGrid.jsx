import React, {useCallback, useRef, useState} from 'react';
import "ag-grid-enterprise";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import 'ag-grid-community/dist/styles/ag-theme-balham-dark.css';


import {CheckboxRenderer} from '../agstuff/CheckboxRenderer';
import {LinnParamRenderer} from "../agstuff/LinnParamRenderer";
import {PatchNameEditor} from "../agstuff/PatchNameEditor.jsx";

const style = {height: '700px', width: '100%'};


const frameworkComponents = {
    checkboxRenderer:CheckboxRenderer,
    linnParamRenderer: LinnParamRenderer,
    patchNameEditor:PatchNameEditor,
};

export const  MyGrid = ({rowData, columnDefs,  getRowNodeId, menu, dark=true}) => {
    const gridRef = useRef(null);
    const onContextMenu = useCallback((e)=>e.preventDefault(),[])

    // setInterval(()=>gridRef?.current?.api?.gridOptionsWrapper?.ons,1000);

    const ready = (e)=>{
        console.log(`ready event`, e)
    }

    const gridOptions = {suppressPropertyNamesCheck : true};
    const className = `ag-theme-balham${dark? '-dark':''}`;
    return (
        <div onContextMenu={onContextMenu} className={className} style={style}>
            <AgGridReact
                onGridReady={ready}
                ref={gridRef}
                allowContextMenuWithControlKey={true}

                getContextMenuItems={menu}
                components={frameworkComponents}
                gridOptions={gridOptions}
                toolPanel={'columns'}
                showToolPanel={true}
                reactNext={true}
                getRowNodeId={getRowNodeId}
                columnDefs={columnDefs} rowData={rowData}/>
        </div>
    );
}
