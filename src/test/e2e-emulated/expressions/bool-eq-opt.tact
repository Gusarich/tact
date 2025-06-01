contract BoolEqOpt {

    init() {}
    receive() {}

    get fun eqTrue(x: Bool): Int {
        return x == true ? 1 : 0;
    }

    get fun eqFalse(x: Bool): Int {
        return x == false ? 1 : 0;
    }

    get fun neqTrue(x: Bool): Int {
        return x != true ? 1 : 0;
    }

    get fun neqFalse(x: Bool): Int {
        return x != false ? 1 : 0;
    }

    get fun trueEq(x: Bool): Int {
        return true == x ? 1 : 0;
    }

    get fun falseEq(x: Bool): Int {
        return false == x ? 1 : 0;
    }

    get fun trueNeq(x: Bool): Int {
        return true != x ? 1 : 0;
    }

    get fun falseNeq(x: Bool): Int {
        return false != x ? 1 : 0;
    }

    get fun eqTrueBool(x: Bool): Bool {
        return x == true;
    }

    get fun eqFalseBool(x: Bool): Bool {
        return x == false;
    }

    get fun neqTrueBool(x: Bool): Bool {
        return x != true;
    }

    get fun neqFalseBool(x: Bool): Bool {
        return x != false;
    }

    get fun trueEqBool(x: Bool): Bool {
        return true == x;
    }

    get fun falseEqBool(x: Bool): Bool {
        return false == x;
    }

    get fun trueNeqBool(x: Bool): Bool {
        return true != x;
    }

    get fun falseNeqBool(x: Bool): Bool {
        return false != x;
    }
}
