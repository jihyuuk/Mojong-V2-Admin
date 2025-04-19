import React, { useEffect, useState } from 'react';
import SubHeader from '../../components/SubHeader';
import MemeberView from '../../components/MemberView';
import ApprovalView from '../../components/ApprovalView';
import axiosWithToken from '../../utils/axiosWithToken';

function MemberPage() {

    //카테고리 : 직원목록 or 가입대기 선택여부
    const [selected, setSelected] = useState('members');
    const [members, setMembers] = useState([]);

    //직원 목록 불러오기
    //각 뷰로 넘기기
    //각각 로직후 업데이트하기

    useEffect(() => {
        //맴버 불러오기
        axiosWithToken.get('/members')
            .then((response) => {
                setMembers(response.data);
            })
            .catch((error) => {
                alert("정보 불러오기 실패")
            });

    }, []);



    return (
        <div className='d-flex flex-column h-100  bg-white'>

            {/* 헤더 */}
            <SubHeader title='직원관리' />

            {/* 카테고리 */}
            <div className='d-flex bg-white fs-5 fw-medium text-secondary border-bottom'>
                <div className={`text-center py-2 w-100 ${selected === 'members' ? 'selected' : ''}`} onClick={() => setSelected('members')}>직원목록</div>
                <div className='border-end' />
                <div className={`text-center py-2 w-100 ${selected === 'approvals' ? 'selected' : ''}`} onClick={() => setSelected('approvals')}>가입대기</div>
            </div>

            {/* 뷰 */}
            <div className='flex-grow-1 overflow-y-auto bg-white'>
                {selected === "members" && <MemeberView members={members} setMembers={setMembers} />}
                {selected === "approvals" && <ApprovalView members={members} setMembers={setMembers} />}
            </div>

        </div>
    );
}

export default MemberPage;