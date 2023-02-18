import mongoose from 'mongoose';

// MAKE SURE YOU UNDERSTAND IF THIS URI POINTS TO STAGING OR PROD!
const MONGO_URI_TO_CONNECT_TO = '';

// -- write a description here on what the backfill does -- //
const executeBackfillBody = async () => {
    // -- write your code here -- //
};

const executeBackfill = async () => {
    try {
        console.log('Starting Backfill. Please Wait. 🚣🏼‍♀️');
        await mongoose.connect(MONGO_URI_TO_CONNECT_TO, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        await executeBackfillBody();
        console.log('Backfill Was Successful 🦾');
    } catch (e) {
        console.error('Backfill Failed 😥');
        console.error(e);
    }
};

// see ReadMe on how to execute your backfill through the terminal.
executeBackfill();
