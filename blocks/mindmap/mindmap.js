// Debugging: Ensure D3.js is loaded globally
console.log('D3.js loaded:', d3);

// Function to parse nested <ul> and <li> into JSON
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

// Main function to decorate the mind map block
export default async function decorate(block) {
  const ul = block.querySelector('ul');
  if (!ul) {
    console.error('No <ul> found in the block.');
    return;
  }

  const mindMapData = {
    text: 'Root',
    children: parseListToJSON(ul),
  };

  const width = block.clientWidth || 800;
  const height = block.clientHeight || 600;

  block.innerHTML = ''; // Clear block content

  try {
    const svg = d3.select(block)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .call(
        d3.zoom().on('zoom', (event) => {
          g.attr('transform', event.transform);
        })
      )
      .append('g');

    const tree = d3.tree().size([height, width - 200]);
    const root = d3.hierarchy(mindMapData);

    tree(root);

    svg.selectAll('.link')
      .data(root.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', d3.linkHorizontal()
        .x((d) => d.y)
        .y((d) => d.x));

    const node = svg.selectAll('.node')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', (d) => `translate(${d.y},${d.x})`);

    node.append('circle').attr('r', 5);

    node.append('text')
      .attr('dy', 3)
      .attr('x', (d) => (d.children ? -10 : 10))
      .style('text-anchor', (d) => (d.children ? 'end' : 'start'))
      .text((d) => d.data.text);
  } catch (error) {
    console.error('Error rendering the mind map:', error);
  }
}
