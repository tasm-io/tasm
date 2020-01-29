import React from 'react';
import '../App.css';

import { useDispatch, useSelector } from "react-redux";
import {SET_CODE, UPLOAD_ERROR} from '../redux/code';

const FileUpload: React.FC = () => {
    const dispatch = useDispatch();
    return (
    <div className="FileUpload">
        <input type="file" 
            id="fileUpload" 
            style={{display: "none"}}
            onChange={(event) => {
                handleFileUpload(event.target.files!, dispatch)
            }}
            />
        <button 
            className="Button" 
            onClick={() => document.getElementById("fileUpload")!.click()}>
            Upload File 
        </button>
    </div>
    )
};

function handleFileUpload(files: FileList, dispatch: Function) {
    let file : File = files[0]
    let fileReader : FileReader = new FileReader()
    if(file.type !== 'text/plain') 
        dispatch({type: UPLOAD_ERROR, payload: 'Unsupported file type'})
    else if(file.size > 1000)
        dispatch({type: UPLOAD_ERROR, payload: 'File too big'})
    else {
        fileReader.onloadend = () => dispatch({type: SET_CODE, payload: fileReader.result})
        fileReader.readAsText(file)
    }
    }

export default FileUpload;
