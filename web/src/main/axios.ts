import createStore, { tokenKey } from "@main/store";
import axios from "axios";

export interface RequestLog {
    pending: void[];
    errors: number[];
}

export default function createAxios(requests: RequestLog) {
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
    // Loga as requisiçôes pendentes
    axiosInstance.interceptors.request.use((config) => {
        console.log("enviando...");
        requests.pending.push();
        return config;
    }, (error) => {
        console.log("erro!");
        requests.pending.pop();
        console.log(error);
        // requests.errors.push(error);
        throw error;
    });
    // Desloga requisiçôes pendentes nas respostas
    axiosInstance.interceptors.response.use((value) => {
        console.log("sucesso");
        requests.pending.pop();
        return value;
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
