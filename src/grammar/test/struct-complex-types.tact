struct A {
    a: Int; // regular
    b: Int?; // optional
    c: Int or String; // either
    d: Int? or String; // either with optional
    e: Int or String?; // either with optional
    f: Int? or String?; // either with both optional
    g: (Int or String)?; // optional either
}