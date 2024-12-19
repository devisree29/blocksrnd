export default function decorate(block) {
  // Step 1: Read data from the block
  const rows = parseInt(block.dataset.rows, 10) || 3;
  const columns = parseInt(block.dataset.columns, 10) || 3;
  const header = block.dataset.header || 'Default Header';
  const description = block.dataset.description || 'Default Description';

  // Step 2: Create table header and description
  const headerEl = document.createElement('div');
  headerEl.className = 'cogna-table-header';
  headerEl.innerHTML = `
    <h2>${header}</h2>
    <p>${description}</p>
  `;
  block.appendChild(headerEl);

  // Step 3: Generate rows and columns
  for (let i = 0; i < rows; i++) {
    const row = document.createElement('div');
    row.className = 'cogna-table-row';

    for (let j = 0; j < columns; j++) {
      const cell = document.createElement('div');
      cell.className = 'cogna-table-cell';
      cell.contentEditable = true;
      cell.textContent = `R${i + 1}C${j + 1}`;
      row.appendChild(cell);
    }

    block.appendChild(row);
  }
}
