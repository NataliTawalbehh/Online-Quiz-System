import { DateLocale, LocalStorage, QVueGlobals, date, getCssVar } from 'quasar';
import DataObject from 'src/models/DataObject';
import StringUtil from './StringUtil';
import ValidationUtil from './ValidationUtil';
import DateWrapper from './DateWrapper';

export default class UiUtil {
  public static MAP_DARK = [
    { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
    {
      featureType: 'administrative.locality',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#d59563' }],
    },
    {
      featureType: 'poi',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#d59563' }],
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry',
      stylers: [{ color: '#263c3f' }],
    },
    {
      featureType: 'poi.park',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#6b9a76' }],
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{ color: '#38414e' }],
    },
    {
      featureType: 'road',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#212a37' }],
    },
    {
      featureType: 'road',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#9ca5b3' }],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [{ color: '#746855' }],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#1f2835' }],
    },
    {
      featureType: 'road.highway',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#f3d19c' }],
    },
    {
      featureType: 'transit',
      elementType: 'geometry',
      stylers: [{ color: '#2f3948' }],
    },
    {
      featureType: 'transit.station',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#d59563' }],
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#17263c' }],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#515c6d' }],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.stroke',
      stylers: [{ color: '#17263c' }],
    },
  ];

  public static IGNORED_BY_DEFAULT = [
    'id',
    'createdBy',
    'createdAt',
    'updatedBy',
    // 'updatedByUser',
    // 'createdByUser',
  ];

