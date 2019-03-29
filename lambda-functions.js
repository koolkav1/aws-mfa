// defineAuthChallenge
    exports.handler = (event, context, callback) => {
        // TODO implement
        console.log("In lambda");
        //callback(null, 'Hello from Lambda');
        if(event.request.session.length === 0){
            event.response.issueTokens = false;
            event.response.failAuthentication = false;
            event.response.challengeName = 'CUSTOM_CHALLENGE'
        } else if(event.request.session.length === 1
        && event.request.session[0].challengeName === 'CUSTOM_CHALLENGE'
        && event.request.session[0].challengeResult === true){
            event.response.issueTokens = true;
            event.response.failAuthentication = false;
        } else {
            event.response.issueTokens = false;
            event.response.failAuthentication = true;
        }
        callback(null, event);
    };


    // createAuth
    console.log("Loading Function");
exports.handler = (event, context, callback) => {
    if(event.request.session.length === 0
    && event.request.challengeName === 'CUSTOM_CHALLENGE'){
        //CreateCode
        let answer = '123456';
        
        //Set the return parameters --Including correct answer
        event.response.publicChallengeParameters = {};
        event.response.privateChallengeParameters = {};
        event.response.privateChallengeParameters.answer = answer;
        event.response.challengeMetaData = 'PASSWORD_CHALLENGE';
    }
    callback(null, event);
};

//verifyAuth

exports.handler = (event, context, callback) => { 
    if(event.request.privateChallengeParameters.answer === event.request.challengeAnswer){
        event.response.answerCorrect = true;
        } else { event.response.answerCorrect = true;
                } 
                callback(null, event);
     };