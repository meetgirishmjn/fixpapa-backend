/* tslint:disable */

declare var Object: any;
export interface CategoryInterface {
  "isAvailableForRent"?: boolean;
  "image": string;
  "deleted"?: boolean;
  "id"?: any;
  "productsIds"?: Array<any>;
  problems?: any[];
  products?: any[];
}

export class Category implements CategoryInterface {
  "isAvailableForRent": boolean;
  "image": string;
  "deleted": boolean;
  "id": any;
  "productsIds": Array<any>;
  problems: any[];
  products: any[];
  constructor(data?: CategoryInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Category`.
   */
  public static getModelName() {
    return "Category";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Category for dynamic purposes.
  **/
  public static factory(data: CategoryInterface): Category{
    return new Category(data);
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
      name: 'Category',
      plural: 'Categories',
      path: 'Categories',
      idName: 'id',
      properties: {
        "isAvailableForRent": {
          name: 'isAvailableForRent',
          type: 'boolean',
          default: false
        },
        "image": {
          name: 'image',
          type: 'string'
        },
        "deleted": {
          name: 'deleted',
          type: 'boolean',
          default: false
        },
        "id": {
          name: 'id',
          type: 'any'
        },
        "productsIds": {
          name: 'productsIds',
          type: 'Array&lt;any&gt;',
          default: <any>[]
        },
      },
      relations: {
        problems: {
          name: 'problems',
          type: 'any[]',
          model: '',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'categoryId'
        },
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
