import { BrowserModule } from '@angular/platform-browser';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { SDKBrowserModule } from './sdk/index';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { StartComponent } from './components/start/start.component';

import { SearchComponent } from './components/search/search.component';
import { FilterRequestPipe } from './pipes/filter-request.pipe';
import { ToastModule } from 'ng2-toastr/ng2-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GlobalFunctionService } from './services/global-function.service';
import { SeoService } from './services/seo/seo.service';
import { FileDirective } from './directives/file/file.directive';
import { MultipartService } from './services/multipart/multipart.service';
import { ResizeImageService } from './services/resize-image.service';

import { TestDirectiveDirective } from './directives/test-directive.directive';
import { TestDirectiveDirective1 } from './directives/test-directive1.directive';
import { TestDirectiveDirective2 } from './directives/test-directive2.directive';

import { OwlModule } from 'ngx-owl-carousel';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { AgmCoreModule } from '@agm/core';
import { FilterBankListPipe } from './pipes/filter-bank-list.pipe';
import { LoginModalComponent } from './components/login-modal/login-modal.component';
import { OtpModalComponent } from './components/otp-modal/otp-modal.component';
import { CustomerModalComponent } from './components/customer-modal/customer-modal.component';
import { VendorModalComponent } from './components/vendor-modal/vendor-modal.component';
import { CustomerDashboardComponent } from './components/customer-dashboard/customer-dashboard.component';
import { ServerErrorComponent } from './components/server-error/server-error.component';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
import { NewPasswordComponent } from './components/new-password/new-password.component';
import { AddEngineerComponent } from './components/add-engineer/add-engineer.component';
import { CreateJobComponent } from './components/create-job/create-job.component';
import { VendorDashboardComponent } from './components/vendor-dashboard/vendor-dashboard.component';
import { FooterDashboardsComponent } from './components/footer-dashboards/footer-dashboards.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { AmcRequestComponent } from './components/amc-request/amc-request.component';
import { BidRequestComponent } from './components/bid-request/bid-request.component';
import { NewPurchaseComponent } from './components/new-purchase/new-purchase.component';
import { RentRequestComponent } from './components/rent-request/rent-request.component';

import { FacebookModule } from 'ngx-facebook';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { CustomerJobsComponent } from './components/customer-jobs/customer-jobs.component';
import { VendorJobsComponent } from './components/vendor-jobs/vendor-jobs.component';
import { CancelJobComponent } from './components/cancel-job/cancel-job.component';
import { RequestPartsComponent } from './components/request-parts/request-parts.component';
import { UpdateStatusComponent } from './components/update-status/update-status.component';

import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from './../environments/environment';
import { MessagingService } from './services/messaging.service';
import { LiveLocationComponent } from './components/live-location/live-location.component';
import { JobStatusComponent } from './components/job-status/job-status.component';
import { GiveFeedbackComponent } from './components/give-feedback/give-feedback.component';
import { ViewJobComponent } from './components/view-job/view-job.component';
import { PersonInfoComponent } from './components/person-info/person-info.component';

import {TooltipModule} from "ngx-tooltip";
import { PrivacyComponent } from './components/privacy/privacy.component';
import { TermsAndConditionComponent } from './components/terms-and-condition/terms-and-condition.component';
import { RefundPolicyComponent } from './components/refund-policy/refund-policy.component';

import { SocialLoginModule,AuthServiceConfig,GoogleLoginProvider} from "angular5-social-login";
import { ServicesComponent } from './components/services/services.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { NotificationComponent } from './components/notification/notification.component';
import { BillComponent } from './components/bill/bill.component';
import { FilterEngineerPipe } from './pipes/filter-engineer.pipe';
import { PaytmRedirectComponent } from './components/paytm-redirect/paytm-redirect.component';
import { PaytmResponseComponent } from './components/paytm-response/paytm-response.component';
import { BillGenerateComponent } from './components/bill-generate/bill-generate.component';
import { PaymentComponent } from './components/payment/payment.component';

