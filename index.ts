interface Expense {
    id: number,
    ammount: number,
    description: string,
    created_at: Date
}

function displayExpenses(): void{
    console.log("ID  Date        Description  Amount")
    for (const element of expenses) {
        console.log(`${element.id}  ${element.created_at}  ${element.description}  ${element.ammount}`)
    }
}

function displaySummary(): void {
    let summary: number = 0
    for (const element of expenses) {
        summary += element.ammount
    }
    console.log(`Total expenses: ${summary}`)
}

async function deleteExpense(id: number): Promise<void> {
    const foundExpense = expenses.find(element => element.id === id);
    if (foundExpense !== undefined) {
        const index = expenses.findIndex(item => item.id === id);
        if (index !== -1) {
            expenses.splice(index, 1);
            await Bun.write("expenses.json", JSON.stringify(expenses, null, 2));
            console.log(`Expense ID ${id} successfully deleted.`)
        }
    } else {
        console.log("This expense doesn't exist.")
    }
}

const argv: Array<string> = Bun.argv;
let expenses: Array<Expense> = []
let expenseID: number

// Loading existant data
const expenseFile = Bun.file("expenses.json");
if (await expenseFile.exists()) {
	expenses = await expenseFile.json();
} else {
	await Bun.write("expenses.json", JSON.stringify(expenses, null, 2));
}

// determinate next taskId available
if (expenses.length >= 1) {
	expenseID = Math.max(...expenses.map((obj) => obj.id)) + 1;
} else {
	expenseID = 1;
}

if (argv[2] !== undefined) {
    const command: string  = argv[2]
    switch (command) {
        case "add":       
            break;
        case "list":
            displayExpenses()
            break;
        case "summary":
            if (argv.length < 4) {
                displaySummary()
            } else {
                // A compléter
            }
            break;
        case "delete":
            if (argv[3] === "--id" && typeof(argv[4]) === "number") {
                if (Number.isInteger(argv[4])) {
                    deleteExpense(argv[4])
                } else {
                    console.log("ID must be an integer.")
                }
            }
            break;
        default:
            console.log("Unknow command.")
            break;
    }
}

