/* tslint:disable */

declare var Object: any;
export interface ServicesInterface {
  "id"?: number;
}

export class Services implements ServicesInterface {
  "id": number;
  constructor(data?: ServicesInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Services`.
   */
  public static getModelName() {
    return "Services";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Services for dynamic purposes.
  **/
  public static factory(data: ServicesInterface): Services{
    return new Services(data);
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
      name: 'Services',
      plural: 'Services',
      path: 'Services',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
