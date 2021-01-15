/* tslint:disable */

declare var Object: any;
export interface AMCInterface {
  "name": string;
  "noOfUnits": Array<any>;
  "categoryIds"?: Array<any>;
  "image": string;
  "id"?: any;
  category?: any[];
}

export class AMC implements AMCInterface {
  "name": string;
  "noOfUnits": Array<any>;
  "categoryIds": Array<any>;
  "image": string;
  "id": any;
  category: any[];
  constructor(data?: AMCInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `AMC`.
   */
  public static getModelName() {
    return "AMC";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of AMC for dynamic purposes.
  **/
  public static factory(data: AMCInterface): AMC{
    return new AMC(data);
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
      name: 'AMC',
      plural: 'AMCs',
      path: 'AMCs',
      idName: 'id',
      properties: {
        "name": {
          name: 'name',
          type: 'string'
        },
        "noOfUnits": {
          name: 'noOfUnits',
          type: 'Array&lt;any&gt;'
        },
        "categoryIds": {
          name: 'categoryIds',
          type: 'Array&lt;any&gt;',
          default: <any>[]
        },
        "image": {
          name: 'image',
          type: 'string'
        },
        "id": {
          name: 'id',
          type: 'any'
        },
      },
      relations: {
        category: {
          name: 'category',
          type: 'any[]',
          model: '',
          relationType: 'referencesMany',
                  keyFrom: 'categoryIds',
          keyTo: 'id'
        },
      }
    }
  }
}
