import React, { useEffect, useState } from "react";
import SubHeader from "../../components/SubHeader"
import { ListGroup, Pagination } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";
import axiosWithToken from "../../utils/axiosWithToken"
import LoadingContent from "../../components/LoadingContent";
import DateTimeModal from "../../components/modals/DateTimeModal";
import { format } from "date-fns";

function AllHistoryPage() {

    const [histories, setHistories] = useState([]);

    //로딩
    const [isLoading, setIsLoading] = useState(true);

    //날짜 필터링
    const [showDateModal, setShowDateModal] = useState(false);
    const [isFiltered, setIsFiltered] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    //필터링 취소
    const cancleFilter = () => {
        setIsFiltered(false);
        setStartDate(null);
        setEndDate(null);
        fetchPage(0, null, null);
    }

    //현재 페이지
    const [nowPage, setNowPage] = useState(0);
    //전체 페이지
    const [totalPage, setTotalPage] = useState(0);

    //페이징 시작, 끝
    const pageCount = 5; // 페이징 5개까지 보여줌
    const [startPage, setStartPage] = useState(0);
    const [endPage, setEndPage] = useState(0);

    //페이지 범위
    const [pageRange, setPageRange] = useState([]);

    //초기 값 불러오기
    useEffect(() => {
        cancleFilter();
    }, []);

    //페이징 계산
    useEffect(() => {
        const start = Math.floor(nowPage / pageCount) * pageCount;
        const end = Math.min(start + pageCount - 1, totalPage - 1);
        const range = Array.from({ length: end - start + 1 }, (_, i) => start + i);

        setStartPage(start);
        setEndPage(end);
        setPageRange(range);
    }, [nowPage, totalPage]);


    //서버에 page 요청
    const fetchPage = (page, startDate, endDate) => {

        setIsLoading(true);

        let url = `/all-history?size=10&page=${page}`;

        // 시작, 종료 날짜가 있으면 URL에 추가
        if (startDate && endDate) {
            setIsFiltered(true);
            const start = format(startDate, "yyyy-MM-dd'T'HH:mm:ss");
            const end = format(endDate, "yyyy-MM-dd'T'HH:mm:ss");
            url += `&startDate=${encodeURIComponent(start)}&endDate=${encodeURIComponent(end)}`;
        }


        axiosWithToken.get(url)
            .then((response) => {
                setHistories(response.data.content);
                setNowPage(response.data.number);
                setTotalPage(response.data.totalPages);
                setIsLoading(false);
            })
            .catch(() => {
                alert("판매기록을 불러오지 못하였습니다.")
            });
    }


    return (
        <>
            <div className='d-flex flex-column h-100  bg-white'>

                <SubHeader
                    title={"전체 판매 기록"}
                    onIconClick={() => setShowDateModal(true)}
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-calendar" viewBox="0 0 16 16">
                            <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
                        </svg>
                    }
                />

                {isLoading
                    ?
                    <LoadingContent />
                    :
                    <div className="flex-grow-1 overflow-y-auto pb-5">

                        {/* 날짜 필터링시에 표시 */}
                        {isFiltered &&
                            <div className="border border-success-subtle rounded-3 pe-0 mx-3 my-3 d-flex align-items-center justify-content-between shadow-sm">
                                <div className="p-3 pe-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-calendar" viewBox="0 0 16 16">
                                        <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
                                    </svg>
                                </div>
                                <div className="fw-semibold px-1">
                                    {format(startDate, "MM월dd일 HH시")} ~ {format(endDate, "MM월dd일 HH시")}
                                </div>
                                <div className="p-3 ps-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16" onClick={cancleFilter}>
                                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                                    </svg>
                                </div>
                            </div>
                        }

                        {/* 기록 비어있나 확인 */}
                        {histories.length <= 0 ?
                            <div className="text-center fs-5 text-secondary" style={{ marginTop: "15rem" }}>
                                조회된 기록이 없습니다.
                            </div>
                            :
                            <ListGroup variant='flush' className='border-top border-bottom'>

                                {histories.map((history, index) => (
                                    <Link key={index} to={`/all-history/${history.id}`}>
                                        <ListGroup.Item>
                                            <div className='d-flex justify-content-between py-1'>
                                                <div>
                                                    <div className='fw-bold mb-1 text-success' style={{ fontSize: '1.15rem' }}>
                                                        {history.title}
                                                    </div>
                                                    <div className='text-secondary'>판매번호 #{history.id}</div>
                                                    <div className='text-secondary'>판매자 {history.username}</div>
                                                    <div className='text-secondary'>
                                                        {history.date}
                                                    </div>
                                                </div>
                                                <div className='d-flex align-items-center justify-content-end'>
                                                    <div className='fw-semibold fs-5'>
                                                        {history.finalAmount.toLocaleString('ko-KR')}원
                                                    </div>
                                                </div>
                                            </div>
                                        </ListGroup.Item>
                                    </Link>
                                ))}

                            </ListGroup>
                        }



                        {totalPage > 1 &&
                            <Pagination className='mt-4 justify-content-center gap-1 my-pagination'>

                                {startPage >= pageCount &&
                                    <Pagination.Prev onClick={() => fetchPage(startPage - 1, startDate, endDate)} />
                                }

                                {pageRange.map((page) => (
                                    <Pagination.Item
                                        key={page}
                                        active={page === nowPage}
                                        onClick={() => fetchPage(page, startDate, endDate)}
                                    >
                                        {page + 1}
                                    </Pagination.Item>
                                ))}

                                {endPage < totalPage - 1 &&
                                    <Pagination.Next onClick={() => fetchPage(endPage + 1, startDate, endDate)} />
                                }

                            </Pagination>
                        }
                    </div>
                }

            </div>

            {/* 날짜 선택 모달 */}
            <DateTimeModal
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                showDateModal={showDateModal}
                setShowDateModal={setShowDateModal}
                fetchPage={fetchPage}
                setIsFiltered={setIsFiltered}
            />

            <Outlet />
        </>
    );
}

export default AllHistoryPage;