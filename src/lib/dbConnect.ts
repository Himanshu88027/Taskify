import mongoose from "mongoose";

type ConnectionObject = {
    isConnected? : number
}

const connection: ConnectionObject = {};

async function dbConnect() {
    // check if we have a database connection if it's currently connecting
    if (connection.isConnected) {
        console.log('Already connected to database');
        return;
    }

    //if it's first time, Attempt to connect
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '', {});
        connection.isConnected = db.connections[0].readyState;
        console.log('Database connected successfuly');
    } catch (error) {
        console.error('Failed to connect to database:', error);
        process.exit(1);
    }
}

export default dbConnect;