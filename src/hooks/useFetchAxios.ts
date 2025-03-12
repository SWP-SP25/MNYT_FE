import { useState, useEffect } from "react";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

axios.defaults.baseURL = "https://jsonplaceholder.typicode.com";

interface UseAxiosProps {
    url: string;
    method: "get" | "post" | "put" | "delete" | "patch";
    body?: string | null;
    headers?: string | null;
    options?: { headers?: Record<string, string> };
}

interface UseAxiosResult<T> {
    response: T | null;
    error: any;
    loading: boolean;
}

const useAxios = <T = any>({
    url,
    method,
    body = null,
    headers = null,
    options = {},
}: UseAxiosProps): UseAxiosResult<T> => {
    const [response, setResponse] = useState<T | null>(null);
    const [error, setError] = useState<any>("");
    const [loading, setloading] = useState<boolean>(true);

    const fetchData = async () => {
        try {
            let requestHeaders: Record<string, string> = {};

            if (headers) {
                requestHeaders = JSON.parse(headers);
            } else {
                const token = localStorage.getItem("token");
                requestHeaders = {
                    "Content-Type": "application/json",
                    ...(token && { Authorization: `Bearer ${token}` }),
                    ...options.headers,
                };
            }

            const config: AxiosRequestConfig = {
                headers: requestHeaders,
            };

            let axiosResponse: AxiosResponse<T>;

            if (body) {
                axiosResponse = await axios[method](url, JSON.parse(body), config);
            } else {
                axiosResponse = await axios[method](url, config);
            }

            console.log("fetch data", axiosResponse);
            setResponse(axiosResponse.data);
        } catch (err) {
            setError(err);
        } finally {
            setloading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return { response, error, loading };
};

export default useAxios;