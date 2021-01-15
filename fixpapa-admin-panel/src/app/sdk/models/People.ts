/* tslint:disable */

declare var Object: any;
export interface PeopleInterface {
  "startTime"?: any;
  "endTime"?: any;
  "supportDays"?: Array<any>;
  "active"?: boolean;
  "isAvailable"?: boolean;
  "addresses"?: Array<any>;
  "image"?: string;
  "mobile"?: string;
  "newNotification"?: number;
  "isProfileComplete"?: boolean;
  "gstNumber"?: string;
  "companyName"?: string;
  "rating"?: any;
  "address"?: string;
  "realm"?: string;
  "username"?: string;
  "email"?: string;
  "emailVerified"?: boolean;
  "id"?: any;
  "servicesIds"?: Array<any>;
  "expertiseIds"?: Array<any>;
  "newpurchaseIds"?: Array<any>;
  "password"?: string;
  accessTokens?: any[];
  services?: any[];
  expertise?: any[];
  newpurchase?: any[];
  requestjob?: any[];
  roleMappings?: any[];
  identities?: any[];
  credentials?: any[];
}

export class People implements PeopleInterface {
  "startTime": any;
  "endTime": any;
  "supportDays": Array<any>;
  "active": boolean;
  "isAvailable": boolean;
  "addresses": Array<any>;
  "image": string;
  "mobile": string;
  "newNotification": number;
  "isProfileComplete": boolean;
  "gstNumber": string;
  "companyName": string;
  "rating": any;
  "address": string;
  "realm": string;
  "username": string;
  "email": string;
  "emailVerified": boolean;
  "id": any;
  "servicesIds": Array<any>;
  "expertiseIds": Array<any>;
  "newpurchaseIds": Array<any>;
  "password": string;
  accessTokens: any[];
  services: any[];
  expertise: any[];
  newpurchase: any[];
  requestjob: any[];
  roleMappings: any[];
  identities: any[];
  credentials: any[];
  constructor(data?: PeopleInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `People`.
   */
  public static getModelName() {
    return "People";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of People for dynamic purposes.
  **/
  public static factory(data: PeopleInterface): People{
    return new People(data);
  }
  /**
  * @method getModelDefinition
  * @author Julien Ledun
  * @license MIT
  * This method returns an object that represents some of the model
  * definitions.
  **/
  public static getModelDefinition() {
    return {
      name: 'People',
      plural: 'People',
      path: 'People',
      idName: 'id',
      properties: {
        "startTime": {
          name: 'startTime',
          type: 'any',
          default: <any>null
        },
        "endTime": {
          name: 'endTime',
          type: 'any',
          default: <any>null
        },
        "supportDays": {
          name: 'supportDays',
          type: 'Array&lt;any&gt;'
        },
        "active": {
          name: 'active',
          type: 'boolean',
          default: true
        },
        "isAvailable": {
          name: 'isAvailable',
          type: 'boolean',
          default: true
        },
        "addresses": {
          name: 'addresses',
          type: 'Array&lt;any&gt;',
          default: <any>[]
        },
        "image": {
          name: 'image',
          type: 'string',
          default: ''
        },
        "mobile": {
          name: 'mobile',
          type: 'string',
          default: ''
        },
        "newNotification": {
          name: 'newNotification',
          type: 'number',
          default: 0
        },
        "isProfileComplete": {
          name: 'isProfileComplete',
          type: 'boolean',
          default: true
        },
        "gstNumber": {
          name: 'gstNumber',
          type: 'string',
          default: ''
        },
        "companyName": {
          name: 'companyName',
          type: 'string',
          default: ''
        },
        "rating": {
          name: 'rating',
          type: 'any',
          default: <any>null
        },
        "address": {
          name: 'address',
          type: 'string',
          default: ''
        },
        "realm": {
          name: 'realm',
          type: 'string'
        },
        "username": {
          name: 'username',
          type: 'string'
        },
        "email": {
          name: 'email',
          type: 'string'
        },
        "emailVerified": {
          name: 'emailVerified',
          type: 'boolean'
        },
        "id": {
          name: 'id',
          type: 'any'
        },
        "servicesIds": {
          name: 'servicesIds',
          type: 'Array&lt;any&gt;',
          default: <any>[]
        },
        "expertiseIds": {
          name: 'expertiseIds',
          type: 'Array&lt;any&gt;',
          default: <any>[]
        },
        "newpurchaseIds": {
          name: 'newpurchaseIds',
          type: 'Array&lt;any&gt;',
          default: <any>[]
        },
        "password": {
          name: 'password',
          type: 'string'
        },
      },
      relations: {
        accessTokens: {
          name: 'accessTokens',
          type: 'any[]',
          model: '',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'userId'
        },
        services: {
          name: 'services',
          type: 'any[]',
          model: '',
          relationType: 'referencesMany',
                  keyFrom: 'servicesIds',
          keyTo: 'id'
        },
        expertise: {
          name: 'expertise',
          type: 'any[]',
          model: '',
          relationType: 'referencesMany',
                  keyFrom: 'expertiseIds',
          keyTo: 'id'
        },
        newpurchase: {
          name: 'newpurchase',
          type: 'any[]',
          model: '',
          relationType: 'referencesMany',
                  keyFrom: 'newpurchaseIds',
          keyTo: 'id'
        },
        requestjob: {
          name: 'requestjob',
          type: 'any[]',
          model: '',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'peopleId'
        },
        roleMappings: {
          name: 'roleMappings',
          type: 'any[]',
          model: '',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'principalId'
        },
        identities: {
          name: 'identities',
          type: 'any[]',
          model: '',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'peopleId'
        },
        credentials: {
          name: 'credentials',
          type: 'any[]',
          model: '',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'peopleId'
        },
      }
    }
  }
}
