# Functional Specification - TASM

**System Title**: TASM (Typescript Assembly Simulator)

| Name           | Student Number |
|----------------|----------------|
| Conor McGovern |    17420262    |
| Sean Fradl     |    17460674    |

**Supervisor**: Stephen Blott

---
## Table of Contents 

0. **Table of contents**
1. **Introduction**
    1.1 Purpose
    1.2 Scope
    1.3 Glossary
2. **General Description**
    2.1 Product / System Functions
    2.2 User Characteristics and Objectives
    2.3 Operating Environment
    2.4 Constraints
3. **Functional Requirements**
    3.1 Fetch the SPA
    3.2 Upload a file
    3.3 Assemble Code to Bytecode
    3.4 Execute Bytecode on the Virtual CPU	
    3.5 View Simulator State
    3.6 Debug Program
    3.7 Edit Text through the Medium of a Text Editor
    3.8 Interact with Virtual Devices
    3.9 Format Text Automatically
    3.10 Share Code
4. **System Architecture**
    4.1 Backend
    4.2 Frontend
6. **High-Level Design**
7. **Preliminary Schedule**
8. **Appendices**
    7.1 Programming Languages & Tools Referenced
    7.2 Diagrams

---

## 1. Introduction

### 1.1 Purpose

Tasm shall be a web-based that allows users to write code for a simulated 8-bit microprocessor in a safe, contained environment. Tasm is intended to be a successor to pre-existing simulators such as the sms32 simulator. Sms32 lacks some basic functionality that is expected of modern applications, such as an accessible user interface, and cross-platform support. Tasm aims to resolve these issues. Users shall be able to write their code in their web browser, execute their programs, debug their programs with the help of a debugger, and share their programs with other users via a shared URL.

### 1.2 Scope

This system is being developed independent of any business or organisation. The application could be deployed in educational institutions alongside assembly programming modules. The application could be used in conjunction with an automatic grading system due to the planned structure of this application.

### 1.3 Glossary

SPA - *Single Page Application.*
TASM Program - *A program written using the TASM instruction set for this simulator.* 
Cowboy - *A small, fast, modern HTTP server that runs on the ErlangVM.*
Nginx - *A high performance load balancer, web server, and reverse proxy.*
Elixir - *A modern functional programming language.*
React - *A JavaScript library for building user interfaces.*
Redux - *An open-source JavaScript library for managing application state.*
Postgres - *A free and open-source relational database management system emphasizing extensibility and technical standards compliance.*
NodeJS - *Node.js is an open-source, cross-platform, JavaScript runtime environment that executes JavaScript code outside of a browser.*
ESLint - *ESLint is a static code analysis tool for identifying problematic patterns found in JavaScript code.*

---

## 2. General Description

### 2.1 Product / System Functions

Firstly, the user will have to visit a site where Tasm is deployed through a modern web browser. When on the site they will have the full functionality of the product as it runs as a SPA within the users browser. The site will be served using Cowboy and Nginx by default. 

#### Writing & Uploading Code

When on the site, users will be able to write Tasm code in a text editor. This text editor includes some basic syntax highlighting for Tasm code. Alternatively users can upload a file if they wish to write their code locally. 

#### 8-bit CPU Emulation
The system shall emulate an 8-bit CPU such as the Intel 808{0,5} microprocessors. It shall mimick the majority of the instruction set provided by these processors, but deviations from the instruction set are acceptable if it simplifies the interface for users.

#### Debugging & Running Programs

Users can use the debugger features to run and step through their code. They can add breakpoints within their code and run programs until a breakpoint is hit. While using the debugger or running a program fully through, users will be able to view the current state of the registers and the memory. 

#### Virtual Devices

Users may also interact with virtual devices to make different programs. Virtual devices can be interacted with through interrupts and the AL register. Examples virtual devices include a virtual keyboard, keypad, terminal screen and seven-segment display. 

#### Share Functionality

When Users are happy with their code, they may save the code to a local file on their machine or alternatively share the code. By sharing the code, the code is sent through a web server to a database. The web server then returns a URL which the user can share and visit later to retrieve the same code.

#### Automatic Formatting 

