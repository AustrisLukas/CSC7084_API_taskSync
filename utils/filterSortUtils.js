/*
* Appends SQL search query with correct SORT suffix. If userSelection is null, original SQL query is returned.
*/
function appendSortSuffix(userSelection, query) {

    if (userSelection == undefined) return query;
    let queryWithSort = query;
    
    switch (userSelection){
        case '1': 
        queryWithSort += `ORDER BY star_level DESC`
        break;
        case '2': 
            queryWithSort += `ORDER BY due_date ASC`
            break;
        case '3':
            queryWithSort += `ORDER BY due_date DESC`
            break;
        case '4':
            queryWithSort += `ORDER BY created_date ASC`
            break;
        case '5':
            queryWithSort += `ORDER BY created_date DESC`
            break; 
      
        default: 
                break;
    }

    return queryWithSort;
};

/*
* Function to check if givent category (current_cat) is contained in checked_categories array. This function is exclusively
* used for setting checkbox state when rendering a view. 
* TRUE - return String 'checked'
* FALSE - return String ''
*/
function getCheckboxState(checked_categories, current_cat){
    
    if (checked_categories.includes(current_cat)){
        return 'checked';
    } else {
        return '';
    }
}

module.exports = {appendSortSuffix, getCheckboxState};