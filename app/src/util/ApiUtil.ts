import { Account, Client, Storage } from 'appwrite';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import DataObject from 'src/models/DataObject';
import { AppwriteFile, DownloadFile } from 'src/models/DownloadFile';
import NotifyUtil from './NotifyUtil';
import SessionUtil from './SessionUtil';
import LanguageUtil from './LanguageUtil';
import StringUtil from './StringUtil';

const processEnv = import.meta.env;

// Define a type that represents possible API errors
export type ApiError = Error | AxiosError | any | unknown;

// Create an Axios interceptor to handle API errors globally
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    NotifyUtil.error({
      message: `${`${
        (error.response?.data as DataObject)?.message ||
        JSON.stringify(error.message)
      }`
        .replaceAll('()', '')
        .replace(
          'Network Error',
          StringUtil.translate('checkYourInternetConnection')
        )} `,
    });
    //check if error 401 and redirect to login
    if (
      error.response?.status === 401 ||
      error.code?.includes('401') ||
      error.message.includes('401')
    ) {
      if (!error.request.responseURL.includes('logout')) SessionUtil.logout();
    }
    //429
    if (
      error.response?.status === 429 ||
      error.code?.includes('429') ||
      error.message.includes('429')
    ) {
      return Promise.reject(new Error(StringUtil.translate('tooManyRequests')));
    }
    return Promise.reject(error);
  }
);

// Define the ApiUtil class
export default class ApiUtil {
  
  // Define the base URL for your API
  private static baseURL = processEnv.VITE_APIBASE_URL;

  static async search<T>(
    endpoint: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    config = ApiUtil.getDefaultConfig(config);
    try {
      // Make a GET request using Axios
      const response: AxiosResponse<T> = await axios.get<T>(
        `${this.baseURL}/${endpoint}`,
        config
      );
      // Return the response data
      return response.data;
    } catch (error: ApiError) {
      // Handle API errors and throw a custom error
      throw this.handleApiError(error);
    }
  }

  // Static method for making GET requests
  static async get<T>(
    endpoint: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    config = ApiUtil.getDefaultConfig(config);
    try {
      // Make a GET request using Axios
      const response: AxiosResponse<T> = await axios.get<T>(
        `${this.baseURL}/${endpoint}`,
        config
      );
      // Return the response data
      return response.data;
    } catch (error: ApiError) {
      // Handle API errors and throw a custom error
      throw this.handleApiError(error);
    }
  }