Users shall be able to automatically format the code to a standard style. As all users have slight differences in the style of their code this will make code easier to view for others. This is useful for students who share code or teachers that may correct the code. 

### 2.2 User Characteristics and Objectives

We expect our main users to be in the age range of 18 - 30 and interested in software engineering or pursuing a degree or career involving assembly level programming. Additionally we expect educational staff that are teaching assembly level programming concepts to program and share Tasm programs. 
Our main objective for the user experience is to make the user not have to think about how they have to interact with the user interface. We plan on doing this by giving the user interface a sense of rhythm and habit through following standard user interface design practices. Additionally we plan on making the website accessible for visually impaired and color blind users.


### 2.3 Operating Environment 

The operation of the application for a user shall be conducted on a modern web browser. Any modern web browser on any operating system shall be able to download and run the application. 

The backend shall run on a GNU + Linux box. 

While the overall logic of the system lives in the frontend we aim to design the system in a way in such that it shall support removing the UI. This shall allow the integration of the logic of the simulator into third party applications. A great use case of this would be to allow students to run and test programs in TASM and then submit them to a NodeJS server for automatic testing and grading. 

### 2.4 Constraints

#### 2.4.1 Time 

We are limited to 9 weeks of development time. Therefore, we must strictly adhere to our proposed timeline. We shall do this by utilising the Agile methodology, which entails weekly sprints, and regular standups. This is further expanded upon in 7.0 - Preliminary Schedule.

#### 2.4.2 Network & Speed

We are adding constraints on the finished application in terms of network and speed. The application should be able to be downloaded in less than 2 seconds on the DCU network. The assembler should be able to assemble any program within 2 seconds of hitting the assemble button. Any visual transitions such as the memory display area should run smoothly without affecting the overall performance of the application.

#### 2.4.3 Accessibility 

As we aim to make this application accessible to those with disabilities we are limited to a subset of features within HTML. This is due to some HTML attributes not supporting good web accessibility practices.  

#### 2.4.4 Web Technology 

The TASM development and design team are limited to the constraints of present day web technologies. This shall limit the scope of our design.

#### 2.4.5 Code Linting 

In order to stay aligned with best industry practices, we plan on using a linter to ensure the quality of our code remains at a high level. 
We plan on using ESLint to perform code linting for TypeScript that shall be integrated with our continious integration in GitLab. Code that doesn't meet the standards imposed by ESLint shall be automatically rejectd in the main branch.  

---

## 3. Functional Requirements

### 3.1 Fetch the SPA

#### Description

Users shall be able to fetch the single-page application through a memorable URL.

#### Criticality 

This requirement is a critical part of the application. It is a prerequisite for all other requirements. It is paramount that the URL is memorable, because this is how users will open the application.

#### Technical issues

The Cowboy web server is written in Erlang. Elixir also runs on the Erlang VM, so Erlang functions can be called from Elixir. This is a challenge though, because the documentation for it is all written with the intention of it being called from Erlang.

#### Inter-requirement Dependencies

None

### 3.2 Upload a file

#### Description 

Users shall be able to upload a file containing tasm code to the application through an upload section on the user interface. This code shall then be displayed in the text display area. The uploaded code shall be usable by 

#### Criticality

We consider this of high importance as without code to assemble and run all other requirements.

#### Technical issues

None

#### Inter-requirement Dependencies 

3.1 - By this point, the application should have already been served to the user.

### 3.3 Assemble Code to Bytecode

#### Description 

The user shall be able to assemble their TASM assembly language code into bytecode. There shall be a button on the user interface that allows them to perform this action.

#### Criticality

This is a critical part of the application. Without an assembler, requirements such as the virtual CPU (requirement 3.3) will be impossible to fulfill.

#### Technical issues

Writing an Assembler is likely going to be the most challenging part of the system. We have to ensure that we assemble any combination of instructions down to the correct bytecode, and that the assembler gracefully handles both semantic and syntax errors. We must also ensure that the assembler is extensible, so it's easy to add new features if the need arises.

#### Inter-requirement Dependencies
3.1 - By this point, the application should have already been served to the user. 
3.2 - Code should be available for the assembler to assemble.

