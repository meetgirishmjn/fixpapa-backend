/* tslint:disable */

declare var Object: any;
export interface BrandInterface {
  "id"?: any;
  "categoryId"?: any;
  category?: any;
}

export class Brand implements BrandInterface {
  "id": any;
  "categoryId": any;
  category: any;
  constructor(data?: BrandInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Brand`.
   */
  public static getModelName() {
    return "Brand";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Brand for dynamic purposes.
  **/
  public static factory(data: BrandInterface): Brand{
    return new Brand(data);
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
      name: 'Brand',
      plural: 'Brands',
      path: 'Brands',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'any'
        },
        "categoryId": {
          name: 'categoryId',
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
      }
    }
  }
}
