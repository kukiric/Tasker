import createStore, { tokenKey } from "@main/store";
import axios from "axios";

export default function createAxios() {
    let axiosInstance = axios.create({
        // Variável do .env definida através do Webpack
        baseURL: BASE_URL
    });
    // Insere a token em todas as requisições para a API
    axiosInstance.interceptors.request.use((config) => {
        let token = localStorage.getItem(tokenKey);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });
    // Exibe mensagens de erro em todas as respostas em modo de desenvolvimento
    if (process.env.NODE_ENV === "development") {
        axiosInstance.interceptors.response.use(undefined, (err) => {
            console.error(err.toString());
            if (err.response) {
                console.error("URL: " + err.config.url);
                console.error(JSON.stringify(err.response.data, null, 4));
            }
            throw err;
        });
    }
    return axiosInstance;
}
