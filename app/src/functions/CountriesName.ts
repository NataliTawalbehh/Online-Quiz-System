import DataObject from 'src/models/DataObject';
import ApiPath from 'src/util/ApiPath';
import ApiUtil from 'src/util/ApiUtil';
import FuncAsync from './FuncAsync';

export default class CountriesByName
  implements FuncAsync<DataObject, DataObject>
{
  async executeAsync(options?: DataObject): Promise<DataObject> {
    try {
      if (!options) {
        options = {};
      }
  
      const url = `${ApiPath.COUNTRIES_GET_BY_NAME}/${options.name}`;
      const res = await ApiUtil.get<DataObject>(url);
      return Promise.resolve(res);
    } catch (error) {
      console.error('Error - ' + JSON.stringify(error) + error);
      return Promise.reject(error);
    }
  }
}
