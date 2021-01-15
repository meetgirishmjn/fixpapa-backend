import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RoutingModule } from './routing/routing.module';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
// import { DataTableModule } from "angular-6-datatable";
import {SelectModule} from 'ng2-select';
// --------------- Modules ------------------------------
import { SDKBrowserModule } from './sdk/index';

// --------------- Components ------------------------------
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { RentASystemComponent } from './components/rent-a-system/rent-a-system.component';
import { GetABidComponent } from './components/get-a-bid/get-a-bid.component';
import { HardwarePurchaseComponent } from './components/hardware-purchase/hardware-purchase.component';
import { AmcContactComponent } from './components/amc-contact/amc-contact.component';
import { ProductsComponent } from './components/products/products.component';
import { ServicesComponent } from './components/services/services.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { BrandComponent } from './components/brand/brand.component';
import { SingleCategoryComponent } from './components/single-category/single-category.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { VehiclesComponent } from './components/vehicles/vehicles.component';
import { RequestAmcComponent } from './components/request-amc/request-amc.component';
import { RequestHardwareComponent } from './components/request-hardware/request-hardware.component';
import { RequestBidComponent } from './components/request-bid/request-bid.component';
import { RequestRentComponent } from './components/request-rent/request-rent.component';
import { RequestJobComponent } from './components/request-job/request-job.component';
import { RequestJobInfoComponent } from './components/request-job-info/request-job-info.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { BillGenerateComponent } from './components/generate-bill/generate-bill.component';
import { HsnCodesComponent } from './components/hsn-codes/hsn-codes.component';
import { NotificationComponent } from './components/notification/notification.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { EngineerProfileComponent } from './components/engineer-profile/engineer-profile.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { environment } from './../environments/environment';
// --------------- Pipe ------------------------------
import { SelectAutocompletePipe } from './pipes/select-autocomplete/select-autocomplete.pipe';
import { CommaSeparatedListPipe } from './pipes/comma-seprated-list/comma-separated-list.pipe';
import { FilterPipe } from './pipes/filter/filter.pipe';

// --------------- Provider ------------------------------
import { MultipartService } from './services/multipart/multipart.service';
import { FileDirective } from './directives/file/file.directive';
import { ImageHeightWidthService } from './services/image-height-width/image-height-width.service';
import { MomentModule } from 'angular2-moment';
import { MessagingService } from './services/firebase-message/firebase-messaging.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    CategoriesComponent,
    RentASystemComponent,
    GetABidComponent,
    HardwarePurchaseComponent,
    AmcContactComponent,
    ProductsComponent,
    ServicesComponent,
    AddProductComponent,
    BrandComponent,
    CommaSeparatedListPipe,
    SingleCategoryComponent,
    SelectAutocompletePipe,
    FileDirective,
    UserListComponent,
    VehiclesComponent,
    RequestAmcComponent,
    RequestHardwareComponent,
    RequestBidComponent,
    RequestRentComponent,
    RequestJobComponent,
    RequestJobInfoComponent,
    FilterPipe,
    ResetPasswordComponent,
    BillGenerateComponent,
    HsnCodesComponent,
    NotificationComponent,
    UserProfileComponent,
    EngineerProfileComponent,
    ChangePasswordComponent
  ],
  imports: [
    BrowserModule,
    RoutingModule,
    FormsModule,
    BrowserAnimationsModule, 
    ToastrModule.forRoot(), // ToastrModule added
    SelectModule,
    SDKBrowserModule.forRoot(),
    OwlDateTimeModule, 
    OwlNativeDateTimeModule,   
    NgbModule.forRoot(), 
    // DataTableModule,
    MomentModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebase),
  ],
  providers: [
    MultipartService,
    ImageHeightWidthService,
    AngularFirestore,
    MessagingService,
    

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
