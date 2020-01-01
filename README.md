# rollup-plugin-vuedoc
Rollup plugin to generate markdown documentation from Vue.js component source with @vuedoc/md.

## Usage
1. Install the plugin.
   ```sh
   npm i -D rollup-plugin-vuedoc
   ```
2. Edit the config file to use the plugin.
   ```js
   // rollup.config.js
   
   import vuedoc from 'rollup-plugin-vuedoc';
   
   export default {
     input: 'path/to/entry-point.js',
     ...generalConfigurations,
     plugins: [
       vuedoc({ test: /\.vue$/, prefix: 'docs' }),
       ...otherPlugins,
     ],
   };
   ```
3. Run rollup.
4. Markdown files will be created in the asset path.

## Options

### test
Generate markdown files only if the module ID matches the test. Can be a string,
RegExp, or an array of them.

### prefix
Path prefix for generated markdown files. Files will be put at
\<asset path>/\<prefix>/\<module's relative path>

### intro/outro
String to be prepended before or appended after generated markdown strings. Can
be a string or a function. Function will be called with an argument object including
id of the module.

```js
export default {
  ...generalConfigs,
  plugins: [
    vuedoc({ intro: ({ id }) => `id` }),
    ...otherPlugins,
  ],
};

// Generates markdown files starting with module's ID string.
```