### 3.4 Execute Bytecode on the Virtual CPU

#### Description 

The virtual CPU is tasked with taking instructions (bytecode) from the assembler and running the instructions. The virtual CPU contains the state of the registers and returns the difference after the action is performed to the simulator to display on the user interface. 

#### Criticality

This is critical as without this the core of the software application cannot perform.

#### Technical issues

Writing the virtual CPU is tied with the assembler for the most complicated part of the system. We must interpret the bytes in memory correctly, which will likely lead to some hard to track bugs.

#### Inter-requirement Dependencies 
3.1 - By this point, the application should have already been served to the user. 
3.3 - Without the virtual assembler, the virtual CPU cannot receive any instructions.

### 3.5 View Simulator State

#### Description
Users should be able to view the state of the registers and state of the memory in a clear and accessible manner.

#### Criticality
This is of high importance as the end state of a register or position in memory will reflect the output of the program. 

#### Technical issues
3.1 - By this point, the application should have already been served to the user. 
3.3 - Without the virtual CPU no instructions can processed and no state can be sent to the simulator.

### 3.6 Debug Program

#### Description 

The simulator shall feature a debug mode that allows users to execute their code in steps of a single instruction. This functionality shall be provided by a section on the user interface. There debugger UI shall be able to force the CPU to execute exactly one instruction. The CPU shall not execute another instruction until the operation is invoked again.

#### Criticality

This is of high importance, but it is not critical. The application will be able to function without the presence of a debugger.
Technical issues
Debug mode does not interact well with the interrupt feature. It will be a technical challenge to make them function side-by-side.

#### Inter-requirement Dependencies 

3.1 - By this point, the application should have already been served to the user. 
3.3, 3.4 -Without the virtual CPU the debugger has nothing to debug and interact with.

### 3.7 Edit Text through the Medium of a Text Editor

#### Description 

Users shall be able to write their Tasm programs in a web based text editor. This allows users to easily see the structure of the code through keyword highlighting and quickly switch between writing and running programs. If a user has uploaded a program it should by default be displayed and editable in the text editor. 

#### Criticality

We consider this of medium importance as this will reduce the overall time needed to write programs.

#### Technical issues

We are still seeking external libraries to aid in the development of a text editor. We do not plan on making a text editor from scratch as that could be a system in itself. 

#### Inter-requirement Dependencies 

3.1 - By this point, the application should have already been served to the user. 

### 3.8 Interact with Virtual Devices

#### Description 

Users shall be able to interact with a set of virtual devices provided by the simulator. These devices shall simulate real-world devices such as a seven-segment display, and a text terminal display.

#### Criticality

This is of medium importance. While virtual devices adds more possibilities for users to design creative programs, it doesn’t aid the overall objective of providing users an interface to aid their understanding of assembly programming.

#### Technical issues

Providing a common interface for devices to interact with the virtual CPU and having them contain their own state is challenging and has not yet been decided. We also hope to allow further developers to create their own devices and hence a common API is necessary.

#### Inter-requirement Dependencies 

3.1 - By this point, the application should have already been served to the user. 
3.2 -Without the virtual CPU virtual devices cannot exist.

### 3.9 Format Text Automatically 

#### Description 

The goal of the text formatter shall be to style the text in a way such that it is easily readable for the end user. Since all users have different code writing styles a general formatter can be of great use when sharing or displaying code to others. Users shall be able to hit a button near the code display area to automatically format the text of the program. 

#### Criticality

This is of low importance. It does not affect the end users overall ability to write and run programs and is purely a quality of life feature.

#### Technical issues

We must ensure that the abstract syntax tree has sufficient information to enable us to re-construct the program in the official style.

#### Inter-requirement Dependencies 

3.1 - By this point, the application should have already been served to the user. 
One of the following: 
3.2  - The uploaded file can be sent to the server.
3.7  - Code within text editor to send to the server.

### 3.10 Share Code

#### Description

Users shall be able to share their code by sending the current state of the text editor to the web server. Users shall be able to do this through an interaction with a button on the user interface. Users shall retrieve a URL from the web server which can be copied and sent to others for others to view their code. When other users visit the URL, the application shall contain the shared code in the text editor.

