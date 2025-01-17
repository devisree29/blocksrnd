// Function to parse nested <ul> and <li> into a JSON structure
function parseListToJSON(list) {
  const nodes = [];
  const items = [...list.children];

  items.forEach((item) => {
    const node = {
      text: item.firstChild.textContent.trim(),
      children: [],
    };

    const nestedList = item.querySelector('ul');
    if (nestedList) {
      node.children = parseListToJSON(nestedList);
    }

    nodes.push(node);
  });

  return nodes;
}

// Main function to render the mind map
function decorate(block) {
  const ul = block.querySelector('ul');
  if (!ul) return;

  // Parse the <ul> into a JSON structure
  const mindMapData = {
    text: "Root",
    children: parseListToJSON(ul),
  };

  const width = block.clientWidth;
  const height = block.clientHeight;

  // Clear block content
  block.innerHTML = '';

  // Add SVG container
  const svg = d3.select(block)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .call(d3.zoom().on('zoom', (event) => {
      g.attr('transform', event.transform);
    }))
    .append('g');

  // Tree layout
  const tree = d3.tree().size([height, width - 200]);

  // Convert JSON data to hierarchy
  const root = d3.hierarchy(mindMapData);

  // Generate tree layout
  tree(root);

  // Add links
  svg.selectAll('.link')
    .data(root.links())
    .enter()
    .append('path')
    .attr('class', 'link')
    .attr('d', d3.linkHorizontal()
      .x(d => d.y)
      .y(d => d.x));

  // Add nodes
  const node = svg.selectAll('.node')
    .data(root.descendants())
    .enter()
    .append('g')
    .attr('class', 'node')
    .attr('transform', d => `translate(${d.y},${d.x})`)
    .on('click', (event, d) => {
      // Expand/collapse nodes
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
      decorate(block); // Re-render
    });

  // Add circles to nodes
  node.append('circle')
    .attr('r', 5);

  // Add labels
  node.append('text')
    .attr('dy', 3)
    .attr('x', d => d.children ? -10 : 10)
    .style('text-anchor', d => d.children ? 'end' : 'start')
    .text(d => d.data.text);
}

// Execute mind map rendering
document.addEventListener('DOMContentLoaded', () => {
  const block = document.getElementById('mind-map-block');
  decorate(block);
});
