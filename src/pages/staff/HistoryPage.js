import React, { useEffect, useState } from "react";
import SubHeader from "../../components/SubHeader"
import { ListGroup, Pagination } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";
import axiosWithToken from "../../utils/axiosWithToken"

function HistoryPage() {

    const [histories, setHistories] = useState([]);

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
        fetchPage(0);
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
    const fetchPage = (page) => {
        axiosWithToken.get("/history?size=10&page=" + page)
            .then((response) => {
                setHistories(response.data.content);
                setNowPage(response.data.number);
                setTotalPage(response.data.totalPages);
            })
            .catch(() => {
                alert("판매기록을 불러오지 못하였습니다.")
            });
    }


    return (
        <>
            <div className='d-flex flex-column h-100  bg-white'>

                <SubHeader title={"판매 기록"} />

                <div className="flex-grow-1 overflow-y-auto pb-5">

                    <ListGroup variant='flush' className='border-top border-bottom'>

                        {histories.map((history, index) => (
                            <Link to={`/history/${history.id}`}>
                                <ListGroup.Item key={index}>
                                    <div className='d-flex justify-content-between py-1'>
                                        <div>
                                            <div className='fw-bold mb-1 text-success' style={{ fontSize: '1.15rem' }}>
                                                {history.title}
                                            </div>
                                            <div className='text-secondary'>판매번호 #{history.id}</div>
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


                    {totalPage > 1 &&
                        <Pagination className='mt-4 justify-content-center gap-1 my-pagination'>

                            {startPage >= pageCount &&
                                <Pagination.Prev onClick={() => fetchPage(startPage - 1)} />
                            }

                            {pageRange.map((page) => (
                                <Pagination.Item
                                    key={page}
                                    active={page === nowPage}
                                    onClick={() => fetchPage(page)}
                                >
                                    {page + 1}
                                </Pagination.Item>
                            ))}

                            {endPage < totalPage - 1 &&
                                <Pagination.Next onClick={() => fetchPage(endPage + 1)} />
                            }

                        </Pagination>
                    }
                </div>
            </div>

            <Outlet />
        </>
    );
}

export default HistoryPage;