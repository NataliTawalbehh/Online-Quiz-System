export default interface DataObject {
  [key: string]:
    | number
    | string
    | boolean
    | DataObject
    | DataObject[]
    | undefined
    | null
    | Date
    | symbol
    | bigint
    | Array<any>
    | File
    | FileList
    | Blob
    | any;
}
