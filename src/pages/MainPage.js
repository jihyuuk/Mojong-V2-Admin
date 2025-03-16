import { Badge, Button, Form, ListGroup, Offcanvas, Placeholder, Spinner, Stack } from 'react-bootstrap';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import menu from "./dummyData.json";
import { throttle } from 'lodash';

function MainPage({ setSelectedItem, setShowShoppingCart, totalPrice, cartItems }) {

    //현재 활성화된 카테고리
    const [activeCat, setActiveCat] = useState(0);
    //섹션 스크롤 여부
    const scrollingRef = useRef(false);

    //DOM 요소 캐싱
    const contentRef = useRef(null);
    const categoryRefs = useRef([]);
    const sectionRefs = useRef([]);
    const categoryCount = useMemo(() => menu.categories.length, []);// 카테고리 개수 캐싱 (불필요한 연산 방지)

    //카테고리 클릭시에
    const onCatClick = (idx) => {
        setActiveCat(idx); //활성화 카테고리 변경
        moveCategory(idx); //카테고리 중앙으로 이동

        scrollingRef.current = true; // 스크롤 이벤트 비활성화
        moveSection(idx); // 해당 섹션으로 자동 스크롤

        //스크롤이벤트 1초후 활성화(정석 방법x)
        setTimeout(() => {
            scrollingRef.current = false;
        }, 1000);
    }

    //카테고리 중앙으로 이동
    const moveCategory = (idx) => {
        categoryRefs.current[idx]?.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "center",
        });
    }


    //선택한 섹션으로 자동스크롤
    const moveSection = (idx) => {

        //해당 섹션을 콘텐츠 최상단으로 이동
        const container = contentRef.current;
        const element = sectionRefs.current[idx];

        if (!container || !element) return;

        // 해당 요소의 위치 계산 (container 기준으로)
        const elementPosition = element.getBoundingClientRect().top + container.scrollTop;
        const offsetPosition = elementPosition - container.offsetTop;

        // 부드러운 스크롤 효과 추가
        container.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
        });
    }

    // 스크롤 핸들러
    const scrollHandler = useCallback(() => {
        if (scrollingRef.current) return;

        const containerTop = contentRef.current?.getBoundingClientRect().top || 0;
        const offset = containerTop + 30;

        for (let i = categoryCount - 1; i >= 0; i--) {
            const sectionTop = sectionRefs.current[i]?.getBoundingClientRect().top || 0;

            if (sectionTop <= offset) {
                //불필요한 상태 업데이트 방지
                if (activeCat !== i) {
                    setActiveCat(i);
                    moveCategory(i);
                }
                break;
            }
        }
    }, [categoryCount, activeCat]); // usecallback공부 필요


    // throttle 적용한 스크롤 핸들러 (200ms)
    const throttledHandleScroll = useCallback(throttle(scrollHandler, 200), [scrollHandler]);

    // 스크롤 이벤트 등록
    useEffect(() => {
        const container = contentRef.current;
        if (container) {
            container.addEventListener("scroll", throttledHandleScroll);
        }
        return () => {
            if (container) {
                container.removeEventListener("scroll", throttledHandleScroll);
            }
        };
    }, [throttledHandleScroll]);


    //검색기능================================
    const [searchValue, setSearchValue] = useState(''); //검색어
    const [searchResults, setSearchResults] = useState([]);//검색결과
    const [showSearchField, setShowSearchField] = useState(false);//검색결과 피드
    const [showClearBtn, setShowClearBtn] = useState(false); //클리어버튼
    const inputRef = useRef(null);

    //검색창 변화시
    useEffect(() => {
        //1.검색어가 있을때만 클리어 버튼 보여주기
        //2.아이템 찾기

        if (searchValue.trim() === '') {
            setSearchResults([]);
            setShowClearBtn(false);
            return;
        }

        setShowClearBtn(true);
        setSearchResults(
            menu.categories.flatMap(category =>
                category.items.filter(item => item.name.includes(searchValue))
            ));

        searchResults.map(item => console.log(item.name))

    }, [searchValue])

    //검색 취소버튼
    const cancleSearch = () => {
        setSearchValue('');
        setShowSearchField(false);
    }

    //x 버튼 클릭시
    const handleClear = () => {
        setSearchValue('');
        inputRef.current?.focus();
    }

    //햄버거 버튼
    const [showHam, setShowHam] = useState(false);

    return (
        // 메인페이지
        <div className="MainPage d-flex flex-column h-100">

            {/* 헤더 */}
            <header>

                {/* 최상단 헤더 */}
                <div className='px-2 pt-3 pb-1 d-flex align-items-center'>

                    {/* 햄버거 버튼 */}
                    <div className='p-2' onClick={() => setShowHam(true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5" />
                        </svg>
                    </div>

                    <Offcanvas show={showHam} onHide={() => setShowHam(false)} style={{ width: '15rem' }}>
                        {/* 헤더 */}
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title className='fw-bold fs-4'>홍길동님</Offcanvas.Title>
                        </Offcanvas.Header>

                        {/* 목록 */}
                        {/* 목록 */}
                        <Offcanvas.Body id='hambergur-menu' className='d-flex flex-column'>

                            {/* 오늘의 판매 통계 */}
                            <div className='border border-success-subtle rounded-3 p-2 bg-body-tertiary'>
                                <div className='fs-5 fw-semibold mb-2'>🏅 오늘 판매 업적 </div>

                                <div>
                                    <div>판매: 200건</div>
                                    <div>총액: 30,000원</div>
                                </div>

                                {/* 관리자만 */}
                                <div className='mt-2'>
                                    <div>전체 판매: 340건</div>
                                    <div>전체 총액: 90,000원</div>
                                </div>
                            </div>

                            <ListGroup variant='flush fs-5 mt-4'>

                                <ListGroup.Item className='py-2'>
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-clock-history me-3" viewBox="0 0 16 16">
                                            <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022zm2.004.45a7 7 0 0 0-.985-.299l.219-.976q.576.129 1.126.342zm1.37.71a7 7 0 0 0-.439-.27l.493-.87a8 8 0 0 1 .979.654l-.615.789a7 7 0 0 0-.418-.302zm1.834 1.79a7 7 0 0 0-.653-.796l.724-.69q.406.429.747.91zm.744 1.352a7 7 0 0 0-.214-.468l.893-.45a8 8 0 0 1 .45 1.088l-.95.313a7 7 0 0 0-.179-.483m.53 2.507a7 7 0 0 0-.1-1.025l.985-.17q.1.58.116 1.17zm-.131 1.538q.05-.254.081-.51l.993.123a8 8 0 0 1-.23 1.155l-.964-.267q.069-.247.12-.501m-.952 2.379q.276-.436.486-.908l.914.405q-.24.54-.555 1.038zm-.964 1.205q.183-.183.35-.378l.758.653a8 8 0 0 1-.401.432z" />
                                            <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0z" />
                                            <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5" />
                                        </svg>
                                        판매기록
                                    </div>
                                </ListGroup.Item>

                                <ListGroup.Item className='py-2'>
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-bag me-3" viewBox="0 0 16 16">
                                            <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z" />
                                        </svg>
                                        장바구니
                                    </div>
                                </ListGroup.Item>

                                {/* 관리자만 */}

                                <ListGroup.Item className='mt-3 py-2'>
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-person me-3" viewBox="0 0 16 16">
                                            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
                                        </svg>
                                        직원관리
                                    </div>
                                </ListGroup.Item>
                                <ListGroup.Item className='py-2'>
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-box-seam me-3" viewBox="0 0 16 16">
                                            <path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5l2.404.961L10.404 2zm3.564 1.426L5.596 5 8 5.961 14.154 3.5zm3.25 1.7-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464z" />
                                        </svg>
                                        상품관리
                                    </div>
                                </ListGroup.Item>
                                <ListGroup.Item className='py-2'>
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-clock-history me-3" viewBox="0 0 16 16">
                                            <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022zm2.004.45a7 7 0 0 0-.985-.299l.219-.976q.576.129 1.126.342zm1.37.71a7 7 0 0 0-.439-.27l.493-.87a8 8 0 0 1 .979.654l-.615.789a7 7 0 0 0-.418-.302zm1.834 1.79a7 7 0 0 0-.653-.796l.724-.69q.406.429.747.91zm.744 1.352a7 7 0 0 0-.214-.468l.893-.45a8 8 0 0 1 .45 1.088l-.95.313a7 7 0 0 0-.179-.483m.53 2.507a7 7 0 0 0-.1-1.025l.985-.17q.1.58.116 1.17zm-.131 1.538q.05-.254.081-.51l.993.123a8 8 0 0 1-.23 1.155l-.964-.267q.069-.247.12-.501m-.952 2.379q.276-.436.486-.908l.914.405q-.24.54-.555 1.038zm-.964 1.205q.183-.183.35-.378l.758.653a8 8 0 0 1-.401.432z" />
                                            <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0z" />
                                            <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5" />
                                        </svg>
                                        전체기록
                                    </div>
                                </ListGroup.Item>

                            </ListGroup>

                            {/* 하단로고 */}
                            <div className='mt-auto text-center'>

                                {/* 로그아웃버튼 */}
                                <div className='mb-2'>
                                    <Button variant="outline-success w-100 rounded-5" >
                                        로그아웃
                                    </Button>
                                </div>

                                <img src={'/logo2.png'} className='w-50 px-2' />
                            </div>

                        </Offcanvas.Body>
                    </Offcanvas>

                    {/* 서치바 */}
                    <div className='position-relative flex-grow-1 px-1'>
                        <Form.Control size="lg" id='searchBar' type="text"
                            ref={inputRef}
                            className='ps-4 pe-5 rounded-5 border-2 border-success-subtle'
                            placeholder="🔍 검색하기"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value.trim())}
                            onClick={() => setShowSearchField(true)}
                        />

                        {/* 클리어버튼 */}
                        {showClearBtn &&
                            <div className='position-absolute top-50 end-0 translate-middle-y me-3' onClick={handleClear}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-x my-auto h-100" viewBox="0 0 16 16">
                                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                                </svg>
                            </div>
                        }
                    </div>

                    {/* 장바구니 버튼 */}
                    <div className='p-2' onClick={() => setShowShoppingCart(true)}>

                        <div className='position-relative'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-bag" viewBox="0 0 16 16">
                                <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z" />
                            </svg>

                            {cartItems.length > 0 &&
                                <Badge pill bg="danger" className='position-absolute top-0 start-100 translate-middle mt-1' style={{ fontSize: '0.7rem' }}>
                                    {cartItems.length}
                                </Badge>
                            }
                        </div>
                    </div>

                </div>

                {/* 검색결과 */}
                {showSearchField &&
                    <div className='position-absolute w-100 h-100 z-1'>

                        {/* 검색 수량 // 취소버튼 */}
                        <div className='text-secondary py-1 fw-mefium d-flex justify-content-between bg-white'>
                            <div className='p-2 ps-3'>
                                검색 결과 : {searchResults.length}개</div>
                            <div className='p-2 pe-3' onClick={cancleSearch}>닫기</div>
                        </div>

                        <div className='position-absolute d-flex flex-column pt-1 h-100 w-100 overflow-y-auto' onScroll={() => inputRef.current?.blur()}
                            style={{ overscrollBehavior: 'none' }}>
                            {/* 검색결과 리스트*/}
                            <ListGroup>
                                {searchResults.map(item => {
                                    return (
                                        <ListGroup.Item className='d-flex align-items-center gap-3' onClick={() => setSelectedItem(item)}>
                                            <img src={item.photo} style={{ maxWidth: '100px' }} className='rounded-4 my-auto' />

                                            <div>
                                                <div className="fw-bold fs-4">{item.name}</div>
                                                <div className='mt-1 text-secondary'>{item.description}</div>
                                                <div className='mt-2 fs-5 fw-semibold'>{item.price.toLocaleString('ko-KR')}원</div>
                                            </div>
                                        </ListGroup.Item>
                                    )
                                })}
                            </ListGroup>

                            {/* 남는 부분 배경채우기 */}
                            <div className='bg-secondary bg-opacity-50 flex-grow-1' style={{ minHeight: '300px' }} onClick={cancleSearch}></div>

                        </div>
                    </div>
                }


                {/* 카테고리 탭 */}
                <Stack direction="horizontal" gap={3} className='overflow-x-auto text-nowrap p-2 pt-0 border-bottom'>
                    {menu.categories.map((category, index) => {
                        return (
                            <div
                                id={`category${index}`}
                                key={category.name}
                                className={`myCategory ${index === activeCat ? 'active' : ''}`}
                                onClick={() => onCatClick(index)}
                                ref={(el) => (categoryRefs.current[index] = el)}
                            >
                                {category.categoryName}
                            </div>
                        );
                    })}
                </Stack>

            </header>

            {/* 콘텐츠 */}
            <main id='content' ref={contentRef} className='flex-grow-1 overflow-y-auto bg-secondary-subtle'>

                {menu.categories.map((category, index) => {
                    return (
                        // 카테고리명
                        <ListGroup id={`section${index}`} key={category.categoryName} className='mb-4 bg-white rounded-0' ref={(el) => (sectionRefs.current[index] = el)}>
                            <div className='fs-3 fw-bold p-2 ps-3'>{category.categoryName}</div>

                            {/* 카테고리 아이템 */}
                            {category.items.map((item) => {
                                return (
                                    <ListGroup.Item className='d-flex align-items-center gap-3' onClick={() => setSelectedItem(item)}>
                                        {/* 사진 */}
                                        <div style={{ height: '100px', width: '100px' }} className='border rounded-4'>
                                            <img src={item.photo} className='rounded-4 my-auto' style={{ width: '100px' }} />
                                        </div>

                                        {/* 텍스트 */}
                                        <div>
                                            <div className="fw-bold fs-4">{item.name}</div>
                                            <div className='mt-1 text-secondary'>{item.description}</div>
                                            <div className='mt-2 fs-5 fw-semibold'>{item.price.toLocaleString('ko-KR')}원</div>
                                        </div>
                                    </ListGroup.Item>
                                );
                            })}

                        </ListGroup>
                    );
                })}

                <div style={{ height: "300px" }}>
                </div>

            </main>

            {/* 푸터 */}
            {totalPrice > 0 &&
                <footer className="p-2 pb-3 border-top">
                    <Button variant="success" className="w-100 fs-5 fw-semibold p-2 rounded-4" onClick={() => setShowShoppingCart(true)}>
                        {totalPrice.toLocaleString('ko-KR')}원 <span className='fw-medium'>· 장바구니</span>
                    </Button>
                </footer>
            }
        </div>
    );
}

export default MainPage;
