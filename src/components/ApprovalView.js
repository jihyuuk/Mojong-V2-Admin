import React from "react";
import { Button, ListGroup, ListGroupItem } from "react-bootstrap";
import axiosWithToken from "../utils/axiosWithToken";

function ApprovalView({ members, setMembers }) {

    //거부
    const handleReject = (user) => {
        //서버에 거부 요청
        axiosWithToken.put(`members/${user.id}/disApproval`)
            .then((response) => {
                //맴버 업데이트
                setMembers(prev => prev.filter(u => u.id !== user.id));
            })
            .catch((error) => {
                alert("승인 거부 실패");
            });
    }


    //승인
    const handleApporve = (user) => {
        axiosWithToken.put(`members/${user.id}/approval`)
            .then((response) => {
                //맴버 업데이트
                setMembers(prev => prev.map(u => u.id !== user.id ? u : { ...u, approved: true, enabled : true }))
            })
            .catch((error) => {
                alert("승인 실패");
            })
    }


    return (
        <ListGroup>

            {members
                .filter(user => user.approved === false)
                .map((user, index) => (

                    <ListGroupItem key={index}>
                        <div className='d-flex align-items-center'>
                            <div className='flex-grow-1'>
                                <div className='fs-5 fw-medium'>{user.username}</div>
                                <div className='mt-1 text-secondary fw-medium' style={{ fontSize: '0.85rem' }}>신청일 {user.createdDate}</div>
                            </div>
                            <div>
                                <Button id={`approve-${index}`} variant='outline-danger' className='px-3 fw-medium me-2' onClick={() => handleReject(user)}>
                                    거부
                                </Button>
                                <Button id={`reject-${index}`} variant='outline-success' className='px-3 fw-medium' onClick={() => handleApporve(user)}>
                                    승인
                                </Button>
                            </div>
                        </div>
                    </ListGroupItem>
                ))}

        </ListGroup>
    )
}

export default ApprovalView;