describe('<%= methodName %>', async () => {
    <% for (testTitle of testTitles) { %>
         it('<%= testTitle %>', async () => {})
    <% } %>
})
