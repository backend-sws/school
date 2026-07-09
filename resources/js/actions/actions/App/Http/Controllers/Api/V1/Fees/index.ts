import FeeTypeController from './FeeTypeController'
import FeeRegulationProfileController from './FeeRegulationProfileController'
import FeePaymentController from './FeePaymentController'
import MonthlyLedgerController from './MonthlyLedgerController'
import StudentLedgerController from './StudentLedgerController'
import AdHocChargeController from './AdHocChargeController'
import FeeCollectionSettingsController from './FeeCollectionSettingsController'
import FeeDuesController from './FeeDuesController'

const Fees = {
    FeeTypeController: Object.assign(FeeTypeController, FeeTypeController),
    FeeRegulationProfileController: Object.assign(FeeRegulationProfileController, FeeRegulationProfileController),
    FeePaymentController: Object.assign(FeePaymentController, FeePaymentController),
    MonthlyLedgerController: Object.assign(MonthlyLedgerController, MonthlyLedgerController),
    StudentLedgerController: Object.assign(StudentLedgerController, StudentLedgerController),
    AdHocChargeController: Object.assign(AdHocChargeController, AdHocChargeController),
    FeeCollectionSettingsController: Object.assign(FeeCollectionSettingsController, FeeCollectionSettingsController),
    FeeDuesController: Object.assign(FeeDuesController, FeeDuesController),
}

export default Fees