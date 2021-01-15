/* tslint:disable */

declare var Object: any;
export interface RequestbidInterface {
  "id"?: number;
  "bidId"?: number;
  "servicesId"?: number;
  bid?: any;
  services?: any;
}

export class Requestbid implements RequestbidInterface {
  "id": number;
  "bidId": number;
  "servicesId": number;
  bid: any;
  services: any;
  constructor(data?: RequestbidInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Requestbid`.
   */
  public static getModelName() {
    return "Requestbid";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Requestbid for dynamic purposes.
  **/
  public static factory(data: RequestbidInterface): Requestbid{
    return new Requestbid(data);
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
      name: 'Requestbid',
      plural: 'Requestbids',
      path: 'Requestbids',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "bidId": {
          name: 'bidId',
          type: 'number'
        },
        "servicesId": {
          name: 'servicesId',
          type: 'number'
        },
      },
      relations: {
        bid: {
          name: 'bid',
          type: 'any',
          model: '',
          relationType: 'belongsTo',
                  keyFrom: 'bidId',
          keyTo: 'id'
        },
        services: {
          name: 'services',
          type: 'any',
          model: '',
          relationType: 'belongsTo',
                  keyFrom: 'servicesId',
          keyTo: 'id'
        },
      }
    }
  }
}
