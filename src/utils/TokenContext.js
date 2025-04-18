import React, { createContext, useContext, useEffect, useState } from 'react';

//토큰 컨텍스트
const TokenContext = createContext();

//토큰 컨텍스트를 사용할 커스텀 훅
export function useToken() {
    return useContext(TokenContext);
}

// 토큰 컨텍스트 Provider
export function TokenProvider({ children }) {

    //토큰
    const [token, setToken] = useState(localStorage.getItem('jwtToken'));
    //유저이름
    const [username, setUsername] = useState("");
    //유저등급
    const [role, setRole] = useState("ROLE_STAFF");

    //토큰삭제
    const removeToken = () => {
        setToken(null);
        localStorage.removeItem('jwtToken');
    }

    //토큰등록
    const updateToken = (newToken) => {
        setToken(newToken);
        localStorage.setItem('jwtToken', newToken);
    }

    //토큰 바뀌면 상태 업데이트
    useEffect(() => {
        //토큰 없으면 초기값
        if (!token) {
            setUsername("");
            setRole("ROLE_STAFF");
            return;
        }

        try {
            const jwt = token.startsWith('Bearer ') ? token.slice(7) : token;
            const base64Url = jwt.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

            // 한글 깨짐 방지 처리!
            const jsonPayload = decodeURIComponent(escape(atob(base64)));
            const payload = JSON.parse(jsonPayload);

            if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
                console.warn("⏰ 토큰 만료됨");
                removeToken();
                return;
            }

            //유저, 권한 업데이트
            setUsername(payload.username || "");
            setRole(payload.role || "ROLE_STAFF");
        } catch (e) {
            console.error("토큰 디코딩 오류:", e);
            setUsername("");
            setRole("ROLE_STAFF");
        }

    }, [token]);

    //제공변수들
    const TokenContextValue = {
        token,
        username,
        role,
        removeToken,
        updateToken
    };

    return (
        <TokenContext.Provider value={TokenContextValue}>
            {children}
        </TokenContext.Provider>
    );
}
