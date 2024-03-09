fun testForLoop(): Int {
    let sum: Int = 0;
    for (let i: Int = 0; i < 10; i += 1) {
        sum += i;
        if (sum == 5) {
            sum += 100;
        }
    }
    return sum;
}