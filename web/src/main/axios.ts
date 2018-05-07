import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import createStore, { tokenKey } from "@main/store";

export interface RequestConfig extends AxiosRequestConfig {
    requestId: number;
}

export interface ResponseValue extends AxiosResponse<any> {
    config: RequestConfig;
}

export interface ResponseError extends AxiosError {
    config: RequestConfig;
}

export default function createAxios(store: () => ReturnType<typeof createStore>) {
    let lastRequestId = 0;
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
    axiosInstance.interceptors.request.use((config: RequestConfig) => {
        config.requestId = lastRequestId++;
        store().commit("pushRequest", Object.assign({}, config));
        return config;
    });
    // Limpa requisiçôes pendentes nas respostas
    axiosInstance.interceptors.response.use((value: ResponseValue) => {
        let requestId = value.config.requestId;
        store().commit("popRequest", requestId);
        return value;
    }, (err: ResponseError) => {
        let requestId = err.config.requestId;
        store().commit("popRequest", requestId);
        store().commit("pushError", err);
        throw err;
    });
    return axiosInstance;
}
