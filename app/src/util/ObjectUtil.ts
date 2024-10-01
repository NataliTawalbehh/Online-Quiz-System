import DataObject from 'src/models/DataObject';

export type UndefinedObject<T extends Record<string, unknown>> = {
  [K in keyof T]: undefined;
};

export default class ObjectUtil {
  public static appendArrayOrReplaceById(
    arr: Array<DataObject>,
    data: Array<DataObject>
  ) {
    if (data) data.forEach((item) => ObjectUtil.appendOrReplaceById(arr, item));
  }
  public static appendOrReplaceById(arr: Array<DataObject>, obj: DataObject) {
    const index = arr.findIndex((x) => x.id === obj.id);
    if (index === -1) {
      arr.push(obj);
    } else {
      arr[index] = obj;
    }
  }

  public static removeById(arr: Array<DataObject>, id: string) {
    const index = arr.findIndex((x) => x.id === id);
    if (index !== -1) {
      arr.splice(index, 1);
    }
  }

  public static fillObjectBasedonTargetKeys(source: any, target: any) {
    if (!target) return;
    const targetKeys: string[] = Object.keys(target);
    for (const key of targetKeys) {
      target[key] = source[key];
    }
  }

  public static fillObject(source: any, target: any, clearSource = true) {
    if (source && target) {
      if (clearSource) {
        Object.keys(source).forEach((key) => {
          delete source[key];
        });
      }
      Object.keys(source).forEach((key) => {
        target[key] = source[key];
      });
    }
  }

  //cloneObject
  public static cloneObject(obj: any) {
    return JSON.parse(JSON.stringify(obj)); // Todo: use structuredClone for deep clone
  }

  public static clearObjectValues<T extends Record<string, unknown>>(
    obj: T
  ): UndefinedObject<T> {
    const keys = Object.keys(obj) as (keyof T)[];
    const result: Partial<UndefinedObject<T>> = {};

    for (const key of keys) {
      result[key] = undefined;
    }

    return result as UndefinedObject<T>;
  }

  // is Reactive Object Empty
  public static isReactiveObjectEmpty = (obj: any) => {
    return Object.keys(obj).length === 0;
  };
}
