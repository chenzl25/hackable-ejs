var ejs = require("./hackable-ejs");


var template = `
<ul>
  <% for (var i = 0; i < users.length; i++) { %>
    <li> users.name </li>
  <% } %>
</ul>
`;

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