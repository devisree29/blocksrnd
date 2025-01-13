export default async function decorate(block) {
  // Helper function to recursively parse <ul> and <li> into a JSON structure
  function parseListToJSON(list) {
    const nodes = [];
    const items = [...list.children];

    items.forEach((item) => {
      const node = {
        text: item.firstChild.textContent.trim(), // Get the text content
        children: [],
      };

      // Check if this <li> has a nested <ul> (children)
      const nestedList = item.querySelector('ul');
      if (nestedList) {
        node.children = parseListToJSON(nestedList); // Recursively parse
      }

      nodes.push(node);
    });

    return nodes;
  }

  // Find the <ul> in the block
  const ul = block.querySelector('ul');
  if (!ul) return; // If no list is present, exit

  // Parse the <ul> into JSON structure
  const mindMapData = parseListToJSON(ul);

  // Create a container for the mind map
  const mindMapContainer = document.createElement('div');
  mindMapContainer.className = 'mind-map-container';

  // Helper function to render the mind map recursively
  function renderMindMap(node, container) {
    const nodeElement = document.createElement('div');
    nodeElement.className = 'mind-map-node';
    nodeElement.textContent = node.text;

    // Add the node element to the container
    container.appendChild(nodeElement);

    // If there are children, create a container for them
    if (node.children && node.children.length > 0) {
      const branchContainer = document.createElement('div');
      branchContainer.className = 'mind-map-branch';
      node.children.forEach((child) => renderMindMap(child, branchContainer));
      container.appendChild(branchContainer);
    }
  }

  // Render the parsed JSON as a mind map
  mindMapData.forEach((node) => renderMindMap(node, mindMapContainer));

  // Clear the block content and append the decorated mind map
  block.innerHTML = '';
  block.appendChild(mindMapContainer);
}

