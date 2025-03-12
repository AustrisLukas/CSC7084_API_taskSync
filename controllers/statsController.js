const path = require("path");
const dbpool = require(path.join(__dirname, "/..", "/utils/dbconn.js"));
const { logMessage } = require(path.join(__dirname, "/..", "/utils/apiUtils.js"));
const {isAfter, differenceInCalendarDays} = require("date-fns");

/**
 * Retrieves the count of tasks per category for a specific user.
 * 
 * This function fetches the number of tasks per category for a given user that are marked as 'incomplete' (task_status_id = 0).
 * The tasks are grouped by category, and the count of tasks for each category is returned as a JSON response.
 * 
 * The function follows these steps:
 * - Executes an SQL query to count the number of incomplete tasks per category for the specified user.
 * - Returns the result as a JSON response with a 200 status code if the query is successful.
 * - In case of an error, a 500 status code with an error message is returned.
 */
exports.getTasksPerCategory = async (req, res) => {
  const user_id = req.params.id;
  logMessage(`Executing statsController.getTasksPerCategory for user_id=${user_id}`);

  const SELECT_COUNT_CATEGORY = `SELECT task_category.category_name,COUNT(task.task_category_id) AS count FROM task 
INNER JOIN task_category ON task.task_category_id = task_category.task_category_id
WHERE task.user_id = ?
AND task.task_status_id = 0
GROUP BY (task.task_category_id)`;

  try {
    const [result] = await dbpool.query(SELECT_COUNT_CATEGORY, user_id);
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error counting tasks per category" });
  }
};

/**
 * Retrieves a summary of task due dates for a specific user.
 * 
 * This function calculates the number of tasks that are:
 * - On time (tasks with a due date more than 5 days away).
 * - Due soon (tasks with a due date within 5 days).
 * - Overdue (tasks with a due date in the past).
 * 
 * The results are returned as a JSON response, with a summary object containing the labels and their corresponding values.
 * 
 * The function performs the following:
 * - Queries the database for all incomplete tasks (task_status_id = 0) for the specified user.
 * - Compares each task's due date to the current date to classify it as on time, due soon, or overdue.
 * - Returns the summary object with counts for each category in the response.

 */
exports.getDueSummary = async (req,res) =>{

    const user_id = req.params.id;
    logMessage(`Executing statsController.getDueSummary for user_id=${user_id}`);
    const SELECT_USER_TASKS = `SELECT * FROM task WHERE user_id =${user_id} AND task_status_id = 0`;

    //summary object to be returned
    let out = {
        labels:[
            'ontime',
            'duesoon',
            'overdue',
        ],
        values: [
            0,
            0,
            0,
        ]
    }
    try {
        const [result] = await dbpool.query(SELECT_USER_TASKS);
        const dateNow = new Date();

        result.forEach((element) => {
            //count total
            //count overdue
            if(isAfter(dateNow,Date.parse(element.due_date))) { out.values[2] += 1;}
            //count due soon (less than 5 days until completion target)
            else if (differenceInCalendarDays(Date.parse(element.due_date), dateNow) < 5) {out.values[1] += 1;}
            else {out.values[0] += 1;}
        });
        res.status(200).json(out);
    } catch (err){
        console.log(err);
        res.status(500).json({ message: "Error getting task due summary" });
    }
};

/**
 * Retrieves a summary of open and completed tasks for a specific user, including the average days to completion for completed tasks.
 * 
 * This function calculates the number of open tasks (task_status_id = 0) and completed tasks (task_status_id = 1) for a given user.
 * Additionally, it calculates the average number of days it took to complete the tasks.
 * 
 * The results are returned as a JSON response, with a summary object containing:
 * - The count of open tasks.
 * - The count of completed tasks.
 * - The average days taken to complete tasks.
 * 
 * The function follows these steps:
 * - Queries the database for all tasks associated with the specified user.
 * - Iterates through the tasks to classify them as open or completed.
 * - Calculates the average number of days between task creation and completion for completed tasks.
 * - Returns the summary object with the counts and average days in the response.
 */
exports.getOpenCompleteSummary = async (req,res) =>{

    const user_id = req.params.id;
    logMessage(`Executing statsController.getOpenCompleteSummary for user_id=${user_id}`);
    const SELECT_USER_TASKS = `SELECT * FROM task WHERE user_id = ${user_id}`;
    let out = {
        complete: 0,
        open: 0,
        averageDays: 0
    }
    try { 
        const [tasks] = await dbpool.query(SELECT_USER_TASKS);

        let daysToCompletion = 0;
        tasks.forEach((element)=>{
            if (element.task_status_id == 0) out.open += 1;
            if (element.task_status_id == 1){
                out.complete += 1;
                daysToCompletion += differenceInCalendarDays(element.date_completed,element.created_date);
            } 
        });
        out.averageDays = Math.floor(daysToCompletion / out.complete)
        res.status(200).json(out);
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Error getting open/complete summary"});
    }
}


/**
 * Retrieves a summary of tasks categorized by their urgency level for a specific user.
 * 
 * This function calculates the number of tasks with different urgency levels based on their star rating:
 * - Urgent priority (star_level = 2)
 * - Priority (star_level = 1)
 * - Non-priority (star_level = 0)
 * 
 * The results are returned as a JSON response with the following summary object:
 * - `urgentPriority`: level  2.
 * - `priority`: level  1.
 * - `nonPriority`: level 0.
 * 
 * The function follows these steps:
 * - Queries the database for all tasks associated with the specified user.
 * - Iterates through the tasks and classifies them by their `star_level` attribute to determine urgency.
 * - Returns the summary object containing the counts for each urgency level.
 */
exports.getUrgencySummary = async (req,res) =>{

    const user_id = req.params.id;
    logMessage(`Executing statsController.getUrgencySummary for user_id=${user_id}`);
    const SELECT_USER_TASKS = `SELECT * FROM task WHERE user_id = ${user_id}`;

    let out = {
        nonPriority:0,
        priority: 0,
        urgentPriority: 0  
    }

    try {
        const [result] = await dbpool.query(SELECT_USER_TASKS);
        result.forEach(element =>{
            if (element.star_level == 2) out.urgentPriority += 1;
            if (element.star_level == 1) out.priority += 1;
            if (element.star_level == 0) out.nonPriority += 1;
        });
        res.status(200).json(out);

    }catch (err){
        console.log(err)
        res.status(500).json({ message: "Error getting task urgency summary"});
    }
};