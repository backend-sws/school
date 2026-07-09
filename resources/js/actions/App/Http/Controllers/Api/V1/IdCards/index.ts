import IdCardVerificationController from './IdCardVerificationController'
import IdCardTemplateController from './IdCardTemplateController'
import IdCardController from './IdCardController'
const IdCards = {
    IdCardVerificationController: Object.assign(IdCardVerificationController, IdCardVerificationController),
IdCardTemplateController: Object.assign(IdCardTemplateController, IdCardTemplateController),
IdCardController: Object.assign(IdCardController, IdCardController),
}

export default IdCards