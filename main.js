var ejs = require("./hackable-ejs");

template = `
<div>
  <% include('template/header') %>
  <div>
    <ul>
      <% students.map(student) %>
    </ul>
  </div>
  <% function student(student) { %>
    <p><%= student.name %></p>
    <span><%= student.age %></span>
    <p>Hobby: <%= student.hobby %></p>
    <% var data = {luckyNumber: student.luckyNumber}; %>
    <% include('template/luckyNumber', data ) %>
  <% } %>
</div>
`;

data = {
  students: [
    { name: 'Tobi', age: 16, hobby: 'Computer' , luckyNumber: [1,3,5]}
  , { name: 'Loki', age: 17, hobby: 'Physics'  , luckyNumber: [2,4,6]}
  , { name: 'Dylan',age: 18, hobby: 'Math'     , luckyNumber: [3,1,4]}
  , { name: 'Jane', age: 19, hobby: 'English'  , luckyNumber: [7,8,9]}
  ]
}

var render = ejs.compile(template);
var result = render(data);
console.log(result);
if (ejs.error) {
  console.log(ejs.error);
}