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

      const url = ApiPath.RECIPES_GET;
      const res = await ApiUtil.get<DataObject>(url);
      return Promise.resolve(res);
    } catch (error) {
      // Log any errors that occur during execution.
      console.error('Error - ' + JSON.stringify(error));
      // Return a rejected Promise with the error.
      return Promise.reject(error);
    }
  }
}
