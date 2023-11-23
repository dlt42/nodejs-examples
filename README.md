# nodejs-examples
 Node.js Examples

### Scripts

#### `npm run start:dev`

Runs the app using `nodemon` and `ts-node` for hot reloading.

#### `npm run start`

Runs the app using the build.

#### `npm run build`

Builds the app in the `build` folder.

#### `npm run test`

Runs the `jest` tests.

#### `npm run test:dev`

Run the `jest` tests in watch mode.

#### `npm run prettier-format`

Formats the code.

#### `npm run prettier-watch`

Format the code in watch mode.


#### `npm run blockifyTest`

Examples:

```
npm run blockifyTest -- --output ouputColBlockify.png --input input.png --split 40 

npm run blockifyTest -- --output ouputBWBlockify.png --input input.png --split 10 --mode bw
```

#### `npm run bandifyTest`

Examples:

```
npm run bandifyTest -- --output ouputColBandify.png --input input.png --band 4 

npm run bandifyTest -- --output ouputBWBandify.png --input input.png --band 8 --mode bw
```