import React from "react";
import { Button } from "react-bootstrap";

function Footer({ onClick, value, disabled, show, children }) {

    if (!show) {
        return (<></>);
    }

    return (
        <footer className="p-2 pb-3 border-top">
            {children}
            <Button variant="success" className="w-100 fs-5 fw-semibold p-2 rounded-3" disabled={disabled} onClick={onClick}>
                {value}
            </Button>
        </footer>
    )
}

export default Footer;