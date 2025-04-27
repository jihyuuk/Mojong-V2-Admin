import React from "react";
import { useNavigate } from "react-router-dom";

function SubHeader({ title, icon, onIconClick }) {

    const navigate = useNavigate();

    return (
        <header className='p-2 border-2 border-bottom border-success-subtle shadow-sm d-flex align-items-center justify-content-between'>

            {/* 뒤로가기 버튼 */}
            <div className='p-1' onClick={() => navigate(-1)} style={{ cursor: 'pointer' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-chevron-left" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" />
                </svg>
            </div>

            <div className='fw-semibold fs-4 text-center'>
                {title}
            </div>

            {/* 오른쪽: 아이콘이 있으면 렌더링, 없으면 33px 빈 칸 */}
            <div style={{ width: "33px" }}>
                {icon && (
                    <div onClick={onIconClick} style={{ cursor: 'pointer' }}>
                        {icon}
                    </div>
                )}
            </div>

        </header>
    )
}

export default SubHeader;