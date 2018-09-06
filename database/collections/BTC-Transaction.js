var mongoose = require( 'mongoose' );
var Schema   = mongoose.Schema;

module.exports = new Schema(
{
    "in_active_chain" : Boolean,
    "hex"      : String,
    "txid"     :  {type: String, index: {unique: true}},
    "hash"     : String,
    "size"     : Number,
    "vsize"    : Number,
    "version"  : Number,
    "locktime" : Number,
    "vin"      : [{
        "txid" : String,
        "vout" : Number,
        "scriptSig" : {
            "asm"   : String,
            "hex"   : String
        },
        "sequence" : Number,
        "txinwitness" : [String]
      }],
      "vout" :[{
        "value" : Number,
        "n" : Number,
        "scriptPubKey" :{
          "asm" : String,
          "hex" : String,
          "reqSigs": Number,
          "type" : String,
          "address": [String]
        }
      }],
      "blockhash" : Number,
      "confirmations" : Number,
      "time" : Number,
      "blocktime" : Number
    }, {collection: "Transaction"});
