import ExpenseController from './ExpenseController'
import ExpenseCategoryController from './ExpenseCategoryController'
import ExpenseBudgetController from './ExpenseBudgetController'

const Expense = {
    ExpenseController: Object.assign(ExpenseController, ExpenseController),
    ExpenseCategoryController: Object.assign(ExpenseCategoryController, ExpenseCategoryController),
    ExpenseBudgetController: Object.assign(ExpenseBudgetController, ExpenseBudgetController),
}

export default Expense