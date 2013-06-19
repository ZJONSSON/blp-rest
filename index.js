// blp-rest (c) 2013 Sigurgeir Orn Jonsson (ziggy.jonsson.nyc@gmail.com) 
// Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported (CC BY-NC-SA 3.0)
// http://creativecommons.org/licenses/by-nc-sa/3.0/
// Full Licence: http://creativecommons.org/licenses/by-nc-sa/3.0/legalcode

var blpapi = require('blpapi'),
    clues = require("clues");

// Counter to ensure we are processing right response to each query
var reqID = 100,
    serviceID = 100;

var options = {
  serverHost: '127.0.0.1',
  serverPort: 8194
};

// Returns a promise on a new session
function getSession(options) {
  var p = clues.prototype.adapter.pending(),
      s = new blpapi.Session(options);

  function listener() {
    s.removeListener('SessionStarted',listener);
    p.fulfill(s);
  }

  s.on('SessionStarted',listener);
  s.start();

  return p.promise;
}


// Returns a promise when refData has been initialized
function getRefdata(session) {
  var p = clues.prototype.adapter.pending();
  serviceID +=1;
  session.openService('//blp/refdata', serviceID);

  function listener(m) {
    if (m.correlations[0].value != serviceID) return;
    session.removeListener('ServiceOpened',listener);
    p.fulfill(session);
  }

  session.on('ServiceOpened',listener);
  return p.promise;
}


// Simple API that uses clues.js to solve for the results
api = {};

// This value will be static promise on the session object
// after refdata has been initialized

api.session_refdata = getSession(options).then(getRefdata);

// Generates proper input object from ticker(s) and field(s)
api.inputs = function(ticker,field) {
  if (ticker.split) ticker = ticker.split(",");
  if (field.split) field = field.split(",");
  return {securities:ticker,fields:field};
};

// By default we are not requesting full results (if we can narrow them down)
api.get_full_result = false;

// This is the key request function.  Inputs can either be defined directly
// or automatically solved from ticker and field

api.refdata = function(session_refdata,inputs,get_full_result,resolve,error) {
  var res = [];
  reqID+=1;
  // If inputs were provided directly, we need to parse and check for missing properties
  if (typeof inputs === 'string') {
    inputs = JSON.parse(inputs);
    console.log(inputs,inputs.securities)
    if (!inputs.securities || !inputs.securities.length) return error("Must specify securities as an array");
    if (!inputs.fields || !inputs.fields.length) return error("Must specify fields as an array");
  }

  function listener(d) {
    // If this is an answer to a different reqID we move on
    if (d.correlations[0].value != reqID) return;
    // Cache the response in the res object
    res.push(d.data.securityData[0]);
    // Final message will be labeled 'RESPONSE'
    if (d.eventType != 'RESPONSE') return;
    session_refdata.removeListener('ReferenceDataResponse',listener);
    // Check for error in the message
    if (res[0].securityError) return error(res[0].securityError.message);
    if (res.length > 1 || get_full_result) return resolve(res);
    res = res[0].fieldData;
    if (inputs.fields.length > 1) return resolve(res);
    res = res[inputs.fields[0]];
    if (!res) return error("Field not found");
    return resolve(res);
  }

  session_refdata.request('//blp/refdata', 'ReferenceDataRequest',inputs,reqID);
  session_refdata.on('ReferenceDataResponse',listener);
};

// The export function returns a promise on the results
module.exports = function(fn,args) {
  return clues(api,args)
    .solve(fn);
};
