export default class ApiPath {
  //create quiz
  public static readonly QUIZZES_GET = 'quizzes';
  public static readonly QUIZZES_POST = 'quizzes';
  //Jobs
  public static readonly RECIPES_GET = 'recipes';
  public static readonly COUNTRIES_GET_BY_NAME = 'name';

  public static readonly AUTHENTICATE = 'auth/authenticate';
  public static readonly OTP = 'otp';
  public static readonly LOGOUT = 'auth/logout';
  public static readonly PARTNERS = 'partners';

  public static readonly NAFATH_CHECK_STATUS = 'auth/nafath/check-status';
  public static readonly NAFATH_VERIFICATION = 'auth/nafath/verification';
  public static readonly IS_VERIFIED = 'auth/is-verified';
  public static readonly REGISTER = 'auth/register';
  //PASSWORD
  public static readonly CHANGE_PASSWORD = 'auth/change-password';
  public static readonly FORGOT_PASSWORD = 'auth/forgot-password';
  public static readonly RESET_PASSWORD = 'auth/reset-password';
  public static readonly DELETE_ACCOUNT = 'auth/delete-account';
  //USER
  public static readonly USER = 'user';
  public static readonly USER_INFO = 'user/info';
  public static readonly USER_RESET_PASSWORD = 'user/reset-password';

  //WALLET
  public static readonly CHECKED_OUT = 'cart/checked-out';
  public static readonly WALLET = 'wallet';
  //NOTIFICATION
  public static readonly NOTIFICATIONS = 'notification';
  public static readonly NOTIFICATION_EMAIL = 'notification-email';
  public static readonly NOTIFICATION_SETTINGS = 'notification-settings';
  public static readonly NOTIFICATION_SMS = 'notification-sms';

  public static readonly TRANSACTION = 'transaction';
  public static readonly SAVED_CARDS = 'saved-cards';

  public static readonly SETTINGS = 'settings';
  public static readonly TAMM = 'tamm-log';
  public static readonly NAFATH = 'nafath-log';
  public static readonly SYSTEM_LOG = 'log';
  public static readonly WALLET_TRANSACTION = 'wallet/transactions';
  //WHITE_LIST_IP
  public static readonly WHITE_LIST_IP = 'whitelist-ip';
  //STORAGE
  public static readonly STORAGE = 'storage';
  //SERVICE
  public static readonly SERVICE = 'service';
  //ODOO
  public static readonly ODOO = 'odoo';
  //API_KEY
  public static readonly API_KEY = 'api-key';
  //ADMIN
  public static readonly ADMIN = 'admin';
  //ELM_SERVICE
  public static readonly ELM_SERVICE = 'elm-service';
  //HYPER_PAY
  public static readonly HYPER_PAY = 'hyperpay-service';
  //ERROR
  public static readonly ERROR = 'error';
  //File
  public static readonly FILE = 'file';
}
