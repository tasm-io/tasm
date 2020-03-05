# User Evaluation

## Background

We performed some user evaluation studies towards the end of the project's lifecycle. We did this because we wanted to ensure that our target audience was satisfied with the UI and features that we had created. This was especially important for us because one of our primary goals was ensuring that our UI was accessible, allowing as diverse a group of users as possible to use it. It was also important because, as mentioned in our functional specification, we were intending to create a good alternative to the existing sms32 simulator.  

## Ethical Approval

We started our user evaluation process long before the implementation. We finished the ethical approval documentation in mid-December, and submitted it for review in mid-February. We got good feedback from the ethics board, they praised the simplicity of our plain language statement, and had a high opinion of how clear the goals of our evaluation were. Once we had ethical approval finished, we waited a few weeks before actually performing the evaluation.  

## Selecting Users

It is quite clear that the potential audience for our application is technical users. We considered trying to get some non-technical users to join in with user testing, but in the end we decided that it was best to stick to technical users. Given more time and thought, we might have been able to open up our user testing to non-technical users from other faculties.  

We asked members of Redbrick (DCU's networking society) to take part in our user evaluation study, and the respondees made up our user evaluation base. We considered trying to get members from other sources in order to give us a more diverse testing group, but time constaints unfortunately prevented us from doing this. In total, we had six people fully take part in our formal evaluation study. We also had one informal evaluation with a lecturer, which we will come to later.  

## Formal Evaluation

Our evaluation method was to walk people through the user interface for a few minutes, showing them what each of the buttons does, and what certain UI components mean. We also presented them with a document outlining the simulator's instruction set. We then asked each user to complete a simple program. The program in question was a counter program, where the user had to make the 7-segment display count from 1 to 99. We chose this task because it required the use of interrupts and virtual devices to work, and didn't require knowledge of any advanced algorithms to complete.  

After they finished this exercise, we asked some thought provoking questions in order to get as much feedback as we could out of each user. We based our questions on how they performed in the exercise, and loosely based them on our findings from the heuristic evaluation. We have decided not to share the actual questions we asked, because we fear that it might allow for individual users to be identified in some cases. We will, however, share the main points that we got from the user evaluation.  

## Informal Evaluation

One of us met with Dr. Donal Fitzpatrick for an informal meeting a week or so prior to our real user evaluations. We did this because he had some vocal criticisims of the simulator we were aiming to replace, and we thought that it would be good idea to ensure that we have tackled all of the major ones. He seemed to be quite happy with what we had produced- he just had a few small suggestions for how we could make it more usable.  

## Evaluation Results

Overall, our users were very happy with the system that we produced. There were a few minor complaints, but none of the people interviewed had any problems that would require a lot of work on our behalf to fix. Here is a summary of our findings:

- Users liked the interactivity that the simulator provides. The step-by-step debugger was really popular, and people liked that you could click `run`, let it execute a few instructions, then click `stop` and use the `step` button to slowly debug their code. They felt that this made it very easy for them to find the mistakes in their programs, and allowed them to gain a better understanding of exactly how the CPU worked.
- Users liked the inclusion of the interactive devices. One of our top priorities going in was to add something more interactive than numbers, because everybody has seen an iterative implementation of the Fibonacci sequence oh too many times. Users found the interactive devices "fun", and thought that the inclusion of interrupts made for a far more interesting and thought provoking experience.
- The instruction set caused some contention. Some users thought that our choice of instruction set led to an overly simplistic experience, and seriously restricted their ability to write anything non-trivial. Other users felt that the choice of instruction set was one of the best features because the simplicity allowed them to truly appreciate what was going on.
- Users liked the site's dark theme. We thought that some users might ask for a light theme because we don't have an option to switch to one, but no users found that to be an issue. This is one area where our heuristic evaluation contradicted with what was actually found. We think that this might be an issue caused by our choice of users, given that technical users tend to be bigger fans of dark-themed websites and applications.
- None of our users used the keybinds despite being given then. We think that this might be because users only used our application for a short period of time, and thus didn't get to a point where they try to optimise their use of it. Another explanation is maybe our very small sample size, it's possible that the six people we interviewed just don't like to use keybinds.
- Some users complained about the lack of syntax highlghting because they had gotten used to having it in their text editor of choice. This is something we predicted in the heuristic evaluation, and it would definitely be one of the features that we would aim to add if we were given more time.
- Users complemented the layout of the UI. They liked having the tabbed device view on the right hand side, and liked having buttons that control the simulator itself on the left. When we first implemented the UI, we had the buttons on the top row. We changed it after we re-implemented our entire UI on the advice of our supervisor.

## Conclusion

We are missing some features that users would like to have, but overall we achieved the goals that we were aiming for. Users really liked the application, and those that have used the one we aimed to improve on unanimously said that our one was easier to use, had more features, and looked far prettier than what they were used to.
