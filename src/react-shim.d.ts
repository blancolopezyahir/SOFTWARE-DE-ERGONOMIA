declare module 'react' {
  export const StrictMode: any;
  export function useEffect(...args: any[]): any;
  export function useMemo<T>(factory: () => T, deps: any[]): T;
  export function useRef<T>(initial?: T): { current: T };
  export function useState<T>(initial: T | (() => T)): [T, (value: T | ((prev: T) => T)) => void];
}
declare module 'react-dom/client' { export function createRoot(el: Element): { render(node: any): void }; }
declare namespace JSX { interface IntrinsicElements { [elemName: string]: any } }