#### Criticality

This is of low importance. It does not affect the end users overall ability to write and run programs.

#### Technical issues

We have to ensure that a user cannot exhaust all of the servers's storage capacity by uploading a huge number of programs with malicious intent.

#### Inter-requirement Dependencies 

3.1 - By this point, the application should have already been served to the user. 
3.5 - Text Editor

--- 

## 4. System Architecture

The overall system shall be broken down into two parts, the frontend and the backend. 

### 4.1 Backend 

The backend shall be a GNU/Linux box running a postgres database, a webserver in Elixir using Cowboy and Nginx acting as a reverse proxy. The main function of the database is to store shared TASM programs. The webserver shall be in charge of serving the main web application and interacting with the database.


###  4.2 Frontend

The frontend shall be served over HTTPS by the backend. The frontend shall contain a user interface implemented with React and Redux.

Stateful react UI components will obtain their state from Redux and components shall send actions to Redux which will perform actions on the simulator. 

Redux will act as middleware and a centralized store between React, the backend and the simulator.

The simulator shall be divided in three parts. The virtual CPU, assembler and virtual devices. 
Methods shall be performed on the simulator by Redux actions that have been received from the UI. This can be clearly seen in 7.2.2. 
The virtual CPU, assembler, and virtual devices shall have their own state and not be contained within the centralized store of Redux. 
This is to provide the ability to remove the simulator from the UI designed with this system. This shall allow integration with third party systems such as automatic grading systems. 

*The overall system architecture as described above can be seen below.*

![System Architecture of TASM](https://i.imgur.com/58UK3SG.png)


---

## 5. High Level Design 

![](https://i.imgur.com/nrdPSuB.png)

The assembler takes in the user's source code, and performs either of the following operations:
- Successfully assembles it to bytecode, and returns it to the simulator
- Encounters semantic or syntax error(s), and reports them to the simulator

The CPU state contains all the information needed by the CPU to perform operations. In more detail, it contains the following data:
- Register states
- Memory states
- Device states

The data contained in individual device states is intentionally not specified, because the CPU will treat them as abstract entities.


---

## 6. Preliminary Schedule

An overview of our preliminary schedule can be seen in the **PERT chart in 7.2.4** which highlights the aimed major milestones and how long we believe it shall take for the aimed tasks to be completed. We have set out a period of nine weeks from 9th December to March 8th with a break to maintain periods for studying for semester 1 exams. This gives us sixty-three days to complete the system, we have assigned fifty-eight of these which gives us a remainder of five for unforeseen events and days to refactor code. We plan to do weekly sprints to ensure we meet our aims and objectives of the application. The dates of these sprints are highlighted below. We plan on recording our progress through active informal blog posts. These blog posts will be available at blog.tasm.io.

| Week Number    | Week Start     | Week End       |
|----------------|----------------|----------------|
|       01       |    06/12/2019  |    03/12/2019  |
|       02       |    14/12/2019  |    20/12/2019  |
|       03       |    18/01/2020  |    24/01/2020  |
|       04       |    25/01/2020  |    31/01/1999  |
|       05       |    03/02/2020  |    09/02/2020  |
|       06       |    10/02/2020  |    16/02/2020  |
|       07       |    17/02/2020  |    23/02/2020  |
|       08       |    24/02/2020  |    01/03/2020  |
|       09       |    02/03/2020  |    08/03/2020  |


---

## 7. Appendices

### 7.1 Programming Languages & Tools Referenced

ReactJS - reactjs.org
TypeScript - typescriptlang.org
Elixir - elixir-lang.org
Nginx - nginx.org
Redux - reduxjs.org

---

### 7.2 Diagrams

#### 7.2.1 - Sequence diagram for simulator 

![Simulator Data Flow](https://i.imgur.com/GBZAuLE.png)

---

#### 7.2.2 - Typical user action flow

![User Action Flow](https://i.imgur.com/wbuJSar.png)

---

#### 7.2.3 - PERT Diagram

![Pert Diagram](https://i.imgur.com/GFnVgGd.png)

---
