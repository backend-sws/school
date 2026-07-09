import SmsWebhookController from './SmsWebhookController'
import CommunicationsController from './CommunicationsController'

const Communications = {
    SmsWebhookController: Object.assign(SmsWebhookController, SmsWebhookController),
    CommunicationsController: Object.assign(CommunicationsController, CommunicationsController),
}

export default Communications