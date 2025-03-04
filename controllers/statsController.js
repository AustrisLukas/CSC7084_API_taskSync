const path = require("path");
const dbpool = require(path.join(__dirname, "/..", "/utils/dbconn.js"));
const { logMessage } = require(path.join(__dirname, "/..", "/utils/apiUtils.js"));
const {isAfter, differenceInCalendarDays} = require("date-fns");

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

exports.getOpenCompleteSummary = async (req,res) =>{

    const user_id = req.params.id;
    logMessage(`Executing statsController.getOpenCompleteSummary for user_id=${user_id}`);
    const SELECT_USER_TASKS = `SELECT * FROM task WHERE user_id = ${user_id}`;
    let out = {
        open: 0,
        complete: 0,
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

exports.getUrgencySummary = async (req,res) =>{

    const user_id = req.params.id;
    logMessage(`Executing statsController.getUrgencySummary for user_id=${user_id}`);
    const SELECT_USER_TASKS = `SELECT * FROM task WHERE user_id = ${user_id}`;

    let out = {
        urgentPriority: 0,
        priority: 0,
        nonPriority:0
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