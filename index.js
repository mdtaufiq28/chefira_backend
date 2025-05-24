import express from 'express';
import cors from 'cors';
import { AccessToken } from 'livekit-server-sdk';


const app=express();
const PORT=process.env.PORT || 4000;

console.log("Welcome to Server of Chefira");

app.use(cors());
app.use(express.json());

app.post("/token",(req,res)=>{

    const {identity,role}=req.body;
    
    if(!identity){
        return res.status(400).json({error:"identity is required"});
    }

    const token=new AccessToken(
        process.env.LIVEKIT_API_KEY,
        process.env.LIVEKIT_API_SECRET,
        {identity}
    )

    token.addGrant({
        roomJoin:true,
        room:"chef-room",
        canPublish:role==="chef",
        canSubscribe:true
    });

    console.log(token);

    const jwt=token.toJwt();

    console.log("jwt is " ,jwt);

    res.json({token:jwt});

});

app.listen(PORT,()=>{
    console.log('Server is running on port ',PORT);
});

