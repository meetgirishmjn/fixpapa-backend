/* tslint:disable */

declare var Object: any;
export interface NotificationInterface {
  "id"?: any;
  "peopleId"?: any;
  "creatorId"?: any;
  "requestjobId"?: any;
  people?: any;
  creator?: any;
  requestjob?: any;
  accessTokens?: any[];
}

export class Notification implements NotificationInterface {
  "id": any;
  "peopleId": any;
  "creatorId": any;
  "requestjobId": any;
  people: any;
  creator: any;
  requestjob: any;
  accessTokens: any[];
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
          type: 'any'
        },
        "peopleId": {
          name: 'peopleId',
          type: 'any'
        },
        "creatorId": {
          name: 'creatorId',
          type: 'any'
        },
        "requestjobId": {
          name: 'requestjobId',
          type: 'any'
        },
      },
      relations: {
        people: {
          name: 'people',
          type: 'any',
          model: '',
          relationType: 'belongsTo',
                  keyFrom: 'peopleId',
          keyTo: 'id'
        },
        creator: {
          name: 'creator',
          type: 'any',
          model: '',
          relationType: 'belongsTo',
                  keyFrom: 'creatorId',
          keyTo: 'id'
        },
        requestjob: {
          name: 'requestjob',
          type: 'any',
          model: '',
          relationType: 'belongsTo',
                  keyFrom: 'requestjobId',
          keyTo: 'id'
        },
        accessTokens: {
          name: 'accessTokens',
          type: 'any[]',
          model: '',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'notificationId'
        },
      }
    }
  }
}
