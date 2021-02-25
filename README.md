# next-generator

## Introduction

This repo is basically the configuration of a CLI, using InquirerJS, for generating Typescript
ready to go projects, when you execute that, will basically ask you if you want a Next project with
Redux or not, also the name, and if you want to install the dependencies already.

It's a very straightforward way to execute the things, because it creates a brand new, ready to go
project for you.

This project was based on the following repo:
[Next-Typescript-Redux](https://github.com/felipemeriga/next-typescript-redux-template). Which
is a repo dedicated to show how to properly configure Redux with Next. As Next uses a static
pages concept, configuring Redux in the old common way, creating the store, and injecting it as a provider in 
your main app.tsx component, may cause some errors, when you navigate between the static pages, with some issues
to inject reducers and dispatch actions as props for each of the components.

When Next.js static site generator or server side rendering is involved, however, things start to get complicated as another store instance is needed on the server to render Redux-connected components.

Due to that reasons, the package [next-redux-wrapper](https://github.com/kirill-konshin/next-redux-wrapper) comes in handy: It automatically creates the store instances for you and makes sure they all have the same state.

So, the [Next-Typescript-Redux](https://github.com/felipemeriga/next-typescript-redux-template) uses the best practices of 
this package, to find a proper way to integrate Next with Redux, doing it in a pragmatical way.


## How Does Next-Redux-Wrapper works

For more detailed information how this works in the background, use the following link:

[next-redux-wrapper](https://github.com/kirill-konshin/next-redux-wrapper) 


## How Does This Repo Works?

Basically, this repo uses InquirerJS package, for guiding the user through questions, and use those
answers to generate a project. The main file, which contains all the steps, and workflow is
[index.ts](/src/index.ts), and the project templates are located in [templates](src/templates/).

There are basically 3 questions when the user executes it:
- Which kind of template you want (A list will be displayed).
- What is the name of the project.
- Do you want this cli to automatically install the dependencies.
    - In the case the user wants to install, it will ask if he wants to use NPM or Yarn.
    

For displaying the options of templates, the typescript code basically scans all the available directories
inside [](src/templates) folder, and them after all the questions as answered, just copy the project to a new folder,
with the given name, and in the path where the user wants.

## How To Use That Generator

This generator it's currently publish under the NPM registry [@felipemeriga/next-generator](https://www.npmjs.com/package/@felipemeriga/next-generator),
it's very straightforward to use that, just run the commands:
```bash
npm install -g @felipemeriga/next-generator
next-generator
```

After this, you would be able to run your generated project.

## How To Use It Locally Without Installing the NPM Package

You can either run it as a dev environment, or build and set a symbolic link to
make this cli accessible at any directory of your computer.

Running for development:
```bash
npm start
```

Building and creating a sym link
```bash
npm run build
npm link
```

## Some Publishing Advice

This is a scoped NPM package, under @felipemeriga/next-generator, but there are some important things
that you need to change on your package.json file to make everything work properly.

- The name of the scoped package, must have your username in the beginning:
```json
  "name": "@felipemeriga/next-generator",
```

- For public access, just set this:
```json
    "publishConfig": {
      "access": "public"
    }
```

- For pre-building the project before push
```json
  "prepublish": "npm run build",
```

## Steps for Pushing the Package
```bash
npm login
npm publish
```
