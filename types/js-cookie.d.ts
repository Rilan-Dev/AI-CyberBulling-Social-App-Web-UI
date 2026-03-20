declare module 'js-cookie' {
    interface CookieAttributes {
      expires?: number | Date;
      path?: string;
      domain?: string;
      secure?: boolean;
      sameSite?: 'strict' | 'lax' | 'none';
    }
  
    interface CookiesStatic {
      /**
       * Create a cookie
       */
      set(name: string, value: string | object, options?: CookieAttributes): string | undefined;
      
      /**
       * Read cookie
       */
      get(name: string): string | undefined;
      
      /**
       * Read all available cookies
       */
      get(): {[key: string]: string};
      
      /**
       * Delete cookie
       */
      remove(name: string, options?: CookieAttributes): void;
      
      /**
       * Get Cookies.withConverter() instance
       */
      withConverter(converter: {
        read: (value: string, name: string) => string;
        write: (value: string, name: string) => string;
      }): CookiesStatic;
    }
  
    const Cookies: CookiesStatic;
    export default Cookies;
  }
  