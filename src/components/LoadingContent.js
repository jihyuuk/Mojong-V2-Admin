import React from "react";
import { Spinner } from "react-bootstrap";

function LoadingContent() {

    return (
        <div className='flex-grow-1  d-flex align-items-center justify-content-center'>
            <Spinner animation="border" variant="secondary" className="mb-5"/>
        </div>
    )
}

export default LoadingContent;