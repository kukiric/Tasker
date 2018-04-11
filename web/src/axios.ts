import axios from "axios";

let myAxios = axios.create();

// Insere a token em todas as requisições para a API local
myAxios.interceptors.request.use(config => {
    let token = localStorage.getItem("api-token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Exibe mensagens de erro em todas as respostas
if (process.env.NODE_ENV === "development") {
    myAxios.interceptors.response.use(undefined, err => {
        console.error(err.toString());
        if (err.response) {
            console.error("URL: " + err.config.url);
            console.error(JSON.stringify(err.response.data, null, 4));
        }
    });
}

export default myAxios;
