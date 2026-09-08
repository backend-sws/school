import StudentLedgerController from './StudentLedgerController'
import FeeTypeController from './FeeTypeController'
import FeeRegulationProfileController from './FeeRegulationProfileController'
import FeePaymentController from './FeePaymentController'
import MonthlyLedgerController from './MonthlyLedgerController'
import AdHocChargeController from './AdHocChargeController'
import FeeCollectionSettingsController from './FeeCollectionSettingsController'
import FeeDuesController from './FeeDuesController'
const Fees = {
    StudentLedgerController: Object.assign(StudentLedgerController, StudentLedgerController),
FeeTypeController: Object.assign(FeeTypeController, FeeTypeController),
FeeRegulationProfileController: Object.assign(FeeRegulationProfileController, FeeRegulationProfileController),
FeePaymentController: Object.assign(FeePaymentController, FeePaymentController),
MonthlyLedgerController: Object.assign(MonthlyLedgerController, MonthlyLedgerController),
AdHocChargeController: Object.assign(AdHocChargeController, AdHocChargeController),
FeeCollectionSettingsController: Object.assign(FeeCollectionSettingsController, FeeCollectionSettingsController),
FeeDuesController: Object.assign(FeeDuesController, FeeDuesController),
}

export default Fees