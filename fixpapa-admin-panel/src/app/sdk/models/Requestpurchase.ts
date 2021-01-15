/* tslint:disable */

declare var Object: any;
export interface RequestpurchaseInterface {
  "modelNumber": string;
  "noOfUnits": number;
  "configuration"?: string;
  "priceBudget"?: number;
  "values"?: Array<any>;
  "title"?: string;
  "deliveryAdd"?: string;
  "modeOfPayment": string;
  "other"?: string;
  "purchaseDate"?: Date;
  "id"?: any;
  "newpurchaseId"?: any;
  "peopleId"?: any;
  "productId"?: any;
  "brandId"?: any;
  newpurchase?: any;
  people?: any;
  product?: any;
  brand?: any;
}

export class Requestpurchase implements RequestpurchaseInterface {
  "modelNumber": string;
  "noOfUnits": number;
  "configuration": string;
  "priceBudget": number;
  "values": Array<any>;
  "title": string;
  "deliveryAdd": string;
  "modeOfPayment": string;
  "other": string;
  "purchaseDate": Date;
  "id": any;
  "newpurchaseId": any;
  "peopleId": any;
  "productId": any;
  "brandId": any;
  newpurchase: any;
  people: any;
  product: any;
  brand: any;
  constructor(data?: RequestpurchaseInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Requestpurchase`.
   */
  public static getModelName() {
    return "Requestpurchase";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Requestpurchase for dynamic purposes.
  **/
  public static factory(data: RequestpurchaseInterface): Requestpurchase{
    return new Requestpurchase(data);
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
      name: 'Requestpurchase',
      plural: 'Requestpurchases',
      path: 'Requestpurchases',
      idName: 'id',
      properties: {
        "modelNumber": {
          name: 'modelNumber',
          type: 'string'
        },
        "noOfUnits": {
          name: 'noOfUnits',
          type: 'number'
        },
        "configuration": {
          name: 'configuration',
          type: 'string',
          default: ''
        },
        "priceBudget": {
          name: 'priceBudget',
          type: 'number',
          default: 0
        },
        "values": {
          name: 'values',
          type: 'Array&lt;any&gt;',
          default: <any>[]
        },
        "title": {
          name: 'title',
          type: 'string',
          default: ''
        },
        "deliveryAdd": {
          name: 'deliveryAdd',
          type: 'string',
          default: ''
        },
        "modeOfPayment": {
          name: 'modeOfPayment',
          type: 'string'
        },
        "other": {
          name: 'other',
          type: 'string',
          default: ''
        },
        "purchaseDate": {
          name: 'purchaseDate',
          type: 'Date',
          default: new Date(0)
        },
        "id": {
          name: 'id',
          type: 'any'
        },
        "newpurchaseId": {
          name: 'newpurchaseId',
          type: 'any'
        },
        "peopleId": {
          name: 'peopleId',
          type: 'any'
        },
        "productId": {
          name: 'productId',
          type: 'any'
        },
        "brandId": {
          name: 'brandId',
          type: 'any'
        },
      },
      relations: {
        newpurchase: {
          name: 'newpurchase',
          type: 'any',
          model: '',
          relationType: 'belongsTo',
                  keyFrom: 'newpurchaseId',
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
        product: {
          name: 'product',
          type: 'any',
          model: '',
          relationType: 'belongsTo',
                  keyFrom: 'productId',
          keyTo: 'id'
        },
        brand: {
          name: 'brand',
          type: 'any',
          model: '',
          relationType: 'belongsTo',
                  keyFrom: 'brandId',
          keyTo: 'id'
        },
      }
    }
  }
}
