import { Badge, Form, Stack } from 'react-bootstrap';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { throttle } from 'lodash';
import { useNavigate } from 'react-router-dom';
import ItemList from '../components/ItemList';
import Footer from '../components/Footer';
import { useShoppingCart } from '../utils/ShoppingCartProvider';
import MainFooter from '../components/MainFooter';
import HamburgerList from '../components/HamburgerList';
import { useMenu } from '../utils/MenuProvider';

function MainPage() {

    //리액트 라우터
    const navigate = useNavigate();

    //메뉴
    const { menu } = useMenu();

    //장바구니 정보
    const { cartItems, totalPrice } = useShoppingCart();


    //현재 활성화된 카테고리
    const [activeCat, setActiveCat] = useState(0);
    //섹션 스크롤 여부
    const scrollingRef = useRef(false);

    //DOM 요소 캐싱
    const contentRef = useRef(null);
    const categoryRefs = useRef([]);
    const sectionRefs = useRef([]);
    const categoryCount = useMemo(() => menu.length, []);// 카테고리 개수 캐싱 (불필요한 연산 방지)

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


    return (
        // 메인페이지
        <div className="MainPage d-flex flex-column h-100">

            {/* 헤더 */}
            <header>

                {/* 햄버거, 서치바, 장바구니 */}
                <div className="p-2 pt-3 pb-1 d-flex align-items-center">

                    {/* 햄버거 메뉴 */}
                    <HamburgerList />

                    {/* 검색창 */}
                    <Form.Control size="lg" id='searchBar' type="text"
                        className='ps-4 pe-5 rounded-5 border-2 border-success-subtle'
                        placeholder="🔍 검색하기"
                        onClick={() => navigate("/search")}
                        readOnly
                    />

                    {/* 장바구니 아이콘 */}
                    <div className='p-2' onClick={() => navigate("/shoppingCart")}>
                        <div className='position-relative'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-bag" viewBox="0 0 16 16">
                                <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z" />
                            </svg>

                            {cartItems.length > 0 &&
                                <div className="position-absolute top-0 start-100 translate-middle">
                                    <Badge bg="danger" className='rounded-5' style={{ fontSize: '0.7rem' }}>
                                        {cartItems.length}
                                    </Badge>
                                </div>
                            }
                        </div>
                    </div>

                </div>

                {/* 카테고리 탭 */}
                <Stack direction="horizontal" gap={3} className='overflow-x-auto text-nowrap px-2 pt-0 pb-1 border-bottom'>
                    {menu.map((category, index) => {
                        return (
                            <div
                                id={`category${index}`}
                                key={category.name}
                                className={`myCategory ${index === activeCat ? 'active' : ''}`}
                                onClick={() => onCatClick(index)}
                                ref={(el) => (categoryRefs.current[index] = el)}
                            >
                                {category.name}
                            </div>
                        );
                    })}
                </Stack>

            </header>

            {/* 콘텐츠 */}
            <main id='content' ref={contentRef} className='flex-grow-1 overflow-y-auto bg-secondary-subtle'>

                {menu.map((category, index) => {
                    return (
                        <div id={`section${index}`} key={category.name} className='mb-4 bg-white shadow-sm' ref={(el) => (sectionRefs.current[index] = el)}>

                            {/* 카테고리 명 */}
                            <div className='fs-2 fw-bold p-3 pb-0 text-success'>{category.name}</div>

                            {/* 해당 아이템들 */}
                            {category.items.map((item) => <ItemList key={item.id} item={item} />)}

                        </div>
                    );
                })}

                <MainFooter />

            </main>

            {/* 푸터 */}
            <Footer
                value={`${totalPrice.toLocaleString('ko-KR')}원 · 장바구니`}
                show={totalPrice > 0}
                onClick={() => navigate('/shoppingCart')}
            />

        </div>
    );
}

export default MainPage;
