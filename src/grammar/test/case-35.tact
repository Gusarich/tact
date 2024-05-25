fun foo() {
    let x: Int = 44;
    
    {
        // I'm a block statement
        let x: Int = 42;
    }

    {
        // I'm a block statement 2
        let x: Int = 43;
    }
}