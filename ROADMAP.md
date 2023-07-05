# The Buzz.js Road map
I'm not going to describe Buzz.js again because the documentation for it not only exists inside the [README](./README.md) but also 
exists inside the package manager more extensively. The Buzz.js roadmap is split into 3 phases.

-	In the first phase, the base SDK is made. When I say base SDK here, I mean the fundamental Widgets that everything else is built
on top of. Even the other, more specified, widgets in the framework like the PageViews that are supposed to be the topmost Widgets in
the every Page in the WebApp — a System Navigable widget class. 

- 	In the second phase, the package manager is made for my host operating system, Linux, first using Flutter. It is a weird choice,
acceptably, because, why should a package manager be written with a GUI? It kinda seems either overkill or unnecessary, right? But
there are good reasons, for that much at least, I assure you. I plan to extend the package manager in the future to support things like
its own usable code editor dedicated to Buzz.js apps, a drag and drop style editor, and so on. Just because, why not? In the first
version of the package manager, the only affairs that would be supported would be publishing packages, managing your packages, building
your apps for the web, viewing your code in an editor that does nothing but highlight syntax, and update files. It would probably do
a lot more things but I would keep stuff simple in this documentation because this paragraph has run for too long. :joy:

-	In the third phase, the extension Widgets would be made. Extension widgets here means things like DashboardPageView, MobilePageView,
DesktopPageView, ResponsivePageView, and so on. Basically, things that are useful for Web Apps that I want to optimize as much as 
possible for the framework but not actually add to the base SDK. These things would however obviously be in the base SDK but I say not
adding here because, well, they come as an afterthought. Also, at the third phase, I would work on abstracting things involving hardware
like cameras, geolocation, microphones, and so on. Exhales, what a long way to go. 

# Phase 1 Goals :soccer::trophy:
Date Started:	May 11, 2023 <br>
Date Concluded:	
01. ~~Create the application abstraction~~
02. ~~Create the global context management system~~
03. ~~Create the base Widget class and define its characteristics~~
04. ~~Create the StatelessWidget class and define its characteristics~~
05. ~~Create the StatefulWidget class and define its characteristics~~
06. ~~Implement state management using an on-demand approach~~
07. ~~Implement a Renderer to allow users to render views inside a viewport anything they feel a need to~~
08. ~~Implement Global Application Themes~~
09. ~~Create helper functions that make the process of using the SDK more bearable~~
10. ~~Create an abstraction for a HTML viewport that only serves to know the current size of a Widget~~
11. ~~Create the base WidgetStyle class for styling widgets~~
12. ~~Create the classes that handle radial and linear space. InsetsGeometry and RadialGeometry~~
13. ~~Create the base class for Container-type Widgets~~
14. ~~Properly define the application Running System~~
15. ~~Create abstractions for borders and border radius~~
16. ~~Create helper functions to apply borders and border radius~~
17. ~~Implement Text Widgets~~
18. ~~Implement Text Overflows that include ellipsis~~
29. ~~Implement the ImageView and SvgImageView widgets for displaying images.~~
20. Implement the VideoView widget for displaying videos (this would be rather difficult to do desirably).
21. ~~Implement the SizedBox widget for constraining the Size of its child~~
22. ~~Implement the ScrollableContainer widget to allow us to make scrollable screens.~~
23. Implement TextInput Widget for different design languages, including MAD (Mile-Age Design language) that Buzz uses straight out of the box.
24. Implement IconButton Widget
25. ~~Implement TextButton Widget~~
26. Implement ProgressIndicator, CircularProgressIndicator, and LinearProgressIndicator widgets.
27. Implement ProgressButton Widget
28. ~~Implement an abstraction that makes it easy to write CSS-dimensions in Buzz.js~~
29. ~~Implement ActionController widget to add input functionality to otherwise uneventful Widgets~~
30. ~~Implement the Router, NavigationController, and NavigationAnchor classes so we would be able to switch the context of the page~~
31. ~~Implement the ColoredBox so that it would be possible to create boxes that just have concept of color~~
32. Implement animations and animation controllers to make everything more lively.
33. ~~Implement the flexbox widgets Flex, Column, Row, Wrap, and Flexible.~~
34. ~~Implement the Free font awesome icons~~
35. ~~Implement the Icon widget.~~
36. ~~Implement Icon Animation~~
37. Implement the PageView Widget

# Phase 2 Goals :soccer::trophy:


# Phase 3 Goals :soccer::trophy:
