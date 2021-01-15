/* tslint:disable */

declare var Object: any;
export interface RatingInterface {
  "userRating"?: number;
  "id"?: any;
  "requestjobId"?: any;
  "providerId"?: any;
  "peopleId"?: any;
  "_ratedetails"?: Array<any>;
  requestjob?: any;
  provider?: any;
  people?: any;
  ratedetails?: any[];
}

export class Rating implements RatingInterface {
  "userRating": number;
  "id": any;
  "requestjobId": any;
  "providerId": any;
  "peopleId": any;
  "_ratedetails": Array<any>;
  requestjob: any;
  provider: any;
  people: any;
  ratedetails: any[];
  constructor(data?: RatingInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Rating`.
   */
  public static getModelName() {
    return "Rating";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Rating for dynamic purposes.
  **/
  public static factory(data: RatingInterface): Rating{
    return new Rating(data);
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
      name: 'Rating',
      plural: 'Ratings',
      path: 'Ratings',
      idName: 'id',
      properties: {
        "userRating": {
          name: 'userRating',
          type: 'number'
        },
        "id": {
          name: 'id',
          type: 'any'
        },
        "requestjobId": {
          name: 'requestjobId',
          type: 'any'
        },
        "providerId": {
          name: 'providerId',
          type: 'any'
        },
        "peopleId": {
          name: 'peopleId',
          type: 'any'
        },
        "_ratedetails": {
          name: '_ratedetails',
          type: 'Array&lt;any&gt;',
          default: <any>[]
        },
      },
      relations: {
        requestjob: {
          name: 'requestjob',
          type: 'any',
          model: '',
          relationType: 'belongsTo',
                  keyFrom: 'requestjobId',
          keyTo: 'id'
        },
        provider: {
          name: 'provider',
          type: 'any',
          model: '',
          relationType: 'belongsTo',
                  keyFrom: 'providerId',
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
                  keyFrom: '_ratedetails',
          keyTo: 'id'
        },
      }
    }
  }
}
