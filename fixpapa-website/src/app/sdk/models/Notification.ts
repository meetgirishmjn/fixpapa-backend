/* tslint:disable */

declare var Object: any;
export interface NotificationInterface {
  "id"?: number;
}

export class Notification implements NotificationInterface {
  "id": number;
  constructor(data?: NotificationInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Notification`.
   */
  public static getModelName() {
    return "Notification";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Notification for dynamic purposes.
  **/
  public static factory(data: NotificationInterface): Notification{
    return new Notification(data);
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
      name: 'Notification',
      plural: 'Notifications',
      path: 'Notifications',
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
