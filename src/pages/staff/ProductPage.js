import React, { useState } from 'react';
import SubHeader from '../../components/SubHeader';
import CategoryView from '../../components/CategoryView';
import ItemView from '../../components/ItemView';
import { Outlet } from 'react-router-dom';

function ProductPage() {

    //카테고리 : 직원목록 or 가입대기 선택여부
    const [selected, setSelected] = useState('category');

    return (
        <>
            <div className='d-flex flex-column h-100  bg-white'>

                {/* 헤더 */}
                <SubHeader title='상품관리' />

                {/* 카테고리 */}
                <div className='d-flex bg-white fs-5 fw-medium text-secondary border-bottom'>
                    <div className={`text-center py-2 w-100 ${selected === 'category' ? 'selected' : ''}`} onClick={() => setSelected('category')}>카테고리</div>
                    <div className='border-end' />
                    <div className={`text-center py-2 w-100 ${selected === 'item' ? 'selected' : ''}`} onClick={() => setSelected('item')}>상품</div>
                </div>

                {/* 뷰 */}
                {selected === "category" && <CategoryView />}
                {selected === "item" && <ItemView />}

            </div>

            <Outlet />
        </>
    );
}

export default ProductPage;