import { MomentModule } from 'angular2-moment';
import { HsnCodesComponent } from './components/hsn-codes/hsn-codes.component';
import { PercentageDirective } from './directives/percentage.directive';
import { EnquiryComponent } from './components/enquiry/enquiry.component';

import { AngularDateTimePickerModule } from 'angular2-datetimepicker';
import { FilterBillPipe } from './pipes/filter-bill.pipe';
import { LoginMobileComponent } from './components/login-mobile/login-mobile.component';
import { LocalStorageService } from './services/localstorage.service';
import { MobileLoginSignupComponent } from './components/mobile-login-signup/mobile-login-signup.component';
import { MobileTestDirective } from './directives/mobile.directive';

export function getAuthServiceConfigs() {
	const config = new AuthServiceConfig(
		[
			{
				id: GoogleLoginProvider.PROVIDER_ID,
				provider: new GoogleLoginProvider("677218008910-io0qvhoshcl5dinsn8nj3so2vn5gjoli.apps.googleusercontent.com")
			}
		]
	);
	return config;
}

@NgModule({
	declarations: [
		AppComponent,
		StartComponent,
		SearchComponent,
		FilterRequestPipe,
		FileDirective,
		TestDirectiveDirective,
		TestDirectiveDirective1,
		TestDirectiveDirective2,
		MobileTestDirective,
		FilterBankListPipe,
		LoginModalComponent,
		OtpModalComponent,
		CustomerModalComponent,
		VendorModalComponent,
		CustomerDashboardComponent,
		ServerErrorComponent,
		ForgetPasswordComponent,
		NewPasswordComponent,
		AddEngineerComponent,
		CreateJobComponent,
		VendorDashboardComponent,
		FooterDashboardsComponent,
		ChangePasswordComponent,
		AmcRequestComponent,
		BidRequestComponent,
		NewPurchaseComponent,
		RentRequestComponent,
		SidebarComponent,
		CustomerJobsComponent,
		VendorJobsComponent,
		CancelJobComponent,
		RequestPartsComponent,
		UpdateStatusComponent,
		LiveLocationComponent,
		JobStatusComponent,
		GiveFeedbackComponent,
		ViewJobComponent,
		PersonInfoComponent,
		PrivacyComponent,
		TermsAndConditionComponent,
		RefundPolicyComponent,
		ServicesComponent,
		AboutUsComponent,
		NotificationComponent,
		BillComponent,
		FilterEngineerPipe,
		PaytmRedirectComponent,
		PaytmResponseComponent,
		BillGenerateComponent,
		PaymentComponent,
		HsnCodesComponent,
		PercentageDirective,
		EnquiryComponent,
		FilterBillPipe,
		LoginMobileComponent,
		MobileLoginSignupComponent
	],
	imports: [
		BrowserAnimationsModule,
		BrowserModule,
		AppRoutingModule,
		HttpModule,
		TooltipModule,
		AngularFireDatabaseModule,
		AngularFireAuthModule,
		MomentModule,
		AngularDateTimePickerModule,
		AngularFireModule.initializeApp(environment.firebase),
		SDKBrowserModule.forRoot(),
		AgmCoreModule.forRoot({
			apiKey: "AIzaSyB9NtoqFp9_7Nv7Rq3cCezG40NN0nUkDJU",
			libraries: ["places"]
		}),
		BrowserAnimationsModule,
		ToastModule.forRoot(),
		FormsModule,
		OwlModule,
		ScrollToModule.forRoot(),
		FacebookModule.forRoot(),
		SocialLoginModule,
		ReactiveFormsModule
	],
	providers: [
		GlobalFunctionService,
		LocalStorageService,
		SeoService,
		ResizeImageService,
		AngularFirestore,
		MultipartService,
		MessagingService,
		{
		  provide: AuthServiceConfig,
		  useFactory: getAuthServiceConfigs
		}
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
