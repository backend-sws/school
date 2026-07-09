import OnboardingController from './OnboardingController'
import MainLandingController from './MainLandingController'
import LegalController from './LegalController'
import WebsiteController from './WebsiteController'
import VerifyEmailController from './VerifyEmailController'
import SuperAdminLandingController from './SuperAdminLandingController'
import CreateInstitutionController from './CreateInstitutionController'
const Web = {
    OnboardingController: Object.assign(OnboardingController, OnboardingController),
MainLandingController: Object.assign(MainLandingController, MainLandingController),
LegalController: Object.assign(LegalController, LegalController),
WebsiteController: Object.assign(WebsiteController, WebsiteController),
VerifyEmailController: Object.assign(VerifyEmailController, VerifyEmailController),
SuperAdminLandingController: Object.assign(SuperAdminLandingController, SuperAdminLandingController),
CreateInstitutionController: Object.assign(CreateInstitutionController, CreateInstitutionController),
}

export default Web