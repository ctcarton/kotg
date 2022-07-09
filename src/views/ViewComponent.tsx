import tko from '@tko/build.reference/dist/build.reference.es6';
import { default as jssLib, StyleSheet } from 'jss';
import jssPreset from 'jss-preset-default'

jssLib.setup(jssPreset())

const staticStyles = {};
const JSS = Symbol('Memoized ViewComponent.jss');

type VCType = { css: Record<string, any> };

type JSS<VC extends VCType> = {
  [x in keyof VC['css']]: string;
};

export default abstract class ViewComponent<T extends VCType> extends tko.Component {
  private _styles: any;

  protected get koEvents () {
    const koEventEntries = Object.getOwnPropertyNames(this.constructor.prototype)
      .map(p => p.match(/^on([A-Z].*)$/))
      .filter(v => v)
      .map(m => [m[1].toLowerCase(), this[m[0]].bind(this)])
    return Object.fromEntries(koEventEntries)
  }

  /**
   * Overwrites the tko.Component.customElementName because of an import issue.
   */
  static get customElementName() {
    return this.name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  }

  dispose() {
    super.dispose();
    if (this._styles) {
      jssLib.removeStyleSheet(this._styles);
    }
  }

  static get styles(): StyleSheet {
    if (this.name in staticStyles) {
      return staticStyles[this.name];
    }
    if (!this.css) {
      return { classes: {} } as StyleSheet;
    }
    return this.compileAndInsertStyles();
  }

  /**
   * This registers and inserts the static styles.
   * The order of the static styles with the same CSS level of precedence are
   * last-inserted-is-used, so it's important that these are inserted
   * in a stable order, which is the order of `.register`.
   *
   * @see sc-9360
   * @see sc-9677
   * @see https://stackoverflow.com/a/25105828
   */
  private static compileAndInsertStyles() {
    const options = {
      meta: `🎨  Static Classes for ${this.name}`,
      generateId: (v) => `${this.name}__${v.key}`,
    };
    const sheet = jssLib.createStyleSheet(this.css, options).attach();
    return (staticStyles[this.name] = sheet);
  }

  /**
   * Return the classes object for our JSS/CSS.
   */
  get jss(): JSS<T> {
    const ctor = this.constructor as typeof ViewComponent;
    return (
      this[JSS] ||
      (this[JSS] = {
        ...ctor.styles.classes,
      })
    );
  }

  /**
   * @return {object} containing JSS-style classes that apply to every
   * instance of this class.
   *
   * This is higher performance than `get css`
   */
  static get css() {
    return {} as const;
  }

  /**
   * Called when the component is removed from the DOM.  Must be on the
   * prototype (for performance we don't add a callback for every component).
   */
  disconnectedCallback?(node: HTMLElement): void;

  static register(name = this.customElementName) {
    const registration = super.register(name);
    this.compileAndInsertStyles();
    const wantsCallback = 'disconnectedCallback' in this.prototype;
    if (!wantsCallback) {
      return;
    }
    if (window.customElements) {
      customElements.define(
        name,
        class extends HTMLElement {
          disconnectedCallback(this: HTMLElement) {
            const component = ko.dataFor(this.children[0]);
            if (component) {
              component.disconnectedCallback(this);
            }
          }
        }
      );
    } else if (!globalThis.process) {
      console.warn(`"window.customElements" is not available.  Unable to
      register lifecycls connected/disconnected variables.`);
    }

    return registration;
  }
}
