import React from "react";
import { Form, Placeholder, Stack } from "react-bootstrap";

function LoadingMain() {

    return (
        <div className="App">
            <div className="MainPage d-flex flex-column h-100">

                {/* 헤더 */}
                <header>

                    {/* 검색창 */}
                    <div className='px-2 pt-3 pb-1'>
                        <div className='position-relative'>
                            <Form.Control size="lg" id='searchBar' type="text"
                                className='ps-4 pe-5 rounded-5 border-2 border-success-subtle bg-white'
                                placeholder="🔍 검색하기"
                                disabled={true}
                            />
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