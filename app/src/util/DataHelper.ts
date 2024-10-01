import DataObject from 'src/models/DataObject';
import { FileModel } from 'src/models/FileModel';
import ApiUtil from './ApiUtil';

export default class DataHelper {
  public static async getData<T extends DataObject>(source: string) {
    const res = await ApiUtil.get<T[]>(source);
    return res;
  }

  //upload

  public static async upload(
    source: FileModel,
    path: string
  ): Promise<DataObject[]> {
    if (source instanceof File) {
      const data = new FormData();
      data.append('file', source as File);
      const res = await ApiUtil.upload(path, data);
      return Promise.resolve([res as DataObject]);
    } else if (source as FileList) {
      const result = await Promise.all(
        DataHelper.fileListToArray(source as FileList).map(async (file) => {
          const data = new FormData();
          data.append('file', file as File);
          const res = await ApiUtil.upload(path, data);
          return res as DataObject;
        })
      );
      return Promise.resolve(result);
    }
    return Promise.reject(new Error('Invalid file'));
  }

  public static fileListToArray(fileList: FileList): File[] {
    const filesArray: File[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      filesArray.push(file);
    }

    return filesArray;
  }
}
