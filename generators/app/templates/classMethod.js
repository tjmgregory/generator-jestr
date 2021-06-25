describe('<%= className %>', async () => {
    let classUnderTest
    
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
