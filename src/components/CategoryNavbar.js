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
        setActiveCat(id); //활성화 카테고리 변경

        moveCategory(id); //카테고리 중앙으로 이동
        moveSection(id); // 해당 섹션으로 자동 스크롤 <= 스크롤에서 그냥 바로 이동하는 걸로 변경 ㅠㅠ
    }

    //카테고리 중앙으로 이동
    const moveCategory = (id) => {
        categoryRefs.current[id]?.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "center",
        });
    }


    //선택한 섹션으로 자동스크롤
    const moveSection = (id) => {

        //해당 섹션을 콘텐츠 최상단으로 이동
        const container = contentRef.current;
        const element = sectionRefs.current[id];

        if (!container || !element) return;

        // 해당 요소의 위치 계산 (container 기준으로)
        const elementPosition = element.getBoundingClientRect().top + container.scrollTop;
        const offsetPosition = elementPosition - container.offsetTop;

        // 부드러운 스크롤 효과 추가
        container.scrollTo({
            top: offsetPosition,
            behavior: 'auto', //<- smooth가 이쁜데 직원입장에서는 없는게 훨어어얼씬 빠르고 편함 ㅠㅠ
        });
    }

    // 스크롤 핸들러
    const scrollHandler = useCallback(() => {

        const containerTop = contentRef.current?.getBoundingClientRect().top || 0;
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
        <div className="overflow-x-auto pb-1 border-bottom">

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