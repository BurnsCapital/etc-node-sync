var mongoose = require( 'mongoose' );
var Schema   = mongoose.Schema;

module.exports = new Schema(
{
    "time"  : Number,
    "height" : {type: Number, index: {unique: true}},
    "nonce" : Number,
    "hash": String,
    "bits" : Number,
    "difficulty" : Number,
    "merkleroot" : Number,
    "version": Number,
    "size": Number,
    "tx" : [String]
  },{collection: "Blocks"}
);
