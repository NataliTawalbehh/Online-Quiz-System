import { i18n } from 'src/boot/i18n';
import LanguageUtil from './LanguageUtil';

export default class StringUtil {
  public static isArabicString(str: string) {
    if (!str || str.trim().length === 0) return false;
    const arabicRegex = /[\u0600-\u06FF]/;
    return arabicRegex.test(str);
  }

  public static translate(str: string): string {
    try {
      console.log(`${str}: '${str}',`);
      const translated = i18n.global.t(str);
      if (StringUtil.isArabicString(translated)) {
        return translated;
      }
      if (translated === str) {
        return str.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) {
          return str.toUpperCase();
        });
      } else return translated;
    } catch (error) {
      console.log(`${str}: '${str}',`);

      return str;
    }
  }

  //generate uuid
  public static uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        // eslint-disable-next-line
        var r = (Math.random() * 16) | 0,
          // eslint-disable-next-line
          v = c == 'x' ? r : (r & 0x3) | 0x8;
        // eslint-disable-next-line
        return v.toString(16);
      }
    );
  }

  public static getInitials(text: string) {
    const names = text.split(' ');
    let initials = names[0].substring(0, 1).toUpperCase();

    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
  }
  //generate short unique id start with  3 charachters then 3 digits
  public static shortId(length: number): string {
    return (
      StringUtil.randomString(length, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') +
      StringUtil.randomString(length, '0123456789')
    );
  }

  //generate random string
  public static randomString(length: number, chars: string) {
    let result = '';
    for (let i = length; i > 0; --i)
      result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }

  //convert camel case to title case
  public static camelCaseToTitleCase(str: string) {
    return str.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) {
      return str.toUpperCase();
    });
  }

  //decodeBase64
  public static decodeBase64(str: string) {
    return atob(str);
  }

  //encodeBase64
  public static encodeBase64(str: string) {
    return btoa(str);
  }

  //format number currency local with currency code

  public static formatNumberCurrencyLocal(
    value: number,
    currencyCode?: string
  ): string {
    if (!currencyCode) {
      currencyCode = 'SAR';
    }
    return new Intl.NumberFormat(LanguageUtil.isArabic() ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(value);
  }
}
