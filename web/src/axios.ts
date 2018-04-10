import axios from "axios";

let myAxios = axios.create();
myAxios.interceptors.request.use(config => {
    // Insere a token em todas as requisições para a API local
    let token = localStorage.getItem("api-token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default myAxios;
