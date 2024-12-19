export default function decorate(block) {
  // Step 1: Read data from the block
  const rows = parseInt(block.dataset.rows, 10) || 3;
  const columns = parseInt(block.dataset.columns, 10) || 3;
  const header = block.dataset.header || 'Default Header';
  const description = block.dataset.description || 'Default Description';

  // Step 2: Create table container
  const tableContainer = document.createElement('div');
  tableContainer.className = 'cogna-table-container';

  // Step 3: Create table header and description
  const headerEl = document.createElement('div');
  headerEl.className = 'cogna-table-header';
  headerEl.innerHTML = `
    <h2>${header}</h2>
    <p>${description}</p>
  `;
  tableContainer.appendChild(headerEl);

  // Step 4: Create <table> element
  const table = document.createElement('table');
  table.className = 'cogna-table';

  // Step 5: Create table rows and columns
  for (let i = 0; i < rows; i++) {
    const row = document.createElement('tr'); // Use <tr> for rows

    for (let j = 0; j < columns; j++) {
      const cell = i === 0 ? document.createElement('th') : document.createElement('td'); // Use <th> for the first row
      cell.contentEditable = true; // Make cells editable
      cell.textContent = i === 0 ? `Header ${j + 1}` : `R${i}C${j + 1}`; // Add header or row content
      row.appendChild(cell);
    }

    table.appendChild(row);
  }

  // Append table to the container
  tableContainer.appendChild(table);

  // Append container to the block
  block.appendChild(tableContainer);
}
