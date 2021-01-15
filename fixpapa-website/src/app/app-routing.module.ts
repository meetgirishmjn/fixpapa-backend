import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StartComponent } from './components/start/start.component';
import { CustomerDashboardComponent } from './components/customer-dashboard/customer-dashboard.component';
import { ServerErrorComponent } from './components/server-error/server-error.component';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
import { NewPasswordComponent } from './components/new-password/new-password.component';
import { ViewJobComponent } from './components/view-job/view-job.component';
import { PersonInfoComponent } from './components/person-info/person-info.component';
import { PrivacyComponent } from './components/privacy/privacy.component';
import { TermsAndConditionComponent } from './components/terms-and-condition/terms-and-condition.component';
import { RefundPolicyComponent } from './components/refund-policy/refund-policy.component';
import { ServicesComponent } from './components/services/services.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { PaytmRedirectComponent } from './components/paytm-redirect/paytm-redirect.component';
import { BillGenerateComponent } from './components/bill-generate/bill-generate.component';
import { HsnCodesComponent } from './components/hsn-codes/hsn-codes.component';

const routes: Routes = [
	{ path: '', component: StartComponent, pathMatch: 'full'},
	{ path: 'dashboard', component: CustomerDashboardComponent },
	{ path: 'server-error', component : ServerErrorComponent },
	{ path: 'reset', component : ForgetPasswordComponent },
	{ path: 'reset-password/:accessToken', component : NewPasswordComponent },
	{ path: 'job/:id', component : ViewJobComponent },
	{ path: 'profile/:realm/:id', component : PersonInfoComponent },
	{ path: 'privacy-and-security', component : PrivacyComponent },
	{ path: 'terms-and-condition', component : TermsAndConditionComponent },
	{ path: 'refund-policy', component : RefundPolicyComponent },
	{ path: 'services', component : ServicesComponent },
	{ path: 'about-us', component : AboutUsComponent },
	{ path: 'pg-redirect/:JsonData', component : PaytmRedirectComponent },
	{ path: 'bill/:id', component : BillGenerateComponent },
	{ path: 'hsn-codes', component : HsnCodesComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports : [RouterModule],
  declarations: []
})
export class AppRoutingModule { }
