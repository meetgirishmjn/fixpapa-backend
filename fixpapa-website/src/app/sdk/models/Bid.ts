/* tslint:disable */

declare var Object: any;
export interface BidInterface {
  "name": string;
  "servicesIds"?: Array<any>;
  "noOfSystems": Array<any>;
  "image": string;
  "id"?: number;
  services?: any[];
}

export class Bid implements BidInterface {
  "name": string;
  "servicesIds": Array<any>;
  "noOfSystems": Array<any>;
  "image": string;
  "id": number;
  services: any[];
  constructor(data?: BidInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Bid`.
   */
  public static getModelName() {
    return "Bid";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Bid for dynamic purposes.
  **/
  public static factory(data: BidInterface): Bid{
    return new Bid(data);
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
      name: 'Bid',
      plural: 'Bids',
      path: 'Bids',
      idName: 'id',
      properties: {
        "name": {
          name: 'name',
          type: 'string'
        },
        "servicesIds": {
          name: 'servicesIds',
          type: 'Array&lt;any&gt;',
          default: <any>[]
        },
        "noOfSystems": {
          name: 'noOfSystems',
          type: 'Array&lt;any&gt;'
        },
        "image": {
          name: 'image',
          type: 'string',
          default: ''
        },
        "id": {
          name: 'id',
          type: 'number'
        },
      },
      relations: {
        services: {
          name: 'services',
          type: 'any[]',
          model: '',
          relationType: 'referencesMany',
                  keyFrom: 'servicesIds',
          keyTo: 'id'
        },
      }
    }
  }
}
