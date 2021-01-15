/* tslint:disable */

declare var Object: any;
export interface RequestamcInterface {
  "amcDetail"?: Array<any>;
  "address"?: any;
  "id"?: number;
  "categoryId"?: number;
  "aMCId"?: number;
  "peopleId"?: number;
  category?: any;
  aMC?: any;
  people?: any;
}

export class Requestamc implements RequestamcInterface {
  "amcDetail": Array<any>;
  "address": any;
  "id": number;
  "categoryId": number;
  "aMCId": number;
  "peopleId": number;
  category: any;
  aMC: any;
  people: any;
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
        "amcDetail": {
          name: 'amcDetail',
          type: 'Array&lt;any&gt;',
          default: <any>[]
        },
        "address": {
          name: 'address',
          type: 'any',
          default: <any>null
        },
        "id": {
          name: 'id',
          type: 'number'
        },
        "categoryId": {
          name: 'categoryId',
          type: 'number'
        },
        "aMCId": {
          name: 'aMCId',
          type: 'number'
        },
        "peopleId": {
          name: 'peopleId',
          type: 'number'
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
        aMC: {
          name: 'aMC',
          type: 'any',
          model: '',
          relationType: 'belongsTo',
                  keyFrom: 'aMCId',
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
      }
    }
  }
}
