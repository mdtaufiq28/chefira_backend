import express from 'express';
import cors from 'cors';
import { AccessToken } from 'livekit-server-sdk';


const app=express();
const PORT=process.env.PORT || 4000;


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

    res.json({token:token.toJwt()});

});

app.listen(PORT);

