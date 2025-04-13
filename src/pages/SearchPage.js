import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form } from "react-bootstrap";
import SearchList from "../components/SearchList";
import ItemList from "../components/ItemList";

function SearchPage({ menu }) {

    const navigate = useNavigate();

    //검색기능================================
    const [searchValue, setSearchValue] = useState(''); //검색어
    const [searchResults, setSearchResults] = useState([]);//검색결과
    const [showClearBtn, setShowClearBtn] = useState(false); //클리어버튼
    const inputRef = useRef(null);

    //최근 검색어================================
    const [searchHistory, setSearchHistory] = useState(() => {
        const localHistory = window.localStorage.getItem("searchHistory");
        return localHistory ? JSON.parse(localHistory) : [];
    });
    //자동저장(기본값 : 켜기)========================
    const [isHistoryDisabled, setIsHistoryDisabled] = useState(()=>{
        return window.localStorage.getItem("isHistoryDisabled") === "true";
    });

    //초기화
    useEffect(() => {
        //자동포커스
        inputRef.current.focus();

        //터치 감지해서 input focus 해제
        const handleTouchStart = () => {
            inputRef.current?.blur();
        };

        document.addEventListener("touchstart", handleTouchStart);
        return () => document.removeEventListener("touchstart", handleTouchStart);
    }, []);

    //검색기능===============================================================

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
            menu.flatMap(category =>
                category.items.filter(item => item.name.includes(searchValue.trim()))
            ));

    }, [searchValue])


    //x 버튼 클릭시
    const handleClear = () => {
        setSearchValue('');
        inputRef.current?.focus();
    }

    //최근 검색어 기능==============================================================

    //1.전체 삭제
    const clearAll = () => {
        setSearchHistory([]);
    }
    //2.부분 삭제
    const remove = (idx) => {
        setSearchHistory(searchHistory.filter((_, index) => index !== idx));
    }
    //3.자동저장 켜기 끄기
    const onOffClick = () => {
        const newState = !isHistoryDisabled;
        if (newState) clearAll();
        window.localStorage.setItem("isHistoryDisabled", String(newState));
        setIsHistoryDisabled(newState);
    }
    //4. 최근검색어 클릭시
    const historyClick = (itemName) => {
        setSearchValue(itemName);
        saveHistory(itemName);
    }
    //5.아이템 클릭시 히스토리 저장
    const saveHistory = (itemName) => {
        if(isHistoryDisabled) return;
        setSearchHistory((prevHistory) => {
            const filteredHistory = prevHistory.filter(prev => prev !== itemName); // 중복 제거
            const updatedHistory = [itemName, ...filteredHistory]; // 맨 앞에 추가
            return updatedHistory.slice(0, 10); // 최근 10개 유지
        });
    };

    useEffect(() => {
        if (searchHistory.length === 0) {
            window.localStorage.removeItem("searchHistory");
            return;
        }
        window.localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    }, [searchHistory]);


    return (
        <div className="z-1 position-absolute top-0 start-0 w-100 h-100 bg-white">
            <div className="d-flex flex-column h-100 w-100 bg-body-secondary">

                {/* 헤더 */}
                <header className="bg-white">

                    <div className='d-flex align-items-center py-3'>

                        {/* 뒤로가기 왼쪽 < 아이콘 */}
                        <div className='p-2' onClick={() => navigate(-1)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-chevron-left" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" />
                            </svg>
                        </div>

                        {/* 검색창 */}
                        <div className='pe-2 flex-grow-1'>
                            <div className='position-relative'>
                                <Form.Control size="lg" id='searchBar' type="text"
                                    ref={inputRef}
                                    className='ps-4 pe-5 rounded-5 border-2 border-success-subtle'
                                    placeholder="🔍 검색하기"
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            inputRef.current.blur();
                                        }
                                    }
                                    }
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
                        </div>

                    </div>

                </header>

                {/* 최근검색항목 */}
                {searchValue.length === 0 &&
                    <>
                        <div className="d-flex justify-content-between align-items-center p-2 pt-0 bg-white shadow-sm">
                            <div className="fw-semibold ps-2 text-success">최근 검색</div>
                            <div className="text-secondary d-flex align-items-center me-1" style={{ fontSize: '0.9rem' }}>

                                {!isHistoryDisabled && <div className="pe-2 border-end" onClick={clearAll}>전체삭제</div>}

                                <div className="px-2">자동저장</div>
                                <Form.Check 
                                    onChange={onOffClick}
                                    type="switch"
                                    id="custom-switch"
                                    checked={!isHistoryDisabled}
                                />
                            </div>
                        </div>

                        <div className="d-flex flex-wrap fs-6 p-2 pt-3 gap-2">
                            {searchHistory.map((itemName, idx) =>
                                <div key={idx} className="d-flex align-items-center p-2 ps-3 border rounded-pill bg-white shadow-sm">
                                    <div onClick={() => historyClick(itemName)}>
                                        {itemName}
                                    </div>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-x ms-1 text-secondary" viewBox="0 0 16 16" onClick={() => remove(idx)}>
                                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    </>
                }


                {/* 검색결과 */}
                {searchValue.length > 0 &&
                    <>
                        <div className='p-2 pt-0 ps-3 bg-white fw-semibold text-success'>
                            검색 결과 : {searchResults.length}개
                        </div>

                        <div className='flex-grow-1 overflow-y-auto bg-body-secondary border-top'>

                            {/* 검색결과 리스트*/}
                            <div className='bg-white shadow-sm'>
                                {searchResults.map(item => <ItemList key={item.id} item={item} replace={true} parentOnClick={saveHistory} />)}
                                {/* {searchResults.map((item) => <SearchList item={item} replace={true} />)} */}
                            </div>

                            {/* 여백 */}
                            <div style={{ height: '150px' }} />
                        </div>
                    </>
                }
            </div>
        </div>
    );
}

export default SearchPage;