import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "react-bootstrap";

function FailPage() {

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();


    return (
        <div className="z-1 position-absolute top-0 start-0 w-100 h-100 bg-white">
            <div className='d-flex flex-column h-100'>

                {/* 로딩 서클 */}
                <div className="d-flex flex-column flex-grow-1 align-items-center justify-content-center">
                    <div className="circle-loader load-fail">
                        <div className="exclamation"></div>
                    </div>
                    {/* 주문 실패 메시지 */}
                    <div className="mt-3 fs-1 fw-semibold text-danger">주문 실패!</div>
                    <div className="mt-1">주문 처리에 실패했습니다. 관리자에게 문의하세요.</div>
                </div>

                <footer className="p-2 pb-3 border-top">
                    <Button variant="secondary" className="w-100 fs-5 fw-semibold p-2 rounded-3" onClick={() => navigate(-1)}>
                        뒤로가기
                    </Button>
                </footer>
            </div>

        </div>
    );
}

export default FailPage;