import NotificationController from './NotificationController'
import PushSubscriptionController from './PushSubscriptionController'
const Notifications = {
    NotificationController: Object.assign(NotificationController, NotificationController),
PushSubscriptionController: Object.assign(PushSubscriptionController, PushSubscriptionController),
}

export default Notifications