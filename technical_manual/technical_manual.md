# TASM Technical Manual

## Table of Contents

- [TASM Technical Manual](#tasm-technical-manual)
  * [Table of Contents](#table-of-contents)
  * [Introduction](#introduction)
  * [Glossary](#glossary)
  * [System Architecture](#system-architecture)
    + [Architecture Diagram](#architecture-diagram)
      - [Redux](#redux)
      - [Simulator](#simulator)
      - [Assembler](#assembler)
      - [CPU](#cpu)
    + [Component Model](#component-model)
    + [Data Flow Diagram](#data-flow-diagram)
    + [Operational Model](#operational-model)
      - [Example interactions between components](#example-interactions-between-components)
        * [Assembling a Program](#assembling-a-program)
  * [Testing](#testing)
    + [Unit testing](#unit-testing)
    + [Integration testing](#integration-testing)
    + [User testing](#user-testing)
    + [End-to-end](#end-to-end)
    + [Continuous Integration](#continuous-integration)
  * [Problems](#problems)
    + [Repetitive traversals](#repetitive-traversals)
      - [Problem](#problem)
      - [Solution](#solution)
    + [Parsing Ambiguity](#parsing-ambiguity)
      - [Problem](#problem-1)
      - [Solution](#solution-1)
    + [Timer Interrupt](#timer-interrupt)
      - [Problem](#problem-2)
      - [Solution](#solution-2)
    + [Continuous Integration Failures](#continuous-integration-failures)
      - [Problem](#problem-3)
      - [Solution](#solution-3)
    + [Code Sharing](#code-sharing)
      - [Problem](#problem-4)
      - [Solution](#solution-4)
    + [Cyclic Constants](#cyclic-constants)
      - [Problem](#problem-5)
      - [Solution](#solution-5)
    + [Cowboy Documentation](#cowboy-documentation)
      - [Problem](#problem-6)
      - [Solution](#solution-6)
  * [Deployment](#deployment)
    + [Using docker-compose](#using-docker-compose)
    + [Manually](#manually)
      - [Dependencies](#dependencies)
      - [Get the source code](#get-the-source-code)
      - [Build the frontend](#build-the-frontend)
      - [Copy the frontend to webroot](#copy-the-frontend-to-webroot)
      - [Build the backend](#build-the-backend)
      - [Create a user named 'tasm' in Postgres](#create-a-user-named--tasm--in-postgres)
      - [Create the table in Postgres](#create-the-table-in-postgres)
      - [Start the backend server](#start-the-backend-server)
  * [Future work](#future-work)

## Introduction

TypeScript Assembly Simulator (TASM) is an web-based simulator for a simple microprocessor. The system is aimed at students learning assembly language, or mature users curious about how assembly language works. It runs on any (modern) web browser, and focuses on ease of use and accessibility to ensure that it is available to a diverse a group of people as possible. TASM provides a number of useful features that aim to make it more interactive and enjoyable for learners. The primary features include:  

- A simple 8-bit instruction set roughly based on Intel CPUs from the late 1970s-early 1980s. This is a good instruction set to target because it has a very small set of instructions, and the 8-bit word size makes it far less daunting when stepping through memory.
- A step-by-step debugger to allow users to step through their code and see exactly what effect each instruction is having on the state of the CPU. This is both useful for finding mistakes, and for learning what exactly each instruction is doing.
- Virtual devices to allow users to do more than just manipulate numbers. Virtual devices supported in this implementation are a keyboard, a textual display, a 7-segment display, and a set of traffic lights. Users can use "interrupts" to interact with these devices.
- Code sharing to allow users to send their code to other people, allowing for a more co-operative learning experience.
- An accessible user interface to allow users from a diverse group of backgrounds to use the simulator. This was one of the primary motivators behind our project.  

Two programming languages have been used to implement the system: TypeScript on the frontend, and Elixir on the backend. The React + Redux libraries are used alongside TypeScript to reduce the amount of boilerplate code that has to be written. On the backend, the 'Cowboy' web server library is being used with Elixir.

## Glossary

- *Bytecode*: The internal representation of the instruction set. An array of integers.
- *CPU*: Central Processing Unit. The brain that sits at the centre of your computer.
- *TypeScript*: A programming language. Translates (transpiles) into JavaScript, so it runs in any environment that JavaScript runs in.
- *Instruction set*: The specification containing the list of instructions that a CPU understands.
- *8-bit*: Information within a computer is represented as a sequence of 1s and 0s (ie. binary). 8-bit means that they are organised into groups of 8 digits.
- *Frontend*: The segment of the system that runs on a user's web browser.
- *Backend*: The segment of the system that runs on our server.
- *Firewall*: A piece of software (or sometimes a physical machine) that filters out hostile traffic to secure an application.
- *Reverse proxy*: A program (or server) that sits between users and the actual application. Can be used for security reasons, or for organizing the deployment.
- *Virtual machine*: A computer can run other "fake" computers on itself via a method called virtualisation, and to end users it looks like they've got their own physical computer, when really it's just one pretending to be many. In our case, a cloud provider gives us a virtual machine for our server.

## System Architecture

### Architecture Diagram

Our architecture diagram has the same structure as the one we proposed in our functional specification. This is not surprising, because an architecture diagram is a *very* high-level overview of the system, and the high-level design of a system is unlikely to change unless it presents major challenges during the implementation phase.

![Architecture diagram](https://i.imgur.com/wnWRIWJ.png)

We will give a more detailed description of some of the more important components of the system in order to better outline our implementation.

#### Redux

The Redux component is at the core of our frontend code base. This component is responsible for responding to events that are triggered by the interactive components, and for updating the state of the application as these events are being processed.

#### Simulator

The simulator component is the heart of the logic of our application. The simulator is responsible for assembling source code, and for executing the resulting bytecode. Given that the simulator is the heart of our application's logic, it has the largest code base of all the components.

#### Assembler

The assembler is a sub-component of the simulator. The purpose of the assembler is to transform a string into executable machone code. The assembler consists of a number of stages, each of which has a single purpose. The sub-components is as follows:

- *Parser*: The component responsible for transforming the string containing the user's code into a syntax tree. There is a bit of a divergence from the functional specification here, because our parser does both lexing and parsing in one pass, so they are not separate components.
- *Semantic Checker*: This component performs a number of passes over the syntax tree generated by the preceding component, and each pass looks for errors, e.g. undefined identifiers. The purpose of this pass is to detect mistakes made by the user earlier on so that the code for the latter components is simpler, and better error messages are produced.
- *Transformer*: This component walks the syntax tree, and transforms certain branches into different ones. For example, one of our transformers is to replace all characters in the program (e.g. 'x') with their corresponding ASCII value. This component allows for the code generation phase to be simpler because we can get rid of special cases here.
- *Code generator*: This component takes the tree outputted by the preceding component, and transforms it into executable bytecode. Because we put a lot of work into minifying and checking our syntax tree in the previous passes, this component is actually very simple.

#### CPU

The CPU is another sub-component of the simulator. The purpose of the CPU is to execute bytecode that is produced by the assembler component, and to respond to interrupts that are triggered by some of the virtual devices. The CPU is quite a small component. This because our instruction set was made intentionally minimalistic. The CPU does one of two things when it is invoked:

- If a device is indicating that it has an outstanding interrupt, then that interrupt is handled
- Otherwise, like every real CPU does, the CPU component performs three tasks:
    - Fetch the next instruction
    - Decode the fetched instruction
    - Execute the decoded instruction

### Component Model

As mentioned, our component model is largely the same as we initially planned.

![Component model diagram](https://i.imgur.com/mN9aeNy.png)  

The colour coding is used to indicate which level the components are at. Blue components are the components that provide the low-level functionality, and components on the levels above that integrate these components together to provide a functional application.

### Data Flow Diagram

![Data flow diagram](https://i.imgur.com/H2Ltyij.png)

This diagram remains largely unchanged from our functional specification. The only thing that has changed is the internal structure of some of the processes from how we thought they would be structured.

### Operational Model

We didn't mention a plan for our operational model in the functional specification because it would have been a premature plan. Thus, it will be discussed here.  

![Operational model diagram](https://i.imgur.com/UmSvn1e.png)  

All of our services are hosted on a single cloud VM for convenience &amp; cost reasons. We are using the firewall provided by Digital Ocean to protect us from potential attacks coming from the internet. Our virtual machine is running the latest LTS version of Ubuntu (18.04).

#### Example interactions between components

##### Assembling a Program

![Sequence diagram for assembling a program](https://i.imgur.com/hvb88pQ.png)

This sequence diagram demonstrates the flow of data between the subcomponents of the assembler when a program is being assembled.

## Testing

### Unit testing

A significant portion of our testing effort was used to create unit tests. We decided from the beginning that all components should be complemented with unit tests. This is because it allows for easy refactoring when we were performing cleanups. It also significantly helped us with tracking down issues, because if the tests for a single component started to fail, then it is likely that that component is the one causing issues.  

All of our frontend code is complemented with unit tests (with the exception of UI, which will be described later on).

### Integration testing

We performed integration testing throughout the project to ensure that what we were developing independently would integrate properly when combined later on. We have automated integration tests for some of our components (such as the assembler), and for the remainder of our components we performed some manual testing. We would have liked to fully automate our integration testing, but time constraints prevented us from doing this.

### User testing

Given that our project aimed to improve accessibility and be approachable for students, user testing was of utmost importance. Once we had the majority of our UI finished, we presented it to a non-sighted member of our faculty who had previously complained about the simulator we aimed to replace to ensure that it was usable by him.  

We also performed user testing on students. We only took students from our faculty, because our project is aimed at computing students, so finding members from other faculties wouldn't have provided any useful information for us. The feedback collected during this user testing can be found in our documentation directory.

### End-to-end

During the last week of our project, we performed a large end to end test. We set aside an afternoon to do this once we had finished the implementation of the project. We encountered a couple of small bugs when performing this test, but no major ones. We caught most of the major bugs when performing integration and unit testing.

### Continuous Integration

At the start of the project, we set up Gitlab's continuous integration system. We created a three stage pipeline. The first stage ran a linter over our code to ensure that it was sticking to the style guide that we decided to adhere to at the start of the project. The second stage attempted to build the project, to ensure that there are no type errors, etc. The final stage ran our unit test suite. If any of these stages failed, then the pipeline halted and an error was reported.  

![Continuous integration pipeline](https://i.imgur.com/cX8OJ04.png)

Having continuous integration helped us out with merge requests, because we could see without reading the code whether or not the change(s) made would break the existing code base.  

We opted to not use continuous deployment because we didn't want to "push on green", and didn't think that the time investment would pay off in the end.

## Problems

### Repetitive traversals


#### Problem
Nearly every component that makes up our assembler component performs traversals of the syntax tree. Manually implementing these inside of every component would be both repetitive because most of the code would be the exact same, and error-prone because syntax tree traversals can be quite tricky to implement.

#### Solution
We made use of the visitor design pattern to solve this problem. We created a generic interface that had the ability to visit every node of our syntax tree, and produce a value. In the case of the transformer component, the value produced would be the new node. A good example of the visitor is this code snippet:

```typescript
const byteTransformer: ast.Transformer<{}> = ast.createTransformer({
  visitAscii: (_visitor, node, _context) => new ast.Block(
    node.source,
    node.value.split('').map((c) => {
      return new ast.Byte(node.source, new ast.Character(node.source, c));
    },
  ),
});
```

This snippet demonstrates one of our transformers. This transformer turns this syntax tree:

```
asciiz "abc"
```

into this simpler one:

```
byte 'a'
byte 'b'
byte 'c'
```

### Parsing Ambiguity

#### Problem

When developing our parser, we ran into a few issues. The most notable was that we had some ambiguity with how to parse nullary and unary instructions. For example,

```asm
sti cli
```

Is this an instruction with the opcode `sti` and an operand of `cli`? or is it two instructions, neither with any operands?

#### Solution

We came up with two different ways of resolving this:

1. Provide the parser with the instruction set, so that it can know ahead of time how many arguments an instruction is supposed to have; or
2. Restrict instructions to exactly one per line.

We opted to use the second option. Writing more than one instruction on a line is an obscure use case, and implementing this would have created a notable amount of extra work on our behalf.

### Timer Interrupt

#### Problem

The timer interrupt was another area where we had to rethink our initial idea. At first, we planned to fire off an event every N seconds, and have that event set some sort of flag in the CPU which would indicate that the timer interrupt was triggered. When we started to implement this near the end of the project, we realised that our initial idea would be very messy and error-prone, so we sat down and decided to redesign it.  

#### Solution

We decided to treat the timer as if it was a regular device. Thus, we did not have to make any changes to the CPU's code in order to implement it. We also decided to base the timer on clock cycles instead of real time, which made interactions with the debugger a non-issue.  

### Continuous Integration Failures

#### Problem

Roughly three weeks before the end of the project, all of our CI pipelines started to fail. We were slightly confused at first, because we had not changed any configuration for our CI, and the tests were still passing locally. Upon further investigation we discovered that the build stage was failing because an environment variable called `CI` was set, which was causing npm to fail our build due to lint errors. 

#### Solution

We had our own linter set up with a different configuration, so we just unset the environment variable to get around the problem.  

### Code Sharing

#### Problem

We had problems with the code sharing at one point. Certain URLs would fail to be found, wheras others would be found without any problems. Upon further investigation, we realised that we had forgotten to encode the URL (e.g. replacing space with %20) before making requests to the API for our database, so certain queries would fail to execute. It took us a while to work this out, because we had recently made irrelevant changes to the backend that we thought might have lead to this issue.  

#### Solution

JavaScript (and, by extension, TypeScript) has a built-in function to encode a URL. We simply used this to encode the URL before making any HTTP requests.

### Cyclic Constants

#### Problem

We had problems with the code sharing at one point. Certain URLs would fail to be found, whereas others would be found without any problems. Upon further investigation, we realised that we had forgotten to encode the URL (e.g. replacing space with %20) before making requests to the API for our database, so certain queries would fail to execute. It took us a while to work this out, because we had recently made irrelevant changes to the backend that we thought might have lead to this issue.  

#### Solution

Constant definitions can be viewed as a directed graph, where an edge from `A` to `B` indicates that `A` is defined to be `B`. Using this view, we can perform a topological sort on the graph in order to work out which order constants should be expanded in. If the topological sort fails, then there must be a cycle in the definition of constants.

### Cowboy Documentation

#### Problem

We used the Cowboy library for Elixir as a framework for our backend. This library is actually written in Erlang, but Elixir runs on the same bytecode as Elixir, so it's possible to call the library from Elixir. We ran into a lot of problems with the documentation, because the documentation is written for people calling it from Erlang, meaning most of the examples weren't useful, and the type annotations were meaningless.  

#### Solution

To get around this problem, one of us learnt enough Erlang to read the documentation. It wasn't a particularly elegant solution, but it worked well enough for our needs.

## Deployment

This guide is made with the assumption that the site is still being hosted on `tasm.io`. Users who wish to run their own instance of tasm should edit the source code for the frontend to ensure that all references to `tasm.io` are gone.

We only designed TASM to be deployed in a UNIX environment, so we haven't provided any installation instructions for Windows server, or anything similar.

### Using docker-compose

Enter the `code` directory, and execute

```bash
docker-compose up -d
```

by default, TASM listens on port 8080.

### Manually

#### Dependencies

First, the following libraries/programs must be installed:

- Elixir
- Postgres
- npm

We are assuming that Postgres is running on the same host as the web server.

#### Get the source code

```shell
git clone https://gitlab.computing.dcu.ie/fradls2/2020-ca326-sfradl-tasm && cd 2020-ca326-sfradl-tasm
```

#### Build the frontend

```shell
( cd code/frontend/ && npm install && npm run-script build )
```

#### Copy the frontend to webroot

```shell
mkdir -p /var/www/tasm.io
cp -r code/frontend/build/** /var/www/tasm.io/
```

#### Build the backend

```shell
( cd code/backend && mix deps.get && MIX_ENV=prod mix release )
```

#### Create a user named 'tasm' in Postgres

```sql
CREATE USER 'tasm' WITH PASSWORD 'password';
```

#### Create the table in Postgres

```sql
CREATE TABLE code (
    id TEXT PRIMARY KEY NOT NULL,
    code TEXT NOT NULL,
    created_on DATE NOT NULL
);
```

#### Start the backend server

```shell
export PORT=8080
export DB_USER=user
export DB_HOST=host
DB_PASS=password mix code/frontend/_build/prod/rel/webserver/bin/webserver start
```

## Future work

If given more time, we have ideas for some potential features that we could include to make our application better. One is the ability to step backwards as well as forwards. This would be really simple to implement, it would just take some time to create & lots of time to test it to ensure that it works. We would also add a number of the features that users suggested which we are currently lacking.

As mentioned in the user evaluation document, we would also like to perform further user evaluation on a more diverse group of users. We felt that our data is very biased in favour of technically advanced users because we got them all from a society primarily dedicated to computing.

