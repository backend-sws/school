import DashboardAnalyticsController from './DashboardAnalyticsController'
import AdmissionAnalyticsController from './AdmissionAnalyticsController'
import AnalyticsController from './AnalyticsController'

const Analytics = {
    DashboardAnalyticsController: Object.assign(DashboardAnalyticsController, DashboardAnalyticsController),
    AdmissionAnalyticsController: Object.assign(AdmissionAnalyticsController, AdmissionAnalyticsController),
    AnalyticsController: Object.assign(AnalyticsController, AnalyticsController),
}

export default Analytics