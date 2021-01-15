/* tslint:disable */

declare var Object: any;
export interface NewpurchaseInterface {
  "productsIds"?: Array<any>;
  "name"?: string;
  "configuration"?: string;
  "image": string;
  "id"?: number;
  products?: any[];
}

export class Newpurchase implements NewpurchaseInterface {
  "productsIds": Array<any>;
  "name": string;
  "configuration": string;
  "image": string;
  "id": number;
  products: any[];
  constructor(data?: NewpurchaseInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Newpurchase`.
   */
  public static getModelName() {
    return "Newpurchase";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Newpurchase for dynamic purposes.
  **/
  public static factory(data: NewpurchaseInterface): Newpurchase{
    return new Newpurchase(data);
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
      name: 'Newpurchase',
      plural: 'Newpurchases',
      path: 'Newpurchases',
      idName: 'id',
      properties: {
        "productsIds": {
          name: 'productsIds',
          type: 'Array&lt;any&gt;',
          default: <any>[]
        },
        "name": {
          name: 'name',
          type: 'string'
        },
        "configuration": {
          name: 'configuration',
          type: 'string'
        },
        "image": {
          name: 'image',
          type: 'string'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
      },
      relations: {
        products: {
          name: 'products',
          type: 'any[]',
          model: '',
          relationType: 'referencesMany',
                  keyFrom: 'productsIds',
          keyTo: 'id'
        },
      }
    }
  }
}
