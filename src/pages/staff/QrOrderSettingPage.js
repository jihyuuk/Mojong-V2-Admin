import React, { useEffect, useState } from "react";
import SubHeader from "../../components/SubHeader";
import { Form } from "react-bootstrap";
import Footer from "../../components/Footer";
import axiosWithToken from "../../utils/axiosWithToken";
import { useNavigate } from "react-router-dom";
import { useTost } from "../../utils/TostProvider";
import DatePicker from "react-datepicker";
import { setHours, setMinutes, format, parse } from 'date-fns';
import LoadingContent from "../../components/LoadingContent";

function QrOrderSettingPage() {

    const navigate = useNavigate();
    const { showTost } = useTost();

    const [isLoading, setIsLoading] = useState(true);
    const [startDate, setStartDate] = useState(setHours(setMinutes(new Date(), 0), 9));
    const [endDate, setEndDate] = useState(setHours(setMinutes(new Date(), 0), 17));
    const [enabled, setEnabled] = useState(true);

    const [buttonDisabled, setButtonDisabled] = useState(false);

    // 1. 서버에서 기존 설정 가져오기
    useEffect(() => {
        axiosWithToken.get('/guest/qr-status')
            .then(res => {
                const { startTime, endTime, enabled } = res.data;

                // "HH:mm" 문자열을 Date 객체로 변환 (오늘 날짜 기준)
                const today = new Date();
                if (startTime) setStartDate(parse(startTime, "HH:mm", today));
                if (endTime) setEndDate(parse(endTime, "HH:mm", today));

                setEnabled(enabled);
                setIsLoading(false);
            })
            .catch(err => {
                showTost("설정을 불러오는데 실패했습니다.", "danger");
            });
    }, []);


    // 2. 서버로 데이터 전송
    const submit = async () => {

        //검증
        if (!startDate || !endDate) {
            showTost("시간을 모두 입력해주세요");
            return;
        }

        if (startDate >= endDate) {
            showTost("시작 시간은 종료 시간보다 빨라야함");
            return;
        }



        setButtonDisabled(true);


        const data = {
            enabled: enabled,
            startTime: format(startDate, "HH:mm"),
            endTime: format(endDate, "HH:mm")
        };

        try {
            await axiosWithToken.post('/qr-status', data);
            showTost("저장 성공!");
            navigate(-1); // 이전 페이지로 이동
        } catch (err) {
            showTost("저장 실패");
        } finally {
            setButtonDisabled(false);
        }
    };


    return (
        <div className='d-flex flex-column h-100  bg-white'>

            <SubHeader title="QR 주문 설정" />


            {isLoading ?
                <LoadingContent />
                :
                <>
                    <div className='flex-grow-1 overflow-y-auto p-3'>

                        <Form>
                            {/* 주문 시간 설정 */}
                            <Form.Group className="mb-3">
                                <Form.Label className='fs-5 fw-medium text-success'>주문 가능 시간</Form.Label>
                                <div className="d-flex align-items-center ">

                                    <DatePicker
                                        selected={startDate}
                                        onChange={(date) => setStartDate(date)}
                                        showTimeSelect
                                        showTimeSelectOnly
                                        timeIntervals={15} // 15분 단위
                                        timeCaption="시작"
                                        timeFormat="HH:mm"
                                        dateFormat="HH:mm"
                                        wrapperClassName="w-100"
                                        className="border p-2 rounded w-100 datepicker-no-cursor"
                                        inputMode="none"
                                        onKeyDown={(e) => e.preventDefault()}
                                    />

                                    <div className="mx-3">~</div>

                                    <DatePicker
                                        selected={endDate}
                                        onChange={(date) => setEndDate(date)}
                                        showTimeSelect
                                        showTimeSelectOnly
                                        timeIntervals={15}
                                        timeCaption="종료"
                                        timeFormat="HH:mm"
                                        dateFormat="HH:mm"
                                        wrapperClassName="w-100"
                                        className="border p-2 rounded w-100 datepicker-no-cursor"
                                        inputMode="none"
                                        onKeyDown={(e) => e.preventDefault()}
                                    />

                                </div>
                            </Form.Group>


                            {/* QR 주문 비활성화 체크박스 */}
                            <Form.Group className="mb-5">
                                <Form.Label className='fs-5 fw-medium text-success'>활성화 여부</Form.Label>
                                <div className="d-flex align-items-center justify-content-between gap-2 p-3 border rounded">
                                    <div className="text-muted">
                                        QR 주문 비활성화
                                    </div>
                                    <Form.Check
                                        type="checkbox"
                                        id="soldout-switch"
                                        style={{ scale: "1.5", cursor: "pointer" }}
                                        onChange={() => setEnabled(prev => !prev)}
                                        checked={enabled === false}
                                    />
                                </div>
                            </Form.Group>
                        </Form>

                    </div>

                    <Footer
                        value={"저장하기"}
                        show={true}
                        onClick={submit}
                        disabled={buttonDisabled}
                    />
                </>
            }


        </div>
    );
}

export default QrOrderSettingPage;