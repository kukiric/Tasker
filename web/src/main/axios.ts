import createStore, { tokenKey } from "@main/store";
import axios from "axios";

export default function createAxios(store: () => ReturnType<typeof createStore>) {
    let axiosInstance = axios.create({
        // Variável do .env definida através do Webpack
        baseURL: BASE_URL
    });
    // Insere a token em todas as requisições para a API
    axiosInstance.interceptors.request.use((config) => {
        let token = store().state.token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });
    // Exibe mensagens de erro da API no console
    axiosInstance.interceptors.response.use(undefined, (err) => {
        console.error(err.toString());
        if (err.response) {
            console.error("URI: " + err.config.url);
            console.error(JSON.stringify(err.response.data, null, 4));
        }
        throw err;
    });
    // Loga as requisiçôes pendentes
    axiosInstance.interceptors.request.use(async (config) => {
        store().commit("pushRequest");
        return config;
    });
    // Limpa requisiçôes pendentes nas respostas
    axiosInstance.interceptors.response.use((value) => {
        store().commit("popRequest");
        return value;
    }, (err) => {
        store().commit("popRequest");
        let code = err.response ? err.response.status : err.message;
        store().commit("pushError", code);
        throw err;
    });
    return axiosInstance;
}
