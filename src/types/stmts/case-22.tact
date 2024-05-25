primitive Int;

fun test(): Int {
    let x: Int = 0;
    let a: Int = 3;
    {
        let a: Int = 4;
        x += a;
    }
    return a;
}