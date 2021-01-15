/* tslint:disable */

declare var Object: any;
export interface RequestrentInterface {
  "address"?: string;
  "description"?: string;
  "estiBudget"?: number;
  "rentDetail"?: Array<any>;
  "id"?: any;
  "categoryId"?: any;
  "peopleId"?: any;
  category?: any;
  people?: any;
  rentDetails?: any[];
}

export class Requestrent implements RequestrentInterface {
  "address": string;
  "description": string;
  "estiBudget": number;
  "rentDetail": Array<any>;
  "id": any;
  "categoryId": any;
  "peopleId": any;
  category: any;
  people: any;
  rentDetails: any[];
  constructor(data?: RequestrentInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Requestrent`.
   */
  public static getModelName() {
    return "Requestrent";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Requestrent for dynamic purposes.
  **/
  public static factory(data: RequestrentInterface): Requestrent{
    return new Requestrent(data);
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
      name: 'Requestrent',
      plural: 'Requestrents',
      path: 'Requestrents',
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
        "rentDetail": {
          name: 'rentDetail',
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
        people: {
          name: 'people',
          type: 'any',
          model: '',
          relationType: 'belongsTo',
                  keyFrom: 'peopleId',
          keyTo: 'id'
        },
        rentDetails: {
          name: 'rentDetails',
          type: 'any[]',
          model: '',
          relationType: 'embedsMany',
                  keyFrom: 'rentDetail',
          keyTo: 'id'
        },
      }
    }
  }
}
