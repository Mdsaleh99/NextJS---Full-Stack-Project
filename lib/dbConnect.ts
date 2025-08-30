import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number;
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void> { // return type is Promise<void>, in typescript void means any kind of data, but in other languages it means no return value 
    if (connection.isConnected) {
        console.log("Already connected to database");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '', {})
        
        console.log("\n\n", "DB: ", db, "\n\n");
        console.log("********************************************************************");
        console.log("DB connection: ", db.connections, "\n\n");
        console.log("\n\n", "DB connection readyState: ", db.connections[0].readyState, "\n\n");
        console.log("\n\n", "connection ", connection, "\n\n");

        connection.isConnected = db.connections[0].readyState
        console.log("DB connected Successfully");
        
    } catch (error) {
        console.log("Database connection failed", error)
        process.exit(1)
    }
}

export default dbConnect