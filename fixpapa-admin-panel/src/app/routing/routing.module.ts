import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './../components/login/login.component';
import { AmcContactComponent } from './../components/amc-contact/amc-contact.component';
import { DashboardComponent } from './../components/dashboard/dashboard.component';
import { GetABidComponent } from './../components/get-a-bid/get-a-bid.component';
import { RentASystemComponent } from './../components/rent-a-system/rent-a-system.component';
import { HardwarePurchaseComponent } from './../components/hardware-purchase/hardware-purchase.component';
import { ServicesComponent } from './../components/services/services.component';
import { ProductsComponent } from './../components/products/products.component';
import { AddProductComponent } from './../components/add-product/add-product.component';
import { BrandComponent } from './../components/brand/brand.component';
import { CategoriesComponent } from './../components/categories/categories.component';
import { SingleCategoryComponent } from './../components/single-category/single-category.component';
import { UserListComponent } from './../components/user-list/user-list.component';
import { VehiclesComponent } from './../components/vehicles/vehicles.component';
import { BillGenerateComponent } from './../components/generate-bill/generate-bill.component';
import { UserProfileComponent } from './../components/user-profile/user-profile.component';
import { EngineerProfileComponent } from './../components/engineer-profile/engineer-profile.component';
// Request components
import { RequestAmcComponent } from './../components/request-amc/request-amc.component';
import { RequestHardwareComponent } from './../components/request-hardware/request-hardware.component';
import { RequestBidComponent } from './../components/request-bid/request-bid.component';
import { RequestRentComponent } from './../components/request-rent/request-rent.component';
import { RequestJobComponent } from './../components/request-job/request-job.component';
import { RequestJobInfoComponent } from './../components/request-job-info/request-job-info.component';
import { ResetPasswordComponent } from './../components/reset-password/reset-password.component';
import { ChangePasswordComponent } from './../components/change-password/change-password.component';

const routes: Routes = [
	{ path: '', redirectTo: '/', pathMatch: 'full' },
	{ path: '', component: LoginComponent },
	{ path: 'amc-contract', component: AmcContactComponent },
	{ path: 'dashboard', component: DashboardComponent },
	{ path: 'get-a-bid', component: GetABidComponent },
	{ path: 'rent-a-system', component: RentASystemComponent },
	{ path: 'hardware-purchase', component: HardwarePurchaseComponent },
	{ path: 'services', component: ServicesComponent },
	{ path: 'brand', component: BrandComponent },	
	{ path: 'categories', component: CategoriesComponent },
	{ path: 'single-category/:categoryId', component: SingleCategoryComponent },
	{ path: 'products', component: ProductsComponent },
	{ path: 'user-list/:realm', component: UserListComponent },
	{ path: 'vehicle-list', component: VehiclesComponent },

	{ path: 'job-requests', component: RequestJobComponent },
	{ path: 'job-request-info/:jobId', component: RequestJobInfoComponent },	
	{ path: 'amc-requests', component: RequestAmcComponent },
	{ path: 'bid-requests', component: RequestBidComponent },
	{ path: 'hardware-requests', component: RequestHardwareComponent },
	{ path: 'rent-requests', component: RequestRentComponent },
	{ path: 'reset-password/:token', component: ResetPasswordComponent },
	{ path: 'generate-bill/:jobId', component: BillGenerateComponent },
	{ path: 'profile/vendor/:userId', component: UserProfileComponent },										
	{ path: 'profile/engineer/:userId', component: EngineerProfileComponent },										
	{ path: 'settings', component: ChangePasswordComponent }											

	/*{ path: 'add-product', component: AddProductComponent },
	{ path: 'add-product/:productId', component: AddProductComponent }*/
]; 

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [ RouterModule ],
  declarations: []
})
export class RoutingModule { }
