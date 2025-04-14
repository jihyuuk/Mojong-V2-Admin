import axios from 'axios';
import React, { useState } from 'react';
import { Button, FloatingLabel, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useToken } from '../utils/TokenContext';


function LonginPage() {

    //인풋값
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [autoLogin, setAutoLogin] = useState(true);

    //검증
    const [isInValidName, setIsInValidName] = useState(false);
    const [isInValidPwd, setIsInValidPwd] = useState(false);
    const [feedbackName, setFeedbackName] = useState();
    const [feedbackPwd, setFeedbackPwd] = useState();

    //토큰
    const {updateToken} = useToken();

    //리액트 라우터
    const navigate = useNavigate();

    //로그인 버튼 클릭 처리
    const handleSubmit = async (e) => {
        e.preventDefault();

        //입력칸이 비었을시
        if (username === '' || password === '') {
            if (username === '') {
                setFeedbackName('직원명을 입력해주세요');
                setIsInValidName(true);
            }
            if (password === '') {
                setFeedbackPwd('비밀번호를 입력해주세요')
                setIsInValidPwd(true);
            }
            return;
        }

        //서버 로그인 요청
        axios.post(
            'http://192.168.0.3:8080/login',
            `username=${username}&password=${password}`,
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        )
            .then((response) => {
                //로그인 성공시
                if (response.status === 200) {
                    //토큰 설정
                    updateToken(response.headers.getAuthorization());
                    //리다이렉트
                    navigate("/", { replace: true });
                }
            })
            .catch((error) => {
                if (error.response && error.response.status === 401) {
                    //로그인 거부시
                    setIsInValidName(true);
                    setIsInValidPwd(true);
                    setFeedbackName('');
                    setFeedbackPwd('직원명 또는 비밀번호가 일치하지 않습니다.');
                } else if (error.response && error.response.status === 403) {
                    alert("관리자에게 문의해주세요.");
                } else {
                    //기타 서버 오류
                    //console.error('로그인 중 서버 연결 실패 :', error.message);
                    alert("서버 연결 실패! 관리자에게 문의하세요.");
                }
            });

    }

    const nameChange = (value) => {
        setUsername(value);
        if (isInValidName) setIsInValidName(false);
    }

    const pwdChange = (value) => {
        setPassword(value);
        if (isInValidPwd) setIsInValidPwd(false);
    }


    return (
        <div className="z-1 position-absolute top-0 start-0 w-100 h-100 bg-white">
            <div className='d-flex align-items-center justify-content-center bg-white h-100'>
                <div className='text-center p-5 pt-0' style={{ maxWidth: '450px' }}>

                    <img src={process.env.PUBLIC_URL + '/loginLogo.png'} className='w-100 px-3 mb-3' />

                    <Form noValidate onSubmit={handleSubmit} className='pt-4'>
                        <p className='fs-4 fw-medium mb-3 text-start'>로그인</p>

                        <FloatingLabel controlId="loginId" label="직원명" className="mb-3">
                            <Form.Control type="text" placeholder="홍길동" value={username} onChange={(e) => nameChange(e.target.value.trim())} isInvalid={isInValidName} />
                            <Form.Control.Feedback type="invalid" className='text-start'>{feedbackName}</Form.Control.Feedback>
                        </FloatingLabel>

                        <FloatingLabel controlId="loginPassword" label="비밀번호" className="mb-3">
                            <Form.Control type="password" placeholder="비밀번호" value={password} onChange={(e) => pwdChange(e.target.value.trim())} isInvalid={isInValidPwd} />
                            <Form.Control.Feedback type="invalid" className='text-start'>{feedbackPwd}</Form.Control.Feedback>
                        </FloatingLabel>

                        <div className='d-flex justify-content-between mb-3'>
                            <Form.Check type="switch" id="autoLogin" label="자동로그인" className='text-start mb-4' checked={autoLogin} onChange={() => setAutoLogin(!autoLogin)} />
                            <Link to='/join' className='text-success'>회원가입</Link>
                        </div>
                        <Button type='submit' variant="success" className='fs-5 fw-semibold w-100 mt-4 rounded-5 py-2'>로그인</Button>
                    </Form>

                </div>
            </div>
        </div>
    );
}

export default LonginPage;