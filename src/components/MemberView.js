import axios from "axios";
import React from "react";
import { Button, ListGroup, ListGroupItem } from "react-bootstrap";
import axiosWithToken from "../utils/axiosWithToken";

function MemeberView({ members, setMembers }) {

    //차단
    const block = (user) => {
        axiosWithToken.put(`members/${user.id}/block`)
            .then((response) => {
                //맴버 업데이트
                setMembers(prev => prev.map(u => u.id !== user.id ? u : { ...u, enabled: false }));
            })
            .catch((error) => {
                alert("차단 실패");
            });
    }

    //차단 해제
    const unBlock = (user) => {
        axiosWithToken.put(`members/${user.id}/unBlock`)
            .then((response) => {
                //맴버 업데이트
                setMembers(prev => prev.map(u => u.id !== user.id ? u : { ...u, enabled: true }));
            })
            .catch((error) => {
                alert("차단 실패");
            });
    }


    return (
        <ListGroup>
            {members
                .filter(user => user.approved === true)
                .map((user, index) => (

                    <ListGroupItem key={index}>
                        <div className='d-flex align-items-center'>
                            <div className='flex-grow-1'>
                                <div className='fs-5 fw-medium'>{user.username} {!user.enabled && <span className='text-danger'>(차단됨)</span>} {user.role === 'ROLE_ADMIN' && <span className='text-success'>(운영자)</span>} </div>
                                <div className='mt-1 text-secondary fw-medium' style={{ fontSize: '0.85rem' }}>가입일 {user.createdDate}</div>
                            </div>
                            <div>
                                {user.enabled ?
                                    <Button variant='outline-danger' className='px-3 fw-medium' onClick={() => block(user)}>
                                        차단
                                    </Button>
                                    :
                                    <Button variant='outline-success' className='px-3 fw-medium' onClick={() => unBlock(user)}>
                                        차단해제
                                    </Button>
                                }
                            </div>
                        </div>
                    </ListGroupItem>

                ))}
        </ListGroup>
    )
}

export default MemeberView;