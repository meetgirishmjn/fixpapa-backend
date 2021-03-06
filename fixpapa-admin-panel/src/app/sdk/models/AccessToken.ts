/* tslint:disable */
import {
  User
} from '../index';

declare var Object: any;
export interface AccessTokenInterface {
  "id"?: string;
  "ttl"?: number;
  "scopes"?: Array<any>;
  "created"?: Date;
  "userId"?: any;
  user?: User;
}

export class AccessToken implements AccessTokenInterface {
  "id": string;
  "ttl": number;
  "scopes": Array<any>;
  "created": Date;
  "userId": any;
  user: User;
  constructor(data?: AccessTokenInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `AccessToken`.
   */
  public static getModelName() {
    return "AccessToken";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of AccessToken for dynamic purposes.
  **/
  public static factory(data: AccessTokenInterface): AccessToken{
    return new AccessToken(data);
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
      name: 'AccessToken',
      plural: 'AccessTokens',
      path: 'AccessTokens',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'string'
        },
        "ttl": {
          name: 'ttl',
          type: 'number',
          default: 1209600
        },
        "scopes": {
          name: 'scopes',
          type: 'Array&lt;any&gt;'
        },
        "created": {
          name: 'created',
          type: 'Date'
        },
        "userId": {
          name: 'userId',
          type: 'any'
        },
        "notificationId": {
          name: 'notificationId',
          type: 'any'
        },
      },
      relations: {
        user: {
          name: 'user',
          type: 'User',
          model: 'User',
          relationType: 'belongsTo',
                  keyFrom: 'userId',
          keyTo: 'id'
        },
      }
    }
  }
}
