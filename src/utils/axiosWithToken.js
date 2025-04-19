import axios from 'axios';

//Axios 인스턴스 생성
const axiosWithToken = axios.create({
    baseURL:  process.env.NODE_ENV === 'development' ? "http://192.168.0.3:8080" : "/api"
});

//요청 인터셉터 설정
axiosWithToken.interceptors.request.use(
    (config) => {
        //토큰 가져오기
        const token = localStorage.getItem('jwtToken');

        if (token) {
            // 요청 헤더에 토큰을 추가합니다.
            config.headers['Authorization'] = token;
        }

        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);

//응답 인터셉터 설정
axiosWithToken.interceptors.response.use(
    response => {
        return response;
    },
    async error => {
        //401에러 즉 접근제한시
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('jwtToken');
            window.location.href = '/login';
        }

        // 401 외의 다른 에러는 그대로 반환
        return Promise.reject(error);
    }
)

export default axiosWithToken;

