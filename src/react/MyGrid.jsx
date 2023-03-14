import React, {useCallback, useRef} from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import 'ag-grid-community/dist/styles/ag-theme-balham-dark.css';
import 'react-contexify/ReactContexify.css';

import {CheckboxRenderer} from '../agstuff/CheckboxRenderer';
import {LinnParamRenderer} from "../agstuff/LinnParamRenderer";
import {UpdatedRenderer} from "../agstuff/UpdatedRenderer";
import {PatchNameRenderer} from "../agstuff/PatchNameRenderer";
import {DiffRenderer} from "../agstuff/DiffRenderer";
import {PatchNameEditor, PatchCommentEditor} from "../agstuff/PatchEditors";

const style = {height: '700px', width: '100%'};


const frameworkComponents = {
    checkboxRenderer:CheckboxRenderer,
    diffRenderer:DiffRenderer,
    linnParamRenderer: LinnParamRenderer,
    updatedRenderer: UpdatedRenderer,
    patchNameRenderer:PatchNameRenderer,
    patchNameEditor:PatchNameEditor,
    patchCommentEditor:PatchCommentEditor,
};

export const  MyGrid = ({children, contextM, rowData, columnDefs,  getRowNodeId, dark=true}) => {
    const gridRef = useRef(null);
    const ready = useCallback(e=>{console.log(`ready event`, e)},[]);

    const gridOptions = {suppressPropertyNamesCheck : true};
    const className = `ag-theme-balham${dark? '-dark':''}`;
    return (
        <div  className={className} style={style}>
            {children}
            <AgGridReact
                onCellContextMenu={contextM}
                onGridReady={ready}
                ref={gridRef}
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
