/* tslint:disable */

declare var Object: any;
export interface ProductsInterface {
  "name": string;
  "values"?: Array<any>;
  "brandIds"?: Array<any>;
  "id"?: number;
  "categoryId"?: number;
  category?: any;
  brand?: any[];
}

export class Products implements ProductsInterface {
  "name": string;
  "values": Array<any>;
  "brandIds": Array<any>;
  "id": number;
  "categoryId": number;
  category: any;
  brand: any[];
  constructor(data?: ProductsInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Products`.
   */
  public static getModelName() {
    return "Products";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Products for dynamic purposes.
  **/
  public static factory(data: ProductsInterface): Products{
    return new Products(data);
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
      name: 'Products',
      plural: 'Products',
      path: 'Products',
      idName: 'id',
      properties: {
        "name": {
          name: 'name',
          type: 'string'
        },
        "values": {
          name: 'values',
          type: 'Array&lt;any&gt;'
        },
        "brandIds": {
          name: 'brandIds',
          type: 'Array&lt;any&gt;',
          default: <any>[]
        },
        "id": {
          name: 'id',
          type: 'number'
        },
        "categoryId": {
          name: 'categoryId',
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
        brand: {
          name: 'brand',
          type: 'any[]',
          model: '',
          relationType: 'referencesMany',
                  keyFrom: 'brandIds',
          keyTo: 'id'
        },
      }
    }
  }
}
