import React from "react";
import { useNavigate } from "react-router-dom";
import { useTost } from "../utils/TostProvider";

function ItemList({ item, replace, parentOnClick }) {

    const navigate = useNavigate(); //라우터
    const { showTost } = useTost(); //토스트

    const click = () => {
        //부모 onClick이벤트 버블링
        if(parentOnClick){
            parentOnClick(item.name);
        }

        //품절시 상품상세 이동 x
        if (item.stock <= 0) {
            showTost("품절된 상품입니다.");
            return;
        }

        //상품상세로 이동(state로 item 전달)
        navigate("/detail", { state: item, replace: replace })
    };

    return (
        <div onClick={click}>
            <div className="d-flex gap-3 align-items-center p-3 border-bottom">

                {/* 텍스트 */}
                <div className={`flex-grow-1 ${item.stock <= 0 ? "text-secondary" : ""}`}>
                    <div className="fs-5 fw-semibold">{item.stock <= 0 ? "(품절)" : ""} {item.name}</div>
                    <div className="mt-1 text-secondary">{item.description}</div>
                    <div className="mt-2 fs-6 fw-semibold">{item.price.toLocaleString('ko-KR')}원</div>
                </div>

                {/* 사진 */}
                {item.photo && (
                    <div
                        style={{ height: "100px", width: "100px" }}
                        className="border rounded-3 position-relative overflow-hidden flex-shrink-0"
                    >
                        {/* 품절시 설정 */}
                        {item.stock <= 0 && (
                            <div className="position-absolute top-0 start-0 w-100 h-100 bg-secondary bg-opacity-75 d-flex align-items-center justify-content-center">
                                <div className="text-white fw-semibold fs-5">품절</div>
                            </div>
                        )}

                        {/* 상품 이미지 */}
                        <img src={item.photo}
                            alt="상품 사진"
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default ItemList;
