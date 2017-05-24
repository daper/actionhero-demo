# ActionHero Demo for MallorcaJS talk

## Slides
  * [ActionHeroJS Talk](https://www.slideshare.net/DavidPeralta49/actionherojs-talk)

## What's inside?
  * A complete *sendMail* example following the framework guidelines.
    * *sendMail* action.
    * *sendMail* task.
    * *mail* initializer.
    * *mail* config.
    * Applied changes in config to be able to launch 2 AH instances. One to listen actions and the other to process tasks.
  * An AH twitter server copied and adapted from [actionhero-tutorial](https://github.com/actionhero/actionhero-tutorial)
    * *twitter* server config.
    * *twitter* server.
    * Changed the example *chat.html* to see tweets.
    * Twitter server will use the cache lock system to demonstrate how it works when it has more than one instance listening for tweets.

## How to run it?
Change first config files:
  * `config/servers/twitter.js`
  * `config/mail.js`

Then:
  * `docker-compose run --rm -e ENABLE_TCP_SERVER=1 ah npm start`
  * `docker-compose run --rm -e ACTIONHERO_ROLE=worker ah npm start`