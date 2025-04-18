import axios from 'axios';
import React, { useState } from 'react';
import { Alert, Button, FloatingLabel, Form, Toast } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function JoinPage() {
    //인풋값
    const [username, setUsername] = useState('');
    const [pwd, setPwd] = useState('');
    const [pwdCheck, setPwdCheck] = useState('');

    //검증
    const [inVaildUserName, setInvaildUserName] = useState(false);
    const [inVaildPwd, setInvaildPwd] = useState(false);
    const [inVaildPwdCheck, setInvailPwdCheck] = useState(false);

    const [fbMsgUserName, setFbMsgUserName] = useState('');
    const [fbMsgPwd, setFbMsgPwd] = useState('');
    const [fbMsgPwdCheck, setFbMsgPwdCheck] = useState('');

    //가입성공 토스트
    const [show, setShow] = useState(false);

    //제출버튼 클릭시
    const handleSubmit = (e) => {
        e.preventDefault();

        //검증 실행
        if (!vaildation()) return;

        //서버연동실행
        fetchJoin();
    }

    //서버연동
    const fetchJoin = async () => {
        try {
            const response = await axios.post('http://192.168.0.3:8080/join', `username=${username}&password=${pwd}`, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            if (response.status === 201) {
                //정상실행
                setUsername('');
                setPwd('');
                setPwdCheck('');
                setShow(true);
            }

        } catch (error) {
            if (error.response && error.response.status === 409) {
                //직원명 중복
                setFbMsgUserName('이미 가입신청된 직원명 입니다.');
                setInvaildUserName(true);
            } else {
                console.error('알수없는 에러 발생');
                alert('회원가입에 실패하였습니다. 관리자에게 문의하여 주십쇼')
            }

        }

    }

    //인풋검증
    const vaildation = () => {
        //빈칸있을시에
        if (username === '' || pwd === '' || pwdCheck === '') {
            if (username === '') {
                setFbMsgUserName('직원명을 입력해주세요');
                setInvaildUserName(true);
            }

            if (pwd === '') {
                setFbMsgPwd('비밀번호를 입력해주세요');
                setInvaildPwd(true);
            }

            if (pwdCheck === '') {
                setFbMsgPwdCheck('비밀번호 확인을 입력해주세요');
                setInvailPwdCheck(true);
            }
            return false;
        }

        //비밀번호가 다를시에
        if (pwd != pwdCheck) {
            setFbMsgPwd('');
            setFbMsgPwdCheck("비밀번호가 일치하지 않습니다.");
            setInvaildPwd(true);
            setInvailPwdCheck(true);
            return false;
        }

        return true;
    }

    //인풋핸들러
    const nameChange = (value) => {
        setUsername(value);
        if (inVaildUserName) setInvaildUserName(false);
    }
    const pwdChange = (value) => {
        setPwd(value);
        if (inVaildPwd) {
            setInvaildPwd(false);
            setInvailPwdCheck(false);
        }
    }
    const pwdCheckChange = (value) => {
        setPwdCheck(value);
        if (inVaildPwdCheck) {
            setInvaildPwd(false);
            setInvailPwdCheck(false);
        }
    }



    return (
        <div className='d-flex justify-content-center bg-white h-100'>
            <div className='text-center p-5 w-100' style={{ maxWidth: '450px' }}>
                <p className='mt-3 my-5 fw-semibold display-5'>회원가입</p>

                <Form action='/' onSubmit={handleSubmit} className='mb-4'>

                    <FloatingLabel controlId="joinId" label="직원명" className="mb-4">
                        <Form.Control type="text" placeholder="홍길동" value={username} onChange={(e) => nameChange(e.target.value.trim())} isInvalid={inVaildUserName} />
                        <Form.Control.Feedback type="invalid" className='text-start'>{fbMsgUserName}</Form.Control.Feedback>
                    </FloatingLabel>

                    <FloatingLabel controlId="joinPassword" label="비밀번호" className="mb-2">
                        <Form.Control type="password" placeholder="비밀번호" value={pwd} onChange={(e) => pwdChange(e.target.value.trim())} isInvalid={inVaildPwd} />
                        <Form.Control.Feedback type="invalid" className='text-start'>{fbMsgPwd}</Form.Control.Feedback>
                    </FloatingLabel>

                    <FloatingLabel controlId="joinPasswordCheck" label="비밀번호 확인" className="mb-2">
                        <Form.Control type="password" placeholder="비밀번호 확인" value={pwdCheck} onChange={(e) => pwdCheckChange(e.target.value.trim())} isInvalid={inVaildPwdCheck} />
                        <Form.Control.Feedback type="invalid" className='text-start'>{fbMsgPwdCheck}</Form.Control.Feedback>
                    </FloatingLabel>
                    <p className='text-secondary text-start mb-3'>관리자의 승인 후 이용 가능합니다.</p>

                    <Toast onClose={() => setShow(false)} show={show} delay={5000} autohide className='p-0 border-0'>
                        <Alert variant='success' className='m-0 d-flex align-items-center'>
                            <div className='me-2'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-check-circle me-2" viewBox="0 0 16 16">
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                    <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05" />
                                </svg>
                            </div>
                            <div>
                                <div className=''>신청이 완료되었습니다.</div>
                                <div>관리자 승인 후 이용 가능합니다.</div>
                            </div>
                        </Alert>
                    </Toast>

                    <Button type='submit' variant='success' className='fs-5 fw-semibold w-100 mt-4 mb-2 rounded-5 py-2'>가입신청</Button>
                </Form>

                <Link to='/login' className='text-success'>로그인 페이지</Link>

            </div>
        </div>
    );
}

export default JoinPage;