type Json = string | number | boolean | JsonObject<unknown> | Array<Json>;

type JsonObject<T> = { [k in keyof T]: Json };

type KnockoutComputedFunction<T> =
  | (() => T)
  | {
      read(): T;
      write(v: T): void;
    };

type KnockoutSubscriptionCallback<T> = (v: T) => void;

interface KnockoutLifeCycle {
  computed<T>(p: string | KnockoutComputedFunction<T>): KnockoutComputed<T>;
  subscribe<T>(
    o: KnockoutSubscribable<T>,
    fn: KnockoutSubscriptionCallback<T>
  ): KnockoutSubscription;
  anchorTo(e: HTMLElement): void;
  addDisposable(o: KnockoutLifeCycle): void;
  dispose(): void;
  addEventListener(...args: Parameters<typeof window.addEventListener>): void;
}

interface KnockoutObservableArray<T> {
  map<U>(
    callbackfn: (value: T, index: number, array: T[]) => U
  ): KnockoutObservableArray<U>;
}

interface KnockoutComponentConstructor {
  new (): KnockoutLifeCycle;
  register(name?: string): void;
}

interface KnockoutStatic {
  Component: KnockoutComponentConstructor;
}

interface Window {
  ko: KnockoutStatic;
}

interface TKOStatic extends KnockoutStatic {
  applyBindings(viewModelOrBindingContext?: any, rootNode?: any): Promise<any>;
}

declare module '@tko/build.reference/dist/build.reference.es6' {
  const tko: TKOStatic;
  export = tko;
}
