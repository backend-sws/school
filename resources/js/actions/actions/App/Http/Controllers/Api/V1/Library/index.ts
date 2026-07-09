import LibraryBookController from './LibraryBookController'
import LibraryCopyController from './LibraryCopyController'
import LibraryIssueController from './LibraryIssueController'

const Library = {
    LibraryBookController: Object.assign(LibraryBookController, LibraryBookController),
    LibraryCopyController: Object.assign(LibraryCopyController, LibraryCopyController),
    LibraryIssueController: Object.assign(LibraryIssueController, LibraryIssueController),
}

export default Library