# nodejs-examples
 Node.js Examples

### Scripts

#### `npm run start:dev`

Runs the app using `nodemon` and `ts-node` for hot reloading.

#### `npm run start`

Runs the app using the build.

#### `npm run build`

Builds the app in the `build` folder.

#### `npm run Executable`

Runs the `jest` Executables.

#### `npm run Executable:dev`

Run the `jest` Executables in watch mode.

#### `npm run prettier-format`

Formats the code.

#### `npm run prettier-watch`

Format the code in watch mode.


#### `npm run blockifyExecutable`

Examples:

```
npm run blockifyExecutable -- --output ouputColBlockify.png --input input.png --blockCount 40 

npm run blockifyExecutable -- --output ouputBWBlockify.png --input input.png --blockCount 10 --mode bw
```

#### `npm run bandifyExecutable`

Examples:

```
npm run bandifyExecutable -- --output ouputColBandify.png --input input.png --band 4 

npm run bandifyExecutable -- --output ouputBWBandify.png --input input.png --band 8 --mode bw
```

#### `npm run splitifyExecutable`

Examples:

```
npm run splitifyExecutable -- --output ouputBWSplitify.png --input input.png --threshold 128

npm run splitifyExecutable -- --output ouputBWSplitify.png --input input.png --threshold 128 --mode bw
```


TODO: Remove this
npm run blockifyExecutable -- --output ouputColBlockify.png --input input.png --blockCount 40 
npm run blockifyExecutable -- --output ouputBWBlockify.png --input input.png --blockCount 10 --mode bw
npm run bandifyExecutable -- --output ouputColBandify.png --input input.png --band 4 
npm run bandifyExecutable -- --output ouputBWBandify.png --input input.png --band 8 --mode bw
npm run splitifyExecutable -- --output ouputColSplitify1.png --input input2.png --t1 50
npm run splitifyExecutable -- --output ouputColSplitify2.png --input input2.png --t1 50 --t2 150
npm run splitifyExecutable -- --output ouputBWSplitify1.png --input input2.png --t1 50 --mode bw
npm run splitifyExecutable -- --output ouputBWSplitify2.png --input input2.png --t1 50 --t2 150 --mode bw
