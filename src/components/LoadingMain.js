import React from "react";
import { Form, Placeholder, Stack } from "react-bootstrap";

function LoadingMain() {

    return (
        <div className="App">
            <div className="MainPage d-flex flex-column h-100">

                {/* 헤더 */}
                <header>

                    {/* 햄버거, 서치바, 장바구니 */}
                    <div className="p-2 pt-3 pb-1 d-flex align-items-center">

                        {/* 햄버거 메뉴 */}
                        <div className='px-2'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-list" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5" />
                            </svg>
                        </div>


                        {/* 검색창 */}
                        <Form.Control size="lg" id='searchBar' type="text"
                            className='ps-4 pe-5 rounded-5 border-2 border-success-subtle'
                            placeholder="🔍 검색하기"
                            readOnly
                        />

                        {/* 장바구니 아이콘 */}
                        <div className='p-2'>
                            <div className='position-relative'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-bag" viewBox="0 0 16 16">
                                    <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z" />
                                </svg>
                            </div>
                        </div>

                    </div>


                    {/* 카테고리 탭 */}
                    <Placeholder as="div" animation="wave">
                        <Stack direction="horizontal" gap={2} className='overflow-x-hidden text-nowrap px-2 pt-0 pb-1 border-bottom'>
                            {Array(8).fill().map((_, index) => (
                                <div key={index} className="myCategory">
                                    <Placeholder className="rounded-3">카테고리</Placeholder>
                                </div>
                            ))}
                        </Stack>
                    </Placeholder>

                </header>

                {/* 콘텐츠 */}
                <main id='content' className='flex-grow-1 overflow-y-hidden bg-secondary-subtle'>

                    <div className='mb-4 bg-white shadow-sm'>

                        {/* 카테고리 명 */}
                        {/* <div className='fs-2 fw-bold p-3 pb-0'>
                            <Placeholder as="div" animation="wave">
                                <Placeholder className="rounded-2" xs={5} />
                            </Placeholder>
                        </div> */}

                        {/* 해당 아이템들 */}
                        {Array(6).fill().map((_, index) => (
                            <div key={index} className="d-flex gap-3 align-items-center p-3 border-bottom">

                                {/* 텍스트 */}
                                <div className="flex-grow-1">
                                    <Placeholder as="div" animation="wave">
                                        <div className="fs-5">
                                            <Placeholder className="rounded-1" xs={12} size="sm" />
                                        </div>
                                        <div className="mt-1">
                                            <Placeholder className="rounded-1" xs={12} size="sm" />
                                            <Placeholder className="rounded-1" xs={12} size="sm" />
                                        </div>
                                        <div className="mt-2 fs-6 ">
                                            <Placeholder className="rounded-1" xs={5} size="sm" />
                                        </div>
                                    </Placeholder>
                                </div>

                                {/* 사진 */}
                                <div
                                    style={{ height: "100px", width: "100px" }}
                                    className="border rounded-3 position-relative overflow-hidden flex-shrink-0 "
                                >
                                    <Placeholder as="p" animation="glow" className="w-100 h-100">
                                        <Placeholder className="w-100 h-100" />
                                    </Placeholder>
                                </div>

                            </div>
                        ))}

                    </div>

                </main>

            </div>
        </div>
    );

}

export default LoadingMain;