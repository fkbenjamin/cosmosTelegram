'use strict'

const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController
const TextCommand = Telegram.TextCommand
const tg = new Telegram.Telegram('609369990:AAEB9i1ukiYJUwwywNMMF2znc_wqaptcyHU')
const validator = 'A19E778FF7EEA9DC643F52F331BE1A332F21A4B6'
const nodeURL = 'http://ec2-18-191-26-150.us-east-2.compute.amazonaws.com:46657/'

class PingController extends TelegramBaseController {
    /**
     * @param {Scope} $
     */
    checkVal($) {
      var request = require('request');
      request(nodeURL + '/status', function (error, response, body) {
        if (!error && response.statusCode == 200) {
        var jsonObject = JSON.parse(body);
        var lbh = jsonObject.result.sync_info.latest_block_height
        request(nodeURL + '/block?height=' + lbh, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            jsonObject = JSON.parse(body);
            var precommits = jsonObject.result.block.last_commit.precommits
            var valPC =  precommits.filter(
                (it) => {
                  if(it !== null){
                    console.log(it.validator_address === validator)
                    return it.validator_address === validator;
                  }
              }
            );
            if(valPC !== null && valPC.length === 0){
              $.sendMessage('Block Height: ' + lbh + ' Committed: ' + (valPC.length === 1))
            }
          }
      })
    }
     })
    }

    pingHandler($) {
      setInterval(this.checkVal, 2000, $)
    }




    get routes() {
        return {
            'pingCommand': 'pingHandler'
        }
    }
}

tg.router
    .when(
        new TextCommand('ping', 'pingCommand'),
        new PingController()
    )
