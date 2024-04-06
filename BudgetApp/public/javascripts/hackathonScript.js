function openTab(tabName) {
    var i, tabContent, tabButtons;
    tabContent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabContent.length; i++) {
        if (tabContent[i].id === tabName) {
            tabContent[i].classList.add("active");
        } else {
            tabContent[i].classList.remove("active");
        }
    }
    tabButtons = document.getElementsByClassName("tab-button");
    for (i = 0; i < tabButtons.length; i++) {
        if (tabButtons[i].innerText.toLowerCase() === tabName) {
            tabButtons[i].classList.add("active");
        } else {
            tabButtons[i].classList.remove("active");
        }
    }
}

// document.getElementById('csvFileInput').addEventListener('change', function() {
//     var file = this.files[0];
//     if (file) {
//         var reader = new FileReader();
//         reader.onload = function(event) {
//             var csvData = event.target.result;
//             var csvRows = csvData.split('\n');
//             var tableBody = document.querySelector('#csvTable tbody');
//             var tableHeaders = document.querySelector('#csvTable thead');

//             // Clear existing table contents
//             tableBody.innerHTML = '';
//             tableHeaders.innerHTML = '';

//             // Extract headers from the first row
//             var headers = csvRows[0].split(',');

//             // Populate table headers
//             var headerRow = document.createElement('tr');
//             headers.forEach(function(header) {
//                 var th = document.createElement('th');
//                 th.textContent = header.trim();
//                 headerRow.appendChild(th);
//             });
//             tableHeaders.appendChild(headerRow);

//             // Populate table rows
//             csvRows.slice(1).forEach(function(csvRow) {
//                 var rowCells = csvRow.split(',');
//                 var tableRow = document.createElement('tr');
//                 rowCells.forEach(function(cellData) {
//                     var tableCell = document.createElement('td');
//                     tableCell.textContent = cellData.trim();
//                     // Make cells editable
//                     tableCell.setAttribute('contenteditable', true);
//                     tableRow.appendChild(tableCell);
//                 });
//                 tableBody.appendChild(tableRow);
//             });
//         };
//         reader.readAsText(file);
//     }
// });