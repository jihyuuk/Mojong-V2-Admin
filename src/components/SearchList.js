import React from "react";
import { useNavigate } from "react-router-dom";
import { useTost } from "../utils/TostProvider";

function SearchList({ item, replace }) {

    const navigate = useNavigate(); //라우터
    const { showTost } = useTost(); //토스트

    const click = () => {

        //품절시 상품상세 이동 x
        if (item.stock <= 0) {
            showTost("품절된 상품입니다.");
            return;
        }

        //상품상세로 이동
        navigate("/detail", { state: item, replace: replace });
    };

    return (
        <div onClick={click}>
            <div variant="light" className='p-3 border-bottom text-secondary' >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search me-2 text-secondary" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                </svg>
                {item.stock <= 0 ? "(품절)" : ""} {item.name}
            </div>
        </div>
    );
}

export default SearchList;