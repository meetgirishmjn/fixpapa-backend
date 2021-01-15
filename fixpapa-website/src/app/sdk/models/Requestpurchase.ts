/* tslint:disable */
import {
  GeoPoint
} from '../index';

declare var Object: any;
export interface RequestpurchaseInterface {
  "modelNumber": string;
  "noOfUnits": string;
  "configuration": string;
  "priceBudget": number;
  "deliveryAdd": GeoPoint;
  "modeOfPayment": string;
  "id"?: number;
  "newpurchaseId"?: number;
  newpurchase?: any;
}

export class Requestpurchase implements RequestpurchaseInterface {
  "modelNumber": string;
  "noOfUnits": string;
  "configuration": string;
  "priceBudget": number;
  "deliveryAdd": GeoPoint;
  "modeOfPayment": string;
  "id": number;
  "newpurchaseId": number;
  newpurchase: any;
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
          type: 'string'
        },
        "configuration": {
          name: 'configuration',
          type: 'string'
        },
        "priceBudget": {
          name: 'priceBudget',
          type: 'number'
        },
        "deliveryAdd": {
          name: 'deliveryAdd',
          type: 'GeoPoint'
        },
        "modeOfPayment": {
          name: 'modeOfPayment',
          type: 'string'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
        "newpurchaseId": {
          name: 'newpurchaseId',
          type: 'number'
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
      }
    }
  }
}
