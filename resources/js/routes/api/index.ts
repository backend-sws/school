import payment from './payment'
import publicMethod from './public'
import notifications from './notifications'
import users from './users'
import staff from './staff'
import roles from './roles'
import workflows from './workflows'
import organizations from './organizations'
import institutions from './institutions'
import departments from './departments'
import sessions from './sessions'
import mainStreams from './main-streams'
import streams from './streams'
import subjects from './subjects'
import subjectCategories from './subject-categories'
import subjectCategoryMappings from './subject-category-mappings'
import subjectGroups from './subject-groups'
import students from './students'
import notices from './notices'
import admissionHeads from './admission-heads'
import feeStructures from './fee-structures'
import applications from './applications'
import feeTypes from './fee-types'
import feeRegulationProfiles from './fee-regulation-profiles'
import feePayments from './fee-payments'
import certificateHeads from './certificate-heads'
import certificateApplications from './certificate-applications'
import idCardTemplates from './id-card-templates'
import idCards from './id-cards'
import website from './website'
import grievances from './grievances'
import contacts from './contacts'
import feedbacks from './feedbacks'
import categories from './categories'
import locations from './locations'
import items from './items'
import inventory from './inventory'
import stops from './stops'
import routes from './routes'
import drivers from './drivers'
import vehicles from './vehicles'
import assignments from './assignments'
import hostels from './hostels'
import floors from './floors'
import rooms from './rooms'
import beds from './beds'
import allocations from './allocations'
import complaints from './complaints'
import messPlans from './mess-plans'
import books from './books'
import copies from './copies'
import issues from './issues'
import templates from './templates'
import timetables from './timetables'
import courses from './courses'
import classes from './classes'
const api = {
    payment: Object.assign(payment, payment),
public: Object.assign(publicMethod, publicMethod),
notifications: Object.assign(notifications, notifications),
users: Object.assign(users, users),
staff: Object.assign(staff, staff),
roles: Object.assign(roles, roles),
workflows: Object.assign(workflows, workflows),
organizations: Object.assign(organizations, organizations),
institutions: Object.assign(institutions, institutions),
departments: Object.assign(departments, departments),
sessions: Object.assign(sessions, sessions),
mainStreams: Object.assign(mainStreams, mainStreams),
streams: Object.assign(streams, streams),
subjects: Object.assign(subjects, subjects),
subjectCategories: Object.assign(subjectCategories, subjectCategories),
subjectCategoryMappings: Object.assign(subjectCategoryMappings, subjectCategoryMappings),
subjectGroups: Object.assign(subjectGroups, subjectGroups),
students: Object.assign(students, students),
notices: Object.assign(notices, notices),
admissionHeads: Object.assign(admissionHeads, admissionHeads),
feeStructures: Object.assign(feeStructures, feeStructures),
applications: Object.assign(applications, applications),
feeTypes: Object.assign(feeTypes, feeTypes),
feeRegulationProfiles: Object.assign(feeRegulationProfiles, feeRegulationProfiles),
feePayments: Object.assign(feePayments, feePayments),
certificateHeads: Object.assign(certificateHeads, certificateHeads),
certificateApplications: Object.assign(certificateApplications, certificateApplications),
idCardTemplates: Object.assign(idCardTemplates, idCardTemplates),
idCards: Object.assign(idCards, idCards),
website: Object.assign(website, website),
grievances: Object.assign(grievances, grievances),
contacts: Object.assign(contacts, contacts),
feedbacks: Object.assign(feedbacks, feedbacks),
categories: Object.assign(categories, categories),
locations: Object.assign(locations, locations),
items: Object.assign(items, items),
inventory: Object.assign(inventory, inventory),
stops: Object.assign(stops, stops),
routes: Object.assign(routes, routes),
drivers: Object.assign(drivers, drivers),
vehicles: Object.assign(vehicles, vehicles),
assignments: Object.assign(assignments, assignments),
hostels: Object.assign(hostels, hostels),
floors: Object.assign(floors, floors),
rooms: Object.assign(rooms, rooms),
beds: Object.assign(beds, beds),
allocations: Object.assign(allocations, allocations),
complaints: Object.assign(complaints, complaints),
messPlans: Object.assign(messPlans, messPlans),
books: Object.assign(books, books),
copies: Object.assign(copies, copies),
issues: Object.assign(issues, issues),
templates: Object.assign(templates, templates),
timetables: Object.assign(timetables, timetables),
courses: Object.assign(courses, courses),
classes: Object.assign(classes, classes),
}

export default api