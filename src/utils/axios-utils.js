// axios interceptor is used to intercept the request and response. this is useful when you want to add a token to the request or when you want to handle the error response globally. for example, you may want to redirect the user to the login page when the user is not authenticated or you may want to show a toast message or a notification when the user is not authenticated.

import axios from "axios";

const client = axios.create({ baseURL: "http://localhost:4000" });

export const request = ({ ...options }) => {
    client.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem("token")}`;
    const onSuccess = (response) => response;
    const onError = (error) => {
        // optionally catch the error
        return error;
    };
    return client(options).then(onSuccess).catch(onError);
};