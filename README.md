# Snail 4

[Play](https://luetkemj.github.io/snail4/)

<img width="1330" alt="Screen Shot 2020-01-11 at 6 22 08 AM" src="https://user-images.githubusercontent.com/925980/72204189-d553ae00-343a-11ea-93ca-6118fcd07103.png">

The forth iteration of snail. A roguelike built to learn how to build roguelikes.

This iteration features an [ECS](http://vasir.net/blog/game-development/how-to-build-entity-component-system-in-javascript) architecture.

[More on the previous iterations.](https://luetkemj.github.io/191117/yala)

## Tests

This project uses Jest for testing. To run tests rename file `.Xbabelrc` to `.babelrc` and run `npm run test` or `npm run test:watch`.

**Note:** Parcel2 in still in alpha and seems to have trouble building with additional babelrc files. Jest requires a babelrc to run the tests... So this is where we are for now. Don't forget to re-rename `.babelrc` to ~`.Xbabelrc` before deploy or the internet will break.

```
                          . O
                      `
          @___    `
          |____'
           \
 punt.     |

```
