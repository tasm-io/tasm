# tasm

| Name           | Student Number |
|----------------|----------------|
| Conor McGovern |    17420262    |
|   Sean Fradl   |    17460674    |

Staff member consulted: Stephen Blott

## Description

### Overview

Our project idea is creating a web-based Assembly simulator. The instruction set and architecture will be inspired by the Intel 808{0,5}
CPUs. Users will be able to write their programs on a text editor in their browser or upload a file containing their program, then assemble,
execute, and debug their program inside a web browser. The state of registers and memory will be displayed on the UI, allowing uses to see
exactly what is happening. Users will be able to share their programs via a system similar to the [Go playground](https://play.golang.org/).

### Inspiration

We're both tutors for the existing assembly module (CA296), which uses the [sms32](http://www.softwareforeducation.com/sms32v50/) simulator.
It's a nice simulator, supporting nice features such as interrupts and memory-mapped IO. However, it's quite old (last updated in 2009), and
does have some problems, for example:

1. It only supports the Windows line of operating systems.
1. The UI doesn't conform to modern UI standards.

### Features

<!-- Apparently markdown doesn't have special syntax for definition lists ): -->
<dl>
    <dt>8-bit CPU</dt>
    <dd>
        The CPU will be loosely based on the Intel 8080 CPU. It will feature a simular
        instruction set, with some deviations to make it easier for newish programmers.
    </dd>
    <dt>Interrupts &amp; Devices</dt>
    <dd>
        The CPU will support interrupts in a similar manner to the actual 8080 processor. Interrupts
        will be used to communicate with devices and peripherals. Initially, we plan to include the
        following devices/peripherals:
        <ul>
            <li>Terminal</li>
            <li>Keyboard</li>
            <li>7-segment display</li>
        </ul>
        It will also feature a timer interrupt because it's an important part of a CPU. 
    </dd>
    <dt>Assembler directives</dt>
    <dd>
        The simulator will support a number of common directives for ease of use. We plan to include at least the following
        directives:
        <ul>
            <li>DB</li>
            <li>ORG</li>
            <li>DEFINE</li>
            <li>BREAKPOINT (undecided)</li>
        </ul>
    </dd>
    <dt>Debugger support</dt>
    <dd>
        The simulator will support breakpoints and a step-by-step debugger, allowing students to observe what their code is
        doing step-by-step.
    </dd>
    <dt>Automatic reformatting</dt>
    <dd>
        The simulator will include a formatter that pretty prints users code to a predefined style. This makes sharing far more
        useful &amp; encourages good programming practice.
    </dd>
    <dt>Code sharing</dt>
    <dd>
        Users will be able to share their programs in a similar way to the <a href="https://play.golang.org/">Go playground</a>.
    </dd>
    <dt>Modular structure</dt>
    <dd>
        It will be possible to rip out the assembler &amp; virtual CPU and have them run independently
        from everything else. This allows it to be used as a command line program, etc.
    </dd>
</dl>

### Open ideas/questions

- We encourage sharing files, git is good for sharing files, could there be a nice link between them?
- Sharing both the code and the state of the CPU could be really nice for debugging and examples, maybe include that in sharing?
- Could we integrate it with Einstein (or any automatic grading tool)? we already plan on making the non-UI bits easy to separate.
- This would probably a tonne of work, but maybe letting people write their own little devices would be nice stretch goal.

## Division of work

We will jointly be doing user requirements gathering

TODO(issue/1): Overlay over an architecture diagram.

## Programing languages

We will make use of the following programming languages:

1. [TypeScript](https://typescriptlang.org) for everything that runs on the browser, this includes the assembler & virtual machine
   (of sorts) itself, and all of the user experience elements.
2. [Elixir](https://elixir.org) for the backend. This is mostly going to be trivially serving static files, and some database glue
   to make sharing programs work.
3. [SQL(Postgres style)](https://postgresql.org/) for the database. This will form only a tiny part of the codebase.

## Programming tools

We will use the following tools/libraries:

1. [cowboy](https://github.com/ninenines/cowboy) as a web server. Erlang libraries are compatiable with Elixir because they share the
   same VM (think Java & Scala).
1. [postgrex](https://github.com/elixir-ecto/postgrex) to communicate with the database from Elixir.
1. [PostgreSQL](https://www.postgresql.org/) for storing user's shared programs (in some sort of blob format, it's easy to just resort
   to files if we have too much trouble).
1. [React](https://reactjs.org) for the user interface. React has a state model that suits our needs really well. It will probably be
   used in conjunction with [Redux](https://redux.js.org/) to further simplify state management.

## Learning challenges

Neither of us have ever used TypeScript or Elixir.

Elixir presents a somewhat unique challenge because it is functional. Both of us have done most of our work in imperative programming
languages, albeit with some functional features.

Making the simulator accessible will be a challenge. Laying it out in a way that makes it easy to use on a screen reader is hard, and
it has to be intuitive for students.

## Hardware / software platform

The machine hosting the web server &amp; the database will be running Linux (distribution undecided).

The simulator itself will run on any modern web browser, the underlying operating system is irrelevant.

## Special hardware / software requirements

None.
