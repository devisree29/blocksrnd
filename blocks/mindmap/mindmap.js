// Function to parse nested <ul> and <li> into a JSON structure
function parseListToJSON(list) {
  const nodes = [];
  const items = [...list.children];

  items.forEach((item) => {
    const node = {
      text: item.firstChild.textContent.trim(), // Get the text content
      children: [],
    };

    const nestedList = item.querySelector('ul'); // Check for nested <ul>
    if (nestedList) {
      node.children = parseListToJSON(nestedList); // Recursively parse children
    }

    nodes.push(node);
  });

  return nodes;
}

// Function to generate random colors
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  return `#${Array.from({ length: 6 })
    .map(() => letters[Math.floor(Math.random() * 16)])
    .join('')}`;
}

// Function to render the mind map recursively
function renderMindMap(node, container, branchColor = null) {
  // Create the current node
  const nodeElement = document.createElement('div');
  nodeElement.className = 'mind-map-node';
  nodeElement.textContent = node.text;

  // Add the node element to the container
  container.appendChild(nodeElement);

  // If the node has children, create a branch container
  if (node.children && node.children.length > 0) {
    const branchContainer = document.createElement('div');
    branchContainer.className = 'mind-map-branch';

    // Apply random color to branches
    branchContainer.style.borderLeft = `2px solid ${branchColor || getRandomColor()}`;

    // Recursively render each child
    node.children.forEach((child) => {
      renderMindMap(child, branchContainer, branchColor || getRandomColor());
    });

    container.appendChild(branchContainer);
  }
}

// Main function to decorate the mind map block
export default async function decorate(block) {
  // Locate the <ul> in the block
  const ul = block.querySelector('ul');
  if (!ul) return; // Exit if no <ul> found

  // Parse the <ul> into a JSON structure
  const mindMapData = parseListToJSON(ul);

  // Create a container for the mind map
  const mindMapContainer = document.createElement('div');
  mindMapContainer.className = 'mind-map-container';

  // Render each root node
  mindMapData.forEach((node) => renderMindMap(node, mindMapContainer));

  // Clear the block content and append the mind map container
  block.innerHTML = '';
  block.appendChild(mindMapContainer);
}
