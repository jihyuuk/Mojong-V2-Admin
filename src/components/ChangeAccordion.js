import React, { useEffect, useState } from "react";
import { Accordion, Form } from "react-bootstrap";

function ChangeAccordion({ finalAmount }) {

    const [receivedAmount, setReceivedAmount] = useState(0);
    const [changeAmount, setChangeAmount] = useState(0);

    //잔돈 계산 로직
    useEffect(() => {
        setChangeAmount(receivedAmount - finalAmount);
    }, [receivedAmount]);

    const handleChange = (e) => {
        setReceivedAmount(
            Number(e.target.value.replace(/[^\d]/g, ""))
        );
    }

    return (
        <Accordion defaultActiveKey={0} className='mt-2'>
            <Accordion.Item eventKey='0'>
                <Accordion.Header>
                    <div className='fw-semibold text-secondary d-flex align-items-center'>
                        <div>
                            잔돈 계산기
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-calculator ms-2" viewBox="0 0 16 16">
                            <path d="M12 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                            <path d="M4 2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5z" />
                        </svg>
                    </div>
                </Accordion.Header>
                <Accordion.Body>
                    <div className='fs-6'>
                        <div className='d-flex align-items-center'>
                            <div className='text-nowrap me-5 text-secondary fw-semibold'>
                                받은금액
                            </div>
                            <Form.Control size='lg' className='flex-grow-1 text-end' type="text" pattern="\d*" inputMode="numeric" placeholder="0"
                                value={receivedAmount > 0 ? receivedAmount.toLocaleString('ko-KR') : ""}
                                onChange={handleChange}
                            />
                        </div>
                        <hr />
                        <div className={`d-flex justify-content-between fw-semibold ${changeAmount < 0 ? 'text-danger' : ''}`} style={{ fontSize: '1.15rem' }}>
                            <div>
                                거스름돈
                            </div>
                            <div>
                                {changeAmount.toLocaleString('ko-KR')}원
                            </div>
                        </div>
                    </div>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
}

export default ChangeAccordion;