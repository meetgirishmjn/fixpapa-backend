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
import { Notification } from '../../models/Notification';
import { SocketConnection } from '../../sockets/socket.connections';


/**
 * Api services for the `Notification` model.
 */
@Injectable()
export class NotificationApi extends BaseLoopBackApi {

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
	* Patch an existing model instance or insert a new one into the data source.
	*
	* @param {object} data Request data.
	*
	*  - `data` – `{object}` - Model instance data
	*
	* @returns {object} An empty reference that will be
	*   populated with the actual data once the response is returned
	*   from the server.
	*
	* <em>
	* (The remote method definition does not provide any description.
	* This usually means the response is a `Notification` object.)
	* </em>
	*/
	public patchOrCreate(data: any = {}, customHeaders?: Function): Observable<any> {
		let _method: string = "PATCH";
		let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
		"/Notifications";
		let _routeParams: any = {};
		let _postBody: any = {
		  data: data
		};
		let _urlParams: any = {};
		let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
		return result;
	}
  
	public getNotifications(filter: LoopBackFilter = {}, req: any = {}, customHeaders?: Function): Observable<any> {
		let _method: string = "GET";
		let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
		"/Notifications/getNotifications";
		let _routeParams: any = {};
		let _postBody: any = {};
		let _urlParams: any = {};
		let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
		return result;
	}
  
	public readAllNoty(req : any = {},customHeaders?: Function): Observable<any> {
		let _method: string = "GET";
		let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
		"/Notifications/readAllNoty";
		let _routeParams: any = {};
		let _postBody: any = {};
		let _urlParams: any = {};
		let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
		return result;
	}

	/**
	* Patch attributes for a model instance and persist it into the data source.
	*
	* @param {any} id Notification id
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
	* This usually means the response is a `Notification` object.)
	* </em>
	*/
	
	public patchAttributes(id: any, data: any = {}, customHeaders?: Function): Observable<any> {
		let _method: string = "PATCH";
		let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
		"/Notifications/:id";
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
	   * The name of the model represented by this $resource,
	   * i.e. `Notification`.
	   */
	public getModelName() {
		return "Notification";
	}
}
