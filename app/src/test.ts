export interface Tester {
  is(x: any, y: any, message?: string): void;
}

export type Test = (tester: Tester) => Promise<void>

export interface TestClass {
  test: Test
}
