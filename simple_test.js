var ejs = require("./hackable-ejs");
var template = `
<h1>Users</h1>

<% function user(user) { %>
  <li>
    <strong><%= user.name %></strong> is a <%= user.age %> year old <%= user.species %>.</li>
<% } %>

<ul>
  <% users.map(user) %>
</ul>

"`;


var data = {
  users: [
    { name: 'Tobi', age: 2, species: 'ferret' }
  , { name: 'Loki', age: 2, species: 'ferret' }
  , { name: 'Jane', age: 6, species: 'ferret' }
  ]
};


var render = ejs.compile(template);
var result = render(data);
console.log(result);
if (ejs.error) {
  console.log(ejs.error);
}