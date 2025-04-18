import axios from 'axios';

//Axios 인스턴스 생성
const axiosWithToken = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL
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
// axiosWithToken.interceptors.response.use(
//     response => {
//         return response;
//     },
//     async error => {
//         //401에러 즉 토큰 x
//         if (error.response && error.response.status === 401) {
//             try {
//                 // 새 토큰을 /guest-token 경로로 요청
//                 const response = await axios.get('http://192.168.0.3:8080/guest-token');
//                 const newToken = response.headers['authorization'];

//                 // 새 토큰을 로컬 스토리지에 저장
//                 localStorage.setItem('jwtToken', newToken);

//                 // 원래 요청을 새 토큰과 함께 재시도
//                 error.config.headers['Authorization'] = newToken;

//                 // 원래 요청을 새 토큰으로 재전송
//                 return axios(error.config);
//             } catch (tokenError) {
//                 return Promise.reject(tokenError);
//             }
//         }

//         // 401 외의 다른 에러는 그대로 반환
//         return Promise.reject(error);
//     }
// )

export default axiosWithToken;