  public static asHtmlTable = (data: DataObject, options: DataObject) => {
    const getValue = (key: string, data: DataObject) => {
      if (key.toLowerCase() === 'location') {
        return `<span class='q-px-sm'> ${data[key]} </span> <i class="q-icon notranslate material-icons cursor-pointer" aria-hidden="true" role="img">content_copy</i>`;
      }
      return StringUtil.translate(data[key]);
    };

    const dark = options?.dark;
    let shadow = true;
    if (options.shadow) {
      shadow = !!options.shadow;
    }
    let html = `<table class="table table-bordered table-striped full-width border-secondary br-8 ${
      shadow ? 'shadow-1' : ''
    }">`;
    let counter = 0;
    for (const key in data) {
      if (UiUtil.IGNORED_BY_DEFAULT.includes(key)) continue;
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const value = data[key];
        if (ValidationUtil.isUUID(value)) continue;
        counter++;
        if (value) {
          html += `<tr class='${
            counter % 2 === 1 ? (dark ? 'bg-dark' : 'bg-grey-2') : ''
          }' ><td class='text-weight-bold width-30-percent q-pa-md'>${
            ValidationUtil.isNumber(String(key))
              ? String(key)
              : StringUtil.translate(String(key))
          }</td><td class='q-pa-md'>${
            typeof value === 'object'
              ? UiUtil.asHtmlTable(value as DataObject, options)
              : getValue(key, data)
          }</td></tr>`;
        }
      }
    }
    html += '</table>';
    return html;
  };
  public static formatDate(
    d: string | number | Date,
    formt?: string,
    locale?: DateLocale
  ): string {
    if (formt) return date.formatDate(d, formt, locale);
    else return date.formatDate(d, 'DD/MM/YYYY HH:mm:ss');
  }

  public static applyDarkMode(q: QVueGlobals) {
    const dark = LocalStorage.getItem('dark');
    q.dark.set(!!dark);
  }

  public static setDarkMode(q: QVueGlobals, dark: boolean) {
    q.dark.set(dark);
    LocalStorage.set('dark', dark);
    UiUtil.applyStatusBarColor(q);
  }

  public static timeAgo = (dateString: string) => {
    const date = new Date(dateString).getTime();
    const now = Date.now();
    const secondsAgo = Math.round((now - date) / 1000);

    const minutesAgo = Math.round(secondsAgo / 60);
    if (minutesAgo < 1) return StringUtil.translate('justNow');
    if (minutesAgo === 1) return StringUtil.translate('minuteAgo');
    if (minutesAgo < 60)
      return `${minutesAgo} ${StringUtil.translate('minutesAgo')}`;

    const hoursAgo = Math.round(minutesAgo / 60);
    if (hoursAgo === 1) return StringUtil.translate('hourAgo');
    if (hoursAgo < 24) return `${hoursAgo} ${StringUtil.translate('hoursAgo')}`;

    const daysAgo = Math.round(hoursAgo / 24);
    if (daysAgo === 1) return StringUtil.translate('dayAgo');
    if (daysAgo < 30) return `${daysAgo} ${StringUtil.translate('daysAgo')}`;

    const monthsAgo = Math.round(daysAgo / 30);
    if (monthsAgo === 1) return StringUtil.translate('monthAgo');
    if (monthsAgo < 12)
      return `${monthsAgo} ${StringUtil.translate('monthsAgo')}`;

    const yearsAgo = Math.round(monthsAgo / 12);
    if (yearsAgo === 1) return StringUtil.translate('yearAgo');
    return `${yearsAgo} ${StringUtil.translate('yearsAgo')}`;
  };

  public static isSystemDarkMode() {
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      return true;
    } else {
      return false;
    }
  }

  public static listenToSystemDarkMode($q: QVueGlobals) {
    // Optionally, you can also add an event listener to track changes when the user switches modes
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (event) => {
        if (event.matches) {
          $q.dark.set(true);
        } else {
          $q.dark.set(false);
        }
      });
  }

  public static applyStatusBarColor($q: QVueGlobals) {
    try {
      if ($q.platform.is.cordova) {
        $q && $q.addressbarColor;
        $q.addressbarColor.set(
          getCssVar($q.dark.isActive ? 'dark' : 'secondary') || '#fff'
        );
        (window as any).StatusBar.backgroundColorByHexString(
          getCssVar($q.dark.isActive ? 'dark' : 'secondary') || '#fff'
        );
      }
    } catch (error) {}
  }

  public static getDateWithTime = (inputDate: Date) => {
    const dateObj = new Date(inputDate);
    const formattedDate =
      dateObj.getDate().toString().padStart(2, '0') +
      '/' +
      (dateObj.getMonth() + 1).toString().padStart(2, '0') +
      '/' +
      dateObj.getFullYear() +
      ' ' +
      dateObj.getHours().toString().padStart(2, '0') +
      ':' +
      dateObj.getMinutes().toString().padStart(2, '0');
    return formattedDate;
  };

  public static addTimeToDate = (now: Date, amount: number, unit: string) => {
    let dateWrapper = new DateWrapper(now);
    switch (unit) {
      case 'hour':
      case 'hours':
      case 'HOURLY':
        dateWrapper = dateWrapper.addHours(amount);
        break;
      case 'day':
      case 'days':
      case 'DAILY':
        dateWrapper = dateWrapper.addDays(amount);
        break;
      case 'week':
      case 'weeks':
      case 'WEEKLY':
        dateWrapper = dateWrapper.addDays(amount * 7);
        break;
      case 'month':
      case 'months':
      case 'MONTHLY':
        dateWrapper = dateWrapper.addDays(amount * 30);
        break;
      default:
        console.log('Invalid unit of time');
    }
    return dateWrapper.asDate();
  };

  public static getiOSDeviceType() {
    // const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (!navigator) return 'unknown';

    const userAgent = navigator?.userAgent || navigator?.vendor || ' ';

    // iPads on iOS 13 and later use a desktop-class browsing experience
    // that presents the Safari user agent string as a Mac computer.
    // This method relies on detecting touch capabilities and screen size,
    // which may not be perfectly reliable for all future devices.
    if (
      /iPad|Macintosh/.test(userAgent) &&
      navigator.maxTouchPoints &&
      navigator.maxTouchPoints > 1
    ) {
      return 'iPad';
    } else if (/iPhone/.test(userAgent)) {
      return 'iPhone';
    } else {
      return 'unknown';
    }
  }
}
