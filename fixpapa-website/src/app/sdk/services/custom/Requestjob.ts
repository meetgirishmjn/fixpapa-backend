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
import { Requestjob } from '../../models/Requestjob';
import { SocketConnection } from '../../sockets/socket.connections';


/**
 * Api services for the `Requestjob` model.
 */
@Injectable()
export class RequestjobApi extends BaseLoopBackApi {

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
   * @param {any} id Requestjob id
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
   * This usually means the response is a `Requestjob` object.)
   * </em>
   */
  public patchAttributes(id: any, data: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "PATCH";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/Requestjobs/:id";
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
   *  - `req` – `{object}` - 
   *
   *  - `res` – `{object}` - 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `success` – `{object}` - 
   */
  public createJob(req: any = {}, res: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "POST";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/Requestjobs/createJob";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * <em>
         * (The remote method definition does not provide any description.)
         * </em>
   *
   * @param {string} req 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `success` – `{object}` - 
   */
	public getAllJobs(req: any = {}, customHeaders?: Function): Observable<any> {
		let _method: string = "GET";
		let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
		"/Requestjobs/getAllJobs";
		let _routeParams: any = {};
		let _postBody: any = {};
		let _urlParams: any = {};
		let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
		return result;
	}
  
	public custAllJobs(req: any = {}, customHeaders?: Function) : Observable<any>{
		let _method: string = "GET";
		let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
		"/Requestjobs/custAllJobs";
		let _routeParams: any = {};
		let _postBody: any = {};
		let _urlParams: any = {};
		let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
		return result;
	}
	
	public cancelJob(reason : any, comment : any, realm : any, requestjobId : any, customHeaders?: Function) : Observable<any>{
		let _method: string = "POST";
		let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
		"/Requestjobs/cancelJob";
		let _routeParams: any = {};
		let _postBody: any = {
			data : {
				reason : reason,
				comment : comment,
				realm : realm,
				requestjobId : requestjobId
			}
		};
		let _urlParams: any = {};
		let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
		return result;
	}
	
	public latestVendorJobs(vendorId: any = {}, customHeaders?: Function) : Observable<any>{
		let _method: string = "GET";
		let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
		"/Requestjobs/vendorJobs";
		let _routeParams: any = {};
		let _postBody: any = {};
		let _urlParams: any = {};
		if (typeof vendorId !== 'undefined' && vendorId !== null) _urlParams.vendorId = vendorId;
		let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
		return result;
	}
	
	public onGoingVendorJobs(vendorId: any = {}, customHeaders?: Function) : Observable<any>{
		let _method: string = "GET";
		let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
		"/Requestjobs/vendorAllJobs";
		let _routeParams: any = {};
		let _postBody: any = {};
		let _urlParams: any = {};
		if (typeof vendorId !== 'undefined' && vendorId !== null) _urlParams.vendorId = vendorId;
		let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
		return result;
	}
	
	public assignEngineer(requestjobId : any,engineerId : any, customHeaders?: Function) : Observable<any>{
		let _method: string = "POST";
		let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
		"/Requestjobs/assignEngineer";
		let _routeParams: any = {};
		let _postBody : any = {};
		_postBody = {
			requestjobId : requestjobId,
			engineerId : engineerId
		};
		let _urlParams: any = {};
		let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
		return result;
	}
	
	public vendorAcceptorCancel(requestjobId: any,status : any, customHeaders?: Function) : Observable<any>{
		let _method: string = "POST";
		let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
		"/Requestjobs/vendorAcceptorCancel";
		let _routeParams: any = {};
		let _postBody : any = {};
		_postBody = {
			requestjobId : requestjobId,
			status : status
		};
		let _urlParams: any = {};
		let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
		return result;
	}
	
	public engineerAccept(requestjobId : any, customHeaders?: Function) : Observable<any>{
		//console.log("request job id : ", requestjobId);
		let _method: string = "POST";
		let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
		"/Requestjobs/engineerAccept";
		let _routeParams: any = {};
		let _postBody : any = {};
		_postBody = {
			data : {
				requestjobId : requestjobId
			}
		};
		//console.log("request job id : ", _postBody);
		let _urlParams: any = {};
		let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
		return result;
	}
	
	public partRequest(addPart : any,requestjobId : any, customHeaders?: Function) : Observable<any>{
		let _method: string = "POST";
		let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
		"/Requestjobs/partRequest";
		let _routeParams: any = {};
		let _postBody : any = {};
		_postBody = {
			data : {
				addPart : addPart,
				requestjobId : requestjobId
			}
		};
		let _urlParams: any = {};
		let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
		return result;
	}
	
	public partResponse(addPart : any,requestjobId : any,_status : any, customHeaders?: Function) : Observable<any>{
		let _method: string = "POST";
		let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
		"/Requestjobs/partResponse";
		let _routeParams: any = {};
		let _postBody : any = {};
		_postBody = {
			data : {
				addPart : addPart,
				requestjobId : requestjobId,
				r_status : _status
			}
		};
		let _urlParams: any = {};
		let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
		return result;
	}
	
	public updateStatus(requestjobId : any,offsiteStatus : any, customHeaders?: Function) : Observable<any>{
		let _method: string = "POST";
		let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
		"/Requestjobs/updateStatus";
		let _routeParams: any = {};
		let _postBody : any = {};
		_postBody = {
			data : {
				requestjobId : requestjobId,
				offsiteStatus : offsiteStatus
			}
		};
		let _urlParams: any = {};
		let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
		return result;
	}
	
	public engineerSchedule(requestjobId: any,eStartDate : any, eEndDate : any, customHeaders?: Function) : Observable<any>{
		let _method: string = "POST";
		let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
		"/Requestjobs/engineerSchedule";
		let _routeParams: any = {};
		let _postBody : any = {};
		_postBody = {
			data : {
				requestjobId : requestjobId,
				eStartDate 	 : eStartDate,
				eEndDate 	 : eEndDate
			}
		};
		let _urlParams: any = {};
		let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
		return result; 
	}
	
	//All except (new,scheduled)
	public engineerAllJobs(req: any = {}, customHeaders?: Function): Observable<any>{
		let _method: string = "Get";
		let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
		"/Requestjobs/engineerAllJobs";
		let _routeParams: any = {};
		let _postBody : any = {};
		let _urlParams: any = {};
		let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
		return result;
	}
	
	// new,scheduled
	public engineerNewJobs(req: any = {}, customHeaders?: Function): Observable<any>{
		let _method: string = "Get";
		let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
		"/Requestjobs/engineerNewJobs";
		let _routeParams: any = {};
		let _postBody : any = {};
		let _urlParams: any = {};
		let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
		return result;
	}
	
	public getPeopleJobs(peopleId: any = {}, realm : any, customHeaders?: Function) : Observable<any>{
		let _method: string = "GET";
		let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
		"/Requestjobs/getPeopleJobs";
		let _routeParams: any = {};
		let _postBody: any = {};
		let _urlParams: any = {};
		if (typeof peopleId !== 'undefined' && peopleId !== null) _urlParams.peopleId = peopleId;
		if (typeof realm !== 'undefined' && realm !== null) _urlParams.realm = realm;
		let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
		return result;
	}
	
	public getJobById(requestjobId : any = {}, customHeaders?: Function) : Observable<any>{
		let _method: string = "GET";
		let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
		"/Requestjobs/getJobById";
		let _routeParams: any = {};
		let _postBody: any = {};
		let _urlParams: any = {};
		if (typeof requestjobId !== 'undefined' && requestjobId !== null) _urlParams.requestjobId = requestjobId;
		let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
		return result;
	}
	
	public updateJobStatus(requestjobId: any,status : any, customHeaders?: Function) : Observable<any>{
		let _method: string = "POST";
		let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
		"/Requestjobs/updateJobStatus";
		let _routeParams: any = {};
		let _postBody : any = {};
		_postBody = {
			data : {
				requestjobId : requestjobId,
				status 		 : status
			}
		};
		let _urlParams: any = {};
		let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
		return result; 
	}
	

  /**
   * The name of the model represented by this $resource,
   * i.e. `Requestjob`.
   */
  public getModelName() {
    return "Requestjob";
  }
}
