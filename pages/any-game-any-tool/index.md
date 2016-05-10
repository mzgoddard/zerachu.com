I guess it has been a while now but many years ago I use to be a game developer snob when it came to tools. Namely I thought GameMaker was a joke and that no one should ever use it. That was mostly me during college. A good time to be arrogant about things that don't really matter.

I learned a lot in school. I also have learned a lot since then.

A lot of the things I've seen post-college that quickly altered my view were the results of work from friends and peers with different backgrounds than mine. The people I knew in college really didn't lead me to questioning the beliefs I had formed about a black and white perspective of what to use and what not to use when making games.

Three games that really finished tearing down that wall of some tools being a good choice and some tools being a bad choice for making games with were [Spelunky], [Gunpoint] and [BariBariBall]. Of note they are both games at least originally developed in GameMaker and they're really fun. I haven't actually played Gunpoint but it looks like a lot of fun and has a level of polish I couldn't, before seeing it, imagine of a GameMaker game.

It was around then that I started to think something along the lines of the first part of this page's title. Any Game can be made by Any Tool.

Retiring my view that GameMaker was a Bad tool also let this new view grow. Instead of my old perspective being replaced with a new, better, but still shallow concept it grew deeper and nuanced over time. The second part showed up Every Tool cannot make Every Game.

Games are the most complicated pieces of art people create now. The number of types of expertise that can go into a game can be incredible to think about. The amount of information to consider to build a game, how, and with who and what can mean taking time to pick out tools and peers to help with it. I'm not saying think about using [GameMaker] or [Unity] or [Unreal] or [Superpowers] or [Phaser] or [Rube]. I'm saying you'll make a choice and the tool standing alone of the details of your game is a fine choice.

It's hard to look at a design doc, whatever shape it may be, and say yes we can build this game with our chosen tools. Thats ok. You and the people you've collected, or maybe its just you thats cool too, have made your choice and thats great. Now make the game.

One of the challenges and stresses of game development is encountering problems with your design in the context of whatever tool you've ended up picking. It's just really hard to do what you want because of some fault or feature of some part of your development stack. Game developers, be they new, hobbyist, professionally experienced, or godly have been known to make overzealous game designs. Hitting this road block normally means change through writing a software system to do what you want or changing the design to fit the context of existing tools. Again, both choices are fine. Though I think the latter tends to be more rewarding to the developers and players. And the players probably will never know or care.

During an early point in Unity's life bringing support to early iPhones, I worked on a small game called Nyx. It was a 2D terrain deforming game with a few hundred possible locations for land tiles. The early implementation had each tile be a GameObject. Testing on iPhone we found we were drawing too many objects. A later version of Unity would implement a general solution of what we did, Batching. To support iPhone we built a Batching Mesh Generation system to collapse our possible few hundred land tiles into one GameObject with a corresponding mesh. This worked great but without the more general system Unity added later we didn't want to create too much technical complexity using our simpler Batching. So we had to restrict the number of types of tiles. Ultimately that limit on type of tiles likely helped us focus our types terrain and level design.

Platforms have technical constraints. They can draw only so many things or have a maximum amount of memory and framework or engine choice may add their own constraints. Those limits on a platform or engine don't define what can be made for them in high level gameplay concepts, but they may set how much in the design can be done at once. Once you're already building the game, unless its really early, its hard to change tech so the design will change.

This doesn't explain how to pick a tool to use for a specific game. But learning to make games, or games for a new platform, or games in a new genre isn't going to eliminate a tool because you can't use it seriously. You can use any tool seriously. There isn't a reason to always exclude a tool. One person may not choose it but it doesn't mean no one should choose it. There isn't such a thing as a bad tool.

[Spelunky]: http://store.steampowered.com/app/239350/
[Gunpoint]: http://store.steampowered.com/app/206190/
[BariBariBall]: http://barabariball.com/
[GameMaker]: http://www.yoyogames.com/gamemaker
[Unity]: https://unity3d.com/
[Unreal]: https://www.unrealengine.com/what-is-unreal-engine-4
[Superpowers]: http://superpowers-html5.com/
[Phaser]: http://phaser.io/
[Rube]: https://www.iforce2d.net/rube/
