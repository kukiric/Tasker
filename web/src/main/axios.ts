import axios from "axios";

let myAxios = axios.create({
    // Variável global definida pelo Webpack
    baseURL: BASE_URL
});

// Insere a token em todas as requisições para a API local
myAxios.interceptors.request.use(config => {
    let token = localStorage.getItem("api-token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

if (process.env.NODE_ENV === "development") {
    // Exibe mensagens de erro em todas as respostas
    myAxios.interceptors.response.use(undefined, err => {
        console.error(err.toString());
        if (err.response) {
            console.error("URL: " + err.config.url);
            console.error(JSON.stringify(err.response.data, null, 4));
        }
        throw err;
    });
}

export default myAxios;
