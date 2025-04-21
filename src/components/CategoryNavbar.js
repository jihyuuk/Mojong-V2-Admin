import React, { useCallback, useEffect, useRef, useState } from 'react';
import { throttle } from 'lodash';
import { useMenu } from "../utils/MenuProvider";
import { Stack } from "react-bootstrap";

function CategoryNavbar({ contentRef, sectionRefs }) {

    const { menu } = useMenu();

    //현재 활성화된 카테고리
    const [activeCat, setActiveCat] = useState(menu[0]?.categoryId ?? -1);

    //DOM 요소 캐싱
    const categoryRefs = useRef({});
    const stopScrollEvent = useRef(false);

    //메뉴 2줄로 나누기=============================================================================
    const totalLength = menu.reduce((sum, cat) => sum + cat.name.length, 0);
    const targetLength = totalLength / 2;

    const row1 = [];
    const row2 = [];

    let currentLength = 0;

    menu.forEach((category) => {
        if (currentLength <= targetLength) {
            row1.push(category);
            currentLength += category.name.length;
        } else {
            row2.push(category);
        }
    });
    //============================================================================================

    //카테고리 클릭시 (카테고리 id)
    const onCatClick = (id) => {

        // 관성 스크롤 깨트리기 (없어도 괜춘)
        // const container = contentRef.current;
        // container.scrollTop += 1;
        // container.scrollTop -= 1;

        //스크롤 감지 막기
        stopScrollEvent.current = true;

        setActiveCat(id); //활성화 카테고리 변경

        moveCategory(id); //카테고리 중앙으로 이동 <= 중앙 이동시에 스크롤많아져서 nearest로 변경ㅜㅜ
        moveSection(id); // 해당 섹션으로 자동 스크롤 <= 스크롤에서 그냥 바로 이동하는 걸로 변경 ㅠㅠ

        // 스크롤 감지 다시 켜기 (300ms 뒤)
        setTimeout(() => {
            stopScrollEvent.current = false;
        }, 300);
    }

    //카테고리 중앙으로 이동
    const moveCategory = (id) => {

        // 리페인트용 없어도 괜춘
        // categoryRefs.current[id].scrollLeft += 1;
        // categoryRefs.current[id].scrollLeft -= 1;

        categoryRefs.current[id]?.scrollIntoView({
            behavior: "smooth",
            inline: "nearest",
        });
    }


    //선택한 섹션으로 자동스크롤
    const moveSection = (id) => {

        //해당 섹션을 콘텐츠 최상단으로 이동
        const container = contentRef.current;
        const element = sectionRefs.current[id];

        if (!container || !element) return;

        // 관성 중단 (옵션)
        container.scrollTop += 1;
        container.scrollTop -= 1;

        // 첫 번째 프레임: 레이아웃 안정화
        requestAnimationFrame(() => {
            //body기준으로 offset 잡힘
            const offset = element.offsetTop - container.offsetTop;

            // 두 번째 프레임: 스크롤 적용
            requestAnimationFrame(() => {
                container.scrollTo({
                    top: offset,
                    behavior: 'auto',
                });

                // 세 번째 프레임: 리페인트 트리거 (혹시 몰라서, 없어도 동작하긴함)
                requestAnimationFrame(() => {
                    container.scrollTop += 1;
                    container.scrollTop -= 1;
                });
            });
        });
    }

    // 스크롤 핸들러
    const scrollHandler = useCallback(() => {

        if (stopScrollEvent.current) return; // 스크롤 무시!

        const containerTop = contentRef.current?.offsetTop|| 0;
        const offset = containerTop + 30;

        for (let i = menu.length - 1; i >= 0; i--) {
            const newCatId = menu[i]?.categoryId;
            const sectionTop = sectionRefs.current[newCatId]?.getBoundingClientRect().top || 0;

            if (sectionTop <= offset) {
                setActiveCat((prev) => {
                    if (prev !== newCatId) {
                        moveCategory(newCatId);
                        return newCatId;
                    }
                    return prev;
                });
                break;
            }
        }
    }, [menu]);


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
        <div className="overflow-x-auto pb-1 border-bottom" style={{scrollPaddingInline:"1rem"}}>

            <Stack direction="horizontal" gap={3} className='px-2 text-nowrap'>
                {row1.map((category) => {
                    return (
                        <div
                            id={category.categoryId}
                            key={category.name}
                            className={`myCategory ${category.categoryId === activeCat ? 'active' : ''}`}
                            onClick={() => onCatClick(category.categoryId)}
                            ref={(el) => (categoryRefs.current[category.categoryId] = el)}
                        >
                            {category.name}
                        </div>
                    );
                })}
                <div className="p-1" />
            </Stack>

            <Stack direction="horizontal" gap={3} className='px-2 text-nowrap'>
                {row2.map((category) => {
                    return (
                        <div
                            id={category.categoryId}
                            key={category.name}
                            className={`myCategory ${category.categoryId === activeCat ? 'active' : ''}`}
                            onClick={() => onCatClick(category.categoryId)}
                            ref={(el) => (categoryRefs.current[category.categoryId] = el)}
                        >
                            {category.name}
                        </div>
                    );
                })}
                <div className="p-1"></div>
            </Stack>
        </div>
    )
}

export default CategoryNavbar;