/* tslint:disable */

declare var Object: any;
export interface RequestamcInterface {
  "address"?: string;
  "description"?: string;
  "estiBudget"?: number;
  "amcDetail"?: Array<any>;
  "id"?: any;
  "categoryId"?: any;
  "amcId"?: any;
  "peopleId"?: any;
  category?: any;
  amc?: any;
  people?: any;
  amcDetails?: any[];
}

export class Requestamc implements RequestamcInterface {
  "address": string;
  "description": string;
  "estiBudget": number;
  "amcDetail": Array<any>;
  "id": any;
  "categoryId": any;
  "amcId": any;
  "peopleId": any;
  category: any;
  amc: any;
  people: any;
  amcDetails: any[];
  constructor(data?: RequestamcInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Requestamc`.
   */
  public static getModelName() {
    return "Requestamc";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Requestamc for dynamic purposes.
  **/
  public static factory(data: RequestamcInterface): Requestamc{
    return new Requestamc(data);
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
      name: 'Requestamc',
      plural: 'Requestamcs',
      path: 'Requestamcs',
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
        "estiBudget": {
          name: 'estiBudget',
          type: 'number',
          default: 0
        },
        "amcDetail": {
          name: 'amcDetail',
          type: 'Array&lt;any&gt;',
          default: <any>[]
        },
        "id": {
          name: 'id',
          type: 'any'
        },
        "categoryId": {
          name: 'categoryId',
          type: 'any'
        },
        "amcId": {
          name: 'amcId',
          type: 'any'
        },
        "peopleId": {
          name: 'peopleId',
          type: 'any'
        },
      },
      relations: {
        category: {
          name: 'category',
          type: 'any',
          model: '',
          relationType: 'belongsTo',
                  keyFrom: 'categoryId',
          keyTo: 'id'
        },
        amc: {
          name: 'amc',
          type: 'any',
          model: '',
          relationType: 'belongsTo',
                  keyFrom: 'amcId',
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
        amcDetails: {
          name: 'amcDetails',
          type: 'any[]',
          model: '',
          relationType: 'embedsMany',
                  keyFrom: 'amcDetail',
          keyTo: 'id'
        },
      }
    }
  }
}
