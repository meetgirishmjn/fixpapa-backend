/* tslint:disable */

declare var Object: any;
export interface RequestbidInterface {
  "address"?: string;
  "description"?: string;
  "startDate"?: Date;
  "endDate"?: Date;
  "estiBudget"?: number;
  "bidDetail"?: Array<any>;
  "id"?: any;
  "bidId"?: any;
  "servicesId"?: any;
  "peopleId"?: any;
  bid?: any;
  services?: any;
  people?: any;
  bidDetails?: any[];
}

export class Requestbid implements RequestbidInterface {
  "address": string;
  "description": string;
  "startDate": Date;
  "endDate": Date;
  "estiBudget": number;
  "bidDetail": Array<any>;
  "id": any;
  "bidId": any;
  "servicesId": any;
  "peopleId": any;
  bid: any;
  services: any;
  people: any;
  bidDetails: any[];
  constructor(data?: RequestbidInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Requestbid`.
   */
  public static getModelName() {
    return "Requestbid";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Requestbid for dynamic purposes.
  **/
  public static factory(data: RequestbidInterface): Requestbid{
    return new Requestbid(data);
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
      name: 'Requestbid',
      plural: 'Requestbids',
      path: 'Requestbids',
      idName: 'id',
      properties: {
        "address": {
          name: 'address',
          type: 'string',
          default: ''
        },
        "description": {
          name: 'description',
          type: 'string',
          default: ''
        },
        "startDate": {
          name: 'startDate',
          type: 'Date',
          default: new Date(0)
        },
        "endDate": {
          name: 'endDate',
          type: 'Date',
          default: new Date(0)
        },
        "estiBudget": {
          name: 'estiBudget',
          type: 'number',
          default: 0
        },
        "bidDetail": {
          name: 'bidDetail',
          type: 'Array&lt;any&gt;',
          default: <any>[]
        },
        "id": {
          name: 'id',
          type: 'any'
        },
        "bidId": {
          name: 'bidId',
          type: 'any'
        },
        "servicesId": {
          name: 'servicesId',
          type: 'any'
        },
        "peopleId": {
          name: 'peopleId',
          type: 'any'
        },
      },
      relations: {
        bid: {
          name: 'bid',
          type: 'any',
          model: '',
          relationType: 'belongsTo',
                  keyFrom: 'bidId',
          keyTo: 'id'
        },
        services: {
          name: 'services',
          type: 'any',
          model: '',
          relationType: 'belongsTo',
                  keyFrom: 'servicesId',
          keyTo: 'id'
        },
        people: {
          name: 'people',
          type: 'any',
          model: '',
          relationType: 'belongsTo',
                  keyFrom: 'peopleId',
          keyTo: 'id'
        },
        bidDetails: {
          name: 'bidDetails',
          type: 'any[]',
          model: '',
          relationType: 'embedsMany',
                  keyFrom: 'bidDetail',
          keyTo: 'id'
        },
      }
    }
  }
}
