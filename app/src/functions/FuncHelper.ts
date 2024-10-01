import DataObject from 'src/models/DataObject';
import PartnersFunc from './PartnersFunc';
import FuncAsync from './FuncAsync';
import ApiPath from 'src/util/ApiPath';

export default class FuncHelper {
  public static async load(
    key: string,
    options?: DataObject
  ): Promise<Array<DataObject> | DataObject | any> {
    try {
      let fun: FuncAsync<DataObject, DataObject>;
      switch (key) {
        case ApiPath.HYPER_PAY:
          return Promise.resolve([]);
        case ApiPath.PARTNERS:
        default:
          fun = new PartnersFunc();
      }
      if (fun) {
        return await fun.executeAsync(options);
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
