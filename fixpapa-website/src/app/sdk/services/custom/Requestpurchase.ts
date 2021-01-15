/* tslint:disable */
import { Injectable, Inject, Optional } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { SDKModels } from './SDKModels';
import { BaseLoopBackApi } from '../core/base.service';
import { LoopBackConfig } from '../../lb.config';
import { LoopBackAuth } from '../core/auth.service';
import { LoopBackFilter,  } from '../../models/BaseModels';
import { ErrorHandler } from '../core/error.service';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Rx';
import { Requestpurchase } from '../../models/Requestpurchase';
import { SocketConnection } from '../../sockets/socket.connections';


/**
 * Api services for the `Requestpurchase` model.
 */
@Injectable()
export class RequestpurchaseApi extends BaseLoopBackApi {

  constructor(
    @Inject(HttpClient) protected http: HttpClient,
    @Inject(SocketConnection) protected connection: SocketConnection,
    @Inject(SDKModels) protected models: SDKModels,
    @Inject(LoopBackAuth) protected auth: LoopBackAuth,
    @Optional() @Inject(ErrorHandler) protected errorHandler: ErrorHandler
  ) {
    super(http,  connection,  models, auth, errorHandler);
  }

  /**
   * Patch attributes for a model instance and persist it into the data source.
   *
   * @param {any} id Requestpurchase id
   *
   * @param {object} data Request data.
   *
   *  - `data` – `{object}` - An object of model property name/value pairs
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Requestpurchase` object.)
   * </em>
   */
  public patchAttributes(id: any, data: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "PATCH";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/Requestpurchases/:id";
    let _routeParams: any = {
      id: id
    };
    let _postBody: any = {
      data: data
    };
    let _urlParams: any = {};
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * <em>
         * (The remote method definition does not provide any description.)
         * </em>
   *
   * @param {object} data Request data.
   *
   *  - `newpurchaseId` – `{string}` - 
   *
   *  - `modelNumber` – `{string}` - 
   *
   *  - `noOfUnits` – `{string}` - 
   *
   *  - `configuration` – `{string}` - 
   *
   *  - `priceBudget` – `{number}` - 
   *
   *  - `deliveryAdd` – `{geopoint}` - 
   *
   *  - `modeOfPayment` – `{string}` - 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `success` – `{object}` - 
   */
    
  public createPurchase(newpurchaseId: any = {}, productId : any, brandId : any, values : any = [], title : any, purchaseDate : any, modelNumber: any, noOfUnits: any,
	configuration: any,other : any, priceBudget : any, deliveryAdd : any, modeOfPayment: any, customHeaders?: Function): Observable<any> {
    let _method: string = "POST";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/Requestpurchases/createPurchase";
    let _routeParams: any = {};
    let _postBody: any = {
		data: {
			newpurchaseId : newpurchaseId,
			productId : productId,
			brandId : brandId,
			values	: values,
			title  : title,
			purchaseDate : purchaseDate,
			modelNumber : modelNumber,
			noOfUnits : noOfUnits,
			configuration : configuration,
			other : other,
			priceBudget : priceBudget,
			deliveryAdd : deliveryAdd,
			modeOfPayment : modeOfPayment
		}
    };
    let _urlParams: any = {};
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * <em>
         * (The remote method definition does not provide any description.)
         * </em>
   *
   * @param {object} req 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `success` – `{object}` - 
   */
  public getAllPurchases(req: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/Requestpurchases/getAllPurchases";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }
  
   public getPurchase(purchaseId : any, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/Newpurchases/getPurchase";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
	if (typeof purchaseId !== 'undefined' && purchaseId !== null) _urlParams.purchaseId = purchaseId;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * The name of the model represented by this $resource,
   * i.e. `Requestpurchase`.
   */
  public getModelName() {
    return "Requestpurchase";
  }
}
