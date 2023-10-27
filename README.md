# Searchlight Client
This is the client for Searchlight

## React + TypeScript + Vite + AngularJS

The core of this project is generated from Vite from a React, Typescript and SWC (babel replacement) template
[@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/)
Inside that core is an AngularJS app started in 2015 that will be gradually replaced with React

Routing is heavily influenced by https://medium.com/@pacawrights.dev/angular-js-to-react-the-easy-way-c3c4454de385

## Why Vite? Why not CRA, NextJS, Remix, Parcel?
I was going to use CRA, but I found it was "silently deprecated" https://github.com/facebook/create-react-app/issues/13072
On the website they recommended NextJS or Remix (Full-stack Server side rendering frameworks)
The 4 choices laid out in the official response are NextJS, Remix, Parcel and Vite.
Our use-case matches Vite and Parcel the best, and Vite seems to have more traction.
```
Some projects will never fit into any popular [Server side rendering] framework's mold, and that's okay.
Maybe you're developing an internal dashboard that needs to integrate with a PHP site, 
and none of the frameworks let you do that very easily.
That's a great use case for a lower-level tool like Parcel or purely client-side Vite templates.
```
(see https://github.com/reactjs/react.dev/pull/5487#issuecomment-1409720741)

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
   parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
   },
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
