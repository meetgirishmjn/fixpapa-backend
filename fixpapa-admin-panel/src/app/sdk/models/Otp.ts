/* tslint:disable */

declare var Object: any;
export interface OtpInterface {
  "id"?: any;
}

export class Otp implements OtpInterface {
  "id": any;
  constructor(data?: OtpInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Otp`.
   */
  public static getModelName() {
    return "Otp";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Otp for dynamic purposes.
  **/
  public static factory(data: OtpInterface): Otp{
    return new Otp(data);
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
      name: 'Otp',
      plural: 'Otps',
      path: 'Otps',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'any'
        },
      },
      relations: {
      }
    }
  }
}