  // Static method for making POST requests
  static async post<T>(
    endpoint: string,
    data?: DataObject,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      config = ApiUtil.getDefaultConfig(config);
      ApiUtil.clearData(data);

      // Make a POST request using Axios
      const response: AxiosResponse<T> = await axios.post<T>(
        `${this.baseURL}/${endpoint}`,
        data,
        config
      );
      // Return the response data
      return response.data;
    } catch (error: ApiError) {
      console.error('ApiUtil.post.error - ' + JSON.stringify(error));
      throw this.handleApiError(error);
    }
  }

  // Static method for making PUT requests
  static async put<T>(
    endpoint: string,
    data?: DataObject,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      config = ApiUtil.getDefaultConfig(config);
      ApiUtil.clearData(data);

      // Make a PUT request using Axios
      const response: AxiosResponse<T> = await axios.put<T>(
        `${this.baseURL}/${endpoint}`,
        data,
        config
      );
      // Return the response data
      return response.data;
    } catch (error: ApiError) {
      // Handle API errors and throw a custom error
      throw this.handleApiError(error);
    }
  }

  // Static method for making PATCH requests
  static async patch<T>(
    endpoint: string,
    data?: DataObject,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      config = ApiUtil.getDefaultConfig(config);
      // Make a PATCH request using Axios
      //delete from data all keys end with Data , ByUser, createdAt, updatedAt, createdBy, updatedBy
      ApiUtil.clearData(data);
      const response: AxiosResponse<T> = await axios.patch<T>(
        `${this.baseURL}/${endpoint}`,
        data,
        config
      );
      // Return the response data
      return response.data;
    } catch (error: ApiError) {
      // Handle API errors and throw a custom error
      throw this.handleApiError(error);
    }
  }

  private static clearData(data: DataObject | undefined) {
    if (data)
      Object.keys(data).forEach((key) => {
        if (
          key.endsWith('Data') ||
          key.endsWith('ByUser') ||
          key.endsWith('At') ||
          key.endsWith('By')
        ) {
          delete data[key];
        }
      });
  }

  // Static method for making DELETE requests
  static async delete<T>(
    endpoint: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      config = ApiUtil.getDefaultConfig(config);
      // Make a DELETE request using Axios
      const response: AxiosResponse<T> = await axios.delete<T>(
        `${this.baseURL}/${endpoint}`,
        config
      );
      // Return the response data
      return response.data;
    } catch (error: ApiError) {
      // Handle API errors and throw a custom error
      throw this.handleApiError(error);
    }
  }

  //upload File
  static async upload<T>(
    endpoint: string,
    formData: FormData,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      if (!endpoint.startsWith('upload')) {
        endpoint = `upload/${endpoint}`;
      }
      config = ApiUtil.getDefaultConfig(config);
      //Content-Type: multipart/form-data
      if (!config.headers) {
        config.headers = {};
      }
      config.headers['Content-Type'] = 'multipart/form-data';
      // Make a POST request using Axios
      const response: AxiosResponse<T> = await axios.post<T>(
        `${this.baseURL}/${endpoint}`,
        formData,
        config
      );
      // Return the response data
      return response.data;
    } catch (error: ApiError) {
      console.error('ApiUtil.upload.error - ' + JSON.stringify(error));
      throw this.handleApiError(error);
    }
  }

  //download dile based on type pdf csv

  static async download(
    endpoint: string,
    config?: AxiosRequestConfig
  ): Promise<void> {
    try {
      const reponse = await this.get<DownloadFile>(endpoint, config);
      const blob = new Blob([reponse.buffer], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'car.csv';
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {}
  }

  public static getAppwriteFileUrl(
    folder: string,
    fileId: string
  ): string | undefined {
    try {
      const client = new Client();
      client
        .setEndpoint(processEnv.VITE_APPWRITE_URL) // Your Appwrite Endpoint
        .setProject(processEnv.VITE_APPWRITE_PROJECT_ID);
      if (SessionUtil.getAppwriteToken()) {
        client.setJWT(SessionUtil.getAppwriteToken() as string);
      }
      const storage = new Storage(client);
      const url = storage.getFilePreview(folder, fileId);
      return url.toString();
    } catch (error) {
      return undefined;
    }
  }

  public static getAppwriteFileDownloadUrl(
    folder: string,
    fileId: string
  ): string | undefined {
    try {
      const client = new Client();
      client
        .setEndpoint(processEnv.VITE_APPWRITE_URL) // Your Appwrite Endpoint
        .setProject(processEnv.VITE_APPWRITE_PROJECT_ID);
      if (SessionUtil.getAppwriteToken()) {
        client.setJWT(SessionUtil.getAppwriteToken() as string);
      }
      const storage = new Storage(client);
      const url = storage.getFileDownload(folder, fileId);
      return `${url.toString()}&mode=admin`;
    } catch (error) {
      return undefined;
    }
  }

  public static async downloadFile(
    endpoint: string,
    config?: AxiosRequestConfig
  ): Promise<void> {
    const reponse = await this.get<AppwriteFile>(endpoint, config);
    if (!reponse.bucket || !reponse.file) return undefined;
    const url = ApiUtil.getAppwriteFileDownloadUrl(
      reponse.bucket,
      reponse.file
    ) as string;
    //open in new tab
    const link = document.createElement('a');
    link.href = `${url}&mode=admin`;
    link.target = '_blank';
    link.download = 'car.csv';
    link.click();
    window.URL.revokeObjectURL(url);
    return undefined;
  }

  public static getAppwriteClient = (): Client => {
    const client = new Client();
    client
      .setEndpoint(processEnv.VITE_APPWRITE_URL as string) // Your Appwrite Endpoint
      .setEndpointRealtime(processEnv.VITE_APPWRITE_REALTIME_URL as string) // Your Appwrite Realtime Endpoint
      .setProject(processEnv.VITE_APPWRITE_PROJECT_ID as string);
    if (SessionUtil.getAppwriteToken())
      client.setJWT(SessionUtil.getAppwriteToken() as string);
    return client;
  };

  public static async loginAppwrite(
    email: string,
    password: string
  ): Promise<{
    session: string | number | [];
    jwt: string;
  }> {
    const client = new Client();
    client
      .setEndpoint(processEnv.VITE_APPWRITE_URL as string) // Your Appwrite Endpoint
      .setProject(processEnv.VITE_APPWRITE_PROJECT_ID as string);
    const account = new Account(client);
    const sessionRes = await account.createSession(email, password);
    const jwtRes = await account.createJWT();
    SessionUtil.setAppwriteToken;
    return { jwt: jwtRes.jwt, session: sessionRes.$id };
  }

  // Private method for handling API errors
  private static handleApiError(error: AxiosError): Error {
    if (error.response) {
      // The request was made, but the server responded with a status code that falls out of the range of 2xx
      return new Error(
        `${error.response.status} - ${error.response.statusText}`
      );
    } else if (error.request) {
      // The request was made, but no response was received
      return new Error('No response received');
    } else {
      // Something happened in setting up the request that triggered an error
      return new Error(`${error.message}`);
    }
  }

  private static getDefaultConfig(config: AxiosRequestConfig | undefined) {
    if (!config) {
      config = {};
    }
    if (!config.headers) {
      config.headers = {};
    }
    if (SessionUtil.getToken()) {
      config.headers.Authorization = `Bearer ${SessionUtil.getToken()}`;
      config.headers['x-idrive-device-id'] =
        SessionUtil.getDeviceId() || '0000000';
    }
    if (!config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json';
    }
    config.headers['language'] = LanguageUtil.isArabic() ? 'ar' : 'en';
    config.headers['Accept-Language'] = LanguageUtil.isArabic() ? 'ar' : 'en';
    config.headers['session-id'] = SessionUtil.getSessionId();
    return config;
  }
}
