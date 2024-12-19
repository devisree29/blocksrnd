export default function decorate(block) {
  // Step 1: Read rows and columns from block dataset
  const rows = parseInt(block.dataset.rows, 10) || 3; // Default to 3 rows
  const columns = parseInt(block.dataset.columns, 10) || 3; // Default to 3 columns
  const header = block.dataset.header || 'Default Header'; // Default table header
  const description = block.dataset.description || 'Default Description'; // Default table description

  // Step 2: Capture the children before clearing the block
  const children = [...block.children]; // Clone children into an array

  // Clear block content after capturing its children
  block.textContent = '';

  // Step 3: Create table container
  const tableContainer = document.createElement('div');
  tableContainer.className = 'cogna-table-container';

  // Step 4: Add header and description
  const headerEl = document.createElement('div');
  headerEl.className = 'cogna-table-header';
  headerEl.innerHTML = `
    <h2>${header}</h2>
    <p>${description}</p>
  `;
  tableContainer.appendChild(headerEl);

  // Step 5: Create table
  const table = document.createElement('table');
  table.className = 'cogna-table';

  // Step 6: Align children into rows and columns
  let childIndex = 0;

  for (let i = 0; i < rows; i++) {
    const tableRow = document.createElement('tr');
    tableRow.className = 'cogna-table-row';

    for (let j = 0; j < columns; j++) {
      const tableCell = i === 0 ? document.createElement('th') : document.createElement('td');
      tableCell.className = 'cogna-table-cell';

      // Assign content from block's children if available
      if (children[childIndex]) {
        tableCell.appendChild(children[childIndex]); // Move the child element into the cell
        childIndex++;
      } else {
        // If no more children, leave the cell empty
        tableCell.textContent = '';
      }

      tableRow.appendChild(tableCell);
    }

    table.appendChild(tableRow);
  }

  // Append the table to the container
  tableContainer.appendChild(table);

  // Append the container to the block
  block.appendChild(tableContainer);
}
