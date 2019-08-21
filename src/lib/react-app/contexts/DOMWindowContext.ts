import { createContext } from "react";

const DOMWindowContext = createContext<Window>((global as any).window);

export default DOMWindowContext;
