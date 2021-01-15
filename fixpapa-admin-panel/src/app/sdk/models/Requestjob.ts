/* tslint:disable */

declare var Object: any;
export interface RequestjobInterface {
  "image"?: Array<any>;
  "address"?: any;
  "totalPrice"?: number;
  "problemDes"?: string;
  "startDate"?: Date;
  "endDate"?: Date;
  "problems"?: Array<any>;
  "statusArr"?: Array<any>;
  "orderId"?: string;
  "id"?: any;
  "categoryId"?: any;
  "productId"?: any;
  "brandId"?: any;
  "customerId"?: any;
  "vendorId"?: any;
  "engineerId"?: any;
  "peopleId"?: any;
  "ratedetail"?: Array<any>;
  category?: any;
  product?: any;
  brand?: any;
  customer?: any;
  vendor?: any;
  engineer?: any;
  people?: any;
  ratedetails?: any[];
}

export class Requestjob implements RequestjobInterface {
  "image": Array<any>;
  "address": any;
  "totalPrice": number;
  "problemDes": string;
  "startDate": Date;
  "endDate": Date;
  "problems": Array<any>;
  "statusArr": Array<any>;
  "orderId": string;
  "id": any;
  "categoryId": any;
  "productId": any;
  "brandId": any;
  "customerId": any;
  "vendorId": any;
  "engineerId": any;
  "peopleId": any;
  "ratedetail": Array<any>;
  category: any;
  product: any;
  brand: any;
  customer: any;
  vendor: any;
  engineer: any;
  people: any;
  ratedetails: any[];
  constructor(data?: RequestjobInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Requestjob`.
   */
  public static getModelName() {
    return "Requestjob";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Requestjob for dynamic purposes.
  **/
  public static factory(data: RequestjobInterface): Requestjob{
    return new Requestjob(data);
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
      name: 'Requestjob',
      plural: 'Requestjobs',
      path: 'Requestjobs',
      idName: 'id',
      properties: {
        "image": {
          name: 'image',
          type: 'Array&lt;any&gt;',
          default: <any>[]
        },
        "address": {
          name: 'address',
          type: 'any',
          default: <any>null
        },
        "totalPrice": {
          name: 'totalPrice',
          type: 'number',
          default: 0
        },
        "problemDes": {
          name: 'problemDes',
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
        "problems": {
          name: 'problems',
          type: 'Array&lt;any&gt;',
          default: <any>[]
        },
        "statusArr": {
          name: 'statusArr',
          type: 'Array&lt;any&gt;'
        },
        "orderId": {
          name: 'orderId',
          type: 'string',
          default: ''
        },
        "id": {
          name: 'id',
          type: 'any'
        },
        "categoryId": {
          name: 'categoryId',
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
        "customerId": {
          name: 'customerId',
          type: 'any'
        },
        "vendorId": {
          name: 'vendorId',
          type: 'any'
        },
        "engineerId": {
          name: 'engineerId',
          type: 'any'
        },
        "peopleId": {
          name: 'peopleId',
          type: 'any'
        },
        "ratedetail": {
          name: 'ratedetail',
          type: 'Array&lt;any&gt;',
          default: <any>[]
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
        customer: {
          name: 'customer',
          type: 'any',
          model: '',
          relationType: 'belongsTo',
                  keyFrom: 'customerId',
          keyTo: 'id'
        },
        vendor: {
          name: 'vendor',
          type: 'any',
          model: '',
          relationType: 'belongsTo',
                  keyFrom: 'vendorId',
          keyTo: 'id'
        },
        engineer: {
          name: 'engineer',
          type: 'any',
          model: '',
          relationType: 'belongsTo',
                  keyFrom: 'engineerId',
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
        ratedetails: {
          name: 'ratedetails',
          type: 'any[]',
          model: '',
          relationType: 'embedsMany',
                  keyFrom: 'ratedetail',
          keyTo: 'id'
        },
      }
    }
  }
}
