export { default } from "./server";
export * from "./server";

if (module.hot) {
  module.hot.accept(["./server"], () => {
    console.log("in server/index, server changed");
  });
}
