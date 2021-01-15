/* tslint:disable */
import { Injectable } from '@angular/core';
import { User } from '../../models/User';
import { AccessToken } from '../../models/AccessToken';
import { People } from '../../models/People';
import { Container } from '../../models/Container';
import { Email } from '../../models/Email';
import { Problem } from '../../models/Problem';
import { Category } from '../../models/Category';
import { Products } from '../../models/Products';
import { Brand } from '../../models/Brand';
import { Services } from '../../models/Services';
import { AMC } from '../../models/AMC';
import { Bid } from '../../models/Bid';
import { Newpurchase } from '../../models/Newpurchase';
import { Requestamc } from '../../models/Requestamc';
import { Requestbid } from '../../models/Requestbid';
import { Requestjob } from '../../models/Requestjob';
import { Requestpurchase } from '../../models/Requestpurchase';
import { Notification } from '../../models/Notification';
import { Transaction } from '../../models/Transaction';
import { Otp } from '../../models/Otp';
import { Requestrent } from '../../models/Requestrent';
import { Rating } from '../../models/Rating';

export interface Models { [name: string]: any }

@Injectable()
export class SDKModels {

  private models: Models = {
    User: User,
    AccessToken: AccessToken,
    People: People,
    Container: Container,
    Email: Email,
    Problem: Problem,
    Category: Category,
    Products: Products,
    Brand: Brand,
    Services: Services,
    AMC: AMC,
    Bid: Bid,
    Newpurchase: Newpurchase,
    Requestamc: Requestamc,
    Requestbid: Requestbid,
    Requestjob: Requestjob,
    Requestpurchase: Requestpurchase,
    Notification: Notification,
    Transaction: Transaction,
    Otp: Otp,
    Requestrent: Requestrent,
    Rating: Rating,
    
  };

  public get(modelName: string): any {
    return this.models[modelName];
  }

  public getAll(): Models {
    return this.models;
  }

  public getModelNames(): string[] {
    return Object.keys(this.models);
  }
}
