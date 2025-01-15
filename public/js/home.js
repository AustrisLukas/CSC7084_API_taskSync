
console.log('I am here');
document.addEventListener('DOMContentLoaded', () => {
    //const editModal = document.getElementById('editModal');
    //const editForm = document.getElementById('editForm');

    const modalLinks = document.querySelectorAll('a[data-bs-toggle="modal"]');

    modalLinks.forEach(link => {
        link.addEventListener('click', (event) => {
          // Get the task info from the clicked link
          const task_id = event.currentTarget.getAttribute('data-taskID');
          const task_name = event.currentTarget.getAttribute('data-task_name');
          const task_desc = event.currentTarget.getAttribute('data-task_desc');
          const task_dueDate = event.currentTarget.getAttribute('data-dueDate');
          const task_cat = event.currentTarget.getAttribute('data-cat');
          const task_star = event.currentTarget.getAttribute('data-star');
          

          console.log(task_star)
          document.getElementById('modalTitle').value = task_name;
          document.getElementById('modalDesc').value = task_desc;
          document.getElementById('modalDate').value = formatDateforHTML(new Date(task_dueDate));
          document.getElementById('modalCat').value = task_cat;
          document.getElementById('btnradio'+task_star).checked = true;

          
          

    
  
          // Example: Updating modal content based on the task ID
          //const modalTitle = document.querySelector('#staticBackdrop .modal-title');
          //const modalBody = document.querySelector('#staticBackdrop .modal-body');
         // modalTitle.textContent = `Task Details: ${taskId}`;
         // modalBody.textContent = `Loading details for task ID ${taskId}...`;
  
          // Fetch task-specific data from the server or database
          // Example: fetch(`/api/tasks/${taskId}`).then(response => ...)
        });
      });




});

function formatDateforHTML(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
    const day = String(date.getDate()).padStart(2, '0'); // Ensure two digits for day
    
    return `${year}-${month}-${day}`;
  }