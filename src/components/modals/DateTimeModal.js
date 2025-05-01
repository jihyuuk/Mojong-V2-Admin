import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";
import React, { forwardRef, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import DatePicker, { registerLocale } from "react-datepicker";


// locale 등록
registerLocale("ko", ko);

function DateTimeModal({ showDateModal, setShowDateModal, startDate, setStartDate, endDate, setEndDate, fetchPage, setIsFiltered }) {

    //모달 열렸을때 종료일 기본값 => 지금
    useEffect(() => {
        if (showDateModal && !endDate) {
            const plusOneHour = new Date();
            plusOneHour.setHours(plusOneHour.getHours() + 1);
            setEndDate(plusOneHour);
        }
    }, [showDateModal]);

    const submit = () => {
        //시작날짜가 종료날짜 전인지 검증
        if (!startDate || !endDate) {
            alert("시작일과 종료일을 모두 선택하세요.");
            return;
        }
        if (startDate > endDate) {
            alert("시작일이 종료일 보다 늦습니다.");
            return;
        }

        setIsFiltered(true);

        setShowDateModal(false);

        // 서버에 필터 요청 보내기
        fetchPage(0, startDate, endDate);
    }

    const StartInput = forwardRef(
        ({ value, onClick }, ref) => (
            <div className="d-flex align-items-center">

                {/* 시작 문구 */}
                <div className="fs-5 fw-semibold text-success me-3">시작</div>

                {/* 인풋창 */}
                <div className="d-flex align-items-center justify-content-between border rounded-3 py-1 px-2 fs-5" onClick={onClick} ref={ref} style={{ width: "211px" }}>
                    {value ? <div>{value}</div> : <div className="text-secondary">시작 날짜 선택</div>}
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-calendar" viewBox="0 0 16 16">
                        <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
                    </svg>
                </div>

            </div>
        ),
    );

    const EndInput = forwardRef(
        ({ value, onClick }, ref) => (
            <div className="d-flex align-items-center justify-content-center">

                {/* 시작 문구 */}
                <div className="fs-5 fw-semibold text-success me-3">종료</div>

                {/* 인풋창 */}
                <div className="d-flex align-items-center justify-content-between border rounded-3 py-1 px-2 fs-5" onClick={onClick} ref={ref} style={{ width: "211px" }}>
                    {value ? <div>{value}</div> : <div className="text-secondary">종료 날짜 선택</div>}

                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-calendar" viewBox="0 0 16 16">
                        <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
                    </svg>
                </div>

            </div>
        ),
    );


    return (
        <Modal
            show={showDateModal}
            backdrop="static"
            keyboard={false}
        >
            <section className="my-5 text-center">
                <DatePicker
                    customInput={<StartInput />}
                    onChange={(date) => setStartDate(date)}

                    locale="ko"
                    dateFormat="yyyy.MM.dd - HH시"
                    dateFormatCalendar="yyyy년 MM월"
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={60}
                    timeCaption="시작시간"
                    selected={startDate}
                />

                <div className="fs-4 fw-semibold py-1" style={{ paddingLeft: "40px" }}>~</div>

                <DatePicker
                    customInput={<EndInput />}
                    onChange={(date) => setEndDate(date)}

                    locale="ko"
                    dateFormat="yyyy.MM.dd - HH시"
                    dateFormatCalendar="yyyy년 MM월"
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={60}
                    timeCaption="종료시간"
                    selected={endDate}
                />
            </section>

            <footer className='d-flex gap-1 p-2 border-top'>
                <Button variant='secondary' className='fw-semibold py-2 text-nowrap px-5' onClick={() => setShowDateModal(false)} >취소</Button>
                <Button variant='success' className='w-100 fw-semibold py-2' onClick={submit}>검색</Button>
            </footer>
        </Modal>
    )
}

export default DateTimeModal;