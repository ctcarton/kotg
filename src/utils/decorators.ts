/**
 * Various Typescript decorators.
 */

/**
 * Computeds
 */
const COMPUTED_SYM = Symbol('Decorating Computeds');
export const MEMOIZATIONS = Symbol('Memoizations');

export function memoize() {
  return (_: object, propertyKey: string, descriptor: PropertyDescriptor) => {
    const v = descriptor.get;
    if (typeof v !== 'function') {
      throw new Error(`@memoize can only apply to a getter.`);
    }

    descriptor.get = function () {
      const m = this[MEMOIZATIONS] || (this[MEMOIZATIONS] = {});
      return propertyKey in m
        ? m[propertyKey]
        : (m[propertyKey] = v.call(this, propertyKey));
    };
  };
}

function getOrMakeComputed(
  instance: KnockoutLifeCycle,
  fn: any,
  propertyKey: string,
  extenders: ComputedExtenders
) {
  if (!instance[COMPUTED_SYM]) {
    instance[COMPUTED_SYM] = {};
  }
  const params = {
    read: () => fn.call(instance),
    write(v) {
      fn.call(instance, v);
    },
    deferEvaluation: true,
  };

  return (
    instance[COMPUTED_SYM][propertyKey] ||
    (instance[COMPUTED_SYM][propertyKey] = (
      instance.computed ? instance.computed(params) : ko.pureComputed(params)
    ).extend(extenders))
  );
}

type ComputedExtenders = {
  deferred?: true;
  arrayProperties?: boolean;
  rateLimit?: number;
  readInAnimationFrame?: true;
};

export function computed(
  extenders: ComputedExtenders = { deferred: true }
): MethodDecorator {
  return (_, propertyKey: string, descriptor: PropertyDescriptor) => {
    const v = descriptor.get || descriptor.value;
    if (typeof v !== 'function') {
      throw new Error(`@computed can only apply to a method or getter.`);
    }

    if ('get' in descriptor) {
      descriptor.get = function () {
        return getOrMakeComputed(this, v, propertyKey, extenders)();
      };
    } else if ('value' in descriptor) {
      delete descriptor.value;
      delete descriptor.writable;
      Object.assign(descriptor, {
        get() {
          return getOrMakeComputed(this, v, propertyKey, extenders);
        },
      });
    }
    return descriptor;
  };
}

function _wrapCall(descriptor: PropertyDescriptor, fn: () => any) {
  const prop = 'get' in descriptor ? 'get' : 'value';
  const original = descriptor[prop];
  if (!original) {
    throw new Error(`Cannot override descriptor.`);
  }
  descriptor[prop] = fn;
  return original;
}

let debugCall = 0;
export function debug(maxCalls = 10000): MethodDecorator {
  return (
    target: KnockoutComponentConstructor,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) => {
    const o = `${target.constructor.name}.${propertyKey}`;
    const original = _wrapCall(descriptor, function (...args) {
      const callNo = ++debugCall;
      console.debug(`@debug[${callNo}] ${o}(`, ...args, ')');
      if (debugCall > maxCalls) {
        throw new Error(`${o} exceeded max debug calls: ${maxCalls}`);
      }
      const r = original.call(this, ...args);
      console.debug(`@debug[${callNo}]     =>`, r);
      return r;
    });
    return descriptor;
  };
}

/**
 * Error after `maxCalls` to this function.
 * Useful for stopping & debugging infinite recursion/dependencies.
 */
export function debugAfterCallCount(maxCalls = 50): MethodDecorator {
  return (
    target: KnockoutComponentConstructor,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) => {
    let count = 0;
    const original = _wrapCall(descriptor, function (...args) {
      if (++count > maxCalls) {
        console.error(
          `${target.constructor.name}.${propertyKey} > ${maxCalls} calls`
        );
        debugger;
      }
      return original.call(this, ...args);
    });
    return descriptor;
  };
}
