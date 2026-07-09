import CertificateHeadController from './CertificateHeadController'
import CertificateApplicationController from './CertificateApplicationController'

const Certificates = {
    CertificateHeadController: Object.assign(CertificateHeadController, CertificateHeadController),
    CertificateApplicationController: Object.assign(CertificateApplicationController, CertificateApplicationController),
}

export default Certificates