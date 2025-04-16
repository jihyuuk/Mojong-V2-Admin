import React, { useEffect, useState } from "react";
import { Accordion, Button, Form } from "react-bootstrap";

function DiscountAccordion({ setDiscountAmount, totalPrice }) {

    const [discountMethod, setDiscountMethod] = useState("won");
    const [discountInput, setDiscountInput] = useState(0);

    const inputChange = (e) => {
        const inputValue = Number(e.target.value.replace(/[^\d]/g, ""));

        if (discountMethod === "won") {
            setDiscountInput(inputValue);
        } else {
            //비율은 100%를 넘길 수 없다.
            setDiscountInput(Math.min(inputValue, 100));
        }
    }

    useEffect(() => {
        if (discountMethod === "won") {
            setDiscountAmount(discountInput);
        } else {
            setDiscountAmount(
                Math.floor(totalPrice * discountInput / 100)
            );
        }
    }, [discountInput]);

    const radioClick = (value) => {
        setDiscountInput(0);
        setDiscountMethod(value);
    }

    return (
        <Accordion defaultActiveKey={0} className='mt-2'>
            <Accordion.Item eventKey='0'>
                <Accordion.Header>
                    <div className='fw-semibold text-secondary d-flex align-items-center'>
                        <div>
                            할인 적용하기
                        </div>
                    </div>
                </Accordion.Header>
                <Accordion.Body>
                    <div className='fs-6'>
                        <div className='d-flex align-items-center'>
                            <div className='text-nowrap me-5 text-secondary fw-semibold flex-grow-1'>
                                할인방식
                            </div>
                            <div className="d-flex gap-4">
                                <Form.Check
                                    type="radio"
                                    name="discountType"
                                    id="discount-fixed"
                                    label="금액 (₩)"
                                    value="fixed"
                                    checked={discountMethod === "won"}
                                    onClick={() => radioClick("won")}
                                />
                                <Form.Check
                                    type="radio"
                                    name="discountType"
                                    id="discount-percent"
                                    label="비율 (%)"
                                    value="percent"
                                    checked={discountMethod === "percent"}
                                    onClick={() => radioClick("percent")}
                                />
                            </div>
                        </div>
                        <div className='mt-3 d-flex align-items-center'>
                            <div className='text-nowrap me-5 text-secondary fw-semibold'>
                                할인금액
                            </div>
                            <Form.Control size='lg' className='flex-grow-1 text-end' type="text" pattern="\d*" inputMode="numeric" placeholder="0"
                                value={discountInput > 0 ? discountInput.toLocaleString('ko-KR') : ""}
                                onChange={inputChange}
                            />
                            <div className="ps-2">
                                {discountMethod === "won" ? "원" : "%"}
                            </div>
                        </div>
                    </div>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
}

export default DiscountAccordion;