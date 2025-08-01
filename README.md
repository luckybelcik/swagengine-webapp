## What is it?
REDBUD was created to separate the registration process from the engine itself, while also speeding up the process of creating new elements, like entities, items, etc.

## Why?
I decided to make it that way, because I hate defining game elements in code. Also, this approach allows for hot-reloading of the game elements WITHOUT recompiling! (Which is very good. Rust is amazing, but it takes some time to compile)

The best thing? This is all zero-cost. Or well, it makes the game launch a little slower, but it is negligible. The advantages far outweigh the disadvantages.

## How does it work?
Most game objects are composed of a .json and a .rs file, which are generated by the webapp. The .json file serves as the static data storage, like the maxHP, components that the element uses, etc. The .rs file is the actual code that is executed when the game runs. The code attaches itself to hooks like OnHit, OnSpawn, OnTick, you get the idea.

## Additional details
To improve launch performance, the .json files are converted to .bson files as a sort of caching. If the corresponding .json files change at all, the .bson files are updated automatically on launch. That way, we don't sacrifice performance for human-redability.

## Where should I start?
To begin using the webapp, create a new project and add some elements! I did my best to make it as intuitive as I could, but if you have any questions, I left some examples on github. There is also a tutorial explaining how to use the webapp.
