/* tslint:disable */

declare var Object: any;
export interface RequestjobInterface {
  "id"?: number;
  "categoryId"?: number;
  category?: any;
}

export class Requestjob implements RequestjobInterface {
  "id": number;
  "categoryId": number;
  category: any;
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
        "id": {
          name: 'id',
          type: 'number'
        },
        "categoryId": {
          name: 'categoryId',
          type: 'number'
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
      }
    }
  }
}
