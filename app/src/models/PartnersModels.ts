import DataObject from './DataObject';

export interface GetPartnersModel extends SavePartnersModel {
  name: string;
  representativeName: string;
  email: string;
  tel: string;
  address: string;
  addressDetails: string;
  location: string;
  active: boolean;
  settings: string;
}

export interface SavePartnersModel extends DataObject {
  id?: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
}
