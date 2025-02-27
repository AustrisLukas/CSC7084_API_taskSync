const path = require("path");

const dbpool = require(path.join(__dirname, "/..", "/utils/dbconn.js"));
const { logMessage } = require(path.join(__dirname, "/..", "/utils/apiUtils.js"));

exports.getTasksPerCategory = async (req, res) =>{

    logMessage('Executing statsController.getTasksPerCategory');
    const user_id = req.params.id;
    console.log(user_id)

    const SELECT_COUNT_CATEGORY = `SELECT task_category.category_name,COUNT(task.task_category_id) AS count FROM task 
INNER JOIN task_category ON task.task_category_id = task_category.task_category_id
WHERE task.user_id = ?
GROUP BY (task.task_category_id)`;

try{
    const [result] =  await dbpool.query(SELECT_COUNT_CATEGORY, user_id);
    console.log(result);
    res.status(200).json(result);

} catch (err){
    console.log(err);
    res.status(500).json({message: 'Error counting tasks per category'});
}
}