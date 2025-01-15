const { format, isAfter, differenceInCalendarDays } = require("date-fns");

/**
 * Function utilises date-FNS module to format date object to String with DD/MMM/YYYY format.
 * @param {*} dueDate - input date
 * @returns formated String date DD/MMM/YYYY
 */
function formatDisplayDate(dueDate){

    let year= dueDate.getFullYear();
    let month= dueDate.getMonth();
    let day= dueDate.getDate();

    return format(new Date(year, month, day), 'do MMM, yyyy' );
}

/**
 * Checks text lenght and truncates if character limit is exceeded and concatinates '...' to the end. Otherwise returns original text
 * @param {*} text input text to be checked for length
 * @param {*} charLimit character limit
 * @returns String of truncated text or original text
 */
function limitTextLength(text, charLimit){

    return text.length > charLimit ? text.slice(0, charLimit)+"..." : text;
}

/**
 * Function returns appropriate star image url based on task priority level
 * @param {*} priority prioirty level
 * @returns approriate star image url
 */
function getStarUrl(priority) {

    let starUrl = '';

    switch (priority){
        case 0 :
            starUrl = 'star_icon/star.svg';
            break;
        case 1:
            starUrl = 'star_icon/star-half.svg';
            break;
        case 2:
            starUrl = 'star_icon/star-fill.svg';
            break;
        default:
            starUrl = '';
            break;
    }
    return starUrl;
}

/**
 * Function utilises date-FNS module to calculate difference in days between now and due date, then picks appropriate card style
 * @param {*} dueDate due date of task from which time will be calculated.
 * @returns card style String
 */
function getCardStyle(dueDate, taskStatus){

    //Default style
    let card_style="card border-secondary";

    const dateNow=new Date(Date.now());
    // if difference is <5 days -> border-warning (yellow border)
    if (differenceInCalendarDays(dueDate, dateNow) < 5) {card_style="card border-warning mb-3"};
    // if difference is < 1 day - border-warning (yellow fill)
    if (differenceInCalendarDays(dueDate, dateNow) < 1) {card_style="card text-bg-warning mb-3"};
    // if task is complete - card text-bg-success mb-3 (green fill)
    if (taskStatus === 1) {card_style = "card text-bg-success mb-3"};
    return card_style;

}



module.exports = {getStarUrl, getCardStyle, formatDisplayDate, limitTextLength};

