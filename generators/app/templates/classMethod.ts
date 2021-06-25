describe('<%= className %>', async () => {
    let classUnderTest: <%= className %>
    
    beforeEach(() => {
        jest.resetAllMocks()
        classUnderTest = new <%= className %>()
    })

    describe('<%= methodName %>', async () => {
        <% for (testTitle of testTitles) { %>
             it('<%= testTitle %>', async () => {})
        <% } %>
    })
})
