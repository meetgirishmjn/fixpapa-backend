/* tslint:disable */

declare var Object: any;
export interface ProblemInterface {
  "id"?: number;
  "categoryId"?: number;
  category?: any;
}

export class Problem implements ProblemInterface {
  "id": number;
  "categoryId": number;
  category: any;
  constructor(data?: ProblemInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Problem`.
   */
  public static getModelName() {
    return "Problem";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Problem for dynamic purposes.
  **/
  public static factory(data: ProblemInterface): Problem{
    return new Problem(data);
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
      name: 'Problem',
      plural: 'Problems',
      path: 'Problems',
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
