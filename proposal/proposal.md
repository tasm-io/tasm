# tasm

| Name           | Student Number |
|----------------|----------------|
| Conor McGovern |    17420262    |
|   Sean Fradl   |    17460674    |

## Description

TODO(issue/1): Define what the project actually is in 2-3 sentences.

### Inspiration

TODO(issue/1): Talk a bit about why we picked it: tutors; UI not great; works on one OS; etc.

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
            <li>DB (draw byte?)</li>
            <li>ORG (organise?)</li>
            <li>DEFINE</li>
            <li>BREAKPOINT</li>
        </ul>
    </dd>
    <dt>Debugger support</dt>
    <dd>
        The simulator will support breakpoints and a step-by-step debugger, allowing students to observe what their code is doing step-by-step.
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

### Architecture diagram

TODO(issue/1): Create the architecture diagram

### Open ideas/questions

- We encourage sharing files, git is good for sharing files, could there be a nice link between them?
- Sharing both the code and the state of the CPU could be really nice for debugging and examples, maybe include that in sharing?
- Could we integrate it with Einstein (or any automatic grading tool)? we already plan on making the non-UI bits easy to separate.
- This would probably a tonne of work, but maybe letting people write their own little devices would be nice stretch goal.

## Division of work

TODO(issue/1): Overlay over architecture diagram

## Programing languages

We will make use of the following programming languages:

1. [TypeScript](https://typescriptlang.org) for everything that runs on the browser, this includes the assembler & virtual machine (of sorts) itself, and all of the user experience elements.
2. [Elixir](https://elixir.org) for the backend. This is mostly going to be trivially serving static files, and some database glue to make sharing programs work.

## Programming tools

We will use the following tools/libraries:

1. [cowboy](https://github.com/ninenines/cowboy) as a web server. Erlang libraries are compatiable with Elixir because they share the same VM (think Java & Scala).
1. [PostgreSQL](https://www.postgresql.org/) for storing user's shared programs (in some sort of blob format, it's easy to just resort to files if we have too much trouble).
1. [React](https://reactjs.org) for the user interface. React has a state model that suits our needs really well. It will probably be used in conjunction with [Redux](https://redux.js.org/) to further simplify state management.

## Learning challenges

Neither of us have ever used TypeScript or Elixir.

Elixir presents a somewhat unique challenge because it is functional. Both of us have done most of our work in imperative programming languages, albeit with some functional features.

Making the simulator accessible will be a challenge, laying it out in a way that makes it easy to use on a screen reader is hard.

## Hardware / software platform

The simulator will run on any web browser.

## Special hardware / software requirements

None.
