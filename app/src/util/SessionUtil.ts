import { Loading, LocalStorage } from 'quasar';
// import LogoutFunc from 'src/functions/access/LogoutFunc';
import DataObject from 'src/models/DataObject';
// import { GetContentModel } from 'src/models/content/Content';
import { Account } from 'appwrite';
import { router } from 'src/router';
import ApiUtil from './ApiUtil';
import NotifyUtil from './NotifyUtil';
import StringUtil from './StringUtil';
import RoutesPaths from 'src/router/RoutesPaths';
export default class SessionUtil {
  private static readonly TOKEN = 'token';
  private static readonly TOKEN_AT = 'token_at';
  private static readonly APPWRITE_TOKEN = 'appwriteToken';
  private static readonly DATA = 'data';
  private static readonly SESSION_ID = 'seesionId';
  private static readonly ZONE = 'zone';

  public static setZone(zone: string): void {
    LocalStorage.set(SessionUtil.ZONE, zone);
  }

  public static getZone(): string | null {
    return LocalStorage.getItem(SessionUtil.ZONE) as string;
  }

  public static isLoggedIn(): boolean {
    if (SessionUtil.getRole() == 'ANONYMOUS_USER') {
      return false;
    }
    const tokenAt = LocalStorage.getItem(SessionUtil.TOKEN_AT)
      ? `${LocalStorage.getItem(SessionUtil.TOKEN_AT)}`
      : undefined;
    if (!tokenAt) {
      return false;
    }
    //add 24 hour
    const token = new Date(parseInt(tokenAt) + 3_600_000 * 24 * 30);
    if (token < new Date()) {
      return false;
    }
    return !!LocalStorage.getItem('token');
  }

  public static login(data: DataObject): void {
    SessionUtil.setTokenAt(`${new Date().getTime()}`);
    SessionUtil.setToken(data.access_token || data.accessToken);
    SessionUtil.setData(data);
    SessionUtil.setAppwriteToken(data.appwriteToken);
    SessionUtil.setSessionId(data.sessionId);
  }

  public static setToken(token: string): void {
    LocalStorage.set(SessionUtil.TOKEN, token);
  }

  public static setTokenAt(tokenAt: string): void {
    LocalStorage.set(SessionUtil.TOKEN_AT, tokenAt);
  }

  // logout
  public static async logout(): Promise<void> {
    Loading.show();
    try {
      try {
        if (SessionUtil.getToken()) {
          // await new LogoutFunc().executeAsync({
          //   token: SessionUtil.getToken(),
          // });
          NotifyUtil.success({
            message: StringUtil.translate('loggedOut'),
          });
        }
      } catch (error) {}
    } catch (error) {
      console.error(error);
    } finally {
      Loading.hide();
      try {
        if (SessionUtil.getSessionId()) {
          const client = ApiUtil.getAppwriteClient();
          const account = new Account(client);
          await account.deleteSession(SessionUtil.getSessionId() as string);
        }
      } catch (error) {
      } finally {
        LocalStorage.remove(SessionUtil.TOKEN);
        LocalStorage.remove(SessionUtil.APPWRITE_TOKEN);
        LocalStorage.remove(SessionUtil.DATA);
        LocalStorage.remove('cookieFallback');
        LocalStorage.remove('content');
        LocalStorage.remove(SessionUtil.TOKEN_AT);
        router.replace(RoutesPaths.HOME);
      }
    }
    // NotificationsEventBus.logout();
  }
  // public static setMetadata(metadata: DataObject) {
  //   const data = SessionUtil.getData() as DataObject;
  //   data.metadata = { ...metadata };
  //   SessionUtil.setData(data);
  // }
  public static getToken(): string | undefined {
    return LocalStorage.getItem(SessionUtil.TOKEN) as string | undefined;
  }
  public static setLang(lang: string): void {
    LocalStorage.set('lang', lang);
  }

  public static getLang(): string | null {
    if (navigator) {
      const language = navigator?.language || 'en-US';
      return (
        LocalStorage.getItem('lang') ||
        (language.startsWith('ar') ? 'ar-SA' : 'en-US')
      );
    } else {
      return 'en-US';
    }
  }

  public static setAppwriteToken(token: string): void {
    LocalStorage.set(SessionUtil.APPWRITE_TOKEN, token);
  }

  public static getAppwriteToken(): string | null | undefined {
    return LocalStorage.getItem(SessionUtil.APPWRITE_TOKEN) as string;
  }

  public static getUserFullName(): string | undefined {
    const data = LocalStorage.getItem(SessionUtil.DATA) as
      | DataObject
      | undefined;
    return data?.metadata?.first_name && data?.metadata?.last_name
      ? `${data?.metadata?.first_name} ${data?.metadata?.last_name}`
      : data?.metadata?.email;
  }

  //first car from firstName and first char from lastName
  public static getInitials(): string {
    const data = LocalStorage.getItem(SessionUtil.DATA) as
      | DataObject
      | undefined;
    return `${data?.metadata?.firstName?.charAt(
      0
    )}${data?.metadata?.lastName?.charAt(0)}`;
  }

  public static getUserEmail(): string | undefined {
    const data = LocalStorage.getItem(SessionUtil.DATA) as
      | DataObject
      | undefined;
    return data?.metadata?.email;
  }

  // public static saveContent(res: Array<GetContentModel>) {
  //   LocalStorage.set('content', res);
  // }

  public static removeContent() {
    LocalStorage.remove('content');
  }

  // public static getContent(): Array<GetContentModel> | null {
  //   return LocalStorage.getItem('content');
  // }

  public static rememberMe(credentials: DataObject) {
    LocalStorage.set('rememberMe', credentials);
  }

  public static getRememberMe(): DataObject | null {
    return LocalStorage.getItem('rememberMe');
  }

  public static getUserId(): string | null {
    return SessionUtil.getData()?.metadata?.id;
  }

  public static getData(): DataObject | null {
    return LocalStorage.getItem(SessionUtil.DATA);
  }

  public static setData(data: DataObject) {
    LocalStorage.set(SessionUtil.DATA, data);
  }

  public static getUserProfileImage() {
    return SessionUtil.getData()?.metadata?.profileImage || '/images/user.png';
  }

  public static getRole() {
    return SessionUtil.getData()?.role;
  }

  // public static isVerified() {
  //   const data = SessionUtil.getData() as DataObject;
  //   return data?.metadata?.isVerified;
  // }

  public static setUserVerified(verified: boolean) {
    if (SessionUtil.isLoggedIn()) {
      const data = SessionUtil.getData() as DataObject;
      data.metadata.isVerified = verified;
      SessionUtil.setData(data);
    }
  }

  public static getDeviceId() {
    return (
      LocalStorage.getItem('fcmtoken') ||
      SessionUtil.getData()?.metadata?.deviceId ||
      StringUtil.uuidv4()
    );
  }

  public static setDeviceId(deviceId: string) {
    LocalStorage.set('fcmtoken', deviceId);
    if (SessionUtil.isLoggedIn()) {
      const data = SessionUtil.getData() as DataObject;
      if (data?.metadata?.deviceId) data.metadata.deviceId = deviceId;
      SessionUtil.setData(data);
    }
  }

  public static getSessionId(): string | null {
    return LocalStorage.getItem(SessionUtil.SESSION_ID);
  }

  public static setSessionId(sessionId: string) {
    LocalStorage.set(SessionUtil.SESSION_ID, sessionId);
  }
  public static setMetadata(metadata: DataObject) {
    const data = SessionUtil.getData() as DataObject;
    data.metadata = { ...metadata };
    SessionUtil.setData(data);
  }
}
