export default async function decorate(block) {
  function parseListToJSON(list) {
    const nodes = [];
    const items = [...list.children];

    items.forEach((item) => {
      const node = {
        text: item.firstChild.textContent.trim(), // Get the text content
        children: [],
      };

      const nestedList = item.querySelector('ul');
      if (nestedList) {
        node.children = parseListToJSON(nestedList); // Recursively parse
      }

      nodes.push(node);
    });

    return nodes;
  }

  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  function renderMindMap(node, container, branchColor = null) {
    const nodeElement = document.createElement('div');
    nodeElement.className = 'mind-map-node';
    nodeElement.textContent = node.text;

    // Add branch container if children exist
    if (node.children && node.children.length > 0) {
      const branchContainer = document.createElement('div');
      branchContainer.className = 'mind-map-branch';

      // Assign a random color to this branch
      const branchStyle = `2px solid ${branchColor || getRandomColor()}`;
      branchContainer.style.borderLeft = branchStyle;

      node.children.forEach((child) => {
        // Pass the same branch color to all children
        renderMindMap(child, branchContainer, branchColor || getRandomColor());
      });

      container.appendChild(branchContainer);
    }

    container.appendChild(nodeElement);
  }

  const ul = block.querySelector('ul');
  if (!ul) return;

  const mindMapData = parseListToJSON(ul);

  const mindMapContainer = document.createElement('div');
  mindMapContainer.className = 'mind-map-container';

  mindMapData.forEach((node) => renderMindMap(node, mindMapContainer));

  block.innerHTML = '';
  block.appendChild(mindMapContainer);
}
