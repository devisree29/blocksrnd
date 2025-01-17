// Import D3.js library
import * as d3 from 'https://d3js.org/d3.v7.min.js';

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

// Main function to decorate the mind map block
export default async function decorate(block) {
  // Locate the <ul> in the block
  const ul = block.querySelector('ul');
  if (!ul) return; // Exit if no <ul> found

  // Parse the <ul> into a JSON structure
  const mindMapData = {
    text: "Root",
    children: parseListToJSON(ul),
  };

  // Set up SVG dimensions
  const width = block.clientWidth || 800;
  const height = block.clientHeight || 600;

  // Clear block content and create an SVG container
  block.innerHTML = '';
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

  // Create a tree layout
  const tree = d3.tree().size([height, width - 200]);

  // Convert the JSON data into a hierarchy
  const root = d3.hierarchy(mindMapData);

  // Generate the tree layout
  tree(root);

  // Add links (connections between nodes)
  svg.selectAll('.link')
    .data(root.links())
    .enter()
    .append('path')
    .attr('class', 'link')
    .attr('d', d3.linkHorizontal()
      .x((d) => d.y)
      .y((d) => d.x));

  // Add nodes
  const node = svg.selectAll('.node')
    .data(root.descendants())
    .enter()
    .append('g')
    .attr('class', 'node')
    .attr('transform', (d) => `translate(${d.y},${d.x})`)
    .on('click', (event, d) => {
      // Toggle children on click
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
      decorate(block); // Re-render the tree
    });

  // Add circles to represent nodes
  node.append('circle')
    .attr('r', 5);

  // Add labels for nodes
  node.append('text')
    .attr('dy', 3)
    .attr('x', (d) => (d.children ? -10 : 10))
    .style('text-anchor', (d) => (d.children ? 'end' : 'start'))
    .text((d) => d.data.text);
}
